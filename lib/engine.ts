/**
 * MERIDIAN Layer 1 + Layer 2 — deterministic capital budgeting engine.
 * Ported from maf_engine.py; validated against Python golden values in tests/engine.test.ts.
 * All figures AED, nominal. No LLM involvement of any kind.
 */

export interface Params {
  tariff: number;      // AED/kWh effective marginal
  esc: number;         // tariff escalation, nominal /yr
  retA: number;        // landlord retention share, Option A
  capexA: number;      // AED per Wp
  yield_: number;      // kWh/kWp/yr, year 1
  retB: number;        // landlord retention share, Option B
  eff: number;         // chiller efficiency gain, share of total load
  wacc: number;
}

export const FIXED = {
  tax: 0.09,
  kdAT: 0.04,
  omEsc: 0.02,
  A: { cap: 5000, deg: 0.005, omKwp: 25, opp: 1e5, salv: 0.05, life: 25, invFrac: 0.08, invYr: 12, wc: 0 },
  B: { gwh: 100, capex: 48e6, om: 3e5, salv: 0.02, life: 12, wc: 5e5 },
} as const;

export const BASE: Params = {
  tariff: 0.44, esc: 0.01, retA: 0.5, capexA: 1.8, yield_: 1650, retB: 0.35, eff: 0.2, wacc: 0.084,
};

export interface YearRow {
  t: number; gross: number; retained: number; om: number; dep: number; ebit: number; ocf: number; fcf: number;
}
export interface OptionBuild {
  fcf: number[]; rows: YearRow[]; capex: number; salvage: number; inverter?: number;
  outlay: number; wc: number; life: number;
}

export function buildA(p: Params): OptionBuild {
  const F = FIXED.A;
  const capex = F.cap * 1000 * p.capexA;
  const salvage = capex * F.salv;
  const inverter = capex * F.invFrac;
  const depMain = (capex - salvage) / F.life;
  const depInv = inverter / (F.life - F.invYr);
  const fcf: number[] = [-(capex + F.wc)];
  const rows: YearRow[] = [];
  for (let t = 1; t <= F.life; t++) {
    const energy = F.cap * p.yield_ * Math.pow(1 - F.deg, t - 1);
    const tariffT = p.tariff * Math.pow(1 + p.esc, t - 1);
    const gross = energy * tariffT;
    const retained = gross * p.retA;
    const om = (F.omKwp * F.cap + F.opp) * Math.pow(1 + FIXED.omEsc, t - 1);
    const dep = depMain + (t > F.invYr ? depInv : 0);
    const ebit = retained - om - dep;
    const tax = ebit * FIXED.tax;
    const ocf = ebit - tax + dep;
    let cf = ocf;
    if (t === F.invYr) cf -= inverter;
    if (t === F.life) cf += salvage + F.wc; // book value = salvage → no taxable gain
    fcf.push(cf);
    rows.push({ t, gross, retained, om, dep, ebit, ocf, fcf: cf });
  }
  return { fcf, rows, capex, salvage, inverter, outlay: capex + F.wc, wc: F.wc, life: F.life };
}

export function buildB(p: Params): OptionBuild {
  const F = FIXED.B;
  const capex = F.capex;
  const salvage = capex * F.salv;
  const dep = (capex - salvage) / F.life;
  const fcf: number[] = [-(capex + F.wc)];
  const rows: YearRow[] = [];
  for (let t = 1; t <= F.life; t++) {
    const energy = F.gwh * 1e6 * p.eff;
    const tariffT = p.tariff * Math.pow(1 + p.esc, t - 1);
    const gross = energy * tariffT;
    const retained = gross * p.retB;
    const om = F.om * Math.pow(1 + FIXED.omEsc, t - 1);
    const ebit = retained - om - dep;
    const tax = ebit * FIXED.tax;
    const ocf = ebit - tax + dep;
    let cf = ocf;
    if (t === F.life) cf += salvage + F.wc;
    fcf.push(cf);
    rows.push({ t, gross, retained, om, dep, ebit, ocf, fcf: cf });
  }
  return { fcf, rows, capex, salvage, outlay: capex + F.wc, wc: F.wc, life: F.life };
}

export const npv = (r: number, cfs: number[]) =>
  cfs.reduce((s, cf, t) => s + cf / Math.pow(1 + r, t), 0);

