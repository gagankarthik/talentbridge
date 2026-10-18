import Link from "next/link";
import { ArrowRight, CalendarCheck, Code, ShieldCheck, UserCheck } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import type { BenchItem } from "./role-builder";

interface Check {
  icon: Icon;
  t: string;
  d: string;
}

const LEFT: Check[] = [
  { icon: Code, t: "Live technical panel", d: "90 minutes with a senior engineer from the same discipline. That panel produced the screen score." },
  { icon: ShieldCheck, t: "Compliance cleared", d: "E-Verify, Form I-9, background and three references, all before the profile is shown." },
];
const RIGHT: Check[] = [
  { icon: CalendarCheck, t: "Availability re-confirmed", d: "Every seven days. A profile that goes quiet is held back, so the start date you see is current." },
  { icon: UserCheck, t: "Placed in 48 hours", d: "Choose the engineer and we handle the contract, onboarding and first day, on W2 or corp-to-corp." },
];

function Note({ c, align }: { c: Check; align: "left" | "right" }) {
  const Icon = c.icon;
  return (
    <li className={cn("max-w-[34ch]", align === "left" ? "lg:ml-auto lg:text-right" : "")}>
      <span className={cn("grid size-12 place-items-center rounded-[12px] bg-brand text-white", align === "left" && "lg:ml-auto")}>
        <Icon aria-hidden="true" size={24} />
      </span>
      <h3 className="mt-4 text-[20px] leading-snug font-semibold tracking-[-0.01em] text-ink">{c.t}</h3>
      <p className="mt-2 text-[16px] leading-[1.6] text-ink-2">{c.d}</p>
    </li>
  );
}

/**
 * What happened before a profile reached you, told on the profile itself: one
 * real blind profile in the middle, each check beside the part it produced.
 */
export function Checks({ sample }: { sample: BenchItem }) {
  return (
    <section id="vetting" aria-labelledby="checks-h" className="scroll-mt-20 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="checks-h" className="mx-auto max-w-[20ch] text-center font-display text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] text-ink sm:text-[46px]">
          Four checks before a profile reaches you.
        </h2>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,400px)_1fr] lg:gap-14">
          <ul className="order-2 space-y-12 lg:order-1">
            {LEFT.map((c) => (
              <Note key={c.t} c={c} align="left" />
            ))}
          </ul>

          <figure className="order-1 lg:order-2">
            <div className="rounded-[16px] bg-white p-7 shadow-[0_24px_60px_-28px_rgb(11_27_51/0.35)] ring-1 ring-[#e3e7ee]">
              <div className="flex items-start justify-between gap-4">
                <p className="flex items-center gap-2">
                  <span className="tnum text-[14px] font-semibold text-muted">{sample.code}</span>
                  <span role="img" aria-label="Name withheld" className="inline-block h-3 w-20 rounded-[2px] bg-ink" />
                </p>
                <p className="text-right leading-none">
                  <span className="tnum block text-[32px] font-semibold text-brand">{sample.score}</span>
                  <span className="mt-1.5 block text-[13px] text-muted">screen score</span>
                </p>
              </div>
              <p className="mt-5 text-[22px] leading-snug font-semibold text-ink">{sample.title}</p>
              <p className="tnum mt-1 text-[15px] text-ink-2">
                {sample.discipline} · {sample.years} years · {sample.metro}
              </p>
              <dl className="mt-6 space-y-3 rounded-[12px] bg-[#f5f7fb] p-4 text-[14px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-2">Work authorization</dt>
                  <dd className="font-semibold text-[#166c40]">E-Verify matched</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-2">Form I-9 and background</dt>
                  <dd className="font-semibold text-[#166c40]">Cleared</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-2">Availability</dt>
                  <dd className="font-semibold text-ink">{sample.days === 0 ? "Immediate" : sample.start}</dd>
                </div>
              </dl>
              <p className="mt-6 text-[14px] text-ink-2">{sample.skills.join(", ")}</p>
            </div>
            <figcaption className="mt-3 text-center text-[13px] text-muted">A sample blind profile from our demo bench</figcaption>
          </figure>

          <ul className="order-3 space-y-12">
            {RIGHT.map((c) => (
              <Note key={c.t} c={c} align="right" />
            ))}
          </ul>
        </div>

        <p className="mt-16 text-center">
          <Link href="/company#vetting" className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-brand hover:text-brand-strong hover:underline underline-offset-4">
            Read the full vetting standard
            <ArrowRight aria-hidden="true" weight="bold" size={16} />
          </Link>
        </p>
      </div>
    </section>
  );
}
