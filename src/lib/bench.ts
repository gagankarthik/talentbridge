import { presentable } from "./data";
import { freshnessDays, FRESHNESS_WINDOW_DAYS } from "./format";
import type { Discipline } from "./types";

export const DISCIPLINES: Discipline[] = ["Data & AI", "DevOps / Cloud", "Full-Stack"];

export interface DisciplineRow {
  discipline: Discipline;
  available: number;
  immediate: number;
  medianRate: number;
  medianScore: number;
  topSkills: string[];
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

export function benchSnapshot() {
  const onBench = presentable.filter((c) => c.benchStage === "Available");
  const rows: DisciplineRow[] = DISCIPLINES.map((d) => {
    const list = onBench.filter((c) => c.discipline === d);
    const skills = new Map<string, number>();
    list.forEach((c) => c.skills.filter((s) => s.primary).forEach((s) => skills.set(s.skill, (skills.get(s.skill) ?? 0) + 1)));
    return {
      discipline: d,
      available: list.length,
      immediate: list.filter((c) => c.availability === "IMMEDIATE").length,
      medianRate: median(list.map((c) => c.rateC2C)),
      medianScore: median(list.map((c) => c.technicalScreenScore ?? 0)),
      topSkills: [...skills.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([s]) => s),
    };
  });
  const fresh = presentable.filter((c) => freshnessDays(c.lastVerifiedAt) < FRESHNESS_WINDOW_DAYS).length;
  return {
    rows,
    total: onBench.length,
    freshPct: Math.round((fresh / presentable.length) * 100),
    medianScore: median(onBench.map((c) => c.technicalScreenScore ?? 0)),
  };
}
