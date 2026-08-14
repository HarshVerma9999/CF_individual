# Capital Budgeting Analysis: On-Site Energy Investment at Mall of the Emirates
## Majid Al Futtaim Properties LLC — Own-Solar vs. Chiller Retrofit, with PPA Benchmark

**Full-depth analysis (~4,000 words). This is the master document; the 1,300–1,500-word submission version is compressed from it. Figures marked ⚠ are Class 3 estimates or require refresh before submission (see §3).**

---

## 1. Company and Project Background

Majid Al Futtaim Properties LLC (MAFP) is the property arm of the Majid Al Futtaim group, owning and operating 28 shopping malls, 7 hotels and 5 mixed-use communities across the Middle East, with total equity of AED 44.5 billion per its FY2025 audited consolidated financial statements (EY, 27 February 2026). Its flagship asset, Mall of the Emirates (MOE) in Dubai, combines roughly 255,000 m² of gross leasable area with the energy-intensive Ski Dubai indoor ski resort, making it one of the largest single electricity consumers in Dubai's retail sector.

The group has a published **Net Positive 2040** commitment covering carbon and water, which creates a genuine strategic mandate for on-site energy investment. Importantly, MAF already has real-world form here: in 2023 it signed a solar agreement with **Yellow Door Energy** structured as a power purchase agreement (PPA) — third-party ownership — rather than direct ownership. Crucially, **MOE already has solar**: an Enova-built Phase-1 carport plant — 7,291 panels on 1,068 carports spanning 11,996 m², generating ~3 GWh and saving up to AED 1.4m annually (Enova newsroom; Construction Business News ME; aeconline). The decision modelled here is therefore not whether solar works at MOE — Phase 1 proves it does — but **whether MAF funds and owns Phase 2 on the mall roof, or contracts it**. Phase 1 is used as an empirical benchmark throughout: it anchors area-per-kWp (6.9 m²/kWp measured at the site), triangulates the tariff a third time (AED 1.4m ÷ 3 GWh ≈ 0.467/kWh, an 'up to' upper bound), and provides the citable precedent for the solar retention share (§5.3). The real-world PPA is retained as an out-of-model benchmark (§7.3).

All figures are in AED (pegged at 3.6725/USD), nominal terms throughout.

## 2. The Investment Decision

