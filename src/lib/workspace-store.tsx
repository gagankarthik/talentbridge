"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { BlindCandidate, TalentRequest } from "./types";

// Recruiter workspace state (shortlist + requests this session created).
// Persisted to localStorage so the demo survives reloads.

export interface ShortlistItem {
  candidate: BlindCandidate;
  addedAt: string;
}

export interface MyRequest extends TalentRequest {
  code: string;
  title: string;
  revealedName: string;
}

interface Toast {
  id: number;
  title: string;
  body?: string;
  tone: "ok" | "error";
}

interface WorkspaceState {
  shortlist: ShortlistItem[];
  isShortlisted: (id: string) => boolean;
  toggleShortlist: (c: BlindCandidate) => void;
  removeFromShortlist: (id: string) => void;
  myRequests: MyRequest[];
  addRequest: (r: MyRequest) => void;
  releaseRequest: (id: string) => void;
  lockFor: (candidateId: string) => MyRequest | undefined;
  toasts: Toast[];
  notify: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
  hydrated: boolean;
}

const Ctx = createContext<WorkspaceState | null>(null);
const KEY = "talentbridge.workspace.v1";

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const toastId = useRef(0);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setShortlist(parsed.shortlist ?? []);
          setMyRequests(parsed.myRequests ?? []);
        }
      } catch {
        /* private mode or corrupt state: start clean */
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ shortlist, myRequests }));
    } catch {
      /* storage unavailable */
    }
  }, [shortlist, myRequests, hydrated]);

  const notify = useCallback((t: Omit<Toast, "id">) => {
    const id = ++toastId.current;
    setToasts((ts) => [...ts, { ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 5200);
  }, []);

  const value = useMemo<WorkspaceState>(() => {
    const ids = new Set(shortlist.map((s) => s.candidate.id));
    return {
      shortlist,
      isShortlisted: (id) => ids.has(id),
      toggleShortlist: (c) => {
        if (ids.has(c.id)) {
          setShortlist((s) => s.filter((x) => x.candidate.id !== c.id));
          notify({ tone: "ok", title: `Removed ${c.code} from shortlist` });
        } else {
          setShortlist((s) => [
            { candidate: c, addedAt: new Date().toISOString() },
            ...s,
          ]);
          notify({
            tone: "ok",
            title: `Added ${c.code} to shortlist`,
            body: `${c.title}, ${c.yearsExperience} yrs`,
          });
        }
      },
      removeFromShortlist: (id) =>
        setShortlist((s) => s.filter((x) => x.candidate.id !== id)),
      myRequests,
      addRequest: (r) => setMyRequests((rs) => [r, ...rs]),
      releaseRequest: (id) =>
        setMyRequests((rs) =>
          rs.map((r) =>
            r.id === id ? { ...r, lockExpiresAt: null, status: "DRAFT" } : r,
          ),
        ),
      lockFor: (candidateId) =>
        myRequests.find(
          (r) => r.candidateId === candidateId && r.lockExpiresAt,
        ),
      toasts,
      notify,
      dismiss: (id) => setToasts((ts) => ts.filter((x) => x.id !== id)),
      hydrated,
    };
  }, [shortlist, myRequests, toasts, notify, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace() {
  const v = useContext(Ctx);
  if (!v)
    throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return v;
}
