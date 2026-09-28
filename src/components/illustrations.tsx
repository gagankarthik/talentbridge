// Bespoke blueprint illustrations. Monoline 1.5px, isometric where depth helps,
// palette limited to ink, hairline and one semantic accent per drawing.
// All are decorative (aria-hidden) and scale with their container.

type Props = { className?: string };

const INK = "var(--color-ink-2)";
const LINE = "var(--color-line-strong)";
const COBALT = "var(--color-brand)";
const AVAIL = "var(--color-avail)";
const NOTICE = "var(--color-notice)";
const FLAG = "var(--color-flag)";

/** Isometric plate: a blind profile card lifted off a stack of redacted resumes. */
export function BlindProfileIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 240 160" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* stacked resumes */}
      <g stroke={LINE}>
        <path d="M40 112 120 146l80-34-80-34z" />
        <path d="M40 104 120 138l80-34" />
        <path d="M40 96 120 130l80-34" />
      </g>
      {/* lifted card */}
      <g stroke={INK}>
        <path d="M44 70 120 102l76-32-76-32z" fill="var(--color-surface)" />
        <path d="M44 70v6l76 32 76-32v-6" />
      </g>
      {/* redaction bars on the card */}
      <g stroke={INK} strokeWidth={4}>
        <path d="M86 62l20 8.5" />
        <path d="M96 57l12 5" />
      </g>
      <g stroke={LINE}>
        <path d="M112 78l34-14" />
        <path d="M118 84l30-12.5" />
        <path d="M124 90l20-8.5" />
      </g>
      {/* verification seal */}
      <circle cx="160" cy="54" r="11" stroke={AVAIL} fill="var(--color-avail-bg)" />
      <path d="m155 54.5 3.5 3.5 6.5-7" stroke={AVAIL} />
      {/* lift guides */}
      <g stroke={COBALT} strokeDasharray="2 4">
        <path d="M44 76v28M196 76v28M120 108v22" />
      </g>
    </svg>
  );
}

/** Shield over a document ledger: the compliance gate. */
export function ComplianceGateIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 240 160" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <g stroke={LINE}>
        <rect x="30" y="34" width="84" height="104" rx="4" />
        <path d="M44 56h56M44 70h56M44 84h40M44 98h56M44 112h32" />
      </g>
      <g stroke={INK}>
        <rect x="126" y="22" width="84" height="104" rx="4" fill="var(--color-surface)" />
        <path d="M140 44h22" />
        <path d="M140 60h56M140 74h56M140 88h40" stroke={LINE} />
      </g>
      {/* checks down the ledger */}
      <g stroke={AVAIL}>
        <path d="m186 42 3 3 6-6.5" />
      </g>
      {/* gate shield */}
      <path d="M168 94 148 101v15c0 12 8.5 21 20 26 11.5-5 20-14 20-26v-15z" stroke={COBALT} fill="var(--color-brand-wash)" />
      <path d="m160 118 5.5 5.5 11-11.5" stroke={COBALT} />
      {/* flow arrow from raw docs to gate */}
      <path d="M114 86h8" stroke={COBALT} strokeDasharray="2 3" />
    </svg>
  );
}

/** Hourglass-lock: 48-hour soft hold on a candidate. */
export function LockHoldIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 240 160" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* 48 tick dial */}
      <circle cx="120" cy="82" r="56" stroke={LINE} />
      <g stroke={INK}>
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2 - Math.PI / 2;
          const r1 = i % 12 === 0 ? 46 : 50;
          return <path key={i} d={`M${120 + Math.cos(a) * r1} ${82 + Math.sin(a) * r1}L${120 + Math.cos(a) * 54} ${82 + Math.sin(a) * 54}`} strokeWidth={i % 12 === 0 ? 1.5 : 1} opacity={i < 31 ? 1 : 0.25} />;
        })}
      </g>
      {/* elapsed arc */}
      <path d="M120 26a56 56 0 1 1-52.4 76.2" stroke={COBALT} strokeWidth={2} />
      {/* padlock */}
      <rect x="100" y="80" width="40" height="30" rx="4" stroke={INK} fill="var(--color-surface)" />
      <path d="M108 80v-8a12 12 0 0 1 24 0v8" stroke={INK} />
      <path d="M120 91v8" stroke={INK} />
    </svg>
  );
}

/** Empty shortlist: an open folder waiting on the drafting table. */
export function EmptyShortlistIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 200 130" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 104 100 126l80-22" stroke={LINE} />
      <path d="M52 92V48l20-6 10 6 52-14v44L84 92z" stroke={INK} fill="var(--color-surface)" />
      <path d="M52 92 84 92l62-26-12 12" stroke={INK} />
      <path d="M84 92V48" stroke={LINE} />
      <g stroke={COBALT} strokeDasharray="2 4">
        <path d="M110 28v-14M100 30l-6-10M120 30l6-10" />
      </g>
      <rect x="140" y="92" width="18" height="12" rx="2" stroke={LINE} />
    </svg>
  );
}

/** No results: a sieve with nothing caught. */
export function NoResultsIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 200 130" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M40 30h120l-44 46v30l-32 14V76z" stroke={INK} fill="var(--color-surface)" />
      <path d="M52 42h96" stroke={LINE} />
      <g fill={LINE}>
        <circle cx="70" cy="18" r="3" />
        <circle cx="96" cy="12" r="3" />
        <circle cx="124" cy="20" r="3" />
        <circle cx="146" cy="10" r="3" />
      </g>
      <path d="M130 100h32M146 84v32" stroke={NOTICE} />
    </svg>
  );
}

/** Empty request log: an unfilled requisition form. */
export function EmptyRequestsIllustration({ className }: Props) {
  return (
    <svg viewBox="0 0 200 130" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="58" y="14" width="84" height="104" rx="4" stroke={INK} fill="var(--color-surface)" />
      <path d="M84 14v-4h32v4" stroke={INK} />
      <g stroke={LINE}>
        <path d="M72 38h56M72 54h56M72 70h40M72 86h56" />
      </g>
      <rect x="72" y="96" width="24" height="10" rx="2" stroke={COBALT} />
      <path d="M150 40h24M150 52h14" stroke={LINE} />
      <circle cx="36" cy="64" r="10" stroke={FLAG} opacity={0} />
    </svg>
  );
}

/** Blueprint hero drawing: bridge elevation with dimension lines. */
export function BridgeElevation({ className }: Props) {
  return (
    <svg viewBox="0 0 560 120" fill="none" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <g stroke={LINE}>
        <path d="M0 92h560" />
        <path d="M120 30v70M440 30v70" />
        <path d="M0 40C60 62 100 84 120 92M440 92c20-8 60-30 120-52" />
        <path d="M120 30c60 70 260 70 320 0" />
      </g>
      <g stroke={LINE} opacity={0.8}>
        {Array.from({ length: 15 }, (_, i) => {
          const x = 140 + i * 20;
          const t = (x - 120) / 320;
          const y = 30 + 4 * 52.5 * t * (1 - t);
          return <path key={i} d={`M${x} ${y}V92`} />;
        })}
      </g>
      {/* dimension line */}
      <g stroke={COBALT}>
        <path d="M120 110h320M120 106v8M440 106v8" />
      </g>
      <text x="280" y="106" textAnchor="middle" fontSize="10" fill={COBALT} fontFamily="var(--font-mono)">
        48h
      </text>
    </svg>
  );
}
