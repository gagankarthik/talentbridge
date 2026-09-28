"use client";

import * as Popover from "@radix-ui/react-popover";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { availabilityOf, freshnessDays, usd, WORK_AUTH_LABEL } from "@/lib/format";
import type { ScoredCandidate } from "@/lib/query";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { AvailabilityPill, CandidateCode, SkillChip, WorkAuthTag } from "@/components/ui/status";
import { IconBookmark, IconChevronDown, IconColumns } from "@/components/icons";
import { ScoreBar } from "./candidate-card";

export type ColKey = "role" | "stack" | "auth" | "available" | "rate" | "score" | "fresh" | "clearance" | "location";
type SortDir = "asc" | "desc";
export type GroupBy = "none" | "discipline" | "availability" | "workAuthorization";

interface Col {
  key: ColKey;
  label: string;
  /** Container-query visibility: lower-priority columns drop out as the table narrows */
  show: string;
  sort?: (c: ScoredCandidate, basis: "c2c" | "w2") => number | string;
  align?: "right";
  render: (c: ScoredCandidate, basis: "c2c" | "w2") => React.ReactNode;
}

const COLS: Col[] = [
  {
    key: "role",
    label: "Candidate",
    show: "table-cell",
    sort: (c) => c.title,
    render: (c) => (
      <>
        <CandidateCode code={c.code} />
        <span className="block max-w-[260px] truncate font-medium text-ink">{c.title}</span>
        <span className="tnum text-xs text-subtle">{c.yearsExperience} yrs</span>
      </>
    ),
  },
  {
    key: "stack",
    label: "Primary skills",
    show: "hidden @min-[880px]:table-cell",
    render: (c) => (
      <div className="flex items-center gap-1 whitespace-nowrap">
        {c.skills.filter((s) => s.primary).slice(0, 2).map((s) => (
          <SkillChip key={s.skill} skill={s.skill} years={s.years} />
        ))}
        {c.skills.length > 2 && <span className="text-xs text-subtle">+{c.skills.length - 2}</span>}
      </div>
    ),
  },
  { key: "auth", label: "Work auth", show: "table-cell", sort: (c) => WORK_AUTH_LABEL[c.workAuthorization], render: (c) => <WorkAuthTag auth={c.workAuthorization} short /> },
  { key: "available", label: "Availability", show: "table-cell", sort: (c) => availabilityOf(c).sortKey, render: (c) => <AvailabilityPill c={c} /> },
  { key: "rate", label: "Rate", show: "table-cell", align: "right", sort: (c, b) => (b === "c2c" ? c.rateC2C : c.rateW2), render: (c, b) => <span className="tnum font-semibold">{usd.format(b === "c2c" ? c.rateC2C : c.rateW2)}</span> },
  { key: "score", label: "Screen", show: "hidden @min-[720px]:table-cell", sort: (c) => c.technicalScreenScore ?? 0, render: (c) => <ScoreBar score={c.technicalScreenScore} /> },
  { key: "fresh", label: "Freshness", show: "hidden @min-[1000px]:table-cell", sort: (c) => -freshnessDays(c.lastVerifiedAt), render: (c) => <FreshnessMeter lastVerifiedAt={c.lastVerifiedAt} compact /> },
  { key: "clearance", label: "Clearance", show: "hidden @min-[1100px]:table-cell", sort: (c) => c.clearance, render: (c) => <span className={c.clearance === "None" ? "text-subtle" : "font-medium"}>{c.clearance === "None" ? "None" : c.clearance}</span> },
  { key: "location", label: "Location", show: "hidden @min-[1100px]:table-cell", sort: (c) => c.metro, render: (c) => <span className="whitespace-nowrap text-muted">{c.metro} ({c.timezone})</span> },
];

export const DEFAULT_COLS: ColKey[] = ["role", "stack", "auth", "available", "rate", "score", "fresh"];
const PAGE = 25;

