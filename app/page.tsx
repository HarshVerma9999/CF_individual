"use client";

import { useMemo, useState } from "react";
import { analyze, BASE, FIXED, npvADecliningBalance, type Params } from "@/lib/engine";
import { buildPayload } from "@/lib/engine";
import { Tornado, Timeline, Waterfall } from "@/components/charts";
import { AiPanel } from "@/components/AiPanel";

/* ---------------- formatting ---------------- */
const fmtM = (v: number) => `${v < 0 ? "−" : "+"}AED ${Math.abs(v / 1e6).toFixed(2)}m`;
const fmtMp = (v: number) => `${v < 0 ? "−" : ""}AED ${Math.abs(v / 1e6).toFixed(2)}m`;
const pct = (v: number | null) => (v == null ? "n/a" : (v * 100).toFixed(1) + "%");
const yrs = (v: number | null) => (v == null ? "never" : v.toFixed(1) + " yrs");

/* ---------------- slider row ---------------- */
function SliderRow(props: {
  label: string; badge: 1 | 2 | 3; value: number; min: number; max: number; step: number;
  display: string; tick?: number | null; src?: string;
  onChange: (v: number) => void;
}) {
  const { label, badge, value, min, max, step, display, tick, src, onChange } = props;
  const fill = ((value - min) / (max - min)) * 100;
  const tickPos = tick != null && tick >= min && tick <= max ? ((tick - min) / (max - min)) * 100 : null;
  return (
    <div className="irow">
      <div className="irow-top">
        <label>{label}<span className={`badge c${badge}`}>Class {badge}</span></label>
        <span className="val num">{display}</span>
      </div>
      <div className="slider-wrap">
        <input type="range" min={min} max={max} step={step} value={value}
          style={{ "--fill": `${fill}%` } as React.CSSProperties}
          onChange={(e) => onChange(parseFloat(e.target.value))} aria-label={label} />
        {tickPos != null && <div className="switch-tick" style={{ left: `${tickPos}%` }} />}
      </div>
      <div className="range-meta"><span>{min}</span><span>{max}</span></div>
      {src && <div className="src">{src}</div>}
    </div>
  );
}

/* ---------------- icons ---------------- */
const I = {
  bolt: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>,
  sun: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  snow: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M12 2v20M4.2 6.5l15.6 11M4.2 17.5l15.6-11" /></svg>,
  bank: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M3 21h18M4 18h16M6 18V9m4 9V9m4 9V9m4 9V9M2 9l10-6 10 6H2z" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M3 3v18h18M7 14l4-4 3 3 5-6" /></svg>,
  warn: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>,
  bot: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M12 8V4H8m8 0h-4M4 12H2m4 0H4m16 0h-2m2 0h-2M9 16h6m-9 4h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" /></svg>,
  sliders: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6" /></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" /></svg>,
  moon: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
  home: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" /></svg>,
};

type Tab = "decision" | "cashflows" | "risk" | "ai";
interface Trace { title: string; formula: string; feeds: [string, string][]; x: number; y: number; }

