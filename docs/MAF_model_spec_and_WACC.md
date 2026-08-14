# Model Specification & Cost of Capital Build
## MAF — Own vs Contract On-Site Generation at Mall of the Emirates

**Status:** conventions signed off. See Part 7, which supersedes every **[LOCK?]** marker below.
**Source of company data:** Majid Al Futtaim Properties LLC and subsidiaries, audited consolidated financial statements for the year ended 31 December 2025 (EY, signed 27 February 2026).

---

## PART 1 — DECISION STRUCTURE

| | Option A | Option B |
|---|---|---|
| Description | MAF purchases and owns a rooftop solar PV system at Mall of the Emirates | Chiller plant + building-management-system efficiency retrofit |
| Economic life | 25 years | 12 years |
| Objective | Reduce the mall's electricity cost | Reduce the mall's electricity cost |
| Mutually exclusive? | Yes — single capital allocation against the same cost line at the same asset | |
| Benchmark (not modelled) | Solar PPA, the structure MAF actually uses under its 2023 Yellow Door Energy agreement | |

Because lives differ (25 vs 12), ranking **must** be done on Equivalent Annual Annuity, not raw NPV and not IRR.

---

## PART 2 — CASH-FLOW ARCHITECTURE

### 2.1 Initial outlay (t = 0)

```
Initial outlay = Equipment cost
              + Installation, transport & commissioning
              + Structural / electrical works
              + Increase in net working capital
              − (no disposal proceeds; both options are additions, not replacements)
```

| Component | Option A | Option B |
|---|---|---|
| Equipment | PV modules, inverters, mounting, DC/AC | Chillers, pumps, VSDs, BMS controls |
| Installation & commissioning | Included | Included |
| Working capital | ~nil | Spare-parts and consumables inventory |
| Roof-load feasibility study | **EXCLUDED — sunk cost** (already commissioned and paid) | Not applicable |
| Allocated head-office overhead | **EXCLUDED — not incremental** | **EXCLUDED — not incremental** |

### 2.2 Annual operating cash flow (t = 1 … n)

There is **no incremental revenue**. Both projects are cost-reduction projects. The benefit line is the mall's **avoided electricity purchase from DEWA**, which is economically identical to an inflow.

```
Gross annual saving   = Energy displaced (kWh) × Effective tariff (AED/kWh)
Retained saving       = Gross annual saving × Landlord retention share      ← see Part 5, open issue 1
Less: fixed O&M
Less: variable O&M
Less: opportunity cost (Option A only — rooftop/parking income forgone)
= EBITDA
Less: depreciation
= EBIT
Less: tax @ 9%
= Net operating profit after tax
Add back: depreciation
= Operating cash flow
```

**Option A energy profile:** Energy displaced in year *t* = Installed capacity (kWp) × Specific yield (kWh/kWp/yr) × (1 − degradation)^(t−1)

**Option B energy profile:** Energy displaced = Baseline cooling consumption × Efficiency improvement %, held flat (no degradation assumed; performance maintained through the O&M contract)

**Tariff escalation:** applied to the effective tariff at a stated **nominal** annual rate, with O&M escalated at inflation and discounting at the nominal WACC. A zero-escalation assumption systematically understates both options and penalises Option A disproportionately, since its benefits run to year 25. See Part 7, item 5.

**Mid-life capital outlay (Option A):** inverter replacement in approximately year 12, treated as a capital outflow in that year and depreciated over the remaining life.

> **Technical consequence — this is important.** If the year-12 inverter outlay exceeds that year's operating cash flow, the cash-flow stream changes sign more than once. A non-conventional stream can produce **multiple IRRs or no real IRR**. This is not a nuisance; it is the substantive justification for reporting MIRR, and it should be stated as such rather than presenting MIRR as decoration.

### 2.3 Terminal-year cash flow (t = n)

```
Terminal CF = Final-year operating cash flow
            + After-tax salvage value
            + Recovery of net working capital
```

Where:

```
After-tax salvage = Salvage proceeds − Tax rate × (Salvage proceeds − Book value at t = n)
```

If the asset is depreciated to zero book value, the entire salvage proceed is taxable. **This is the single most common error in this type of submission** — using gross salvage instead of after-tax salvage invalidates NPV, IRR, MIRR and PI simultaneously.

### 2.4 Depreciation

**[LOCK?]** Straight-line, over the asset's economic life, to the estimated salvage value.