Two mutually exclusive options compete for a single capital allocation against the same cost line (MOE's electricity purchases from DEWA) at the same asset:

| | **Option A — Rooftop Solar PV (owned)** | **Option B — Chiller Plant + BMS Retrofit** |
|---|---|---|
| Scope | 5.0 MWp rooftop PV system, purchased and owned by MAFP | Efficiency retrofit of the existing chiller plant: VSDs on chillers and pumps, BMS controls and optimisation, sensors and metering — not wholesale plant replacement |
| Economic life | 25 years | 12 years |
| Mechanism | Generates electricity, displacing DEWA import at the landlord's bulk meter | Reduces cooling consumption of the central plant by an estimated 20% of total mall load |
| Initial outlay | AED 9.0m | AED 33.06m (incl. AED 0.5m spare-parts working capital) |

Both are **cost-reduction projects**: there is no incremental revenue. The benefit line is the avoided electricity purchase, which is economically identical to a cash inflow (§4). Because the lives differ (25 vs. 12 years), the ranking metric is **Equivalent Annual Annuity (EAA)**, not raw NPV and not IRR (§7.1).

The decision verdict set is: Accept A / Accept B / Reject Both / Delay / Review Further — with "Review Further" refined into **conditional verdicts** that name the specific verifications that would flip them (§6.4, §11).

## 3. Assumptions and Data Sources

Every input carries a source class: **Class 1** = published and directly citable; **Class 2** = published benchmark with judgement applied; **Class 3** = derived estimate, no public source. The application renders these as badges beside each input; Class 3 inputs are visually flagged as estimates. Eight decision-critical inputs (tariff, escalation, both retention shares, solar capex, yield, efficiency gain, WACC) are live, user-editable sliders; the remaining constants are centralized in a single typed registry, displayed in the interface with their source badges but not user-editable.

| Input | Value (base) | Class | Source / basis |
|---|---|---|---|
| Effective marginal tariff | AED 0.440/kWh | 1 | DEWA slab schedule (top slab 0.380 above 6,000 kWh/month) + fuel surcharge 0.060 (Aug 2026). VAT excluded — recoverable input VAT for a VAT-registered landlord |
| Tariff cross-checks | AED 0.445 · 0.467/kWh | 1 | Triangulated twice: Etihad ESCO JAFZA Package 3 (3,019,679 kWh/yr valued AED 1,343,757/yr → 0.445, within one fils of DEWA-derived); MOE's own Phase-1 carport plant (AED 1.4m on 3 GWh → 0.467 — an 'up to' figure, treated as an upper bound). *Caveat: neither disclosure states its VAT/tariff basis* |
| Tariff escalation | 1.0%/yr nominal (sens. 0–2.5%) | 2 | DEWA tariffs unchanged since January 2022 — evidence for low, not zero |
| Solar specific yield | 1,721 kWh/kWp/yr | 1 | Global Solar Atlas, MOE site, medium commercial rooftop configuration (100 kWp reference): 172.101 MWh/yr. Site parameters: GHI 2,136.4 kWh/m², DNI 1,828.3, DIF 896.2, GTI 2,315.3 kWh/m² at 26° optimum tilt, azimuth 180°, air temp 28.1°C, elevation −3 m. **Excludes soiling — material in Dubai**: the O&M line is assumed to include cleaning sufficient to sustain the figure (a stated assumption, not a verified fact), and the ±10% sensitivity band covers soiling shortfall |
| Module degradation | 0.50%/yr | 1⚠ | To be cited from a named Tier-1 module linear performance warranty |
| Solar capex | AED 1.80/Wp (sens. 1.40–2.60) | 2 | UAE installer range 1.40–2.00 commercial; **weakest sourced input** — US benchmarks are 2–3× higher; widest sensitivity band assigned |
| Solar O&M | AED 25/kWp/yr, +2%/yr | 2 | NREL/IRENA O&M benchmarks converted ⚠ |
| Inverter replacement | 8% of capex, year 12 | 2 | NREL cost-breakdown convention ⚠ |
| Rooftop opportunity cost | AED 100k/yr | 3 | Forgone antenna/ancillary income; deliberately small, sensitised |
| Salvage (A) | 5% of capex, year 25 | 3 | Scrap/secondary value judgement |
| Mall consumption | 100 GWh/yr | 3 | **Unsourced whole-building estimate, flagged as such.** MAF's 2024 Environmental Data Annex discloses landlord shared-services consumption only (29 malls: 183.9 GWh electricity + 181.6 GWh(th) chilled water; landlord electricity intensity 275 kWh/m²/yr) — no whole-building per-mall figure is published, and deriving one would stack three further unpublished judgements (MOE portfolio share, cooling COP, tenant consumption). Drives both options' savings symmetrically |
| Chiller efficiency gain | 20% of total load (sens. 15–25%) | 2 | Etihad ESCO Dubai Maritime City: 20% (closest HVAC analogue). JAFZA's 31–33% and DEWA HQ figures are whole-building bundles — not directly applicable |
| Chiller retrofit capex | AED 32.56m | 2 | Derived: 3.7-year contract payback of the Siemens/Etihad ESCO retrofit ESPC (2022; 115 mosques + 2 buildings, 20.43% guaranteed saving, USD 816k/yr, 6-yr M&V) × Option B's base-case gross annual saving of AED 8.8m. The ratio is external to this model, so the derivation is not circular. The payback prices capex against the *gross* site saving — the benchmark payer captures 100% of its saving, so gross = retained at source; applying it to retained saving instead would double-count MAF's retention share. Caveats: mosque portfolio, not a mall (different load profile/hours); cost inferred from a stated payback, may embed ESCO financing margin; 2022 source. The contract's 20.43% guaranteed saving independently corroborates the 20% efficiency assumption from a separate Etihad ESCO contract |
| Landlord retention — A | 50% (sens. 30–70%) | 3 | See §5.3 — decision-critical |
| Landlord retention — B | 35% (sens. 20–50%) | 3 | Deliberately **lower than A** — see §5.3 |
| Corporate tax | 9% | 1 | UAE Federal Decree-Law No. 47 of 2022 |
| WACC | 7.74% (range 7.71–7.77%) | 1/2 | Rebuilt in §6.1: Rf 4.65% (US 10-yr Treasury, 14 Aug 2026); Damodaran Apr-2026 UAE row (Aa2, default spread 0.470%, CRP 0.721%, total ERP 5.491%; the separate Abu Dhabi row incl. a 5.905% CDS variant noted and not used); Damodaran EM Real Estate (Operations & Services) beta, Jan-2026, 406 firms — unlevered-corrected-for-cash 0.5898 primary (0.5416 uncorrected as sensitivity) |

**Feasibility gate — now empirically anchored:** MOE's Phase-1 carport plant occupies 11,996 m² for ~1,745 kWp (3 GWh ÷ 1,721 kWh/kWp), i.e. **6.9 m²/kWp measured at the actual site**. A 5 MWp Phase-2 array therefore requires ~34,500 m². MOE's gross roof exceeds this several-fold, but Ski Dubai, skylights, HVAC plant and access routes must be netted off — usable *roof* area (as opposed to the carport figure) remains unmeasured, and if it proves smaller, capacity scales down and all Option A figures rescale approximately linearly.

## 4. Relevant and Irrelevant Cash Flows

The model admits only **incremental, after-tax cash flows**:

**Relevant:** avoided DEWA purchases (a cost saving is economically identical to an inflow); incremental O&M; the year-12 inverter replacement; the rooftop opportunity cost (income MAF forgoes by covering the roof); tax effects; after-tax salvage; working-capital movements.

**Irrelevant, and excluded:** the **roof-load feasibility study** (already commissioned and paid — a sunk cost regardless of the decision); **allocated head-office overhead** (not incremental — group overhead does not change); **depreciation as a cash item** (non-cash; it enters only through the tax shield); **financing flows** (interest and principal are captured in the WACC, not the cash flows — including them would double-count); **VAT** (recoverable, hence not an economic cost); the **meter service charge** (unaffected by consumption).

The single most consequential relevance judgement is *who captures the saving* — treated in §5.3 as an explicit modelled input rather than a hidden assumption.

## 5. Treatment of Key Items

### 5.1 Sunk costs and opportunity costs
The feasibility study is sunk and excluded. The rooftop opportunity cost is included at AED 100k/yr for Option A only: capital budgeting requires charging a project for resources it consumes even when no cash changes hands today.

### 5.2 Working capital
Solar requires essentially none — stated honestly rather than inventing a figure to satisfy the input list. The chiller retrofit carries AED 0.5m of spare-parts and consumables inventory, invested at t=0 and recovered in the terminal year. The application accepts working capital as an input for both options, satisfying the brief; Option A's is simply zero.

### 5.3 Who captures the saving — the landlord retention share
MAFP's FY2025 accounts show **utilities expense of only AED 103m** against **service-charge revenue of AED 471m** across the whole portfolio — consistent with mall electricity being substantially recharged to tenants. If savings pass to tenants through lower service charges, MAF's direct benefit shrinks toward zero. Rather than hide this, the model names a **landlord retention share** and makes it a headline sensitivity variable — and it is modelled **separately per option**, because the two options displace *different electricity*:

- **Option A (solar)** offsets the landlord's bulk DEWA import at the meter — the saving arises on MAF's own invoice before recharge mechanics, and MAF-operated loads (Ski Dubai, hotel, common areas) are landlord-borne. The citable precedent is MOE's own Phase-1 carport plant: it sits on the car park — landlord load — and its reported AED 1.4m annual saving accrues to MAF, close to full capture. A rooftop Phase 2 feeding the same landlord meter starts from that precedent, haircut to a base retention of **50%** for the share of generation displacing service-charge-recoverable load.
- **Option B (chillers)** reduces *central-plant cooling* — precisely the consumption most likely to flow through the service charge to tenants at cost under standard GCC lease structures. Base retention: **35%**.

Forcing these equal would quietly bias the ranking; separating them converts a hidden fatal assumption into a visible, tested one.

### 5.4 Depreciation and tax
Straight-line to salvage over economic life — matching MAFP's own stated accounting policy (buildings 5–50 years, equipment 3–10 years), defensible because UAE corporate tax prescribes no MACRS-style schedule. **Declared deviation from the brief:** depreciation is *derived* (from cost, life, salvage), not free-typed — a free input would decouple the tax shield from the terminal book value and corrupt both. The user selects method and life. Tax is 9% (statutory UAE rate; the group's 13.9% effective rate reflects foreign operations and is not relevant to a UAE asset). At 9%, the depreciation tax shield is nearly immaterial — a structural finding developed in §6.5.

