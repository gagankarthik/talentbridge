"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { BenchStage } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { CandidateCode, Pill } from "@/components/ui/status";
import { IconCheck, IconMail } from "@/components/icons";

export interface QueueItem {
  id: string;
  candidateCode: string;
  name: string;
  title: string;
  stage: BenchStage;
  label: string;
  detail: string;
  severity: "flag" | "notice";
  dueInDays?: number;
}

export interface ComplianceStats {
  presentable: number;
  presentableVerified: number;
  visa90: number;
  bgPending: number;
  stale: number;
}

const ACTION: Record<string, string> = {
  "Work authorization unverified": "Request documents",
  "I-9 incomplete": "Assign reviewer",
  "Visa expiring": "Request extension",
  "Background check in progress": "Chase provider",
  "References outstanding": "Send reminder",
  "Availability stale": "Ping consultant",
};

export function ComplianceQueue({ items, stats }: { items: QueueItem[]; stats: ComplianceStats }) {
  const { notify } = useWorkspace();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"flag" | "notice" | "all">("flag");
  const open = items.filter((i) => !done.has(i.id));
  const list = open.filter((i) => tab === "all" || i.severity === tab).sort((a, b) => (a.dueInDays ?? 999) - (b.dueInDays ?? 999));
  const verifiedPct = Math.round((stats.presentableVerified / stats.presentable) * 100);

  return (
    <div className="px-4 py-6 sm:px-8">
      <div>
        <dl className="grid overflow-hidden rounded-panel bg-surface ring-1 ring-line sm:grid-cols-4">
          {[
            { k: "Verified before presentation", v: `${verifiedPct}%`, note: `${stats.presentableVerified} of ${stats.presentable} listed profiles`, tone: "text-avail-ink" },
            { k: "Visas expiring in 90 days", v: stats.visa90, note: "Extensions to request" },
            { k: "Background checks pending", v: stats.bgPending, note: "With screening provider" },
            { k: "Stale availability", v: stats.stale, note: "Outside the 7-day window" },
          ].map((s, i) => (
            <div key={s.k} className={cn("px-5 py-4", i > 0 && "border-t border-line sm:border-t-0 sm:border-l")}>
              <dt className="text-xs text-subtle">{s.k}</dt>
              <dd className={cn("tnum mt-1 text-[24px] font-semibold tracking-[-0.02em]", s.tone)}>{s.v}</dd>
              <dd className="text-xs text-subtle">{s.note}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Tabs.Root value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-6">
        <Tabs.List aria-label="Severity" className="flex gap-1 border-b border-line">
          {(
            [
              ["flag", "Blocking flags"],
              ["notice", "Notices"],
              ["all", "All open items"],
            ] as const
          ).map(([v, l]) => (
            <Tabs.Trigger
              key={v}
              value={v}
              className="-mb-px border-b-2 border-transparent px-3 pb-2.5 text-[13.5px] font-medium text-subtle hover:text-ink data-[state=active]:border-cobalt data-[state=active]:text-ink"
            >
              {l}
              <span className="tnum ml-1.5 text-xs text-faint">{open.filter((i) => v === "all" || i.severity === v).length}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      {list.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-panel bg-surface py-12 text-center ring-1 ring-line">
          <span className="grid size-10 place-items-center rounded-full bg-avail-bg text-avail-ink">
            <IconCheck size={20} />
          </span>
          <p className="mt-3 font-medium">Queue clear</p>
          <p className="mt-1 text-sm text-muted">No open items at this severity.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-panel bg-surface ring-1 ring-line">
          <table className="w-full min-w-[920px] text-left text-[13px]">
            <thead className="border-b border-line bg-canvas text-xs text-subtle">
              <tr>
                <th className="py-2.5 pl-4 font-medium">Consultant</th>
                <th className="py-2.5 font-medium">Item</th>
                <th className="py-2.5 font-medium">Stage</th>
                <th className="py-2.5 font-medium">Due</th>
                <th className="py-2.5 pr-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.id} className="border-b border-line align-top last:border-0">
                  <td className="py-3 pl-4">
                    <CandidateCode code={i.candidateCode} />
                    <span className="block font-medium">{i.name}</span>
                    <span className="text-xs text-subtle">{i.title}</span>
                  </td>
                  <td className="max-w-[380px] py-3">
                    <Pill tone={i.severity === "flag" ? "flag" : "notice"}>{i.label}</Pill>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{i.detail}</p>
                  </td>
                  <td className="py-3 text-ink-2">{i.stage}</td>
                  <td className="tnum py-3">
                    {i.dueInDays !== undefined ? (
                      <span className={cn("font-medium", i.dueInDays <= 45 ? "text-flag-ink" : "text-notice-ink")}>{i.dueInDays} days</span>
                    ) : (
                      <span className="text-subtle">Now</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end gap-1.5">
                      <Button size="sm" onClick={() => notify({ tone: "ok", title: `${ACTION[i.label] ?? "Follow up"}: ${i.candidateCode}`, body: `Email queued to ${i.name} via SES.` })}>
                        <IconMail size={13} />
                        {ACTION[i.label] ?? "Follow up"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setDone((d) => new Set(d).add(i.id));
                          notify({ tone: "ok", title: `Resolved ${i.label.toLowerCase()} for ${i.candidateCode}` });
                        }}
                      >
                        Resolve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
