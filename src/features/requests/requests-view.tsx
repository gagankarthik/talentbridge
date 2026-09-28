"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Link from "next/link";
import { useState } from "react";
import { useDemoNow } from "@/lib/clock";
import { cn } from "@/lib/cn";
import { fmtDateTime, formatCountdown, LOCK_HOURS, relativeAgo, usd } from "@/lib/format";
import type { EngagementStatus } from "@/lib/types";
import { useWorkspace, type MyRequest } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/overlay";
import { CandidateCode, EngagementPill } from "@/components/ui/status";
import { EmptyRequestsIllustration } from "@/components/illustrations";
import { IconPrinter } from "@/components/icons";

export interface RequestRow extends MyRequest {
  /** Created in this browser session (can be released). */
  mine?: boolean;
}

const TABS: { value: string; label: string; match: (r: RequestRow, now: number) => boolean }[] = [
  { value: "all", label: "All", match: () => true },
  { value: "locked", label: "Active locks", match: (r, now) => !!r.lockExpiresAt && new Date(r.lockExpiresAt).getTime() > now },
  { value: "interview", label: "Interviewing", match: (r) => r.status === "INTERVIEWING" || r.status === "OFFERED" },
  { value: "closed", label: "Active and closed", match: (r) => r.status === "ACTIVE" || r.status === "COMPLETED" },
];

function LockCell({ r, now }: { r: RequestRow; now: number }) {
  if (!r.lockExpiresAt) return <span className="text-xs text-faint">No lock</span>;
  const left = new Date(r.lockExpiresAt).getTime() - now;
  if (left <= 0) return <span className="text-xs text-subtle">Expired {relativeAgo(r.lockExpiresAt, now)}</span>;
  const pct = left / (LOCK_HOURS * 3_600_000);
  return (
    <span className="flex items-center gap-2.5" title={`Expires ${fmtDateTime(r.lockExpiresAt)}`}>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
        <span className={cn("block h-full rounded-full", pct < 0.15 ? "bg-notice" : "bg-cobalt")} style={{ width: `${Math.min(100, pct * 100)}%` }} />
      </span>
      <span className={cn("tnum text-[13px] font-medium", pct < 0.15 ? "text-notice-ink" : "text-ink")}>{formatCountdown(left)}</span>
    </span>
  );
}

