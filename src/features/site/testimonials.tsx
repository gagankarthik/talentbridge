"use client";

import { useEffect, useState } from "react";

// Illustrative quotes for the demo site. Replace with approved customer quotes.
const QUOTES = [
  {
    quote: "We had a Databricks requisition open for three weeks. TalentBridge sent four profiles the next morning, and our client interviewed two of them that week.",
    name: "Priya Raman",
    role: "Director of Recruiting, Northline Staffing Group",
  },
  {
    quote: "The 48-hour hold is what sold our account team. We stopped losing candidates to duplicate submissions at our largest banking client.",
    name: "Marcus Bell",
    role: "Account Manager, Harbor & Vale Talent",
  },
  {
    quote: "Work authorization and I-9 were done before we ever saw the profile. Onboarding took two days instead of two weeks.",
    name: "Elena Novak",
    role: "Head of Talent Operations, Summit Ridge Consulting",
  },
  {
    quote: "Hiring managers read the system design score before they read the resume. That changed how fast we get to an interview.",
    name: "Jordan Hayes",
    role: "Engineering Manager, Crestline Retail Holdings",
  },
];

/** Editorial pull quote with plain text navigation. */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const q = QUOTES[i];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % QUOTES.length), 8000);
    return () => clearTimeout(t);
  }, [i, paused]);

  return (
    <figure onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="border-t border-ink pt-10">
      <blockquote key={i} className="anim-fade max-w-[30ch] font-display text-[32px] leading-[1.2] font-light tracking-[-0.015em] text-ink sm:max-w-[34ch] sm:text-[46px]">
        {q.quote}
      </blockquote>
      <figcaption className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <p className="text-[15px]">
          <span className="font-semibold text-ink">{q.name}</span>
          <span className="block text-muted">{q.role}</span>
        </p>
        <div className="flex items-center gap-5 text-[14px]">
          <span className="tnum text-subtle" aria-live="polite">
            {i + 1} of {QUOTES.length}
          </span>
          <button onClick={() => setI((x) => (x - 1 + QUOTES.length) % QUOTES.length)} className="font-semibold text-ink underline-offset-4 hover:underline">
            Previous
          </button>
          <button onClick={() => setI((x) => (x + 1) % QUOTES.length)} className="font-semibold text-ink underline-offset-4 hover:underline">
            Next
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
