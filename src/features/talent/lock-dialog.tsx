"use client";

import { useState, useTransition } from "react";
import { placeLock } from "@/app/actions";
import { demoNow } from "@/lib/clock";
import { freshnessDays, FRESHNESS_WINDOW_DAYS, LOCK_HOURS, usd } from "@/lib/format";
import type { BlindCandidate } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { Modal } from "@/components/ui/overlay";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { IconAlert } from "@/components/icons";

export const CLIENT_SUGGESTIONS = [
  "Meridian Federal Bank",
  "Crestline Retail Holdings",
  "Atlas Mutual Insurance",
  "Pinecrest Health System",
  "Orion Freight & Logistics",
  "Granite State Credit Union",
  "Lakeshore Capital Markets",
];

export function LockDialog({ c, open, onOpenChange }: { c: BlindCandidate; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addRequest, notify } = useWorkspace();
  const [client, setClient] = useState("");
  const [role, setRole] = useState(c.title);
  const [rate, setRate] = useState(String(c.rateC2C + 20));
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const stale = freshnessDays(c.lastVerifiedAt) >= FRESHNESS_WINDOW_DAYS;
  const spread = Number(rate) - c.rateC2C;

  const submit = () =>
    start(async () => {
      setError(null);
      const res = await placeLock({ candidateId: c.id, clientName: client, targetRoleTitle: role, proposedRate: Number(rate), now: demoNow() });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      addRequest({ ...res.request, code: res.code, title: res.title, revealedName: res.revealedName });
      notify({ tone: "ok", title: `Locked ${res.code} for ${res.request.clientName}`, body: `${res.revealedName} is held for you for ${LOCK_HOURS} hours.` });
      onOpenChange(false);
    });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Place a ${LOCK_HOURS}-hour lock on ${c.code}`}
      description="Other agencies can't submit this candidate to the same end client while your lock is active."
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={pending || stale}>
            {pending ? "Placing lock…" : "Place lock"}
          </Button>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {stale && (
          <p className="flex gap-2 rounded-ctl bg-flag-bg p-3 text-[13px] text-flag-ink">
            <IconAlert size={16} className="mt-px shrink-0" />
            Availability was last confirmed {freshnessDays(c.lastVerifiedAt)} days ago. Locks open again once the consultant re-confirms.
          </p>
        )}
        <Field label="End client" htmlFor="lock-client" hint="Locks apply to this client only.">
          <Input id="lock-client" list="client-list" value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Meridian Federal Bank" autoFocus />
          <datalist id="client-list">
            {CLIENT_SUGGESTIONS.map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>
        </Field>
        <Field label="Role title" htmlFor="lock-role">
          <Input id="lock-role" value={role} onChange={(e) => setRole(e.target.value)} />
        </Field>
        <Field
          label="Proposed bill rate to client ($/hr)"
          htmlFor="lock-rate"
          hint={
            <span className="tnum">
              Candidate C2C floor {usd.format(c.rateC2C)}/hr.{" "}
              {spread > 0 && <span className="text-avail-ink">Spread {usd.format(spread)}/hr.</span>}
            </span>
          }
        >
          <Input id="lock-rate" type="number" inputMode="numeric" min={c.rateC2C} value={rate} onChange={(e) => setRate(e.target.value)} className="tnum" />
        </Field>
        {error && (
          <p role="alert" className="flex gap-2 rounded-ctl bg-flag-bg p-3 text-[13px] text-flag-ink">
            <IconAlert size={16} className="mt-px shrink-0" />
            {error}
          </p>
        )}
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}
