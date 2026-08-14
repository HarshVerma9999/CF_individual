# AI Boundary Specification
## MAF Capital Budgeting Application

**Governing principle:** the LLM never produces a number and never chooses the verdict. It explains a decision that a deterministic engine has already made.

The brief creates a tension it does not resolve — it asks for an "AI-generated recommendation" while also requiring that "the final judgment must be made by the student" and that calculations be "independently verified." Resolving this architecturally rather than rhetorically is the point of this document.

---

## PART 1 — THREE-LAYER ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│ LAYER 1 — CALCULATION ENGINE            (deterministic) │
│ Pure functions. All 13 required metrics + EAA.          │
│ No LLM involvement of any kind.                         │
│ Emits: results JSON + audit trail                       │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ LAYER 2 — DECISION ENGINE               (deterministic) │
│ Rule-based verdict from Layer 1 output.                 │
│ Accept A / Accept B / Reject Both / Delay / Review      │
│ Emits: verdict + triggered rule IDs + risk flags        │
└──────────────────────────┬──────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ LAYER 3 — NARRATION LAYER                        (LLM)  │
│ Explains Layer 2's verdict in plain language.           │
│ Receives ONLY the structured payload from Layers 1–2.   │
│ Computes nothing. Decides nothing.                      │
└─────────────────────────────────────────────────────────┘
```

If Layer 3 fails, is unavailable, or returns nonsense, the application still produces a complete, correct, defensible answer. That property is the whole design goal, and it is what should be said in the report.

---

## PART 2 — LAYER 2: THE DECISION RULES

These are explicit and auditable. Every verdict cites the rule IDs that fired.

### 2.1 Gate rules (applied to each option independently)

| ID | Rule | Meaning |
|---|---|---|
| G1 | NPV > 0 | Creates value at the cost of capital |
| G2 | PI > 1.0 | Equivalent confirmation, scaled |
| G3 | IRR > WACC | Return exceeds hurdle |
| G4 | IRR is unique (single sign change, or verified single real root) | If violated, IRR is not interpretable and MIRR governs |
| G5 | Discounted payback ≤ economic life | Recovers capital in discounted terms within its own life |

### 2.2 Ranking rule

| ID | Rule |
|---|---|
| R1 | Rank surviving options by **Equivalent Annual Annuity**, never by NPV and never by IRR |
| R2 | If the EAA gap between options is **within 5%** of the larger EAA, the options are treated as indistinguishable given assumption uncertainty → verdict escalates to *Review Further* |

### 2.3 Robustness rules

| ID | Rule | Consequence |
|---|---|---|
| S1 | NPV remains > 0 in the worst-case scenario | If violated → *Review Further* |
| S2 | Switching value on the most sensitive variable is more than 20% away from the base assumption | If violated, the decision is fragile → *Review Further* |
| S3 | EAA ranking does not reverse under any single-variable sensitivity run | If violated, the ranking is not robust → *Review Further* |

### 2.4 Verdict resolution

| Verdict | Condition |
|---|---|
| **Accept A** or **Accept B** | Option passes G1–G5, wins on R1 with the gap outside R2's tolerance, and satisfies S1–S3 |
| **Reject Both** | Neither option passes G1 |
| **Review Further** | Any of R2, S1, S2, S3 triggers |
| **Delay** | Passes G1–G5 but (a) switching value on capex is within 15% of base **and** (b) the capex trend for that technology is declining — waiting has option value |

The *Delay* rule is the one that requires the most care. It should not fire merely because a project is marginal; it should fire when there is an identifiable reason that waiting improves the decision. Falling solar module costs are such a reason. General uncertainty is not.

---

## PART 3 — LAYER 3: WHAT THE LLM DOES

Five features. Each is narration over structured data.

| # | Feature | Input from engine | Output | Decision value | Limitation |
|---|---|---|---|---|---|
| 1 | Plain-language verdict explanation | Verdict, triggered rule IDs, key metrics | 3–4 sentences a non-finance reader can act on | Makes the output usable by a mall GM or asset manager, per the brief's accessibility requirement | Cannot detect an error in the engine; it explains whatever it is given |
| 2 | Risk narrative | Structured risk flags, worst-case deltas | Prose ranking of what could go wrong and how much it costs | Converts a tornado chart into something a committee can discuss | Only surfaces risks the engine was designed to flag; unknown unknowns stay unknown |
| 3 | Comparative narrative | Both options' full metric sets, EAA, lives | Explanation of *why* EAA governs and why the higher-IRR option is not automatically preferred | Directly addresses the most likely misreading of the results | Its explanation is only as correct as the framing it is given |
| 4 | Assumption interrogation | Tornado output, switching values | Statement of which assumptions the conclusion actually rests on | Redirects scrutiny to the inputs, where it belongs | Cannot judge whether an assumption is *realistic* — only how much it matters |
| 5 | Grounded Q&A assistant | Full results JSON | Answers user questions using only the payload; refuses otherwise | Interrogability without recalculation risk | Refusal rate is a feature; users may read it as a limitation |

---

## PART 4 — WHAT THE LLM IS FORBIDDEN TO DO

1. **Perform arithmetic of any kind.** No addition, no discounting, no percentage change, no averaging.
2. **State any number not present in the payload**, other than reproducing a payload value verbatim.
3. **Choose, alter, soften or override the verdict.**
4. **Invent assumptions, data sources, benchmarks or citations.**
5. **Offer an investment opinion independent of the engine output.**
6. **Answer questions the payload does not support** — it must decline.

---

## PART 5 — GUARDRAILS (implementable, not aspirational)

### 5.1 Numeric round-trip validation

The strongest guardrail available, and cheap to build:

1. Engine emits results as JSON.
2. LLM produces narration.
3. Post-processor extracts every numeral from the narration.
4. Each is matched against the payload within a stated rounding tolerance.
5. Any unmatched numeral is flagged, and the narration is either regenerated or the numeral is stripped with a visible warning.

This makes "the AI cannot hallucinate a financial figure" a verified property of the system rather than a claim in the report. It is also the single most quotable design decision in the submission.

### 5.2 Supporting controls

- **Low temperature** for all narration calls.
- **System prompt** stating explicitly that the model is a translator, not an analyst, and that arithmetic is prohibited.
- **Structured refusal path** for out-of-payload questions, with standard wording.
- **Uncertainty language mapped from engine flags**, not generated freely — "fragile" and "robust" mean specific things defined by rules S1–S3, and the LLM uses those words only when the corresponding flag is set.
- **Audit trail surfaced in the UI** — every displayed figure traceable to its formula and inputs, so a marker can verify independently.

---

## PART 6 — THE CRITICAL-EVALUATION PROTOCOL (report Section 10)

The brief awards marks for critical evaluation of AI output. That requires *evidence*, which means running a test and reporting the result — not predicting one.

### 6.1 Test design

Three controlled prompts, each given to an LLM **without** the engine, guardrails or framing:

| Test | Prompt given | Failure mode being probed | Correct answer |
|---|---|---|---|
| T1 | Both options' raw cash flows and lives: "which investment is better?" | Ranking unequal-life mutually exclusive projects on IRR or payback instead of EAA | The higher-EAA option |
| T2 | Cash flows plus salvage value and book value: "compute the terminal-year cash flow" | Using gross salvage instead of salvage net of tax on the gain | Salvage − tax × (salvage − book value), plus WC recovery |
| T3 | Project description including the service-charge structure: "what is the annual saving to MAF?" | Ignoring that the saving may be recharged to tenants and attributing the full gross saving to the landlord | Gross saving × landlord retention share |

### 6.2 An honest caveat that must be respected

**Do not assume the model will fail these tests.** Current models frequently handle EAA and after-tax salvage correctly. If you write Section 10 in advance on the premise that the AI got it wrong, and it didn't, you will have fabricated a finding — which is precisely the failure the brief is testing for.

Run the tests. Report what actually happens. Both outcomes are publishable:

- **If the AI errs** — you have direct evidence for why the deterministic layer exists, and the architecture is vindicated.
- **If the AI is correct** — the more interesting finding: the AI reached the right answer but cannot *demonstrate* that it is right, offers no audit trail, and gives no assurance of repeatability on the next query. Correctness without verifiability is not the same as reliability in a financial control environment. That argument is stronger than a caught mistake, and far more original than the usual "AI hallucinates, so be careful."

Record the exact prompts, the model and version used, the date, and the verbatim responses. That is your evidence base and it also satisfies the required declaration of AI tools used.

---

## PART 7 — WHAT THIS BUYS IN THE REPORT

| Report section | What this specification supplies |
|---|---|
| 10 — AI insights and student evaluation | The test protocol in Part 6, with real recorded results |
| 9 — Financial and non-financial risks | Model risk and AI-reliance risk as named, mitigated risks |
| 11 — Final recommendation | A verdict traceable to numbered rules rather than to an opinion |
| 12 — Limitations | Layer 3's stated limitations in Part 3, honestly enumerated |
