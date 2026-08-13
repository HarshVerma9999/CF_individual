import { describe, it, expect } from "vitest";
import { BASE, run, switching, analyze, npvADecliningBalance } from "../lib/engine";

/** Golden values computed independently by the Python reference engine (maf_engine.py, 2026-08-08). */
describe("Option A — golden values vs Python engine", () => {
  const R = run(BASE);
  it("NPV", () => expect(R.mA.npv).toBeCloseTo(6364951.4575, 2));
  it("IRR", () => expect(R.mA.irr!).toBeCloseTo(0.16068945548, 8));
  it("MIRR (split = single here; no negative interim CF)", () =>
    expect(R.mA.mirr).toBeCloseTo(0.10744159026, 8));
  it("PI", () => expect(R.mA.pi).toBeCloseTo(1.70721682861, 8));
  it("payback", () => expect(R.mA.pay!).toBeCloseTo(6.04899080955, 8));
  it("discounted payback", () => expect(R.mA.dpay!).toBeCloseTo(8.77509711, 6));
  it("ARR (average investment)", () => expect(R.mA.arr).toBeCloseTo(0.24419652083, 8));
  it("EAA", () => expect(R.mA.eaa).toBeCloseTo(616764.23497, 2));
  it("IRR unique — exactly one sign change", () => expect(R.mA.signChanges).toBe(1));
  it("initial outlay", () => expect(R.A.outlay).toBe(9_000_000));
});

describe("Option B — golden values vs independent first-principles recomputation", () => {
  // Capex AED 32.56m = 3.7-yr ESPC payback (Siemens/Etihad ESCO retrofit, 2022) × gross saving 8.8m.
  // Expected values recomputed independently in scratchpad/independent_check (fresh arithmetic).
  const R = run(BASE);
  it("NPV", () => expect(R.mB.npv).toBeCloseTo(-11403889.59, 1));
  it("IRR", () => expect(R.mB.irr!).toBeCloseTo(0.01242355, 7));
  it("PI", () => expect(R.mB.pi).toBeCloseTo(0.65505476, 7));
  it("payback recovers undiscounted in yr ~11.3; discounted never", () => {
    expect(R.mB.pay!).toBeCloseTo(11.3183429, 6);
    expect(R.mB.dpay).toBeNull();
  });
  it("EAA", () => expect(R.mB.eaa).toBeCloseTo(-1544748.88, 1));
  it("initial outlay includes spare-parts WC", () => expect(R.B.outlay).toBe(33_060_000));
});

describe("Switching values — golden values vs Python engine", () => {
  it("retention A", () => expect(switching("retA", "A", 0.05, 0.95, BASE)!).toBeCloseTo(0.320672, 4));
  it("capex A", () => expect(switching("capexA", "A", 0.5, 6, BASE)!).toBeCloseTo(3.090001, 4));
  it("tariff", () => expect(switching("tariff", "A", 0.05, 1.2, BASE)!).toBeCloseTo(0.282192, 4));
  it("yield", () => expect(switching("yield_", "A", 400, 2400, BASE)!).toBeCloseTo(1058.22, 1));
  it("retention B", () => expect(switching("retB", "B", 0.05, 0.95, BASE)!).toBeCloseTo(0.5343, 3));
});

describe("Convention deliverables (signed-off spec)", () => {
  const R = run(BASE);
  it("ARR footnote variant — initial-investment basis", () => {
    expect(R.mA.arrInitial).toBeCloseTo(0.1282031734, 8);
    expect(R.mB.arrInitial).toBeCloseTo(0.00717889, 7);
  });
  it("MIRR three conventions: split = single when no interim CF is negative", () => {
    expect(R.mA.mirr).toBeCloseTo(R.mA.mirrSingle, 10);
  });
  it("MIRR conservative (kd both sides) sits below WACC-reinvestment conventions", () => {
    expect(R.mA.mirrConservative).toBeCloseTo(0.0805511248, 8);
    expect(R.mA.mirrConservative).toBeLessThan(R.mA.mirr);
  });
  it("declining-balance NPV comparison: earlier tax shield, near-immaterial at 9%", () => {
    const db = npvADecliningBalance(BASE);
    expect(db).toBeGreaterThan(R.mA.npv); // accelerated depreciation pulls the shield forward
    expect(db - R.mA.npv).toBeCloseTo(78952.3, 0); // ~1.2% of NPV — demonstrates immateriality
  });
});

describe("Multiple-IRR detection on a non-conventional stream", () => {
  it("low retention makes the year-12 inverter outlay flip the sign → G4 fails, MIRR governs", () => {
    const low = run({ ...BASE, retA: 0.1 });
    expect(low.A.fcf[12]).toBeLessThan(0); // net year-12 CF negative
    expect(low.mA.signChanges).toBe(3); // −outlay → +ops → −yr12 → +ops
    const a = analyze({ ...BASE, retA: 0.1 });
    expect(a.gA.G4).toBe(false);
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
  it("retention 25% → reject both", () => {
    const a = analyze({ ...BASE, retA: 0.25 });
    expect(a.verdict.kind).toBe("reject-both");
  });
  it("high retention both → A wins on EAA with both passing", () => {
    const a = analyze({ ...BASE, retA: 0.9, retB: 0.9 });
    expect(a.gB.G1).toBe(true);
    expect(a.verdict.title).toMatch(/ACCEPT OPTION/);
  });
  it("after-tax salvage: terminal year includes salvage + WC with zero gain", () => {
    const R = run(BASE);
    const lastOcf = R.B.rows[11].ocf;
    expect(R.B.fcf[12]).toBeCloseTo(lastOcf + R.B.salvage + R.B.wc, 6);
  });
});
