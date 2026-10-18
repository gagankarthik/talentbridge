"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { availabilityOf, freshnessDays, WORK_AUTH_LABEL } from "@/lib/format";
import type { ScoredCandidate } from "@/lib/query";
import { Checkbox } from "@/components/ui/form";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Pagination, usePage } from "@/components/ui/pagination";
import { AvailabilityText } from "@/components/ui/status-text";
import { CandidateCode, SkillChip, Tag, WorkAuthTag } from "@/components/ui/status";
import { IconChevronDown } from "@/components/icons";
import { ScoreBar, ShortlistToggle } from "./candidate-card";

export type ColKey = "role" | "stack" | "auth" | "available" | "rate" | "score" | "fresh" | "clearance" | "location";
type SortDir = "asc" | "desc";
export type GroupBy = "none" | "discipline" | "availability" | "workAuthorization";

interface Col {
  key: ColKey;
  label: string;
  width: string;
  sort?: (c: ScoredCandidate, basis: "c2c" | "w2") => number | string;
  align?: "end";
  render: (c: ScoredCandidate, basis: "c2c" | "w2") => React.ReactNode;
}

const practice = (d: string) => (d === "DevOps / Cloud" ? "Cloud & DevOps" : d);

const COLS: Col[] = [
  {
    key: "role",
    label: "Candidate",
    width: "minmax(300px,2.4fr)",
    sort: (c) => c.title,
    render: (c) => (
      <span className="flex min-w-0 items-center gap-3">
        <CandidateCode code={c.code} className="w-[54px] shrink-0" />
        <span className="min-w-0 truncate font-medium text-ink">{c.title}</span>
        <span className="tnum shrink-0 text-[12.5px] text-subtle">{c.yearsExperience}y</span>
      </span>
    ),
  },
  {
    key: "stack",
    label: "Primary skills",
    width: "minmax(210px,1.3fr)",
    render: (c) => {
      // Two chips only when both labels are short enough to fit the column without clipping
      const primary = c.skills.filter((s) => s.primary);
      const shown = primary.length > 1 && primary[0].skill.length + primary[1].skill.length <= 15 ? primary.slice(0, 2) : primary.slice(0, 1);
      return (
        <span className="flex min-w-0 items-center gap-[3px]">
          {shown.map((s) => (
            <SkillChip key={s.skill} skill={s.skill} years={s.years} />
          ))}
          {c.skills.length > shown.length && <Tag size="sm">+{c.skills.length - shown.length}</Tag>}
        </span>
      );
    },
  },
  { key: "auth", label: "Work auth", width: "100px", sort: (c) => WORK_AUTH_LABEL[c.workAuthorization], render: (c) => <WorkAuthTag auth={c.workAuthorization} short /> },
  { key: "available", label: "Availability", width: "148px", sort: (c) => availabilityOf(c).sortKey, render: (c) => <AvailabilityText c={c} /> },
  {
    key: "rate",
    label: "Rate",
    width: "92px",
    align: "end",
    sort: (c, b) => (b === "c2c" ? c.rateC2C : c.rateW2),
    render: (c, b) => (
      <span className="font-semibold">
        <span className="font-normal text-subtle">$</span>
        {(b === "c2c" ? c.rateC2C : c.rateW2).toLocaleString("en-US")}
      </span>
    ),
  },
  { key: "score", label: "Screen", width: "120px", sort: (c) => c.technicalScreenScore ?? 0, render: (c) => <ScoreBar score={c.technicalScreenScore} /> },
  { key: "fresh", label: "Verified", width: "84px", sort: (c) => -freshnessDays(c.lastVerifiedAt), render: (c) => <FreshnessMeter lastVerifiedAt={c.lastVerifiedAt} compact /> },
  {
    key: "clearance",
    label: "Clearance",
    width: "120px",
    sort: (c) => c.clearance,
    render: (c) => (c.clearance === "None" ? <span className="text-subtle">None</span> : <span className="font-medium">{c.clearance}</span>),
  },
  {
    key: "location",
    label: "Location",
    width: "minmax(170px,1fr)",
    sort: (c) => c.metro,
    render: (c) => (
      <span className="truncate text-ink-2">
        {c.metro} <span className="text-subtle">({c.timezone})</span>
      </span>
    ),
  },
];

/** The six columns a buyer scans first; the rest sit behind the column chooser. */
export const DEFAULT_COLS: ColKey[] = ["role", "stack", "auth", "available", "rate", "score"];
const PAGE = 25;

const GROUP_LABEL: Record<Exclude<GroupBy, "none">, (c: ScoredCandidate) => string> = {
  discipline: (c) => practice(c.discipline),
  availability: (c) => (availabilityOf(c).label.startsWith("From") ? "Specific date" : availabilityOf(c).label.startsWith("Within") ? "Within 2 weeks" : availabilityOf(c).label),
  workAuthorization: (c) => WORK_AUTH_LABEL[c.workAuthorization],
};

