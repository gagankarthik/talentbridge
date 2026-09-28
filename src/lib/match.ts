import { presentable, toBlind } from "./data";
import { availabilityOf, freshnessDays } from "./format";
import type { BlindCandidate, Cloud, Discipline } from "./types";

// Keyword-based stand-in for the pgvector matching engine (PRD Phase 3).
// Same contract: job spec text in, ranked blind candidates with reasons out.

const VOCAB = Array.from(new Set(presentable.flatMap((c) => c.skills.map((s) => s.skill))));
const CLOUDS: Cloud[] = ["AWS", "Azure", "GCP"];

export interface ParsedSpec {
  skills: string[];
  clouds: Cloud[];
  minYears: number | null;
  maxRate: number | null;
  discipline: Discipline | null;
  needsClearance: boolean;
  citizenOnly: boolean;
}

export interface MatchResult {
  candidate: BlindCandidate;
  score: number;
  matched: string[];
  missing: string[];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function parseSpec(text: string): ParsedSpec {
  const t = text.toLowerCase();
  const has = (term: string) => new RegExp(`(^|[^a-z0-9])${escape(term.toLowerCase())}([^a-z0-9]|$)`).test(t);
  const skills = VOCAB.filter((s) => has(s) || (s === "Kubernetes" && has("k8s")) || (s === "PostgreSQL" && has("postgres")));
  const clouds = CLOUDS.filter((c) => has(c) || (c === "GCP" && has("google cloud")));
  const years = t.match(/(\d{1,2})\s*\+?\s*(?:years|yrs)/);
  const rate = t.match(/\$\s?(\d{2,3})(?:\s*(?:\/|per)\s*(?:hr|hour))?/);
  const score = (words: string[]) => words.filter((w) => t.includes(w)).length;
  const disc: [Discipline, number][] = [
    ["Data & AI", score(["data", "ml", "machine learning", "spark", "pipeline", "analytics", "ai "])],
    ["DevOps / Cloud", score(["devops", "sre", "terraform", "kubernetes", "platform", "infrastructure", "cloud"])],
    ["Full-Stack", score(["react", "frontend", "full-stack", "full stack", "java", "node", ".net", "ui"])],
  ];
  disc.sort((a, b) => b[1] - a[1]);
  return {
    skills,
    clouds,
    minYears: years ? Number(years[1]) : null,
    maxRate: rate ? Number(rate[1]) : null,
    discipline: disc[0][1] > 0 ? disc[0][0] : null,
    needsClearance: /clearance|secret|public trust/.test(t),
    citizenOnly: /us citizen|citizens only|usc only/.test(t),
  };
}

export function matchSpec(text: string, limit = 8): { spec: ParsedSpec; results: MatchResult[] } {
  const spec = parseSpec(text);
  const results: MatchResult[] = [];
  for (const full of presentable) {
    if (spec.citizenOnly && full.workAuthorization !== "US_CITIZEN") continue;
    if (spec.needsClearance && full.clearance === "None") continue;
    const c = toBlind(full);
    const have = new Set(c.skills.map((s) => s.skill));
    const matched = spec.skills.filter((s) => have.has(s));
    const missing = spec.skills.filter((s) => !have.has(s));
    let score = spec.skills.length ? (matched.length / spec.skills.length) * 55 : 25;
    if (spec.discipline && c.discipline === spec.discipline) score += 12;
    if (spec.clouds.length && spec.clouds.some((x) => c.clouds.includes(x))) score += 8;
    if (spec.minYears) score += c.yearsExperience >= spec.minYears ? 8 : -10;
    if (spec.maxRate) score += c.rateC2C <= spec.maxRate ? 6 : -14;
    score += ((c.technicalScreenScore ?? 70) - 70) * 0.35;
    score += Math.max(0, 6 - availabilityOf(c).sortKey / 3);
    score -= Math.max(0, freshnessDays(c.lastVerifiedAt) - 6);
    results.push({ candidate: c, score: Math.max(0, Math.min(99, Math.round(score))), matched, missing });
  }
  results.sort((a, b) => b.score - a.score);
  return { spec, results: results.slice(0, limit) };
}
