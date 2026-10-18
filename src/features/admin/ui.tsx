import { cn } from "@/lib/cn";
import type { OrgStatus } from "@/lib/platform";
import type { StatusTone } from "@/components/ui/status-dot";

/* Shared pieces for the platform console (enterprise spec): neutral record marks,
   bordered cards on the canvas, rectangular controls. Blue is reserved for action. */

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Organization record mark: neutral 6px tile with initials, like a CRM account icon. */
export function OrgMark({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 place-items-center rounded-[6px] border border-line bg-canvas font-semibold text-muted", className)}
      style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.36)) }}
    >
      {initials(name)}
    </span>
  );
}

/** Person avatar: neutral round initials. */
export function Avatar({ name, size = 24, className }: { name: string; size?: number; tone?: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 place-items-center rounded-full bg-[#e6eaf0] font-semibold text-muted", className)}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.4)) }}
    >
      {initials(name)}
    </span>
  );
}

/** Dot-separated meta line on one row: "Partner · 25 seats · acme.com" */
export function Meta({ items, className }: { items: React.ReactNode[]; className?: string }) {
  const shown = items.filter((x) => x !== null && x !== undefined && x !== false && x !== "");
  return (
    <span className={cn("flex min-w-0 items-center gap-x-1.5 overflow-hidden text-[13px] whitespace-nowrap text-subtle", className)}>
      {shown.map((x, i) => (
        <span key={i} className={cn("flex items-center gap-1.5", i === shown.length - 1 ? "min-w-0" : "shrink-0")}>
          {i > 0 && <span aria-hidden="true">·</span>}
          <span className="truncate">{x}</span>
        </span>
      ))}
    </span>
  );
}

export const ORG_STATUS: Record<OrgStatus, { tone: StatusTone; label: string }> = {
  active: { tone: "success", label: "Active" },
  onboarding: { tone: "warning", label: "Onboarding" },
  suspended: { tone: "neutral", label: "Suspended" },
};

/** Page body on the canvas: the shell's shared padding and 1440px measure. */
export { PageBody } from "@/components/layout/app-shell";

/** Bordered white card (8px radius, no shadow). Tables, toolbars and pagers live inside. */
export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("min-w-0 overflow-hidden rounded-[8px] border border-hair bg-surface", className)}>{children}</section>;
}

/** Card header: 16px/600 title, optional subtitle and a right-hand action, divider beneath. */
export function PanelHeader({ title, subtitle, action, id }: { title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; id?: string }) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-6">
      <div className="min-w-0">
        <h2 id={id} className="text-[16px] leading-snug font-semibold text-ink">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-[13px] text-subtle">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

/** Text action in a card header or footer: blue, the one accent. */
export const textAction = "text-[14px] font-medium text-cobalt underline-offset-4 transition-colors hover:text-cobalt-strong hover:underline";