export function RequestsView({ seeded }: { seeded: RequestRow[] }) {
  const { myRequests, releaseRequest, notify } = useWorkspace();
  const now = useDemoNow(15_000);
  const [tab, setTab] = useState("all");
  const [releasing, setReleasing] = useState<RequestRow | null>(null);

  const rows: RequestRow[] = [...myRequests.map((r) => ({ ...r, mine: true })), ...seeded];
  const submitted = rows.filter((r) => r.status !== "DRAFT");
  const reachedInterview = submitted.filter((r) => (["INTERVIEWING", "OFFERED", "ACTIVE", "COMPLETED"] as EngagementStatus[]).includes(r.status));
  const conversion = submitted.length ? Math.round((reachedInterview.length / submitted.length) * 100) : 0;
  const activeLocks = rows.filter((r) => TABS[1].match(r, now)).length;
  const expiringSoon = rows.filter((r) => r.lockExpiresAt && new Date(r.lockExpiresAt).getTime() - now > 0 && new Date(r.lockExpiresAt).getTime() - now < 6 * 3_600_000).length;

  return (
    <div className="px-4 py-6 sm:px-8">
      <dl className="grid overflow-hidden rounded-panel bg-surface ring-1 ring-line sm:grid-cols-4">
        {[
          { k: "Active locks", v: activeLocks, note: expiringSoon ? `${expiringSoon} expire within 6 hours` : "None expiring soon", warn: expiringSoon > 0 },
          { k: "Submissions", v: submitted.length, note: "Last 30 days" },
          { k: "Submission to interview", v: `${conversion}%`, note: conversion >= 35 ? "Above the 35% target" : "Below the 35% target", warn: conversion < 35 },
          { k: "Placements active", v: rows.filter((r) => r.status === "ACTIVE").length, note: "Currently billing" },
        ].map((s, i) => (
          <div key={s.k} className={cn("px-5 py-4", i > 0 && "border-t border-line sm:border-t-0 sm:border-l")}>
            <dt className="text-xs text-subtle">{s.k}</dt>
            <dd className="tnum mt-1 text-[24px] font-semibold tracking-[-0.02em]">{s.v}</dd>
            <dd className={cn("text-xs", s.warn ? "text-notice-ink" : "text-subtle")}>{s.note}</dd>
          </div>
        ))}
      </dl>

      <Tabs.Root value={tab} onValueChange={setTab} className="mt-6">
        <Tabs.List aria-label="Filter requests" className="flex gap-1 border-b border-line">
          {TABS.map((t) => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className="-mb-px border-b-2 border-transparent px-3 pb-2.5 text-[13.5px] font-medium text-subtle hover:text-ink data-[state=active]:border-cobalt data-[state=active]:text-ink"
            >
              {t.label}
              <span className="tnum ml-1.5 text-xs text-faint">{rows.filter((r) => t.match(r, now)).length}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {TABS.map((t) => {
          const list = rows.filter((r) => t.match(r, now));
          return (
            <Tabs.Content key={t.value} value={t.value} className="mt-4">
              {list.length === 0 ? (
                <div className="flex flex-col items-center rounded-panel bg-surface px-6 py-12 text-center ring-1 ring-line">
                  <EmptyRequestsIllustration className="h-24 w-auto" />
                  <p className="mt-3 font-medium">Nothing here yet</p>
                  <p className="mt-1 text-sm text-muted">Lock a candidate from the inventory and the request shows up here with its countdown.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-panel bg-surface ring-1 ring-line">
                  <table className="w-full min-w-[900px] text-left text-[13px]">
                    <thead className="border-b border-line bg-canvas text-xs text-subtle">
                      <tr>
                        <th className="py-2.5 pl-4 font-medium">Candidate</th>
                        <th className="py-2.5 font-medium">End client and role</th>
                        <th className="py-2.5 text-right font-medium">Bill rate</th>
                        <th className="py-2.5 pl-6 font-medium">Status</th>
                        <th className="py-2.5 font-medium">Lock</th>
                        <th className="py-2.5 font-medium">Created</th>
                        <th className="py-2.5 pr-4" />
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((r) => (
                        <tr key={r.id} className={cn("border-b border-line last:border-0", r.mine && "bg-cobalt-wash/40")}>
                          <td className="py-3 pl-4">
                            <CandidateCode code={r.code} />
                            <span className="block font-medium">{r.revealedName}</span>
                            <span className="text-xs text-subtle">{r.title}</span>
                          </td>
                          <td className="py-3">
                            <span className="block font-medium">{r.clientName}</span>
                            <span className="text-xs text-subtle">{r.targetRoleTitle}</span>
                          </td>
                          <td className="tnum py-3 text-right font-medium">{usd.format(r.proposedRate)}/hr</td>
                          <td className="py-3 pl-6">
                            <EngagementPill status={r.status} />
                          </td>
                          <td className="py-3">
                            <LockCell r={r} now={now} />
                          </td>
                          <td className="tnum py-3 text-subtle">{relativeAgo(r.createdAt, now)}</td>
                          <td className="py-3 pr-4">
                            <div className="flex justify-end gap-1">
                              <Link href={`/one-sheet/${r.code}`} target="_blank" className="rounded-ctl p-1.5 text-subtle hover:bg-placed-bg hover:text-ink" aria-label={`One-sheet for ${r.code}`}>
                                <IconPrinter size={16} />
                              </Link>
                              {r.mine && r.lockExpiresAt && new Date(r.lockExpiresAt).getTime() > now && (
                                <Button size="sm" variant="ghost" onClick={() => setReleasing(r)}>
                                  Release
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tabs.Content>
          );
        })}
      </Tabs.Root>

      <Modal
        open={!!releasing}
        onOpenChange={(o) => !o && setReleasing(null)}
        title={`Release the lock on ${releasing?.code}?`}
        description={`Other agencies will be able to submit ${releasing?.revealedName} to ${releasing?.clientName} right away. The request moves back to draft.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setReleasing(null)}>
              Keep lock
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                releaseRequest(releasing!.id);
                notify({ tone: "ok", title: `Released lock on ${releasing!.code}` });
                setReleasing(null);
              }}
            >
              Release lock
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-muted">You can place a new lock later if the candidate is still available.</p>
      </Modal>
    </div>
  );
}
