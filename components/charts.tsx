"use client";

import { FIXED, type Params, type RunResult, run } from "@/lib/engine";

/** Round to 2dp so SSR and client serialize identical SVG coordinates (avoids float-tail hydration noise). */
const r2 = (v: number) => Math.round(v * 100) / 100;

/* ---------------- Year-1 waterfall (Option A) ---------------- */
export function Waterfall({ R }: { R: RunResult }) {
  const r = R.A.rows[0];
  const steps: [string, number | null][] = [
    ["Gross saving", r.gross],
    ["Tenant share", -(r.gross - r.retained)],
    ["O&M + opp.", -r.om],
    ["Tax", -(r.ebit * FIXED.tax)],
    ["Op. cash flow", null],
  ];
  const W = 460, H = 240, pad = 42;
  const max = Math.max(r.gross, 1) * 1.06;
  const y = (v: number) => r2(H - 30 - (v / max) * (H - 64));
  const bw = (W - pad - 14) / steps.length - 14;
  let x = pad, cum = 0;
  const els: React.ReactNode[] = [];
  steps.forEach((st, i) => {
    let v = st[1] as number, y0: number, y1: number, color: string;
    if (st[1] === null) { y0 = y(cum); y1 = y(0); color = "var(--pos)"; v = cum; }
    else if (v >= 0) { y0 = y(cum + v); y1 = y(cum); color = "var(--chart-bar)"; cum += v; }
    else { y0 = y(cum); y1 = y(cum + v); color = "var(--neg)"; cum += v; }
    els.push(
      <g key={i}>
        <rect x={r2(x)} y={Math.min(y0, y1)} width={r2(bw)} height={r2(Math.max(Math.abs(y1 - y0), 2))} rx={4} fill={color} opacity={st[1] === null ? 1 : 0.85} />
        <text className="svg-num" x={r2(x + bw / 2)} y={r2(Math.min(y0, y1) - 6)} textAnchor="middle">{(Math.abs(v) / 1e6).toFixed(2)}</text>
        <text className="svg-label" x={r2(x + bw / 2)} y={H - 12} textAnchor="middle">{st[0]}</text>
        {i < steps.length - 1 && (
          <line x1={r2(x + bw)} y1={y(cum)} x2={r2(x + bw + 14)} y2={y(cum)} stroke="var(--muted-fg)" strokeDasharray="2,2" />
        )}
      </g>,
    );
    x += bw + 14;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Year-1 cash flow build-up for Option A">
      <line x1={pad - 6} y1={y(0)} x2={W - 6} y2={y(0)} stroke="var(--chart-grid)" />
      {els}
    </svg>
  );
}

/* ---------------- 25-year FCF + cumulative discounted line ---------------- */
export function Timeline({ R, p }: { R: RunResult; p: Params }) {
  const f = R.A.fcf;
  const W = 460, H = 250, pad = 40;
  const n = f.length;
  const cum: number[] = [];
  let c = 0;
  f.forEach((cf, t) => { c += cf / Math.pow(1 + p.wacc, t); cum.push(c); });
  const maxPos = Math.max(...f.slice(1), ...cum, 1);
  // Scale to operating flows; the initial outlay bar is clipped with a break marker
  const clip = -maxPos * 0.55;
  const lo = clip * 1.15, hi = maxPos * 1.12;
  const yv = (v: number) => r2(H - 34 - ((Math.max(v, clip) - lo) / (hi - lo)) * (H - 60));
  const bw = (W - pad - 10) / n - 2;
  const dp = R.mA.dpay;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="25-year free cash flow and cumulative discounted position">
      <line x1={pad - 4} y1={yv(0)} x2={W - 4} y2={yv(0)} stroke="var(--chart-grid)" />
      {f.map((cf, t) => {
        const x = pad + t * (bw + 2);
        const clipped = cf < clip;
        const y0 = yv(Math.max(cf, 0)), y1 = yv(Math.min(cf, 0));
        return (
          <g key={t}>
            <rect x={r2(x)} y={y0} width={r2(bw)} height={r2(Math.max(y1 - y0, 1.5))} rx={1.5} fill={cf < 0 ? "var(--neg)" : "var(--chart-bar)"} opacity={0.85} />
            {clipped && (
              <>
                <line x1={r2(x - 1.5)} y1={r2(y1 + 4)} x2={r2(x + bw + 1.5)} y2={r2(y1 + 1)} stroke="var(--card)" strokeWidth={2.5} />
                <text className="svg-num" x={r2(x + bw + 4)} y={r2(y1 + 6)} fill="var(--neg)">{(cf / 1e6).toFixed(1)}m</text>
              </>
            )}
          </g>
        );
      })}
      <polyline fill="none" stroke="var(--chart-line)" strokeWidth={2} points={cum.map((v, t) => `${r2(pad + t * (bw + 2) + bw / 2)},${yv(v)}`).join(" ")} />
      {dp != null && (
        <>
          <line x1={r2(pad + dp * (bw + 2) + bw / 2)} y1={r2(yv(0) - 16)} x2={r2(pad + dp * (bw + 2) + bw / 2)} y2={r2(yv(0) + 16)} stroke="var(--chart-line)" strokeDasharray="3,3" />
          <text className="svg-label" x={r2(pad + dp * (bw + 2) + bw / 2 + 4)} y={r2(yv(0) - 20)} fill="var(--accent)">disc. payback {dp.toFixed(1)}y</text>
        </>
      )}
      <text className="svg-label" x={r2(pad + 12 * (bw + 2))} y={H - 4} textAnchor="middle">yr 12 · inverter</text>
      <text className="svg-label" x={pad} y={12}>AED m</text>
    </svg>
  );
}

