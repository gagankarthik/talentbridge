"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as Switch from "@radix-ui/react-checkbox";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { relativeAgo } from "@/lib/format";
import { can, MEMBERS, ORG_ROLES, ORGANIZATION, PERMISSIONS, ROLE_PERMISSIONS, type Member, type OrgRole } from "@/lib/org";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/overlay";
import { Pill } from "@/components/ui/status";
import { IconCheck, IconSearch } from "@/components/icons";
import { Select } from "@/components/ui/select";

// Signed-in member for this demo (owner of the organization)
const ME = MEMBERS[0];

function Card({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section className="rounded-[12px] bg-surface ring-1 ring-line">
      <header className="border-b border-line px-5 py-4">
        <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
      {footer && <footer className="flex justify-end gap-2 border-t border-line bg-canvas/60 px-5 py-3">{footer}</footer>}
    </section>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={(v) => onChange(v === true)}
      aria-label={label}
      className="relative h-6 w-11 shrink-0 rounded-full bg-line-strong transition-colors data-[state=checked]:bg-cobalt"
    >
      <span className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-surface shadow transition-transform", checked && "translate-x-5")} />
    </Switch.Root>
  );
}

const roleName = (r: OrgRole) => ORG_ROLES.find((x) => x.id === r)!.name;
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

function General() {
  const { notify } = useWorkspace();
  const [name, setName] = useState(ORGANIZATION.name);
  const [address, setAddress] = useState(ORGANIZATION.address);
  const [industry, setIndustry] = useState(ORGANIZATION.industry);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <Card
        title="Organization details"
        footer={
          <Button variant="primary" onClick={() => notify({ tone: "ok", title: "Organization details saved" })}>
            Save changes
          </Button>
        }
      >
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-[14px] bg-night text-[18px] font-semibold text-brand-bright">{initials(name)}</span>
          <div className="text-[13px]">
            <p className="font-medium text-ink">Logo</p>
            <p className="text-subtle">Initials are used until you upload a logo.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Organization name" htmlFor="o-name">
            <Input inputSize="lg" id="o-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Primary domain" htmlFor="o-domain" hint="Verified. Contact support to change it.">
            <Input inputSize="lg" id="o-domain" value={ORGANIZATION.domain} disabled className="bg-canvas text-muted" />
          </Field>
          <Field label="Industry" htmlFor="o-industry">
            <Input inputSize="lg" id="o-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </Field>
          <Field label="Location" htmlFor="o-address">
            <Input inputSize="lg" id="o-address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Plan">
        <p className="text-[20px] font-semibold text-ink">{ORGANIZATION.plan}</p>
        <p className="tnum mt-1 text-[13px] text-subtle">
          {MEMBERS.filter((m) => m.status !== "suspended").length} of {ORGANIZATION.seats} seats used
        </p>
        <span className="mt-3 block h-2 overflow-hidden rounded-full bg-line">
          <span className="block h-full rounded-full bg-cobalt" style={{ width: `${(MEMBERS.length / ORGANIZATION.seats) * 100}%` }} />
        </span>
        <dl className="mt-5 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-subtle">Organization ID</dt>
            <dd className="font-mono text-ink">{ORGANIZATION.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-subtle">Customer since</dt>
            <dd className="text-ink">March 2025</dd>
          </div>
        </dl>
        <Button className="mt-5 w-full" onClick={() => notify({ tone: "ok", title: "Your client partner will be in touch about your plan" })}>
          Talk to us about seats
        </Button>
      </Card>
    </div>
  );
}

