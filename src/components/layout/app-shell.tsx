"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useWorkspace } from "@/lib/workspace-store";
import { useDemoNow } from "@/lib/clock";
import { IconChevronDown, IconExternal, IconMenu, IconSearch, IconX, LogoMark } from "@/components/icons";
import { Kbd } from "@/components/ui/data-display";
import { CommandPalette, type PaletteGroup } from "./command-palette";
import {
  MenuBell,
  MenuHelp,
  MenuKeyboard,
  MenuOrg,
  MenuProfile,
  MenuSignOut,
  NavBench,
  NavCandidates,
  NavAudit,
  NavCollapse,
  NavDashboard,
  NavOrgs,
  NavTeam,
  NavCompliance,
  NavHolds,
  NavInventory,
  NavRates,
  NavShortlist,
} from "@/components/workspace-icons";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  badge?: number;
  badgeTone?: "flag";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export interface ShellUser {
  name: string;
  company: string;
  email: string;
}

const COLLAPSE_KEY = "talentbridge.sidebar.collapsed";
const W_OPEN = 240;
const W_RAIL = 64;

function RailTip({ show, label, children }: { show: boolean; label: string; children: React.ReactElement }) {
  if (!show) return children;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="right" sideOffset={10} className="anim-fade z-50 rounded-md bg-ink px-2.5 py-1.5 font-brand text-[12.5px] font-medium text-white shadow-overlay">
          {label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

/** Avatar pill in the header; opens the account menu. */
function UserMenu({ user, platform }: { user: ShellUser; platform: boolean }) {
  const initials = initialsOf(user.name);
  const item =
    "flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-[14px] text-ink-2 outline-none data-[highlighted]:bg-well data-[highlighted]:text-ink [&_svg]:text-subtle";
  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className="flex h-9 shrink-0 items-center gap-2 rounded-md py-1 pr-2 pl-1 text-[14px] font-medium text-white outline-none transition-colors duration-150 ease-power3-out hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70 data-[state=open]:bg-white/10"
        aria-label="Account menu"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-brand text-[12px] font-semibold text-white">{initials}</span>
        <span className="hidden max-w-[160px] truncate md:block">{user.name}</span>
        <IconChevronDown size={14} className="hidden text-[#b8c4d8] md:block" />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={8} className="app anim-pop z-50 w-64 rounded-lg bg-surface p-1 shadow-overlay">
          <div className="flex items-center gap-2.5 px-2.5 py-2.5">
            <span className="grid size-9 place-items-center rounded-md bg-brand text-[13px] font-semibold text-white">{initials}</span>
            <span className="min-w-0 text-[13px] leading-tight">
              <span className="block font-semibold text-ink">{user.name}</span>
              <span className="block truncate text-subtle">{user.email}</span>
            </span>
          </div>
          <Dropdown.Separator className="my-1 h-px bg-hair" />
          {(platform
            ? [
                { href: "/admin/team", icon: MenuProfile, label: "Platform team" },
                { href: "/admin/audit", icon: MenuBell, label: "Audit log" },
              ]
            : [
                { href: "/settings/profile", icon: MenuProfile, label: "Profile" },
                { href: "/settings/organization", icon: MenuOrg, label: "Organization" },
                { href: "/settings/profile#notifications", icon: MenuBell, label: "Notifications" },
              ]
          ).map((x) => (
            <Dropdown.Item key={x.href} className={item} asChild>
              <Link href={x.href}>
                <x.icon size={16} /> {x.label}
              </Link>
            </Dropdown.Item>
          ))}
          <Dropdown.Separator className="my-1 h-px bg-hair" />
          <Dropdown.Item className={item} asChild>
            <Link href="/help">
              <MenuHelp size={16} /> Help and support
            </Link>
          </Dropdown.Item>
          <Dropdown.Item className={item} asChild>
            <Link href="/help#shortcuts">
              <MenuKeyboard size={16} /> Keyboard shortcuts
              <Kbd className="ml-auto">/</Kbd>
            </Link>
          </Dropdown.Item>
          <Dropdown.Separator className="my-1 h-px bg-hair" />
          <Dropdown.Item className={cn(item, "text-tag-red-text data-[highlighted]:bg-tag-red-bg data-[highlighted]:text-tag-red-text [&_svg]:text-tag-red-text")} asChild>
            <Link href="/">
              <MenuSignOut size={16} /> Sign out
            </Link>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

/**
 * Signed-in shell, enterprise register (Workday / Salesforce):
 *  - Full-width 56px navy global header: logo and org, the one search (opens the
 *    ⌘K palette), help, notifications, account menu.
 *  - 240px white sidebar under it with sectioned navigation; collapses to a 64px
 *    rail with tooltips, and becomes a drawer below lg. No search, no widgets.
 *  - Canvas content area; pages compose PageHeader + PageBody.
 * `customer` is a partner organization's workspace; `platform` is TalentBridge's internal console.
 */
export function AppShell({
  user,
  complianceFlags = 0,
  variant = "customer",
  banner,
  palette = [],
  children,
}: {
  user: ShellUser;
  complianceFlags?: number;
  variant?: "customer" | "platform";
  banner?: React.ReactNode;
  /** Record groups for the command palette (candidates, organizations), built server-side. */
  palette?: PaletteGroup[];
  children: React.ReactNode;
}) {
  const platform = variant === "platform";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { shortlist, myRequests } = useWorkspace();
  const now = useDemoNow(30_000);
  const activeHolds = myRequests.filter((r) => r.lockExpiresAt && new Date(r.lockExpiresAt).getTime() > now).length;

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
      } catch {
        /* storage unavailable */
      }
    });
  }, []);
  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {
        /* storage unavailable */
      }
      return !c;
    });

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  const sections: NavSection[] = platform
    ? [
        {
          title: "Platform",
          items: [
            { href: "/admin", label: "Overview", icon: NavDashboard },
            { href: "/admin/organizations", label: "Organizations", icon: NavOrgs },
            { href: "/admin/team", label: "Platform team", icon: NavTeam },
            { href: "/admin/audit", label: "Audit log", icon: NavAudit },
          ],
        },
        {
          title: "Operations",
          items: [
            { href: "/admin/candidates", label: "Candidates", icon: NavCandidates },
            { href: "/ops/bench", label: "Bench tracker", icon: NavBench },
            { href: "/ops/compliance", label: "Compliance", icon: NavCompliance, badge: complianceFlags || undefined, badgeTone: "flag" },
            { href: "/ops/rates", label: "Rates and margin", icon: NavRates },
          ],
        },
      ]
    : [
        {
          title: "Workspace",
          items: [
            { href: "/dashboard", label: "Dashboard", icon: NavDashboard },
            { href: "/talent", label: "Talent inventory", icon: NavInventory },
            { href: "/shortlist", label: "Shortlist", icon: NavShortlist, badge: shortlist.length || undefined },
            { href: "/requests", label: "Requests and holds", icon: NavHolds, badge: activeHolds || undefined },
          ],
        },
        {
          title: "Account",
          items: [
            { href: "/settings/organization", label: "Organization", icon: MenuOrg },
            { href: "/settings/profile", label: "Profile", icon: MenuProfile },
          ],
        },
      ];
  const home = platform ? "/admin" : "/dashboard";
  const isActive = (href: string) => pathname === href || (href !== home && pathname.startsWith(href + "/"));

  const paletteGroups: PaletteGroup[] = [
    {
      heading: "Go to",
      entries: [
        ...sections.flatMap((s) => s.items.map((i) => ({ id: `nav:${i.href}`, label: i.label, meta: s.title, href: i.href, icon: <i.icon size={15} /> }))),
        { id: "nav:/help", label: "Help and support", meta: "Help", href: "/help", icon: <MenuHelp size={15} /> },
      ],
    },
    ...palette,
  ];

  const itemClass = (mini: boolean) => cn("flex h-9 items-center rounded-md text-[14px] transition-colors duration-150 ease-power3-out outline-none focus-visible:ring-2 focus-visible:ring-brand", mini ? "mx-auto w-10 justify-center" : "w-full gap-3 px-3");

  const navLink = (item: NavItem, mini: boolean) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <li key={item.href}>
        <RailTip show={mini} label={item.badge ? `${item.label} (${item.badge})` : item.label}>
          <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            aria-label={mini ? item.label : undefined}
            className={cn("group relative", itemClass(mini), active ? "bg-side-active font-semibold text-brand-strong" : "text-side-text hover:bg-well hover:text-ink")}
          >
            <span className={cn("shrink-0 transition-colors duration-150", active ? "text-brand" : "text-subtle group-hover:text-ink")}>
              <Icon size={18} />
            </span>
            {!mini && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
            {item.badge !== undefined &&
              (mini ? (
                <span className={cn("absolute top-1.5 right-1.5 size-2 rounded-full ring-2 ring-white", item.badgeTone === "flag" ? "bg-flag" : "bg-brand")} />
              ) : (
                <span
                  className={cn(
                    "tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[12px] font-semibold",
                    item.badgeTone === "flag" ? "bg-flag-bg text-flag-ink" : active ? "bg-white text-brand-strong" : "bg-[#eceff3] text-muted",
                  )}
                >
                  {item.badge}
                </span>
              ))}
          </Link>
        </RailTip>
      </li>
    );
  };

  const sidebar = (mini: boolean, mobile = false) => (
    <nav aria-label={platform ? "Platform console" : "Workspace"} className="flex h-full flex-col border-r border-side-line bg-side">
      {mobile && (
        <div className="flex h-14 shrink-0 items-center justify-between bg-navy px-4">
          <span className="flex items-center gap-2.5">
            <LogoMark size={22} className="text-signal" />
            <span className="font-brand text-[16px] font-semibold tracking-[-0.02em] text-white">TalentBridge</span>
          </span>
          <Dialog.Close className="grid size-10 place-items-center rounded-md text-white hover:bg-white/10" aria-label="Close navigation">
            <IconX size={18} />
          </Dialog.Close>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-5 pb-3">
        {mobile && <p className="mb-4 truncate px-3 text-[13px] text-subtle">{platform ? "Platform console" : user.company}</p>}
        {sections.map((s, i) => (
          <div key={s.title} className={cn(i > 0 && "mt-6")}>
            {mini ? i > 0 && <div aria-hidden="true" className="mx-auto mb-4 h-px w-8 bg-side-line" /> : <p className="eyebrow px-3 pb-2">{s.title}</p>}
            <ul className="flex flex-col gap-0.5">{s.items.map((it) => navLink(it, mini))}</ul>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-side-line px-3 py-3">
        <ul className="flex flex-col gap-0.5">
          {!platform && navLink({ href: "/help", label: "Help and support", icon: MenuHelp }, mini)}
          <li>
            <RailTip show={mini} label="Public website">
              <Link href="/" aria-label={mini ? "Public website" : undefined} className={cn(itemClass(mini), "text-side-text hover:bg-well hover:text-ink")}>
                <span className="text-subtle">
                  <IconExternal size={18} />
                </span>
                {!mini && "Public website"}
              </Link>
            </RailTip>
          </li>
          {!mobile && (
            <li>
              <RailTip show={mini} label="Expand sidebar">
                <button onClick={toggle} className={cn(itemClass(mini), "text-side-text hover:bg-well hover:text-ink")} aria-label={mini ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!mini}>
                  <span className="text-subtle">
                    <NavCollapse collapsed={mini} size={18} />
                  </span>
                  {!mini && "Collapse"}
                </button>
              </RailTip>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );

  return (
    <div className="app min-h-screen bg-well" style={{ ["--side-w" as string]: `${collapsed ? W_RAIL : W_OPEN}px` }}>
      {/* Global header */}
      <header className="no-print fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-2 bg-navy px-2 text-white sm:gap-3 sm:px-4">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger className="grid size-10 shrink-0 place-items-center rounded-md text-white hover:bg-white/10 lg:hidden" aria-label="Open navigation">
            <IconMenu size={20} />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="anim-fade fixed inset-0 z-50 bg-navy/50 lg:hidden" />
            <Dialog.Content aria-describedby={undefined} className="app anim-sheet-left fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] outline-none lg:hidden">
              <Dialog.Title className="sr-only">Navigation</Dialog.Title>
              {sidebar(false, true)}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Link href={home} className="flex shrink-0 items-center gap-2.5 rounded-md px-1 outline-none focus-visible:ring-2 focus-visible:ring-white/70" aria-label={platform ? "Platform console home" : "TalentBridge workspace home"}>
          <LogoMark size={24} className="shrink-0 text-signal" />
          <span className="font-brand text-[17px] font-semibold tracking-[-0.02em]">TalentBridge</span>
        </Link>
        <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-white/20 lg:block" />
        <span className="hidden max-w-[220px] truncate text-[14px] text-[#b8c4d8] lg:block">{platform ? "Platform console" : user.company}</span>

        <div className="flex min-w-0 flex-1 justify-center px-2">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden h-9 w-full max-w-[480px] items-center gap-2.5 rounded-md bg-white/10 px-3 text-[14px] text-[#b8c4d8] ring-1 ring-white/15 transition-colors duration-150 ease-power3-out ring-inset hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 md:flex"
          >
            <IconSearch size={16} className="shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left">{platform ? "Search candidates, organizations and pages" : "Search candidates and pages"}</span>
            <span className="shrink-0 rounded bg-white/10 px-1.5 text-[12px] leading-5 text-[#d5dded]">⌘K</span>
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button type="button" onClick={() => setPaletteOpen(true)} className="grid size-10 place-items-center rounded-md text-white hover:bg-white/10 md:hidden" aria-label="Search">
            <IconSearch size={18} />
          </button>
          <Link href="/help" className="hidden size-10 place-items-center rounded-md text-white transition-colors hover:bg-white/10 sm:grid" aria-label="Help and support">
            <MenuHelp size={18} />
          </Link>
          <Link
            href={platform ? "/ops/compliance" : "/settings/profile#notifications"}
            className="relative hidden size-10 place-items-center rounded-md text-white transition-colors hover:bg-white/10 sm:grid"
            aria-label={platform && complianceFlags ? `Notifications, ${complianceFlags} compliance flags` : "Notifications"}
          >
            <MenuBell size={18} />
            {platform && complianceFlags > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-flag ring-2 ring-navy" />}
          </Link>
          <UserMenu user={user} platform={platform} />
        </div>
      </header>

      <aside className="no-print fixed top-14 bottom-0 left-0 z-30 hidden w-(--side-w) transition-[width] duration-200 ease-power3-out lg:block">{sidebar(collapsed)}</aside>

      <div className="min-w-0 pt-14 transition-[padding] duration-200 ease-power3-out lg:pl-(--side-w)">
        {banner ? <div className="no-print sticky top-14 z-20">{banner}</div> : null}
        <main className="min-w-0">{children}</main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        groups={paletteGroups}
        fallback={
          platform
            ? { label: (q) => `Search all candidates for “${q}”`, href: (q) => `/admin/candidates?q=${encodeURIComponent(q)}` }
            : { label: (q) => `Search the talent inventory for “${q}”`, href: (q) => `/talent?q=${encodeURIComponent(q)}` }
        }
      />
    </div>
  );
}

/** Shared page width and gutter: every app page aligns to the same column. */
export const pageX = "mx-auto w-full max-w-[1440px] px-4 sm:px-8";

/**
 * Page header on the canvas: optional breadcrumb, 24px title with an optional
 * status chip, a one-line description, actions on the right, and an optional
 * tab strip (UnderlineTabs / TabLinks) as `tabs`.
 */
export function PageHeader({
  title,
  description,
  status,
  actions,
  tabs,
  breadcrumb,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  /** Small chip after the title, e.g. <Tag tone="green" dot>Live</Tag> */
  status?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  /** Ancestors of this page, e.g. [{ label: "Organizations", href: "/admin/organizations" }] */
  breadcrumb?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("bg-well", !!tabs && "border-b border-hair")}>
      <div className={cn(pageX, "pt-6 sm:pt-8", !tabs && "pb-0")}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-subtle">
              {breadcrumb.map((b, i) => (
                <li key={b.label} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {b.href ? (
                    <Link href={b.href} className="hover:text-brand hover:underline">
                      {b.label}
                    </Link>
                  ) : (
                    <span>{b.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-brand text-[24px] leading-tight font-semibold tracking-[-0.02em] text-ink">{title}</h1>
              {status}
            </div>
            {description && <p className="mt-1.5 max-w-[72ch] text-[14px] leading-relaxed text-muted">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
        {children && <div className="mt-4">{children}</div>}
        {tabs && <div className="mt-5">{tabs}</div>}
      </div>
    </header>
  );
}

/** Page content below the header: same column as the header, calm vertical rhythm. */
export function PageBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(pageX, "py-6 sm:py-8", className)}>{children}</div>;
}
