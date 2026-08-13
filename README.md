# MERIDIAN — Capital Decision Engine

An AI-powered capital budgeting application built for an individual corporate-finance assignment. It evaluates a real capital investment decision at **Majid Al Futtaim's Mall of the Emirates**: purchasing and owning a 5 MWp rooftop solar PV system (25-year life) versus a chiller-plant + BMS efficiency retrofit (12-year life), with MAF's real-world solar PPA retained as an out-of-model benchmark.

## Architecture — three strictly separated layers

1. **Calculation engine** (`lib/engine.ts`) — deterministic, pure functions. Computes all thirteen required capital budgeting measures (initial/annual/terminal cash flows, payback, discounted payback, ARR on both conventions, NPV, IRR with uniqueness check, MIRR under three rate conventions, PI, financial break-even/switching values, one-at-a-time sensitivity, coherent best/base/worst scenarios) plus Equivalent Annual Annuity for unequal-life ranking. No LLM involvement of any kind.
2. **Decision engine** (also `lib/engine.ts`) — auditable rules (gates G1–G5, ranking R1–R2, robustness S1–S3) produce the verdict: Accept A / Accept B / Reject Both / Review, with conditional verdicts that name the verifications that would flip them. Every verdict cites the rule IDs that fired.
3. **AI narration layer** (`app/api/chat/route.ts`, Google Gemini `gemini-3.6-flash`) — explains the engine's output in plain language and answers grounded questions. It receives only the structured results payload, computes nothing, decides nothing, refuses out-of-payload questions, and every numeral it emits is round-trip verified against the payload before display.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Tests (31 assertions, including golden values cross-checked against an independent reference implementation and an independent first-principles recomputation of after-tax salvage, split-rate MIRR and PI):

```bash
npx vitest run
```

## Environment

Create `.env.local` in the project root:

```
GEMINI_API_KEY=your-key-from-Google-AI-Studio
```

**The app produces complete, correct output without the key.** The AI tab then shows deterministic engine-generated narration (labelled "engine text — exact by construction") and the Q&A explains that the AI layer is unavailable. This is by design: the financial verdict never depends on the LLM.

Optional: `MERIDIAN_MODEL` overrides the default Gemini model.

## Notes

- All figures are AED, nominal throughout (nominal tariff escalation, O&M at inflation, nominal WACC).
- The landlord retention share — the fraction of the electricity saving MAF keeps after service-charge pass-through — is the decision-critical input and a headline sensitivity variable, modelled separately for each option.
- Fixed model constants (system capacity, degradation, O&M rates, Option B capex, mall consumption) are centralized in the `FIXED` registry in `lib/engine.ts` and displayed in the UI with source-class badges; the eight decision-critical inputs are user-adjustable sliders.

*Built with Next.js 16, TypeScript, and the Google Gen AI SDK. AI tools (Claude) were used in development; all financial logic is deterministic code, independently verified.*
