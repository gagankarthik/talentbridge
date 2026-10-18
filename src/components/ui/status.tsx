import { cn } from "@/lib/cn";
import { availabilityOf, STATUS_LABEL, WORK_AUTH_LABEL, WORK_AUTH_SHORT } from "@/lib/format";
import type { Candidate, EngagementStatus, WorkAuth } from "@/lib/types";

/* ─────────────── Tag: the one status/label chip ───────────────
   22px tall (sm 20px), 6px radius, 1px border, a light bg/border/text triple per
   tone. Four semantic tones carry meaning, never decoration:
     green = available / active / verified     amber = notice / pending / interviewing
     red   = flag / blocked / overdue          blue  = submitted / in progress (info)
     slate = neutral / placed / draft
   `teal` is a legacy alias of blue; `navy` is reserved for rare emphasis. */
export type TagTone = "blue" | "green" | "amber" | "red" | "teal" | "slate" | "navy";

const tagTone: Record<TagTone, { tag: string; dot: string }> = {
  blue: { tag: "border-tag-blue-border bg-tag-blue-bg text-tag-blue-text", dot: "bg-cobalt" },
  green: { tag: "border-tag-green-border bg-tag-green-bg text-tag-green-text", dot: "bg-avail" },
  amber: { tag: "border-tag-amber-border bg-tag-amber-bg text-tag-amber-text", dot: "bg-notice" },
  red: { tag: "border-tag-red-border bg-tag-red-bg text-tag-red-text", dot: "bg-flag" },
  teal: { tag: "border-tag-teal-border bg-tag-teal-bg text-tag-teal-text", dot: "bg-cobalt" },
  slate: { tag: "border-tag-slate-border bg-tag-slate-bg text-tag-slate-text", dot: "bg-placed" },
  navy: { tag: "border-tag-navy-border bg-tag-navy-bg text-tag-navy-text", dot: "bg-white" },
};

export function Tag({
  tone = "slate",
  size = "md",
  dot,
  className,
  children,
  title,
}: {
  tone?: TagTone;
  size?: "sm" | "md";
  /** Leading 6px status dot */
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border leading-none font-medium whitespace-nowrap",
        size === "md" ? "h-6 px-2 text-[13px]" : "h-[22px] px-1.5 text-[12px]",
        tagTone[tone].tag,
        className,
      )}
    >
      {dot && <span className={cn("size-1.5 shrink-0 rounded-full", tagTone[tone].dot)} />}
      {children}
    </span>
  );
}

/* Legacy tone names used across the app, mapped onto Tag tones. */
export type Tone = "avail" | "notice" | "placed" | "flag" | "cobalt" | "ink";
const toneMap: Record<Tone, TagTone> = { avail: "green", notice: "amber", placed: "slate", flag: "red", cobalt: "blue", ink: "navy" };

/** Status pill with a dot. Prefer `Tag` in new code; this keeps the old API. */
export function Pill({ tone, children, dot = true, className }: { tone: Tone; children: React.ReactNode; dot?: boolean; className?: string }) {
  return (
    <Tag tone={toneMap[tone]} dot={dot} className={className}>
      {children}
    </Tag>
  );
}

export function AvailabilityPill({ c }: { c: Pick<Candidate, "availability" | "availableFrom"> }) {
  const a = availabilityOf(c);
  return <Pill tone={a.tone}>{a.label}</Pill>;
}

/** Work authorization is always verified before presentation, so this carries a check. */
export function WorkAuthTag({ auth, short, visaExpiry }: { auth: WorkAuth; short?: boolean; visaExpiry?: string | null }) {
  return (
    <Tag tone="slate" title={`${WORK_AUTH_LABEL[auth]} — verified${visaExpiry ? `, expires ${visaExpiry}` : ""}`} className="gap-1">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-avail-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5.5 12.5 4 4 9-9.5" />
      </svg>
      {short ? WORK_AUTH_SHORT[auth] : WORK_AUTH_LABEL[auth]}
    </Tag>
  );
}

export const ENGAGEMENT_TONE: Record<EngagementStatus, TagTone> = {
  DRAFT: "slate",
  SUBMITTED: "blue",
  INTERVIEWING: "amber",
  OFFERED: "teal",
  ACTIVE: "green",
  COMPLETED: "slate",
};

export function EngagementPill({ status }: { status: EngagementStatus }) {
  return (
    <Tag tone={ENGAGEMENT_TONE[status]} dot>
      {STATUS_LABEL[status]}
    </Tag>
  );
}

/** Blind profile code (TC-1141): tabular brand face, not monospace. */
export function CandidateCode({ code, className }: { code: string; className?: string }) {
  return <span className={cn("tnum text-[13px] font-semibold tracking-[0.01em] text-ink", className)}>{code}</span>;
}

/** Skill with years. `strong` marks a primary skill (semibold ink, same neutral chip). */
export function SkillChip({ skill, years, strong }: { skill: string; years?: number; strong?: boolean }) {
  return (
    <Tag tone="slate" className={strong ? "font-semibold text-ink" : "font-normal"}>
      {skill}
      {years !== undefined && <span className="tnum font-normal text-subtle">{years}y</span>}
    </Tag>
  );
}
