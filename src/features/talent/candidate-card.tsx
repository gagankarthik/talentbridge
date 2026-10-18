"use client";

import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import type { ScoredCandidate } from "@/lib/query";
import { useWorkspace } from "@/lib/workspace-store";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { CandidateCode, SkillChip, Tag, WorkAuthTag } from "@/components/ui/status";
import { AvailabilityText } from "@/components/ui/status-text";
import { IconBookmark, IconBookmarkFilled, IconCloud, IconGlobe, IconLock, IconShield } from "@/components/icons";

/** Technical screen score: the figure, then a thin blue bar out of 100. */
export function ScoreBar({ score, className }: { score: number | null; className?: string }) {
  if (score === null) return <span className="text-[13px] text-subtle">Not screened</span>;
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} title="Technical screen score out of 100">
      <span className="tnum w-[22px] text-[14px] font-semibold text-ink">{score}</span>
      <span role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label={`Screen score ${score} of 100`} className="h-1 w-12 overflow-hidden rounded-full bg-[#e6eaf0]">
        <span className="block h-full rounded-full bg-cobalt" style={{ width: `${score}%` }} />
      </span>
    </span>
  );
}

export function ShortlistToggle({ c, className }: { c: ScoredCandidate; className?: string }) {
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
        "grid size-11 shrink-0 place-items-center rounded-md transition-colors duration-150 sm:size-8",
        on ? "bg-cobalt-wash text-cobalt" : "text-ink-2 hover:bg-canvas hover:text-ink",
        className,
      )}
    >
      {on ? <IconBookmarkFilled size={15} /> : <IconBookmark size={15} />}
    </button>
  );
}

/** Blind candidate card. The whole card opens the profile; the bookmark is a separate target. */
export function CandidateCard({ c, onOpen, rateBasis }: { c: ScoredCandidate; onOpen: () => void; rateBasis: "c2c" | "w2" }) {
  const { lockFor } = useWorkspace();
  const lock = lockFor(c.id);
  const verifiedProjects = c.architectureProjects.filter((p) => p.verified).length;
  const rate = rateBasis === "c2c" ? c.rateC2C : c.rateW2;

  return (
    <article className="group relative flex flex-col rounded-lg border border-hair bg-surface transition-colors duration-150 hover:border-line-strong">
      <div className="flex items-start gap-3 px-4 pt-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CandidateCode code={c.code} />
            <span aria-hidden="true" className="h-2.5 w-12 rounded-[2px] bg-ink/85" title="Name withheld" />
            {lock && (
              <Tag tone="blue" size="sm" className="gap-1">
                <IconLock size={11} />
                Held
              </Tag>
            )}
          </div>
          <h3 className="mt-1.5 truncate text-[15px] font-semibold tracking-[-0.01em] text-ink">
            <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none">
              {c.title}
            </button>
          </h3>
          <p className="tnum mt-0.5 text-[13px] text-ink-2">
            {c.yearsExperience} yrs · {c.discipline === "DevOps / Cloud" ? "Cloud & DevOps" : c.discipline}
          </p>
        </div>
        <div className="text-right">
          <p className="tnum text-[18px] leading-tight font-semibold tracking-[-0.01em] text-ink">{usd.format(rate)}</p>
          <p className="text-[12px] text-ink-2">per hour {rateBasis === "c2c" ? "C2C" : "W2"}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 px-4 pt-3">
        <WorkAuthTag auth={c.workAuthorization} visaExpiry={c.compliance.visaExpiry} />
        <AvailabilityText c={c} />
        {c.clearance !== "None" && (
          <Tag tone="slate" className="gap-1">
            <IconShield size={11} />
            {c.clearance}
          </Tag>
        )}
      </div>

      <div className="flex flex-wrap gap-1 px-4 pt-3">
        {c.skills.slice(0, 5).map((s) => (
          <SkillChip key={s.skill} skill={s.skill} years={s.years} strong={s.primary} />
        ))}
        {c.skills.length > 5 && <Tag size="sm">+{c.skills.length - 5}</Tag>}
      </div>

      <div className="flex items-center gap-4 px-4 pt-3 text-[13px] text-ink-2">
        <span className="inline-flex items-center gap-1">
          <IconCloud size={13} />
          {c.clouds.join(", ")}
        </span>
        <span className="inline-flex items-center gap-1">
          <IconGlobe size={13} />
          {c.timezone}, {c.remote}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-hair px-4 py-2.5">
        <ScoreBar score={c.technicalScreenScore} />
        <span className="hidden text-[13px] text-ink-2 sm:inline">
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
