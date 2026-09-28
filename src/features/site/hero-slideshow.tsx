"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { cta } from "@/components/site/styles";

export interface HeroSlide {
  practice: string;
  role: string;
  line: string;
  img: string;
  alt: string;
  href: string;
}

const INTERVAL = 6500;

/**
 * Split hero: evergreen panel with the promise on the left, a full-height
 * photographic slideshow on the right (slow zoom + crossfade). The practice
 * selectors in the panel drive the slideshow; hover pauses it.
 */
export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % slides.length), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, slides.length, cycle]);

  const go = (k: number) => {
    setI(k);
    setCycle((c) => c + 1);
  };
  const s = slides[i];

  return (
    <section className="grid bg-night text-white lg:min-h-[min(calc(100svh-72px),860px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Photo stage (first on mobile) */}
      <div className="relative order-first aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:order-last lg:aspect-auto">
        {slides.map((sl, k) => (
          <div key={sl.img} className={cn("absolute inset-0 transition-opacity duration-[1200ms] ease-out", k === i ? "opacity-100" : "opacity-0")} aria-hidden={k !== i}>
            <Image
              src={sl.img}
              alt={sl.alt}
              fill
              priority={k === 0}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className={cn("object-cover", k === i && "hero-kenburns")}
              key={k === i ? `${sl.img}-${cycle}-${i}` : sl.img}
            />
          </div>
        ))}
        {/* Caption plate */}
        <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between gap-6 bg-night/80 px-6 py-5 backdrop-blur-sm sm:px-8 lg:left-auto lg:w-[min(520px,85%)] lg:rounded-tl-[20px]">
          <div key={i} className="anim-fade min-w-0">
            <p className="text-[13px] text-brand-bright">{s.practice}</p>
            <p className="mt-0.5 truncate text-[17px] font-semibold">{s.role}</p>
            <p className="mt-0.5 text-[14px] text-slate-300">{s.line}</p>
          </div>
          <Link href={s.href} className="shrink-0 text-[14px] font-semibold text-white underline underline-offset-4 hover:text-brand-bright">
            View profiles
          </Link>
        </div>
      </div>

      {/* Promise panel */}
      <div className="flex flex-col justify-between gap-12 px-5 pt-12 pb-10 sm:px-8 lg:pr-12 lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))] lg:pt-20 lg:pb-12">
        <div>
          <p className="text-[15px] text-slate-300">IT staffing for enterprises and staffing firms</p>
          <h1 className="mt-6 font-display text-[48px] leading-[0.98] font-light tracking-[-0.035em] sm:text-[68px] xl:text-[84px]">
            Hire the engineers others are still searching for.
          </h1>
          <p className="mt-7 max-w-[32em] text-[18px] leading-relaxed text-slate-300">
            Senior engineers matched to your requirement, technically screened, compliance-cleared and confirmed available before you meet them. Submit today,
            start in 48 hours.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact?topic=requisition" className={cta.bright}>
              Send us a requisition
            </Link>
            <Link href="/recruiters" className={cta.outlineInverse}>
              Browse available talent
            </Link>
          </div>
        </div>

        {/* Practice selectors drive the slideshow */}
        <div role="tablist" aria-label="Ways to work with us" className="grid grid-cols-3 border-t border-white/15">
          {slides.map((sl, k) => (
            <button
              key={sl.practice}
              role="tab"
              aria-selected={k === i}
              onClick={() => go(k)}
              className={cn("relative pt-4 pr-3 text-left text-[14px] transition-colors sm:text-[15px]", k === i ? "text-white" : "text-slate-400 hover:text-slate-200")}
            >
              <span className="absolute top-[-1px] left-0 h-[2px] w-full overflow-hidden">
                {k === i && (
                  <span
                    key={`${i}-${cycle}`}
                    className="anim-progress block h-full bg-brand-bright"
                    style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: paused ? "paused" : "running" }}
                  />
                )}
              </span>
              <span className="font-medium">{sl.practice}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
