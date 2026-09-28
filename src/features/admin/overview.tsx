"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { relativeAgo } from "@/lib/format";
import { useDemoNow } from "@/lib/clock";
import { BarList, StatTile } from "@/features/dashboard/charts";
import { CandidateCode, Pill } from "@/components/ui/status";
import { useAdmin } from "./admin-store";

export interface OpsData {
  stages: { label: string; value: number }[];
  attention: { code: string; name: string; label: string; severity: "flag" | "notice"; due?: number }[];
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[12px] bg-surface ring-1 ring-line">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="text-[14.5px] font-semibold text-ink">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function AdminOverview({ ops }: { ops: OpsData }) {
  const { orgs, audit } = useAdmin();
  const now = useDemoNow(60_000);
  const active = orgs.filter((o) => o.status === "active");
  const seatsUsed = orgs.reduce((n, o) => n + (o.status === "suspended" ? 0 : o.members), 0);
  const seatsTotal = orgs.reduce((n, o) => n + (o.status === "suspended" ? 0 : o.seats), 0);

  const needs = [
    ...orgs.filter((o) => o.status === "onboarding").map((o) => ({ o, why: o.owner.invitePending ? "Owner hasn't accepted the invite" : "Onboarding in progress", tone: "notice" as const })),
    ...orgs.filter((o) => o.status === "active" && o.members / o.seats >= 0.9).map((o) => ({ o, why: `${o.members} of ${o.seats} seats used`, tone: "notice" as const })),
    ...orgs.filter((o) => o.status === "active" && o.plan === "Enterprise" && !o.sso).map((o) => ({ o, why: "Enterprise plan without SSO", tone: "notice" as const })),
    ...orgs.filter((o) => o.status === "suspended").map((o) => ({ o, why: "Suspended", tone: "flag" as const })),
  ];

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile label="Active organizations" value={active.length} note={`${orgs.length} in total`} />
        <StatTile label="In onboarding" value={orgs.filter((o) => o.status === "onboarding").length} />
        <StatTile label="Seats in use" value={`${seatsUsed} / ${seatsTotal}`} />
        <StatTile label="Active holds" value={orgs.reduce((n, o) => n + o.activeHolds, 0)} note="Across all organizations" />
        <StatTile label="Compliance flags" value={ops.attention.filter((a) => a.severity === "flag").length} tone="warn" note="Blocking presentation" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Panel
          title="Organizations needing attention"
          action={
            <Link href="/admin/organizations" className="text-[13px] font-medium text-cobalt hover:underline">
              All organizations
            </Link>
          }
        >
          {needs.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-subtle">Nothing needs attention.</p>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {needs.map(({ o, why, tone }) => (
                <li key={o.id + why}>
                  <Link href={`/admin/organizations/${o.id}`} className="flex items-center justify-between gap-4 py-3 hover:bg-canvas">
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium text-ink">{o.name}</span>
                      <span className="block text-xs text-subtle">
                        {o.plan}, client partner {o.clientPartner}
                      </span>
                    </span>
                    <Pill tone={tone}>{why}</Pill>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Recent platform activity"
          action={
            <Link href="/admin/audit" className="text-[13px] font-medium text-cobalt hover:underline">
              Audit log
            </Link>
          }
        >
          <ol className="-my-2 divide-y divide-line">
            {audit.slice(0, 6).map((e) => (
              <li key={e.id} className="flex gap-3 py-2.5 text-[13px]">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", e.actorType === "platform" ? "bg-cobalt" : e.actorType === "customer" ? "bg-line-strong" : "bg-faint")} />
                <span className="min-w-0 flex-1">
                  <span className="font-medium text-ink">{e.action}</span>
                  <span className="block truncate text-subtle">
                    {e.actor}
                    {e.orgId ? `, ${orgs.find((o) => o.id === e.orgId)?.name ?? e.orgId}` : ""}
                  </span>
                </span>
                <span className="tnum shrink-0 text-xs text-subtle">{relativeAgo(e.at, now)}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Bench pipeline"
          action={
            <Link href="/ops/bench" className="text-[13px] font-medium text-cobalt hover:underline">
              Bench tracker
            </Link>
          }
        >
          <BarList data={ops.stages} unit="consultants" color="var(--color-ink-2)" />
        </Panel>
        <Panel
          title="Compliance needing attention"
          action={
            <Link href="/ops/compliance" className="text-[13px] font-medium text-cobalt hover:underline">
              Compliance
            </Link>
          }
        >
          <ul className="-my-2 divide-y divide-line">
            {ops.attention.slice(0, 6).map((a) => (
              <li key={a.code + a.label} className="flex items-center gap-3 py-2.5">
                <CandidateCode code={a.code} />
                <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink">{a.name}</span>
                <Pill tone={a.severity === "flag" ? "flag" : "notice"}>
                  {a.label}
                  {a.due !== undefined ? `, ${a.due}d` : ""}
                </Pill>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
