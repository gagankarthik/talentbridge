import demo from "@/data/demo.json";
import type { BlindCandidate, Candidate, RecruiterPartner, TalentRequest } from "./types";

// Demo seed. In production these come from the FastAPI service (../api).
export const candidates = demo.candidates as Candidate[];
export const recruiters = demo.recruiters as RecruiterPartner[];
export const requests = demo.requests as TalentRequest[];
export const clients = demo.clients as string[];

/** The signed-in demo recruiter. */
export const currentRecruiter = recruiters[0];

export const candidateById = new Map(candidates.map((c) => [c.id, c]));
export const candidateByCode = new Map(candidates.map((c) => [c.code, c]));

export function toBlind(c: Candidate): BlindCandidate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { firstName, lastName, email, vettingNotes, screenedBy, ...rest } = c;
  return rest;
}

/**
 * Presentation gate (PRD KPI: 100% verified right-to-work before presentation).
 * Only these candidates ever reach the recruiter inventory.
 */
export function isPresentable(c: Candidate) {
  return (
    c.isActive &&
    (c.benchStage === "Available" || c.benchStage === "Interview") &&
    c.compliance.workAuthVerified &&
    c.compliance.backgroundCheck === "Cleared"
  );
}

export const presentable = candidates.filter(isPresentable);

export const allSkills = Array.from(
  presentable.reduce((m, c) => {
    c.skills.forEach((s) => m.set(s.skill, (m.get(s.skill) ?? 0) + 1));
    return m;
  }, new Map<string, number>()),
)
  .sort((a, b) => b[1] - a[1])
  .map(([skill, count]) => ({ skill, count }));