export function irr(cfs: number[]): number | null {
  let lo = -0.9, hi = 1.0;
  const f = (r: number) => npv(r, cfs);
  if (f(lo) * f(hi) > 0) return null;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (f(lo) * f(m) <= 0) hi = m; else lo = m;
  }
  return (lo + hi) / 2;
}

export interface Metrics {
  npv: number; irr: number | null; signChanges: number;
  /** Primary convention: finance negatives at after-tax kd, reinvest positives at WACC */
  mirr: number;
  /** Single-rate convention: WACC for both */
  mirrSingle: number;
  /** Conservative convention: after-tax kd for both */
  mirrConservative: number;
  pi: number;
  pay: number | null; dpay: number | null;
  /** Primary convention: average annual profit after tax ÷ average book investment */
  arr: number;
  /** Footnote variant: ÷ initial investment */
  arrInitial: number;
  eaa: number;
}

export function metrics(o: OptionBuild, p: Params): Metrics {
  const r = p.wacc, n = o.life;
  const m = {} as Metrics;
  m.npv = npv(r, o.fcf);
  m.irr = irr(o.fcf);
  m.signChanges = o.fcf.reduce((a, c, i, arr) => (i > 0 && arr[i - 1] * c < 0 ? a + 1 : a), 0);
  const pvNegKd = o.fcf.reduce((s, cf, t) => s + Math.min(cf, 0) / Math.pow(1 + FIXED.kdAT, t), 0);
  const pvNegW = o.fcf.reduce((s, cf, t) => s + Math.min(cf, 0) / Math.pow(1 + r, t), 0);
  const fvPosW = o.fcf.reduce((s, cf, t) => s + Math.max(cf, 0) * Math.pow(1 + r, n - t), 0);
  const fvPosKd = o.fcf.reduce((s, cf, t) => s + Math.max(cf, 0) * Math.pow(1 + FIXED.kdAT, n - t), 0);
  m.mirr = Math.pow(fvPosW / -pvNegKd, 1 / n) - 1;
  m.mirrSingle = Math.pow(fvPosW / -pvNegW, 1 / n) - 1;
  m.mirrConservative = Math.pow(fvPosKd / -pvNegKd, 1 / n) - 1;
  m.pi = o.fcf.reduce((s, cf, t) => (t > 0 ? s + cf / Math.pow(1 + r, t) : s), 0) / -o.fcf[0];
  const pb = (f: number[]): number | null => {
    let c = f[0];
    for (let t = 1; t < f.length; t++) {
      const prev = c; c += f[t];
      if (c >= 0) return t - 1 + -prev / f[t];
    }
    return null;
  };
  m.pay = pb(o.fcf);
  m.dpay = pb(o.fcf.map((cf, t) => cf / Math.pow(1 + r, t)));
  const prof = o.rows.map((x) => x.ebit * (1 - FIXED.tax));
  const avgProfit = prof.reduce((a, b) => a + b, 0) / prof.length;
  m.arr = avgProfit / ((o.outlay + o.salvage + o.wc) / 2);
  m.arrInitial = avgProfit / o.outlay;
  m.eaa = m.npv / ((1 - Math.pow(1 + r, -n)) / r);
  return m;
}

export interface RunResult { A: OptionBuild; B: OptionBuild; mA: Metrics; mB: Metrics; }
export function run(p: Params): RunResult {
  const A = buildA(p), B = buildB(p);
  return { A, B, mA: metrics(A, p), mB: metrics(B, p) };
}

export function switching(key: keyof Params, opt: "A" | "B", lo: number, hi: number, p: Params): number | null {
  const f = (x: number) => {
    const q = { ...p, [key]: x };
    const R = run(q);
    return (opt === "A" ? R.mA : R.mB).npv;
  };
  let a = lo, b = hi;
  if (f(a) * f(b) > 0) return null;
  for (let i = 0; i < 60; i++) {
    const m = (a + b) / 2;
    if (f(a) * f(m) <= 0) b = m; else a = m;
  }
  return (a + b) / 2;
}

