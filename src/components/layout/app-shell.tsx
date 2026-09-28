"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useWorkspace } from "@/lib/workspace-store";
import { useDemoNow } from "@/lib/clock";
import { IconChevronDown, IconMenu, IconSearch, IconX, LogoMark } from "@/components/icons";
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

export interface ShellUser {
  name: string;
  company: string;
  email: string;
}

const COLLAPSE_KEY = "talentbridge.sidebar.collapsed";

function RailTip({ show, label, children }: { show: boolean; label: string; children: React.ReactElement }) {
  if (!show) return children;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side="right" sideOffset={12} className="anim-fade z-50 rounded-[6px] bg-ink px-2.5 py-1.5 text-[12.5px] font-medium text-white shadow-lg">
          {label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function UserMenu({ user, platform }: { user: ShellUser; platform: boolean }) {
  const initials = user.name.split(" ").map((p) => p[0]).join("");
  const item = "flex h-9 cursor-pointer items-center gap-3 rounded-[8px] px-2.5 text-[13.5px] text-ink-2 outline-none data-[highlighted]:bg-canvas data-[highlighted]:text-ink";
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex shrink-0 items-center gap-2.5 rounded-full p-1 outline-none hover:bg-canvas data-[state=open]:bg-canvas xl:pr-2.5" aria-label="Account menu">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-night text-[12px] font-semibold text-brand-bright">{initials}</span>
        <span className="hidden text-left text-[13px] leading-tight whitespace-nowrap xl:block">
          <span className="block font-medium text-ink">{user.name}</span>
          <span className="block text-subtle">{user.company}</span>
        </span>
        <IconChevronDown size={14} className="hidden text-subtle xl:block" />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={8} className="anim-dialog z-50 w-64 rounded-[12px] bg-surface p-1.5 shadow-[0_24px_48px_-16px_rgb(7_26_20/0.3)] ring-1 ring-line">
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-night text-[12.5px] font-semibold text-brand-bright">{initials}</span>
            <span className="min-w-0 text-[13px] leading-tight">
              <span className="block font-semibold text-ink">{user.name}</span>
              <span className="block truncate text-subtle">{user.email}</span>
            </span>
          </div>
          <Dropdown.Separator className="my-1 h-px bg-line" />
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
                <x.icon size={17} /> {x.label}
              </Link>
            </Dropdown.Item>
          ))}
          <Dropdown.Separator className="my-1 h-px bg-line" />
          <Dropdown.Item className={item} asChild>
            <Link href="/help">
              <MenuHelp size={17} /> Help and support
            </Link>
          </Dropdown.Item>
          <Dropdown.Item className={item} asChild>
            <Link href="/help#shortcuts">
              <MenuKeyboard size={17} /> Keyboard shortcuts
              <kbd className="ml-auto rounded-[4px] px-1.5 text-[11px] text-subtle ring-1 ring-line">/</kbd>
            </Link>
          </Dropdown.Item>
          <Dropdown.Separator className="my-1 h-px bg-line" />
          <Dropdown.Item className={cn(item, "text-flag-ink data-[highlighted]:bg-flag-bg data-[highlighted]:text-flag-ink")} asChild>
            <Link href="/">
              <MenuSignOut size={17} /> Sign out
            </Link>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

