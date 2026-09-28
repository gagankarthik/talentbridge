"use client";

import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import type { ScoredCandidate } from "@/lib/query";
import { useWorkspace } from "@/lib/workspace-store";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { AvailabilityPill, CandidateCode, SkillChip, WorkAuthTag } from "@/components/ui/status";
import { IconBookmark, IconBookmarkFilled, IconCloud, IconGlobe, IconLock, IconShield } from "@/components/icons";

export function ScoreBar({ score, className }: { score: number | null; className?: string }) {
  if (score === null) return <span className="text-xs text-faint">Not screened</span>;
  return (
    <span className={cn("inline-flex items-center gap-2", className)} title="Technical screen score out of 100">
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-line">
        <span className="block h-full rounded-full bg-ink-2" style={{ width: `${score}%` }} />
      </span>
      <span className="tnum text-[13px] font-semibold text-ink">{score}</span>
    </span>
  );
}

function ShortlistToggle({ c }: { c: ScoredCandidate }) {
  const { isShortlisted, toggleShortlist } = useWorkspace();
  const on = isShortlisted(c.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleShortlist(c);
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${c.code} from shortlist` : `Add ${c.code} to shortlist`}
      className={cn(
        "grid size-8 place-items-center rounded-ctl ring-1 ring-inset transition-colors",
        on ? "bg-cobalt-wash text-cobalt ring-cobalt/30" : "text-subtle ring-line hover:text-ink hover:ring-line-strong",
      )}
    >
      {on ? <IconBookmarkFilled size={16} /> : <IconBookmark size={16} />}
    </button>
  );
}

/** Blind candidate card (PRD §5.2). Whole card opens the profile; bookmark is a separate target. */
export function CandidateCard({ c, onOpen, rateBasis }: { c: ScoredCandidate; onOpen: () => void; rateBasis: "c2c" | "w2" }) {
  const { lockFor } = useWorkspace();
  const lock = lockFor(c.id);
  const verifiedProjects = c.architectureProjects.filter((p) => p.verified).length;
  const rate = rateBasis === "c2c" ? c.rateC2C : c.rateW2;

  return (
    <article
      className="group relative flex flex-col rounded-panel bg-surface ring-1 ring-line transition-shadow hover:ring-line-strong hover:shadow-[0_4px_16px_-8px_rgb(15_23_42/0.18)]"
    >
      <div className="flex items-start gap-3 px-4 pt-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CandidateCode code={c.code} />
            {lock && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-cobalt" title="You hold a lock on this candidate">
                <IconLock size={12} />
                Locked
              </span>
            )}
          </div>
          <h3 className="mt-1 truncate text-[15px] font-semibold tracking-[-0.01em] text-ink">
            <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 after:rounded-panel focus-visible:outline-none">
              {c.title}
            </button>
          </h3>
          <p className="tnum mt-0.5 text-[13px] text-subtle">
            {c.yearsExperience} yrs, {c.discipline}
          </p>
        </div>
        <div className="text-right">
          <p className="tnum text-[18px] leading-tight font-semibold tracking-[-0.01em] text-ink">{usd.format(rate)}</p>
          <p className="text-xs text-subtle">per hour {rateBasis === "c2c" ? "C2C" : "W2"}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 px-4 pt-3">
        <WorkAuthTag auth={c.workAuthorization} visaExpiry={c.compliance.visaExpiry} />
        <AvailabilityPill c={c} />
        {c.clearance !== "None" && (
          <span className="inline-flex h-[22px] items-center gap-1 rounded-[5px] bg-ink px-1.5 text-xs font-medium text-white">
            <IconShield size={12} />
            {c.clearance}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 px-4 pt-3">
        {c.skills.slice(0, 5).map((s) => (
          <SkillChip key={s.skill} skill={s.skill} years={s.years} strong={s.primary} />
        ))}
        {c.skills.length > 5 && <span className="self-center px-1 text-xs text-subtle">+{c.skills.length - 5}</span>}
      </div>

      <div className="flex items-center gap-4 px-4 pt-3 text-xs text-subtle">
        <span className="inline-flex items-center gap-1">
          <IconCloud size={14} />
          {c.clouds.join(", ")}
        </span>
        <span className="inline-flex items-center gap-1">
          <IconGlobe size={14} />
          {c.timezone}, {c.remote}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-line px-4 py-2.5">
        <ScoreBar score={c.technicalScreenScore} />
        <span className="text-xs text-subtle">
          {verifiedProjects} verified project{verifiedProjects === 1 ? "" : "s"}
        </span>
        <FreshnessMeter lastVerifiedAt={c.lastVerifiedAt} compact className="ml-auto" />
        <span className="relative z-10">
          <ShortlistToggle c={c} />
        </span>
      </div>
    </article>
  );
}

export function CandidateTable({ rows, onOpen, rateBasis }: { rows: ScoredCandidate[]; onOpen: (c: ScoredCandidate) => void; rateBasis: "c2c" | "w2" }) {
  return (
    <div className="overflow-x-auto rounded-panel bg-surface ring-1 ring-line">
      <table className="w-full min-w-[980px] text-left text-[13px]">
        <thead className="border-b border-line bg-canvas text-xs text-subtle">
          <tr>
            <th className="py-2.5 pl-4 font-medium">Candidate</th>
            <th className="py-2.5 font-medium">Core stack</th>
            <th className="py-2.5 font-medium">Work auth</th>
            <th className="py-2.5 font-medium">Available</th>
            <th className="py-2.5 text-right font-medium">Rate {rateBasis === "c2c" ? "C2C" : "W2"}</th>
            <th className="py-2.5 pl-6 font-medium">Screen</th>
            <th className="py-2.5 font-medium">Freshness</th>
            <th className="py-2.5 pr-4" />
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} onClick={() => onOpen(c)} className="cursor-pointer border-b border-line last:border-0 hover:bg-canvas">
              <td className="py-3 pl-4">
                <CandidateCode code={c.code} />
                <button type="button" onClick={() => onOpen(c)} className="block max-w-[240px] truncate text-left font-medium text-ink">
                  {c.title}
                </button>
                <span className="tnum text-xs text-subtle">
                  {c.yearsExperience} yrs, {c.timezone}
                </span>
              </td>
              <td className="py-3">
                <div className="flex max-w-[260px] flex-wrap gap-1">
                  {c.skills.filter((s) => s.primary).map((s) => (
                    <SkillChip key={s.skill} skill={s.skill} years={s.years} />
                  ))}
                </div>
              </td>
              <td className="py-3">
                <WorkAuthTag auth={c.workAuthorization} short />
              </td>
              <td className="py-3">
                <AvailabilityPill c={c} />
              </td>
              <td className="tnum py-3 text-right font-semibold">{usd.format(rateBasis === "c2c" ? c.rateC2C : c.rateW2)}</td>
              <td className="py-3 pl-6">
                <ScoreBar score={c.technicalScreenScore} />
              </td>
              <td className="py-3">
                <FreshnessMeter lastVerifiedAt={c.lastVerifiedAt} compact />
              </td>
              <td className="py-3 pr-4 text-right">
                <ShortlistToggle c={c} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