### 5.5 Salvage value
After-tax salvage = proceeds − tax × (proceeds − book value). Because assets are depreciated *to* salvage, terminal book value equals expected proceeds and no taxable gain arises at base case; the formula is live in the engine, so any user override that creates a gain is taxed correctly. Using gross salvage — the most common error in this genre — would corrupt NPV, IRR, MIRR and PI simultaneously.

## 6. Calculations and Results

### 6.1 Cost of capital
Entity: **MAFP, not MAF Holding** — MOE is a MAFP asset and Holding blends in retail/leisure risk. From the FY2025 statements: interest-bearing debt AED 8,398m, equity AED 44,545m → weights 15.9% / 84.1% (book weights are acceptable because investment property is carried at fair value, externally revalued — equity approximates market value of net assets). Cost of debt: 4.2–4.6% implied from AED 390m interest expense (sukuk market yield preferred when retrievable ⚠); midpoint 4.4%, after-tax 4.00%. Cost of equity via Hamada, from named editions: Damodaran's emerging-markets Real Estate (Operations & Services) industry beta (updated 5 Jan 2026, 406 firms) — levered 0.7917, industry D/E 0.6132, unlevered 0.5416, **unlevered corrected for cash 0.5898**, taken as primary because a single-asset appraisal should not inherit the industry's cash drag (0.5416 kept as a sensitivity). Relevered at MAFP's D/E of 18.85% at 9% tax: β = 0.5898 × (1 + 0.91 × 0.18853) = **0.6910**. With Rf 4.65% (US 10-yr Treasury, 14 Aug 2026) and Damodaran's Apr-2026 UAE total ERP of 5.491% (Aa2; default spread 0.470%; CRP 0.721%; mature-market ERP 4.77%): **Ke = 4.65% + 0.6910 × 5.491% = 8.44%**. **WACC = 0.841 × 8.44% + 0.159 × kd(1−t) = 7.71–7.77% across the kd range; base 7.74%** (nominal — consistency with nominal cash-flow escalation is enforced; mixing real and nominal is the classic energy-appraisal error).

