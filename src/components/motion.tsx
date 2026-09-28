"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** True once the element has scrolled into view (fires once). */
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, shown };
}

/**
 * Layout wrapper kept for structure. Per-section fade-ups were removed on
 * purpose: motion is reserved for the hero network and the scroll-fill statement.
 */
export function Reveal({ children, className, as: Tag = "div" }: { children: React.ReactNode; className?: string; stagger?: boolean; as?: "div" | "section" | "ul" | "ol" }) {
  return <Tag className={className}>{children}</Tag>;
}

/** Counts up to `value` when scrolled into view. */
export function CountUp({ value, duration = 1200, prefix = "", suffix = "", className }: { value: number; duration?: number; prefix?: string; suffix?: string; className?: string }) {
  const format = (n: number) => `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`;
  const { ref, shown } = useInView<HTMLSpanElement>(0.4);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!shown) return;
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = ms === 0 ? 1 : Math.min(1, (t - t0) / ms);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, value, duration]);
  return (
    <span ref={ref} className={cn("tnum", className)}>
      {format(n)}
    </span>
  );
}
