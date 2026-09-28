// Industry icons: 32px grid, 1.6px monoline, one accent stroke per icon.
const I = "currentColor";
const A = "var(--color-brand)";

type P = { size?: number; className?: string };

function Svg({ size = 28, className, children }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

/** Classical bank front: pediment, columns, base. */
export const BankingIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 12 16 5l12 7" stroke={I} />
    <path d="M5 12h22" stroke={I} />
    <path d="M8 15v8M13 15v8M19 15v8M24 15v8" stroke={A} />
    <path d="M5 26h22M4 29h24" stroke={I} />
  </Svg>
);

/** Candlesticks with a trend line. */
export const MarketsIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 28h24" stroke={I} />
    <path d="M9 8v18M16 5v16M23 10v14" stroke={I} />
    <rect x="7" y="12" width="4" height="8" rx="1" stroke={I} fill="var(--color-surface)" />
    <rect x="14" y="8" width="4" height="8" rx="1" stroke={A} fill="var(--color-surface)" />
    <rect x="21" y="14" width="4" height="6" rx="1" stroke={I} fill="var(--color-surface)" />
  </Svg>
);

/** Umbrella over a household. */
export const InsuranceIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 15a12 12 0 0 1 24 0Z" stroke={A} />
    <path d="M16 3v2" stroke={A} />
    <path d="M16 15v10a2.5 2.5 0 0 1-5 0" stroke={I} />
  </Svg>
);

/** Heart with a pulse line. */
export const HealthcareIcon = (p: P) => (
  <Svg {...p}>
    <path d="M16 27S4 20 4 11.5A6 6 0 0 1 16 9a6 6 0 0 1 12 2.5C28 20 16 27 16 27Z" stroke={I} />
    <path d="M7 16h5l2-4 3 7 2-3h6" stroke={A} />
  </Svg>
);

/** Shopping bag with handle and tag. */
export const RetailIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 11h20l-1.5 16h-17Z" stroke={I} />
    <path d="M11.5 11V9a4.5 4.5 0 0 1 9 0v2" stroke={A} />
    <path d="M12 17h8" stroke={I} />
  </Svg>
);

/** Capitol dome. */
export const PublicSectorIcon = (p: P) => (
  <Svg {...p}>
    <path d="M16 3v3" stroke={A} />
    <path d="M9 14a7 7 0 0 1 14 0" stroke={A} />
    <path d="M6 14h20M8 17v8M13 17v8M19 17v8M24 17v8" stroke={I} />
    <path d="M5 28h22" stroke={I} />
  </Svg>
);

export const INDUSTRY_ICON: Record<string, (p: P) => React.ReactElement> = {
  Banking: BankingIcon,
  "Capital Markets": MarketsIcon,
  Insurance: InsuranceIcon,
  Healthcare: HealthcareIcon,
  Retail: RetailIcon,
  "Public Sector": PublicSectorIcon,
};
