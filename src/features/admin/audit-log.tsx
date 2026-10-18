"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { fmtDateTime, relativeAgo } from "@/lib/format";
import { useDemoNow } from "@/lib/clock";
import type { AuditEvent } from "@/lib/platform";
import { useWorkspace } from "@/lib/workspace-store";
import { PageHeader } from "@/components/layout/app-shell";
import { FitTable, type FitColumn } from "./fit-table";
import { ListToolbar } from "./list-toolbar";
import { EmptyState } from "@/components/ui/data-display";
import { Pagination, usePage } from "@/components/ui/pagination";
import { IconFile } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { Avatar, PageBody, Panel } from "./ui";

type Actor = "all" | AuditEvent["actorType"];
const ACTOR: Record<AuditEvent["actorType"], string> = { platform: "Platform staff", customer: "Customer", system: "System" };

export function AuditLog() {
  const { audit, orgs } = useAdmin();
  const { notify } = useWorkspace();
  const params = useSearchParams();
  const now = useDemoNow(60_000);
  const [org, setOrg] = useState(params.get("org") ?? "all");
  const [actor, setActor] = useState<Actor>("all");
  const [q, setQ] = useState(params.get("q") ?? "");

  const orgName = (id: string | null) => (id ? (orgs.find((o) => o.id === id)?.name ?? id) : "Platform");
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return audit.filter(
      (e) =>
        (org === "all" || e.orgId === org) &&
        (actor === "all" || e.actorType === actor) &&
        (!n || `${e.actor} ${e.action} ${e.detail}`.toLowerCase().includes(n)),
    );
  }, [audit, org, actor, q]);
  const pager = usePage(list, 25, `${q}|${org}|${actor}`);

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ["Time", "Actor", "Actor type", "Organization", "Action", "Detail"],
      ...list.map((e) => [e.at, e.actor, e.actorType, orgName(e.orgId), e.action, e.detail]),
    ];
    const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `audit-log-${list.length}-events.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    notify({ tone: "ok", title: `Exported ${list.length} events` });
  };

  const cols: FitColumn<AuditEvent>[] = [
    {
      key: "when",
      header: "Time",
      width: "minmax(190px,0.9fr)",
      cell: (e) => (
        <span className="min-w-0">
          <span className="tnum block whitespace-nowrap text-ink">{fmtDateTime(e.at)}</span>
          <span className="tnum block text-[13px] text-subtle">{relativeAgo(e.at, now)}</span>
        </span>
      ),
    },
    {
      key: "actor",
      priority: 1,
      header: "Actor",
      width: "minmax(180px,1fr)",
      cell: (e) => (
        <span className="flex min-w-0 items-center gap-3">
          <Avatar name={e.actor} size={32} />
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink">{e.actor}</span>
            <span className="block text-[13px] text-subtle">{ACTOR[e.actorType]}</span>
          </span>
        </span>
      ),
    },
    {
      key: "org",
      priority: 2,
      header: "Organization",
      width: "minmax(180px,1fr)",
      cell: (e) => <span className={e.orgId ? "truncate text-muted" : "text-subtle"}>{orgName(e.orgId)}</span>,
    },
    {
      key: "event",
      header: "Event",
      width: "minmax(260px,2.2fr)",
      cell: (e) => (
        <span className="min-w-0">
          <span className="block font-medium text-ink">{e.action}</span>
          <span className="block truncate text-[13px] text-subtle" title={e.detail}>
            {e.detail}
          </span>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Audit log"
        description="Every change made in the console and by customer admins, newest first. Exports include only the events in your current view."
      />
      <PageBody>
        <Panel>
          <ListToolbar
            noun="events"
            summary={list.length}
            onClearAll={() => {
              setQ("");
              setOrg("all");
              setActor("all");
            }}
            search={{ value: q, onChange: setQ, placeholder: "Search actor, action or detail" }}
            overflow={[{ label: "Export CSV of this view", onSelect: exportCsv, disabled: !list.length }]}
            filters={[
              {
                key: "org",
                label: "Organization",
                value: org,
                onChange: setOrg,
                options: [
                  { value: "all", label: "All organizations" },
                  ...orgs.map((o) => ({ value: o.id, label: o.name, meta: audit.filter((e) => e.orgId === o.id).length })),
                ],
              },
              {
                key: "actor",
                label: "Actor",
                value: actor,
                onChange: (v) => setActor(v as Actor),
                options: [
                  { value: "all", label: "Anyone" },
                  ...(["platform", "customer", "system"] as const).map((a) => ({
                    value: a,
                    label: ACTOR[a],
                    meta: audit.filter((e) => e.actorType === a).length,
                  })),
                ],
              },
            ]}
          />
          <FitTable
            caption="Audit events"
            rows={pager.rows}
            columns={cols}
            rowKey={(e) => e.id}
            empty={
              <EmptyState icon={<IconFile size={18} />} title="No events match these filters" description="Clear the search or choose another organization." />
            }
          />
          <Pagination {...pager} noun="events" />
        </Panel>
      </PageBody>
    </>
  );
}
