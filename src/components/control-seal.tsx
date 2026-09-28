// Audit seal: a notched ring with a progress arc for the measured rate.
// Used in the compliance badge grid. Pure SVG, no text inside, so it
// stays legible at 56px.

export function ControlSeal({ pct, children, size = 56 }: { pct: number; children: React.ReactNode; size?: number }) {
  const r = 24;
  const C = 2 * Math.PI * r;
  const notches = 36;
  return (
    <span className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none" aria-hidden="true" className="absolute inset-0">
        {Array.from({ length: notches }, (_, i) => {
          const a = (i / notches) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={32 + Math.cos(a) * 29}
              y1={32 + Math.sin(a) * 29}
              x2={32 + Math.cos(a) * 31}
              y2={32 + Math.sin(a) * 31}
              stroke="var(--color-line-strong)"
              strokeWidth={1}
            />
          );
        })}
        <circle cx="32" cy="32" r={r} stroke="var(--color-line)" strokeWidth={2.5} />
        <circle
          cx="32"
          cy="32"
          r={r}
          stroke={pct >= 99.5 ? "var(--color-avail)" : "var(--color-cobalt)"}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - Math.min(1, pct / 100))}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className="relative text-ink-2">{children}</span>
    </span>
  );
}
