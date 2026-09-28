// Custom SVG wordmarks for the (fictional) demo client roster.
// Placeholders for real customer logos, which need the customer's permission.

type P = { className?: string };
const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Mark({ children, label, className, w = 150 }: { children: React.ReactNode; label: string; className?: string; w?: number }) {
  return (
    <svg viewBox={`0 0 ${w} 32`} height="28" className={className} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

const Word = ({ x, children, weight = 600, spacing = -0.3, size = 15 }: { x: number; children: string; weight?: number; spacing?: number; size?: number }) => (
  <text x={x} y="21" fill="currentColor" fontFamily="var(--font-sans)" fontSize={size} fontWeight={weight} letterSpacing={spacing}>
    {children}
  </text>
);

export const MeridianLogo = ({ className }: P) => (
  <Mark label="Meridian Federal" className={className} w={168}>
    <g {...common}>
      <circle cx="14" cy="16" r="10" />
      <path d="M4 16h20M14 6c-4 5-4 15 0 20" />
    </g>
    <Word x={32}>Meridian Federal</Word>
  </Mark>
);

export const CrestlineLogo = ({ className }: P) => (
  <Mark label="Crestline" className={className} w={122}>
    <g {...common}>
      <path d="M3 24 11 10l5 8 4-5 7 11" />
    </g>
    <Word x={34} weight={700} spacing={0.4}>CRESTLINE</Word>
  </Mark>
);

export const AtlasLogo = ({ className }: P) => (
  <Mark label="Atlas Mutual" className={className} w={134}>
    <g {...common}>
      <path d="M14 5 4 26h20z" />
      <path d="M8 18h12" />
    </g>
    <Word x={32} weight={500}>Atlas Mutual</Word>
  </Mark>
);

export const PinecrestLogo = ({ className }: P) => (
  <Mark label="Pinecrest Health" className={className} w={160}>
    <g {...common}>
      <path d="M14 4v24M6 12h16M8 20h12" />
      <rect x="4" y="4" width="20" height="24" rx="6" />
    </g>
    <Word x={32}>Pinecrest Health</Word>
  </Mark>
);

export const OrionLogo = ({ className }: P) => (
  <Mark label="Orion Freight" className={className} w={134}>
    <g {...common}>
      <circle cx="7" cy="9" r="2" />
      <circle cx="14" cy="16" r="2" />
      <circle cx="21" cy="23" r="2" />
      <path d="M8.5 10.5 12.5 14.5M15.5 17.5l4 4" />
    </g>
    <Word x={32} weight={700} spacing={-0.6}>orion freight</Word>
  </Mark>
);

export const LakeshoreLogo = ({ className }: P) => (
  <Mark label="Lakeshore Capital" className={className} w={164}>
    <g {...common}>
      <path d="M3 13c3-3 6-3 9 0s6 3 9 0M3 20c3-3 6-3 9 0s6 3 9 0" />
    </g>
    <Word x={30} weight={500} spacing={0}>Lakeshore Capital</Word>
  </Mark>
);

export const GraniteLogo = ({ className }: P) => (
  <Mark label="Granite State CU" className={className} w={156}>
    <g {...common}>
      <path d="M4 26 10 8h8l6 18z" />
      <path d="M8 18h12" />
    </g>
    <Word x={32} weight={600}>Granite State CU</Word>
  </Mark>
);

export const PARTNER_LOGOS = [MeridianLogo, CrestlineLogo, AtlasLogo, PinecrestLogo, OrionLogo, LakeshoreLogo, GraniteLogo];
