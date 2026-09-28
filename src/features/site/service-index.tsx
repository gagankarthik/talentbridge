"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ACCENT, SERVICES } from "@/lib/company";

/**
 * Services as an editorial index: one row per service, hairline rules,
 * and the active row's photograph shown alongside. Hover or focus selects.
 */
export function ServiceIndex() {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
      <ol className="border-t border-ink">
        {SERVICES.map((s, i) => (
          <li key={s.slug} className="border-b border-line">
            <Link
              href={`/services/${s.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-[4px_1fr] gap-x-5 py-6 sm:grid-cols-[4px_1fr_auto] sm:items-baseline"
            >
              <span aria-hidden="true" className={cn("h-full rounded-full transition-colors", i === active ? ACCENT[s.accent].solid : "bg-transparent")} />
              <span>
                <span className={cn("block font-display text-[28px] leading-tight font-light tracking-[-0.02em] transition-colors sm:text-[34px]", i === active ? "text-ink" : "text-muted")}>
                  {s.name}
                </span>
                <span className="mt-1.5 block max-w-[34em] text-[15px] leading-relaxed text-muted">{s.summary}</span>
              </span>
              <span className="col-start-2 mt-3 text-[13.5px] text-subtle sm:col-start-3 sm:mt-0 sm:text-right">{s.audience}</span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="relative hidden overflow-hidden rounded-[20px] bg-night lg:block">
        {SERVICES.map((s, i) => (
          <Image
            key={s.slug}
            src={s.image}
            alt=""
            fill
            sizes="40vw"
            className={cn("object-cover transition-opacity duration-500", i === active ? "opacity-100" : "opacity-0")}
          />
        ))}
        <div className={cn("absolute inset-x-0 bottom-0 px-6 py-5 text-white transition-colors duration-500", ACCENT[SERVICES[active].accent].solid)}>
          <p className="text-[13px] text-white/80">{SERVICES[active].audience}</p>
          <p className="mt-0.5 text-[17px] font-semibold">{SERVICES[active].name}</p>
        </div>
      </div>
    </div>
  );
}
