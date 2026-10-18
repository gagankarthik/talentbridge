"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoNow } from "@/lib/clock";
import { cn } from "@/lib/cn";
import { fmtDateTime, relativeAgo, STATUS_LABEL, usd } from "@/lib/format";
import type { EngagementStatus } from "@/lib/types";
import { useWorkspace, type MyRequest } from "@/lib/workspace-store";
import { PageBody, PageHeader } from "@/components/layout/app-shell";
import { cardClass } from "@/components/ui/page";
import { HoldMeter } from "@/features/dashboard/hold-meter";
import { Button, buttonClass } from "@/components/ui/button";
import { Modal, Sheet } from "@/components/ui/overlay";
import { DataTable, type Column } from "@/components/ui/data-table";
import { DetailSection, EmptyState, KpiTile } from "@/components/ui/data-display";
import { kpiCompact, kpiGrid, plural } from "@/features/dashboard/kpi";
import { UnderlineTabs } from "@/components/ui/tabs";
import { ActiveFilters, FilterMenu, FilterSearch, Toolbar } from "@/components/ui/filter-menu";
import { MenuItem, OverflowMenu } from "@/components/ui/overflow-menu";
import { IconExport } from "@/components/icons";
import { CandidateCode, EngagementPill } from "@/components/ui/status";
import { IconInbox, IconPrinter, IconSend, IconUnlock } from "@/components/icons";
import { RequestTalentButton } from "@/features/request-engine/talent-request";

export interface RequestRow extends MyRequest {
  /** Created in this browser session (can be released). */
  mine?: boolean;
}

type TabKey = "all" | "locked" | "interview" | "closed";

const TABS: { value: TabKey; label: string; match: (r: RequestRow, now: number) => boolean }[] = [
  { value: "all", label: "All requests", match: () => true },
  { value: "locked", label: "Active holds", match: (r, now) => !!r.lockExpiresAt && new Date(r.lockExpiresAt).getTime() > now },
  { value: "interview", label: "Interviewing", match: (r) => r.status === "INTERVIEWING" || r.status === "OFFERED" },
  { value: "closed", label: "Placed and closed", match: (r) => r.status === "ACTIVE" || r.status === "COMPLETED" },
];

const STAGES: EngagementStatus[] = ["DRAFT", "SUBMITTED", "INTERVIEWING", "OFFERED", "ACTIVE", "COMPLETED"];

function holdLeft(r: RequestRow, now: number) {
  return r.lockExpiresAt ? new Date(r.lockExpiresAt).getTime() - now : null;
}

/** Hold time left: the shared hold meter, or a plain note when there is no live hold. */
function HoldCell({ r, now }: { r: RequestRow; now: number }) {
  const left = holdLeft(r, now);
  if (left === null) return <span className="text-[13px] text-subtle">No hold</span>;
  if (left <= 0) return <span className="text-[13px] text-subtle">Expired {relativeAgo(r.lockExpiresAt!, now)}</span>;
  return (
    <span className="w-[150px]" title={`Expires ${fmtDateTime(r.lockExpiresAt!)}`}>
      <HoldMeter left={left} />
    </span>
  );
}

