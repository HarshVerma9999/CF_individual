"""Independent recomputation of MERIDIAN's base-case metrics from finance first principles.

Written fresh from the textbook definitions — no code shared with the TypeScript engine.
Run `python3 verification/independent_check.py`: it prints the full metric set for both
options; the values are the expected ("golden") values asserted in tests/engine.test.ts.

Base case (2026-08-14): specific yield 1,721 kWh/kWp (Global Solar Atlas, MOE site,
medium commercial rooftop config) and WACC 7.74% (Rf 4.65% US 10Y @ 14-Aug-26;
Damodaran Apr-26 UAE ERP 5.491%; beta 0.6910; kd midpoint 4.4% -> 4.00% after tax).

What this validates: the arithmetic, against the stated formulas and conventions.
What it cannot validate: the Class 3 assumptions (retention shares, mall consumption,
Option B capex) — those are only validated against sources (see README and report §3).
"""

TAX, WACC, KD_AT = 0.09, 0.0774, 0.04


def metrics(fcf, life, outlay, salvage, wc, profits):
    npv = sum(cf / (1 + WACC) ** t for t, cf in enumerate(fcf))

    def pv_at(r):
        return sum(cf / (1 + r) ** t for t, cf in enumerate(fcf))

    lo, hi = -0.9, 1.0
    for _ in range(200):
        m = (lo + hi) / 2
        if pv_at(lo) * pv_at(m) <= 0:
            hi = m
        else:
            lo = m
    irr = (lo + hi) / 2

    pv_neg_kd = sum(-cf / (1 + KD_AT) ** t for t, cf in enumerate(fcf) if cf < 0)
    pv_neg_w = sum(-cf / (1 + WACC) ** t for t, cf in enumerate(fcf) if cf < 0)
    fv_pos_w = sum(cf * (1 + WACC) ** (life - t) for t, cf in enumerate(fcf) if cf > 0)
    fv_pos_kd = sum(cf * (1 + KD_AT) ** (life - t) for t, cf in enumerate(fcf) if cf > 0)
    mirr_split = (fv_pos_w / pv_neg_kd) ** (1 / life) - 1      # finance @ kd, reinvest @ WACC (primary)
    mirr_single = (fv_pos_w / pv_neg_w) ** (1 / life) - 1      # WACC both sides
    mirr_cons = (fv_pos_kd / pv_neg_kd) ** (1 / life) - 1      # kd both sides (conservative)

    pi = sum(cf / (1 + WACC) ** t for t, cf in enumerate(fcf) if t > 0) / outlay

    def payback(flows):
        c = flows[0]
        for t in range(1, len(flows)):
            prev = c
            c += flows[t]
            if c >= 0:
                return t - 1 + (-prev / flows[t])
        return None

    pay = payback(fcf)
    dpay = payback([cf / (1 + WACC) ** t for t, cf in enumerate(fcf)])
    avg_profit = sum(profits) / len(profits)
    arr_avg = avg_profit / ((outlay + salvage + wc) / 2)
    arr_init = avg_profit / outlay
    eaa = npv / ((1 - (1 + WACC) ** -life) / WACC)
    sign_changes = sum(1 for a, b in zip(fcf, fcf[1:]) if a * b < 0)
    return dict(npv=npv, irr=irr, mirr_split=mirr_split, mirr_single=mirr_single,
                mirr_conservative=mirr_cons, pi=pi, payback=pay, disc_payback=dpay,
                arr_avg=arr_avg, arr_initial=arr_init, eaa=eaa, sign_changes=sign_changes)


# ---- Option A: owned 5 MWp rooftop solar, 25 years ----
CAP, Y1, DEG = 5000.0, 1721.0, 0.005
T1, ESC, RET_A = 0.44, 0.01, 0.50
OM1A, OM_ESC = 25 * CAP + 100_000.0, 0.02          # fixed O&M + rooftop opportunity cost
CAPEX_A = CAP * 1000 * 1.80
SALV_A, INV = 0.05 * CAPEX_A, 0.08 * CAPEX_A
LIFE_A, INV_YR = 25, 12
dep_main = (CAPEX_A - SALV_A) / LIFE_A             # straight-line to salvage
dep_inv = INV / (LIFE_A - INV_YR)                  # inverter SL to zero over years 13..25

fcf_a, prof_a = [-CAPEX_A], []
for t in range(1, LIFE_A + 1):
    retained = CAP * Y1 * (1 - DEG) ** (t - 1) * T1 * (1 + ESC) ** (t - 1) * RET_A
    om = OM1A * (1 + OM_ESC) ** (t - 1)
    dep = dep_main + (dep_inv if t > INV_YR else 0)
    ebit = retained - om - dep
    prof_a.append(ebit * (1 - TAX))
    ocf = ebit * (1 - TAX) + dep
    # terminal: book value = salvage -> zero taxable gain -> after-tax salvage = salvage
    fcf_a.append(ocf - (INV if t == INV_YR else 0) + (SALV_A if t == LIFE_A else 0))

# ---- Option B: chiller/BMS efficiency retrofit, 12 years ----
GROSS1, RET_B = 8.8e6, 0.35                        # 100 GWh x 20% x 0.44
OM1B = 300_000.0
CAPEX_B = 3.7 * GROSS1                             # ESPC payback ratio x gross annual saving = 32.56m
SALV_B, LIFE_B, WC_B = 0.02 * CAPEX_B, 12, 500_000.0
dep_b = (CAPEX_B - SALV_B) / LIFE_B

fcf_b, prof_b = [-(CAPEX_B + WC_B)], []
for t in range(1, LIFE_B + 1):
    retained = GROSS1 * (1 + ESC) ** (t - 1) * RET_B
    om = OM1B * (1 + OM_ESC) ** (t - 1)
    ebit = retained - om - dep_b
    prof_b.append(ebit * (1 - TAX))
    fcf_b.append(ebit * (1 - TAX) + dep_b + ((SALV_B + WC_B) if t == LIFE_B else 0))

if __name__ == "__main__":
    a = metrics(fcf_a, LIFE_A, CAPEX_A, SALV_A, 0, prof_a)
    b = metrics(fcf_b, LIFE_B, CAPEX_B + WC_B, SALV_B, WC_B, prof_b)
    print(f"Option B capex = 3.7 x {GROSS1:,.0f} = {CAPEX_B:,.0f}")
    for name, m in (("A — solar (25y)", a), ("B — chillers (12y)", b)):
        print(f"\nOption {name}")
        for k, v in m.items():
            print(f"  {k:18s} {v:,.6f}" if isinstance(v, float) else f"  {k:18s} {v}")

    # retention switching value for A (financial break-even)
    def npv_a(ret):
        f = [-CAPEX_A]
        for t in range(1, LIFE_A + 1):
            r = CAP * Y1 * (1 - DEG) ** (t - 1) * T1 * (1 + ESC) ** (t - 1) * ret
            om = OM1A * (1 + OM_ESC) ** (t - 1)
            dep = dep_main + (dep_inv if t > INV_YR else 0)
            f.append((r - om - dep) * (1 - TAX) + dep - (INV if t == INV_YR else 0)
                     + (SALV_A if t == LIFE_A else 0))
        return sum(cf / (1 + WACC) ** t for t, cf in enumerate(f))

    lo, hi = 0.05, 0.95
    for _ in range(80):
        m = (lo + hi) / 2
        if npv_a(m) < 0:
            lo = m
        else:
            hi = m
    print(f"\nA retention switching value: {(lo + hi) / 2:.4f}")
    print(f"A NPV at 100% retention (owner-occupier bound): {npv_a(1.0):,.0f}")