Two reasons: MAF Properties itself depreciates property, plant and equipment on a straight-line basis over estimated useful lives (buildings 5–50 years, furniture/fixtures/equipment 3–10 years), so the method matches the company's actual accounting policy; and the UAE corporate tax regime does not impose a prescribed accelerated schedule of the MACRS type, so accounting depreciation is the defensible basis.

**Deviation from the brief, to be declared:** the assignment lists depreciation as a *user input*. Accepting a freely-typed depreciation figure would decouple it from cost, life and salvage, which breaks the tax shield and corrupts the terminal-year book value. In this model depreciation is **derived**; the user selects the *method* and *life*. Flag this in the report as a deliberate correction.

---

## PART 3 — METRIC DEFINITIONS (conventions locked here, not left ambiguous)

| # | Metric | Convention adopted | Note |
|---|---|---|---|
| 1 | Initial project cash flow | As Part 2.1 | |
| 2 | Annual operating cash flows | As Part 2.2 | |
| 3 | Terminal-year cash flow | As Part 2.3 | |
| 4 | Payback period | Cumulative **undiscounted** free cash flow, with fractional-year linear interpolation | |
| 5 | Discounted payback | Same method on cash flows discounted at WACC | |
| 6 | Accounting rate of return | Average annual profit after tax ÷ **average** book investment. Secondary variant on *initial* investment also shown | **[LOCK?]** Both are defensible; average-investment is the more common textbook convention. Must state which is primary |
| 7 | NPV | Discounted at WACC (Part 4) | Primary decision metric |
| 8 | IRR | Rate at which NPV = 0, computed on total project FCF | Report the multiple-root check for Option A |
| 9 | MIRR | Reinvestment rate = WACC; finance rate = after-tax cost of debt | **[LOCK?]** Using WACC for both is the lazier convention. Separating them is more defensible: MAF funds shortfalls at its borrowing cost and reinvests at its opportunity cost |
| 10 | Profitability index | PV of all future cash flows ÷ initial outlay. Mid-life inverter outlay sits in the **numerator** as a negative, not in the denominator | Must be stated — the alternative treatment gives a different PI |
| 11 | Break-even | **Financial break-even**: the effective tariff (AED/kWh) at which NPV = 0, and the specific yield at which NPV = 0. Accounting break-even shown secondarily for completeness | **[LOCK?]** There is no unit sales volume in a cost-saving project, so accounting break-even is close to meaningless here. Financial break-even is the informative version |
| 12 | Sensitivity analysis | One-at-a-time ±10% / ±20% on: effective tariff, capex, specific yield or efficiency gain, O&M, WACC, degradation, landlord retention share. Presented as a tornado on NPV. Plus one two-way table (tariff × capex) | |
| 13 | Scenarios | Best / base / worst, with variables moved **coherently**, not independently | See Part 3.1 |
| — | Equivalent Annual Annuity | EAA = NPV ÷ annuity factor(WACC, n). **The ranking metric.** | Assumes replacement on like terms — an assumption to state, since solar costs are falling |

### 3.1 Scenario design

Sensitivity moves one variable; scenarios move several *together in a way that could actually co-occur*. Independent random movement is not a scenario.

| Variable | Worst | Base | Best |
|---|---|---|---|
| Effective tariff & escalation | Low / flat | Central | High / rising |
| Capex | Over-run | Quoted | Competitive tender |
| Specific yield / efficiency gain | Underperformance | Central | Upper design case |
| O&M | Higher | Central | Lower |
| Landlord retention share | Low | Central | High |

Rationale for correlation: a low-tariff world is one of soft energy prices, which also weakens the incentive to over-specify and tends to coincide with lower realised savings. Moving all variables to their worst value independently produces an incoherent tail, not a scenario.

---

## PART 4 — COST OF CAPITAL

### 4.1 Which entity's WACC?

**MAF Properties LLC**, not MAF Holding. Mall of the Emirates is a MAF Properties asset, and MAFP's risk profile (shopping malls, hotels, communities) is the relevant one. MAF Holding blends in Carrefour retail and leisure operations with materially different business risk. Using Holding's structure for a mall-level asset decision would be a mismatch.

### 4.2 Capital structure — actual, from the FY2025 statements

| Item | AED millions |
|---|---|
| Loans and borrowings — non-current | 8,398 |
| Loans and borrowings — current | nil |
| Term loan from a related party | nil (2024: 1,613) |
| **Total interest-bearing debt (D)** | **8,398** |
| Total equity (including non-controlling interests of 181) | 44,545 |
| **Total capital (D + E)** | **52,943** |
| **Weight of debt** | **15.9%** |
| **Weight of equity** | **84.1%** |

