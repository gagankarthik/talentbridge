import Link from "next/link";
import { cn } from "@/lib/cn";

/* Small data-display primitives, enterprise register: white cards with 1px
   borders and 8px radius, 16px card titles, calm status colour. Server-safe. */

/** Pill count next to a label (nav items, tab triggers, section titles). */
export function CountBadge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "flag" | "brand" | "dark"; className?: string }) {
  return (
    <span
      className={cn(
        "tnum inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[12px] leading-none font-semibold",
        tone === "neutral" && "bg-[#eceff3] text-muted",
        tone === "flag" && "bg-flag-bg text-flag-ink",
        tone === "brand" && "bg-cobalt text-white",
        tone === "dark" && "bg-navy text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Keyboard key chip. */
export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded bg-well px-1.5 font-brand text-[12px] leading-none text-muted ring-1 ring-hair ring-inset", className)}>
      {children}
    </kbd>
  );
}

type SegTone = "auto" | "success" | "warning" | "danger" | "brand";
const SEG: Record<Exclude<SegTone, "auto">, string> = { success: "bg-avail", warning: "bg-notice", danger: "bg-flag", brand: "bg-cobalt" };

/**
 * Progress meter (readiness, hold time left, funnel stages): a 6px rounded track
 * with one fill. `auto` colours by value: 70%+ success, 40%+ warning, below danger.
 * `segments` is accepted for compatibility and ignored. Resize with className="h-2".
 */
export function SegmentBar({ percent, tone = "auto", label, className }: { percent: number; segments?: number; tone?: SegTone; label?: string; className?: string }) {
  const p = Math.max(0, Math.min(100, percent));
  const fill = tone === "auto" ? (p >= 70 ? SEG.success : p >= 40 ? SEG.warning : SEG.danger) : SEG[tone];
  return (
    <span
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p)}
      aria-label={label}
      className={cn("block h-1.5 w-full min-w-12 overflow-hidden rounded-full bg-[#e4e8ee]", className)}
    >
      <span className={cn("block h-full rounded-full transition-[width] duration-300 ease-power3-out", fill)} style={{ width: `${p}%` }} />
    </span>
  );
}

/** Tiny bar sparkline (values scaled to the max). The last `emphasis` bars are full cobalt. */
export function Sparkline({ values, emphasis = 1, className, label }: { values: number[]; emphasis?: number; className?: string; label?: string }) {
  const max = Math.max(1, ...values);
  return (
    <span role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={cn("flex h-[18px] items-end gap-px", className)}>
      {values.map((v, i) => (
        <span
          key={i}
          className={cn("w-1 shrink-0 rounded-[1px]", i >= values.length - emphasis ? "bg-cobalt" : "bg-[#b4c8f6]")}
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
        />
      ))}
    </span>
  );
}

/**
 * KPI tile: caption label (with optional icon), a 24–28px figure, and an optional
 * delta, hint line or sparkline. Lay out as grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.
 * With `href` the whole tile is a link.
 */
export function KpiTile({
  label,
  value,
  icon,
  delta,
  hint,
  spark,
  href,
  tone,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  delta?: { value: string; direction: "up" | "down" | "flat"; good?: boolean };
  hint?: React.ReactNode;
  spark?: number[];
  href?: string;
  /** Flag the tile (e.g. compliance flags > 0) */
  tone?: "default" | "flag";
  className?: string;
}) {
  const good = delta?.good ?? delta?.direction === "up";
  const body = (
    <>
      <span className="flex items-center gap-2 text-[13px] font-medium text-muted">
        {icon && <span className="text-subtle">{icon}</span>}
        {label}
      </span>
      <span className="mt-3 flex items-end justify-between gap-3">
        <span className={cn("tnum font-brand text-[28px] leading-none font-semibold tracking-[-0.02em]", tone === "flag" ? "text-flag-ink" : "text-ink")}>{value}</span>
        {spark && <Sparkline values={spark} className="mb-0.5" />}
      </span>
      {(delta || hint) && (
        <span className="mt-3 flex items-center gap-1.5 text-[13px] text-muted">
          {delta && (
            <span className={cn("tnum inline-flex items-center gap-1 font-semibold", delta.direction === "flat" ? "text-muted" : good ? "text-avail-ink" : "text-flag-ink")}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {delta.direction === "flat" ? <path d="M2 6h8M7 3l3 3-3 3" /> : <path d={delta.direction === "up" ? "M6 10V2M2.5 5.5 6 2l3.5 3.5" : "M6 2v8M2.5 6.5 6 10l3.5-3.5"} />}
              </svg>
              {delta.value}
            </span>
          )}
          {hint && <span className="truncate">{hint}</span>}
        </span>
      )}
    </>
  );
  const cls = cn(
    "flex min-w-0 flex-col rounded-lg border border-hair bg-surface p-5 transition-colors duration-150 ease-power3-out",
    href && "outline-none hover:border-line-strong focus-visible:ring-2 focus-visible:ring-cobalt",
    className,
  );
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/**
 * Titled block. With `card`: the standard white card (1px border, 8px radius,
 * 52px header with a 16px/600 title and a divider, 20px body). Without: a
 * section inside a card, sheet or settings page, divided from its siblings by a
 * 1px rule. Optional right-side action (link, button, FilterMenu).
 */
export function DetailSection({
  title,
  action,
  description,
  children,
  card,
  className,
  bodyClassName,
  id,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  card?: boolean;
  className?: string;
  bodyClassName?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        card ? "flex min-w-0 flex-col rounded-lg border border-hair bg-surface" : "border-b border-hair last:border-b-0",
        className,
      )}
    >
      <div className={cn("flex items-center justify-between gap-3", card ? "min-h-[52px] border-b border-hair px-5 py-3" : "px-5 pt-5")}>
        <div className="min-w-0">
          <h2 className="font-brand text-[16px] leading-snug font-semibold tracking-[-0.01em] text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] text-muted">{description}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>
      <div className={cn(card ? "min-w-0 flex-1 p-5" : "px-5 pt-4 pb-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Empty or cleared state: 40px icon well, title, one caption line, optional action. */
export function EmptyState({ icon, title, description, action, className }: { icon?: React.ReactNode; title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-14 text-center", className)}>
      {icon && <span className="grid size-10 place-items-center rounded-lg bg-well text-muted">{icon}</span>}
      <p className="mt-4 font-brand text-[16px] font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-[46ch] text-[14px] leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
