# Assumptions Register
## MAF — Own vs Contract On-Site Generation, Mall of the Emirates

**Compiled:** 8 August 2026
**Purpose:** input contract for the build, editable-input schema for the app, and Section 3 (data and assumptions) of the report.
**Currency:** AED. USD converted at the pegged rate of AED 3.6725 per USD.

**Source class:** 1 = published, directly citable · 2 = published benchmark with judgement applied · 3 = derived estimate, no public source

---

## PART 1 — SOURCED INPUTS

### 1.1 Electricity tariff — CLASS 1, official

| Field | Value |
|---|---|
| Source | DEWA published Slab Tariff schedule, dewa.gov.ae, page last updated 16 May 2026; fuel surcharge stated for August 2026 |
| Residential/commercial slabs | 0–2,000 kWh: AED 0.230 · 2,001–4,000: AED 0.280 · 4,001–6,000: AED 0.320 · above 6,000: AED 0.380 |
| Industrial slabs | 0–10,000 kWh: AED 0.230 · above 10,000: AED 0.380 |
| Fuel surcharge (August 2026) | AED 0.060 per kWh |
| Meter service charge | AED 5 / 6 / 35 per month by meter type |
| VAT | 5%, applicable on tariffs |

**Effective marginal tariff for the model: AED 0.440 per kWh** (top slab 0.380 + fuel surcharge 0.060).

Two judgements to state in the report:

1. **Marginal, not average.** A mall of this scale consumes far more than 6,000 kWh per month, so every kWh displaced is displaced at the top slab. The relevant saving rate is the marginal rate, not a blended average across slabs. Using an average tariff would understate the saving.
2. **VAT excluded.** MAF is VAT-registered, so input VAT on electricity is recoverable and is not an economic cost. Including VAT in the saving would overstate the benefit by 5%. The meter service charge is also excluded — it is unaffected by consumption.

### 1.2 Independent cross-check on the tariff — CLASS 1

Etihad ESCO's JAFZA Package 3 chiller replacement project (delivered with Daikin) is stated to save **3,019,679 kWh annually, worth AED 1,343,757 annually**.

That implies an effective tariff of **AED 0.445 per kWh** — within one fils of the AED 0.440 derived independently from DEWA's published schedule.

This is a genuine independent corroboration from a real Dubai retrofit contract, and it should be in the report. It converts the single most important input in the model from an assumption into a triangulated figure.

### 1.3 Solar resource — CLASS 1

| Field | Value |
|---|---|
| Source | Global Solar Atlas (World Bank ESMAP / Solargis), Dubai site query |
| PVOUT, large-scale ground-mounted at optimum tilt | 1,791.5 kWh/kWp/year |
| Global horizontal irradiation (GHI) | 2,151.8 kWh/m² |
| Global tilted irradiation at optimum angle | 2,336.2 kWh/m² |
| Optimum module tilt | 26° |
| Average air temperature | 28.1 °C |

**Model value: 1,600–1,700 kWh/kWp/year, base 1,650.**

The 1,791.5 figure is for a free-standing, optimally tilted, ground-mounted plant. A rooftop installation on a mall gives up yield to sub-optimal tilt, restricted rear ventilation (higher cell temperature at a 28.1 °C ambient average), and Dubai's soiling losses from dust. Re-run the Global Solar Atlas query with the **medium-size commercial rooftop** system option selected and use that figure directly rather than the ground-mount headline. Sensitise ±10%.

### 1.4 Solar capex — CLASS 2, weakest of the sourced inputs

| Source | Figure |
|---|---|
| UAE installer published range, commercial | AED 1.40–2.00 per W |
| UAE installer, 200 kW commercial rooftop specifically | AED 1.70–2.00 per W |
| US commercial benchmark, 250 kW+ systems | USD 1.10–1.60 per W ≈ AED 4.04–5.88 per W |

**Model value: AED 1.80 per Wp base, sensitised AED 1.40–2.60.**

**Flag this honestly in Limitations.** The UAE and US benchmarks differ by roughly a factor of two to three. Some of that gap is real — lower installation labour cost, no US-style permitting and interconnection soft costs — but not all of it, and the UAE figures come from installer marketing pages rather than audited or survey data. This is the least reliable input in the model and deserves the widest sensitivity band. A multi-MW system should also price below the 200 kW quotes through scale.

### 1.5 Chiller / BMS retrofit savings — CLASS 2

| Project | Reported saving |
|---|---|
| Etihad ESCO, Dubai Maritime City (DP World) | 20% of total consumption of targeted facilities |
| Etihad ESCO, JAFZA Phases 1 & 2 | 31% guaranteed, 32.6% achieved after one year of measurement and verification |
| Etihad ESCO, DEWA HQ ESPC (2015–2024) | 35.2 GWh electricity over six years, including a chilled-water system retrofit with magnetic-bearing chillers |

Note that the JAFZA and DEWA figures are **whole-building** retrofits bundling HVAC, lighting, insulation and water measures. Option B is HVAC-only, so the whole-building percentages cannot be applied directly.