const GROUP_LABEL: Record<Exclude<GroupBy, "none">, (c: ScoredCandidate) => string> = {
  discipline: (c) => c.discipline,
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

/** Column chooser for the table view (lives in the page toolbar). */
export function ColumnsMenu({ cols, setCols }: { cols: ColKey[]; setCols: (c: ColKey[]) => void }) {
  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex h-9 shrink-0 items-center gap-2 rounded-ctl bg-surface px-3 text-sm text-ink-2 ring-1 ring-inset ring-line-strong hover:bg-canvas" aria-label="Choose columns">
        <IconColumns size={16} />
        <span className="hidden sm:inline">Columns</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6} className="anim-fade z-50 w-56 rounded-[10px] bg-surface p-2 shadow-lg ring-1 ring-line">
          <p className="px-1 pb-1 text-xs font-medium text-subtle">Visible columns</p>
          {COLS.filter((c) => c.key !== "role").map((c) => (
            <Checkbox key={c.key} id={`col-${c.key}`} label={c.label} checked={cols.includes(c.key)} onCheckedChange={(v) => setCols(v ? [...cols, c.key] : cols.filter((x) => x !== c.key))} />
          ))}
          <p className="mt-1 px-1 text-[11px] leading-snug text-subtle">Some columns hide automatically on smaller screens.</p>
          <button onClick={() => setCols(DEFAULT_COLS)} className="mt-1 w-full rounded-[6px] px-1 py-1 text-left text-xs font-medium text-cobalt hover:bg-canvas">
            Reset to default
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function CandidateGrid({
  rows,
  rateBasis,
  groupBy,
  cols,
  selected,
  setSelected,
  onOpen,
}: {
  rows: ScoredCandidate[];
  rateBasis: "c2c" | "w2";
  groupBy: GroupBy;
  cols: ColKey[];
  selected: Set<string>;
  setSelected: (fn: (s: Set<string>) => Set<string>) => void;
  onOpen: (c: ScoredCandidate) => void;
}) {
  const { isShortlisted, toggleShortlist } = useWorkspace();
  const [sort, setSort] = useState<{ key: ColKey; dir: SortDir } | null>(null);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = COLS.find((c) => c.key === sort.key)!;
    return [...rows].sort((a, b) => {
      const x = col.sort!(a, rateBasis);
      const y = col.sort!(b, rateBasis);
      return (x < y ? -1 : x > y ? 1 : 0) * (sort.dir === "asc" ? 1 : -1);
    });
  }, [rows, sort, rateBasis]);

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const p = Math.min(page, pages - 1);
  const pageRows = sorted.slice(p * PAGE, p * PAGE + PAGE);
  const visible = COLS.filter((c) => cols.includes(c.key));

  const groups = useMemo(() => {
    if (groupBy === "none") return [{ label: "", rows: pageRows }];
    const m = new Map<string, ScoredCandidate[]>();
    pageRows.forEach((r) => {
      const k = GROUP_LABEL[groupBy](r);
      m.set(k, [...(m.get(k) ?? []), r]);
    });
    return [...m.entries()].map(([label, rows]) => ({ label, rows }));
  }, [pageRows, groupBy]);

  const allOnPage = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));
  const toggleOne = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleSort = (key: ColKey) => setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));

  const bookmark = (c: ScoredCandidate) => (
    <button
      onClick={() => toggleShortlist(c)}
      aria-pressed={isShortlisted(c.id)}
      aria-label={isShortlisted(c.id) ? `Remove ${c.code} from shortlist` : `Shortlist ${c.code}`}
      className={cn("rounded-[6px] p-1.5", isShortlisted(c.id) ? "text-cobalt" : "text-faint hover:bg-placed-bg hover:text-ink")}
    >
      <IconBookmark size={16} />
    </button>
  );

  return (
    <div className="@container overflow-hidden rounded-[12px] bg-surface ring-1 ring-line">
      {/* Phones: compact list */}
      <div className="@min-[560px]:hidden">
        {groups.map((g) => (
          <div key={g.label || "all"}>
            {g.label && (
              <p className="bg-paper px-4 py-2 text-xs font-semibold text-ink-2">
                {g.label} <span className="tnum font-normal text-subtle">{g.rows.length}</span>
              </p>
            )}
            <ul>
              {g.rows.map((c) => (
                <li key={c.id} className={cn("flex gap-3 border-b border-line px-4 py-3.5 last:border-0", selected.has(c.id) && "bg-cobalt-wash/60")}>
                  <input type="checkbox" aria-label={`Select ${c.code}`} checked={selected.has(c.id)} onChange={() => toggleOne(c.id)} className="mt-1 size-4 shrink-0 accent-[var(--color-cobalt)]" />
                  <button type="button" onClick={() => onOpen(c)} className="min-w-0 flex-1 text-left">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0">
                        <CandidateCode code={c.code} />
                        <span className="block truncate text-[14px] font-medium text-ink">{c.title}</span>
                      </span>
                      <span className="tnum shrink-0 text-[14px] font-semibold text-ink">{usd.format(rateBasis === "c2c" ? c.rateC2C : c.rateW2)}</span>
                    </span>
                    <span className="tnum mt-0.5 block truncate text-xs text-subtle">
                      {c.yearsExperience} yrs, {c.skills.filter((s) => s.primary).map((s) => s.skill).slice(0, 3).join(", ")}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <WorkAuthTag auth={c.workAuthorization} short />
                      <AvailabilityPill c={c} />
                      <ScoreBar score={c.technicalScreenScore} />
                    </span>
                  </button>
                  <span className="-mr-1.5">{bookmark(c)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Tablet and up: table; low-priority columns drop out as it narrows */}
      <div className="hidden overflow-x-auto @min-[560px]:block">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-canvas text-xs text-subtle">
            <tr className="border-b border-line">
              <th className="w-10 py-2.5 pl-4">
                <input
                  type="checkbox"
                  aria-label="Select all on this page"
                  checked={allOnPage}
                  onChange={() =>
                    setSelected((s) => {
                      const n = new Set(s);
                      pageRows.forEach((r) => (allOnPage ? n.delete(r.id) : n.add(r.id)));
                      return n;
                    })
                  }
                  className="size-4 accent-[var(--color-cobalt)]"
                />
              </th>
              {visible.map((c) => (
                <th
                  key={c.key}
                  className={cn("py-2.5 pr-4 font-medium whitespace-nowrap", c.show, c.align === "right" && "text-right")}
                  aria-sort={sort?.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                >
                  {c.sort ? (
                    <button onClick={() => toggleSort(c.key)} className={cn("inline-flex items-center gap-1 whitespace-nowrap hover:text-ink", sort?.key === c.key && "text-ink")}>
                      {c.label}
                      <IconChevronDown size={12} className={cn("transition-transform", sort?.key !== c.key && "opacity-30", sort?.key === c.key && sort.dir === "asc" && "rotate-180")} />
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
              <th className="w-12 pr-3" aria-label="Shortlist" />
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.label || "all"}>
              {g.label && (
                <tr className="bg-paper">
                  <th colSpan={visible.length + 2} scope="colgroup" className="px-4 py-2 text-left text-xs font-semibold text-ink-2">
                    {g.label} <span className="tnum font-normal text-subtle">{g.rows.length}</span>
                  </th>
                </tr>
              )}
              {g.rows.map((c) => {
                const sel = selected.has(c.id);
                return (
                  <tr key={c.id} className={cn("border-b border-line last:border-0 hover:bg-canvas", sel && "bg-cobalt-wash/60 hover:bg-cobalt-wash")}>
                    <td className="py-2.5 pl-4">
                      <input type="checkbox" aria-label={`Select ${c.code}`} checked={sel} onChange={() => toggleOne(c.id)} className="size-4 accent-[var(--color-cobalt)]" />
                    </td>
                    {visible.map((col) => (
                      <td key={col.key} className={cn("py-2.5 pr-4 align-middle whitespace-nowrap", col.show, col.align === "right" && "text-right")}>
                        {col.key === "role" ? (
                          <button type="button" onClick={() => onOpen(c)} className="text-left">
                            {col.render(c, rateBasis)}
                          </button>
                        ) : (
                          col.render(c, rateBasis)
                        )}
                      </td>
                    ))}
                    <td className="py-2.5 pr-3 text-right">{bookmark(c)}</td>
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>

      <Pager page={p} pages={pages} total={sorted.length} onPage={setPage} />
    </div>
  );
}

export function Pager({ page, pages, total, onPage }: { page: number; pages: number; total: number; onPage: (p: number) => void }) {
  if (total === 0) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-[13px]">
      <span className="tnum text-subtle">
        {page * PAGE + 1}–{Math.min(total, (page + 1) * PAGE)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <span className="tnum hidden px-2 text-subtle sm:inline">
          Page {page + 1} of {pages}
        </span>
        <Button size="sm" variant="ghost" disabled={page >= pages - 1} onClick={() => onPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

export const PAGE_SIZE = PAGE;
