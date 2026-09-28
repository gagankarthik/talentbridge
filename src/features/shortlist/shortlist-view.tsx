"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoNow } from "@/lib/clock";
import { cn } from "@/lib/cn";
import { availabilityOf, formatCountdown, usd } from "@/lib/format";
import type { BlindCandidate } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { Button, buttonClass } from "@/components/ui/button";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { AvailabilityPill, CandidateCode, SkillChip, WorkAuthTag } from "@/components/ui/status";
import { EmptyShortlistIllustration } from "@/components/illustrations";
import { IconCheck, IconLock, IconPrinter, IconX } from "@/components/icons";
import { CandidateSheet } from "@/features/talent/candidate-sheet";
import { LockDialog } from "@/features/talent/lock-dialog";

type Best = "min" | "max" | null;

interface RowDef {
  label: string;
  render: (c: BlindCandidate) => React.ReactNode;
  value?: (c: BlindCandidate) => number;
  best?: Best;
}

const ROWS: RowDef[] = [
  { label: "C2C rate", render: (c) => `${usd.format(c.rateC2C)}/hr`, value: (c) => c.rateC2C, best: "min" },
  { label: "W2 rate", render: (c) => `${usd.format(c.rateW2)}/hr`, value: (c) => c.rateW2, best: "min" },
  { label: "Availability", render: (c) => <AvailabilityPill c={c} />, value: (c) => availabilityOf(c).sortKey, best: "min" },
  { label: "Technical screen", render: (c) => (c.technicalScreenScore === null ? "Pending" : `${c.technicalScreenScore}/100`), value: (c) => c.technicalScreenScore ?? 0, best: "max" },
  { label: "Experience", render: (c) => `${c.yearsExperience} years`, value: (c) => c.yearsExperience, best: "max" },
  { label: "Work authorization", render: (c) => <WorkAuthTag auth={c.workAuthorization} short /> },
  {
    label: "Primary stack",
    render: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.skills.filter((s) => s.primary).map((s) => (
          <SkillChip key={s.skill} skill={s.skill} years={s.years} />
        ))}
      </div>
    ),
  },
  { label: "Cloud", render: (c) => c.clouds.join(", ") },
  { label: "Clearance", render: (c) => (c.clearance === "None" ? <span className="text-subtle">None</span> : c.clearance) },
  { label: "Location", render: (c) => `${c.metro}, ${c.remote.toLowerCase()}` },
  { label: "Verified projects", render: (c) => c.architectureProjects.filter((p) => p.verified).length, value: (c) => c.architectureProjects.filter((p) => p.verified).length, best: "max" },
  { label: "Freshness", render: (c) => <FreshnessMeter lastVerifiedAt={c.lastVerifiedAt} /> },
];

export function ShortlistView() {
  const { shortlist, removeFromShortlist, lockFor, hydrated } = useWorkspace();
  const now = useDemoNow(30_000);
  const [open, setOpen] = useState<BlindCandidate | null>(null);
  const [locking, setLocking] = useState<BlindCandidate | null>(null);
  const list = shortlist.map((s) => s.candidate);

  if (!hydrated) return <div className="m-8 h-64 animate-pulse rounded-panel bg-surface ring-1 ring-line" />;

  if (!list.length)
    return (
      <div className="mx-4 my-8 bg-surface flex flex-col items-center rounded-sheet px-6 py-16 text-center ring-1 ring-line sm:mx-8">
        <EmptyShortlistIllustration className="h-32 w-auto" />
        <p className="mt-5 text-[17px] font-semibold">Your shortlist is empty</p>
        <p className="mt-1 max-w-md text-sm text-muted">Bookmark candidates in the inventory or from a job-spec match. They line up here side by side so you can pick who to submit.</p>
        <Link href="/talent" className={buttonClass("dark", "md", "mt-6")}>
          Browse talent inventory
        </Link>
      </div>
    );

  const bestOf = (r: RowDef) => {
    if (!r.value || !r.best || list.length < 2) return null;
    const vals = list.map(r.value);
    const target = r.best === "min" ? Math.min(...vals) : Math.max(...vals);
    return vals.every((v) => v === target) ? null : target;
  };

  return (
    <div className="px-4 py-6 sm:px-8">
      <div className="overflow-x-auto rounded-panel bg-surface ring-1 ring-line">
        <table className="w-full border-collapse text-left text-[13px]" style={{ minWidth: 200 + list.length * 240 }}>
          <thead>
            <tr className="border-b border-line align-top">
              <th scope="col" className="sticky left-0 z-10 w-[180px] bg-surface px-4 py-4 text-xs font-medium text-subtle">
                {list.length} candidate{list.length === 1 ? "" : "s"}
                <span className="mt-1 block font-normal">Best value in each row is marked.</span>
              </th>
              {list.map((c) => {
                const lock = lockFor(c.id);
                const live = lock?.lockExpiresAt && new Date(lock.lockExpiresAt).getTime() > now;
                return (
                  <th key={c.id} scope="col" className="min-w-[240px] border-l border-line px-4 py-4 font-normal">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CandidateCode code={c.code} />
                        <button onClick={() => setOpen(c)} className="mt-0.5 block text-left text-[14px] font-semibold text-ink hover:text-cobalt">
                          {live ? lock!.revealedName : c.title}
                        </button>
                        {live && <p className="text-xs text-subtle">{c.title}</p>}
                      </div>
                      <button onClick={() => removeFromShortlist(c.id)} className="rounded p-1 text-faint hover:bg-placed-bg hover:text-ink" aria-label={`Remove ${c.code}`}>
                        <IconX size={15} />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {live ? (
                        <span className="tnum inline-flex h-7 items-center gap-1.5 rounded-ctl bg-cobalt-wash px-2.5 text-xs font-medium text-cobalt-strong">
                          <IconLock size={13} />
                          {formatCountdown(new Date(lock!.lockExpiresAt!).getTime() - now)}
                        </span>
                      ) : (
                        <Button size="sm" variant="primary" onClick={() => setLocking(c)}>
                          <IconLock size={13} />
                          Lock
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
          <tbody>
            {ROWS.map((r) => {
              const best = bestOf(r);
              return (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="sticky left-0 z-10 bg-surface px-4 py-3 text-xs font-medium text-subtle">
                    {r.label}
                  </th>
                  {list.map((c) => {
                    const isBest = best !== null && r.value!(c) === best;
                    return (
                      <td key={c.id} className={cn("tnum border-l border-line px-4 py-3 text-ink", isBest && "bg-avail-bg/60")}>
                        <span className="flex items-center gap-1.5">
                          {r.render(c)}
                          {isBest && <IconCheck size={13} strokeWidth={2.25} className="shrink-0 text-avail-ink" aria-label="Best in row" />}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CandidateSheet c={open} open={!!open} onOpenChange={(o) => !o && setOpen(null)} />
      {locking && <LockDialog c={locking} open onOpenChange={(o) => !o && setLocking(null)} />}
    </div>
  );
}
