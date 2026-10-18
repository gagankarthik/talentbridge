// Navigation and account-menu icons. Same system as components/icons.tsx:
// grid 24 · live area 18 · stroke 1.5 · round caps and joins · outline only,
// container corners 2. One clear metaphor per destination.

type P = { size?: number; className?: string };

function Svg({ size = 20, className, children }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const Dot = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={1} fill="currentColor" stroke="none" />;

/** Dashboard: four panels of a report layout. */
export const NavDashboard = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="7" height="9" rx="1.5" />
    <rect x="13" y="4" width="7" height="5" rx="1.5" />
    <rect x="4" y="15" width="7" height="5" rx="1.5" />
    <rect x="13" y="11" width="7" height="9" rx="1.5" />
  </Svg>
);

/** Organizations: a tall office beside a low one. */
export const NavOrgs = (p: P) => (
  <Svg {...p}>
    <path d="M5 20.5V5.5a1.5 1.5 0 0 1 1.5-1.5h7a1.5 1.5 0 0 1 1.5 1.5v15" />
    <path d="M15 10h3a1.5 1.5 0 0 1 1.5 1.5v9" />
    <path d="M3 20.5h18M8.5 8h3M8.5 11.5h3M8.5 15h3" />
  </Svg>
);

/** Platform team: two people. */
export const NavTeam = (p: P) => (
  <Svg {...p}>
    <circle cx="9" cy="8.5" r="3.25" />
    <path d="M3.5 19.5c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" />
    <path d="M15.5 5.5a3.25 3.25 0 0 1 0 6.3M17.5 14.7c1.6.7 2.7 2.4 3 4.8" />
  </Svg>
);

/** Audit log: a clipboard of recorded entries. */
export const NavAudit = (p: P) => (
  <Svg {...p}>
    <path d="M9 4.5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="3" rx="1" />
    <path d="M11 11h4.5M11 14.5h4.5M11 18h2.5" />
    <Dot x={8.25} y={11} />
    <Dot x={8.25} y={14.5} />
  </Svg>
);

/** Talent inventory: a person found by a lens. */
export const NavInventory = (p: P) => (
  <Svg {...p}>
    <circle cx="9.5" cy="8" r="3.25" />
    <path d="M3.5 19.5c.6-3.1 2.9-5 6-5 .9 0 1.7.15 2.45.45" />
    <circle cx="16.75" cy="16.25" r="2.75" />
    <path d="m18.75 18.25 1.75 1.75" />
  </Svg>
);

/** Shortlist: a bookmark carrying a check. */
export const NavShortlist = (p: P) => (
  <Svg {...p}>
    <path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.5L12 16.5l-6.5 4V5A1.5 1.5 0 0 1 7 3.5Z" />
    <path d="m9.5 9.75 1.75 1.75 3.25-3.5" />
  </Svg>
);

/** Requests and holds: an hourglass, since every hold runs for 48 hours. */
export const NavHolds = (p: P) => (
  <Svg {...p}>
    <path d="M6.5 3.5h11M6.5 20.5h11" />
    <path d="M8 3.5v2.6a4.5 4.5 0 0 0 1.9 3.67L12 11.25l2.1-1.48A4.5 4.5 0 0 0 16 6.1V3.5" />
    <path d="M8 20.5v-2.6a4.5 4.5 0 0 1 1.9-3.67L12 12.75l2.1 1.48A4.5 4.5 0 0 1 16 17.9v2.6" />
    <path d="M10.25 18.25h3.5" />
  </Svg>
);

/** Candidates: a person with an add mark. */
export const NavCandidates = (p: P) => (
  <Svg {...p}>
    <circle cx="9.5" cy="8.5" r="3.25" />
    <path d="M3.5 19.5c.6-3 2.8-5 6-5s5.4 2 6 5" />
    <path d="M18.5 6.5v5M16 9h5" />
  </Svg>
);

/** Bench tracker: three pipeline columns of different depth. */
export const NavBench = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="4.5" height="10" rx="1.25" />
    <rect x="9.75" y="4" width="4.5" height="16" rx="1.25" />
    <rect x="15.5" y="4" width="4.5" height="7" rx="1.25" />
  </Svg>
);

/** Compliance: a shield with a check. */
export const NavCompliance = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.25 4.75 6v5.25c0 4.6 3.05 8.1 7.25 9.5 4.2-1.4 7.25-4.9 7.25-9.5V6Z" />
    <path d="m9 12 2.25 2.25L15.25 10" />
  </Svg>
);

/** Rates and margin: a rising trend on axes. */
export const NavRates = (p: P) => (
  <Svg {...p}>
    <path d="M4 4v14.5A1.5 1.5 0 0 0 5.5 20H20" />
    <path d="m7.5 15 3.5-4 3 2.5 5-6" />
    <path d="M15.5 7.5H19V11" />
  </Svg>
);

/** Rail collapse toggle: a panel with its side column and a direction chevron. */
export const NavCollapse = ({ collapsed, ...p }: P & { collapsed: boolean }) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M9 4.5v15" />
    <path d={collapsed ? "m13 10 2 2-2 2" : "m15 10-2 2 2 2"} />
  </Svg>
);

/** Account menu */
export const MenuProfile = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.75" />
    <path d="M5 20c.9-3.4 3.7-5.5 7-5.5s6.1 2.1 7 5.5" />
  </Svg>
);
export const MenuOrg = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 20.5V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14.5" />
    <path d="M15.5 10h2a2 2 0 0 1 2 2v8.5" />
    <path d="M3 20.5h18M8 8h4M8 11.5h4M8 15h4" />
  </Svg>
);
export const MenuBell = (p: P) => (
  <Svg {...p}>
    <path d="M6.25 16.5V11a5.75 5.75 0 0 1 11.5 0v5.5l1.75 1.75h-15Z" />
    <path d="M10 20.75a2.25 2.25 0 0 0 4 0" />
  </Svg>
);
export const MenuHelp = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M9.75 9.5a2.3 2.3 0 0 1 4.45.8c0 1.6-2.2 2-2.2 3.4" />
    <Dot x={12} y={16.75} />
  </Svg>
);
export const MenuKeyboard = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <Dot x={7} y={10} />
    <Dot x={10.33} y={10} />
    <Dot x={13.67} y={10} />
    <Dot x={17} y={10} />
    <path d="M8 14.5h8" />
  </Svg>
);
export const MenuSignOut = (p: P) => (
  <Svg {...p}>
    <path d="M14.5 4.5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h7.5" />
    <path d="M10.5 12H20M16.5 8.5 20 12l-3.5 3.5" />
  </Svg>
);