export default function Home() {
  const [p, setP] = useState<Params>({ ...BASE });
  const [tab, setTab] = useState<Tab>("decision");
  const [dark, setDark] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [trace, setTrace] = useState<Trace | null>(null);

  const a = useMemo(() => analyze(p), [p]);
  const payload = useMemo(() => buildPayload(p, a), [p, a]);
  const { R, worst, best, sw, verdict } = a;

  const set = (k: keyof Params) => (v: number) => setP((q) => ({ ...q, [k]: v }));
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "";
  };

  const cls = (v: number) => (v >= 0 ? "tpos" : "tneg");
  const maxE = Math.max(Math.abs(R.mA.eaa), Math.abs(R.mB.eaa), 1);

  const openTrace = (e: React.MouseEvent, t: Omit<Trace, "x" | "y">) => {
    e.stopPropagation();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTrace({ ...t, x: Math.min(r.left - 100, window.innerWidth - 350), y: Math.min(r.bottom + 8, window.innerHeight - 280) });
  };

  const scenDrivers = (which: "worst" | "best") =>
    which === "worst"
      ? "Soft-energy world: flat tariff, capex over-run, −10% yield, retention at low bound. No single driver flips A alone — the worst case turns negative through the combination."
      : "Tight-energy world: 2.5% escalation, tender savings on capex, upper-design yield, high retention.";

  return (
    <div onClick={() => setTrace(null)}>
      {/* ================= Topbar ================= */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <h1>MERIDIAN <span>· Capital Decision Engine</span></h1>
        </div>
        <div className="asset-chip">{I.home}Mall of the Emirates — MAF Properties LLC</div>
        <div className="spacer" />
        <div className="engine-chip"><span className="live-dot" />Deterministic engine · live</div>
        <button className="top-btn" onClick={() => setDrawer(true)}>{I.book}Methodology</button>
        <button className="top-btn" onClick={toggleTheme} aria-label="Toggle dark mode">{I.moon}{dark ? "Light" : "Dark"}</button>
      </header>

      <div className="layout">
        {/* ================= Assumptions rail ================= */}
        <aside className="rail">
          <div className="rail-head">
            <h2>{I.sliders}Assumptions</h2>
            <button className="reset" onClick={() => setP({ ...BASE })}>Reset to base</button>
          </div>

          <div className="igroup">
            <div className="igroup-head"><div className="gicon">{I.bolt}</div><h3>Market &amp; tariff</h3></div>
            <SliderRow label="Effective tariff" badge={1} value={p.tariff} min={0.25} max={0.6} step={0.005}
              display={`AED ${p.tariff.toFixed(3)}/kWh`} tick={sw.tariff}
              src="DEWA slab 0.380 + fuel surcharge 0.060 · cross-checked vs Etihad ESCO (0.445)"
              onChange={set("tariff")} />
            <SliderRow label="Tariff escalation" badge={2} value={p.esc} min={0} max={0.03} step={0.0025}
              display={`${(p.esc * 100).toFixed(1)}%/yr`} src="DEWA tariffs unchanged since Jan 2022 — low, not zero"
              onChange={set("esc")} />
          </div>

          <div className="igroup">
            <div className="igroup-head"><div className="gicon">{I.sun}</div><h3>Option A — Rooftop solar</h3><span className="tag">25 yr</span></div>
            <SliderRow label="Landlord retention share" badge={3} value={p.retA} min={0.1} max={0.9} step={0.01}
              display={`${Math.round(p.retA * 100)}%`} tick={sw.retA}
              src="Decision-critical judgement — share of the solar saving MAF keeps after service-charge pass-through. Phase-1 precedent: MOE's existing Enova carport plant (3 GWh) serves landlord load — MAF captures close to the full saving"
              onChange={set("retA")} />
            <SliderRow label="Capex" badge={2} value={p.capexA} min={1.2} max={3.4} step={0.05}
              display={`AED ${p.capexA.toFixed(2)}/Wp`} tick={sw.capexA}
              src="UAE installer range — weakest sourced input, widest band"
              onChange={set("capexA")} />
            <SliderRow label="Specific yield" badge={1} value={p.yield_} min={1300} max={1900} step={10}
              display={`${p.yield_.toLocaleString()} kWh/kWp`} tick={sw.yield_}
              src="Global Solar Atlas, MOE site, medium commercial rooftop (100 kWp ref): 172.101 MWh/yr = 1,721 kWh/kWp. Excludes soiling — cleaning assumed within O&M; ±10% band covers shortfall"
              onChange={set("yield_")} />
            <div className="static-row"><span>System capacity</span><span className="val num">5.0 MWp</span></div>
            <div className="static-row"><span>Degradation <span className="badge c1">Class 1</span></span><span className="val num">0.50%/yr</span></div>
            <div className="static-row"><span>Inverter replacement (yr 12)</span><span className="val num">8% of capex</span></div>
          </div>

          <div className="igroup">
            <div className="igroup-head"><div className="gicon">{I.snow}</div><h3>Option B — Chiller retrofit</h3><span className="tag">12 yr</span></div>
            <SliderRow label="Landlord retention share" badge={3} value={p.retB} min={0.1} max={0.9} step={0.01}
              display={`${Math.round(p.retB * 100)}%`} tick={sw.retB}
              src="Lower than A — central-plant savings are the most service-charge-recoverable"
              onChange={set("retB")} />
            <SliderRow label="Efficiency gain" badge={2} value={p.eff} min={0.1} max={0.3} step={0.01}
              display={`${Math.round(p.eff * 100)}% of load`} src="Etihad ESCO Dubai Maritime City analogue (20%)"
              onChange={set("eff")} />
            <div className="static-row" title="Derived: 3.7-yr ESPC payback (Siemens/Etihad ESCO mosque retrofit, 2022) × base gross saving AED 8.8m. Caveats: mosque portfolio, not a mall; cost inferred from stated payback (may embed ESCO financing margin); 2022 source.">
              <span>Capex <span className="badge c2">Class 2</span></span>
              <span className="val num">AED {(FIXED.B.capex / 1e6).toFixed(2)}m</span>
            </div>
            <div className="static-row" title="UNSOURCED whole-building estimate. Not directly derivable from MAF's 2024 Environmental Data Annex, which discloses landlord shared-services consumption only (29 malls: 183.9 GWh electricity + 181.6 GWh(th) chilled water, 2024; landlord electricity intensity 275 kWh/m²/yr).">
              <span>Mall consumption <span className="badge c3">Class 3 · unsourced</span></span>
              <span className="val num">100 GWh/yr</span>
            </div>
          </div>

          <div className="igroup">
            <div className="igroup-head"><div className="gicon">{I.bank}</div><h3>Finance</h3></div>
            <SliderRow label="WACC (nominal)" badge={2} value={p.wacc} min={0.06} max={0.12} step={0.001}
              display={`${(p.wacc * 100).toFixed(2)}%`}
              src="Rf 4.65% (US 10Y, 14 Aug 2026) + β 0.691 × UAE ERP 5.491% (Damodaran Apr-26; βu 0.5898 relevered at D/E 18.85%) → Ke 8.44%; kd 4.2–4.6% → WACC 7.71–7.77%, base 7.74%"
              onChange={set("wacc")} />
            <div className="static-row"><span>Corporate tax <span className="badge c1">Class 1</span></span><span className="val num">9%</span></div>
            <div className="static-row"><span>Depreciation</span><span className="val num">Straight-line → salvage</span></div>
          </div>
        </aside>

        {/* ================= Main ================= */}
        <main className="main">
          <nav className="tabs" role="tablist">
            {([
              ["decision", "Decision", I.check],
              ["cashflows", "Cash Flows", I.chart],
              ["risk", "Risk & Sensitivity", I.warn],
              ["ai", "AI Analyst", I.bot],
            ] as [Tab, string, React.ReactNode][]).map(([id, label, icon]) => (
              <button key={id} role="tab" aria-selected={tab === id}
                className={`tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
                {icon}{label}
              </button>
            ))}
          </nav>

          {/* ===== Decision ===== */}
          <section className={`pane${tab === "decision" ? " active" : ""}`}>
            <div className="verdict-grid">
              <div className="card verdict-card"
                style={{ "--verdict-color": verdict.pill === "reject" ? "var(--neg)" : verdict.pill === "conditional" ? "var(--accent)" : "var(--pos)" } as React.CSSProperties}>
                <div className="verdict-label">Engine verdict · rules cited below</div>
                <div className="verdict-title">
                  <span>{verdict.title}</span>
                  <span className={`pill ${verdict.pill}`}>{verdict.pill === "clean" ? "Robust" : verdict.pill === "conditional" ? "Conditional" : "Rejected"}</span>
                </div>
                <p className="verdict-reason">{verdict.reason}</p>
                {verdict.conditions.length > 0 && (
                  <div className="conditions">
                    {verdict.conditions.map((c) => (
                      <div key={c.n} className="condition">
                        <span className="cnum">{c.n}</span>
                        <span dangerouslySetInnerHTML={{ __html: c.html }} />
                      </div>
                    ))}
                  </div>
                )}
                <div className="rule-chips">
                  {verdict.rules.map((r) => (
                    <span key={r.id} className={`chip ${r.pass ? "pass" : "fail"}`} title={r.tip}>
                      <span>{r.pass ? "✓" : "✗"}</span>{r.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card eaa-card">
                <h3 className="section-h">Ranking — Equivalent Annual Annuity</h3>
                <div className="eaa-row">
                  <div className="eaa-top"><b>A · Solar (25y)</b><span className="num">{fmtM(R.mA.eaa)}/yr</span></div>
                  <div className="eaa-bar-track">
                    <div className="eaa-bar" style={{ width: `${Math.max((Math.abs(R.mA.eaa) / maxE) * 100, 2)}%`, background: R.mA.eaa >= 0 ? "var(--pos)" : "var(--neg)" }} />
                  </div>
                </div>
                <div className="eaa-row">
                  <div className="eaa-top"><b>B · Chillers (12y)</b><span className="num">{fmtM(R.mB.eaa)}/yr</span></div>
                  <div className="eaa-bar-track">
                    <div className="eaa-bar" style={{ width: `${Math.max((Math.abs(R.mB.eaa) / maxE) * 100, 2)}%`, background: R.mB.eaa >= 0 ? "var(--pos)" : "var(--neg)" }} />
                  </div>
                </div>
                <div className="eaa-note">Unequal lives (25 vs 12) → ranked on EAA, never raw NPV or IRR. Rule R1.</div>
                <div className="ppa-strip">
                  <b>PPA benchmark (out of model):</b> ownership LCOE ≈ <span className="num">AED 0.14/kWh</span> vs
                  DEWA <span className="num">{p.tariff.toFixed(2)}</span> vs typical UAE rooftop PPA{" "}
                  <span className="num">0.14–0.20</span>. MAF&apos;s 2023 Yellow Door agreement is the zero-capex
                  fallback if the retention condition fails.
                </div>
              </div>
            </div>

            <div className="card metrics-card">
              <h3 className="section-h">All thirteen required measures — computed live</h3>
              <table className="metrics">
                <thead><tr><th>Metric</th><th>Option A — Solar</th><th>Option B — Chillers</th></tr></thead>
                <tbody>
                  <tr><td>Initial cash flow</td><td className="num">{fmtMp(-R.A.outlay)}</td><td className="num">{fmtMp(-R.B.outlay)}</td></tr>
                  <tr><td>Operating CF — year 1</td><td className="num">{fmtM(R.A.rows[0].ocf)}</td><td className="num">{fmtM(R.B.rows[0].ocf)}</td></tr>
                  <tr><td>Terminal-year CF</td><td className="num">{fmtM(R.A.fcf[25])}</td><td className="num">{fmtM(R.B.fcf[12])}</td></tr>
                  <tr><td>Payback</td><td className="num">{yrs(R.mA.pay)}</td><td className="num">{yrs(R.mB.pay)}</td></tr>
                  <tr><td>Discounted payback</td><td className="num">{yrs(R.mA.dpay)}</td><td className="num">{yrs(R.mB.dpay)}</td></tr>
                  <tr>
                    <td>ARR (average-investment basis — primary)</td>
                    <td className="num figure"
                      onClick={(e) => openTrace(e, {
                        title: "ARR conventions — Option A",
                        formula: "Avg. profit after tax ÷ avg. book investment (primary) · ÷ initial investment (footnote)",
                        feeds: [
                          ["Average-investment basis (primary)", pct(R.mA.arr)],
                          ["Initial-investment basis (footnote)", pct(R.mA.arrInitial)],
                        ],
                      })}>
                      <span className="u">{pct(R.mA.arr)}</span>
                    </td>
                    <td className="num">{pct(R.mB.arr)}</td>
                  </tr>
                  <tr>
                    <td><b>NPV @ {(p.wacc * 100).toFixed(1)}%</b></td>
                    <td className={`num figure ${cls(R.mA.npv)}`}
                      onClick={(e) => openTrace(e, {
                        title: "NPV — Option A",
                        formula: "NPV = Σ FCFₜ / (1+WACC)ᵗ − initial outlay",
                        feeds: [
                          ["WACC", `${(p.wacc * 100).toFixed(2)}% · Class 2`],
                          ["Initial outlay", `${fmtMp(-R.A.outlay)} · capex ${p.capexA.toFixed(2)}/Wp`],
                          ["Retention share", `${Math.round(p.retA * 100)}% · Class 3`],
                          ["Tariff", `AED ${p.tariff.toFixed(3)} · Class 1`],
                        ],
                      })}>
                      <b><span className="u">{fmtM(R.mA.npv)}</span></b>
                    </td>
                    <td className={`num ${cls(R.mB.npv)}`}><b>{fmtM(R.mB.npv)}</b></td>
                  </tr>
                  <tr>
                    <td>IRR</td>
                    <td className="num figure"
                      onClick={(e) => openTrace(e, {
                        title: "IRR — Option A",
                        formula: "IRR: rate where NPV = 0 (bisection; uniqueness verified)",
                        feeds: [["Sign changes", `${R.mA.signChanges} — conventional stream`], ["Hurdle (WACC)", `${(p.wacc * 100).toFixed(2)}%`]],
                      })}>
                      <span className="u">{pct(R.mA.irr)}</span>
                    </td>
                    <td className="num">{pct(R.mB.irr)}</td>
                  </tr>
                  <tr>
                    <td>MIRR (split rates — primary)</td>
                    <td className="num figure"
                      onClick={(e) => openTrace(e, {
                        title: "MIRR conventions — Option A",
                        formula: "MIRR = (FV positives @ reinvest rate ÷ −PV negatives @ finance rate)^(1/n) − 1",
                        feeds: [
                          ["Split rates (primary): finance @ 4.0% after-tax kd, reinvest @ WACC", pct(R.mA.mirr)],
                          ["Single rate: WACC both sides", pct(R.mA.mirrSingle)],
                          ["Conservative: after-tax kd both sides", pct(R.mA.mirrConservative)],
                        ],
                      })}>
                      <span className="u">{pct(R.mA.mirr)}</span>
                    </td>
                    <td className="num figure"
                      onClick={(e) => openTrace(e, {
                        title: "MIRR conventions — Option B",
                        formula: "MIRR = (FV positives @ reinvest rate ÷ −PV negatives @ finance rate)^(1/n) − 1",
                        feeds: [
                          ["Split rates (primary)", pct(R.mB.mirr)],
                          ["Single rate: WACC both sides", pct(R.mB.mirrSingle)],
                          ["Conservative: after-tax kd both sides", pct(R.mB.mirrConservative)],
                        ],
                      })}>
                      <span className="u">{pct(R.mB.mirr)}</span>
                    </td>
                  </tr>
                  <tr><td>Profitability index</td><td className="num">{R.mA.pi.toFixed(2)}</td><td className="num">{R.mB.pi.toFixed(2)}</td></tr>
                  <tr className="rank"><td><b>EAA — ranking metric</b></td><td className={`num ${cls(R.mA.eaa)}`}>{fmtM(R.mA.eaa)}/yr</td><td className={`num ${cls(R.mB.eaa)}`}>{fmtM(R.mB.eaa)}/yr</td></tr>
                </tbody>
              </table>
              <p className="metric-note">
                Click any underlined figure to trace it — formula, inputs and source classes. ARR footnote
                (initial-investment basis): A {pct(R.mA.arrInitial)} · B {pct(R.mB.arrInitial)}; ARR ranks nothing.
                IRR uniqueness is verified ({R.mA.signChanges === 1 ? "single sign change — split-rate and single-rate MIRR coincide because no interim cash flow is negative" : `${R.mA.signChanges} sign changes — IRR not interpretable, MIRR governs (rule G4)`}).
                Convention #4 check — Option A NPV under declining-balance depreciation: {fmtM(npvADecliningBalance(p))}{" "}
                (Δ {fmtM(npvADecliningBalance(p) - R.mA.npv)} vs straight-line): the depreciation tax shield is
                near-immaterial at a 9% tax rate.
              </p>
            </div>
          </section>

          {/* ===== Cash Flows ===== */}
          <section className={`pane${tab === "cashflows" ? " active" : ""}`}>
            <div className="chart-grid2">
              <div className="card chart-card">
                <h3 className="section-h">Year-1 build-up — Option A</h3>
                <Waterfall R={R} />
                <p className="caption">
                  How one year of value is assembled: gross avoided cost → the retention haircut (what tenants keep) →
                  O&amp;M and opportunity cost → tax → operating cash flow. The retention haircut is the model&apos;s
                  single biggest judgement.
                </p>
              </div>
              <div className="card chart-card">
                <h3 className="section-h">25-year free cash flow &amp; cumulative discounted position — Option A</h3>
                <Timeline R={R} p={p} />
                <p className="caption">
                  Bars: annual FCF (initial outlay clipped for scale, labelled; year-12 inverter replacement visible).
                  Gold line: cumulative discounted cash — it crosses zero at the discounted payback. Terminal year
                  includes after-tax salvage.
                </p>
              </div>
            </div>
          </section>

          {/* ===== Risk ===== */}
          <section className={`pane${tab === "risk" ? " active" : ""}`}>
            <div className="chart-grid2">
              <div className="card chart-card">
                <h3 className="section-h">Tornado — NPV sensitivity, ±20% each input (Option A)</h3>
                <Tornado p={p} />
                <p className="caption">
                  Tariff, yield and retention are equally dominant — they enter the saving line multiplicatively, so
                  identical percentage moves have identical NPV effects. Capex and WACC are second-order.
                </p>
              </div>
              <div className="card chart-card">
                <h3 className="section-h">Switching values — where NPV crosses zero</h3>
                <table className="sw-table">
                  <thead><tr><th>Variable</th><th>Base</th><th>NPV = 0 at</th><th>Safety margin</th></tr></thead>
                  <tbody>
                    {([
                      ["Retention share (A)", `${Math.round(p.retA * 100)}%`, sw.retA == null ? "—" : `${(sw.retA * 100).toFixed(1)}%`, sw.retA == null ? 1 : Math.abs(p.retA - sw.retA) / p.retA],
                      ["Capex (A)", `AED ${p.capexA.toFixed(2)}/Wp`, sw.capexA == null ? "—" : `AED ${sw.capexA.toFixed(2)}`, sw.capexA == null ? 1 : Math.abs(sw.capexA - p.capexA) / p.capexA],
                      ["Effective tariff", `AED ${p.tariff.toFixed(3)}`, sw.tariff == null ? "—" : `AED ${sw.tariff.toFixed(3)}`, sw.tariff == null ? 1 : Math.abs(p.tariff - sw.tariff) / p.tariff],
                      ["Specific yield", p.yield_.toLocaleString(), sw.yield_ == null ? "—" : Math.round(sw.yield_).toLocaleString(), sw.yield_ == null ? 1 : Math.abs(p.yield_ - sw.yield_) / p.yield_],
                    ] as [string, string, string, number][]).map(([lab, baseV, swV, m]) => {
                      const mm = Math.min(m, 1);
                      return (
                        <tr key={lab}>
                          <td>{lab}</td><td className="num">{baseV}</td>
                          <td className="num" style={{ color: "var(--accent)", fontWeight: 600 }}>{swV}</td>
                          <td>
                            <div className="margin-bar"><div className={`margin-fill${mm < 0.2 ? " thin" : ""}`} style={{ width: `${mm * 100}%` }} /></div>
                            <span style={{ fontSize: "0.66rem", color: "var(--muted-fg)" }}>{(mm * 100).toFixed(0)}% {mm < 0.2 ? "— fragile (S2)" : "from base"}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="caption">
                  Rule S2: a margin under 20% marks the decision fragile. The retention share is the binding constraint
                  — it is also the least evidenced input (Class 3), which is exactly why the verdict is conditional on
                  verifying it.
                </p>
              </div>
            </div>
            <h3 className="section-h" style={{ margin: "6px 0 0" }}>Scenarios — variables moved coherently, not independently</h3>
            <div className="scen-grid">
              {([
                ["Worst — coherent", worst, scenDrivers("worst"), false],
                ["Base", R, "Central assumptions as sourced in the register.", true],
                ["Best — coherent", best, scenDrivers("best"), false],
              ] as [string, typeof R, string, boolean][]).map(([name, RR, desc, isBase]) => (
                <div key={name} className={`scen${isBase ? " base" : ""}`}>
                  <h4>{name}</h4>
                  <div className={`big num ${cls(RR.mA.npv)}`}>{fmtM(RR.mA.npv)}</div>
                  <div className="sub num">Option A NPV · EAA {fmtM(RR.mA.eaa)}/yr</div>
                  <div className="sub num">Option B NPV {fmtM(RR.mB.npv)}</div>
                  <div className="scen-desc">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== AI Analyst ===== */}
          <section className={`pane${tab === "ai" ? " active" : ""}`}>
            <AiPanel analysis={a} p={p} payload={payload} />
          </section>
        </main>
      </div>

      {/* ================= Trace popover ================= */}
      {trace && (
        <div className="popover" style={{ top: trace.y, left: trace.x }} onClick={(e) => e.stopPropagation()}>
          <h4>{trace.title} — audit trail<button className="close" onClick={() => setTrace(null)}>✕</button></h4>
          <div className="formula mono">{trace.formula}</div>
          {trace.feeds.map(([k, v]) => (
            <div key={k} className="feed"><span>{k}</span><b className="num">{v}</b></div>
          ))}
        </div>
      )}

      {/* ================= Methodology drawer ================= */}
      {drawer && (
        <>
          <div className="drawer-veil" onClick={() => setDrawer(false)} />
          <aside className="drawer">
            <div className="drawer-head">
              <h3>Methodology &amp; audit trail</h3>
              <button className="top-btn" onClick={() => setDrawer(false)}>Close</button>
            </div>
            <div className="drawer-body">
              <h4>Assumptions register (excerpt)</h4>
              <table className="reg-table">
                <thead><tr><th>Input</th><th>Value</th><th>Class</th><th>Source</th></tr></thead>
                <tbody>
                  <tr><td>Effective tariff</td><td className="num">AED 0.440/kWh</td><td><span className="badge c1">1</span></td><td>DEWA published schedule + Aug-26 fuel surcharge. Triangulated twice: Etihad ESCO JAFZA (0.445) and MOE's own carport plant — AED 1.4m on 3 GWh implies 0.467 (an "up to" figure, so an upper bound)</td></tr>
                  <tr><td>Specific yield</td><td className="num">1,721 kWh/kWp</td><td><span className="badge c1">1</span></td><td>Global Solar Atlas, MOE site, medium commercial rooftop config (100 kWp ref: 172.101 MWh/yr; GTI 2,315.3 kWh/m² @ 26° tilt). Excludes soiling — cleaning assumed within O&M, flagged. Empirical cross-check: MOE's Enova carport plant, 11,996 m² ≈ 6.9 m²/kWp measured on site</td></tr>
                  <tr><td>Solar capex</td><td className="num">AED 1.80/Wp</td><td><span className="badge c2">2</span></td><td>UAE installer range — widest sensitivity band</td></tr>
                  <tr><td>Chiller retrofit capex</td><td className="num">AED {(FIXED.B.capex / 1e6).toFixed(2)}m</td><td><span className="badge c2">2</span></td><td>3.7-yr ESPC payback (Siemens/Etihad ESCO retrofit, 2022) × gross saving AED 8.8m. Caveats: mosque load profile, not a mall; inferred from payback, may embed ESCO margin; 2022 figures. Same contract&apos;s 20.43% guaranteed saving corroborates the 20% efficiency assumption</td></tr>
                  <tr><td>Retention share A / B</td><td className="num">50% / 35%</td><td><span className="badge c3">3</span></td><td>Deliberately asymmetric and decision-critical. A: solar offsets the landlord's bulk meter — MOE's Phase-1 carport plant (landlord load) is the citable precedent for near-full capture. B: central-plant savings are the most service-charge-recoverable</td></tr>
                  <tr><td>Mall consumption</td><td className="num">100 GWh/yr</td><td><span className="badge c3">3</span></td><td><b>Unsourced</b> whole-building estimate, flagged. MAF&apos;s 2024 Environmental Data Annex discloses landlord shared-services consumption only (29 malls: 183.9 GWh electricity + 181.6 GWh(th) chilled water; landlord intensity 275 kWh/m²/yr) — no whole-building, per-mall figure is published, and deriving one would stack three further judgements</td></tr>
                  <tr><td>WACC</td><td className="num">7.74%</td><td><span className="badge c2">2</span></td><td>Rf 4.65% (US 10Y, 14 Aug 2026); Damodaran Apr-2026 UAE ERP 5.491%; βu 0.5898 (EM real-estate ops, cash-corrected, Jan-2026, 406 firms; 0.5416 uncorrected as sensitivity) relevered at MAFP D/E 18.85%, 9% tax → β 0.691, Ke 8.44%; kd 4.2–4.6% book proxy → WACC 7.71–7.77%</td></tr>
                  <tr><td>Corporate tax</td><td className="num">9%</td><td><span className="badge c1">1</span></td><td>UAE Federal Decree-Law 47/2022</td></tr>
                </tbody>
              </table>
              <h4>Brief-compliance mapping (excerpt)</h4>
              <div className="map-row"><span>&quot;Expected annual revenues&quot;</span><span className="arrow">→</span><span>Avoided electricity cost — the economic equivalent for a cost-reduction project</span></div>
              <div className="map-row"><span>&quot;Depreciation (user input)&quot;</span><span className="arrow">→</span><span>Derived from cost, life &amp; salvage; user selects method — declared deviation, protects the tax shield</span></div>
              <div className="map-row"><span>&quot;Break-even analysis&quot;</span><span className="arrow">→</span><span>Financial break-even (switching values) — no unit volume exists in a cost-saving project</span></div>
              <div className="map-row"><span>&quot;Working capital&quot;</span><span className="arrow">→</span><span>A: nil (stated honestly) · B: AED 0.5m spares, recovered at t=12</span></div>
              <h4>Break-even conventions (compliance table — Option A, year 1)</h4>
              <table className="reg-table">
                <thead><tr><th>Convention</th><th>Break-even at</th><th>Note</th></tr></thead>
                <tbody>
                  <tr>
                    <td><b>Financial (primary)</b></td>
                    <td className="num">yield {a.sw.yield_ == null ? "—" : Math.round(a.sw.yield_).toLocaleString()} kWh/kWp · tariff AED {a.sw.tariff == null ? "—" : a.sw.tariff.toFixed(3)}</td>
                    <td>Switching values where NPV = 0 — see Risk tab; governs the decision</td>
                  </tr>
                  <tr>
                    <td>Accounting (secondary)</td>
                    <td className="num">yield {Math.round((R.A.rows[0].om + R.A.rows[0].dep) / (5000 * p.tariff * p.retA)).toLocaleString()} kWh/kWp</td>
                    <td>Retained saving covers O&amp;M + depreciation (EBIT = 0)</td>
                  </tr>
                  <tr>
                    <td>Cash (secondary)</td>
                    <td className="num">yield {Math.round(R.A.rows[0].om / (5000 * p.tariff * p.retA)).toLocaleString()} kWh/kWp</td>
                    <td>Retained saving covers O&amp;M only (EBITDA = 0)</td>
                  </tr>
                </tbody>
              </table>
              <h4>Decision rules</h4>
              <div className="map-row"><span className="mono">G1–G5</span><span className="arrow">→</span><span>Gates: NPV&gt;0 · PI&gt;1 · IRR&gt;WACC · IRR unique · disc. payback ≤ life</span></div>
              <div className="map-row"><span className="mono">R1–R2</span><span className="arrow">→</span><span>Rank on EAA; gaps within 5% → indistinguishable → Review</span></div>
              <div className="map-row"><span className="mono">S1–S3</span><span className="arrow">→</span><span>Robustness: worst-case NPV, switching margins &gt;20%, ranking stability</span></div>
              <div className="footer-note">
                The engine is validated against an independent Python reference implementation (25 golden-value tests,
                8-decimal agreement). The AI layer receives only the structured results payload; a post-processor
                verifies every numeral it emits against that payload before display.
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
