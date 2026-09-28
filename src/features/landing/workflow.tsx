"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/components/motion";
import Image from "next/image";
import { IconCheck } from "@/components/icons";

const STEPS = [
  {
    title: "Live technical panel",
    time: "90 minutes",
    body: "A senior engineer from the same discipline interviews every consultant, scoring system design, hands-on coding, domain depth and communication.",
    img: "/images/technical-panel.jpg",
    chip: "System design 92, Coding 90, Domain 88",
  },
  {
    title: "Compliance verification",
    time: "Before any presentation",
    body: "Work authorization is matched through E-Verify, the I-9 is reviewed, and background and reference checks clear before a profile goes on the bench.",
    img: "/images/agreement.jpg",
    chip: "Work authorization verified, background cleared",
  },
  {
    title: "Weekly availability check",
    time: "Every 7 days",
    body: "Consultants re-confirm availability every week. Anyone who doesn't respond is held back, so every profile you see is ready to start.",
    img: "/images/code-desk.jpg",
    chip: "Availability confirmed this week",
  },
  {
    title: "Matched and deployed",
    time: "Within 48 hours",
    body: "You receive a shortlist of redacted profiles for your role. Pick your consultant, and we handle the contract, onboarding and start date.",
    img: "/images/data-center.jpg",
    chip: "Consultant starts in 48 hours",
  },
];

const DURATION = 5200;

export function Workflow() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hover, setHover] = useState(false);
  const { ref, shown } = useInView<HTMLDivElement>(0.3);

  useEffect(() => {
    if (!shown || hover || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % STEPS.length);
      setCycle((c) => c + 1);
    }, DURATION);
    return () => clearTimeout(t);
  }, [active, shown, hover, cycle]);

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <ol className="border-t border-ink" aria-label="Workflow steps">
        {STEPS.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.title} className="border-b border-line">
              <button
                onClick={() => {
                  setActive(i);
                  setCycle((c) => c + 1);
                }}
                aria-current={on ? "step" : undefined}
                className="w-full py-5 text-left"
              >
                <span className="flex items-center gap-4">
                  <span className={cn("tnum w-9 shrink-0 font-display text-[28px] leading-none font-light transition-colors", on ? "text-cobalt" : "text-faint")}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[18px] font-semibold tracking-[-0.01em] transition-colors", on ? "text-ink" : "text-muted")}>{s.title}</span>
                    <span className="block text-[13.5px] text-subtle">{s.time}</span>
                  </span>
                </span>
                <span className={cn("grid transition-all duration-500", on ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <span className="overflow-hidden pl-[52px] text-[14.5px] leading-relaxed text-muted">{s.body}</span>
                </span>
                {on && (
                  <span className="mt-4 ml-[52px] block h-[3px] overflow-hidden rounded-full bg-line">
                    <span key={cycle} className="anim-progress block h-full rounded-full bg-cobalt" style={{ animationDuration: `${DURATION}ms`, animationPlayState: hover || !shown ? "paused" : "running" }} />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative min-h-[380px] overflow-hidden rounded-[20px] bg-night lg:min-h-0">
        {STEPS.map((s, i) => (
          <Image
            key={s.img}
            src={s.img}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn("object-cover transition-all duration-700 ease-out", i === active ? "scale-100 opacity-100" : "scale-105 opacity-0")}
          />
        ))}
        <div key={active} className="anim-fade absolute inset-x-0 bottom-0 bg-surface px-6 py-4">
          <p className="tnum text-[12.5px] text-subtle">
            Step {active + 1} of {STEPS.length}
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-[15px] font-medium text-ink">
            <IconCheck size={15} strokeWidth={2.25} className="shrink-0 text-avail" />
            {STEPS[active].chip}
          </p>
        </div>
      </div>
    </div>
  );
}
