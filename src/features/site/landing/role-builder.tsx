"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

export interface BenchItem {
  code: string;
  title: string;
  discipline: Discipline;
  years: number;
  /** Days until the engineer can start; 0 means immediately */
  days: number;
  start: string;
  score: number;
  metro: string;
  skills: string[];
  i9: boolean;
}

type Discipline = "Data & AI" | "Cloud & DevOps" | "Full-Stack";
type Seniority = "mid-level" | "senior" | "lead";
type Start = "this week" | "within two weeks" | "within a month";

const SENIORITY: { v: Seniority; years: (y: number) => boolean }[] = [
  { v: "mid-level", years: (y) => y < 7 },
  { v: "senior", years: (y) => y >= 7 && y < 12 },
  { v: "lead", years: (y) => y >= 12 },
];
const DISCIPLINES: { v: Discipline; noun: string }[] = [
  { v: "Data & AI", noun: "Data & AI" },
  { v: "Cloud & DevOps", noun: "Cloud & DevOps" },
  { v: "Full-Stack", noun: "Full-Stack" },
];
const STARTS: { v: Start; days: number }[] = [
  { v: "this week", days: 7 },
  { v: "within two weeks", days: 14 },
  { v: "within a month", days: 31 },
];

/** Example requisitions the sentence plays through until the visitor takes over; each has matches on the bench */
const EXAMPLES: [Seniority, Discipline, Start][] = [
  ["senior", "Cloud & DevOps", "within two weeks"],
  ["lead", "Data & AI", "this week"],
  ["mid-level", "Full-Stack", "within a month"],
  ["senior", "Data & AI", "this week"],
  ["lead", "Cloud & DevOps", "within a month"],
];
const EXAMPLE_MS = 3800;

/**
 * One sentence slot: a native select set as display type, underlined like a form field on paper.
 * While the sentence plays its examples, a changed word rises into place.
 */
function Slot<T extends string>({ label, value, options, onChange, playing, frozen }: { label: string; value: T; options: T[]; onChange: (v: T) => void; playing: boolean; frozen: string }) {
  return (
    <span key={playing ? value : frozen} className={cn("relative inline-flex items-baseline whitespace-nowrap", playing && "tb-word")}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="cursor-pointer appearance-none [field-sizing:content] rounded-[6px] border-b-[3px] border-white/55 bg-transparent pr-[0.75em] pl-0 text-inherit font-inherit leading-[1.15] text-white transition-colors duration-200 outline-none hover:border-white focus-visible:border-white focus-visible:bg-white/10 [&>option]:text-base [&>option]:text-ink"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <CaretDown aria-hidden="true" weight="bold" className="pointer-events-none absolute right-0 bottom-[0.32em] size-[0.42em] text-white/80" />
    </span>
  );
}

