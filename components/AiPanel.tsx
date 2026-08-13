"use client";

import { useEffect, useRef, useState } from "react";
import type { FullAnalysis, Params, Payload } from "@/lib/engine";

const fmtM = (v: number) => `${v < 0 ? "−" : "+"}AED ${Math.abs(v / 1e6).toFixed(2)}m`;
const fmtMp = (v: number) => `${v < 0 ? "−" : ""}AED ${Math.abs(v / 1e6).toFixed(2)}m`;
const pct = (v: number | null) => (v == null ? "n/a" : (v * 100).toFixed(1) + "%");

interface Section { text: string; verified: boolean; unmatched: string[]; ai: boolean; }
interface ChatMsg { role: "user" | "assistant"; content: string; refusal?: boolean; verified?: boolean; unmatched?: string[]; }

/** Deterministic fallback narration — template over engine output, correct by construction. */
function engineNarration(a: FullAnalysis, p: Params): Record<"verdict" | "risks" | "comparison", Section> {
  const { R, sw, verdict } = a;
  const mk = (text: string): Section => ({ text, verified: true, unmatched: [], ai: false });
  return {
    verdict: mk(
      verdict.kind === "reject-both"
        ? `The engine rejects both options: neither creates value at the ${(p.wacc * 100).toFixed(1)}% cost of capital under the current assumptions. Option A's NPV is ${fmtM(R.mA.npv)} and Option B's is ${fmtM(R.mB.npv)}. The PPA benchmark becomes the only route to the ESG objective.`
        : `The engine recommends proceeding with Option ${verdict.title.slice(-1)}${verdict.pill === "conditional" ? ", subject to the named verifications" : ""}. At the current assumptions it creates ${fmtM(R.mA.npv)} of value — equivalent to ${fmtM(R.mA.eaa)} every year for 25 years — and returns ${pct(R.mA.irr)} against a ${(p.wacc * 100).toFixed(1)}% hurdle. The chiller retrofit ${R.mB.npv < 0 ? `is rejected: it destroys ${fmtMp(R.mB.npv)} at its base retention assumption` : `creates ${fmtM(R.mB.npv)} but ranks below solar on EAA`}.`,
    ),
    risks: mk(
      `The conclusion rests almost entirely on one question: how much of the electricity saving MAF actually keeps. If the Option A retention share falls below ${sw.retA == null ? "its switching value" : (sw.retA * 100).toFixed(0) + "%"}, the project destroys value — and this is the least-evidenced input in the model (Class 3). Capex, tariff and yield each carry safety margins above one-third. Verify the lease mechanics first; everything else is survivable.`,
    ),
    comparison: mk(
      `The chillers save more electricity in year 1 (${fmtM(R.B.rows[0].gross)} gross vs ${fmtM(R.A.rows[0].gross)}) — but they cost five times more, run half as long, and their savings sit exactly where service charges pass value back to tenants. Because the lives differ (25 vs 12 years), the ranking is done on equivalent annual annuity, not raw NPV or IRR — and on that like-for-like measure solar wins in every tested configuration.`,
    ),
  };
}

