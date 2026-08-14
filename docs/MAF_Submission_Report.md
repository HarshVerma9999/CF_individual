# Own-Solar versus Chiller Retrofit at Mall of the Emirates
## A Capital Budgeting Decision for Majid Al Futtaim Properties — Submission Report

## 1. Company and Project Background

Majid Al Futtaim Properties (MAFP) owns Mall of the Emirates (MOE), one of Dubai's largest single electricity consumers, and carries a published Net Positive 2040 commitment. MOE already operates Phase-1 solar: an Enova-built carport array generating ~3 GWh and saving up to AED 1.4m a year. The live question is Phase 2 — and who should own it.

## 2. The Investment Decision

Two mutually exclusive options compete for one capital allocation against the same cost line, MOE's electricity purchases from DEWA (Table 1). Both are cost-reduction projects: the benefit line, avoided electricity purchases, is economically identical to a cash inflow. Because the lives differ (25 vs 12 years), ranking is by Equivalent Annual Annuity, never raw NPV or IRR. MAF's 2023 solar PPA is an out-of-model benchmark, and verdicts are conditional, naming the verifications that would flip them.

**Table 1 — Decision structure**

| | A — Rooftop solar (owned) | B — Chiller/BMS efficiency retrofit |
|---|---|---|
| Scope | 5.0 MWp rooftop PV | VSDs, BMS optimisation, sensors — not plant replacement |
| Life / outlay | 25 yrs / AED 9.00m | 12 yrs / AED 33.06m (incl. 0.5m working capital) |
| Mechanism | Generation credited against the landlord's utility account | 20% reduction in cooling consumption |

[SCREENSHOT 1 — Decision tab: verdict card with rule chips G1–G5, R1–R2, S1–S3]

## 3. Assumptions and Data Sources

Every input carries a source class — 1 published, 2 benchmark-with-judgement, 3 estimate — displayed as a badge in the application and catalogued in Appendix D. The tariff is triangulated three times (Appendix D). The yield is a Class 1, site-specific Global Solar Atlas figure. Two inputs are flagged rather than dressed up: mall consumption (100 GWh), unsourced because MAF discloses landlord-only figures; and Option B's capex, inferred from a benchmark contract's payback with caveats stated. Eight decision-critical inputs are live sliders; remaining constants sit in a badged registry.

## 4. Relevant and Irrelevant Cash Flows

The model admits only incremental, after-tax cash flows: avoided purchases, incremental O&M, the year-12 inverter replacement, the rooftop's opportunity cost, tax effects, after-tax salvage and working-capital movements. Excluded as irrelevant: the already-paid roof feasibility study (sunk), allocated head-office overhead (not incremental), financing flows (captured in the WACC), recoverable VAT, and the consumption-invariant meter charge. The single decisive relevance judgement — who captures the saving — is treated in Section 5 as a modelled input, not a hidden premise.

## 5. Sunk Costs, Opportunity Costs, Working Capital, Depreciation, Taxes, Salvage

The feasibility study is excluded regardless of the decision; the roof is nonetheless charged AED 100k/yr of forgone ancillary income. Working capital is handled honestly: solar needs none, the retrofit carries AED 0.5m of spares recovered at exit. Depreciation is straight-line to salvage, matching MAFP's own policy, and derived from cost, life and salvage rather than free-typed — a declared deviation protecting the tax shield and terminal book value. Tax is the 9% UAE statutory rate; the group's 13.9% effective rate reflects foreign operations and is irrelevant to a UAE asset. After-tax salvage follows S − t(S − BV); depreciating to salvage leaves no taxable gain (Appendix A).