Cross-check: management discloses a net debt-to-equity ratio of 13.2% for 2025, improved from 24.5% in 2024. Cash and cash equivalents were AED 476m with restricted cash of AED 3,452m.

**Why book weights are acceptable here.** Normally market-value weights are required. MAFP carries investment property (AED 42,553m) and land and buildings at **fair value** under IFRS, revalued twice yearly by RICS-registered external valuers. Equity therefore already approximates the market value of net assets rather than historic cost. State this justification explicitly — it converts a methodological weakness into a demonstrated judgement.

**Judgement to document:** the AED 2,938m shareholder contribution is a subordinated capital loan instrument from the parent carrying a 6.35% coupon (AED 175m declared in 2025). It is classified within equity under IFRS and is treated as equity here, but the 6.35% coupon is useful independent evidence of MAF's own pricing of perpetual capital.

### 4.3 Cost of debt

Implied from the accounts: interest expense of AED 390m (including arrangement and participation fees) against average interest-bearing debt gives roughly **4.2%–4.6%** depending on whether the 2024 related-party term loan is included in the average.

**Preferred source:** MAF's sukuk certificates are listed on NASDAQ Dubai and Euronext Dublin, and the accounts confirm their fair value is benchmarked against quoted market price. A market yield is therefore observable and is a better input than a book-interest proxy. **To do:** obtain current yield on a benchmark MAF sukuk.

After-tax cost of debt = kd × (1 − 0.09).

### 4.4 Cost of equity

MAFP is unlisted, so no direct equity beta exists. Build via Hamada:

1. Obtain equity beta for a listed UAE mall/real-estate comparable (Emaar Properties and/or Aldar Properties).
2. Unlever using the comparable's own debt-to-equity and tax rate:
   βu = βe ÷ [1 + (1 − t) × D/E]
3. Relever at MAFP's D/E of **8,398 ÷ 44,545 = 18.9%**:
   βe(MAFP) = βu × [1 + (1 − 0.09) × 0.189]
4. Cost of equity = Rf + βe × ERP