/* ---------------- Tornado (Option A NPV, ±20%) ---------------- */
export function Tornado({ p }: { p: Params }) {
  const vars: [string, keyof Params][] = [
    ["Tariff", "tariff"], ["Yield", "yield_"], ["Retention (A)", "retA"],
    ["WACC", "wacc"], ["Capex (A)", "capexA"], ["Escalation", "esc"],
  ];
  const base = run(p).mA.npv;
  const W = 460, rowH = 32, H = vars.length * rowH + 44, mid = W * 0.56;
  const res = vars.map(([lab, k], idx) => {
    const lo = { ...p, [k]: p[k] * 0.8 };
    const hi = { ...p, [k]: p[k] * 1.2 };
    return { lab, idx, lo: run(lo).mA.npv, hi: run(hi).mA.npv };
  });
  const span = Math.max(...res.flatMap((r) => [Math.abs(r.lo - base), Math.abs(r.hi - base)]), 1);
  const sx = (v: number) => r2(mid + ((v - base) / span) * (W * 0.36));
  // Sort key rounded to whole AED with a fixed tie-break: tariff/yield/retention have
  // exactly tied swings (multiplicative symmetry), and float tails can differ between
  // the server and client bundles — an unstable tie order is a hydration mismatch.
  const key = (r: { lo: number; hi: number }) => Math.round(Math.abs(r.lo - base) + Math.abs(r.hi - base));
  res.sort((a, b) => key(b) - key(a) || a.idx - b.idx);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Tornado chart of NPV sensitivity">
      <line x1={mid} y1={14} x2={mid} y2={H - 26} stroke="var(--chart-grid)" />
      <text className="svg-num" x={mid} y={H - 8} textAnchor="middle">base {(base / 1e6).toFixed(1)}m</text>
      {res.map((r, i) => {
        const y = 20 + i * rowH;
        const x1 = sx(Math.min(r.lo, r.hi)), x2 = sx(Math.max(r.lo, r.hi));
        return (
          <g key={r.lab}>
            <rect x={x1} y={y} width={r2(Math.max(x2 - x1, 2))} height={16} rx={4} fill="var(--chart-bar)" opacity={0.8} />
            <text className="svg-label" x={8} y={y + 12}>{r.lab}</text>
            <text className="svg-num" x={r2(x2 + 5)} y={y + 12}>{(Math.max(r.lo, r.hi) / 1e6).toFixed(1)}</text>
          </g>
        );
      })}
    </svg>
  );
}
