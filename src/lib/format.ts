import type { Availability, Candidate, EngagementStatus, WorkAuth } from "./types";

/**
 * Demo clock. All seed timestamps are relative to this instant so the demo
 * never goes stale; live counters advance from it after page load.
 */
export const DEMO_NOW = new Date("2026-09-28T14:00:00Z").getTime();
export const FRESHNESS_WINDOW_DAYS = 7;
export const LOCK_HOURS = 48;

export const WORK_AUTH_LABEL: Record<WorkAuth, string> = {
  US_CITIZEN: "US Citizen",
  GREEN_CARD: "Green Card",
  H1B: "H-1B transfer ready",
  EAD_OPT: "EAD / OPT",
  TN: "TN visa",
};

export const WORK_AUTH_SHORT: Record<WorkAuth, string> = {
  US_CITIZEN: "USC",
  GREEN_CARD: "GC",
  H1B: "H-1B",
  EAD_OPT: "EAD",
  TN: "TN",
};

export const STATUS_LABEL: Record<EngagementStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  INTERVIEWING: "Interviewing",
  OFFERED: "Offered",
  ACTIVE: "Active",
  COMPLETED: "Completed",
};

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const dateTimeFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});
export const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const usd2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtDate = (iso: string) => dateFmt.format(new Date(iso));
export const fmtDateTime = (iso: string) => dateTimeFmt.format(new Date(iso)) + " ET";

export function daysBetween(fromMs: number, toIso: string) {
  return Math.round((new Date(toIso).getTime() - fromMs) / 86_400_000);
}

export function hoursSince(iso: string, now = DEMO_NOW) {
  return (now - new Date(iso).getTime()) / 3_600_000;
}

export function relativeAgo(iso: string, now = DEMO_NOW) {
  const h = hoursSince(iso, now);
  if (h < 1) return `${Math.max(1, Math.round(h * 60))}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export type AvailabilityTone = "avail" | "notice" | "placed";

export function availabilityOf(c: Pick<Candidate, "availability" | "availableFrom">): { label: string; tone: AvailabilityTone; sortKey: number } {
  switch (c.availability) {
    case "IMMEDIATE":
      return { label: "Immediate", tone: "avail", sortKey: 0 };
    case "TWO_WEEKS": {
      const d = c.availableFrom ? daysBetween(DEMO_NOW, c.availableFrom) : 14;
      return { label: `Within ${d} days`, tone: "notice", sortKey: d };
    }
    case "SPECIFIC_DATE":
      return { label: `From ${fmtDate(c.availableFrom!)}`, tone: "notice", sortKey: c.availableFrom ? daysBetween(DEMO_NOW, c.availableFrom) : 30 };
    case "PLACED":
      return { label: "Placed", tone: "placed", sortKey: 999 };
  }
}

export const AVAILABILITY_FILTERS: { value: Availability; label: string }[] = [
  { value: "IMMEDIATE", label: "Immediate" },
  { value: "TWO_WEEKS", label: "Within 2 weeks" },
  { value: "SPECIFIC_DATE", label: "Specific date" },
];

/** Whole days since the candidate last confirmed availability. */
export function freshnessDays(lastVerifiedAt: string, now = DEMO_NOW) {
  return Math.floor(hoursSince(lastVerifiedAt, now) / 24);
}

export function formatCountdown(ms: number) {
  if (ms <= 0) return "Expired";
  const totalMin = Math.floor(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function blindName(c: Pick<Candidate, "firstName" | "lastName">) {
  return `${c.firstName} ${c.lastName[0]}.`;
}