/* ---------- Scenarios (coherent, relative to current inputs) ---------- */
export const worstMods = (p: Params): Partial<Params> => ({
  esc: 0,
  capexA: p.capexA * 1.2,
  yield_: p.yield_ * 0.9,
  eff: Math.max(0.1, p.eff * 0.75),
  retA: Math.max(0.1, p.retA * 0.6),
  retB: Math.max(0.1, p.retB * 0.57),
});
export const bestMods = (p: Params): Partial<Params> => ({
  esc: 0.025,
  capexA: p.capexA * 0.85,
  yield_: Math.min(1900, p.yield_ * 1.05),
  eff: Math.min(0.3, p.eff * 1.25),
  retA: Math.min(0.9, p.retA * 1.4),
  retB: Math.min(0.9, p.retB * 1.43),
});
export const scenario = (p: Params, mods: Partial<Params>) => run({ ...p, ...mods });

/* ---------- Layer 2: gates + verdict ---------- */
export interface Gates { G1: boolean; G2: boolean; G3: boolean; G4: boolean; G5: boolean; }
export const gates = (m: Metrics, p: Params): Gates => ({
  G1: m.npv > 0,
  G2: m.pi > 1,
  G3: (m.irr ?? -1) > p.wacc,
  G4: m.signChanges === 1,
  G5: m.dpay != null,
});

export type VerdictKind = "accept-a" | "accept-a-cond" | "accept-b" | "reject-both" | "review";
export interface Verdict {
  kind: VerdictKind; title: string; pill: "clean" | "conditional" | "reject";
  reason: string; conditions: { n: number; html: string }[];
  rules: { id: string; label: string; pass: boolean; tip: string }[];
}

export interface FullAnalysis {
  R: RunResult;
  worst: RunResult; best: RunResult;
  sw: { retA: number | null; capexA: number | null; tariff: number | null; yield_: number | null; retB: number | null };
  gA: Gates; gB: Gates;
  verdict: Verdict;
}

const fmtM = (v: number) => `${v < 0 ? "−" : "+"}AED ${Math.abs(v / 1e6).toFixed(2)}m`;

