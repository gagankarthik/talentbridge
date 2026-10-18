"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { freshnessDays, FRESHNESS_WINDOW_DAYS, WORK_AUTH_SHORT } from "@/lib/format";
import type { BenchStage, Candidate, Discipline } from "@/lib/types";
import { PageHeader } from "@/components/layout/app-shell";
import { buttonClass } from "@/components/ui/button";
import type { TagTone, Tone } from "@/components/ui/status";
import { StatusDot, type StatusTone } from "@/components/ui/status-dot";
import { FitTable, type FitColumn } from "./fit-table";
import { ListToolbar } from "./list-toolbar";
import { EmptyState } from "@/components/ui/data-display";
import { Pagination, usePage } from "@/components/ui/pagination";
import { IconPlus, IconUsers } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { isListable, readiness } from "./candidate-form";
import { Avatar, Meta, PageBody, Panel } from "./ui";
import { useWorkspace } from "@/lib/workspace-store";

const STAGES: BenchStage[] = ["Onboarding", "Vetting", "Available", "Interview", "Placed"];
export const stageLabel = (s: BenchStage) => (s === "Interview" ? "Client interview" : s);

/** Bench stage → status tone (dot + text), shared with the bench board, queue and record. */
export const STAGE_STATUS: Record<BenchStage, StatusTone> = {
  Onboarding: "neutral",
  Vetting: "info",
  Available: "success",
  Interview: "info",
  Placed: "neutral",
};
/** Bench stage → Tag tone, kept for older imports */
export const STAGE_TAG: Record<BenchStage, TagTone> = { Onboarding: "slate", Vetting: "blue", Available: "green", Interview: "blue", Placed: "slate" };
/** Legacy pill tones, kept for older imports */
export const STAGE_TONE: Record<BenchStage, Tone> = { Onboarding: "notice", Vetting: "cobalt", Available: "avail", Interview: "cobalt", Placed: "placed" };

/** Seed records plus anything added or edited in this console. */
export function useAllCandidates(seed: Candidate[]) {
  const { addedCandidates, candidateEdits } = useAdmin();
  return useMemo(
    () => [...addedCandidates, ...seed.map((c) => (candidateEdits[c.id] ? { ...c, ...candidateEdits[c.id] } : c))],
    [seed, addedCandidates, candidateEdits],
  );
}

export function nextCandidateCode(all: Candidate[]) {
  const max = Math.max(...all.map((c) => Number(c.code.replace(/\D/g, "")) || 0));
  return `TC-${max + 7}`;
}

type Visibility = "all" | "visible" | "blocked";
export const practiceLabel = (d: Discipline) => (d === "DevOps / Cloud" ? "Cloud & DevOps" : d);

function Readiness({ c }: { c: Candidate }) {
  const checks = readiness(c);
  const done = checks.filter((k) => k.ok).length;
  const blocking = checks.filter((k) => k.blocking && !k.ok);
  if (blocking.length)
    return (
      <StatusDot tone="danger" title={blocking.map((k) => k.label).join(", ")}>
        Blocked
      </StatusDot>
    );
  if (done === checks.length) return <StatusDot tone="success">All {checks.length} checks</StatusDot>;
  return (
    <span
      className="tnum text-muted"
      title={checks
        .filter((k) => !k.ok)
        .map((k) => k.label)
        .join(", ")}
    >
      {done} of {checks.length} checks
    </span>
  );
}

