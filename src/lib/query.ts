// Client-safe: query shape and URL encoding. No seed data imported here.
import type { Availability, BlindCandidate, Clearance, Cloud, Discipline, Timezone, WorkAuth } from "./types";

export type SortKey = "match" | "rate_asc" | "rate_desc" | "available" | "fresh" | "score";
export type RateBasis = "c2c" | "w2";

export interface TalentQuery {
  q: string;
  discipline: Discipline[];
  skills: string[];
  clouds: Cloud[];
  workAuth: WorkAuth[];
  clearance: Clearance[];
  timezone: Timezone[];
  availability: Availability[];
  rateBasis: RateBasis;
  rateMin: number;
  rateMax: number;
  minScore: number;
  freshOnly: boolean;
  sort: SortKey;
}

export const RATE_FLOOR = 60;
export const RATE_CEIL = 160;

export const defaultQuery: TalentQuery = {
  q: "",
  discipline: [],
  skills: [],
  clouds: [],
  workAuth: [],
  clearance: [],
  timezone: [],
  availability: [],
  rateBasis: "c2c",
  rateMin: RATE_FLOOR,
  rateMax: RATE_CEIL,
  minScore: 0,
  freshOnly: false,
  sort: "match",
};

const LIST_KEYS = ["discipline", "skills", "clouds", "workAuth", "clearance", "timezone", "availability"] as const;

export function queryToParams(q: TalentQuery) {
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  for (const k of LIST_KEYS) if (q[k].length) p.set(k, q[k].join(","));
  if (q.rateBasis !== "c2c") p.set("basis", q.rateBasis);
  if (q.rateMin !== RATE_FLOOR) p.set("rmin", String(q.rateMin));
  if (q.rateMax !== RATE_CEIL) p.set("rmax", String(q.rateMax));
  if (q.minScore) p.set("score", String(q.minScore));
  if (q.freshOnly) p.set("fresh", "1");
  if (q.sort !== "match") p.set("sort", q.sort);
  return p;
}

export function paramsToQuery(p: URLSearchParams): TalentQuery {
  const list = <T,>(k: string) => (p.get(k)?.split(",").filter(Boolean) ?? []) as T[];
  return {
    q: p.get("q") ?? "",
    discipline: list("discipline"),
    skills: list("skills"),
    clouds: list("clouds"),
    workAuth: list("workAuth"),
    clearance: list("clearance"),
    timezone: list("timezone"),
    availability: list("availability"),
    rateBasis: p.get("basis") === "w2" ? "w2" : "c2c",
    rateMin: Number(p.get("rmin") ?? RATE_FLOOR),
    rateMax: Number(p.get("rmax") ?? RATE_CEIL),
    minScore: Number(p.get("score") ?? 0),
    freshOnly: p.get("fresh") === "1",
    sort: (p.get("sort") as SortKey) ?? "match",
  };
}

export interface ScoredCandidate extends BlindCandidate {
  match: number;
}

export type Facets = Record<"discipline" | "clouds" | "workAuth" | "clearance" | "timezone" | "availability" | "skills", Record<string, number>> & { fresh: number };
