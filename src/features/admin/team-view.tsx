"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { relativeAgo } from "@/lib/format";
import { useDemoNow } from "@/lib/clock";
import { STAFF, STAFF_ROLES, type StaffMember, type StaffRole } from "@/lib/platform";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/overlay";
import { useAdmin } from "./admin-store";
import { Select } from "@/components/ui/select";

const roleName = (r: StaffRole) => STAFF_ROLES.find((x) => x.id === r)!.name;

export function TeamView() {
  const { orgs } = useAdmin();
  const { notify } = useWorkspace();
  const now = useDemoNow(60_000);
  const [staff, setStaff] = useState<StaffMember[]>(STAFF);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("client_partner");
  const [err, setErr] = useState<string | null>(null);

  const add = () => {
    if (!name.trim()) return setErr("Add their name.");
    if (!email.toLowerCase().endsWith("@talentbridge.com")) return setErr("Platform team members need a @talentbridge.com address.");
    setStaff((s) => [...s, { id: crypto.randomUUID(), name: name.trim(), email: email.trim(), role, orgs: [], lastActive: new Date(now).toISOString() }]);
    notify({ tone: "ok", title: `Invited ${name.trim()}`, body: `As ${roleName(role)}.` });
    setOpen(false);
    setName("");
    setEmail("");
    setErr(null);
  };

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STAFF_ROLES.map((r) => (
          <div key={r.id} className="rounded-[12px] bg-surface p-4 ring-1 ring-line">
            <p className="flex items-baseline justify-between gap-2">
              <span className="text-[14px] font-semibold text-ink">{r.name}</span>
              <span className="tnum text-xs text-subtle">{staff.filter((s) => s.role === r.id).length}</span>
            </p>
            <p className="mt-1 text-[12.5px] leading-snug text-subtle">{r.summary}</p>
          </div>
        ))}
      </div>

      <section className="rounded-[12px] bg-surface ring-1 ring-line">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="text-[14.5px] font-semibold text-ink">Team members</h2>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Invite team member
          </Button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13.5px]">
            <thead className="bg-canvas text-xs text-subtle">
              <tr className="border-b border-line">
                <th className="px-5 py-2.5 font-medium">Name</th>
                <th className="py-2.5 font-medium">Role</th>
                <th className="py-2.5 font-medium">Assigned organizations</th>
                <th className="px-5 py-2.5 font-medium">Last active</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3">
                    <span className="block font-medium text-ink">{s.name}</span>
                    <span className="block text-xs text-subtle">{s.email}</span>
                  </td>
                  <td className="py-3">
                    <Select
                      size="sm"
                      label={`Role for ${s.name}`}
                      value={s.role}
                      options={STAFF_ROLES.map((r) => ({ value: r.id, label: r.name }))}
                      onValueChange={(r) => {
                        setStaff((xs) => xs.map((x) => (x.id === s.id ? { ...x, role: r } : x)));
                        notify({ tone: "ok", title: `${s.name} is now ${roleName(r)}` });
                      }}
                    />
                  </td>
                  <td className={cn("py-3", s.role === "client_partner" ? "text-ink-2" : "text-subtle")}>
                    {s.role === "client_partner" ? orgs.filter((o) => o.clientPartner === s.name).map((o) => o.name).join(", ") || "None yet" : "All organizations"}
                  </td>
                  <td className="tnum px-5 py-3 text-subtle">{relativeAgo(s.lastActive, now)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Invite a platform team member"
        description="Platform roles can see across customer organizations, so only invite TalentBridge staff."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={add}>
              Send invitation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name" htmlFor="t-name">
            <Input id="t-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
          <Field label="Work email" htmlFor="t-email">
            <Input id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@talentbridge.com" />
          </Field>
          <Field label="Role" htmlFor="t-role">
            <Select id="t-role" value={role} onValueChange={setRole} className="w-full" options={STAFF_ROLES.map((r) => ({ value: r.id, label: r.name, hint: r.summary }))} />
          </Field>
          {err && (
            <p role="alert" className="text-[13px] text-flag-ink">
              {err}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
