// Workspace navigation icons: bespoke duotone marks on a 24px grid.
// Outline in currentColor, one soft-filled shape for the "subject" of each tool.

type P = { size?: number; className?: string };

function Svg({ size = 20, className, children }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const soft = { fill: "currentColor", fillOpacity: 0.18, stroke: "none" } as const;

/** Dashboard: a tile grid with one filled panel. */
export const NavDashboard = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7.5" height="9" rx="2" {...soft} />
    <rect x="3.5" y="3.5" width="7.5" height="9" rx="2" />
    <rect x="13" y="3.5" width="7.5" height="5.5" rx="2" />
    <rect x="3.5" y="14.5" width="7.5" height="6" rx="2" />
    <rect x="13" y="11" width="7.5" height="9.5" rx="2" />
  </Svg>
);

/** Organizations: two buildings, the nearer one filled. */
export const NavOrgs = (p: P) => (
  <Svg {...p}>
    <path d="M3.5 20.5V9l6-3v14.5" {...soft} />
    <path d="M3.5 20.5V9l6-3v14.5" />
    <path d="M9.5 20.5V4l11 3.5v13" />
    <path d="M13 10h.01M16.5 10h.01M13 13.5h.01M16.5 13.5h.01M6.5 12h.01M6.5 15h.01" strokeWidth={2} />
    <path d="M2.5 20.5h19" />
  </Svg>
);

/** Platform team: two people with a badge. */
export const NavTeam = (p: P) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <path d="M16.5 4.5 19.5 5.6v2.6c0 1.9-1.3 3.4-3 4.1-1.7-.7-3-2.2-3-4.1V5.6Z" {...soft} />
    <path d="M16.5 4.5 19.5 5.6v2.6c0 1.9-1.3 3.4-3 4.1-1.7-.7-3-2.2-3-4.1V5.6Z" />
  </Svg>
);

/** Audit log: a list with a clock. */
export const NavAudit = (p: P) => (
  <Svg {...p}>
    <path d="M4 6h9M4 10.5h7M4 15h5" />
    <circle cx="16.5" cy="15.5" r="4.5" {...soft} />
    <circle cx="16.5" cy="15.5" r="4.5" />
    <path d="M16.5 13.2v2.5l1.6 1" />
  </Svg>
);

/** Talent inventory: stacked profile cards under a lens. */
export const NavInventory = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5" width="12" height="14" rx="2.5" {...soft} />
    <rect x="3" y="5" width="12" height="14" rx="2.5" />
    <circle cx="9" cy="10" r="2" />
    <path d="M6 15.5c.6-1.4 1.7-2.1 3-2.1s2.4.7 3 2.1" />
    <circle cx="17.5" cy="15.5" r="3" fill="var(--icon-bg, var(--color-surface))" />
    <path d="m19.7 17.7 1.8 1.8" />
  </Svg>
);

/** Shortlist: a ribbon over a stack. */
export const NavShortlist = (p: P) => (
  <Svg {...p}>
    <path d="M7 3.5h10a1 1 0 0 1 1 1V21l-6-3.8L6 21V4.5a1 1 0 0 1 1-1Z" {...soft} />
    <path d="M7 3.5h10a1 1 0 0 1 1 1V21l-6-3.8L6 21V4.5a1 1 0 0 1 1-1Z" />
    <path d="M9.5 8.5h5M9.5 11.5h3" />
  </Svg>
);

/** Requests and holds: a clock face with a padlock. */
export const NavHolds = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7.5" {...soft} />
    <circle cx="11" cy="11" r="7.5" />
    <path d="M11 7v4l2.5 1.5" />
    <rect x="14.5" y="15.5" width="6.5" height="5" rx="1.2" fill="var(--icon-bg, var(--color-surface))" />
    <path d="M16 15.5v-1.3a1.75 1.75 0 0 1 3.5 0v1.3" />
  </Svg>
);

/** Candidates: a profile card with an add mark. */
export const NavCandidates = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="13" height="15" rx="2" {...soft} />
    <rect x="3" y="4.5" width="13" height="15" rx="2" />
    <circle cx="9.5" cy="10" r="2.3" />
    <path d="M6 16c.5-1.7 1.8-2.6 3.5-2.6S12.5 14.3 13 16" />
    <path d="M19.5 8v6M16.5 11h6" />
  </Svg>
);

/** Bench tracker: pipeline columns with a card moving across. */
export const NavBench = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4" width="5" height="16" rx="1.5" />
    <rect x="9.5" y="4" width="5" height="16" rx="1.5" {...soft} />
    <rect x="9.5" y="4" width="5" height="16" rx="1.5" />
    <rect x="16" y="4" width="5" height="16" rx="1.5" />
    <rect x="10.5" y="7" width="3" height="3" rx=".6" fill="currentColor" stroke="none" />
    <path d="M5.5 7v3M18.5 7v5" />
  </Svg>
);

/** Compliance: a document behind a check shield. */
export const NavCompliance = (p: P) => (
  <Svg {...p}>
    <path d="M5 3.5h8l3 3V20H5Z" />
    <path d="M8 9h5M8 12h3" />
    <path d="M16.5 12.5 13 14v2.6c0 2 1.5 3.6 3.5 4.4 2-.8 3.5-2.4 3.5-4.4V14Z" {...soft} />
    <path d="M16.5 12.5 13 14v2.6c0 2 1.5 3.6 3.5 4.4 2-.8 3.5-2.4 3.5-4.4V14Z" />
    <path d="m15.2 16.8 1 1 2-2.1" />
  </Svg>
);

/** Rates and margin: stacked coins beside a rising line. */
export const NavRates = (p: P) => (
  <Svg {...p}>
    <ellipse cx="8" cy="16.5" rx="4.5" ry="2" {...soft} />
    <ellipse cx="8" cy="16.5" rx="4.5" ry="2" />
    <path d="M3.5 16.5v2c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-2" />
    <ellipse cx="8" cy="13" rx="4.5" ry="2" />
    <path d="m14 11 3-3.5 2 2L21.5 5" />
    <path d="M18.5 5h3v3" />
  </Svg>
);

/** Rail collapse toggle: a panel with a moving edge. */
export const NavCollapse = ({ collapsed, ...p }: P & { collapsed: boolean }) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M9 4.5v15" />
    <path d={collapsed ? "m13 10 2 2-2 2" : "m15 10-2 2 2 2"} />
  </Svg>
);

/** User menu items */
export const MenuProfile = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 19.5c1-3.3 3.8-5.2 7-5.2s6 1.9 7 5.2" />
  </Svg>
);
export const MenuOrg = (p: P) => (
  <Svg {...p}>
    <path d="M4 20V7.5L12 4l8 3.5V20" />
    <path d="M9 20v-5h6v5M8 10h.01M12 10h.01M16 10h.01" />
  </Svg>
);
export const MenuBell = (p: P) => (
  <Svg {...p}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15Z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
  </Svg>
);
export const MenuHelp = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.8 9.5a2.3 2.3 0 0 1 4.4.8c0 1.6-2.2 2-2.2 3.4M12 16.8h.01" />
  </Svg>
);
export const MenuKeyboard = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="6.5" width="18" height="11" rx="2" />
    <path d="M7 10h.01M10 10h.01M13 10h.01M16 10h.01M8 14h8" />
  </Svg>
);
export const MenuSignOut = (p: P) => (
  <Svg {...p}>
    <path d="M14 4.5H6.5a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5H14" />
    <path d="M10 12h10M17 8.5l3.5 3.5-3.5 3.5" />
  </Svg>
);
