"use client";

import { PageBody } from "@/components/layout/app-shell";
import Link from "next/link";
import { useDemoNow } from "@/lib/clock";
import { relativeAgo } from "@/lib/format";
import { useWorkspace } from "@/lib/workspace-store";
import { CandidateCode } from "@/components/ui/status";
import { DetailSection, EmptyState, KpiTile } from "@/components/ui/data-display";
import { StatusText } from "@/components/ui/status-text";
import { IconLock } from "@/components/icons";
import { BarList, StackedBars, type StackRow } from "./charts";
import { HoldMeter, URGENT_MS } from "./hold-meter";
import { kpiCompact, kpiGrid, plural } from "./kpi";

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
  weekly: number[];
  interviewRate: number;
  availability: StackRow[];
  recent: { code: string; title: string; available: string; lastVerifiedAt: string }[];
  funnel: { label: string; value: number }[];
  holds: HoldRow[];
}

const pctOf = (n = 0, d = 0) => (d ? `${Math.round((n / d) * 100)}%` : "–");

/** Card header action: a plain blue text link. */
const action = "text-[13px] font-medium text-cobalt hover:text-cobalt-strong hover:underline";

/**
 * Customer dashboard, enterprise density: four KPIs, then four modules in two
 * columns. Everything else lives behind its "View all" link.
 */
export function DashboardView({ data }: { data: DashboardData }) {
  const { myRequests } = useWorkspace();
  const now = useDemoNow(30_000);

  const holds = [
    ...myRequests.filter((r) => r.lockExpiresAt).map((r) => ({ id: r.id, code: r.code, title: r.title, name: r.revealedName, client: r.clientName, expiresAt: r.lockExpiresAt! })),
    ...data.holds,
  ]
    .filter((h) => new Date(h.expiresAt).getTime() > now)
    .sort((a, b) => a.expiresAt.localeCompare(b.expiresAt));
  const urgent = holds.filter((h) => new Date(h.expiresAt).getTime() - now < URGENT_MS).length;
  const prevWeek = data.weekly.at(-2) ?? 0;
  const thisWeek = data.weekly.at(-1) ?? 0;

  return (
    <PageBody className="space-y-8">
      <section aria-label="Key figures" className={kpiGrid}>
        <KpiTile className={kpiCompact} href="/talent?availability=IMMEDIATE" label="Available to start now" value={data.availableNow} hint={`Of ${plural(data.onBench, "engineer")} on the bench`} />
        <KpiTile
          className={kpiCompact}
          href="/requests"
          label="Active holds"
          value={holds.length}
          hint={urgent ? <span className="text-[#9a5b00]">{urgent} {urgent === 1 ? "expires" : "expire"} within 6 hours</span> : "None expire within 6 hours"}
        />
        <KpiTile
          className={kpiCompact}
          label="Submissions, last 30 days"
          value={data.submitted30}
          delta={{ value: `${thisWeek} this week, ${prevWeek} last week`, direction: thisWeek > prevWeek ? "up" : thisWeek < prevWeek ? "down" : "flat" }}
        />
        <KpiTile className={kpiCompact} label="Submission to interview" value={`${data.interviewRate}%`} delta={{ value: "Target 35%", direction: data.interviewRate >= 35 ? "up" : "down" }} />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <DetailSection
          card
          title="Holds expiring soonest"
          action={
            <Link href="/requests" className={action}>
              View all
            </Link>
          }
          bodyClassName="p-0"
        >
          {holds.length === 0 ? (
            <EmptyState icon={<IconLock size={18} />} title="No active holds" description="Place a 48-hour hold from any candidate profile to see its countdown here." />
          ) : (
            <ul>
              {holds.slice(0, 5).map((h) => {
                const left = new Date(h.expiresAt).getTime() - now;
                return (
                  <li key={h.id} className="grid min-h-[60px] grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-b border-hair px-5 py-2.5 last:border-0">
                    <div className="min-w-0">
                      <p className="flex items-baseline gap-2 text-[14px]">
                        <CandidateCode code={h.code} />
                        <span className="truncate font-medium text-ink">{h.name}</span>
                      </p>
                      <p className="truncate text-[13px] text-ink-2">
                        {h.title}, for {h.client}
                      </p>
                    </div>
                    <HoldMeter left={left} className="w-[124px] sm:w-[148px]" />
                  </li>
                );
              })}
            </ul>
          )}
        </DetailSection>

        <DetailSection
          card
          title="Recently confirmed available"
          action={
            <Link href="/talent?fresh=1&sort=fresh" className={action}>
              View all
            </Link>
          }
          bodyClassName="p-0"
        >
          <ul>
            {data.recent.slice(0, 5).map((r) => (
              <li key={r.code}>
                <Link
                  href={`/talent?q=${r.code}`}
                  className="grid min-h-[52px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-hair px-5 transition-colors duration-150 last:border-0 hover:bg-canvas"
                >
                  <span className="flex min-w-0 items-baseline gap-3">
                    <CandidateCode code={r.code} className="w-[60px] shrink-0" />
                    <span className="truncate text-[14px] text-ink">{r.title}</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <StatusText tone={r.available === "Immediate" ? "success" : "neutral"}>{r.available}</StatusText>
                    <span className="text-[12px] text-subtle">Confirmed {relativeAgo(r.lastVerifiedAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </DetailSection>


        <DetailSection card title="Submission funnel" description="Your requests in the last 30 days" bodyClassName="flex flex-col justify-between gap-5">
          <BarList data={data.funnel} unit="requests" conversion />
          <p className="tnum border-t border-hair pt-4 text-[13px] text-ink-2">
            <span className="font-semibold text-ink">{pctOf(data.funnel[3]?.value, data.funnel[0]?.value)}</span> of submissions became placements.
            Percentages beside each bar are the rate from the stage above.
          </p>
        </DetailSection>

        <DetailSection
          card
          title="Bench availability by practice"
          action={
            <Link href="/talent" className={action}>
              Open inventory
            </Link>
          }
        >
          <StackedBars rows={data.availability} series={["Immediate", "Within 2 weeks", "Specific date"]} />
        </DetailSection>

      </div>
    </PageBody>
  );
}
