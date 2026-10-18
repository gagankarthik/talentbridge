"use client";

import Link from "next/link";
import { fmtDateTime, relativeAgo } from "@/lib/format";
import { useDemoNow } from "@/lib/clock";
import { PageHeader } from "@/components/layout/app-shell";
import { buttonClass } from "@/components/ui/button";
import { CandidateCode } from "@/components/ui/status";
import { StatusDot } from "@/components/ui/status-dot";
import { DetailSection, EmptyState, KpiTile } from "@/components/ui/data-display";
import { IconCheck } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { Avatar, Meta, OrgMark, PageBody, textAction } from "./ui";

export interface OpsData {
  stages: { label: string; value: number }[];
  attention: { code: string; name: string; label: string; severity: "flag" | "notice"; due?: number }[];
}

export function AdminOverview({ ops }: { ops: OpsData }) {
  const { orgs, audit } = useAdmin();
  const now = useDemoNow(60_000);
  const live = orgs.filter((o) => o.status !== "suspended");
  const active = orgs.filter((o) => o.status === "active");
  const onboarding = orgs.filter((o) => o.status === "onboarding").length;
  const seatsUsed = live.reduce((n, o) => n + o.members, 0);
  const seatsTotal = live.reduce((n, o) => n + o.seats, 0);
  const flags = ops.attention.filter((a) => a.severity === "flag").length;
  const benchTotal = ops.stages.reduce((n, s) => n + s.value, 0);
  const benchMax = Math.max(1, ...ops.stages.map((s) => s.value));

  const needs = [
    ...orgs
      .filter((o) => o.status === "onboarding")
      .map((o) => ({ o, why: o.owner.invitePending ? "Owner invite not accepted" : "Onboarding in progress", tone: "warning" as const })),
    ...orgs
      .filter((o) => o.status === "active" && o.members / o.seats >= 0.9)
      .map((o) => ({ o, why: `${o.members} of ${o.seats} seats used`, tone: "warning" as const })),
    ...orgs
      .filter((o) => o.status === "active" && o.plan === "Enterprise" && !o.sso)
      .map((o) => ({ o, why: "Enterprise plan without SSO", tone: "warning" as const })),
    ...orgs.filter((o) => o.status === "suspended").map((o) => ({ o, why: "Suspended", tone: "danger" as const })),
  ];

  return (
    <>
      <PageHeader
        title="Platform overview"
        description={`Customers, the bench and compliance. Updated ${fmtDateTime(new Date(now).toISOString())}.`}
        actions={
          <Link href="/admin/organizations" className={buttonClass("secondary", "md")}>
            View organizations
          </Link>
        }
      />

      <PageBody className="space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:gap-6">
          <KpiTile
            label="Active organizations"
            value={active.length}
            hint={onboarding ? `${onboarding} more in onboarding` : `${orgs.length} in total`}
            href="/admin/organizations"
          />
          <KpiTile label="Seats in use" value={`${seatsUsed} of ${seatsTotal}`} hint={`${Math.round((seatsUsed / seatsTotal) * 100)}% of licensed seats`} />
          <KpiTile label="Active holds" value={orgs.reduce((n, o) => n + o.activeHolds, 0)} hint="Across all customers" />
          <KpiTile
            label="Compliance flags"
            value={flags}
            hint={<span className={flags ? "font-medium text-[#b42318]" : undefined}>{flags ? "Blocking presentation" : "Nothing blocking"}</span>}
            href="/ops/compliance"
          />
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-2">
          <DetailSection
            card
            title="Needs attention"
            description={`${needs.length} ${needs.length === 1 ? "organization" : "organizations"}`}
            action={
              <Link href="/admin/organizations" className={textAction}>
                View all
              </Link>
            }
            bodyClassName="p-0"
          >
            {needs.length === 0 ? (
              <EmptyState
                icon={<IconCheck size={18} />}
                title="Nothing needs attention"
                description="Every customer is active, within seats and set up securely."
              />
            ) : (
              <ul className="divide-y divide-line">
                {needs.slice(0, 5).map(({ o, why, tone }) => (
                  <li key={o.id + why}>
                    <Link
                      href={`/admin/organizations/${o.id}`}
                      className="flex min-h-[60px] items-center gap-3 px-5 py-3 transition-colors duration-150 hover:bg-canvas sm:px-6"
                    >
                      <OrgMark name={o.name} size={32} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-ink">{o.name}</span>
                        <Meta items={[`${o.plan} plan`, o.clientPartner]} />
                      </span>
                      <StatusDot tone={tone} className="hidden sm:inline-flex">
                        {why}
                      </StatusDot>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </DetailSection>

          <DetailSection
            card
            title="Recent activity"
            description="From the audit log"
            action={
              <Link href="/admin/audit" className={textAction}>
                View all
              </Link>
            }
            bodyClassName="p-0"
          >
            <ol className="divide-y divide-line">
              {audit.slice(0, 5).map((e) => (
                <li key={e.id} className="flex min-h-[60px] items-center gap-3 px-5 py-3 sm:px-6">
                  <Avatar name={e.actor} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] text-ink">
                      <span className="font-medium">{e.actor}</span> <span className="text-muted">{e.action.charAt(0).toLowerCase() + e.action.slice(1)}</span>
                    </p>
                    <Meta items={[e.orgId ? (orgs.find((o) => o.id === e.orgId)?.name ?? e.orgId) : "Platform"]} />
                  </div>
                  <time className="tnum shrink-0 text-[13px] text-subtle" dateTime={e.at} title={fmtDateTime(e.at)}>
                    {relativeAgo(e.at, now)}
                  </time>
                </li>
              ))}
            </ol>
          </DetailSection>

          <DetailSection
            card
            title="Bench pipeline"
            description={`${benchTotal} consultants`}
            action={
              <Link href="/ops/bench" className={textAction}>
                Open bench
              </Link>
            }
          >
            <ul className="space-y-4">
              {ops.stages.map((s) => (
                <li key={s.label} className="grid grid-cols-[minmax(96px,128px)_minmax(0,1fr)_36px] items-center gap-4 text-[14px]">
                  <span className="text-muted">{s.label}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-[#e6eaf0]" role="img" aria-label={`${s.label}: ${s.value}`}>
                    <span className="block h-full rounded-full bg-cobalt" style={{ width: `${(s.value / benchMax) * 100}%` }} />
                  </span>
                  <span className="tnum text-right font-semibold text-ink">{s.value}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection
            card
            title="Compliance queue"
            description={`${flags} blocking · ${ops.attention.length - flags} notices`}
            action={
              <Link href="/ops/compliance" className={textAction}>
                Open queue
              </Link>
            }
            bodyClassName="p-0"
          >
            {ops.attention.length === 0 ? (
              <EmptyState icon={<IconCheck size={18} />} title="Queue clear" description="Nothing is blocking presentation." />
            ) : (
              <ul className="divide-y divide-line">
                {ops.attention.slice(0, 5).map((a) => (
                  <li
                    key={a.code + a.label}
                    className="grid min-h-[52px] grid-cols-[72px_minmax(0,1fr)] items-center gap-x-3 gap-y-1 px-5 py-2.5 sm:grid-cols-[72px_minmax(0,1fr)_minmax(0,auto)] sm:px-6"
                  >
                    <Link href={`/admin/candidates/${a.code}`} className="hover:text-cobalt">
                      <CandidateCode code={a.code} />
                    </Link>
                    <span className="truncate text-[14px] text-ink">{a.name}</span>
                    <StatusDot tone={a.severity === "flag" ? "danger" : "warning"} className="col-start-2 sm:col-start-auto">
                      {a.label}
                      {a.due !== undefined ? `, ${a.due} days` : ""}
                    </StatusDot>
                  </li>
                ))}
              </ul>
            )}
          </DetailSection>
        </div>
      </PageBody>
    </>
  );
}
