"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemoNow } from "@/lib/clock";
import { cn } from "@/lib/cn";
import { formatCountdown, fmtDate, usd, WORK_AUTH_LABEL } from "@/lib/format";
import type { BlindCandidate } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { Sheet } from "@/components/ui/overlay";
import { Button, buttonClass } from "@/components/ui/button";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { AvailabilityPill, CandidateCode, WorkAuthTag } from "@/components/ui/status";
import { IconBookmark, IconBookmarkFilled, IconCheck, IconClock, IconEyeOff, IconLock, IconPrinter } from "@/components/icons";
import { LockDialog } from "./lock-dialog";

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-2">
      <dt className="text-[13px] text-subtle">{k}</dt>
      <dd className="text-[13px] text-ink">{children}</dd>
    </div>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[13px] font-semibold text-ink">{children}</h3>;
}

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
        title={
          <span className="flex items-center gap-2.5">
            <CandidateCode code={c.code} className="text-[14px]" />
            {lockLive ? (
              <span className="text-ink">{lock!.revealedName}</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-normal text-subtle">
                <IconEyeOff size={14} />
                Name hidden until lock
              </span>
            )}
          </span>
        }
        description={`${c.title}, ${c.yearsExperience} years`}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link href={`/one-sheet/${c.code}`} target="_blank" className={buttonClass("ghost", "md")}>
              <IconPrinter size={16} />
              One-sheet
            </Link>
            <div className="flex gap-2">
              <Button onClick={() => toggleShortlist(c)} aria-pressed={saved}>
                {saved ? <IconBookmarkFilled size={16} className="text-cobalt" /> : <IconBookmark size={16} />}
                {saved ? "Shortlisted" : "Add to shortlist"}
              </Button>
              {lockLive ? (
                <Link href="/requests" className={buttonClass("secondary")}>
                  <IconClock size={16} />
                  {formatCountdown(new Date(lock!.lockExpiresAt!).getTime() - now)} left
                </Link>
              ) : (
                <Button variant="primary" onClick={() => setLockOpen(true)}>
                  <IconLock size={16} />
                  Place 48-hour lock
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* Summary strip */}
        <div className="grid grid-cols-2 border-b border-line sm:grid-cols-4">
          {[
            ["C2C rate", `${usd.format(c.rateC2C)}/hr`],
            ["W2 rate", `${usd.format(c.rateW2)}/hr`],
            ["Screen score", c.technicalScreenScore === null ? "Pending" : `${c.technicalScreenScore}/100`],
            ["Experience", `${c.yearsExperience} years`],
          ].map(([k, v], i) => (
            <div key={k} className={cn("px-6 py-4", i > 0 && "sm:border-l sm:border-line", i % 2 === 1 && "border-l border-line")}>
              <p className="text-xs text-subtle">{k}</p>
              <p className="tnum mt-1 text-[17px] font-semibold tracking-[-0.01em]">{v}</p>
            </div>
          ))}
        </div>

        <div className="space-y-7 px-6 py-6">
          <section>
            <H>Placement readiness</H>
            <dl className="mt-2 divide-y divide-line">
              <Row k="Availability">
                <span className="flex flex-wrap items-center gap-2">
                  <AvailabilityPill c={c} />
                  <FreshnessMeter lastVerifiedAt={c.lastVerifiedAt} />
                </span>
              </Row>
              <Row k="Work authorization">
                <span className="flex flex-wrap items-center gap-2">
                  <WorkAuthTag auth={c.workAuthorization} />
                  {c.compliance.visaExpiry && <span className="tnum text-xs text-subtle">Valid to {fmtDate(c.compliance.visaExpiry)}</span>}
                </span>
              </Row>
              <Row k="Clearance">{c.clearance === "None" ? "None held" : c.clearance}</Row>
              <Row k="Location">
                {c.metro} ({c.timezone}), {c.remote.toLowerCase()}
              </Row>
              <Row k="Cloud">{c.clouds.join(", ")}</Row>
            </dl>
          </section>

          {c.screenBreakdown && (
            <section>
              <H>Technical screen</H>
              <p className="mt-0.5 text-xs text-subtle">90-minute live panel with a senior engineer in the same discipline.</p>
              <div className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
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
                      <span className="text-muted">{k}</span>
                      <span className="tnum font-semibold">{v}</span>
                    </p>
                    <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-line">
                      <span className="block h-full rounded-full bg-ink-2" style={{ width: `${v}%` }} />
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <H>Stack depth</H>
            <ul className="mt-3 space-y-2">
              {c.skills.map((s) => (
                <li key={s.skill} className="grid grid-cols-[130px_1fr_40px] items-center gap-3 text-[13px]">
                  <span className={cn("truncate", s.primary ? "font-medium text-ink" : "text-muted")}>{s.skill}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-line">
                    <span className={cn("block h-full rounded-full", s.primary ? "bg-cobalt" : "bg-line-strong")} style={{ width: `${(s.years / maxYears) * 100}%` }} />
                  </span>
                  <span className="tnum text-right text-subtle">{s.years}y</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <H>Architecture projects</H>
            <ul className="mt-3 space-y-3">
              {c.architectureProjects.map((p) => (
                <li key={p.name} className="rounded-panel p-4 ring-1 ring-line">
                  <p className="flex items-start justify-between gap-3">
                    <span className="text-[14px] font-medium">{p.name}</span>
                    {p.verified ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-avail-ink">
                        <IconCheck size={13} strokeWidth={2.25} />
                        Reference verified
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-subtle">Self-reported</span>
                    )}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{p.summary}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <H>Certifications</H>
              {c.certifications.length ? (
                <ul className="mt-2 space-y-1 text-[13px] text-ink-2">
                  {c.certifications.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[13px] text-subtle">None listed</p>
              )}
            </div>
            <div>
              <H>Industry experience</H>
              <p className="mt-2 text-[13px] text-ink-2">{c.domains.join(", ")}</p>
            </div>
          </section>

          <section>
            <H>Compliance record</H>
            <ul className="mt-2 grid gap-x-6 sm:grid-cols-2">
              {[
                [`${WORK_AUTH_LABEL[c.workAuthorization]} verified`, c.compliance.workAuthVerified],
                ["Form I-9 complete", c.compliance.i9Complete],
                ["Background check cleared", c.compliance.backgroundCheck === "Cleared"],
                [`${c.compliance.referencesCompleted} of ${c.compliance.referencesRequired} references`, c.compliance.referencesCompleted >= c.compliance.referencesRequired],
                ["Consultant NDA signed", c.compliance.ndaSigned],
              ].map(([label, ok]) => (
                <li key={label as string} className="flex items-center gap-2 border-b border-line py-2 text-[13px]">
                  <span className={cn("grid size-4 place-items-center rounded-full", ok ? "bg-avail-bg text-avail-ink" : "bg-notice-bg text-notice-ink")}>
                    {ok ? <IconCheck size={10} strokeWidth={3} /> : <span className="text-[10px] font-bold">…</span>}
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Sheet>
      {lockOpen && <LockDialog c={c} open={lockOpen} onOpenChange={setLockOpen} />}
    </>
  );
}
