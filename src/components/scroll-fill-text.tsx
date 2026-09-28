"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Editorial statement whose words fill from muted to ink as it scrolls
 * through the viewport. Reduced motion renders it fully inked.
 */
export function ScrollFillText({ text, className, as: Tag = "h2" }: { text: string; className?: string; as?: "h1" | "h2" | "p" }) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top enters the lower 90% of the viewport, 1 when the bottom passes 45%
      const start = vh * 0.9;
      const end = vh * 0.45;
      const p = reduced ? 1 : (start - r.top) / (start - end + r.height);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const lit = progress * words.length;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn("font-display", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="transition-colors duration-300" style={{ color: i < lit ? "var(--color-ink)" : "var(--color-line-strong)" }}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