export function CandidateList({ seed }: { seed: Candidate[] }) {
  const all = useAllCandidates(seed);
  const router = useRouter();
  const params = useSearchParams();
  const urlQ = params.get("q") ?? "";
  const [q, setQ] = useState(urlQ);
  const [seenQ, setSeenQ] = useState(urlQ);
  if (urlQ !== seenQ) {
    setSeenQ(urlQ);
    setQ(urlQ);
  }
  const [stage, setStage] = useState<"all" | BenchStage>("all");
  const [vis, setVis] = useState<Visibility>("all");
  const [practice, setPractice] = useState<"all" | Discipline>("all");
  const [sort, setSort] = useState<"code" | "name" | "stale" | "rate">("code");
  const { notify } = useWorkspace();

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    const order: Record<typeof sort, (a: Candidate, b: Candidate) => number> = {
      code: (a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }),
      name: (a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`),
      stale: (a, b) => a.lastVerifiedAt.localeCompare(b.lastVerifiedAt),
      rate: (a, b) => b.rateC2C - a.rateC2C,
    };
    return all
      .filter(
        (c) =>
          (stage === "all" || c.benchStage === stage) &&
          (practice === "all" || c.discipline === practice) &&
          (vis === "all" || (vis === "visible" ? isListable(c) : !isListable(c) && c.benchStage !== "Placed")) &&
          (!n || `${c.firstName} ${c.lastName} ${c.email} ${c.code} ${c.title} ${c.skills.map((s) => s.skill).join(" ")}`.toLowerCase().includes(n)),
      )
      .sort(order[sort]);
  }, [all, q, stage, vis, practice, sort]);
  const pager = usePage(list, 25, `${q}|${stage}|${vis}|${practice}`);

  const cols: FitColumn<Candidate>[] = [
    {
      key: "who",
      header: "Candidate",
      width: "minmax(200px,1.8fr)",
      cell: (c) => (
        <Link href={`/admin/candidates/${c.code}`} onClick={(e) => e.stopPropagation()} className="group flex min-w-0 items-center gap-3">
          <Avatar name={`${c.firstName} ${c.lastName}`} size={32} />
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink group-hover:text-cobalt group-hover:underline">
              {c.firstName} {c.lastName}
            </span>
            <Meta
              items={[
                <span key="c" className="tnum font-medium text-muted">
                  {c.code}
                </span>,
                c.email,
              ]}
            />
          </span>
        </Link>
      ),
    },
    {
      key: "role",
      priority: 3,
      header: "Role",
      width: "minmax(200px,1.5fr)",
      cell: (c) => (
        <span className="min-w-0">
          <span className="block truncate text-ink">{c.title}</span>
          <Meta items={[`${c.yearsExperience} years`, practiceLabel(c.discipline)]} />
        </span>
      ),
    },
    {
      key: "stage",
      header: "Stage",
      width: "minmax(130px,0.9fr)",
      cell: (c) => <StatusDot tone={STAGE_STATUS[c.benchStage]}>{stageLabel(c.benchStage)}</StatusDot>,
    },
    {
      key: "auth",
      priority: 4,
      header: "Work auth",
      width: "minmax(110px,0.7fr)",
      cell: (c) => <span className="text-muted">{WORK_AUTH_SHORT[c.workAuthorization]}</span>,
    },
    { key: "ready", header: "Readiness", width: "minmax(170px,1fr)", cell: (c) => <Readiness c={c} /> },
    {
      key: "rate",
      priority: 5,
      header: "C2C rate",
      width: "minmax(96px,0.6fr)",
      align: "end",
      cell: (c) => (
        <span className="text-ink">
          ${c.rateC2C}
          <span className="text-subtle">/hr</span>
        </span>
      ),
    },
    {
      key: "fresh",
      priority: 2,
      header: "Confirmed",
      width: "minmax(128px,0.7fr)",
      align: "end",
      cell: (c) => {
        const d = freshnessDays(c.lastVerifiedAt);
        const label = d === 0 ? "Today" : d === 1 ? "1 day ago" : `${d} days ago`;
        return d >= FRESHNESS_WINDOW_DAYS ? <StatusDot tone="warning">{label}</StatusDot> : <span className="whitespace-nowrap text-subtle">{label}</span>;
      },
    },
  ];

  const clearAll = () => {
    setQ("");
    setStage("all");
    setVis("all");
    setPractice("all");
  };

  const exportCsv = () => {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [
      ["Code", "First name", "Last name", "Email", "Title", "Practice", "Stage", "Work authorization", "C2C rate", "W2 rate", "Last confirmed"],
      ...list.map((c) => [
        c.code,
        c.firstName,
        c.lastName,
        c.email,
        c.title,
        practiceLabel(c.discipline),
        stageLabel(c.benchStage),
        WORK_AUTH_SHORT[c.workAuthorization],
        c.rateC2C,
        c.rateW2,
        c.lastVerifiedAt.slice(0, 10),
      ]),
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" }));
    a.download = `candidates-${list.length}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    notify({ tone: "ok", title: `Exported ${list.length} candidates` });
  };

  return (
    <>
      <PageHeader
        title="Candidates"
        description="Internal records with names and contact details. Customers only ever see the blind profile."
        actions={
          <Link href="/admin/candidates/new" className={buttonClass("primary", "md")}>
            <IconPlus size={16} />
            Add candidate
          </Link>
        }
      />
      <PageBody>
        <Panel>
          <ListToolbar
            noun="candidates"
            summary={list.length}
            onClearAll={clearAll}
            search={{ value: q, onChange: setQ, placeholder: "Search candidates" }}
            sort={{
              value: sort,
              onChange: (v) => setSort(v as typeof sort),
              options: [
                { value: "code", label: "Code" },
                { value: "name", label: "Last name" },
                { value: "stale", label: "Longest since confirmed" },
                { value: "rate", label: "Highest rate" },
              ],
            }}
            overflow={[{ label: "Export CSV", onSelect: exportCsv, disabled: !list.length }]}
            filters={[
              {
                key: "stage",
                label: "Stage",
                value: stage,
                onChange: (v) => setStage(v as typeof stage),
                options: [
                  { value: "all", label: "All stages", meta: all.length },
                  ...STAGES.map((s) => ({ value: s, label: stageLabel(s), meta: all.filter((c) => c.benchStage === s).length })),
                ],
              },
              {
                key: "practice",
                label: "Practice",
                value: practice,
                onChange: (v) => setPractice(v as typeof practice),
                options: [
                  { value: "all", label: "All practices" },
                  ...(["Data & AI", "DevOps / Cloud", "Full-Stack"] as Discipline[]).map((d) => ({
                    value: d,
                    label: practiceLabel(d),
                    meta: all.filter((c) => c.discipline === d).length,
                  })),
                ],
              },
              {
                key: "vis",
                label: "Customer visibility",
                value: vis,
                onChange: (v) => setVis(v as Visibility),
                options: [
                  { value: "all", label: "Any" },
                  { value: "visible", label: "Visible", meta: all.filter(isListable).length },
                  { value: "blocked", label: "Not visible", meta: all.filter((c) => !isListable(c) && c.benchStage !== "Placed").length },
                ],
              },
            ]}
          />
          <FitTable
            caption="Candidates"
            rows={pager.rows}
            columns={cols}
            rowKey={(c) => c.id}
            onRowClick={(c) => router.push(`/admin/candidates/${c.code}`)}
            empty={<EmptyState icon={<IconUsers size={18} />} title="No candidates match" description="Clear the search or filters to see everyone." />}
          />
          <Pagination {...pager} noun="candidates" />
        </Panel>
      </PageBody>
    </>
  );
}
