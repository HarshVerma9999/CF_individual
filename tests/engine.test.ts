import { describe, it, expect } from "vitest";
import { BASE, run, switching, analyze, npvADecliningBalance } from "../lib/engine";

/**
 * Golden values recomputed independently from first principles (fresh arithmetic,
 * verification/independent_check.py — no code shared with the engine) at the 2026-08-14
 * base case: yield 1,721 kWh/kWp (Global Solar Atlas, MOE site, Class 1) and
 * WACC 7.74% (Rf 4.65% @ 14-Aug-26, Damodaran Apr-26 UAE ERP 5.491%, beta 0.6910,
 * kd midpoint 4.4%). These are cross-implementation checks: they validate the
 * arithmetic against the stated formulas, not the Class 3 assumptions.
 */
describe("Option A — golden values vs independent recomputation", () => {
  const R = run(BASE);
  it("NPV", () => expect(R.mA.npv).toBeCloseTo(8074217.58, 1));
  it("IRR", () => expect(R.mA.irr!).toBeCloseTo(0.169279, 6));
  it("MIRR split = single (only t=0 negative)", () => {
    expect(R.mA.mirr).toBeCloseTo(0.105353, 6);
    expect(R.mA.mirr).toBeCloseTo(R.mA.mirrSingle, 10);
  });
  it("MIRR conservative (kd both sides)", () => expect(R.mA.mirrConservative).toBeCloseTo(0.082655, 6));
  it("PI (yr-12 inverter outflow in numerator)", () => expect(R.mA.pi).toBeCloseTo(1.897135, 6));
  it("payback", () => expect(R.mA.pay!).toBeCloseTo(5.771934, 6));
  it("discounted payback", () => expect(R.mA.dpay!).toBeCloseTo(7.922699, 6));
  it("ARR avg / initial", () => {
    expect(R.mA.arr).toBeCloseTo(0.260166, 6);
    expect(R.mA.arrInitial).toBeCloseTo(0.136587, 6);
  });
  it("EAA", () => expect(R.mA.eaa).toBeCloseTo(739655.47, 1));
  it("IRR unique — exactly one sign change", () => expect(R.mA.signChanges).toBe(1));
  it("initial outlay", () => expect(R.A.outlay).toBe(9_000_000));
});

describe("Option B — golden values vs independent recomputation", () => {
  // Capex AED 32.56m = 3.7-yr ESPC payback (Siemens/Etihad ESCO retrofit, 2022) × gross saving 8.8m.
  const R = run(BASE);
  it("NPV", () => expect(R.mB.npv).toBeCloseTo(-10621508.53, 1));
  it("IRR", () => expect(R.mB.irr!).toBeCloseTo(0.012424, 6));
  it("MIRR split / conservative", () => {
    expect(R.mB.mirr).toBeCloseTo(0.043161, 6);
    expect(R.mB.mirrConservative).toBeCloseTo(0.025089, 6);
  });
  it("PI", () => expect(R.mB.pi).toBeCloseTo(0.678720, 6));
  it("payback recovers undiscounted in yr ~11.3; discounted never", () => {
    expect(R.mB.pay!).toBeCloseTo(11.318343, 5);
    expect(R.mB.dpay).toBeNull();
  });
  it("ARR avg / initial", () => {
    expect(R.mB.arr).toBeCloseTo(0.013875, 6);
    expect(R.mB.arrInitial).toBeCloseTo(0.007179, 6);
  });
  it("EAA", () => expect(R.mB.eaa).toBeCloseTo(-1390493.15, 1));
  it("initial outlay includes spare-parts WC", () => expect(R.B.outlay).toBe(33_060_000));
});

describe("Switching values — vs independent bisection", () => {
  it("retention A", () => expect(switching("retA", "A", 0.05, 0.95, BASE)!).toBeCloseTo(0.2941, 3));
  it("capex A", () => expect(switching("capexA", "A", 0.5, 6, BASE)!).toBeCloseTo(3.438, 2));
  it("tariff", () => expect(switching("tariff", "A", 0.05, 1.2, BASE)!).toBeCloseTo(0.2588, 3));
  it("yield", () => expect(switching("yield_", "A", 400, 2400, BASE)!).toBeCloseTo(1012, 0));
  it("retention B", () => expect(switching("retB", "B", 0.05, 0.95, BASE)!).toBeCloseTo(0.5157, 3));
});

describe("Convention deliverables (signed-off spec)", () => {
  const R = run(BASE);
  it("MIRR three conventions ordered: conservative < split = single", () => {
    expect(R.mA.mirrConservative).toBeLessThan(R.mA.mirr);
    expect(R.mB.mirrConservative).toBeLessThan(R.mB.mirr);
  });
  it("declining-balance NPV comparison: earlier tax shield, near-immaterial at 9%", () => {
    const db = npvADecliningBalance(BASE);
    expect(db).toBeGreaterThan(R.mA.npv);
    expect(db - R.mA.npv).toBeCloseTo(77091, 0); // ~1.0% of NPV
  });
});

describe("Multiple-IRR detection on a non-conventional stream", () => {
  it("low retention makes the year-12 inverter outlay flip the sign → G4 fails, MIRR governs", () => {
    const low = run({ ...BASE, retA: 0.1 });
    expect(low.A.fcf[12]).toBeLessThan(0);
    expect(low.mA.signChanges).toBe(3);
    expect(analyze({ ...BASE, retA: 0.1 }).gA.G4).toBe(false);
  });
  it("base case remains conventional: exactly one sign change", () => {
    expect(run(BASE).mA.signChanges).toBe(1);
  });
});

describe("Layer 2 — verdict logic", () => {
  it("base case → conditional accept A (S1 trips)", () => {
    const a = analyze(BASE);
    expect(a.verdict.kind).toBe("accept-a-cond");
    expect(a.verdict.conditions).toHaveLength(2);
    expect(a.gA.G1 && a.gA.G2 && a.gA.G3 && a.gA.G4 && a.gA.G5).toBe(true);
    expect(a.gB.G1).toBe(false);
  });
  it("retention 20% (below the 29.4% switching value) → reject both", () => {
    expect(analyze({ ...BASE, retA: 0.2 }).verdict.kind).toBe("reject-both");
  });
  it("high retention both → an accept verdict on EAA", () => {
    const a = analyze({ ...BASE, retA: 0.9, retB: 0.9 });
    expect(a.gB.G1).toBe(true);
    expect(a.verdict.title).toMatch(/ACCEPT OPTION/);
  });
  it("after-tax salvage: terminal year includes salvage + WC with zero gain", () => {
    const R = run(BASE);
    const lastOcf = R.B.rows[11].ocf;
    expect(R.B.fcf[12]).toBeCloseTo(lastOcf + R.B.salvage + R.B.wc, 6);
  });
  it("100% retention scenario (owner-occupier bound): strongly positive", () => {
    const full = run({ ...BASE, retA: 1 });
    expect(full.mA.npv).toBeCloseTo(27680099, 0);
    expect(full.mA.eaa / 1e6).toBeCloseTo(2.536, 2);
  });
});