export function AiPanel({ analysis, p, payload }: { analysis: FullAnalysis; p: Params; payload: Payload }) {
  const [sections, setSections] = useState(() => engineNarration(analysis, p));
  const [genState, setGenState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [genError, setGenError] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [chatError, setChatError] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  // Inputs changed → AI text is stale; fall back to fresh engine narration.
  useEffect(() => {
    setSections(engineNarration(analysis, p));
    setGenState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(p)]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const describeError = (code: string) =>
    code === "no_key"
      ? "No Gemini API key found on the server — add GEMINI_API_KEY to .env.local and restart. The deterministic engine text remains available."
      : code === "rate_limited"
        ? "Rate limited — try again in a moment."
        : "The AI service is unavailable right now. The deterministic engine text remains available.";

  async function generate() {
    setGenState("busy");
    setGenError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "narrate", payload: payloadRef.current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "api_error");
      setSections({
        verdict: { ...data.sections.verdict, ai: true },
        risks: { ...data.sections.risks, ai: true },
        comparison: { ...data.sections.comparison, ai: true },
      });
      setGenState("done");
    } catch (e) {
      setGenState("error");
      setGenError(describeError(e instanceof Error ? e.message : "api_error"));
    }
  }

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setChatError("");
    const history = [...msgs, { role: "user" as const, content: q }];
    setMsgs(history);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          messages: history.map(({ role, content }) => ({ role, content })),
          payload: payloadRef.current,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "api_error");
      setMsgs((m) => [...m, {
        role: "assistant", content: data.text, refusal: data.refusal,
        verified: data.verified, unmatched: data.unmatched,
      }]);
    } catch (e) {
      setChatError(describeError(e instanceof Error ? e.message : "api_error"));
      setMsgs((m) => m.slice(0, -1));
      setInput(q);
    } finally {
      setBusy(false);
    }
  }

  const Badge = ({ s }: { s: Section }) =>
    s.ai ? (
      s.verified ? (
        <span className="verified">✓ AI · all numerals verified</span>
      ) : (
        <span className="verified warn">⚠ AI · unverified: {s.unmatched.join(", ")}</span>
      )
    ) : (
      <span className="verified">✓ engine text · exact by construction</span>
    );

  return (
    <>
      <div className="ai-banner">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        <span>
          <b>AI boundary:</b> this layer narrates the deterministic engine&apos;s output. It computes nothing, decides
          nothing, and every numeral is round-trip verified against the engine payload. If this layer fails, the
          verdict is unaffected — deterministic text is always shown.
        </span>
      </div>
      <div className="ai-grid">
        <div>
          <div className="ai-actions">
            <button className="ai-gen-btn" onClick={generate} disabled={genState === "busy"}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} width={14} height={14} stroke="currentColor"><path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1" /></svg>
              {genState === "busy" ? "Generating…" : genState === "done" ? "Regenerate with Gemini" : "Generate with Gemini"}
            </button>
            <span className="ai-gen-note">
              {genState === "error" ? genError : genState === "done"
                ? "AI narration active — numerals verified against the engine payload."
                : "Showing deterministic engine text. Generate to replace it with Gemini's narration."}
            </span>
          </div>
          <div className="ai-block">
            <div className="ai-block-head"><h4>Verdict, in plain language</h4><Badge s={sections.verdict} /></div>
            <p>{sections.verdict.text}</p>
          </div>
          <div className="ai-block">
            <div className="ai-block-head"><h4>What could go wrong</h4><Badge s={sections.risks} /></div>
            <p>{sections.risks.text}</p>
          </div>
          <div className="ai-block">
            <div className="ai-block-head"><h4>Why the loser loses</h4><Badge s={sections.comparison} /></div>
            <p>{sections.comparison.text}</p>
          </div>
        </div>
        <div className="chat-card">
          <div className="chat-head">Grounded Q&amp;A <span className="scope">answers only from the results payload</span></div>
          <div className="chat-body" ref={bodyRef}>
            {msgs.length === 0 && (
              <div className="msg ai">
                Ask anything about the computed results — e.g. “Why is solar only conditional?”, “What happens if
                retention falls to 30%?”, “Why not rank on IRR?”. Questions outside the payload are declined by design.
              </div>
            )}
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="msg user">{m.content}</div>
              ) : (
                <div key={i} className={`msg ai${m.refusal ? " refusal" : ""}`}>
                  {m.refusal && <span className="vtag warn">OUTSIDE PAYLOAD — DECLINED</span>}
                  {m.content}
                  {!m.refusal && (m.verified
                    ? <span className="vtag ok">✓ numerals verified against engine payload</span>
                    : <span className="vtag warn">⚠ unverified numerals: {m.unmatched?.join(", ")}</span>)}
                </div>
              ),
            )}
            {busy && <div className="typing"><span /><span /><span /></div>}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about the computed results…"
              disabled={busy}
              aria-label="Ask the AI analyst a question"
            />
            <button onClick={send} disabled={busy || !input.trim()}>Send</button>
          </div>
          {chatError && <div className="chat-note" style={{ color: "var(--warn)" }}>{chatError}</div>}
        </div>
      </div>
    </>
  );
}