export function RequestsView({ seeded }: { seeded: RequestRow[] }) {
  const { myRequests, releaseRequest, notify } = useWorkspace();
  const now = useDemoNow(15_000);
  const [tab, setTab] = useState<TabKey>("all");
  const [open, setOpen] = useState<RequestRow | null>(null);
  const [search, setSearch] = useState("");
  const [client, setClient] = useState("all");
  const [releasing, setReleasing] = useState<RequestRow | null>(null);

  const rows: RequestRow[] = [...myRequests.map((r) => ({ ...r, mine: true })), ...seeded];
  const submitted = rows.filter((r) => r.status !== "DRAFT");
  const reachedInterview = submitted.filter((r) => (["INTERVIEWING", "OFFERED", "ACTIVE", "COMPLETED"] as EngagementStatus[]).includes(r.status));
  const conversion = submitted.length ? Math.round((reachedInterview.length / submitted.length) * 100) : 0;
  const activeHolds = rows.filter((r) => TABS[1].match(r, now)).length;
  const expiringSoon = rows.filter((r) => {
    const left = holdLeft(r, now);
    return left !== null && left > 0 && left < 6 * 3_600_000;
  }).length;
  const clients = [...new Set(rows.map((r) => r.clientName))].sort();
  const needle = search.trim().toLowerCase();
  const list = rows
    .filter((r) => TABS.find((t) => t.value === tab)!.match(r, now))
    .filter((r) => client === "all" || r.clientName === client)
    .filter((r) => !needle || `${r.code} ${r.revealedName} ${r.title} ${r.clientName} ${r.targetRoleTitle}`.toLowerCase().includes(needle));
  const exportCsv = () => {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [
      ["Candidate ID", "Candidate", "Title", "End client", "Role", "Bill rate", "Status", "Hold expires", "Created"].map(esc).join(","),
      ...list.map((r) => [r.code, r.revealedName, r.title, r.clientName, r.targetRoleTitle, r.proposedRate, STATUS_LABEL[r.status], r.lockExpiresAt ?? "", r.createdAt].map(esc).join(",")),
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    a.download = `requests-${list.length}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    notify({ tone: "ok", title: `Exported ${list.length} ${list.length === 1 ? "request" : "requests"}` });
  };
  const canRelease = (r: RequestRow) => r.mine && !!r.lockExpiresAt && new Date(r.lockExpiresAt).getTime() > now;

  const columns: Column<RequestRow>[] = [
    {
      key: "candidate",
      header: "Candidate",
      width: "minmax(220px,1.4fr)",
      cell: (r) => (
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <CandidateCode code={r.code} />
            <span className="truncate font-medium text-ink">{r.revealedName}</span>
            {r.mine && <span className="size-1.5 shrink-0 rounded-full bg-cobalt" title="Placed in this session" />}
          </span>
          <span className="block truncate text-[13px] text-ink-2">{r.title}</span>
        </span>
      ),
    },
    {
      key: "client",
      header: "End client and role",
      width: "minmax(220px,1.4fr)",
      cell: (r) => (
        <span className="min-w-0">
          <span className="block truncate font-medium text-ink">{r.clientName}</span>
          <span className="block truncate text-[13px] text-ink-2">{r.targetRoleTitle}</span>
        </span>
      ),
    },
    {
      key: "rate",
      header: "Bill rate",
      width: "104px",
      align: "end",
      cell: (r) => (
        <span className="font-medium">
          <span className="font-normal text-subtle">$</span>
          {r.proposedRate}
          <span className="font-normal text-subtle">/hr</span>
        </span>
      ),
    },
    { key: "status", header: "Status", width: "136px", cell: (r) => <EngagementPill status={r.status} /> },
    { key: "hold", header: "Hold time left", width: "184px", cell: (r) => <HoldCell r={r} now={now} /> },
    { key: "created", header: "Created", width: "112px", cell: (r) => <span className="tnum text-ink-2">{relativeAgo(r.createdAt, now)}</span> },
    {
      key: "actions",
      header: (
        <span className="relative">
          <span className="sr-only">Actions</span>
        </span>
      ),
      width: "92px",
      align: "end",
      cell: (r) => (
        <span className="flex items-center justify-end gap-0.5" onClick={(e) => e.stopPropagation()}>
          <Link href={`/one-sheet/${r.code}`} target="_blank" className={buttonClass("ghost", "icon")} aria-label={`One-sheet for ${r.code}`}>
            <IconPrinter size={15} />
          </Link>
          {canRelease(r) && (
            <Button size="icon" variant="ghost" onClick={() => setReleasing(r)} aria-label={`Release hold on ${r.code}`} title="Release hold">
              <IconUnlock size={15} />
            </Button>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Requests and holds"
        breadcrumb={[{ label: "Workspace", href: "/dashboard" }, { label: "Requests and holds" }]}
        description="Every candidate you've held or submitted, with the time left on each 48-hour hold."
        actions={
          <RequestTalentButton variant="primary" size="md">
            Match a job spec
          </RequestTalentButton>
        }
        tabs={
          <UnderlineTabs
            listClassName="border-b-0 px-0 sm:px-0"
            label="Filter requests"
            value={tab}
            onValueChange={setTab}
            tabs={TABS.map((t) => ({ value: t.value, label: t.label, count: rows.filter((r) => t.match(r, now)).length }))}
          />
        }
      />

      <PageBody className="space-y-8">
      <section aria-label="Key figures" className={kpiGrid}>
        <KpiTile
          className={kpiCompact}
          label="Active holds"
          value={activeHolds}
          hint={expiringSoon ? <span className="text-[#9a5b00]">{expiringSoon} {expiringSoon === 1 ? "expires" : "expire"} within 6 hours</span> : "None expire within 6 hours"}
        />
        <KpiTile className={kpiCompact} label="Submissions, last 30 days" value={submitted.length} hint={`${plural(rows.length - submitted.length, "draft")} not yet submitted`} />
        <KpiTile className={kpiCompact} label="Submission to interview" value={`${conversion}%`} delta={{ value: "Target 35%", direction: conversion >= 35 ? "up" : "down" }} />
        <KpiTile className={kpiCompact} label="Placements active" value={rows.filter((r) => r.status === "ACTIVE").length} hint="Currently billing" />
      </section>

      <div className={`overflow-hidden ${cardClass}`}>
        <Toolbar
          summary={`${list.length} ${list.length === 1 ? "request" : "requests"}`}
          actions={
            <OverflowMenu label="Request options">
              <MenuItem onSelect={exportCsv} disabled={!list.length}>
                <IconExport size={16} />
                Export {list.length} as CSV
              </MenuItem>
            </OverflowMenu>
          }
          chips={
            <ActiveFilters
              filters={[
                ...(needle ? [{ key: "q", label: "Search", value: `“${search.trim()}”`, onRemove: () => setSearch("") }] : []),
                ...(client !== "all" ? [{ key: "client", label: "End client", value: client, onRemove: () => setClient("all") }] : []),
              ]}
              onClearAll={() => {
                setSearch("");
                setClient("all");
              }}
            />
          }
        >
          <FilterSearch value={search} onChange={setSearch} placeholder="Search candidate, client or role" className="sm:w-[300px]" />
          <FilterMenu label="End client" value={client} allValue="all" options={[{ value: "all", label: "Any" }, ...clients.map((c) => ({ value: c, label: c, meta: rows.filter((r) => r.clientName === c).length }))]} onChange={setClient} />
        </Toolbar>
        <DataTable
          caption="Requests"
          rows={list}
          columns={columns}
          rowKey={(r) => r.id}
          onRowClick={setOpen}
          activeKey={open?.id}
          rowHeight="min-h-[60px] py-2"
          minWidth={980}
          empty={
            needle || client !== "all" ? (
              <EmptyState icon={<IconInbox size={18} />} title="No requests match these filters" description="Clear the search or the client filter to see every request in this tab." />
            ) : (
              <EmptyState icon={<IconInbox size={18} />} title="No requests in this view" description="Hold a candidate from the talent inventory and the request appears here with its countdown." />
            )
          }
          aggregates={[
            { value: list.filter((r) => (holdLeft(r, now) ?? 0) > 0).length, label: "With a live hold" },
            { value: list.length ? usd.format(Math.round(list.reduce((n, r) => n + r.proposedRate, 0) / list.length)) : "–", label: "Average bill rate" },
            { value: new Set(list.map((r) => r.clientName)).size, label: "End clients" },
          ]}
        />
      </div>
      </PageBody>

      <Sheet
        open={!!open}
        onOpenChange={(o) => !o && setOpen(null)}
        icon={<IconSend size={15} />}
        title={open ? `Request for ${open.code}` : ""}
        footer={
          open && (
            <div className="flex w-full items-center justify-between gap-2">
              <Link href={`/one-sheet/${open.code}`} target="_blank" className={buttonClass("ghost")}>
                <IconPrinter size={15} />
                One-sheet
              </Link>
              {canRelease(open) && (
                <Button variant="danger" onClick={() => setReleasing(open)}>
                  <IconUnlock size={15} />
                  Release hold
                </Button>
              )}
            </div>
          )
        }
      >
        {open && (
          <>
            <div className="px-5 pt-5 pb-5 shadow-[inset_0_-1px_0_var(--color-hair)]">
              <div className="flex flex-wrap items-center gap-2">
                <CandidateCode code={open.code} />
                <EngagementPill status={open.status} />
              </div>
              <h2 className="mt-1.5 text-[20px] font-semibold tracking-[-0.01em] text-ink">{open.revealedName}</h2>
              <p className="text-[14px] text-ink-2">{open.title}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ["End client", open.clientName],
                  ["Role", open.targetRoleTitle],
                  ["Bill rate", `${usd.format(open.proposedRate)}/hr`],
                  ["Created", fmtDateTime(open.createdAt)],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1.5 rounded-md border border-hair px-3 py-2.5">
                    <dt className="text-[13px] text-ink-2">{k}</dt>
                    <dd className="truncate text-[14px] font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <DetailSection title="Hold">
              <HoldCell r={open} now={now} />
              <p className="mt-3 text-[14px] text-ink-2">
                While the hold is live, no other partner can submit this candidate to {open.clientName}.
              </p>
            </DetailSection>

            <DetailSection title="Progress">
              <ol className="space-y-2.5">
                {STAGES.filter((s) => s !== "COMPLETED" || open.status === "COMPLETED").map((s) => {
                  const reached = STAGES.indexOf(open.status) >= STAGES.indexOf(s);
                  const current = open.status === s;
                  return (
                    <li key={s} className="flex items-center gap-3 text-[13.5px]">
                      <span className={cn("size-2.5 shrink-0 rounded-full", current ? "bg-cobalt ring-4 ring-cobalt-wash" : reached ? "bg-cobalt" : "border border-control bg-surface")} />
                      <span className={cn(current ? "font-semibold text-ink" : reached ? "text-ink-2" : "text-subtle")}>{STATUS_LABEL[s]}</span>
                    </li>
                  );
                })}
              </ol>
            </DetailSection>
          </>
        )}
      </Sheet>

      <Modal
        open={!!releasing}
        onOpenChange={(o) => !o && setReleasing(null)}
        title={`Release the hold on ${releasing?.code}?`}
        description={`Other partners will be able to submit ${releasing?.revealedName} to ${releasing?.clientName} right away. The request moves back to draft.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setReleasing(null)}>
              Keep hold
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                releaseRequest(releasing!.id);
                notify({ tone: "ok", title: `Released hold on ${releasing!.code}` });
                setReleasing(null);
                setOpen(null);
              }}
            >
              Release hold
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-muted">You can place a new hold later if the candidate is still available.</p>
      </Modal>
    </>
  );
}
