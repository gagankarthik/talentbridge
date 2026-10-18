"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoNow } from "@/lib/clock";
import { cn } from "@/lib/cn";
import { formatCountdown, fmtDate, relativeAgo, usd, WORK_AUTH_LABEL } from "@/lib/format";
import type { BlindCandidate } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { Sheet } from "@/components/ui/overlay";
import { Button, buttonClass } from "@/components/ui/button";
import { DetailSection, SegmentBar } from "@/components/ui/data-display";
import { CandidateCode, SkillChip, Tag, WorkAuthTag } from "@/components/ui/status";
import { AvailabilityText, StatusText } from "@/components/ui/status-text";
import { IconBookmark, IconBookmarkFilled, IconCheck, IconClock, IconEyeOff, IconId, IconLock, IconPrinter } from "@/components/icons";
import { LockDialog } from "./lock-dialog";

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-3 py-2">
      <dt className="text-[13px] text-ink-2">{k}</dt>
      <dd className="min-w-0 text-[14px] text-ink">{children}</dd>
    </div>
  );
}

/** A blind profile in the right sheet: identity, a figures strip, then readiness, screen, stack, projects and compliance. */
export function CandidateSheet({ c, open, onOpenChange }: { c: BlindCandidate | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { isShortlisted, toggleShortlist, lockFor } = useWorkspace();
  const [lockOpen, setLockOpen] = useState(false);
  const now = useDemoNow(30_000);
  if (!c) return null;
  const lock = lockFor(c.id);
  const lockLive = lock?.lockExpiresAt && new Date(lock.lockExpiresAt).getTime() > now;
  const saved = isShortlisted(c.id);
  const maxYears = Math.max(...c.skills.map((s) => s.years));

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={onOpenChange}
        width="max-w-[640px]"
        icon={<IconId size={15} />}
        title={`Profile ${c.code}`}
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <Link href={`/one-sheet/${c.code}`} target="_blank" className={buttonClass("ghost", "md")}>
              <IconPrinter size={15} />
              One-sheet
            </Link>
            <div className="flex gap-2">
              <Button onClick={() => toggleShortlist(c)} aria-pressed={saved}>
                {saved ? <IconBookmarkFilled size={15} className="text-cobalt" /> : <IconBookmark size={15} />}
                {saved ? "Shortlisted" : "Shortlist"}
              </Button>
              {lockLive ? (
                <Link href="/requests" className={buttonClass("secondary")}>
                  <IconClock size={15} />
                  {formatCountdown(new Date(lock!.lockExpiresAt!).getTime() - now)} left
                </Link>
              ) : (
                <Button variant="primary" onClick={() => setLockOpen(true)}>
                  <IconLock size={15} />
                  Place 48-hour hold
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* Identity */}
        <div className="px-6 pt-5 pb-5 shadow-[inset_0_-1px_0_var(--color-hair)]">
          <div className="flex items-start gap-4">
            <span aria-hidden="true" className="tnum grid size-12 shrink-0 place-items-center rounded-lg border border-hair bg-canvas text-[13px] font-semibold text-ink-2">
              {c.code.split("-")[1]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CandidateCode code={c.code} />
                {lockLive ? (
                  <Tag tone="blue" dot size="sm">
                    {lock!.revealedName}
                  </Tag>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-2">
                    <span aria-hidden="true" className="h-2.5 w-14 rounded-[2px] bg-ink/85" />
                    <IconEyeOff size={13} />
                    Name hidden until hold
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-[20px] leading-tight font-semibold tracking-[-0.01em] text-balance text-ink">{c.title}</h2>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <AvailabilityText c={c} />
                <WorkAuthTag auth={c.workAuthorization} short />
                {c.clearance !== "None" && <Tag tone="slate">{c.clearance}</Tag>}
              </div>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["C2C rate", `${usd.format(c.rateC2C)}/hr`],
              ["W2 rate", `${usd.format(c.rateW2)}/hr`],
              ["Screen", c.technicalScreenScore === null ? "Pending" : `${c.technicalScreenScore}/100`],
              ["Experience", `${c.yearsExperience} years`],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1.5 rounded-md border border-hair px-3 py-2.5">
                <dt className="text-[13px] text-ink-2">{k}</dt>
                <dd className="tnum text-[16px] font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <DetailSection title="Placement readiness">
          <dl>
            <Row k="Availability">
              <span className="flex flex-wrap items-center gap-3">
                <AvailabilityText c={c} />
                <span className="text-[13px] text-ink-2">Confirmed {relativeAgo(c.lastVerifiedAt)}</span>
              </span>
            </Row>
            <Row k="Work authorization">
              <span className="flex flex-wrap items-center gap-2">
                <WorkAuthTag auth={c.workAuthorization} />
                {c.compliance.visaExpiry && <span className="tnum text-[13px] text-ink-2">Valid to {fmtDate(c.compliance.visaExpiry)}</span>}
              </span>
            </Row>
            <Row k="Location">
              {c.metro} ({c.timezone}), {c.remote.toLowerCase()}
            </Row>
            <Row k="Cloud">{c.clouds.join(", ")}</Row>
            <Row k="Industries">{c.domains.join(", ")}</Row>
          </dl>
        </DetailSection>

        {c.screenBreakdown && (
          <DetailSection title="Technical screen" description="90-minute live panel with a senior engineer in the same discipline.">
            <div className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {(
                [
                  ["System design", c.screenBreakdown.systemDesign],
                  ["Hands-on coding", c.screenBreakdown.coding],
                  ["Domain depth", c.screenBreakdown.domain],
                  ["Communication", c.screenBreakdown.communication],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <p className="flex justify-between text-[13px]">
                    <span className="text-ink-2">{k}</span>
                    <span className="tnum font-semibold text-ink">{v}</span>
                  </p>
                  <SegmentBar percent={v} tone="brand" label={`${k} ${v} of 100`} className="mt-1.5" />
                </div>
              ))}
            </div>
          </DetailSection>
        )}

        <DetailSection title="Stack depth">
          <ul className="space-y-2">
            {c.skills.map((s) => (
              <li key={s.skill} className="grid grid-cols-[132px_1fr_36px] items-center gap-3 text-[13px]">
                <span className={cn("truncate", s.primary ? "font-medium text-ink" : "text-ink-2")}>{s.skill}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-[#e6eaf0]">
                  <span className={cn("block h-full rounded-full", s.primary ? "bg-cobalt" : "bg-[#b4c8f6]")} style={{ width: `${(s.years / maxYears) * 100}%` }} />
                </span>
                <span className="tnum text-right text-ink-2">{s.years}y</span>
              </li>
            ))}
          </ul>
          {c.certifications.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-1" aria-label="Certifications">
              {c.certifications.map((x) => (
                <SkillChip key={x} skill={x} />
              ))}
            </p>
          )}
        </DetailSection>

        <DetailSection title="Architecture projects">
          <ul className="space-y-2">
            {c.architectureProjects.map((p) => (
              <li key={p.name} className="rounded-md border border-hair p-3.5">
                <p className="flex items-start justify-between gap-3">
                  <span className="text-[13.5px] font-medium text-ink">{p.name}</span>
                  {p.verified ? (
                    <StatusText tone="success">Reference verified</StatusText>
                  ) : (
                    <StatusText tone="neutral">Self-reported</StatusText>
                  )}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{p.summary}</p>
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection title="Compliance record">
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {[
              [`${WORK_AUTH_LABEL[c.workAuthorization]} verified`, c.compliance.workAuthVerified],
              ["Form I-9 complete", c.compliance.i9Complete],
              ["Background check cleared", c.compliance.backgroundCheck === "Cleared"],
              [`${c.compliance.referencesCompleted} of ${c.compliance.referencesRequired} references`, c.compliance.referencesCompleted >= c.compliance.referencesRequired],
              ["Consultant NDA signed", c.compliance.ndaSigned],
            ].map(([label, ok]) => (
              <li key={label as string} className="flex items-center gap-2 py-1.5 text-[13px] text-ink">
                <span className={cn("grid size-4 shrink-0 place-items-center rounded-full", ok ? "bg-[#e9f6ef] text-[#1a7f4b]" : "bg-[#fdf3e1] text-[#9a5b00]")}>
                  {ok ? <IconCheck size={10} strokeWidth={3} /> : <span className="text-[10px] font-bold">…</span>}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </DetailSection>
      </Sheet>
      {lockOpen && <LockDialog c={c} open={lockOpen} onOpenChange={setLockOpen} />}
    </>
  );
}