export function toCsv(rows: ScoredCandidate[], basis: "c2c" | "w2") {
  const head = ["Candidate ID", "Title", "Years", "Primary skills", "Work authorization", "Availability", `Rate ${basis.toUpperCase()}`, "Screen score", "Clearance", "Location"];
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = rows.map((c) =>
    [c.code, c.title, c.yearsExperience, c.skills.filter((s) => s.primary).map((s) => s.skill).join("; "), WORK_AUTH_LABEL[c.workAuthorization], availabilityOf(c).label, basis === "c2c" ? c.rateC2C : c.rateW2, c.technicalScreenScore ?? "", c.clearance, c.metro]
      .map(esc)
      .join(","),
  );
  return [head.map(esc).join(","), ...lines].join("\n");
}

/** Columns a viewer can show or hide (the candidate column is always shown). */
export const COLUMN_CHOICES: { key: ColKey; label: string }[] = COLS.filter((c) => c.key !== "role").map(({ key, label }) => ({ key, label }));

/**
 * The inventory as a grid table: select, sortable headers, a bookmark per row,
 * optional grouping into labelled strips, and a "Showing 1–25 of N" pager.
 * Row click opens the profile sheet.
 */
export function CandidateGrid({
  rows,
  rateBasis,
  groupBy,
  cols,
  selected,
  setSelected,
  onOpen,
  openId,
}: {
  rows: ScoredCandidate[];
  rateBasis: "c2c" | "w2";
  groupBy: GroupBy;
  cols: ColKey[];
  selected: Set<string>;
  setSelected: (fn: (s: Set<string>) => Set<string>) => void;
  onOpen: (c: ScoredCandidate) => void;
  openId?: string | null;
}) {
  const [sort, setSort] = useState<{ key: ColKey; dir: SortDir } | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = COLS.find((c) => c.key === sort.key)!;
    return [...rows].sort((a, b) => {
      const x = col.sort!(a, rateBasis);
      const y = col.sort!(b, rateBasis);
      return (x < y ? -1 : x > y ? 1 : 0) * (sort.dir === "asc" ? 1 : -1);
    });
  }, [rows, sort, rateBasis]);

  const pager = usePage(sorted, PAGE, sort ? `${sort.key}:${sort.dir}` : "");
  const pageRows = pager.rows;

  const groups = useMemo(() => {
    if (groupBy === "none") return [{ label: "", rows: pageRows }];
    const m = new Map<string, ScoredCandidate[]>();
    pageRows.forEach((r) => {
      const k = GROUP_LABEL[groupBy](r);
      m.set(k, [...(m.get(k) ?? []), r]);
    });
    return [...m.entries()].map(([label, rows]) => ({ label, rows }));
  }, [pageRows, groupBy]);

  const all = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));
  const toggleOne = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleSort = (key: ColKey) => setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));

  const columns: Column<ScoredCandidate>[] = [
    {
      key: "select",
      width: "44px",
      header: (
        <Checkbox
          id="select-all"
          checked={all}
          onCheckedChange={() =>
            setSelected((s) => {
              const n = new Set(s);
              pageRows.forEach((r) => (all ? n.delete(r.id) : n.add(r.id)));
              return n;
            })
          }
        />
      ),
      cell: (c) => (
        <span onClick={(e) => e.stopPropagation()} className="flex">
          <Checkbox id={`sel-${c.id}`} checked={selected.has(c.id)} onCheckedChange={() => toggleOne(c.id)} />
        </span>
      ),
    },
    ...COLS.filter((c) => cols.includes(c.key)).map<Column<ScoredCandidate>>((col) => ({
      key: col.key,
      width: col.width,
      align: col.align,
      header: col.sort ? (
        <button
          type="button"
          onClick={() => toggleSort(col.key)}
          aria-label={`Sort by ${col.label}`}
          className={cn("inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-ink", sort?.key === col.key && "text-ink")}
        >
          {col.label}
          <IconChevronDown size={12} className={cn("transition-transform", sort?.key !== col.key && "opacity-30", sort?.key === col.key && sort.dir === "asc" && "rotate-180")} />
        </button>
      ) : (
        col.label
      ),
      cell: (c) => col.render(c, rateBasis),
    })),
    {
      key: "bookmark",
      width: "52px",
      align: "end",
      // sr-only text inside a relative span so it can't escape the table's scroll clip
      header: (
        <span className="relative">
          <span className="sr-only">Shortlist</span>
        </span>
      ),
      cell: (c) => <ShortlistToggle c={c} className="-mr-1.5" />,
    },
  ];

  return (
    <div className="bg-surface">
      {groups.map((g, i) => (
        <div key={g.label || "all"}>
          {g.label && (
            <p className={cn("flex h-10 items-center gap-2 bg-canvas px-4 text-[13px] font-semibold text-ink sm:px-6", i > 0 && "border-t border-hair")}>
              {g.label}
              <span className="tnum font-normal text-ink-2">{g.rows.length}</span>
            </p>
          )}
          <DataTable
            caption={g.label ? `Candidates, ${g.label}` : "Candidates"}
            rows={g.rows}
            columns={columns}
            rowKey={(c) => c.id}
            onRowClick={onOpen}
            activeKey={openId}
            selectedKeys={selected}
            minWidth={900}
            rowHeight="h-[52px]"
          />
        </div>
      ))}
      <Pagination {...pager} noun="profiles" />
    </div>
  );
}
