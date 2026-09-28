import { presentable, toBlind } from "./data";
import { availabilityOf, freshnessDays, FRESHNESS_WINDOW_DAYS } from "./format";
import type { BlindCandidate } from "./types";
import type { Facets, ScoredCandidate, SortKey, TalentQuery } from "./query";

export * from "./query";

const blindBench = presentable.map(toBlind);

type FilterKey = "rate" | "discipline" | "workAuth" | "clearance" | "timezone" | "availability" | "clouds" | "skills" | "score" | "fresh" | "text";

/** One predicate per filter so facets can be counted "with every other filter applied". */
function predicates(q: TalentQuery): Record<FilterKey, (c: BlindCandidate) => boolean> {
  const needle = q.q.trim().toLowerCase();
  const terms = needle ? needle.split(/\s+/) : [];
  return {
    rate: (c) => {
      const r = q.rateBasis === "c2c" ? c.rateC2C : c.rateW2;
      return r >= q.rateMin && r <= q.rateMax;
    },
    discipline: (c) => !q.discipline.length || q.discipline.includes(c.discipline),
    workAuth: (c) => !q.workAuth.length || q.workAuth.includes(c.workAuthorization),
    clearance: (c) => !q.clearance.length || q.clearance.includes(c.clearance),
    timezone: (c) => !q.timezone.length || q.timezone.includes(c.timezone),
    availability: (c) => !q.availability.length || q.availability.includes(c.availability),
    clouds: (c) => !q.clouds.length || q.clouds.some((x) => c.clouds.includes(x)),
    skills: (c) => !q.skills.length || q.skills.every((x) => c.skills.some((s) => s.skill === x)),
    score: (c) => !q.minScore || (c.technicalScreenScore ?? 0) >= q.minScore,
    fresh: (c) => !q.freshOnly || freshnessDays(c.lastVerifiedAt) < FRESHNESS_WINDOW_DAYS,
    text: (c) => {
      if (!terms.length) return true;
      const hay = [c.code, c.title, c.discipline, c.metro, ...c.skills.map((s) => s.skill), ...c.domains, ...c.certifications].join(" ").toLowerCase();
      return terms.every((t) => hay.includes(t));
    },
  };
}

function matchesExcept(c: BlindCandidate, preds: Record<FilterKey, (c: BlindCandidate) => boolean>, except?: FilterKey) {
  for (const k in preds) if (k !== except && !preds[k as FilterKey](c)) return false;
  return true;
}

/** Relevance: skill coverage + screen score + availability + freshness. */
function relevance(c: BlindCandidate, q: TalentQuery) {
  let s = (c.technicalScreenScore ?? 70) * 0.5;
  s += Math.max(0, 20 - availabilityOf(c).sortKey);
  s += Math.max(0, 10 - freshnessDays(c.lastVerifiedAt) * 1.5);
  if (q.skills.length) {
    const have = new Set(c.skills.map((x) => x.skill));
    s += (q.skills.filter((x) => have.has(x)).length / q.skills.length) * 20;
  }
  return Math.round(Math.min(99, s));
}

export function searchTalent(q: TalentQuery) {
  const preds = predicates(q);
  const rows: ScoredCandidate[] = blindBench.filter((c) => matchesExcept(c, preds)).map((c) => ({ ...c, match: relevance(c, q) }));
  const rate = (c: BlindCandidate) => (q.rateBasis === "c2c" ? c.rateC2C : c.rateW2);
  const by: Record<SortKey, (a: ScoredCandidate, b: ScoredCandidate) => number> = {
    match: (a, b) => b.match - a.match,
    score: (a, b) => (b.technicalScreenScore ?? 0) - (a.technicalScreenScore ?? 0),
    rate_asc: (a, b) => rate(a) - rate(b),
    rate_desc: (a, b) => rate(b) - rate(a),
    available: (a, b) => availabilityOf(a).sortKey - availabilityOf(b).sortKey,
    fresh: (a, b) => b.lastVerifiedAt.localeCompare(a.lastVerifiedAt),
  };
  rows.sort(by[q.sort] ?? by.match);
  return rows;
}

/**
 * Live facet counts: each facet is counted against every *other* active
 * filter, so a count always equals the results you'd get by ticking it.
 */
export function facetCounts(q: TalentQuery): Facets {
  const preds = predicates(q);
  const count = (except: FilterKey, get: (c: BlindCandidate) => string | string[]) => {
    const m: Record<string, number> = {};
    for (const c of blindBench) {
      if (!matchesExcept(c, preds, except)) continue;
      const v = get(c);
      (Array.isArray(v) ? v : [v]).forEach((k) => (m[k] = (m[k] ?? 0) + 1));
    }
    return m;
  };
  return {
    discipline: count("discipline", (c) => c.discipline),
    clouds: count("clouds", (c) => c.clouds),
    workAuth: count("workAuth", (c) => c.workAuthorization),
    clearance: count("clearance", (c) => c.clearance),
    timezone: count("timezone", (c) => c.timezone),
    availability: count("availability", (c) => c.availability),
    // Skills use AND semantics, so count within the current result set
    skills: count("text", (c) => (matchesExcept(c, preds) ? c.skills.map((x) => x.skill) : [])),
    fresh: blindBench.filter((c) => matchesExcept(c, preds, "fresh") && freshnessDays(c.lastVerifiedAt) < FRESHNESS_WINDOW_DAYS).length,
  };
}
