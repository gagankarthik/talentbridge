"use server";

import { candidateById, clients, currentRecruiter, isPresentable, requests } from "@/lib/data";
import { blindName, DEMO_NOW, fmtDateTime, freshnessDays, FRESHNESS_WINDOW_DAYS, LOCK_HOURS } from "@/lib/format";
import type { TalentRequest } from "@/lib/types";

export interface LockInput {
  candidateId: string;
  clientName: string;
  targetRoleTitle: string;
  proposedRate: number;
  /** Client demo clock, so locks line up with the live countdowns. */
  now: number;
}

export type LockResult =
  | { ok: true; request: TalentRequest; code: string; title: string; revealedName: string }
  | { ok: false; error: string };

/**
 * Places a 48-hour soft lock (PRD §5.3). In production this is a POST to the
 * FastAPI request engine; here it validates against the demo seed.
 */
export async function placeLock(input: LockInput): Promise<LockResult> {
  const c = candidateById.get(input.candidateId);
  if (!c || !isPresentable(c)) return { ok: false, error: "This candidate is no longer on the bench. Refresh the inventory and pick another match." };

  const client = input.clientName.trim();
  const role = input.targetRoleTitle.trim();
  if (!client) return { ok: false, error: "Add the end client so we can block duplicate submissions to them." };
  if (!role) return { ok: false, error: "Add the role title you're submitting for." };
  if (!Number.isFinite(input.proposedRate) || input.proposedRate < c.rateC2C) {
    return { ok: false, error: `Proposed rate must be at least the candidate's C2C floor of $${c.rateC2C}/hr.` };
  }
  if (freshnessDays(c.lastVerifiedAt) >= FRESHNESS_WINDOW_DAYS) {
    return { ok: false, error: `${c.code} is outside the 7-day availability window. We've pinged them to re-confirm; try again once verified.` };
  }

  const now = Number.isFinite(input.now) ? input.now : DEMO_NOW;
  const clash = requests.find(
    (r) =>
      r.candidateId === c.id &&
      r.clientName.toLowerCase() === client.toLowerCase() &&
      r.lockExpiresAt &&
      new Date(r.lockExpiresAt).getTime() > now,
  );
  if (clash) {
    return { ok: false, error: `${c.code} is already locked for ${clash.clientName} until ${fmtDateTime(clash.lockExpiresAt!)}. Choose another candidate for this client.` };
  }

  const request: TalentRequest = {
    id: crypto.randomUUID(),
    recruiterId: currentRecruiter.id,
    candidateId: c.id,
    clientName: clients.find((x) => x.toLowerCase() === client.toLowerCase()) ?? client,
    targetRoleTitle: role,
    proposedRate: Math.round(input.proposedRate),
    status: "SUBMITTED",
    lockExpiresAt: new Date(now + LOCK_HOURS * 3_600_000).toISOString(),
    createdAt: new Date(now).toISOString(),
  };
  return { ok: true, request, code: c.code, title: c.title, revealedName: blindName(c) };
}
