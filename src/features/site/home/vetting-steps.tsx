"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/components/motion";
import { IconCalendarCheck, IconDeploy, IconPanel, IconShieldCheck } from "@/components/icons";

const STEPS = [
  {
    icon: IconPanel,
    when: "90 minutes",
    t: "Live technical panel",
    d: "A senior engineer from the same discipline scores system design, coding, domain depth and communication.",
  },
  {
    icon: IconShieldCheck,
    when: "Before presentation",
    t: "Compliance verification",
    d: "E-Verify, Form I-9, background and three references clear before any profile is shared.",
  },
  {
    icon: IconCalendarCheck,
    when: "Every 7 days",
    t: "Availability check",
    d: "Engineers re-confirm availability weekly, or they are held back from the bench.",
  },
  {
    icon: IconDeploy,
    when: "Within 48 hours",
    t: "Matched and deployed",
    d: "We handle the contract, onboarding and first day, on W2 or corp-to-corp.",
  },
];

const STEP_MS = 2600;

/**
 * The four checks run in order while the section is on screen, the way a
 * profile moves through them. Hover or focus holds one; reduced motion keeps all still.
 */
export function VettingSteps() {
  const { ref, shown } = useInView<HTMLOListElement>(0.3);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!shown || held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [shown, held, active]);

  return (
    <ol ref={ref} className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5" onMouseLeave={() => setHeld(false)}>
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const on = i === active;
        return (
          <li
            key={s.t}
            tabIndex={0}
            onMouseEnter={() => {
              setActive(i);
              setHeld(true);
            }}
            onFocus={() => {
              setActive(i);
              setHeld(true);
            }}
            onBlur={() => setHeld(false)}
            aria-current={on ? "step" : undefined}
            className={cn(
              "relative flex flex-col overflow-hidden rounded-[20px] p-7 outline-none transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-brand sm:p-8",
              on ? "bg-navy text-white" : "bg-[#f3f5f9] text-ink",
            )}
          >
            <span className={cn("grid size-14 place-items-center rounded-[14px] transition-colors duration-500", on ? "bg-white/10 text-sun" : "bg-brand-wash text-brand")}>
              <Icon size={28} strokeWidth={1.5} />
            </span>
            <span className={cn("mt-7 text-[15px] font-semibold transition-colors duration-500", on ? "text-sky" : "text-brand")}>{s.when}</span>
            <h3 className="mt-1 text-[22px] leading-snug font-semibold tracking-[-0.01em]">{s.t}</h3>
            <p className={cn("mt-2.5 text-[16px] leading-[1.6] transition-colors duration-500", on ? "text-[#c8d3e6]" : "text-ink-2")}>{s.d}</p>
            {/* How long this check holds before the next one runs */}
            {on && shown && !held && (
              <span
                key={active}
                aria-hidden="true"
                className="step-fill absolute inset-x-0 bottom-0 h-1 bg-sun"
                style={{ "--step-ms": `${STEP_MS}ms` } as React.CSSProperties}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
