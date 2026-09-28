"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { IconCheck, IconChevronRight } from "@/components/icons";

export interface DeckProfile {
  code: string;
  title: string;
  practice: string;
  accent: "violet" | "teal" | "cobalt";
  years: number;
  auth: string;
  available: string;
  immediate: boolean;
  score: number;
  skills: { skill: string; years: number }[];
}

const STRIPE = { violet: "bg-acc-violet", teal: "bg-acc-teal", cobalt: "bg-acc-cobalt" };
const INTERVAL = 3600;

/** Hero: a stack of real, blind consultant profiles that cycles. Hover pauses; arrows step. */
export function TalentDeck({ profiles }: { profiles: DeckProfile[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = profiles.length;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  const p = profiles[i];

  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:mr-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Stack */}
      <div className="relative h-[360px] sm:h-[340px]">
        {profiles.map((c, k) => {
          const depth = (k - i + n) % n;
          if (depth > 2) return null;
          return (
            <article
              key={c.code}
              aria-hidden={depth !== 0}
              className="absolute inset-x-0 top-0 overflow-hidden rounded-[22px] bg-surface text-ink shadow-[0_40px_80px_-32px_rgb(0_0_0/0.55)] transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                transform: `translateY(${depth * 18}px) scale(${1 - depth * 0.05})`,
                zIndex: 10 - depth,
                opacity: depth === 0 ? 1 : 0.55 - depth * 0.15,
              }}
            >
              <div className={cn("h-1.5", STRIPE[c.accent])} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-[12.5px]">
                      <span className="font-mono font-medium text-subtle">{c.code}</span>
                    </p>
                    <h3 className="mt-1.5 text-[21px] leading-tight font-semibold tracking-[-0.02em]">{c.title}</h3>
                    <p className="tnum mt-1 text-[13.5px] text-subtle">
                      {c.years} years of experience
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {c.skills.map((s, idx) => (
                    <span key={s.skill} className={cn("inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[12.5px]", idx < 3 ? "bg-ink-2 text-white" : "bg-placed-bg text-ink-2")}>
                      {s.skill}
                      <span className={cn("tnum", idx < 3 ? "text-slate-300" : "text-subtle")}>{s.years}y</span>
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-[12.5px]">
                  <div>
                    <p className="text-subtle">Work authorization</p>
                    <p className="mt-1 flex items-center gap-1 font-semibold text-ink">
                      <IconCheck size={13} strokeWidth={2.5} className="text-avail" />
                      {c.auth}
                    </p>
                  </div>
                  <div>
                    <p className="text-subtle">Availability</p>
                    <p className={cn("mt-1 font-semibold", c.immediate ? "text-avail-ink" : "text-notice-ink")}>{c.available}</p>
                  </div>
                  <div>
                    <p className="text-subtle">Technical screen</p>
                    <p className="mt-1 flex items-center gap-2 font-semibold">
                      <span className="tnum">{c.score}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                        <span className="block h-full rounded-full bg-ink-2 transition-[width] duration-700" style={{ width: depth === 0 ? `${c.score}%` : "0%" }} />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-1.5" role="tablist" aria-label="Profiles">
          {profiles.map((c, k) => (
            <button
              key={c.code}
              role="tab"
              aria-selected={k === i}
              aria-label={`Show ${c.code}`}
              onClick={() => setI(k)}
              className={cn("h-1.5 rounded-full transition-all", k === i ? "w-7 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60")}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 text-[13px] text-slate-400">
          <span className="tnum" aria-live="polite">
            {p.code}
          </span>
          <button onClick={() => setI((x) => (x - 1 + n) % n)} className="grid size-9 place-items-center rounded-full text-white ring-1 ring-white/20 hover:bg-white/10" aria-label="Previous profile">
            <IconChevronRight size={16} className="rotate-180" />
          </button>
          <button onClick={() => setI((x) => (x + 1) % n)} className="grid size-9 place-items-center rounded-full text-white ring-1 ring-white/20 hover:bg-white/10" aria-label="Next profile">
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