The decisive treatment is the **landlord retention share** — the fraction of each saving MAF actually keeps — modelled separately per option because the two savings are recovered through different mechanisms. Solar generation nets against the landlord's own utility account *before* any recharge process runs; MOE's Phase-1 carport plant is the citable precedent, its reported AED 1.4m saving accruing to MAF at close to full capture. Base: 50%. The retrofit instead shrinks the operating cost pool that the annual service-charge reconciliation already exists to pass through to tenants. Base: 35%. Both are Class 3 judgements and headline sensitivity variables; nothing in the model is more consequential.

[SCREENSHOT 2 — Assumptions rail: per-option retention sliders with source badges and NPV = 0 markers]

## 6. Calculations and Results

Schedules are in Appendix A, the WACC build (7.74%) in Appendix B, and every formula and metric — all three MIRR conventions, both ARR bases — in Appendix C. Table 2 shows the headline results. Option A passes every acceptance gate; Option B fails four of five. One methodological result: at base case A's stream is conventional (one sign change, verified — so the IRR is unique and split-rate MIRR coincides with single-rate), but at a 10% retention share the year-12 inverter outlay flips that year's net flow negative, three sign changes appear, gate G4 fails and MIRR governs. That is the substantive reason MIRR is reported. A second structural finding: rerunning Option A under declining-balance depreciation moves NPV by only AED 77,091 (~1.0%; Appendix F) — at a 9% tax rate, the decision turns on operating economics, not tax engineering.

**Verification.** Beyond the 33-test suite, whose expected values were recomputed from first principles in a separate script, an independent Excel model — a separately constructed cash-flow grid using native NPV/IRR/MIRR — corroborates the engine and independently confirms the sign-change and MIRR-coincidence claims. What this proves is bounded: cross-tool agreement validates arithmetic, never the Class 3 assumptions, which only sources can validate.

**Table 2 — Headline results (base case, WACC 7.74%)**

| Metric | A — Solar | B — Chillers |
|---|---|---|
| NPV | **+AED 8.07m** | **−AED 10.62m** |
| IRR (unique) | 16.9% | 1.2% |
| MIRR (split rates) | 10.5% | 4.3% |
| Profitability index | 1.90 | 0.68 |
| Payback / discounted | 5.8 / 7.9 yrs | 11.3 yrs / never |
| **EAA (ranking metric)** | **+AED 0.74m/yr** | **−AED 1.39m/yr** |
| Gates | G1–G5 pass | G1, G2, G3, G5 fail |

## 7. Comparison of Alternatives

EAA governs the ranking, but at base case it does no work: B is rejected outright — and the reason is this report's central finding. B's capex derives from a real Dubai ESPC in which the identical class of works pays back in **3.7 years** for a payer who keeps **100%** of the site saving. MAF keeps 35%. The same physical retrofit therefore takes **~10.6 years** to repay on MAF's *retained* cash — against a 12-year life, discounting kills it. Its viability threshold, a 51.6% retention share, sits just beyond the sensitivity ceiling. This is why cooling-efficiency measures live inside ESCO contracts with full-bill payers, and why a retrofit that genuinely succeeds for an owner-occupier fails as landlord-owned capex: the economics of the asset are inseparable from the recovery mechanism of its savings. Ownership solar, by contrast, clears its hurdle at half capture. The PPA benchmark completes the picture: ownership LCOE ≈ AED 0.14/kWh against a 0.44 tariff, so Phase 2 creates value under either structure — the ownership question is who takes the performance and balance-sheet risk, and Phase 1's contracted structure is the standing fallback.

## 8. Sensitivity and Scenario Analysis

Break-even is expressed as switching values — the input level at which NPV crosses zero (Appendix E; accounting and cash break-even shown for completeness). Option A survives roughly a 40% adverse move in any single driver; the binding constraint, retention at 29.4%, is also the least-evidenced input, which is precisely why the verdict is conditional on verifying it. The tornado shows tariff, yield and retention as exactly co-dominant — they enter the saving line multiplicatively. Scenarios move variables coherently rather than independently (Table 3): A's worst case is a genuinely joint tail (no single driver flips it alone), and B turns positive only when every driver, including a 50% retention, moves favourably at once. The worst case breaches rule S1, which is what converts "accept" into "accept with named verifications".

