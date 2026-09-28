"use client";

import Link from "next/link";
import { useDemoNow } from "@/lib/clock";
import { cn } from "@/lib/cn";
import { formatCountdown, LOCK_HOURS } from "@/lib/format";
import { useWorkspace } from "@/lib/workspace-store";
import { CandidateCode } from "@/components/ui/status";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { BarList, StackedBars, StatTile, type StackRow } from "./charts";

export interface HoldRow {
  id: string;
  code: string;
  title: string;
  name: string;
  client: string;
  expiresAt: string;
}

export interface DashboardData {
  availableNow: number;
  onBench: number;
  submitted30: number;
  interviewRate: number;
  availability: StackRow[];
  recent: { code: string; title: string; available: string; lastVerifiedAt: string }[];
  funnel: { label: string; value: number }[];
  holds: HoldRow[];
}

const RAMP = ["#00664f", "#2b9c7c", "#86ccb3"];

function Panel({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[12px] bg-surface ring-1 ring-line", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="text-[14.5px] font-semibold text-ink">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function DashboardView({ data }: { data: DashboardData }) {
  const { myRequests, shortlist } = useWorkspace();
  const now = useDemoNow(30_000);

  const holds = [
    ...myRequests.filter((r) => r.lockExpiresAt).map((r) => ({ id: r.id, code: r.code, title: r.title, name: r.revealedName, client: r.clientName, expiresAt: r.lockExpiresAt! })),
    ...data.holds,
  ]
    .filter((h) => new Date(h.expiresAt).getTime() > now)
    .sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile label="Available now" value={data.availableNow} note={`of ${data.onBench} on the bench`} />
        <StatTile label="Active holds" value={holds.length} note={holds.some((h) => new Date(h.expiresAt).getTime() - now < 6 * 3_600_000) ? "Some expire within 6 hours" : "None expiring soon"} tone={holds.some((h) => new Date(h.expiresAt).getTime() - now < 6 * 3_600_000) ? "warn" : undefined} />
        <StatTile label="Submissions, last 30 days" value={data.submitted30} />
        <StatTile label="Submission to interview" value={`${data.interviewRate}%`} note={data.interviewRate >= 35 ? "Above the 35% target" : "Below the 35% target"} tone={data.interviewRate >= 35 ? "good" : "warn"} />
        <StatTile label="Shortlisted" value={shortlist.length} note={shortlist.length ? "Ready to compare" : "Nothing saved yet"} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Availability by practice"
          action={
            <Link href="/talent" className="text-[13px] font-medium text-cobalt hover:underline">
              Open inventory
            </Link>
          }
        >
          <StackedBars rows={data.availability} series={["Immediate", "Within 2 weeks", "Specific date"]} colors={RAMP} />
        </Panel>

        <Panel
          title="Recently confirmed available"
          action={
            <Link href="/talent?fresh=1&sort=fresh" className="text-[13px] font-medium text-cobalt hover:underline">
              View all
            </Link>
          }
        >
          <ul className="-my-2 divide-y divide-line">
            {data.recent.map((r) => (
              <li key={r.code}>
                <Link href={`/talent?q=${r.code}`} className="grid grid-cols-[1fr_auto] items-center gap-4 py-2.5 hover:bg-canvas">
                  <span className="min-w-0">
                    <CandidateCode code={r.code} />
                    <span className="block truncate text-[13.5px] font-medium text-ink">{r.title}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <span className="text-xs text-avail-ink">{r.available}</span>
                    <FreshnessMeter lastVerifiedAt={r.lastVerifiedAt} compact />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Panel
          title="Holds expiring soonest"
          action={
            <Link href="/requests" className="text-[13px] font-medium text-cobalt hover:underline">
              All requests
            </Link>
          }
        >
          {holds.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-subtle">No active holds. Place one from a candidate profile.</p>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {holds.slice(0, 6).map((h) => {
                const left = new Date(h.expiresAt).getTime() - now;
                const pct = Math.max(0, Math.min(1, left / (LOCK_HOURS * 3_600_000)));
                return (
                  <li key={h.id} className="grid grid-cols-[1fr_auto] items-center gap-4 py-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-[13.5px]">
                        <CandidateCode code={h.code} />
                        <span className="truncate font-medium text-ink">{h.name}</span>
                      </p>
                      <p className="truncate text-xs text-subtle">
                        {h.title}, for {h.client}
                      </p>
                    </div>
                    <div className="w-32 text-right">
                      <p className={cn("tnum text-[13px] font-semibold", pct < 0.15 ? "text-notice-ink" : "text-ink")}>{formatCountdown(left)}</p>
                      <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-line">
                        <span className={cn("block h-full rounded-r-full", pct < 0.15 ? "bg-notice" : "bg-cobalt")} style={{ width: `${pct * 100}%` }} />
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Submission funnel">
          <BarList data={data.funnel} unit="requests" />
        </Panel>
      </div>

    </div>
  );
}