### 6.2 Cash-flow construction (formulas)
Initial outlay = equipment + installation/commissioning + ΔNWC. Annual operating cash flow: gross saving (kWh displaced × tariff, escalated) × retention share − O&M − opportunity cost = EBITDA; − depreciation = EBIT; − tax @9% = NOPAT; + depreciation = OCF. Solar output degrades at 0.5%/yr; the chiller saving is held flat (maintained under O&M contract). Terminal year adds after-tax salvage + NWC recovery. Option A carries the year-12 inverter outlay as capex, depreciated over the remaining 13 years.

Year-1 illustration (Option A): 5,000 kWp × 1,721 = 8.61 GWh; × 0.440 = AED 3.79m gross; × 50% = 1.89m retained; − 0.225m O&M/opportunity − 0.342m depreciation → EBIT 1.33m; tax 0.12m; **OCF ≈ AED 1.55m**.

### 6.3 Results — all thirteen required measures

| Metric | **Option A — Solar** | **Option B — Chillers** |
|---|---|---|
| 1. Initial cash flow | −AED 9.00m | −AED 33.06m |
| 2. Operating CF (yr 1) | +1.55m | +2.77m |
| 3. Terminal-year CF (op. CF + salvage + NWC) | +2.10m (yr 25) | +4.18m (yr 12) |
| 4. Payback | 5.8 years | 11.3 years |
| 5. Discounted payback | 7.9 years | **never recovers** |
| 6. ARR (avg-investment basis; initial-investment variant in footnote) | 26.0% (13.7%) | 1.4% (0.7%) |
| 7. **NPV @ 7.74%** | **+AED 8.07m** | **−AED 10.62m** |
| 8. IRR | 16.9% (unique — single sign change verified) | 1.2% |
| 9. MIRR (split rates; single-rate and conservative variants in-app) | 10.5% (10.5% / 8.3%) | 4.3% (4.3% / 2.5%) |
| 10. Profitability index | 1.90 | 0.68 |
| 11. Break-even (switching values) | §6.4 | §6.4 |
| 12–13. Sensitivity & scenarios | §8 | §8 |
| **EAA (ranking metric)** | **+AED 740k/yr** | **−AED 1.39m/yr** |