**Table 3 — Coherent scenarios (NPV, AED m)**

| | Worst | Base | Best |
|---|---|---|---|
| Option A | −3.56 | +8.07 | +22.66 |
| Option B | −23.90 | −10.62 | +10.00 |

[SCREENSHOT 3 — Risk tab: tornado, switching-value margins, scenario cards]

## 9. Financial and Non-Financial Risks

The dominant financial risk is retention capture — the saving may contractually belong to tenants. Then capex evidence (solar quotes installer-published; B's cost payback-inferred, possibly embedding ESCO margin), soiling (excluded from the yield source, assumed managed within O&M), a tariff flat since 2022, the mid-life inverter, and terminal values. Non-financial: MAFP's 51%-held Enova is exactly the firm that would deliver B — an in-house cost-assumption bias and a related-party governance disclosure; construction around Ski Dubai; unmonetised ESG upside. The fair-value blind spot runs conservative: a DCF cannot see the asset-valuation uplift of an NOI-raising project. Model and AI-reliance risk are named risks whose mitigation is architectural (Section 10).

## 10. AI-Generated Insights and Critical Evaluation

*(The application's AI layer is architecturally bounded: a Gemini narration layer receives only the deterministic engine's payload, computes nothing, decides nothing, refuses out-of-payload questions, and every numeral it emits is round-trip verified before display.)*

**[SECTION 10 PLACEHOLDER — to be written by the author: T1–T3 controlled-test results run against an unassisted LLM (prompts, model and version, date, verbatim responses) and the author's own evaluation of the AI output, per the brief.]**

[SCREENSHOT 4 — AI Analyst tab: verified narration badges and an out-of-payload refusal]

## 11. Final Investment Recommendation

**Reject Option B.** At its ESPC-derived cost it destroys AED 10.6m of value and would need MAF to retain 51.6% of savings that the service-charge machinery exists to pass through. If cooling efficiency is pursued, it belongs in an Enova-delivered ESPC where the contractor carries performance risk — outside this capital allocation.

**Accept Option A, conditional on two named verifications** — the engine's escalation of the failed robustness rule, expressed as switching values: confirm landlord retention of at least 29.4% against MOE's actual lease mechanics (base 50%, anchored on Phase 1's precedent), and a tendered turnkey price no worse than AED 3.44/Wp (quoted: 1.80). Subject to those, ownership solar adds ~AED 8.1m (EAA +0.74m/yr), returns 16.9% against a 7.74% hurdle, and repays in under six years. **Delay is not warranted**: the capex switching value sits 91% above base — far outside any band where waiting has option value — and each year forgone costs ~AED 1.55m of cash flow. If the retention verification fails, the recommendation degrades gracefully to the PPA structure MAF already uses. Every element of this verdict traces to a numbered rule and a computed figure.

[SCREENSHOT 5 — Methodology drawer: assumptions register and brief-compliance mapping]

## 12. Limitations

The retention shares are Class 3 judgements pending lease verification — the recommendation is explicitly conditioned on the decisive one. Mall consumption is unsourced (MAF publishes landlord-only data) and drives both options symmetrically. Option B's capex is inferred from a stated payback on a mosque portfolio (2022) and may embed financing margin. The yield source excludes Dubai soiling; cleaning is an assumption inside O&M, with a ±10% band. EAA assumes like-for-like replacement — conservative-to-wrong for a falling-cost technology. The DCF ignores the fair-value uplift of an NOI-raising asset (conservative for this landlord). Scope is single-asset; portfolio deployment would change procurement economics. Finally, the cross-tool verification bounds its own claim: arithmetic is verified; the judgement inputs can only be validated against sources, and Section 10's limits apply to the AI layer.

---

## Appendix A — Full Cash-Flow Schedules (AED m)

OPTION A
| Yr | Gross saving | Retained (50%) | O&M+opp | Depreciation | EBIT | Tax 9% | OCF | Capex/Salv/WC | FCF |
|---|---|---|---|---|---|---|---|---|---|
| 0 | — | — | — | — | — | — | — | −9.000 | −9.000 |
| 1 | 3.786 | 1.893 | 0.225 | 0.342 | 1.326 | 0.119 | 1.549 | — | 1.549 |
| 2 | 3.805 | 1.902 | 0.230 | 0.342 | 1.331 | 0.120 | 1.553 | — | 1.553 |
| 3 | 3.824 | 1.912 | 0.234 | 0.342 | 1.336 | 0.120 | 1.558 | — | 1.558 |
| 4 | 3.843 | 1.921 | 0.239 | 0.342 | 1.341 | 0.121 | 1.562 | — | 1.562 |
| 5 | 3.862 | 1.931 | 0.244 | 0.342 | 1.345 | 0.121 | 1.566 | — | 1.566 |
| 6 | 3.881 | 1.940 | 0.248 | 0.342 | 1.350 | 0.122 | 1.571 | — | 1.571 |
| 7 | 3.900 | 1.950 | 0.253 | 0.342 | 1.355 | 0.122 | 1.575 | — | 1.575 |
| 8 | 3.919 | 1.960 | 0.258 | 0.342 | 1.359 | 0.122 | 1.579 | — | 1.579 |
| 9 | 3.939 | 1.969 | 0.264 | 0.342 | 1.364 | 0.123 | 1.583 | — | 1.583 |
| 10 | 3.958 | 1.979 | 0.269 | 0.342 | 1.368 | 0.123 | 1.587 | — | 1.587 |
| 11 | 3.978 | 1.989 | 0.274 | 0.342 | 1.373 | 0.124 | 1.591 | — | 1.591 |
| 12 | 3.998 | 1.999 | 0.280 | 0.342 | 1.377 | 0.124 | 1.595 | −0.720 | 0.875 |
| 13 | 4.017 | 2.009 | 0.285 | 0.397 | 1.326 | 0.119 | 1.604 | — | 1.604 |
| 14 | 4.037 | 2.019 | 0.291 | 0.397 | 1.330 | 0.120 | 1.608 | — | 1.608 |
| 15 | 4.057 | 2.029 | 0.297 | 0.397 | 1.334 | 0.120 | 1.612 | — | 1.612 |
| 16 | 4.077 | 2.039 | 0.303 | 0.397 | 1.338 | 0.120 | 1.615 | — | 1.615 |
| 17 | 4.097 | 2.049 | 0.309 | 0.397 | 1.342 | 0.121 | 1.619 | — | 1.619 |
| 18 | 4.118 | 2.059 | 0.315 | 0.397 | 1.346 | 0.121 | 1.623 | — | 1.623 |
| 19 | 4.138 | 2.069 | 0.321 | 0.397 | 1.350 | 0.122 | 1.626 | — | 1.626 |
| 20 | 4.159 | 2.079 | 0.328 | 0.397 | 1.354 | 0.122 | 1.630 | — | 1.630 |
| 21 | 4.179 | 2.090 | 0.334 | 0.397 | 1.358 | 0.122 | 1.633 | — | 1.633 |
| 22 | 4.200 | 2.100 | 0.341 | 0.397 | 1.362 | 0.123 | 1.636 | — | 1.636 |
| 23 | 4.221 | 2.110 | 0.348 | 0.397 | 1.365 | 0.123 | 1.640 | — | 1.640 |
| 24 | 4.242 | 2.121 | 0.355 | 0.397 | 1.369 | 0.123 | 1.643 | — | 1.643 |
| 25 | 4.263 | 2.131 | 0.362 | 0.397 | 1.372 | 0.123 | 1.646 | +0.450 | 2.096 |

OPTION B
| Yr | Gross saving | Retained (35%) | O&M | Depreciation | EBIT | Tax 9% | OCF | Capex/Salv/WC | FCF |
|---|---|---|---|---|---|---|---|---|---|
| 0 | — | — | — | — | — | — | — | −33.060 | −33.060 |
| 1 | 8.800 | 3.080 | 0.300 | 2.659 | 0.121 | 0.011 | 2.769 | — | 2.769 |
| 2 | 8.888 | 3.111 | 0.306 | 2.659 | 0.146 | 0.013 | 2.792 | — | 2.792 |
| 3 | 8.977 | 3.142 | 0.312 | 2.659 | 0.171 | 0.015 | 2.814 | — | 2.814 |
| 4 | 9.067 | 3.173 | 0.318 | 2.659 | 0.196 | 0.018 | 2.837 | — | 2.837 |
| 5 | 9.157 | 3.205 | 0.325 | 2.659 | 0.221 | 0.020 | 2.860 | — | 2.860 |
| 6 | 9.249 | 3.237 | 0.331 | 2.659 | 0.247 | 0.022 | 2.884 | — | 2.884 |
| 7 | 9.341 | 3.269 | 0.338 | 2.659 | 0.273 | 0.025 | 2.907 | — | 2.907 |
| 8 | 9.435 | 3.302 | 0.345 | 2.659 | 0.299 | 0.027 | 2.931 | — | 2.931 |
| 9 | 9.529 | 3.335 | 0.351 | 2.659 | 0.325 | 0.029 | 2.954 | — | 2.954 |
| 10 | 9.624 | 3.369 | 0.359 | 2.659 | 0.351 | 0.032 | 2.978 | — | 2.978 |
| 11 | 9.721 | 3.402 | 0.366 | 2.659 | 0.377 | 0.034 | 3.003 | — | 3.003 |
| 12 | 9.818 | 3.436 | 0.373 | 2.659 | 0.404 | 0.036 | 3.027 | +1.151 | 4.178 |


*Terminal years add after-tax salvage (S − 0.09 × (S − BV); BV = S ⇒ no gain) and, for B, AED 0.5m working-capital recovery. Year-12 Option A deducts the AED 0.72m inverter replacement, depreciated straight-line over years 13–25.*

## Appendix B — Cost of Capital Build

| Component | Value | Source (edition/date) |
|---|---|---|
| Risk-free rate | 4.65% | US 10-yr Treasury, 14 Aug 2026 |
| UAE total equity risk premium | 5.491% | Damodaran country risk premiums, 1 Apr 2026 (UAE row: Aa2, default spread 0.470%, CRP 0.721%; mature-market ERP 4.77%; separate Abu Dhabi CDS variant 5.905% noted, not used) |
| Unlevered beta (primary) | 0.5898 | Damodaran EM industry betas, 5 Jan 2026 — Real Estate (Operations & Services), 406 firms, unlevered corrected for cash (uncorrected 0.5416 as sensitivity; levered 0.7917, industry D/E 0.6132) |
| Relevering | β = 0.5898 × (1 + 0.91 × 0.18853) = **0.6910** | Hamada; MAFP D/E 18.85% (FY2025 audited: debt 8,398 / equity 44,545), tax 9% |
| Cost of equity | Ke = 4.65% + 0.6910 × 5.491% = **8.44%** | CAPM |
| Cost of debt | 4.2–4.6% (midpoint 4.4%; after-tax 4.00%) | Implied, AED 390m interest expense, FY2025 statements |
| Weights | 84.1% equity / 15.9% debt (book ≈ market: investment property at fair value) | FY2025 audited statements |
| **WACC** | **0.841 × 8.44% + 0.159 × kd(1−t) = 7.71–7.77%; base 7.74%** | Nominal, consistent with nominal cash flows |

## Appendix C — Complete Metric Set and Formulas

| Metric | Formula / convention | A — Solar | B — Chillers |
|---|---|---|---|
| NPV | Σ FCFₜ/(1+WACC)ᵗ − outlay | +8,074,218 | −10,621,509 |
| IRR | NPV(r*) = 0; uniqueness by sign-change count | 16.93% (1 sign change) | 1.24% (1) |
| MIRR — split (primary) | (FV₊ @WACC ÷ −PV₋ @kd(1−t))^(1/n) − 1 | 10.54% | 4.32% |
| MIRR — single rate | WACC both sides | 10.54% (= split: only t=0 negative) | 4.32% |
| MIRR — conservative | kd(1−t) both sides | 8.27% | 2.51% |
| Profitability index | PV(all future CFs, yr-12 outflow in numerator) ÷ outlay | 1.897 | 0.679 |
| ARR — average basis (primary) | avg. NOPAT ÷ [(outlay + salvage + WC)/2] | 26.0% | 1.4% |
| ARR — initial basis (footnote) | avg. NOPAT ÷ outlay | 13.7% | 0.7% |
| Payback | cumulative FCF = 0, interpolated | 5.77 yrs | 11.32 yrs |
| Discounted payback | on discounted FCF | 7.92 yrs | never |
| **EAA** | NPV ÷ [(1 − (1+WACC)⁻ⁿ)/WACC] | **+739,655/yr** | **−1,390,493/yr** |
| After-tax salvage | S − t(S − BV) | 450,000 (gain nil) | 960,000 → 651,200 at corrected capex ⇒ see App. A |
| Verdict | Gates G1–G5, rank R1–R2, robustness S1–S3 | **ACCEPT — conditional** (S1 failed) | **REJECT** (G1, G2, G3, G5 failed) |

## Appendix D — Assumptions Register (source class and citation per input)

| Input | Base value | Class | Source / basis |
|---|---|---|---|
| Effective marginal tariff | AED 0.440/kWh | 1 | DEWA slab schedule + Aug-26 fuel surcharge; VAT excluded (recoverable) |
| Tariff cross-checks | 0.445 · 0.467 | 1 | Etihad ESCO JAFZA Package 3; MOE Phase-1 carport (1.4m ÷ 3 GWh, upper bound) |
| Tariff escalation | 1.0%/yr | 2 | DEWA tariffs unchanged since Jan 2022 |
| Specific yield | 1,721 kWh/kWp | 1 | Global Solar Atlas, MOE site, medium commercial rooftop (100 kWp ref: 172.101 MWh/yr; GTI 2,315.3 @ 26°); excludes soiling — flagged |
| Degradation | 0.50%/yr | 1⚠ | Tier-1 module linear warranty (to be cited by name) |
| Solar capex | AED 1.80/Wp | 2 | UAE installer range — weakest solar input; widest band |
| Solar O&M / opportunity cost | AED 125k + 100k/yr, +2% | 2/3 | NREL/IRENA benchmarks; ancillary income judgement |
| Inverter (yr 12) | 8% of capex | 2 | NREL cost breakdown |
| Salvage A / B | 5% / 2% of capex | 3 | Scrap judgement; depreciated to salvage |
| Mall consumption | 100 GWh/yr | 3 | **Unsourced whole-building estimate, flagged** — MAF 2024 annex discloses landlord-only (29 malls: 183.9 GWh elec + 181.6 GWh(th) cooling; 275 kWh/m²) |
| Efficiency gain | 20% of load | 2 | Etihad ESCO Dubai Maritime City analogue; corroborated by benchmark ESPC's 20.43% |
| Chiller retrofit capex | AED 32.56m | 2 | 3.7-yr ESPC payback (Siemens/Etihad ESCO, 2022) × gross saving 8.8m; gross basis deliberate (retained basis would double-count retention); mosque portfolio, payback-inferred, 2022 — caveats stated |
| Retention A / B | 50% / 35% | 3 | Recovery-mechanism asymmetry (§5); Phase-1 carport precedent for A |
| Corporate tax | 9% | 1 | UAE Federal Decree-Law 47/2022 |
| WACC | 7.74% | 1/2 | Appendix B |

## Appendix E — Switching Values and Tornado Data

| Variable | Base | NPV = 0 at | Margin |
|---|---|---|---|
| A: retention share | 50% | 29.4% | −41% |
| A: capex | 1.80/Wp | 3.44/Wp | +91% |
| A: tariff | 0.440 | 0.259 | −41% |
| A: specific yield | 1,721 | 1,012 | −41% |
| B: retention share | 35% | 51.6% | +47% (above 50% ceiling) |
| B: capex | 32.56m | 21.2m | −35% |
| B: efficiency gain | 20% | 29.5% | beyond 15–25% evidence band |

Tornado (Option A NPV, ±20% each input, AED m): tariff 4.15 ↔ 12.00; yield 4.15 ↔ 12.00; retention 4.15 ↔ 12.00 (exact multiplicative symmetry); WACC 10.68 ↔ 5.99; capex 9.85 ↔ 6.30; escalation second-order. Secondary break-evens (A, year 1): accounting (EBIT = 0) at 516 kWh/kWp equivalent load; cash (EBITDA = 0) at 205 — both far below base, which is why financial break-even governs.

## Appendix F — Depreciation Method Comparison (tax-shield immateriality)

| Method | Option A NPV | Δ vs straight-line |
|---|---|---|
| Straight-line to salvage (base; matches MAFP policy) | 8,074,218 | — |
| Double-declining balance (rate 2/25, floored at salvage; inverter SL) | 8,151,309 | **+77,091 (+1.0%)** |

At a 9% statutory rate the accelerated shield is worth ~1% of NPV: the decision turns on operating economics, not depreciation policy.

## References

1. DEWA — published slab tariff schedule and fuel surcharge, dewa.gov.ae (accessed Aug 2026).
2. Majid Al Futtaim Properties LLC — audited consolidated financial statements, FY2025 (EY, 27 Feb 2026).
3. Majid Al Futtaim — 2024 Sustainability Report, Environmental Data Annex (majidalfuttaim.com).
4. Global Solar Atlas (World Bank / ESMAP / Solargis) — MOE site query, medium commercial rooftop configuration.
5. Etihad ESCO — JAFZA Package 3 retrofit disclosure (savings and valuation).
6. Etihad ESCO & Siemens — 115-mosque retrofit ESPC, 2022: 20.43% guaranteed saving, USD 816k/yr, 3.7-yr payback (meconstructionnews.com/32016).
7. Enova / Construction Business News ME / AEC Online — MOE carport solar plant: 7,291 panels, 1,068 carports, 11,996 m², ~3 GWh, savings up to AED 1.4m/yr.
8. Damodaran, A. — Country risk premiums (1 Apr 2026 edition); Emerging-markets industry betas (5 Jan 2026 edition), NYU Stern.
9. US Department of the Treasury — 10-year constant-maturity yield, 14 Aug 2026.
10. NREL / IRENA — solar O&M and cost-breakdown benchmarks.
11. UAE Federal Decree-Law No. 47 of 2022 on corporate tax.
12. Majid Al Futtaim & Yellow Door Energy — solar PPA announcement, 2023.

## Declaration of AI Tools Used

**Claude (Anthropic)** — application and financial-model design, and the design of the controlled T1–T3 tests evaluated in Section 10. **Claude Fable 5** — implementation of the application (engine, interface, tests). **Google Gemini 3.6 Flash** — the application's runtime narration and Q&A layer, restricted to the deterministic engine's payload with numeral round-trip verification. All financial logic is deterministic code; expected values were recomputed independently from first principles (in-repo script `verification/independent_check.py`) and corroborated by an independently built Excel model. The final judgement in Section 11 is the author's.
