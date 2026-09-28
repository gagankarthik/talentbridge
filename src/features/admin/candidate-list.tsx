"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { freshnessDays, FRESHNESS_WINDOW_DAYS, WORK_AUTH_SHORT } from "@/lib/format";
import type { BenchStage, Candidate } from "@/lib/types";
import { Input, Segmented } from "@/components/ui/form";
import { Pill, type Tone } from "@/components/ui/status";
import { Select } from "@/components/ui/select";
import { IconPlus, IconSearch } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { isListable, readiness } from "./candidate-form";

export const STAGE_TONE: Record<BenchStage, Tone> = {
  Onboarding: "notice",
  Vetting: "cobalt",
  Available: "avail",
  Interview: "cobalt",
  Placed: "placed",
};

/** Seed records plus anything added or edited in this console. */
export function useAllCandidates(seed: Candidate[]) {
  const { addedCandidates, candidateEdits } = useAdmin();
  return useMemo(() => [...addedCandidates, ...seed.map((c) => (candidateEdits[c.id] ? { ...c, ...candidateEdits[c.id] } : c))], [seed, addedCandidates, candidateEdits]);
}

export function nextCandidateCode(all: Candidate[]) {
  const max = Math.max(...all.map((c) => Number(c.code.replace(/\D/g, "")) || 0));
  return `TC-${max + 7}`;
}

type Readiness = "all" | "visible" | "blocked";

export function CandidateList({ seed }: { seed: Candidate[] }) {
  const all = useAllCandidates(seed);
  const params = useSearchParams();
  const urlQ = params.get("q") ?? "";
  const [q, setQ] = useState(urlQ);
  const [seenQ, setSeenQ] = useState(urlQ);
  if (urlQ !== seenQ) {
    setSeenQ(urlQ);
    setQ(urlQ);
  }
  const [stage, setStage] = useState<"all" | BenchStage>("all");
  const [ready, setReady] = useState<Readiness>("all");

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return all.filter(
      (c) =>
        (stage === "all" || c.benchStage === stage) &&
        (ready === "all" || (ready === "visible" ? isListable(c) : !isListable(c) && c.benchStage !== "Placed")) &&
        (!n || `${c.firstName} ${c.lastName} ${c.email} ${c.code} ${c.title} ${c.skills.map((s) => s.skill).join(" ")}`.toLowerCase().includes(n)),
    );
  }, [all, q, stage, ready]);

  return (
    <div className="space-y-4 px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative min-w-0 lg:flex-1">
          <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, code or skill" aria-label="Search candidates" className="pl-9" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            label="Stage"
            prefix="Stage:"
            value={stage}
            onValueChange={setStage}
            options={[{ value: "all", label: "All" }, ...(["Onboarding", "Vetting", "Available", "Interview", "Placed"] as BenchStage[]).map((s) => ({ value: s, label: s === "Interview" ? "Client interview" : s }))]}
          />
          <Segmented
            label="Customer visibility"
            value={ready}
            onChange={setReady}
            options={[
              { value: "all", label: "All" },
              { value: "visible", label: "Visible" },
              { value: "blocked", label: "Not visible" },
            ]}
          />
          <Link href="/admin/candidates/new" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-ctl bg-cobalt px-3.5 text-sm font-medium text-white hover:bg-cobalt-strong">
            <IconPlus size={15} />
            Add candidate
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[12px] bg-surface ring-1 ring-line">
        <table className="w-full min-w-[900px] text-left text-[13.5px]">
          <thead className="bg-canvas text-xs text-subtle">
            <tr className="border-b border-line whitespace-nowrap">
              <th className="px-5 py-2.5 font-medium">Candidate</th>
              <th className="py-2.5 font-medium">Role</th>
              <th className="py-2.5 font-medium">Stage</th>
              <th className="py-2.5 font-medium">Work auth</th>
              <th className="py-2.5 font-medium">Readiness</th>
              <th className="py-2.5 text-right font-medium">C2C / W2</th>
              <th className="px-5 py-2.5 text-right font-medium">Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const checks = readiness(c);
              const done = checks.filter((k) => k.ok).length;
              const blocked = checks.some((k) => k.blocking && !k.ok);
              const days = freshnessDays(c.lastVerifiedAt);
              return (
                <tr key={c.id} className="border-b border-line last:border-0 hover:bg-canvas">
                  <td className="px-5 py-3">
                    <Link href={`/admin/candidates/${c.code}`} className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-night text-[12px] font-semibold text-brand-bright">
                        {(c.firstName[0] ?? "") + (c.lastName[0] ?? "")}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-ink hover:text-cobalt">
                          {c.firstName} {c.lastName}
                        </span>
                        <span className="block font-mono text-xs text-subtle">{c.code}</span>
                        <span className="block max-w-[260px] truncate text-xs text-subtle">{c.email}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="py-3">
                    <span className="block text-ink">{c.title}</span>
                    <span className="block text-xs text-subtle">{c.yearsExperience} yrs</span>
                  </td>
                  <td className="py-3">
                    <Pill tone={STAGE_TONE[c.benchStage]}>{c.benchStage === "Interview" ? "Client interview" : c.benchStage}</Pill>
                  </td>
                  <td className="py-3 text-ink-2">{WORK_AUTH_SHORT[c.workAuthorization]}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
                        <span className={cn("block h-full rounded-full", blocked ? "bg-flag" : done === checks.length ? "bg-avail" : "bg-cobalt")} style={{ width: `${(done / checks.length) * 100}%` }} />
                      </span>
                      <span className="tnum text-xs text-subtle">
                        {done}/{checks.length}
                      </span>
                    </span>
                    {blocked && <span className="mt-0.5 block text-xs text-flag-ink">Blocked from customers</span>}
                  </td>
                  <td className="tnum py-3 pl-4 text-right whitespace-nowrap text-ink-2">
                    ${c.rateC2C} / ${c.rateW2}
                  </td>
                  <td className={cn("tnum px-5 py-3 text-right", days >= FRESHNESS_WINDOW_DAYS ? "text-notice-ink" : "text-subtle")}>{days === 0 ? "Today" : `${days}d ago`}</td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[14px] text-subtle">
                  No candidates match. Clear the search or filters to see everyone.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
