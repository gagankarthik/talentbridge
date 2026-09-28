import { cn } from "@/lib/cn";
import { availabilityOf, STATUS_LABEL, WORK_AUTH_LABEL, WORK_AUTH_SHORT } from "@/lib/format";
import type { Candidate, EngagementStatus, WorkAuth } from "@/lib/types";

export type Tone = "avail" | "notice" | "placed" | "flag" | "cobalt" | "ink";

const tones: Record<Tone, { pill: string; dot: string }> = {
  avail: { pill: "bg-avail-bg text-avail-ink", dot: "bg-avail" },
  notice: { pill: "bg-notice-bg text-notice-ink", dot: "bg-notice" },
  placed: { pill: "bg-placed-bg text-placed-ink", dot: "bg-placed" },
  flag: { pill: "bg-flag-bg text-flag-ink", dot: "bg-flag" },
  cobalt: { pill: "bg-cobalt-wash text-cobalt-strong", dot: "bg-cobalt" },
  ink: { pill: "bg-ink text-white", dot: "bg-white" },
};

export function Pill({ tone, children, dot = true, className }: { tone: Tone; children: React.ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex h-[22px] items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap", tones[tone].pill, className)}>
      {dot && <span className={cn("size-1.5 rounded-full", tones[tone].dot)} />}
      {children}
    </span>
  );
}

export function AvailabilityPill({ c }: { c: Pick<Candidate, "availability" | "availableFrom"> }) {
  const a = availabilityOf(c);
  return <Pill tone={a.tone}>{a.label}</Pill>;
}

/** Work authorization is always verified before presentation, so this carries a check. */
export function WorkAuthTag({ auth, short, visaExpiry }: { auth: WorkAuth; short?: boolean; visaExpiry?: string | null }) {
  return (
    <span
      className="inline-flex h-[22px] items-center gap-1 rounded-[5px] px-1.5 text-xs font-medium text-ink-2 ring-1 ring-inset ring-line-strong"
      title={`${WORK_AUTH_LABEL[auth]} — verified${visaExpiry ? `, expires ${visaExpiry}` : ""}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-avail)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5.5 12.5 4 4 9-9.5" />
      </svg>
      {short ? WORK_AUTH_SHORT[auth] : WORK_AUTH_LABEL[auth]}
    </span>
  );
}

const engagementTone: Record<EngagementStatus, Tone> = {
  DRAFT: "placed",
  SUBMITTED: "cobalt",
  INTERVIEWING: "notice",
  OFFERED: "notice",
  ACTIVE: "avail",
  COMPLETED: "placed",
};

export function EngagementPill({ status }: { status: EngagementStatus }) {
  return <Pill tone={engagementTone[status]}>{STATUS_LABEL[status]}</Pill>;
}

export function CandidateCode({ code, className }: { code: string; className?: string }) {
  return <span className={cn("font-mono text-[12.5px] font-medium tracking-tight text-ink", className)}>{code}</span>;
}

export function SkillChip({ skill, years, strong }: { skill: string; years?: number; strong?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-[5px] px-2 text-xs whitespace-nowrap",
        strong ? "bg-ink-2 text-white" : "bg-placed-bg text-ink-2",
      )}
    >
      {skill}
      {years !== undefined && <span className={cn("tnum", strong ? "text-slate-300" : "text-subtle")}>{years}y</span>}
    </span>
  );
}