function Profile({ p }: { p: BenchItem }) {
  const checks = ["E-Verify", ...(p.i9 ? ["I-9"] : []), "Background"];
  return (
    <li className="tb-swap flex flex-col rounded-[12px] bg-[#f5f7fb] p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="flex items-center gap-2">
          <span className="tnum text-[13px] font-semibold text-muted">{p.code}</span>
          <span role="img" aria-label="Name withheld" className="inline-block h-2.5 w-14 rounded-[2px] bg-ink" />
        </p>
        <p className="text-right leading-none">
          <span className="tnum block text-[22px] font-semibold text-ink">{p.score}</span>
          <span className="mt-1 block text-[12px] text-muted">screen score</span>
        </p>
      </div>
      <p className="mt-3 text-[17px] leading-snug font-semibold text-ink">{p.title}</p>
      <p className="tnum mt-0.5 text-[14px] text-ink-2">
        {p.years} years · {p.metro}
      </p>
      <p className="mt-3 text-[14px] text-ink-2">{p.skills.join(", ")}</p>
      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1" aria-label="Cleared before presentation">
        {checks.map((c) => (
          <li key={c} className="inline-flex items-center gap-1 text-[13px] font-medium text-[#166c40]">
            <Check aria-hidden="true" weight="bold" className="size-3.5" />
            {c}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className={cn("text-[14px] font-semibold", p.days === 0 ? "text-[#166c40]" : "text-ink-2")}>{p.days === 0 ? "Starts immediately" : p.start}</span>
        <Link href={`/contact?topic=requisition&profile=${encodeURIComponent(p.code)}`} className="text-[14px] font-semibold text-brand hover:text-brand-strong hover:underline underline-offset-4">
          Request profile
        </Link>
      </div>
    </li>
  );
}

/**
 * The hero is the requisition: a sentence the visitor completes, answered live
 * by the cleared engineers on the bench who fit it.
 */
export function RoleBuilder({ bench }: { bench: BenchItem[] }) {
  const [seniority, setSeniority] = useState<Seniority>("senior");
  const [discipline, setDiscipline] = useState<Discipline>("Cloud & DevOps");
  const [start, setStart] = useState<Start>("within two weeks");
  // The sentence plays examples until the visitor touches it; hovering only pauses it
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  const [example, setExample] = useState(0);

  useEffect(() => {
    if (!playing || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => {
      const next = (example + 1) % EXAMPLES.length;
      const [s, d, st] = EXAMPLES[next];
      setExample(next);
      setSeniority(s);
      setDiscipline(d);
      setStart(st);
    }, EXAMPLE_MS);
    return () => clearTimeout(t);
  }, [playing, paused, example]);

  // Taking over freezes each slot's key on its current word, so the focused select is never remounted
  const [frozen, setFrozen] = useState<[string, string, string]>(["", "", ""]);
  const takeOver = () => {
    if (!playing) return;
    setFrozen([seniority, discipline, start]);
    setPlaying(false);
  };

  const matches = useMemo(() => {
    const band = SENIORITY.find((s) => s.v === seniority)!;
    const within = STARTS.find((s) => s.v === start)!.days;
    const titled = (t: string) => (seniority === "mid-level" ? !/senior|lead|principal|staff/i.test(t) : true);
    return bench.filter((b) => b.discipline === discipline && band.years(b.years) && titled(b.title) && b.days <= within).sort((a, b) => b.score - a.score);
  }, [bench, seniority, discipline, start]);

  const key = `${seniority}|${discipline}|${start}`;
  const requisition = `/contact?topic=requisition&seniority=${encodeURIComponent(seniority)}&discipline=${encodeURIComponent(discipline)}&start=${encodeURIComponent(start)}`;

  return (
    <section aria-labelledby="hero-h" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocusCapture={takeOver} onPointerDown={takeOver}>
      <div className="relative isolate overflow-hidden bg-brand pt-14 pb-40 text-white sm:pt-20 lg:pt-24 lg:pb-44">
        {/* Engineers at work, toned into the cobalt and fading in from the right, behind the sentence */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-full [mask-image:linear-gradient(to_right,transparent_10%,#000_70%)] lg:w-[64%] lg:[mask-image:linear-gradient(to_right,transparent,#000_45%)]">
          <Image src="/images/technical-panel.jpg" alt="" fill priority sizes="(min-width: 1024px) 64vw, 100vw" className="object-cover opacity-30 mix-blend-luminosity grayscale lg:opacity-45" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 id="hero-h" className="max-w-[22ch] font-display text-[36px] leading-[1.18] text-balance lg:max-w-[30ch] font-semibold tracking-[-0.03em] sm:text-[48px] lg:text-[60px]">
            I need a <Slot label="Seniority" value={seniority} options={SENIORITY.map((s) => s.v)} onChange={setSeniority} playing={playing} frozen={frozen[0]} />{" "}
            <Slot label="Discipline" value={discipline} options={DISCIPLINES.map((d) => d.v)} onChange={setDiscipline} playing={playing} frozen={frozen[1]} /> engineer who can start{" "}
            <Slot label="Start" value={start} options={STARTS.map((s) => s.v)} onChange={setStart} playing={playing} frozen={frozen[2]} />.
          </h1>
          <p className="mt-7 max-w-[52ch] text-[18px] leading-[1.6] text-white/85 sm:text-[19px]">
            Every engineer below passed a live technical panel and cleared E‑Verify, I‑9 and background checks before appearing here.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={requisition}
              className="group inline-flex h-13 items-center gap-2 rounded-[10px] bg-white px-6 text-[16px] font-semibold text-brand-strong shadow-[0_6px_20px_-8px_rgb(11_27_51/0.45)] transition-[background-color,transform] duration-200 hover:bg-brand-wash active:scale-[0.98]"
            >
              Send this requisition
              <ArrowRight aria-hidden="true" weight="bold" className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/recruiters" className="text-[16px] font-semibold text-white underline decoration-white/50 underline-offset-[6px] hover:decoration-white">
              Or paste a job description
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-28 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[16px] bg-white p-5 shadow-[0_24px_60px_-24px_rgb(11_27_51/0.35)] sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1">
            <p aria-live="polite" className="text-[17px] font-semibold text-ink">
              {matches.length === 0
                ? "No exact match on the bench this week"
                : `${matches.length} cleared ${matches.length === 1 ? "engineer matches" : "engineers match"}`}
            </p>
            <p className="text-[14px] text-muted">Sample profiles from our demo bench. Names stay hidden until you request one.</p>
          </div>

          {matches.length === 0 ? (
            <div className="mt-5 rounded-[12px] bg-[#f5f7fb] p-6 text-[16px] leading-[1.6] text-ink-2">
              Send the requisition anyway. We source beyond the bench and reply with a matched shortlist within one business day.
            </div>
          ) : (
            <ul key={key} className="mt-5 grid gap-4 md:grid-cols-3">
              {matches.slice(0, 3).map((p) => (
                <Profile key={p.code} p={p} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