**Inputs still to source:** risk-free rate (US 10-year Treasury is appropriate given the AED's peg to the USD), equity risk premium for the UAE, and the comparable's beta and capital structure. These are open items, not assumptions to invent.

### 4.5 A structural note that reinforces the tax theme

At a 15.9% debt weight and a 9% tax rate, the interest tax shield embedded in WACC is worth only a few basis points. Combined with the near-immaterial depreciation tax shield at 9%, the report has a coherent thread: **in this jurisdiction, tax-driven financial engineering does almost nothing, and the decision turns on operating economics.** That is a genuine finding and more interesting than the usual tax-shield arithmetic.

### 4.6 Tax rate to apply

**9%** — the UAE corporate tax rate, correct for a UAE-domiciled asset.

For contrast in the report: MAFP's group effective tax rate for 2025 was approximately **13.9%** (income tax expense AED 812m on profit before tax of AED 5,862m), higher than the UAE statutory rate because the group operates in Egypt, Oman, Bahrain, KSA and Lebanon. Noting this distinction demonstrates that the accounts were actually read rather than cited.

---

## PART 5 — OPEN ISSUES REQUIRING DECISIONS

### Issue 1 — Who captures the electricity saving? *(material to the project's premise)*

MAFP's 2025 operating expenses include **utilities of only AED 103m** (2024: AED 106m) across 28 shopping malls, 7 hotels and 5 communities, alongside **service charge revenue of AED 471m** recovered from tenants.

A utilities cost that small relative to the asset base is consistent with mall electricity being **recharged to tenants through service charges** rather than borne by the landlord. If that is the mechanism, a solar installation reduces *tenants'* service charges, not MAF's cash outflow — and the direct financial benefit to MAF largely disappears.

This cannot be resolved from the extract reviewed and must be verified. Three possible structures:

| Structure | Who captures the saving | Implication for the model |
|---|---|---|
| Landlord bears and retains utility cost | MAF | Full saving accrues to the project |
| Full pass-through at cost | Tenants | MAF's benefit is indirect only (occupancy, service-charge competitiveness, ESG) |
| Hybrid — landlord retains common-area / central plant, tenant meters unaffected | Split | Model a **landlord retention share** as an explicit input |

**Recommendation:** adopt the hybrid, make *landlord retention share* a named model input, and treat it as a headline sensitivity variable. This is honest, it is almost certainly closest to reality, and it turns a hidden fatal assumption into a visible, tested one.

### Issue 2 — Enova is a related party

MAFP operates **Enova**, a facility and energy management company, as a 51%-held joint arrangement with Veolia (2025 revenue AED 1,746m). A chiller and BMS efficiency retrofit at Mall of the Emirates is precisely Enova's line of business.

This matters two ways: Option B would plausibly be delivered in-house, which affects the credibility of its cost and performance assumptions; and it introduces a related-party dimension worth a line in the non-financial risk section.

### Issue 3 — Fair-value accounting creates a benefit the FCF model cannot see

Because investment property is carried at fair value and shopping mall valuations are driven by net operating income and discount rates, a capex programme that lifts NOI also lifts the carrying value of the asset. The accounts note one shopping mall carried net of an estimated capital expenditure allowance of AED 1,405m required to realise its fair value.

Do **not** attempt to model this — it would double-count. Do note it in Limitations: the DCF captures the cash saving but not the valuation uplift, so the analysis is conservative for a fair-value-accounted landlord.

### Issue 4 — Roof area feasibility check *(must be done before capex is set)*

Usable rooftop area constrains capacity at roughly 1 kWp per 6–7 m². If the assumed system size implies more panel area than the mall's roof can carry, the model is fiction regardless of how correct the arithmetic is. Verify before the capex figure is fixed.

---

## PART 6 — WHAT REMAINS TO SOURCE

| Input | Status | Intended source |
|---|---|---|
| MAF capital structure | **Done** | FY2025 audited statements |
| Cost of debt (book proxy) | **Done — 4.2%–4.6%** | FY2025 statements |
| Cost of debt (market) | Open | Sukuk quoted yield, NASDAQ Dubai / Euronext Dublin |
| Comparable equity beta | Open | Listed UAE real-estate comparable |
| Risk-free rate | Open | US 10-year Treasury |
| Equity risk premium (UAE) | Open | Published country risk premium data |
| DEWA commercial tariff | Open | DEWA published tariff schedule |
| Mall electricity consumption | Open | Estimate from GLA benchmarks; state as assumption |
| Landlord retention share | Open | Judgement — see Issue 1 |
| Installed solar capex per kWp | Open | Current UAE commercial rooftop pricing |
| Specific yield (Dubai) | Open | Solar resource data |
| Degradation rate | Open | Module warranty terms |
| Chiller efficiency gain | Open | Energy-performance-contracting benchmarks |
| Usable roof area | Open | See Issue 4 |

---

## PART 7 — CONVENTIONS SIGNED OFF

This section is authoritative and supersedes every **[LOCK?]** marker above.

| # | Convention | Decision | Additional deliverable it creates |
|---|---|---|---|
| 1 | ARR basis | Average annual profit after tax ÷ **average** book investment | Initial-investment variant as a footnote; one sentence stating ARR is reported for completeness and is not used for the ranking |
| 2 | MIRR | **Split rates** — finance outflows at after-tax cost of debt, reinvest inflows at WACC | Three-row table showing MIRR under split rates, single-rate-at-WACC, and conservative reinvestment. The sensitivity of MIRR to a analyst-chosen assumption is itself the finding |
| 3 | Break-even | **Financial break-even (switching values)** on effective tariff, specific yield, landlord retention share and capex | Small compliance table showing accounting and cash break-even alongside |
| 4 | Depreciation | **Straight-line** over economic life to salvage, matching MAFP's own stated policy | One NPV comparison row computed under declining balance, to *demonstrate* rather than assert that the tax shield is immaterial at 9% |
| 5 | Price basis | **Nominal throughout** — nominal tariff escalation, O&M escalated at inflation, discounted at nominal WACC | Escalation rate carried as an explicit sensitivity variable, since it drives the A-vs-B ranking |
| 6 | Ranking metric | **Equivalent Annual Annuity**, given unequal lives | NPV, IRR, PI reported but explicitly not used to rank |
| 7 | Saving capture | **Landlord retention share** modelled as a named input | Headline sensitivity variable; see Part 5, Issue 1 |

### Real-versus-nominal consistency — non-negotiable

Escalating the tariff in nominal terms while discounting at a real WACC, or holding savings flat in nominal terms while discounting at a nominal WACC, biases the result against the long-life option by construction. This is the most common error in energy-project appraisal. Every rate in the model must be nominal, including the risk-free rate feeding CAPM.