Three convention notes the numbers force into the open. **(i)** At base case Option A's cash-flow stream is **conventional**: the year-12 operating inflow exceeds the inverter outlay, the engine's sign-change check verifies a single sign change, the IRR is unique, and split-rate MIRR (finance at 4.0%, reinvest at 7.74%) coincides with single-rate MIRR because no interim cash flow is negative. The stream becomes **non-conventional at low retention shares**: in the engine's test at a 10% retention share, year-12 net cash flow turns negative (−AED 0.58m), three sign changes are detected, gate G4 fails, and MIRR governs — which is the substantive reason MIRR is reported. All three MIRR conventions (split, single-rate, conservative) are computed and displayed in the application. **(ii)** PI places the mid-life outlay in the numerator as a negative, not the denominator — the alternative convention yields a different PI and must be declared. **(iii)** ARR is reported for completeness and used for nothing: it ignores time value and cash timing.

### 6.4 Break-even as switching values
There is no unit sales volume in a cost-saving project, so accounting break-even is nearly meaningless; the informative version is **financial break-even** — the input value at which NPV = 0:

| Variable | Base | Switching value | Margin from base |
|---|---|---|---|
| A: retention share | 50% | **29.4%** | −41% |
| A: capex | 1.80/Wp | 3.44/Wp | +91% |
| A: tariff | 0.440 | 0.259 | −41% |
| A: specific yield | 1,721 | 1,012 | −41% |
| B: retention share | 35% | **51.6%** | +47% (just above the 50% sensitivity ceiling) |
| B: capex | 32.56m | 21.2m | −35% |
| B: efficiency gain | 20% | 29.5% | beyond the 15–25% evidence band |

Option A survives a ~40% deterioration in any single driver. Option B's rejection is a retention-structure finding, not a capex artifact: its viability threshold (retention ≥ 51.6%) sits just above the sensitivity ceiling of 50%, and central-plant savings are the *most* likely to be recharged to tenants. The same physical retrofit that pays back in 3.7 years for the benchmark's owner-occupier payer (100% saving capture) stretches to ~10.6 years on MAF's retained cash at 35% capture — against a 12-year life, discounting kills it.

### 6.5 A structural finding: tax does almost nothing here
At a 9% tax rate and 15.9% debt weight, the depreciation tax shield and the interest shield inside WACC are worth basis points, not percentage points (the application's declining-balance comparison quantifies it: Option A's NPV rises by AED 77,091 on a base of AED 8.07m, approximately 1.0%). Unlike the US-textbook setting, **the decision turns entirely on operating economics — tariff, yield, capex and, above all, who captures the saving.** This is a genuine jurisdictional insight, not a modelling convenience.