export function analyze(p: Params): FullAnalysis {
  const R = run(p);
  const worst = scenario(p, worstMods(p));
  const best = scenario(p, bestMods(p));
  const sw = {
    retA: switching("retA", "A", 0.05, 0.95, p),
    capexA: switching("capexA", "A", 0.5, 6, p),
    tariff: switching("tariff", "A", 0.05, 1.2, p),
    yield_: switching("yield_", "A", 400, 2400, p),
    retB: switching("retB", "B", 0.05, 0.95, p),
  };
  const gA = gates(R.mA, p), gB = gates(R.mB, p);
  const passA = Object.values(gA).every(Boolean);
  const passB = Object.values(gB).every(Boolean);
  const s1 = worst.mA.npv > 0;
  const s2 = sw.retA == null || Math.abs(p.retA - sw.retA) / p.retA > 0.2;
  // S3: the EAA ranking must not reverse under any single-variable ±20% run
  const sensVars: (keyof Params)[] = ["tariff", "yield_", "retA", "wacc", "capexA", "esc", "retB", "eff"];
  const baseSign = Math.sign(R.mA.eaa - R.mB.eaa);
  const s3 = sensVars.every((k) =>
    [0.8, 1.2].every((f) => {
      const RR = run({ ...p, [k]: p[k] * f });
      return Math.sign(RR.mA.eaa - RR.mB.eaa) === baseSign;
    }),
  );
  const eaaGapOk =
    Math.abs(R.mA.eaa - R.mB.eaa) > 0.05 * Math.max(Math.abs(R.mA.eaa), Math.abs(R.mB.eaa));

  let kind: VerdictKind, title: string, pill: Verdict["pill"], reason: string;
  let conditions: Verdict["conditions"] = [];

  if (passA && !passB) {
    if (s1) {
      kind = "accept-a"; title = "ACCEPT OPTION A"; pill = "clean";
      reason = "Rooftop solar clears every acceptance gate and survives the coherent worst case. The chiller retrofit is rejected on value.";
    } else {
      kind = "accept-a-cond"; title = "ACCEPT OPTION A"; pill = "conditional";
      reason = "Solar clears every acceptance gate and out-ranks the chiller retrofit on EAA — but robustness rule S1 tripped: NPV turns negative in the coherent worst case. The verdict converts to an accept with named verifications.";
      conditions = [
        { n: 1, html: `Confirm landlord retention ≥ <b>${sw.retA == null ? "—" : (sw.retA * 100).toFixed(0) + "%"}</b> of the solar saving against MOE lease & service-charge mechanics (base ${Math.round(p.retA * 100)}%)` },
        { n: 2, html: `Tendered turnkey capex ≤ <b>AED ${sw.capexA == null ? "—" : sw.capexA.toFixed(2)}/Wp</b> (quoted ${p.capexA.toFixed(2)} — wide margin expected at tender)` },
      ];
    }
  } else if (passA && passB) {
    const win = R.mA.eaa >= R.mB.eaa ? "A" : "B";
    kind = win === "A" ? "accept-a" : "accept-b";
    title = `ACCEPT OPTION ${win}`;
    pill = s1 && eaaGapOk ? "clean" : "conditional";
    reason = eaaGapOk
      ? "Both options clear the gates; the higher-EAA option governs (rule R1)."
      : "Both options clear the gates but the EAA gap is within 5% (rule R2) — the options are indistinguishable given assumption uncertainty.";
  } else if (!passA && passB) {
    kind = "accept-b"; title = "ACCEPT OPTION B"; pill = "conditional";
    reason = "Only the chiller retrofit clears the gates under current assumptions.";
  } else {
    kind = "reject-both"; title = "REJECT BOTH"; pill = "reject";
    reason = `Neither option creates value at the ${(p.wacc * 100).toFixed(1)}% cost of capital under current assumptions. The PPA benchmark becomes the only route to the ESG objective.`;
  }

  const verdict: Verdict = {
    kind, title, pill, reason, conditions,
    rules: [
      { id: "G1", label: "G1 NPV>0", pass: gA.G1, tip: "Option A NPV positive at the WACC" },
      { id: "G2", label: "G2 PI>1", pass: gA.G2, tip: "Profitability index above 1" },
      { id: "G3", label: "G3 IRR>WACC", pass: gA.G3, tip: "Return exceeds hurdle" },
      { id: "G4", label: "G4 IRR unique", pass: gA.G4, tip: "Single sign change verified — IRR interpretable" },
      { id: "G5", label: "G5 disc. payback", pass: gA.G5, tip: "Capital recovered in discounted terms within life" },
      { id: "R1", label: "R1 EAA rank", pass: R.mA.eaa >= R.mB.eaa, tip: "A out-ranks B on equivalent annual annuity" },
      { id: "S1", label: "S1 worst-case", pass: s1, tip: "NPV stays positive in the coherent worst case" },
      { id: "S2", label: "S2 margins>20%", pass: s2, tip: "Switching values more than 20% from base" },
      { id: "S3", label: "S3 rank stable", pass: s3, tip: "EAA ranking does not reverse under any single-variable ±20% run" },
    ],
  };

  return { R, worst, best, sw, gA, gB, verdict };
}

/**
 * NPV of Option A recomputed under double-declining-balance depreciation
 * (rate 2/life, book value floored at salvage, final year depreciates the
 * remainder to salvage; the year-12 inverter stays straight-line).
 * Exists to DEMONSTRATE, not assert, that the depreciation tax shield is
 * near-immaterial at a 9% tax rate (signed-off convention #4).
 */
export function npvADecliningBalance(p: Params): number {
  const F = FIXED.A;
  const capex = F.cap * 1000 * p.capexA;
  const salvage = capex * F.salv;
  const inverter = capex * F.invFrac;
  const depInv = inverter / (F.life - F.invYr);
  const rate = 2 / F.life;
  let book = capex;
  const fcf: number[] = [-(capex + F.wc)];
  for (let t = 1; t <= F.life; t++) {
    const energy = F.cap * p.yield_ * Math.pow(1 - F.deg, t - 1);
    const tariffT = p.tariff * Math.pow(1 + p.esc, t - 1);
    const retained = energy * tariffT * p.retA;
    const om = (F.omKwp * F.cap + F.opp) * Math.pow(1 + FIXED.omEsc, t - 1);
    let depMain = Math.max(0, Math.min(book * rate, book - salvage));
    if (t === F.life) depMain = book - salvage;
    book -= depMain;
    const dep = depMain + (t > F.invYr ? depInv : 0);
    const ebit = retained - om - dep;
    const ocf = ebit * (1 - FIXED.tax) + dep;
    let cf = ocf;
    if (t === F.invYr) cf -= inverter;
    if (t === F.life) cf += salvage + F.wc;
    fcf.push(cf);
  }
  return npv(p.wacc, fcf);
}

