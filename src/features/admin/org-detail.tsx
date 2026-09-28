"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { relativeAgo } from "@/lib/format";
import { useDemoNow } from "@/lib/clock";
import { MEMBERS, ORG_ROLES } from "@/lib/org";
import { ORG_MEMBERS, PLANS, STAFF, type OrgMember } from "@/lib/platform";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/overlay";
import { Pill } from "@/components/ui/status";
import { useAdmin } from "./admin-store";
import { STATUS_PILL } from "./org-list";
import { Select } from "@/components/ui/select";

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-[12px] bg-surface ring-1 ring-line">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 className="text-[14.5px] font-semibold text-ink">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-[13.5px]">
      <dt className="text-subtle">{k}</dt>
      <dd className="text-right text-ink">{children}</dd>
    </div>
  );
}


export function OrgDetail({ id }: { id: string }) {
  const { orgs, audit, session, updateOrg, startSession, endSession } = useAdmin();
  const { notify } = useWorkspace();
  const now = useDemoNow(1000);
  const [supportOpen, setSupportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const o = orgs.find((x) => x.id === id);
  if (!o)
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-[16px] font-semibold text-ink">Organization not found</p>
        <Link href="/admin/organizations" className="mt-3 inline-block text-[14px] font-medium text-cobalt hover:underline">
          Back to organizations
        </Link>
      </div>
    );

  const members: OrgMember[] =
    o.id === "org_keystone" ? MEMBERS.map((m) => ({ name: m.name, email: m.email, role: m.role, status: m.status === "invited" ? "invited" : "active" })) : ORG_MEMBERS[o.id] ?? [{ name: o.owner.name, email: o.owner.email, role: "owner", status: o.owner.invitePending ? "invited" : "active" }];
  const events = audit.filter((e) => e.orgId === o.id);
  const liveHere = session && session.orgId === o.id && session.expiresAt > now;
  const busyElsewhere = session && session.orgId !== o.id && session.expiresAt > now;

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-center gap-4 rounded-[12px] bg-surface p-5 ring-1 ring-line">
        <span className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-night text-[15px] font-semibold text-brand-bright">{o.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-[18px] font-semibold text-ink">{o.name}</span>
            <Pill tone={STATUS_PILL[o.status].tone}>{STATUS_PILL[o.status].label}</Pill>
          </p>
          <p className="text-[13px] text-subtle">
            {o.domain}, {o.type}, customer since {o.createdAt}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {o.owner.invitePending && (
            <Button onClick={() => updateOrg(o.id, {}, "Resent owner invite", `To ${o.owner.email}`)}>
              Resend owner invite
            </Button>
          )}
          {liveHere ? (
            <Button variant="dark" onClick={endSession}>
              End support session
            </Button>
          ) : (
            <Button onClick={() => setSupportOpen(true)} disabled={o.status === "suspended" || !!busyElsewhere} title={busyElsewhere ? "End your other support session first" : undefined}>
              Start support session
            </Button>
          )}
          {o.status === "suspended" ? (
            <Button variant="primary" onClick={() => updateOrg(o.id, { status: "active" }, "Reactivated organization", "Access restored for all members")}>
              Reactivate
            </Button>
          ) : (
            <Button variant="danger" onClick={() => setSuspendOpen(true)}>
              Suspend
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="Plan and seats">
          <dl className="-my-2 divide-y divide-line">
            <Row k="Plan">
              <Select
                size="sm"
                label="Plan"
                align="end"
                value={o.plan}
                options={PLANS.map((p) => ({ value: p.id, label: p.id, hint: `${p.seats} seats` }))}
                onValueChange={(plan) => {
                  const seats = PLANS.find((p) => p.id === plan)!.seats;
                  if (seats < o.members) {
                    notify({ tone: "error", title: `${plan} allows ${seats} seats`, body: `${o.name} has ${o.members} members. Remove members first.` });
                    return;
                  }
                  updateOrg(o.id, { plan, seats }, "Changed plan", `${o.plan} to ${plan}, ${seats} seats`);
                }}
              />
            </Row>
            <Row k="Seats used">
              <span className="tnum">
                {o.members} of {o.seats}
              </span>
            </Row>
            <Row k="Active holds">
              <span className="tnum">{o.activeHolds}</span>
            </Row>
            <Row k="Requests, last 30 days">
              <span className="tnum">{o.requests30}</span>
            </Row>
          </dl>
        </Card>

        <Card title="Ownership">
          <dl className="-my-2 divide-y divide-line">
            <Row k="Owner">
              <span className="block">{o.owner.name}</span>
              <span className="block text-xs text-subtle">{o.owner.email}</span>
            </Row>
            <Row k="Client partner">
              <Select
                size="sm"
                label="Client partner"
                align="end"
                value={o.clientPartner}
                options={STAFF.filter((s) => s.role === "client_partner").map((s) => ({ value: s.name, label: s.name }))}
                onValueChange={(v) => updateOrg(o.id, { clientPartner: v }, "Reassigned client partner", `${o.clientPartner} to ${v}`)}
              />
            </Row>
            <Row k="Last active">{o.lastActive ? relativeAgo(o.lastActive, now) : "Not yet"}</Row>
          </dl>
        </Card>

        <Card title="Security">
          <dl className="-my-2 divide-y divide-line">
            <Row k="Single sign-on">{o.sso ? <Pill tone="avail">Connected</Pill> : <span className="text-subtle">Not set up</span>}</Row>
            <Row k="Two-factor">{o.mfaRequired ? "Required" : <span className="text-subtle">Optional</span>}</Row>
          </dl>
          <p className="mt-3 text-xs text-subtle">The customer&apos;s own admins control these settings.</p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <Card title="Members" action={<span className="tnum text-xs text-subtle">{members.length < o.members ? `Showing ${members.length} of ${o.members}` : `${o.members} members`}</span>}>
          <ul className="-my-2 divide-y divide-line">
            {members.map((m) => (
              <li key={m.email} className="flex items-center justify-between gap-4 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-medium text-ink">{m.name}</span>
                  <span className="block truncate text-xs text-subtle">{m.email}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {m.status === "invited" && <Pill tone="notice">Invite pending</Pill>}
                  <span className="text-[13px] text-ink-2">{ORG_ROLES.find((r) => r.id === m.role)!.name}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Activity"
          action={
            <Link href={`/admin/audit?org=${o.id}`} className="text-[13px] font-medium text-cobalt hover:underline">
              Full log
            </Link>
          }
        >
          {events.length === 0 ? (
            <p className="py-4 text-center text-[13.5px] text-subtle">No activity yet.</p>
          ) : (
            <ol className="-my-2 divide-y divide-line">
              {events.slice(0, 8).map((e) => (
                <li key={e.id} className="py-2.5 text-[13px]">
                  <p className="flex justify-between gap-3">
                    <span className="font-medium text-ink">{e.action}</span>
                    <span className="tnum shrink-0 text-xs text-subtle">{relativeAgo(e.at, now)}</span>
                  </p>
                  <p className="text-subtle">
                    {e.actor}. {e.detail}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <Modal
        open={supportOpen}
        onOpenChange={setSupportOpen}
        title={`Start a support session for ${o.name}`}
        description="You'll see their workspace as they do. The session is time-limited and every action is logged."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSupportOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (reason.trim().length < 5) return setErr("Add a reason. It is recorded in the customer's audit log.");
                startSession(o.id, reason.trim(), minutes);
                setSupportOpen(false);
                setReason("");
                setErr(null);
              }}
            >
              Start session
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Reason" htmlFor="sup-reason" hint="For example, a ticket number or the issue you're helping with.">
            <Input id="sup-reason" value={reason} onChange={(e) => setReason(e.target.value)} autoFocus />
          </Field>
          <fieldset>
            <legend className="text-[13px] font-medium text-ink-2">Duration</legend>
            <div className="mt-1.5 flex gap-2">
              {[15, 30, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={minutes === m}
                  onClick={() => setMinutes(m)}
                  className={cn("h-9 rounded-full px-4 text-[13px] ring-1 ring-inset", minutes === m ? "bg-cobalt-wash font-medium text-cobalt-strong ring-cobalt" : "ring-line-strong hover:bg-canvas")}
                >
                  {m} minutes
                </button>
              ))}
            </div>
          </fieldset>
          {err && (
            <p role="alert" className="text-[13px] text-flag-ink">
              {err}
            </p>
          )}
        </div>
      </Modal>

      <Modal
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        title={`Suspend ${o.name}?`}
        description="All members lose access straight away and their active holds are released. You can reactivate at any time."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSuspendOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (suspendReason.trim().length < 5) return setErr("Add a reason for the suspension.");
                if (liveHere) endSession();
                updateOrg(o.id, { status: "suspended", activeHolds: 0 }, "Suspended organization", suspendReason.trim());
                setSuspendOpen(false);
                setSuspendReason("");
                setErr(null);
              }}
            >
              Suspend organization
            </Button>
          </>
        }
      >
        <Field label="Reason" htmlFor="sus-reason">
          <Input id="sus-reason" value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} />
        </Field>
        {err && (
          <p role="alert" className="mt-3 text-[13px] text-flag-ink">
            {err}
          </p>
        )}
      </Modal>
    </div>
  );
}
