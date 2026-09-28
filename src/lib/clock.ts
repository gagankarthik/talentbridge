"use client";

import { useEffect, useState } from "react";
import { DEMO_NOW } from "./format";

const loadedAt = typeof window === "undefined" ? 0 : Date.now();

/** Current demo time: starts at DEMO_NOW and advances in real time after load. */
export function demoNow() {
  return typeof window === "undefined" ? DEMO_NOW : DEMO_NOW + (Date.now() - loadedAt);
}

/** Re-renders every `intervalMs` with the advancing demo clock. SSR-safe. */
export function useDemoNow(intervalMs = 1000) {
  const [now, setNow] = useState(DEMO_NOW);
  useEffect(() => {
    const first = setTimeout(() => setNow(demoNow()), 0);
    const t = setInterval(() => setNow(demoNow()), intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [intervalMs]);
  return now;
}
