import { presentable } from "./data";
import { availabilityOf, WORK_AUTH_LABEL } from "./format";
import type { DeckProfile } from "@/features/site/talent-deck";
import type { Candidate } from "./types";
import type { LedgerEvent } from "@/features/recruiters/bench-ledger";

const byScore = (a: Candidate, b: Candidate) => (b.technicalScreenScore ?? 0) - (a.technicalScreenScore ?? 0);

/** Hero deck: strongest available profile per practice, interleaved. */
export function deckProfiles(): DeckProfile[] {
  const practice = { "Data & AI": ["Data & AI", "violet"], "DevOps / Cloud": ["Cloud & DevOps", "teal"], "Full-Stack": ["Full-Stack", "cobalt"] } as const;
  const pools = (["Data & AI", "DevOps / Cloud", "Full-Stack"] as const).map((d) =>
    presentable.filter((c) => c.discipline === d && c.benchStage === "Available").sort(byScore).slice(0, 3),
  );
  const out: DeckProfile[] = [];
  for (let k = 0; k < 3; k++)
    for (const pool of pools) {
      const c = pool[k];
      if (!c) continue;
      const a = availabilityOf(c);
      out.push({
        code: c.code,
        title: c.title,
        practice: practice[c.discipline][0],
        accent: practice[c.discipline][1],
        years: c.yearsExperience,
        auth: WORK_AUTH_LABEL[c.workAuthorization],
        available: a.label,
        immediate: a.tone === "avail",
        score: c.technicalScreenScore ?? 0,
        skills: c.skills.slice(0, 5).map((s) => ({ skill: s.skill, years: s.years })),
      });
    }
  return out;
}

/** Presentable consultants with delivery experience in each industry. */
export function industryCounts(): Record<string, number> {
  const m: Record<string, number> = {};
  presentable.forEach((c) => c.domains.forEach((d) => (m[d] = (m[d] ?? 0) + 1)));
  return m;
}

export function ledgerEvents(): LedgerEvent[] {
  return presentable
    .filter((c) => c.benchStage === "Available")
    .sort((a, b) => b.lastVerifiedAt.localeCompare(a.lastVerifiedAt))
    .slice(0, 24)
    .map((c) => ({ code: c.code, title: c.title, metro: c.metro, discipline: c.discipline }));
}
