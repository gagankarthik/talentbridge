"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AUDIT, CURRENT_STAFF, ORGS, type AuditEvent, type PlatformOrg } from "@/lib/platform";
import { demoNow } from "@/lib/clock";
import type { Candidate } from "@/lib/types";

// Platform console state. Every change an admin makes is written to the
// audit log, which is the point: support access and plan changes are traceable.

export interface SupportSession {
  orgId: string;
  reason: string;
  startedAt: number;
  expiresAt: number;
}

interface AdminState {
  orgs: PlatformOrg[];
  audit: AuditEvent[];
  session: SupportSession | null;
  createOrg: (o: PlatformOrg) => void;
  updateOrg: (id: string, patch: Partial<PlatformOrg>, action: string, detail: string) => void;
  startSession: (orgId: string, reason: string, minutes: number) => void;
  endSession: () => void;
  /** Candidates created in the console, and edits to seeded candidates */
  addedCandidates: Candidate[];
  candidateEdits: Record<string, Partial<Candidate>>;
  addCandidate: (c: Candidate) => void;
  updateCandidate: (id: string, code: string, patch: Partial<Candidate>, detail: string) => void;
  ready: boolean;
}

const Ctx = createContext<AdminState | null>(null);
const KEY = "talentbridge.admin.v1";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [orgs, setOrgs] = useState<PlatformOrg[]>(ORGS);
  const [audit, setAudit] = useState<AuditEvent[]>(AUDIT);
  const [session, setSession] = useState<SupportSession | null>(null);
  const [ready, setReady] = useState(false);
  const [addedCandidates, setAdded] = useState<Candidate[]>([]);
  const [candidateEdits, setEdits] = useState<Record<string, Partial<Candidate>>>({});

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const p = JSON.parse(raw);
          if (p.orgs) setOrgs(p.orgs);
          if (p.audit) setAudit(p.audit);
          if (p.session && p.session.expiresAt > demoNow()) setSession(p.session);
          if (p.addedCandidates) setAdded(p.addedCandidates);
          if (p.candidateEdits) setEdits(p.candidateEdits);
        }
      } catch {
        /* start from seed */
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ orgs, audit, session, addedCandidates, candidateEdits }));
    } catch {
      /* storage unavailable */
    }
  }, [orgs, audit, session, addedCandidates, candidateEdits, ready]);

  const log = useCallback((orgId: string | null, action: string, detail: string) => {
    setAudit((a) => [{ id: crypto.randomUUID(), at: new Date(demoNow()).toISOString(), actor: CURRENT_STAFF.name, actorType: "platform", orgId, action, detail }, ...a]);
  }, []);

  const value = useMemo<AdminState>(
    () => ({
      orgs,
      audit,
      session,
      createOrg: (o) => {
        setOrgs((os) => [o, ...os]);
        log(o.id, "Created organization", `${o.plan} plan, ${o.seats} seats. Owner invite sent to ${o.owner.email}`);
      },
      updateOrg: (id, patch, action, detail) => {
        setOrgs((os) => os.map((o) => (o.id === id ? { ...o, ...patch } : o)));
        log(id, action, detail);
      },
      startSession: (orgId, reason, minutes) => {
        const now = demoNow();
        setSession({ orgId, reason, startedAt: now, expiresAt: now + minutes * 60_000 });
        log(orgId, "Support session started", `Reason: ${reason}. Expires in ${minutes} minutes`);
      },
      endSession: () => {
        if (session) log(session.orgId, "Support session ended", `Duration ${Math.max(1, Math.round((demoNow() - session.startedAt) / 60_000))} minutes`);
        setSession(null);
      },
      addedCandidates,
      candidateEdits,
      addCandidate: (c) => {
        setAdded((cs) => [c, ...cs]);
        log(null, "Added candidate", `${c.code}, ${c.title} (${c.benchStage})`);
      },
      updateCandidate: (id, code, patch, detail) => {
        if (addedCandidates.some((c) => c.id === id)) setAdded((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
        else setEdits((e) => ({ ...e, [id]: { ...e[id], ...patch } }));
        log(null, "Updated candidate", `${code}. ${detail}`);
      },
      ready,
    }),
    [orgs, audit, session, log, addedCandidates, candidateEdits, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin must be used inside <AdminProvider>");
  return v;
}
