"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoNow } from "@/lib/clock";
import { cn } from "@/lib/cn";
import { availabilityOf, formatCountdown, freshnessDays, relativeAgo, usd } from "@/lib/format";
import type { BlindCandidate } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { PageBody, PageHeader } from "@/components/layout/app-shell";
import { Button, buttonClass } from "@/components/ui/button";
import { EmptyState, SegmentBar } from "@/components/ui/data-display";
import { CandidateCode, SkillChip, Tag, WorkAuthTag } from "@/components/ui/status";
import { AvailabilityText } from "@/components/ui/status-text";
import { cardClass } from "@/components/ui/page";
import { FilterMenu, Toolbar } from "@/components/ui/filter-menu";
import { MenuItem, OverflowMenu } from "@/components/ui/overflow-menu";
import { IconBookmark, IconCheck, IconExport, IconLock, IconPrinter, IconX } from "@/components/icons";
import { CandidateSheet } from "@/features/talent/candidate-sheet";
import { LockDialog } from "@/features/talent/lock-dialog";

type Best = "min" | "max" | null;

interface RowDef {
  label: string;
  group: string;
  render: (c: BlindCandidate) => React.ReactNode;
  value?: (c: BlindCandidate) => number;
  best?: Best;
  /** Comparison key for rows without a numeric value, used by "Differences only" */
  key?: (c: BlindCandidate) => string;
}

/** True when the candidates don't all share the same value in this row. */
const differs = (r: RowDef, list: BlindCandidate[]) => new Set(list.map((c) => String(r.value ? r.value(c) : (r.key?.(c) ?? "")))).size > 1;

const ROWS: RowDef[] = [
  { group: "Commercials", label: "C2C rate", render: (c) => `${usd.format(c.rateC2C)}/hr`, value: (c) => c.rateC2C, best: "min" },
  { group: "Commercials", label: "W2 rate", render: (c) => `${usd.format(c.rateW2)}/hr`, value: (c) => c.rateW2, best: "min" },
  { group: "Readiness", label: "Availability", render: (c) => <AvailabilityText c={c} />, value: (c) => availabilityOf(c).sortKey, best: "min" },
  { group: "Readiness", label: "Work authorization", render: (c) => <WorkAuthTag auth={c.workAuthorization} short />, key: (c) => c.workAuthorization },
  { group: "Readiness", label: "Availability confirmed", render: (c) => `${relativeAgo(c.lastVerifiedAt)}`, value: (c) => -freshnessDays(c.lastVerifiedAt), best: "max" },
  { group: "Readiness", label: "Clearance", render: (c) => (c.clearance === "None" ? <span className="text-subtle">None</span> : c.clearance) },
  {
    group: "Capability",
    label: "Technical screen",
    render: (c) =>
      c.technicalScreenScore === null ? (
        <span className="text-subtle">Pending</span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="font-semibold">{c.technicalScreenScore}</span>
          <SegmentBar percent={c.technicalScreenScore} tone="brand" className="w-14" label={`Screen ${c.technicalScreenScore}`} />
        </span>
      ),
    value: (c) => c.technicalScreenScore ?? 0,
    best: "max",
  },
  { group: "Capability", label: "Experience", render: (c) => `${c.yearsExperience} years`, value: (c) => c.yearsExperience, best: "max" },
  {
    group: "Capability",
    label: "Primary stack",
    render: (c) => (
      <span className="flex flex-wrap gap-1">
        {c.skills.filter((s) => s.primary).map((s) => (
          <SkillChip key={s.skill} skill={s.skill} years={s.years} />
        ))}
      </span>
    ),
  },
  { group: "Capability", label: "Cloud", render: (c) => c.clouds.join(", "), key: (c) => c.clouds.join(",") },
  { group: "Capability", label: "Verified projects", render: (c) => c.architectureProjects.filter((p) => p.verified).length, value: (c) => c.architectureProjects.filter((p) => p.verified).length, best: "max" },
  { group: "Logistics", label: "Location", render: (c) => `${c.metro}, ${c.remote.toLowerCase()}`, key: (c) => `${c.metro}${c.remote}` },
];

const GROUPS = Array.from(new Set(ROWS.map((r) => r.group)));

