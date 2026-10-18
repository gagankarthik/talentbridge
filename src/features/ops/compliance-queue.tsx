"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BenchStage } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { PageBody, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { CandidateCode } from "@/components/ui/status";
import { StatusDot } from "@/components/ui/status-dot";
import { FitTable, type FitColumn } from "@/features/admin/fit-table";
import { ListToolbar } from "@/features/admin/list-toolbar";
import { EmptyState, KpiTile } from "@/components/ui/data-display";
import { Pagination, usePage } from "@/components/ui/pagination";
import { UnderlineTabs } from "@/components/ui/tabs";
import { IconCheck, IconMail } from "@/components/icons";
import { STAGE_STATUS, stageLabel } from "@/features/admin/candidate-list";
import { Panel, textAction } from "@/features/admin/ui";

export interface QueueItem {
  id: string;
  candidateCode: string;
  name: string;
  title: string;
  stage: BenchStage;
  label: string;
  detail: string;
  severity: "flag" | "notice";
  dueInDays?: number;
}

export interface ComplianceStats {
  presentable: number;
  presentableVerified: number;
  visa90: number;
  bgPending: number;
  stale: number;
}

const ACTION: Record<string, string> = {
  "Work authorization unverified": "Request documents",
  "I-9 incomplete": "Assign reviewer",
  "Visa expiring": "Request extension",
  "Background check in progress": "Chase provider",
  "References outstanding": "Send reminder",
  "Availability stale": "Ping consultant",
};

type Sev = "flag" | "notice" | "all";

export function ComplianceQueue({ items, stats }: { items: QueueItem[]; stats: ComplianceStats }) {
  const { notify } = useWorkspace();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Sev>("flag");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [stageF, setStageF] = useState("all");
  const open = useMemo(() => items.filter((i) => !done.has(i.id)), [items, done]);
  const kinds = [...new Set(items.map((i) => i.label))];
  const verifiedPct = Math.round((stats.presentableVerified / stats.presentable) * 100);

  // Soonest deadline first; items due now (no countdown) lead.
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return open
      .filter(
        (i) =>
          (tab === "all" || i.severity === tab) &&
          (kind === "all" || i.label === kind) &&
          (stageF === "all" || i.stage === stageF) &&
          (!n || `${i.candidateCode} ${i.name} ${i.title}`.toLowerCase().includes(n)),
      )
      .sort((a, b) => (a.dueInDays ?? -1) - (b.dueInDays ?? -1));
  }, [open, tab, kind, q, stageF]);
  const pager = usePage(list, 25, `${q}|${tab}|${kind}|${stageF}`);
  const count = (s: Sev) => open.filter((i) => s === "all" || i.severity === s).length;

  const cols: FitColumn<QueueItem>[] = [
    {
      key: "who",
      header: "Consultant",
      width: "minmax(230px,1.3fr)",
      cell: (i) => (
        <span className="min-w-0">
          <Link href={`/admin/candidates/${i.candidateCode}`} className="group flex min-w-0 items-center gap-2">
            <CandidateCode code={i.candidateCode} />
            <span className="truncate font-medium text-ink group-hover:text-cobalt group-hover:underline">{i.name}</span>
          </Link>
          <span className="block truncate text-[13px] text-subtle">{i.title}</span>
        </span>
      ),
    },
    {
      key: "item",
      header: "Open item",
      width: "minmax(320px,2fr)",
      cell: (i) => (
        <span className="min-w-0">
          <StatusDot tone={i.severity === "flag" ? "danger" : "warning"} className="flex">
            {i.label}
          </StatusDot>
          <span className="mt-0.5 block truncate pl-3.5 text-[13px] text-subtle" title={i.detail}>
            {i.detail}
          </span>
        </span>
      ),
    },
    {
      key: "stage",
      priority: 2,
      header: "Stage",
      width: "minmax(140px,0.8fr)",
      cell: (i) => <StatusDot tone={STAGE_STATUS[i.stage]}>{stageLabel(i.stage)}</StatusDot>,
    },
    {
      key: "due",
      priority: 1,
      header: "Due",
      width: "minmax(100px,0.6fr)",
      cell: (i) =>
        i.dueInDays === undefined ? (
          <span className="font-medium text-[#b42318]">Now</span>
        ) : (
          <span className={i.dueInDays <= 45 ? "tnum font-medium text-[#b42318]" : "tnum text-[#9a5b00]"}>In {i.dueInDays} days</span>
        ),
    },
    {
      key: "act",
      header: <span className="sr-only">Actions</span>,
      width: "minmax(260px,1fr)",
      align: "end",
      cell: (i) => (
        <span className="flex items-center justify-end gap-4">
          <Button
            size="sm"
            onClick={() => notify({ tone: "ok", title: `${ACTION[i.label] ?? "Follow up"}: ${i.candidateCode}`, body: `Email queued to ${i.name}.` })}
          >
            <IconMail size={14} />
            {ACTION[i.label] ?? "Follow up"}
          </Button>
          <button
            type="button"
            className={textAction}
            onClick={() => {
              setDone((d) => new Set(d).add(i.id));
              notify({ tone: "ok", title: `Resolved: ${i.label.toLowerCase()} for ${i.candidateCode}` });
            }}
          >
            Resolve
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Compliance queue"
        description="Work authorization, I-9, background checks, references and availability. A blocking item keeps a profile off the customer bench."
        tabs={
          <UnderlineTabs
            value={tab}
            onValueChange={setTab}
            label="Severity"
            tabs={[
              { value: "flag", label: "Blocking", count: count("flag"), countTone: "flag" },
              { value: "notice", label: "Notices", count: count("notice") },
              { value: "all", label: "All open items", count: count("all") },
            ]}
          />
        }
      />
      <PageBody className="space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:gap-6">
          <KpiTile
            label="Verified before presentation"
            value={`${verifiedPct}%`}
            hint={`${stats.presentableVerified} of ${stats.presentable} listed profiles`}
          />
          <KpiTile label="Visas expiring within 90 days" value={stats.visa90} hint="Extensions to request" />
          <KpiTile label="Background checks pending" value={stats.bgPending} hint="With the screening provider" />
          <KpiTile label="Availability out of date" value={stats.stale} hint={`Not confirmed in the last 7 days`} />
        </div>

        <Panel>
          <ListToolbar
            noun="open items"
            summary={list.length}
            onClearAll={() => {
              setQ("");
              setKind("all");
              setStageF("all");
            }}
            search={{ value: q, onChange: setQ, placeholder: "Search code, name or role" }}
            filters={[
              {
                key: "item",
                label: "Item",
                value: kind,
                onChange: setKind,
                options: [{ value: "all", label: "All items" }, ...kinds.map((k) => ({ value: k, label: k, meta: open.filter((i) => i.label === k).length }))],
              },
              {
                key: "stage",
                label: "Stage",
                value: stageF,
                onChange: setStageF,
                options: [
                  { value: "all", label: "All stages" },
                  ...(["Onboarding", "Vetting", "Available", "Interview", "Placed"] as const).map((st) => ({
                    value: st,
                    label: stageLabel(st),
                    meta: open.filter((i) => i.stage === st).length,
                  })),
                ],
              },
            ]}
          />
          <FitTable
            caption="Compliance queue"
            rows={pager.rows}
            columns={cols}
            rowKey={(i) => i.id}
            empty={
              <EmptyState
                icon={<IconCheck size={18} />}
                title="Queue clear"
                description="No open items at this severity. New issues appear here as soon as a check lapses."
              />
            }
          />
          <Pagination {...pager} noun="open items" />
        </Panel>
      </PageBody>
    </>
  );
}
