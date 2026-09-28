"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { AvailabilityMock, ComplianceMock, ScorecardMock, StartMock } from "./vetting-mocks";

const STEPS = [
  {
    title: "Live technical panel",
    when: "90 minutes",
    body: "A senior engineer from the same discipline interviews every consultant and scores system design, hands-on coding, domain depth and communication.",
    Visual: ScorecardMock,
  },
  {
    title: "Compliance verification",
    when: "Before any presentation",
    body: "Work authorization is matched through E-Verify, the I-9 is reviewed, and background and reference checks clear before a profile reaches the bench.",
    Visual: ComplianceMock,
  },
  {
    title: "Weekly availability check",
    when: "Every 7 days",
    body: "Consultants re-confirm availability every week. Anyone who doesn't respond is held back, so every profile you see can actually start.",
    Visual: AvailabilityMock,
  },
  {
    title: "Matched and deployed",
    when: "Within 48 hours",
    body: "You get redacted profiles for your role. Choose your consultant and we handle the contract, onboarding and first day.",
    Visual: StartMock,
  },
];

/**
 * Sticky scroll story: the heading and step index stay pinned while each
 * step's product visual scrolls past. The step in view is highlighted.
 */
export function VettingStory({ heading }: { heading: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        {heading}
        <ol className="mt-10 hidden border-l border-line lg:block">
          {STEPS.map((s, i) => (
            <li key={s.title} className={cn("-ml-px border-l-2 py-2.5 pl-5 transition-colors duration-300", i === active ? "border-brand" : "border-transparent")}>
              <button
                type="button"
                onClick={() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}
                className={cn("text-left text-[17px] transition-colors", i === active ? "font-semibold text-ink" : "text-subtle hover:text-ink")}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-16 lg:space-y-24">
        {STEPS.map((s, i) => (
          <article key={s.title} ref={(el) => void (refs.current[i] = el)} data-i={i}>
            <s.Visual />
            <div className="mt-6 grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-8">
              <p className="tnum font-display text-[44px] leading-none font-light text-brand">{i + 1}</p>
              <div>
                <h3 className="text-[22px] font-semibold tracking-[-0.015em] text-ink">{s.title}</h3>
                <p className="text-[14px] font-medium text-subtle">{s.when}</p>
                <p className="mt-3 max-w-[36em] text-[16px] leading-relaxed text-muted">{s.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