/** Shortlisted profiles side by side. The best value in each comparable row is marked. */
export function ShortlistView() {
  const { shortlist, removeFromShortlist, lockFor, hydrated } = useWorkspace();
  const now = useDemoNow(30_000);
  const [open, setOpen] = useState<BlindCandidate | null>(null);
  const [locking, setLocking] = useState<BlindCandidate | null>(null);
  const list = shortlist.map((s) => s.candidate);
  const [show, setShow] = useState<"all" | "diff">("all");
  const rows = show === "diff" && list.length > 1 ? ROWS.filter((r) => differs(r, list)) : ROWS;
  const exportCsv = () => {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const text = (r: RowDef, c: BlindCandidate) => String(r.value ? r.value(c) : (r.key?.(c) ?? ""));
    const lines = [["", ...list.map((c) => c.code)].map(esc).join(","), ...ROWS.map((r) => [r.label, ...list.map((c) => text(r, c))].map(esc).join(","))];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    a.download = `shortlist-${list.length}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const header = (
    <PageHeader
      title="Shortlist"
        breadcrumb={[{ label: "Workspace", href: "/dashboard" }, { label: "Shortlist" }]}
      status={hydrated && list.length > 0 ? <Tag size="sm">{list.length} saved</Tag> : undefined}
      description="Compare saved profiles side by side, then hold the one you want to submit."
      actions={
        <Link href="/talent" className={buttonClass("secondary", "md")}>
          Browse talent
        </Link>
      }
    />
  );

  if (!hydrated)
    return (
      <>
        {header}
        <PageBody>
          <div className={`h-64 animate-pulse ${cardClass}`} />
        </PageBody>
      </>
    );

  if (!list.length)
    return (
      <>
        {header}
        <PageBody>
        <div className={cardClass}>
          <EmptyState
            icon={<IconBookmark size={16} />}
            title="Your shortlist is empty"
            description="Bookmark profiles in the inventory or from a job-spec match. They line up here side by side so you can pick who to submit."
            action={
              <Link href="/talent" className={buttonClass("primary", "md")}>
                Browse talent inventory
              </Link>
            }
            className="py-20"
          />
        </div>
        </PageBody>
      </>
    );

  const bestOf = (r: RowDef) => {
    if (!r.value || !r.best || list.length < 2) return null;
    const vals = list.map(r.value);
    const target = r.best === "min" ? Math.min(...vals) : Math.max(...vals);
    return vals.every((v) => v === target) ? null : target;
  };

  return (
    <>
      {header}
      <PageBody>
        <div className={cardClass}>
        <Toolbar
          summary={`${list.length} saved · ${rows.length} of ${ROWS.length} rows shown`}
          actions={
            <OverflowMenu label="Shortlist options">
              <MenuItem onSelect={exportCsv}>
                <IconExport size={16} />
                Export comparison as CSV
              </MenuItem>
            </OverflowMenu>
          }
        >
          <FilterMenu
            label="Rows"
            value={show}
            allValue="all"
            options={[
              { value: "all", label: "All rows" },
              { value: "diff", label: "Differences only" },
            ]}
            onChange={setShow}
          />
        </Toolbar>
        <div className="scroll-thin relative overflow-x-auto rounded-b-lg">
          <table className="w-full border-collapse text-left text-[13.5px]" style={{ minWidth: 200 + list.length * 250 }}>
            <caption className="sr-only">Shortlisted candidates compared</caption>
            <thead>
              <tr className="align-top">
                <th scope="col" className="sticky left-0 z-10 w-[188px] border-b border-hair bg-surface px-4 py-4 text-left text-[13px] font-normal text-ink-2 sm:pl-5">
                  <span className="block text-[13px] font-medium text-ink">
                    {list.length} candidate{list.length === 1 ? "" : "s"}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5">
                    <span className="grid size-4 place-items-center rounded-full bg-cobalt-wash text-cobalt">
                      <IconCheck size={10} strokeWidth={3} />
                    </span>
                    Best in row
                  </span>
                </th>
                {list.map((c) => {
                  const lock = lockFor(c.id);
                  const live = lock?.lockExpiresAt && new Date(lock.lockExpiresAt).getTime() > now;
                  return (
                    <th key={c.id} scope="col" className="min-w-[250px] border-b border-l border-hair px-4 py-4 font-normal">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <CandidateCode code={c.code} />
                          <button onClick={() => setOpen(c)} className="mt-0.5 block text-left text-[14.5px] leading-snug font-semibold text-ink transition-colors hover:text-cobalt">
                            {live ? lock!.revealedName : c.title}
                          </button>
                          {live && <p className="text-[13px] text-ink-2">{c.title}</p>}
                        </div>
                        <button
                          onClick={() => removeFromShortlist(c.id)}
                          className="-mt-1 -mr-1.5 grid size-8 shrink-0 place-items-center rounded-md text-ink-2 transition-colors hover:bg-canvas hover:text-ink"
                          aria-label={`Remove ${c.code} from shortlist`}
                        >
                          <IconX size={14} />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {live ? (
                          <Tag tone="blue" className="tnum gap-1">
                            <IconLock size={11} />
                            {formatCountdown(new Date(lock!.lockExpiresAt!).getTime() - now)} left
                          </Tag>
                        ) : (
                          <Button size="sm" variant="primary" onClick={() => setLocking(c)}>
                            <IconLock size={13} />
                            Hold
                          </Button>
                        )}
                        <Link href={`/one-sheet/${c.code}`} target="_blank" className={buttonClass("secondary", "sm")}>
                          <IconPrinter size={13} />
                          One-sheet
                        </Link>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            {GROUPS.filter((g) => rows.some((r) => r.group === g)).map((g) => (
              <tbody key={g}>
                <tr>
                  <th colSpan={list.length + 1} scope="colgroup" className="h-10 border-b border-hair bg-canvas px-4 text-left text-[13px] font-semibold text-ink sm:pl-5">
                    <span className="sticky left-4 sm:left-5">{g}</span>
                  </th>
                </tr>
                {rows.filter((r) => r.group === g).map((r) => {
                  const best = bestOf(r);
                  return (
                    <tr key={r.label}>
                      <th scope="row" className="sticky left-0 z-10 h-[52px] border-b border-hair bg-surface px-4 text-[13px] font-normal text-ink-2 sm:pl-5">
                        {r.label}
                      </th>
                      {list.map((c) => {
                        const isBest = best !== null && r.value!(c) === best;
                        return (
                          <td key={c.id} className={cn("tnum h-[52px] border-b border-l border-hair px-4 text-[14px] text-ink", isBest && "bg-cobalt-wash")}>
                            <span className="flex items-center gap-1.5">
                              {r.render(c)}
                              {isBest && <IconCheck size={13} strokeWidth={2.5} className="shrink-0 text-cobalt" aria-label="Best in row" />}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
        </div>
      </PageBody>
      <CandidateSheet c={open} open={!!open} onOpenChange={(o) => !o && setOpen(null)} />
      {locking && <LockDialog c={locking} open onOpenChange={(o) => !o && setLocking(null)} />}
    </>
  );
}
