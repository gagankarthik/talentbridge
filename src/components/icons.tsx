import type { SVGProps } from "react";

// Bespoke 1.5px monoline icon set (PRD §3.2). 24px grid, round joins, no fills.
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

export const IconSearch = make(<><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></>);
export const IconBench = make(<><path d="M3 20h18" /><path d="M5 20V10h14v10" /><path d="M9 20v-5h6v5" /><path d="M3 10l9-6 9 6" /></>);
export const IconBookmark = make(<path d="M7 3.75h10a.75.75 0 0 1 .75.75V20.5L12 16.5l-5.75 4V4.5A.75.75 0 0 1 7 3.75Z" />);
export const IconBookmarkFilled = (p: IconProps) => (
  <Icon {...p}><path d="M7 3.75h10a.75.75 0 0 1 .75.75V20.5L12 16.5l-5.75 4V4.5A.75.75 0 0 1 7 3.75Z" fill="currentColor" /></Icon>
);
export const IconLock = make(<><rect x="5" y="10.5" width="14" height="10" rx="1.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><path d="M12 14.5v2.5" /></>);
export const IconUnlock = make(<><rect x="5" y="10.5" width="14" height="10" rx="1.5" /><path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.75" /></>);
export const IconFile = make(<><path d="M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5L14 3.5Z" /><path d="M14 3.5V7.5h4" /><path d="M9 12h6M9 15.5h6" /></>);
export const IconUpload = make(<><path d="M12 15V4" /><path d="m7.5 8.5 4.5-4.5 4.5 4.5" /><path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" /></>);
export const IconShield = make(<><path d="M12 3 5 5.75v5.5c0 4.5 3 8 7 9.75 4-1.75 7-5.25 7-9.75v-5.5L12 3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>);
export const IconClock = make(<><circle cx="12" cy="12" r="8.25" /><path d="M12 7.5V12l3 2" /></>);
export const IconCalendar = make(<><rect x="4" y="5.5" width="16" height="14.5" rx="1.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>);
export const IconColumns = make(<><rect x="3.5" y="4.5" width="17" height="15" rx="1.5" /><path d="M9.25 4.5v15M14.75 4.5v15" /></>);
export const IconCalculator = make(<><rect x="5" y="3.5" width="14" height="17" rx="1.5" /><path d="M8.5 7.5h7" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" strokeWidth={2} /></>);
export const IconChevronDown = make(<path d="m6.5 9.5 5.5 5.5 5.5-5.5" />);
export const IconChevronRight = make(<path d="m9.5 6.5 5.5 5.5-5.5 5.5" />);
export const IconX = make(<path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />);
export const IconCheck = make(<path d="m5.5 12.5 4 4 9-9.5" />);
export const IconPlus = make(<path d="M12 5.5v13M5.5 12h13" />);
export const IconGrid = make(<><rect x="4" y="4" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" /></>);
export const IconRows = make(<path d="M4 6.5h16M4 12h16M4 17.5h16" />);
export const IconGlobe = make(<><circle cx="12" cy="12" r="8.25" /><path d="M3.75 12h16.5M12 3.75c2.25 2.3 3.4 5.05 3.4 8.25S14.25 18 12 20.25C9.75 18 8.6 15.2 8.6 12S9.75 6.05 12 3.75Z" /></>);
export const IconCloud = make(<path d="M7.5 18.5h9.75a3.75 3.75 0 0 0 .5-7.47A5.5 5.5 0 0 0 7.2 10.1 4.2 4.2 0 0 0 7.5 18.5Z" />);
export const IconId = make(<><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><circle cx="9" cy="11" r="2" /><path d="M6 15.5c.6-1.3 1.7-2 3-2s2.4.7 3 2M14.5 10h3M14.5 13h3" /></>);
export const IconExternal = make(<><path d="M13.5 4.5h6v6" /><path d="M19.5 4.5 11 13" /><path d="M17 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7H10" /></>);
export const IconPrinter = make(<><path d="M7 8.5V4h10v4.5" /><rect x="4" y="8.5" width="16" height="7.5" rx="1.5" /><path d="M7 13.5h10V20H7z" /></>);
export const IconAlert = make(<><path d="M10.3 4.6 3.4 17a2 2 0 0 0 1.7 3h13.8a2 2 0 0 0 1.7-3L13.7 4.6a2 2 0 0 0-3.4 0Z" /><path d="M12 9.5v4M12 16.8h.01" /></>);
export const IconSliders = make(<><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>);
export const IconMail = make(<><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4 6.5 8 6 8-6" /></>);
export const IconBuilding = make(<><path d="M4.5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 14.5 5v15.5" /><path d="M14.5 9.5H18a1.5 1.5 0 0 1 1.5 1.5v9.5" /><path d="M3 20.5h18M8 7.5h3M8 11h3M8 14.5h3" /></>);
export const IconEyeOff = make(<><path d="M4 4l16 16" /><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c5 0 8.5 4.5 9 6-.25.75-1.2 2.3-2.8 3.7M6.4 7.9C4.6 9.2 3.4 10.9 3 12c.5 1.5 4 6 9 6 1.5 0 2.9-.4 4.1-1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>);
export const IconLayers = make(<><path d="m12 4 8.5 4.5L12 13 3.5 8.5 12 4Z" /><path d="m3.5 12.5 8.5 4.5 8.5-4.5" /><path d="m3.5 16.5 8.5 4.5 8.5-4.5" /></>);
export const IconInbox = make(<><path d="M3.5 13.5 6 5.5h12l2.5 8V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19v-5.5Z" /><path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5" /></>);
export const IconSend = make(<><path d="M20.5 3.5 10 14" /><path d="m20.5 3.5-6.5 17-4-6.5-6.5-4 17-6.5Z" /></>);
export const IconRefresh = make(<><path d="M19.5 12a7.5 7.5 0 0 1-13.1 5M4.5 12a7.5 7.5 0 0 1 13.1-5" /><path d="M17.6 3.5V7h-3.5M6.4 20.5V17h3.5" /></>);
export const IconDrag = make(<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" strokeWidth={2.25} />);
export const IconUsers = make(<><circle cx="9" cy="8.5" r="3.25" /><path d="M3.5 19.5c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" /><path d="M15.5 5.5a3.25 3.25 0 0 1 0 6.3M17.5 14.7c1.6.7 2.7 2.4 3 4.8" /></>);
/** Export: a sheet with rows sliding into a tray. */
export const IconExport = make(<><path d="M12 3.5v10" /><path d="m8 10 4 4 4-4" /><path d="M4.5 14.5v3.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5" /><path d="M8 17.5h8" /></>);
export const IconPhone = make(<path d="M8.5 3.75H6A2.25 2.25 0 0 0 3.75 6c0 7.87 6.38 14.25 14.25 14.25A2.25 2.25 0 0 0 20.25 18v-2.5l-4.25-1.5-1.75 1.75a11.1 11.1 0 0 1-5.25-5.25L10.75 8.75 9.25 4.5Z" />);
export const IconQuote = make(<path d="M9.5 7.5C6.5 8.5 5 10.75 5 14v3.5h5V13H7.5c0-2 .75-3.25 2.5-4ZM18.5 7.5c-3 1-4.5 3.25-4.5 6.5v3.5h5V13h-2.5c0-2 .75-3.25 2.5-4Z" />);
export const IconLinkedIn = make(<><rect x="3.75" y="3.75" width="16.5" height="16.5" rx="3" /><path d="M8 10.5V16M8 7.75v.01M11.5 16v-3.25a2.25 2.25 0 0 1 4.5 0V16M11.5 10.5V16" /></>);
export const IconYouTube = make(<><rect x="3" y="6" width="18" height="12" rx="4" /><path d="m10.5 9.5 4 2.5-4 2.5z" /></>);
export const IconMenu = make(<path d="M4 7h16M4 12h16M4 17h16" />);

/** Brand mark: two piers and a suspended deck. */
export function LogoMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2.5 15.5h19" />
      <path d="M6.5 20.5v-15M17.5 20.5v-15" />
      <path d="M6.5 6c1.8 5 3.4 7.5 5.5 7.5S15.7 11 17.5 6" />
      <path d="M9.25 11.3v4.2M12 13.5v2M14.75 11.3v4.2" />
    </svg>
  );
}
