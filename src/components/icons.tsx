import type { SVGProps } from "react";

/*
 * TalentBridge icon system (shared with components/workspace-icons.tsx).
 *   Grid 24 · live area 18 (3–21) · stroke 1.5 · round caps and joins · no fills.
 *   Keylines: circle r 8.25 · square 16 · portrait 14×17 · landscape 17×13.
 *   Container corners 2 (small parts 1–1.5). Dots are real r 1 discs.
 * Draw on the keylines so every glyph carries the same optical weight.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

const make = (paths: React.ReactNode) => {
  const C = (p: IconProps) => <Icon {...p}>{paths}</Icon>;
  return C;
};

/** A solid dot on the grid (keypad keys, bullets, info points). */
const Dot = ({ x, y, r = 1 }: { x: number; y: number; r?: number }) => <circle cx={x} cy={y} r={r} fill="currentColor" stroke="none" />;

const bookmark = "M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.5L12 16.5l-6.5 4V5A1.5 1.5 0 0 1 7 3.5Z";
const tray = "M4 14.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.5";

export const IconSearch = make(<><circle cx="10.75" cy="10.75" r="6.5" /><path d="m15.5 15.5 4.75 4.75" /></>);
export const IconBench = make(<><path d="M3.5 10 12 4.5l8.5 5.5" /><path d="M5.5 8.75V20h13V8.75" /><path d="M10 20v-5h4v5" /><path d="M3 20h18" /></>);
export const IconBookmark = make(<path d={bookmark} />);
export const IconBookmarkFilled = (p: IconProps) => (
  <Icon {...p}><path d={bookmark} fill="currentColor" /></Icon>
);
export const IconLock = make(<><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><path d="M12 14.5v2" /></>);
export const IconUnlock = make(<><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 7.75-1.4" /><path d="M12 14.5v2" /></>);
export const IconFile = make(<><path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9Z" /><path d="M13.5 3.5V9H19" /><path d="M9 13h6M9 16.5h4" /></>);
export const IconUpload = make(<><path d="M12 15.5v-11" /><path d="M7.5 9 12 4.5 16.5 9" /><path d={tray} /></>);
export const IconShield = make(<><path d="M12 3.25 4.75 6v5.25c0 4.6 3.05 8.1 7.25 9.5 4.2-1.4 7.25-4.9 7.25-9.5V6Z" /><path d="m9 12 2.25 2.25L15.25 10" /></>);
export const IconClock = make(<><circle cx="12" cy="12" r="8.25" /><path d="M12 7.5V12l3 2" /></>);
export const IconCalendar = make(<><rect x="4" y="5" width="16" height="15.5" rx="2" /><path d="M4 10h16M8.5 3v4M15.5 3v4" /><Dot x={8.5} y={14} /><Dot x={12} y={14} /><Dot x={15.5} y={14} /></>);
export const IconColumns = make(<><rect x="3.75" y="4.75" width="16.5" height="14.5" rx="2" /><path d="M9.25 4.75v14.5M14.75 4.75v14.5" /></>);
export const IconCalculator = make(<><rect x="5" y="3.5" width="14" height="17" rx="2" /><rect x="8" y="6.5" width="8" height="3" rx="0.75" /><Dot x={8.75} y={13.25} /><Dot x={12} y={13.25} /><Dot x={15.25} y={13.25} /><Dot x={8.75} y={16.75} /><Dot x={12} y={16.75} /><Dot x={15.25} y={16.75} /></>);
export const IconChevronDown = make(<path d="m6 9.5 6 6 6-6" />);
export const IconChevronRight = make(<path d="m9.5 6 6 6-6 6" />);
export const IconX = make(<path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />);
export const IconCheck = make(<path d="M5 12.5 9.5 17 19 7.5" />);
export const IconPlus = make(<path d="M12 5v14M5 12h14" />);
export const IconArrowRight = make(<path d="M4.5 12h15M13.5 6l6 6-6 6" />);
export const IconGrid = make(<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>);
export const IconRows = make(<><path d="M8.5 6.5H20M8.5 12H20M8.5 17.5H20" /><Dot x={4.75} y={6.5} /><Dot x={4.75} y={12} /><Dot x={4.75} y={17.5} /></>);
export const IconGlobe = make(<><circle cx="12" cy="12" r="8.25" /><path d="M3.75 12h16.5M12 3.75c2.25 2.3 3.4 5.05 3.4 8.25S14.25 18 12 20.25C9.75 18 8.6 15.2 8.6 12S9.75 6.05 12 3.75Z" /></>);
export const IconCloud = make(<path d="M7.25 19h10a4 4 0 0 0 .6-7.95 6 6 0 0 0-11.55 1.2A3.4 3.4 0 0 0 7.25 19Z" />);
export const IconId = make(<><rect x="3.5" y="5" width="17" height="14" rx="2" /><circle cx="9" cy="10.75" r="2" /><path d="M6 16c.6-1.35 1.7-2.1 3-2.1s2.4.75 3 2.1M14.5 10h3M14.5 13.5h3" /></>);
export const IconExternal = make(<><path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M18 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4.5" /></>);
export const IconPrinter = make(<><path d="M7 8.5V4h10v4.5" /><rect x="3.5" y="8.5" width="17" height="8" rx="2" /><path d="M7 14h10v6H7Z" /></>);
export const IconAlert = make(<><path d="M10.3 4.6 3.4 17a2 2 0 0 0 1.7 3h13.8a2 2 0 0 0 1.7-3L13.7 4.6a2 2 0 0 0-3.4 0Z" /><path d="M12 9.5v4" /><Dot x={12} y={16.75} /></>);
export const IconSliders = make(<><path d="M4 7h8.5M16.5 7H20M4 17h3.5M11.5 17H20" /><circle cx="14.5" cy="7" r="2" /><circle cx="9.5" cy="17" r="2" /></>);
export const IconMail = make(<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7.5 8 5.5 8-5.5" /></>);
export const IconBuilding = make(<><path d="M4.5 20.5V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14.5" /><path d="M15.5 10h2a2 2 0 0 1 2 2v8.5" /><path d="M3 20.5h18M8 8h4M8 11.5h4M8 15h4" /></>);
export const IconEyeOff = make(<><path d="M4 4l16 16" /><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c5 0 8.5 4.5 9 6-.25.75-1.2 2.3-2.8 3.7M6.4 7.9C4.6 9.2 3.4 10.9 3 12c.5 1.5 4 6 9 6 1.5 0 2.9-.4 4.1-1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>);
export const IconLayers = make(<><path d="m12 4 8.5 4.5L12 13 3.5 8.5 12 4Z" /><path d="m3.5 12.5 8.5 4.5 8.5-4.5" /><path d="m3.5 16.5 8.5 4.5 8.5-4.5" /></>);
export const IconInbox = make(<><path d="M3.5 13.5 6 5.5h12l2.5 8V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-4.5Z" /><path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5" /></>);
export const IconSend = make(<><path d="M20.5 3.5 10 14" /><path d="m20.5 3.5-6.5 17-4-6.5-6.5-4 17-6.5Z" /></>);
export const IconRefresh = make(<><path d="M19.5 12a7.5 7.5 0 0 1-13.1 5M4.5 12a7.5 7.5 0 0 1 13.1-5" /><path d="M17.6 3.5V7h-3.5M6.4 20.5V17h3.5" /></>);
export const IconDrag = make(<><Dot x={9} y={6} r={1.15} /><Dot x={15} y={6} r={1.15} /><Dot x={9} y={12} r={1.15} /><Dot x={15} y={12} r={1.15} /><Dot x={9} y={18} r={1.15} /><Dot x={15} y={18} r={1.15} /></>);
export const IconUsers = make(<><circle cx="9" cy="8.5" r="3.25" /><path d="M3.5 19.5c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" /><path d="M15.5 5.5a3.25 3.25 0 0 1 0 6.3M17.5 14.7c1.6.7 2.7 2.4 3 4.8" /></>);
/** Export: data leaves into the tray (download direction). */
export const IconExport = make(<><path d="M12 4.5v11" /><path d="M7.5 11 12 15.5 16.5 11" /><path d={tray} /></>);
export const IconPhone = make(<path d="M8.5 3.75H6A2.25 2.25 0 0 0 3.75 6c0 7.87 6.38 14.25 14.25 14.25A2.25 2.25 0 0 0 20.25 18v-2.5l-4.25-1.5-1.75 1.75a11.1 11.1 0 0 1-5.25-5.25L10.75 8.75 9.25 4.5Z" />);
export const IconQuote = make(<path d="M9.5 7.5C6.5 8.5 5 10.75 5 14v3.5h5V13H7.5c0-2 .75-3.25 2.5-4ZM18.5 7.5c-3 1-4.5 3.25-4.5 6.5v3.5h5V13h-2.5c0-2 .75-3.25 2.5-4Z" />);
export const IconLinkedIn = make(<><rect x="3.75" y="3.75" width="16.5" height="16.5" rx="3" /><path d="M8 10.5V16M11.5 16v-3.25a2.25 2.25 0 0 1 4.5 0V16M11.5 10.5V16" /><Dot x={8} y={7.75} /></>);
export const IconYouTube = make(<><rect x="3" y="6" width="18" height="12" rx="4" /><path d="m10.5 9.5 4 2.5-4 2.5z" /></>);
export const IconMenu = make(<path d="M4 7h16M4 12h16M4 17h16" />);
/** Overflow menu: three discs on the horizontal axis. */
export const IconMore = make(<><Dot x={6} y={12} r={1.25} /><Dot x={12} y={12} r={1.25} /><Dot x={18} y={12} r={1.25} /></>);
export const IconFilter = make(<path d="M4 5.5h16l-6 7.25V19l-4-1.75v-4.5Z" />);
export const IconSort = make(<><path d="M7.5 4.5v15M4 16l3.5 3.5L11 16" /><path d="M16.5 19.5v-15M13 8l3.5-3.5L20 8" /></>);

/** Brand mark: a bridge deck over an arched pier. The deck doubles as the redaction bar of a blind profile. */
/* Vetting checks: one glyph per gate a profile passes before it is presented */
export const IconPanel = make(
  <>
    <rect x="3.5" y="4" width="17" height="11.5" rx="2" />
    <path d="m10 7.75-2 2 2 2M14 7.75l2 2-2 2M12 15.5V20M8.5 20h7" />
  </>,
);
export const IconShieldCheck = make(
  <>
    <path d="M12 3.5 18.5 6v5.25c0 4.1-2.75 7.4-6.5 8.75-3.75-1.35-6.5-4.65-6.5-8.75V6Z" />
    <path d="m9.25 12 2 2 3.5-3.75" />
  </>,
);
export const IconCalendarCheck = make(
  <>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4M9.5 14.5l1.75 1.75 3.25-3.5" />
  </>,
);
export const IconDeploy = make(
  <>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0M15.5 12.5h5M18.5 10.25l2.25 2.25-2.25 2.25" />
  </>,
);

export function LogoMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="2" y="3" width="20" height="4.5" />
      <path d="M2 9.5h20V21h-6v-5a4 4 0 0 0-8 0v5H2z" />
    </svg>
  );
}