### 6.6 Independent cross-tool verification
Beyond the engine's test suite (33 assertions whose expected values were recomputed independently from first principles), an **independent Excel model** was built from scratch: a separately constructed cash-flow grid evaluated with Excel's native NPV/IRR/MIRR functions. It corroborates the engine's Option B metrics closely, and independently confirms two engine claims: split-rate MIRR equals single-rate MIRR because only year 0's cash flow is negative, and the base-case FCF stream has exactly one sign change, so the IRR is unique. The exercise also demonstrated the audit value of cross-tool checks: reconciling the two models surfaced the per-option retention shares (A 50%, B 35%) as the decisive assumption to hold in view — a uniform-retention rebuild moves Option A's NPV from +8.07m to +2.19m at 35%, and to +27.68m at 100%. **What this verification does not prove:** it validates arithmetic against the stated formulas. The Class 3 assumptions — retention shares, mall consumption, Option B's capex — cannot be validated by any amount of recomputation, only against sources; §3 and §12 mark their status honestly.

## 7. Comparison of Alternatives

### 7.1 Why EAA governs
With unequal lives (25 vs. 12), raw NPV comparison favours the longer project mechanically, and IRR favours small-denominator projects. EAA converts each NPV into a constant annual equivalent over its own life at the WACC — the correct like-for-like. Here the point is moot in outcome (B is value-destroying on every metric) but the method matters: had B's retention share been high, a naive NPV ranking could have misled. EAA assumes replacement on like terms — flagged as a limitation since solar costs are falling (§12).

### 7.2 Verdict logic (deterministic rule engine)
Option A passes all five gates (NPV>0, PI>1, IRR>WACC, IRR unique, discounted payback within life). The three gate rules G1–G3 are mathematically equivalent for conventional streams and can only diverge when signs flip more than once — displayed as one confirmation, not three independent proofs. Option B fails G1/G2/G3/G5 → **Reject B**. Robustness testing (§8) trips rule S1 on Option A (worst-case NPV < 0), which escalates the verdict from "Accept A" to a **conditional accept** — §11.

### 7.3 The PPA benchmark (out-of-model, by design)
MAF's actual 2023 structure is a Yellow Door Energy PPA — zero capex, no ownership. A PPA has no initial investment, so payback, IRR and PI degenerate by construction; modelling it as a third option would manufacture meaningless metrics. Instead, a single benchmark line: ownership's **levelised cost of energy ≈ AED 0.14/kWh** (PV of capex, O&M, inverter, net of salvage ÷ PV of generated kWh, at 7.74%), versus the DEWA marginal tariff of 0.440, the ~0.467 implied by Phase 1's own reported saving, and typical UAE commercial rooftop PPA rates of roughly AED 0.14–0.20/kWh ⚠. Phase 1 itself — Enova-built, on MAF's books via its own JV — is the standing precedent that on-site solar at MOE delivers; the Phase-2 question is purely who funds and owns the expansion. Reading: ownership and PPA deliver broadly similar energy cost, but ownership retains the margin (and the risks — performance, O&M, obsolescence) while the PPA converts them into a contracted price. MAF's own revealed preference for the PPA is consistent with a landlord prioritising balance-sheet capacity for core mall development. Our analysis shows ownership *also* clears the hurdle rate if — and only if — the retention share holds.

## 8. Sensitivity and Scenario Analysis

**One-at-a-time (±20%) tornado on NPV, Option A:** tariff, yield and retention are equally dominant (each swings NPV between +4.2m and +12.0m — they enter the saving line multiplicatively, so identical percentage moves have identical effects, a symmetry the tornado makes visible). Capex swings NPV between +9.9m and +6.3m; WACC between +10.7m and +6.0m; O&M, degradation and escalation are second-order. For Option B, no ±20% move on any single variable turns NPV positive — the tornado's most important message.

**Scenarios (coherent, not independent):** variables are moved together only as they could co-occur — a soft-energy-price world pairs a flat tariff with weaker realised savings and easier procurement; a tight-energy world pairs rising tariffs with premium capex. Moving every variable to its worst value independently produces an incoherent tail, not a scenario.