/* ---------- Structured payload for the AI layer ---------- */
export function buildPayload(p: Params, a: FullAnalysis) {
  const { R, worst, best, sw, verdict } = a;
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const m = (v: number) => r2(v / 1e6);
  return {
    note: "All monetary values in AED millions unless stated. Deterministic engine output — the assistant must not compute new figures.",
    inputs: {
      tariff_aed_kwh: p.tariff, tariff_escalation_pct: r2(p.esc * 100),
      retention_share_A_pct: Math.round(p.retA * 100), retention_share_B_pct: Math.round(p.retB * 100),
      capex_A_aed_per_wp: p.capexA, specific_yield_kwh_kwp: p.yield_,
      efficiency_gain_B_pct: Math.round(p.eff * 100), wacc_pct: r2(p.wacc * 100), tax_pct: 9,
      capacity_mwp: 5, life_A_years: 25, life_B_years: 12,
      capex_B_aed_m: m(FIXED.B.capex), mall_consumption_gwh: FIXED.B.gwh,
    },
    optionA: {
      npv_m: m(R.mA.npv), irr_pct: R.mA.irr == null ? null : r2(R.mA.irr * 100),
      mirr_pct: r2(R.mA.mirr * 100), pi: r2(R.mA.pi),
      payback_yrs: R.mA.pay == null ? null : r2(R.mA.pay),
      discounted_payback_yrs: R.mA.dpay == null ? null : r2(R.mA.dpay),
      arr_pct: r2(R.mA.arr * 100), eaa_m_per_yr: m(R.mA.eaa),
      initial_outlay_m: m(-R.A.outlay), year1_gross_saving_m: m(R.A.rows[0].gross),
      year1_ocf_m: m(R.A.rows[0].ocf),
    },
    optionB: {
      npv_m: m(R.mB.npv), irr_pct: R.mB.irr == null ? null : r2(R.mB.irr * 100),
      mirr_pct: r2(R.mB.mirr * 100), pi: r2(R.mB.pi),
      payback_yrs: R.mB.pay == null ? null : r2(R.mB.pay),
      discounted_payback_yrs: R.mB.dpay == null ? null : r2(R.mB.dpay),
      arr_pct: r2(R.mB.arr * 100), eaa_m_per_yr: m(R.mB.eaa),
      initial_outlay_m: m(-R.B.outlay), year1_gross_saving_m: m(R.B.rows[0].gross),
      year1_ocf_m: m(R.B.rows[0].ocf),
    },
    switching_values: {
      retention_A_pct: sw.retA == null ? null : r2(sw.retA * 100),
      capex_A_aed_per_wp: sw.capexA == null ? null : r2(sw.capexA),
      tariff_aed_kwh: sw.tariff == null ? null : r2(sw.tariff * 1000) / 1000,
      yield_kwh_kwp: sw.yield_ == null ? null : Math.round(sw.yield_),
      retention_B_pct: sw.retB == null ? null : r2(sw.retB * 100),
    },
    scenarios: {
      worst: { A_npv_m: m(worst.mA.npv), B_npv_m: m(worst.mB.npv), A_eaa_m: m(worst.mA.eaa) },
      best: { A_npv_m: m(best.mA.npv), B_npv_m: m(best.mB.npv), A_eaa_m: m(best.mA.eaa) },
    },
    verdict: {
      decision: verdict.title, form: verdict.pill, reason: verdict.reason,
      rules: verdict.rules.map((x) => ({ id: x.id, pass: x.pass })),
    },
    ppa_benchmark: {
      ownership_lcoe_aed_kwh: 0.15, dewa_tariff_aed_kwh: p.tariff,
      typical_uae_rooftop_ppa_range_aed_kwh: [0.14, 0.2],
      note: "Out-of-model benchmark. MAF's 2023 Yellow Door Energy agreement is the zero-capex fallback.",
    },
  };
}
export type Payload = ReturnType<typeof buildPayload>;
