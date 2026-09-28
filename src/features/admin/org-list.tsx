"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { relativeAgo } from "@/lib/format";
import { useDemoNow } from "@/lib/clock";
import { PLANS, STAFF, type OrgStatus, type Plan, type PlatformOrg } from "@/lib/platform";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Field, Input, Segmented } from "@/components/ui/form";
import { Sheet } from "@/components/ui/overlay";
import { Pill } from "@/components/ui/status";
import { IconSearch } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { Select } from "@/components/ui/select";

export const STATUS_PILL: Record<OrgStatus, { tone: "avail" | "notice" | "placed"; label: string }> = {
  active: { tone: "avail", label: "Active" },
  onboarding: { tone: "notice", label: "Onboarding" },
  suspended: { tone: "placed", label: "Suspended" },
};

function CreateOrg({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { orgs, createOrg } = useAdmin();
  const { notify } = useWorkspace();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [type, setType] = useState<PlatformOrg["type"]>("Staffing agency");
  const [plan, setPlan] = useState<Plan>("Partner");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [partner, setPartner] = useState(STAFF.find((s) => s.role === "client_partner")!.name);
  const [err, setErr] = useState<string | null>(null);

  const submit = () => {
    const d = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!name.trim()) return setErr("Add the organization's name.");
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d)) return setErr("Enter the company's email domain, e.g. acme.com.");
    if (orgs.some((o) => o.domain === d)) return setErr(`${d} already belongs to an organization.`);
    if (!ownerName.trim()) return setErr("Add the owner's name.");
    if (!ownerEmail.toLowerCase().endsWith(`@${d}`)) return setErr(`The owner's email must be an @${d} address.`);
    const seats = PLANS.find((p) => p.id === plan)!.seats;
    const id = `org_${d.split(".")[0].replace(/[^a-z0-9]/g, "")}`;
    createOrg({
      id,
      name: name.trim(),
      domain: d,
      type,
      plan,
      seats,
      members: 1,
      status: "onboarding",
      owner: { name: ownerName.trim(), email: ownerEmail.trim(), invitePending: true },
      clientPartner: partner,
      sso: false,
      mfaRequired: false,
      createdAt: new Date().toISOString().slice(0, 10),
      lastActive: null,
      activeHolds: 0,
      requests30: 0,
    });
    notify({ tone: "ok", title: `${name.trim()} created`, body: `Owner invite sent to ${ownerEmail.trim()}.` });
    onOpenChange(false);
    setName("");
    setDomain("");
    setOwnerName("");
    setOwnerEmail("");
    setErr(null);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Create organization"
      description="Sets up a new customer and invites their first owner."
      width="max-w-[520px]"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            Create and send invite
          </Button>
        </div>
      }
    >
      <div className="space-y-5 p-6">
        <Field label="Organization name" htmlFor="c-name">
          <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </Field>
        <Field label="Email domain" htmlFor="c-domain" hint="Members can only join with this domain.">
          <Input id="c-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="acme.com" />
        </Field>
        <div>
          <p className="mb-1.5 text-[13px] font-medium text-ink-2">Customer type</p>
          <Segmented label="Customer type" value={type} onChange={setType} options={[{ value: "Staffing agency", label: "Staffing agency" }, { value: "Enterprise", label: "Enterprise" }]} />
        </div>
        <fieldset>
          <legend className="text-[13px] font-medium text-ink-2">Plan</legend>
          <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
            {PLANS.map((p) => (
              <label key={p.id} className={cn("cursor-pointer rounded-[10px] p-3 ring-1 ring-inset", plan === p.id ? "bg-cobalt-wash ring-cobalt" : "ring-line hover:bg-canvas")}>
                <input type="radio" name="plan" className="sr-only" checked={plan === p.id} onChange={() => setPlan(p.id)} />
                <span className="block text-[13.5px] font-semibold text-ink">{p.id}</span>
                <span className="tnum block text-xs text-subtle">{p.seats} seats</span>
                <span className="block text-xs text-subtle">{p.note}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Owner name" htmlFor="c-owner">
            <Input id="c-owner" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
          </Field>
          <Field label="Owner email" htmlFor="c-owner-email">
            <Input id="c-owner-email" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
          </Field>
        </div>
        <Field label="Client partner" htmlFor="c-partner">
          <Select id="c-partner" value={partner} onValueChange={setPartner} className="w-full" options={STAFF.filter((s) => s.role === "client_partner").map((s) => ({ value: s.name, label: s.name }))} />
        </Field>
        {err && (
          <p role="alert" className="text-[13px] text-flag-ink">
            {err}
          </p>
        )}
      </div>
    </Sheet>
  );
}

export function OrgList() {
  const { orgs } = useAdmin();
  const params = useSearchParams();
  const now = useDemoNow(60_000);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [status, setStatus] = useState<"all" | OrgStatus>("all");
  const [creating, setCreating] = useState(false);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return orgs.filter((o) => (status === "all" || o.status === status) && (!n || `${o.name} ${o.domain} ${o.owner.email}`.toLowerCase().includes(n)));
  }, [orgs, q, status]);

  return (
    <div className="space-y-4 px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 sm:flex-1">
          <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, domain or owner" aria-label="Search organizations" className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Segmented
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "onboarding", label: "Onboarding" },
              { value: "suspended", label: "Suspended" },
            ]}
          />
          <Button variant="primary" onClick={() => setCreating(true)} className="shrink-0">
            Create organization
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[12px] bg-surface ring-1 ring-line">
        <table className="w-full min-w-[860px] text-left text-[13.5px]">
          <thead className="bg-canvas text-xs text-subtle">
            <tr className="border-b border-line">
              <th className="px-5 py-2.5 font-medium">Organization</th>
              <th className="py-2.5 font-medium">Plan</th>
              <th className="py-2.5 font-medium">Seats</th>
              <th className="py-2.5 font-medium">Status</th>
              <th className="py-2.5 font-medium">Client partner</th>
              <th className="py-2.5 font-medium">Security</th>
              <th className="px-5 py-2.5 font-medium">Last active</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0 hover:bg-canvas">
                <td className="px-5 py-3">
                  <Link href={`/admin/organizations/${o.id}`} className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-night text-[12px] font-semibold text-brand-bright">
                      {o.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium text-ink hover:text-cobalt">{o.name}</span>
                      <span className="block text-xs text-subtle">
                        {o.domain}, {o.type}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="py-3 text-ink">{o.plan}</td>
                <td className="py-3">
                  <span className="tnum text-ink">
                    {o.members}/{o.seats}
                  </span>
                  <span className="mt-1 block h-1 w-16 overflow-hidden rounded-full bg-line">
                    <span className={cn("block h-full rounded-full", o.members / o.seats >= 0.9 ? "bg-notice" : "bg-cobalt")} style={{ width: `${Math.min(100, (o.members / o.seats) * 100)}%` }} />
                  </span>
                </td>
                <td className="py-3">
                  <Pill tone={STATUS_PILL[o.status].tone}>{STATUS_PILL[o.status].label}</Pill>
                </td>
                <td className="py-3 text-ink-2">{o.clientPartner}</td>
                <td className="py-3 text-xs text-subtle">{[o.sso ? "SSO" : null, o.mfaRequired ? "2FA required" : null].filter(Boolean).join(", ") || "Password only"}</td>
                <td className="tnum px-5 py-3 text-subtle">{o.lastActive ? relativeAgo(o.lastActive, now) : "Not yet"}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[14px] text-subtle">
                  No organizations match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateOrg open={creating} onOpenChange={setCreating} />
    </div>
  );
}
