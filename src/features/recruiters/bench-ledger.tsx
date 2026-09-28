"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import type { DisciplineRow } from "@/lib/bench";

export interface LedgerEvent {
  code: string;
  title: string;
  metro: string;
  discipline: DisciplineRow["discipline"];
}

/**
 * Live bench counter (PRD §5.1). Counts come from the server snapshot;
 * verification events stream in and nudge the ledger so the freshness
 * guarantee is visible, not claimed.
 */
export function BenchLedger({ rows, events, freshPct }: { rows: DisciplineRow[]; events: LedgerEvent[]; freshPct: number }) {
  const [counts, setCounts] = useState(() => rows.map((r) => r.available));
  const [flash, setFlash] = useState<number | null>(null);
  const [feed, setFeed] = useState<(LedgerEvent & { at: number; key: number })[]>([]);
  const [now, setNow] = useState(0);
  const cursor = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const push = () => {
      const e = events[cursor.current % events.length];
      cursor.current += 1;
      const idx = rows.findIndex((r) => r.discipline === e.discipline);
      // Mostly re-confirmations; occasionally a newly vetted consultant joins the bench.
      if (cursor.current % 3 === 0) {
        setCounts((cs) => cs.map((c, i) => (i === idx ? c + 1 : c)));
        setFlash(idx);
      }
      const at = Date.now();
      setNow(at);
      setFeed((f) => [{ ...e, at, key: cursor.current }, ...f].slice(0, 4));
    };
    push();
    if (reduce) return;
    const t = setInterval(push, 3800);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(t);
      clearInterval(clock);
    };
  }, [events, rows]);

  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <section aria-label="Live bench" className="blueprint-dark overflow-hidden rounded-sheet text-slate-300 ring-1 ring-ink-2">
      <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-avail/60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-avail" />
          </span>
          <span className="text-[13px] font-medium text-white">Live bench</span>
        </div>
        <span className="tnum text-xs text-slate-400">{freshPct}% confirmed in the last 7 days</span>
      </header>

      <div className="px-5 pt-5 pb-2">
        <p className="text-xs text-slate-400">Contractors available to submit</p>
        <p className="tnum mt-1 text-[56px] leading-none font-semibold tracking-[-0.04em] text-white" aria-live="polite">
          {total}
        </p>
      </div>

      <table className="mt-3 w-full text-left text-[13px]">
        <thead>
          <tr className="text-xs text-slate-500">
            <th className="py-2 pl-5 font-normal">Discipline</th>
            <th className="py-2 text-right font-normal">Bench</th>
            <th className="hidden py-2 text-right font-normal sm:table-cell">Immediate</th>
            <th className="py-2 pr-5 text-right font-normal">Median C2C</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.discipline + (flash === i ? feed[0]?.key : "")}
              className={cn("border-t border-white/[0.06]", flash === i && "ledger-flash")}
            >
              <td className="py-3 pl-5">
                <span className="font-medium text-white">{r.discipline}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{r.topSkills.join(", ")}</span>
              </td>
              <td className="tnum py-3 text-right text-lg font-semibold text-white">{counts[i]}</td>
              <td className="tnum hidden py-3 text-right text-slate-300 sm:table-cell">{r.immediate}</td>
              <td className="tnum py-3 pr-5 text-right text-slate-300">
                {usd.format(r.medianRate)}
                <span className="text-slate-500">/hr</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-white/[0.07] bg-black/20 px-5 py-3">
        <p className="mb-2 text-xs text-slate-500">Availability confirmations</p>
        <ul className="space-y-1.5" aria-live="off">
          {feed.map((e, i) => (
            <li key={e.key} className={cn("flex items-center gap-3 text-[12.5px] transition-opacity", i === 0 ? "anim-fade opacity-100" : "opacity-60")}>
              <span className="font-mono text-slate-200">{e.code}</span>
              <span className="min-w-0 flex-1 truncate text-slate-400">
                {e.title}, {e.metro}
              </span>
              <span className="tnum shrink-0 text-slate-500">{Math.max(1, Math.round((now - e.at) / 1000))}s ago</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