**Model value: 20% of total mall electricity consumption, sensitised 15–25%.** Justification: cooling dominates load in a Dubai mall, so an HVAC-only measure captures most of a whole-building programme's saving, but not all of it. The 20% Dubai Maritime City figure is the closest analogue and sits at the conservative end.

### 1.6 Cost of capital inputs

| Input | Value | Class | Source |
|---|---|---|---|
| Risk-free rate | 4.65% | 1 | US 10-year Treasury, 7 August 2026. Appropriate given the AED peg to the USD |
| UAE country default spread | 0.49% | 1 | Damodaran country risk table (January 2025 edition) |
| UAE country risk premium | 0.66% | 1 | Same |
| UAE total equity risk premium | 4.99% | 1 | Same |
| UAE sovereign rating | Aa2 | 1 | Same |
| MAF total interest-bearing debt | AED 8,398m | 1 | MAFP FY2025 audited statements |
| MAF total equity | AED 44,545m | 1 | Same |
| Debt weight / equity weight | 15.9% / 84.1% | 1 | Derived |
| MAF debt-to-equity | 18.9% | 1 | Derived |
| Implied cost of debt | 4.2%–4.6% | 2 | Interest expense of AED 390m over average interest-bearing debt |
| Corporate tax rate | 9% | 1 | UAE Federal Decree-Law No. 47 of 2022 |

**Refresh before use:** Damodaran publishes equity risk premium updates in January and a country risk update in July each year. The figures above are from the January 2025 edition; January 2026 and July 2026 editions exist. Pull the current numbers from `pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html` and cite that edition.

---

## PART 2 — STILL OPEN

| Input | Class | How to close it |
|---|---|---|
| Unlevered industry beta | 1 | Download `pages.stern.nyu.edu/~adamodar/pc/datasets/betaemerg.xls` (emerging markets) or `betaGlobal.xls`, take the real-estate operations and services row, then relever at MAF's D/E of 18.9% using a 9% tax rate |
| MAF sukuk market yield | 2 | MAF's sukuk are listed on NASDAQ Dubai and Euronext Dublin. If a live yield isn't retrievable, use the 4.2%–4.6% implied rate and label it a book-interest proxy |
| Mall electricity consumption | 3 | MOE gross leasable area × energy use intensity. Anchor the intensity on MAF's own published sustainability/ESG report, which discloses group energy consumption and intensity — that makes the derivation company-anchored rather than generic |
| Usable roof area | 3 | Measure from satellite imagery in Google Earth. Deduct skylights, plant rooms, the Ski Dubai structure and access routes. Record the measurement date and cite it as primary measurement |
| Module degradation rate | 1 | Take the linear performance warranty from a named Tier-1 module datasheet and cite that datasheet. Do not use a generic "about 0.5%" |
| Solar O&M cost | 2 | NREL or IRENA O&M benchmarks, expressed as AED per kWp per year |
| Inverter replacement cost, ~year 12 | 2 | Typically quoted as a share of initial system cost; source from an installer or NREL cost breakdown |
| Chiller retrofit capex | 3 | No published figure. Derive from ESPC economics: Etihad ESCO contracts are structured so guaranteed savings repay the investment within the contract term. Back-solve capex from the annual saving and a stated payback period, and disclose that this is a market-derived inference |
| Chiller spare-parts working capital | 3 | Judgement, small. State as a percentage of annual O&M |
| Landlord retention share | 3 | Judgement. Reason from MAFP's service charge revenue of AED 471m against utilities expense of AED 103m and standard GCC lease structures. **Sensitise widely — this is the decision-critical input** |
| Rooftop opportunity cost | 3 | Judgement. Forgone telecom antenna lease or parking revenue. Keep small, sensitise |
| Tariff escalation rate | 2 | DEWA slab tariffs have been unchanged since the January 2022 update, which is evidence for a low escalation assumption — but low is not zero, and the rate must be tested |
| O&M escalation | 2 | UAE CPI, IMF World Economic Outlook |

---

## PART 3 — REGISTER SCHEMA FOR THE BUILD

Hand Fable this table as CSV or JSON with exactly these fields:

```
input_id, label, value, unit, source_class, source_citation,
sensitivity_low, sensitivity_high, sensitise_in_tornado, notes
```

Rules for the build:

- Every input in the app's input panel maps to one `input_id`. No hard-coded constants anywhere in the engine.
- `source_class` renders in the UI as a small badge next to each input, and class 3 inputs are visually marked as estimates. This is a trust feature, not decoration — it shows the user which numbers are solid and which are judgement.
- `sensitise_in_tornado = true` drives the tornado chart automatically from the register, so the sensitivity analysis cannot drift out of sync with the inputs.
- The same register exports directly as the report's Section 3 table.

---

## PART 4 — TWO THINGS THAT WOULD INVALIDATE THE MODEL

1. **Roof area smaller than the assumed system requires.** At roughly 1 kWp per 6–7 m² of usable roof, check the assumed capacity against the measured area before capex is fixed. If the array doesn't physically fit, every downstream number is fiction.
2. **Landlord retention share near zero.** If mall electricity is fully recharged to tenants through service charges, MAF captures almost none of the saving and both options fail on NPV. Establish a defensible retention share before the model is built, not after.