function Members() {
  const { notify } = useWorkspace();
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [q, setQ] = useState("");
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrgRole>("recruiter");
  const [err, setErr] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Member | null>(null);
  const canManage = can(ME.role, "members.manage");

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return members.filter((m) => !n || `${m.name} ${m.email} ${m.title}`.toLowerCase().includes(n));
  }, [members, q]);

  const invite = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Enter a valid email address.");
    if (!ORGANIZATION.allowedDomains.some((d) => email.toLowerCase().endsWith(`@${d}`))) return setErr(`Only ${ORGANIZATION.allowedDomains.map((d) => "@" + d).join(", ")} addresses can join this organization.`);
    if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) return setErr("That person is already a member or has an invite.");
    setMembers((ms) => [...ms, { id: crypto.randomUUID(), name: email.split("@")[0].replace(/[._]/g, " "), email, title: "Invited", role, status: "invited", lastActive: null, mfa: false }]);
    notify({ tone: "ok", title: `Invitation sent to ${email}`, body: `They'll join as ${roleName(role)}.` });
    setInviting(false);
    setEmail("");
    setErr(null);
  };

  return (
    <>
      <div className="rounded-[12px] bg-surface ring-1 ring-line">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5">
          <div className="relative w-full sm:max-w-[300px]">
            <IconSearch size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search members" aria-label="Search members" className="pl-9" />
          </div>
          <p className="tnum text-[13px] text-subtle sm:ml-auto">
            {members.length} of {ORGANIZATION.seats} seats
          </p>
          {canManage && (
            <Button variant="primary" onClick={() => setInviting(true)}>
              Invite member
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13.5px]">
            <thead className="bg-canvas text-xs text-subtle">
              <tr className="border-b border-line">
                <th className="px-5 py-2.5 font-medium">Member</th>
                <th className="py-2.5 font-medium">Role</th>
                <th className="py-2.5 font-medium">Status</th>
                <th className="py-2.5 font-medium">Two-factor</th>
                <th className="py-2.5 font-medium">Last active</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-wash text-[12px] font-semibold text-brand capitalize">{initials(m.name)}</span>
                      <span className="min-w-0">
                        <span className="block font-medium text-ink capitalize">
                          {m.name}
                          {m.id === ME.id && <span className="ml-1.5 text-xs font-normal text-subtle">(you)</span>}
                        </span>
                        <span className="block truncate text-xs text-subtle">{m.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="py-3">
                    {canManage && m.role !== "owner" && m.id !== ME.id ? (
                      <Select
                        size="sm"
                        label={`Role for ${m.name}`}
                        value={m.role}
                        options={ORG_ROLES.filter((r) => r.id !== "owner").map((r) => ({ value: r.id, label: r.name }))}
                        onValueChange={(r) => {
                          setMembers((ms) => ms.map((x) => (x.id === m.id ? { ...x, role: r } : x)));
                          notify({ tone: "ok", title: `${m.name} is now ${roleName(r)}` });
                        }}
                      />
                    ) : (
                      <span className="font-medium text-ink">{roleName(m.role)}</span>
                    )}
                  </td>
                  <td className="py-3">
                    {m.status === "active" ? <Pill tone="avail">Active</Pill> : m.status === "invited" ? <Pill tone="notice">Invite pending</Pill> : <Pill tone="placed">Suspended</Pill>}
                  </td>
                  <td className="py-3">{m.mfa ? <span className="inline-flex items-center gap-1 text-avail-ink"><IconCheck size={14} strokeWidth={2.25} /> On</span> : <span className="text-subtle">Off</span>}</td>
                  <td className="tnum py-3 text-subtle">{m.lastActive ? relativeAgo(m.lastActive) : "Never"}</td>
                  <td className="px-5 py-3 text-right">
                    {canManage && m.role !== "owner" && (
                      <Button size="sm" variant="ghost" onClick={() => setRemoving(m)}>
                        {m.status === "invited" ? "Revoke" : "Remove"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={inviting}
        onOpenChange={setInviting}
        title="Invite a member"
        description="They'll get an email to join your organization."
        footer={
          <>
            <Button variant="ghost" onClick={() => setInviting(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={invite}>
              Send invitation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Work email" htmlFor="i-email" hint={`Must be an @${ORGANIZATION.allowedDomains[0]} address.`}>
            <Input id="i-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          </Field>
          <fieldset>
            <legend className="text-[13px] font-medium text-ink-2">Role</legend>
            <div className="mt-2 space-y-1.5">
              {ORG_ROLES.filter((r) => r.id !== "owner").map((r) => (
                <label key={r.id} className={cn("flex cursor-pointer gap-3 rounded-[10px] p-3 ring-1 ring-inset", role === r.id ? "bg-cobalt-wash ring-cobalt" : "ring-line hover:bg-canvas")}>
                  <input type="radio" name="role" checked={role === r.id} onChange={() => setRole(r.id)} className="mt-0.5 accent-[var(--color-cobalt)]" />
                  <span>
                    <span className="block text-[13.5px] font-medium text-ink">{r.name}</span>
                    <span className="block text-xs text-subtle">{r.summary}</span>
                  </span>
                </label>
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
        open={!!removing}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={removing?.status === "invited" ? `Revoke the invitation for ${removing?.email}?` : `Remove ${removing?.name}?`}
        description={removing?.status === "invited" ? "The invitation link will stop working." : "They'll lose access straight away. Their holds and requests stay with the organization."}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRemoving(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setMembers((ms) => ms.filter((x) => x.id !== removing!.id));
                notify({ tone: "ok", title: removing!.status === "invited" ? "Invitation revoked" : `${removing!.name} removed` });
                setRemoving(null);
              }}
            >
              {removing?.status === "invited" ? "Revoke invitation" : "Remove member"}
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-muted">You can invite them again at any time.</p>
      </Modal>
    </>
  );
}

function Roles() {
  const groups = Array.from(new Set(PERMISSIONS.map((p) => p.group)));
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {ORG_ROLES.map((r) => (
          <div key={r.id} className="rounded-[12px] bg-surface p-4 ring-1 ring-line">
            <p className="text-[14px] font-semibold text-ink">{r.name}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-subtle">{r.summary}</p>
            <p className="tnum mt-3 text-xs text-muted">{MEMBERS.filter((m) => m.role === r.id).length} members</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-[12px] bg-surface ring-1 ring-line">
        <table className="w-full min-w-[760px] text-left text-[13px]">
          <caption className="sr-only">Permissions by role</caption>
          <thead className="bg-canvas text-xs text-subtle">
            <tr className="border-b border-line">
              <th className="px-5 py-2.5 font-medium">Permission</th>
              {ORG_ROLES.map((r) => (
                <th key={r.id} className="px-3 py-2.5 text-center font-medium">
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g}>
              <tr className="bg-paper">
                <th colSpan={ORG_ROLES.length + 1} scope="colgroup" className="px-5 py-2 text-left text-xs font-semibold text-ink-2">
                  {g}
                </th>
              </tr>
              {PERMISSIONS.filter((p) => p.group === g).map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <th scope="row" className="px-5 py-2.5 font-normal text-ink">
                    {p.name}
                  </th>
                  {ORG_ROLES.map((r) => (
                    <td key={r.id} className="px-3 py-2.5 text-center">
                      {ROLE_PERMISSIONS[r.id].includes(p.id) ? (
                        <IconCheck size={16} strokeWidth={2.25} className="mx-auto text-avail" aria-label="Allowed" />
                      ) : (
                        <span className="text-faint" aria-label="Not allowed">
                          –
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}

function Security() {
  const { notify } = useWorkspace();
  const [mfa, setMfa] = useState(ORGANIZATION.mfaRequired);
  const [enforceSso, setEnforceSso] = useState(ORGANIZATION.sso.enforced);
  const [domains, setDomains] = useState(ORGANIZATION.allowedDomains.join(", "));
  const row = (title: string, body: string, control: React.ReactNode) => (
    <div className="flex items-start justify-between gap-6 border-b border-line py-4 first:pt-0 last:border-0 last:pb-0">
      <div>
        <p className="text-[14px] font-medium text-ink">{title}</p>
        <p className="mt-0.5 max-w-lg text-[13px] text-subtle">{body}</p>
      </div>
      {control}
    </div>
  );
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Sign-in">
        {row("Single sign-on", `Connected to ${ORGANIZATION.sso.provider}.`, <Pill tone="avail">Connected</Pill>)}
        {row("Require single sign-on", "Members must sign in through your identity provider. Passwords are disabled.", <Toggle checked={enforceSso} onChange={(v) => { setEnforceSso(v); notify({ tone: "ok", title: v ? "SSO is now required" : "Password sign-in allowed" }); }} label="Require single sign-on" />)}
        {row("Require two-factor authentication", "Members without two-factor are asked to set it up at their next sign-in.", <Toggle checked={mfa} onChange={(v) => { setMfa(v); notify({ tone: "ok", title: v ? "Two-factor is now required" : "Two-factor is optional" }); }} label="Require two-factor authentication" />)}
      </Card>
      <Card
        title="Allowed email domains"
        footer={
          <Button variant="primary" onClick={() => notify({ tone: "ok", title: "Allowed domains saved" })}>
            Save domains
          </Button>
        }
      >
        <Field label="Domains" htmlFor="s-domains" hint="Separate domains with commas.">
          <Input inputSize="lg" id="s-domains" value={domains} onChange={(e) => setDomains(e.target.value)} />
        </Field>
      </Card>
    </div>
  );
}

export function OrganizationSettings() {
  const [tab, setTab] = useState("general");
  return (
    <Tabs.Root value={tab} onValueChange={setTab}>
      <div className="border-b border-line bg-surface px-4 sm:px-6">
        <Tabs.List aria-label="Organization settings" className="no-scrollbar -mb-px flex gap-1 overflow-x-auto">
          {[
            ["general", "General"],
            ["members", "Members"],
            ["roles", "Roles and permissions"],
            ["security", "Security"],
          ].map(([v, l]) => (
            <Tabs.Trigger
              key={v}
              value={v}
              className="shrink-0 border-b-2 border-transparent px-3 py-3 text-[14px] font-medium whitespace-nowrap text-subtle hover:text-ink data-[state=active]:border-cobalt data-[state=active]:text-ink"
            >
              {l}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <Tabs.Content value="general">
          <General />
        </Tabs.Content>
        <Tabs.Content value="members">
          <Members />
        </Tabs.Content>
        <Tabs.Content value="roles">
          <Roles />
        </Tabs.Content>
        <Tabs.Content value="security">
          <Security />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
}