| | Worst | Base | Best |
|---|---|---|---|
| Option A NPV | **−AED 3.56m** | +8.07m | +22.66m |
| Option A EAA | −332k | +740k | +2,076k |
| Option B NPV | −23.90m | −10.62m | +10.00m |

Option A's worst case is no longer attributable to a single driver: at 30%, worst-case retention now sits marginally *above* the base-case switching value of 29.4%, and the negative outcome arises from the coherent combination (flat tariff, −10% yield, +20% capex, higher O&M) — a genuinely joint tail rather than one fragile input. Option B turns positive (+10.00m) only in the coherent best case, where every driver — including a retention share of 50% — moves favourably at once. Rule S1 (worst-case NPV > 0) therefore fails for A → the engine escalates to a conditional verdict. Rules S2 (all switching values >20% from base) and S3 (EAA ranking never reverses under any single-variable run) both pass.

## 9. Financial and Non-Financial Risks

**Financial:** retention-share risk (dominant — the saving may be contractually the tenants'); capex uncertainty on solar (UAE quotes are installer marketing, benchmarked 2–3× below US survey data — widest band in the model); performance risk (yield, degradation, soiling); tariff risk (DEWA rates are administratively set and have been flat since 2022 — escalation could stay at zero); mid-life inverter cost; terminal-value risk.

**Non-financial:** *related-party dimension* — MAFP's 51%-held Enova (JV with Veolia, revenue AED 1,746m) is precisely the firm that would deliver Option B, so its cost and performance assumptions carry an in-house bias risk and a governance disclosure obligation. Roof structural and Ski Dubai operational constraints during installation. ESG/reputational upside not monetised. *Model risk and AI-reliance risk* are treated as named, mitigated risks: the mitigation is architectural (§10).

**Fair-value blind spot (conservatism, not risk):** because investment property is carried at fair value and mall valuations capitalise NOI, an NOI-raising project also lifts the asset's carrying value. This is deliberately *not* modelled (it would double-count the same cash flows) but noted: the DCF understates the benefit to a fair-value-accounted landlord.

## 10. AI-Generated Insights and Critical Evaluation

**Architecture.** The application separates three layers: a deterministic **calculation engine** (all thirteen measures + EAA; pure functions; no LLM); a deterministic **decision engine** (auditable rules G1–G5, R1–R2, S1–S3; every verdict cites the rule IDs that fired); and an **LLM narration layer** that explains the verdict in plain language, receives only the engines' structured output, and is forbidden to compute, to state any number absent from the payload, or to alter the verdict. A post-processor extracts every numeral from the narration and matches it against the payload — "the AI cannot hallucinate a financial figure" is a *verified property*, not a claim. If the LLM layer fails entirely, the application still produces a complete, correct answer.

**Controlled tests.** Three prompts were designed for an unassisted LLM (no engine, no guardrails): **T1** — rank the two projects from raw cash flows (probes IRR/payback ranking of unequal-life projects instead of EAA); **T2** — compute terminal-year cash flow given salvage and book value (probes gross- vs. after-tax salvage); **T3** — state the annual saving to MAF given the service-charge structure (probes attribution of the full gross saving to the landlord). ⚠ **[RUN AND RECORD: exact prompts, model + version, date, verbatim responses — results must be reported as observed, not assumed. Both outcomes are publishable: an error vindicates the deterministic layer directly; a correct answer supports the subtler finding that the unassisted model offers no audit trail, no demonstration of correctness, and no repeatability assurance — correctness without verifiability is not reliability in a financial-control environment.]**

**Student evaluation.** The AI's genuine contribution is translation and interrogation — making a tornado chart discussable by a non-finance mall manager — not analysis. Its limitations are structural: it cannot detect an engine error (it explains whatever it is given), it surfaces only risks the rules were designed to flag, and it cannot judge whether an assumption is realistic, only how much it matters. The final judgment in §11 is the analyst's, resting on the deterministic results.

## 11. Final Recommendation

**Reject Option B.** At its ESPC-derived capex of AED 32.56m the chiller/BMS retrofit still destroys value (NPV −10.6m; EAA −1.39m/yr): it would require the landlord to retain 51.6% of central-plant savings, just above the 50% sensitivity ceiling and against a base assumption of 35% — and central-plant savings are precisely the ones standard GCC service-charge structures pass to tenants. The rejection is a retention-structure finding: the identical works pay back in 3.7 years for the benchmark's owner-occupier payer with 100% saving capture, but stretch to ~10.6 years on MAF's retained cash — which is why this measure thrives inside ESCO contracts with full-bill payers, and why it fails as an owned capital project here. If cooling efficiency is pursued, it belongs in an Enova-delivered ESPC where the contractor carries performance risk — outside this capital allocation.

**Accept Option A, conditional on two named verifications** (this is the engine's escalation of rule S1, expressed as the switching values that flip it):

1. **Landlord retention ≥ 29.4% of the solar saving**, confirmed against MOE's actual lease and service-charge mechanics before commitment (base assumption 50%, itself anchored on Phase 1's landlord-load precedent).
2. **Tendered turnkey capex ≤ AED 3.44/Wp** — comfortably above the quoted 1.80, so a competitive tender should clear it with a wide margin; the condition exists because UAE pricing evidence is weak.

Subject to those verifications, ownership solar adds ~AED 8.1m of value (EAA +740k/yr), returns 16.9% against a 7.74% hurdle, and recovers its capital in under six years. **Delay is not warranted:** falling module prices are real, but the capex switching value is 91% above base — far outside the 15% band where waiting has option value — and each year of delay forgoes ~AED 1.55m of operating cash flow. The PPA benchmark remains the fallback if the retention verification fails: it monetises the same ESG commitment without balance-sheet exposure.

*Structure of this verdict: gates G1–G5 passed (A), failed (B); ranking R1 decisive with R2's 5% tolerance not engaged; S1 failed → conditional form; S2, S3 passed. Every element traces to a numbered rule and a computed figure.*

## 12. Limitations

(1) The retention share — the decision-critical input — is a Class 3 judgement pending lease-structure verification; the recommendation is explicitly conditioned on it. (2) UAE solar capex evidence is installer-published, not audited; mitigated by the widest sensitivity band and a tender condition. (3) Mall consumption (100 GWh/yr) is an unsourced whole-building estimate and is flagged as such: MAF's 2024 Environmental Data Annex discloses landlord shared-services figures only, so no whole-building per-mall anchor exists; it drives both options' savings symmetrically. Usable roof area remains pending satellite measurement. (3b) Option B's capex is inferred from a benchmark ESPC's stated payback (mosque portfolio, 2022, possible embedded financing margin) rather than a disclosed capex. (4) EAA assumes like-for-like replacement, conservative-to-wrong for a falling-cost technology. (5) The DCF cannot see the fair-value uplift of an NOI-raising project — the analysis is conservative for this landlord. (6) DEWA tariff escalation is administratively set and unforecastable; tested from zero. (7) Single-asset, single-technology scope: portfolio-level deployment across 28 malls would change procurement economics. (8) The LLM layer's limitations are enumerated in §10 and are mitigated, not eliminated.

---

*Declaration: AI tools used — Claude (Anthropic) for application architecture, calculation-engine implementation and drafting; Google Gemini (gemini-3.6-flash) as the application's runtime narration/Q&A layer, restricted to the deterministic engine's payload with numeral round-trip verification; all financial logic implemented as deterministic code and independently verified against hand calculations; controlled LLM tests per §10 to be recorded verbatim. Data sources: DEWA published tariff schedule; MAFP FY2025 audited consolidated financial statements; MAF 2024 Sustainability Report Environmental Data Annex; Global Solar Atlas (World Bank/Solargis); Etihad ESCO published project disclosures incl. the Siemens/Etihad ESCO retrofit ESPC (2022); Damodaran country-risk and beta datasets; NREL/IRENA benchmarks; UAE Federal Decree-Law No. 47 of 2022.*
