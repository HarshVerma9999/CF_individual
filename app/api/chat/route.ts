import { GoogleGenAI, ApiError } from "@google/genai";

/**
 * Layer 3 — LLM narration endpoint (Google Gemini). The model receives ONLY the
 * deterministic engine payload; it computes nothing and decides nothing. Every
 * numeral in its output is round-trip verified against the payload before the
 * client shows it.
 */

// Current recommended general-purpose model per Google AI Studio (ai.google.dev/gemini-api/docs/models, checked 2026-08-08)
const MODEL = process.env.MERIDIAN_MODEL ?? "gemini-3.6-flash";

const BOUNDARY = `You are the narration layer of MERIDIAN, a capital budgeting decision engine for Majid Al Futtaim's Mall of the Emirates. A deterministic calculation engine has already computed every figure and a rule engine has already decided the verdict. Your role is strictly limited:

RULES (non-negotiable):
1. NEVER perform arithmetic of any kind — no addition, discounting, percentage changes, or averaging.
2. NEVER state a number that is not present verbatim in the PAYLOAD below (reproducing payload values, with the units given, is allowed).
3. NEVER choose, alter, soften or override the verdict.
4. NEVER invent assumptions, data sources, benchmarks or citations.
5. NEVER offer an investment opinion independent of the engine output.
6. If a question cannot be answered from the PAYLOAD alone, refuse: begin your reply with the exact marker [OUTSIDE PAYLOAD] followed by a one-sentence explanation and, where possible, what the payload CAN say that is closest.
7. Plain language for a non-finance reader (a mall general manager). Keep answers to 2-5 sentences. Monetary values are AED millions ("m"); say "AED X.XXm".
8. Uncertainty words are rule-bound: use "fragile" only if rule S2 failed, "robust" only if S1, S2 and S3 all passed.`;

/* ---------- numeral round-trip verification ---------- */
function collectNumbers(v: unknown, out: number[]): void {
  if (typeof v === "number" && isFinite(v)) out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => collectNumbers(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => collectNumbers(x, out));
}

function verifyNumerals(text: string, payload: unknown, userTexts: string[]) {
  const allowed: number[] = [];
  collectNumbers(payload, allowed);
  userTexts.forEach((t) => {
    for (const m of t.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
      const n = parseFloat(m[0].replace(/,/g, ""));
      if (isFinite(n)) allowed.push(n);
    }
  });
  const unmatched: string[] = [];
  for (const m of text.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
    const raw = m[0];
    const n = parseFloat(raw.replace(/,/g, ""));
    if (!isFinite(n)) continue;
    if (n <= 40 && Number.isInteger(n)) continue; // rule ids, counts, small years-of-life
    if (n >= 1900 && n <= 2100 && Number.isInteger(n)) continue; // calendar years
    const ok = allowed.some(
      (v) => Math.abs(Math.abs(n) - Math.abs(v)) <= Math.max(0.051, Math.abs(v) * 0.006),
    );
    if (!ok) unmatched.push(raw);
  }
  return { verified: unmatched.length === 0, unmatched: [...new Set(unmatched)] };
}

/* ---------- route ---------- */
interface ChatBody {
  mode: "chat" | "narrate";
  messages?: { role: "user" | "assistant"; content: string }[];
  payload: unknown;
}

export async function POST(request: Request) {
  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  if (!body?.payload) return Response.json({ error: "bad_request" }, { status: 400 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // No credentials → the client falls back to deterministic engine narration.
    return Response.json({ error: "no_key" }, { status: 503 });
  }

  const ai = new GoogleGenAI({ apiKey });
  const payloadJson = JSON.stringify(body.payload);
  const system = `${BOUNDARY}\n\nPAYLOAD (the only source of truth):\n${payloadJson}`;

  const userMessages =
    body.mode === "narrate"
      ? [
          {
            role: "user" as const,
            content: `Produce three short narration sections from the payload, returned as STRICT JSON with exactly these keys and no other text:
{"verdict": "...", "risks": "...", "comparison": "..."}
- "verdict": explain the engine's decision in plain language (3-4 sentences), including the headline value figures and, if the verdict is conditional, the named conditions.
- "risks": what could go wrong — rank the drivers using the switching values, and name the single input the conclusion most depends on (2-4 sentences).
- "comparison": why the losing option loses despite any superficially attractive figure, and why EAA (not NPV or IRR) governs the ranking given unequal lives (2-4 sentences).`,
          },
        ]
      : (body.messages ?? []).slice(-12).map((m) => ({ role: m.role, content: m.content }));

  if (userMessages.length === 0)
    return Response.json({ error: "bad_request" }, { status: 400 });

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: userMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: system,
        maxOutputTokens: 3000,
        // Sampling params (temperature/topK/topP) deliberately omitted: deprecated and
        // ignored on gemini-3.6-flash; future model generations reject them with HTTP 400.
        // Output discipline comes from the system-prompt guardrails + numeral verification.
      },
    });

    const text = (response.text ?? "").trim();
    if (!text) {
      // Safety-blocked or empty completion — parallel of a model refusal.
      return Response.json({ error: "model_refusal" }, { status: 502 });
    }

    const userTexts = userMessages.map((m) => m.content);

    if (body.mode === "narrate") {
      let sections: { verdict: string; risks: string; comparison: string };
      try {
        sections = JSON.parse(text.replace(/^```json?\s*|\s*```$/g, ""));
      } catch {
        return Response.json({ error: "parse_failure" }, { status: 502 });
      }
      const check = (t: string) => verifyNumerals(t, body.payload, userTexts);
      return Response.json({
        sections: {
          verdict: { text: sections.verdict, ...check(sections.verdict) },
          risks: { text: sections.risks, ...check(sections.risks) },
          comparison: { text: sections.comparison, ...check(sections.comparison) },
        },
        model: MODEL,
      });
    }

    const refused = text.startsWith("[OUTSIDE PAYLOAD]");
    const v = verifyNumerals(text, body.payload, userTexts);
    return Response.json({
      text: refused ? text.replace("[OUTSIDE PAYLOAD]", "").trim() : text,
      refusal: refused,
      ...v,
      model: MODEL,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        return Response.json({ error: "no_key" }, { status: 503 });
      }
      if (error.status === 429) {
        return Response.json({ error: "rate_limited" }, { status: 429 });
      }
      return Response.json({ error: "api_error", detail: error.message }, { status: 502 });
    }
    return Response.json({ error: "network" }, { status: 502 });
  }
}