/** `customer` is a partner organization's workspace; `platform` is TalentBridge's internal console. */
export function AppShell({ user, complianceFlags = 0, variant = "customer", banner, children }: { user: ShellUser; complianceFlags?: number; variant?: "customer" | "platform"; banner?: React.ReactNode; children: React.ReactNode }) {
  const platform = variant === "platform";
  const pathname = usePathname();
  const onCandidates = pathname.startsWith("/admin/candidates");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [jump, setJump] = useState("");
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

  const groups: NavItem[][] = platform
    ? [
        [
          { href: "/admin", label: "Overview", icon: NavDashboard },
          { href: "/admin/organizations", label: "Organizations", icon: NavOrgs },
          { href: "/admin/team", label: "Platform team", icon: NavTeam },
          { href: "/admin/audit", label: "Audit log", icon: NavAudit },
        ],
        [
          { href: "/admin/candidates", label: "Candidates", icon: NavCandidates },
          { href: "/ops/bench", label: "Bench tracker", icon: NavBench },
          { href: "/ops/compliance", label: "Compliance", icon: NavCompliance, badge: complianceFlags || undefined, badgeTone: "flag" },
          { href: "/ops/rates", label: "Rates and margin", icon: NavRates },
        ],
      ]
    : [
        [
          { href: "/dashboard", label: "Dashboard", icon: NavDashboard },
          { href: "/talent", label: "Talent inventory", icon: NavInventory },
          { href: "/shortlist", label: "Shortlist", icon: NavShortlist, badge: shortlist.length || undefined },
          { href: "/requests", label: "Requests and holds", icon: NavHolds, badge: activeHolds || undefined },
        ],
      ];
  const home = platform ? "/admin" : "/dashboard";

  const rail = (mini: boolean, mobile = false) => (
    <nav aria-label="Workspace" className="flex h-full flex-col border-r border-line bg-surface text-ink-2">
      <div className={cn("flex h-16 shrink-0 items-center", mini ? "justify-center" : "justify-between pr-3 pl-5")}>
        <Link href={home} className="flex items-center gap-2.5" aria-label={platform ? "Platform console home" : "TalentBridge workspace home"}>
          <span className="grid size-8 place-items-center rounded-[8px] bg-night text-brand-bright">
            <LogoMark size={20} />
          </span>
          {!mini && (
            <span className="leading-tight">
              <span className="block text-[15px] font-semibold tracking-[-0.01em] text-ink">TalentBridge</span>
              {platform && <span className="block text-[11.5px] font-medium text-brand">Platform console</span>}
            </span>
          )}
        </Link>
        {mobile ? (
          <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-[8px] text-subtle hover:bg-canvas hover:text-ink" aria-label="Close navigation">
            <IconX size={18} />
          </button>
        ) : (
          !mini && (
            <button
              onClick={toggle}
              className="grid size-9 place-items-center rounded-[8px] text-subtle transition-colors hover:bg-canvas hover:text-ink"
              aria-label="Collapse sidebar"
              aria-expanded
            >
              <NavCollapse collapsed={false} size={19} />
            </button>
          )
        )}
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto px-3 pt-2 pb-4">
        {groups.map((items, gi) => (
          <ul key={gi} className={cn("space-y-1", gi > 0 && "mt-3 border-t border-line pt-3")}>
            {items.map((item) => {
              const active = pathname === item.href || (item.href !== home && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <RailTip show={mini} label={item.badge ? `${item.label} (${item.badge})` : item.label}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-label={mini ? item.label : undefined}
                      className={cn(
                        "relative flex h-10 items-center rounded-[10px] text-[14px] transition-colors",
                        mini ? "justify-center" : "gap-3 px-3",
                        active ? "bg-brand-wash font-medium text-brand [--icon-bg:var(--color-brand-wash)]" : "[--icon-bg:var(--color-surface)] hover:bg-canvas hover:text-ink hover:[--icon-bg:var(--color-canvas)]",
                      )}
                    >
                      {active && <span className="absolute top-2.5 bottom-2.5 -left-3 w-[3px] rounded-r-full bg-brand" />}
                      <span className={active ? "text-brand" : "text-subtle"}>
                        <Icon size={20} />
                      </span>
                      {!mini && <span className="flex-1 truncate">{item.label}</span>}
                      {item.badge !== undefined &&
                        (mini ? (
                          <span className={cn("absolute top-1.5 right-2 size-2 rounded-full ring-2 ring-surface", item.badgeTone === "flag" ? "bg-flag" : "bg-brand")} />
                        ) : (
                          <span className={cn("tnum min-w-5 rounded-full px-1.5 text-center text-[11px] leading-5 font-semibold", item.badgeTone === "flag" ? "bg-flag-bg text-flag-ink" : "bg-canvas text-ink-2 ring-1 ring-line")}>
                            {item.badge}
                          </span>
                        ))}
                    </Link>
                  </RailTip>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </nav>
  );

  return (
    <div className={cn("min-h-screen bg-canvas transition-[padding] duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-[252px]")}>
      <aside className={cn("no-print fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-200 lg:block", collapsed ? "w-[76px]" : "w-[252px]")}>{rail(collapsed)}</aside>

      {/* Top bar */}
      <div className="no-print sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-surface/95 px-4 backdrop-blur sm:px-6">
        <div className="flex shrink-0 items-center gap-1 md:flex-1 md:basis-0">
          <button onClick={() => setOpen(true)} className="-ml-1.5 grid size-9 place-items-center rounded-[8px] text-ink hover:bg-canvas lg:hidden" aria-label="Open navigation">
            <IconMenu size={20} />
          </button>
          {collapsed && (
            <button
              onClick={toggle}
              className="-ml-1.5 hidden size-9 place-items-center rounded-[8px] text-subtle transition-colors hover:bg-canvas hover:text-ink lg:grid"
              aria-label="Expand sidebar"
              aria-expanded={false}
              title="Expand sidebar"
            >
              <NavCollapse collapsed size={19} />
            </button>
          )}
        </div>
        <form
          className="relative min-w-0 flex-1 md:max-w-[520px]"
          onSubmit={(e) => {
            e.preventDefault();
            const q = jump.trim();
            if (q) router.push(`${platform ? (onCandidates ? "/admin/candidates" : "/admin/organizations") : "/talent"}?q=${encodeURIComponent(q)}`);
          }}
        >
          <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-subtle" />
          <input
            value={jump}
            onChange={(e) => setJump(e.target.value)}
            placeholder={platform && !onCandidates ? "Search organizations by name or domain" : "Search candidates by ID, role or skill"}
            aria-label={platform && !onCandidates ? "Search organizations" : "Search candidates"}
            className="h-10 w-full rounded-[10px] bg-canvas pr-3 pl-10 text-[14px] ring-1 ring-inset ring-line placeholder:text-faint focus:bg-surface focus:ring-2 focus:ring-cobalt focus:outline-none"
          />
        </form>
        <div className="flex shrink-0 justify-end md:flex-1 md:basis-0">
          <UserMenu user={user} platform={platform} />
        </div>
      </div>

      {banner}

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="anim-fade absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="anim-sheet absolute inset-y-0 left-0 w-[272px]">{rail(false, true)}</aside>
        </div>
      )}

      <main className="min-w-0">{children}</main>
    </div>
  );
}

/** Workspace page header: title and actions only. */
export function PageHeader({ title, actions, children }: { title: string; description?: React.ReactNode; actions?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-6">
        <h1 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">{title}</h1>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  );
}
