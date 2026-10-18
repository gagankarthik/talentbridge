"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { relativeAgo } from "@/lib/format";
import { useDemoNow } from "@/lib/clock";
import { PLANS, STAFF, type OrgStatus, type Plan, type PlatformOrg } from "@/lib/platform";
import { useWorkspace } from "@/lib/workspace-store";
import { PageHeader } from "@/components/layout/app-shell";
import { Button, buttonClass } from "@/components/ui/button";
import { Field, Input, Segmented } from "@/components/ui/form";
import { Modal, Sheet } from "@/components/ui/overlay";
import { Select } from "@/components/ui/select";
import { StatusDot } from "@/components/ui/status-dot";
import { FitTable, type FitColumn } from "./fit-table";
import { ListToolbar } from "./list-toolbar";
import { EmptyState } from "@/components/ui/data-display";
import { Pagination, usePage } from "@/components/ui/pagination";
import { IconBuilding, IconPlus } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { Avatar, Meta, ORG_STATUS, OrgMark, PageBody, Panel, textAction } from "./ui";

/** Kept for older imports: status → legacy pill tone */
export const STATUS_PILL: Record<OrgStatus, { tone: "avail" | "notice" | "placed"; label: string }> = {
  active: { tone: "avail", label: "Active" },
  onboarding: { tone: "notice", label: "Onboarding" },
  suspended: { tone: "placed", label: "Suspended" },
};

const PARTNERS = STAFF.filter((s) => s.role === "client_partner");
const security = (o: PlatformOrg) => [o.sso ? "SSO" : null, o.mfaRequired ? "Two-factor required" : null].filter(Boolean).join(", ") || "Password only";

function FormSection({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <fieldset className={cn("space-y-4 px-6 py-6", !last && "border-b border-line")}>
      <legend className="float-left mb-4 w-full text-[16px] font-semibold text-ink">{title}</legend>
      {children}
    </fieldset>
  );
}

function CreateOrg({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { orgs, createOrg } = useAdmin();
  const { notify } = useWorkspace();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [type, setType] = useState<PlatformOrg["type"]>("Staffing agency");
  const [plan, setPlan] = useState<Plan>("Partner");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [partner, setPartner] = useState(PARTNERS[0].name);
  const [err, setErr] = useState<string | null>(null);

  const submit = () => {
    const d = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");
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
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      width="max-w-[600px]"
      title="New organization"
      description="Sets up a customer workspace and invites its first owner."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            Create and send invite
          </Button>
        </>
      }
    >
      <div className="-mx-6 -my-5">
        <FormSection title="Company">
          <Field label="Organization name" htmlFor="c-name" required>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email domain" htmlFor="c-domain" hint="Members can only join with this domain." required>
              <Input id="c-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="acme.com" />
            </Field>
            <div className="space-y-1.5">
              <p className="text-[13px] font-medium text-ink-2">Customer type</p>
              <Segmented
                label="Customer type"
                value={type}
                onChange={setType}
                options={[
                  { value: "Staffing agency", label: "Staffing agency" },
                  { value: "Enterprise", label: "Enterprise" },
                ]}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Plan">
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Plan">
            {PLANS.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "cursor-pointer rounded-[6px] border p-3 transition-colors duration-150",
                  plan === p.id ? "border-cobalt bg-[#eef3fd] shadow-[0_0_0_1px_var(--color-cobalt)]" : "border-control bg-surface hover:bg-canvas",
                )}
              >
                <input type="radio" name="plan" className="sr-only" checked={plan === p.id} onChange={() => setPlan(p.id)} />
                <span className="block text-[14px] font-semibold text-ink">{p.id}</span>
                <span className="tnum mt-0.5 block text-[13px] text-muted">{p.seats} seats</span>
                <span className="mt-1 block text-[13px] leading-snug text-subtle">{p.note}</span>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="Owner and client partner" last>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Owner name" htmlFor="c-owner" required>
              <Input id="c-owner" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
            </Field>
            <Field label="Owner email" htmlFor="c-owner-email" required>
              <Input id="c-owner-email" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
            </Field>
          </div>
          <Field label="Client partner" htmlFor="c-partner">
            <Select
              id="c-partner"
              value={partner}
              onValueChange={setPartner}
              className="w-full"
              options={PARTNERS.map((s) => ({ value: s.name, label: s.name }))}
            />
          </Field>
          {err && (
            <p role="alert" className="text-[13px] font-medium text-[#b42318]">
              {err}
            </p>
          )}
        </FormSection>
      </div>
    </Modal>
  );
}

function OrgPreview({ o, onClose }: { o: PlatformOrg | null; onClose: () => void }) {
  const now = useDemoNow(60_000);
  const rows: [string, React.ReactNode][] = o
    ? [
        [
          "Status",
          <StatusDot key="s" tone={ORG_STATUS[o.status].tone}>
            {ORG_STATUS[o.status].label}
          </StatusDot>,
        ],
        ["Plan", `${o.plan}, ${o.seats} seats`],
        ["Seats used", `${o.members} of ${o.seats}`],
        ["Active holds", o.activeHolds],
        ["Requests, last 30 days", o.requests30],
        [
          "Owner",
          <span key="o">
            <span className="block">{o.owner.name}</span>
            <span className="block text-[13px] text-subtle">{o.owner.email}</span>
          </span>,
        ],
        ["Client partner", o.clientPartner],
        ["Security", security(o)],
        ["Customer since", o.createdAt],
        ["Last active", o.lastActive ? relativeAgo(o.lastActive, now) : "Not yet"],
      ]
    : [];
  return (
    <Sheet
      open={!!o}
      onOpenChange={(v) => !v && onClose()}
      title={o?.name ?? "Organization"}
      description={o ? `${o.domain} · ${o.type}` : undefined}
      footer={
        o && (
          <div className="flex w-full items-center justify-between gap-3">
            <Link href={`/admin/audit?org=${o.id}`} className={textAction}>
              View activity
            </Link>
            <Link href={`/admin/organizations/${o.id}`} className={buttonClass("primary", "md")}>
              Open organization
            </Link>
          </div>
        )
      }
    >
      {o && (
        <dl className="divide-y divide-line px-6">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[160px_minmax(0,1fr)] gap-4 py-3.5 text-[14px]">
              <dt className="text-subtle">{k}</dt>
              <dd className="tnum min-w-0 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </Sheet>
  );
}

export function OrgList() {
  const { orgs } = useAdmin();
  const params = useSearchParams();
  const now = useDemoNow(60_000);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [status, setStatus] = useState<"all" | OrgStatus>("all");
  const [plan, setPlan] = useState<"all" | Plan>("all");
  const [partner, setPartner] = useState("all");
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [sort, setSort] = useState<"name" | "active" | "seats">("name");

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return orgs
      .filter(
        (o) =>
          (status === "all" || o.status === status) &&
          (plan === "all" || o.plan === plan) &&
          (partner === "all" || o.clientPartner === partner) &&
          (!n || `${o.name} ${o.domain} ${o.owner.email}`.toLowerCase().includes(n)),
      )
      .sort((a, b) =>
        sort === "name"
          ? a.name.localeCompare(b.name)
          : sort === "seats"
            ? b.members / b.seats - a.members / a.seats
            : (b.lastActive ?? "").localeCompare(a.lastActive ?? ""),
      );
  }, [orgs, q, status, plan, partner, sort]);
  const pager = usePage(list, 25, `${q}|${status}|${plan}|${partner}`);

  const cols: FitColumn<PlatformOrg>[] = [
    {
      key: "org",
      header: "Organization",
      width: "minmax(260px,2.2fr)",
      cell: (o) => (
        <span className="flex min-w-0 items-center gap-3">
          <OrgMark name={o.name} size={32} />
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink">{o.name}</span>
            <Meta items={[o.domain, o.type]} />
          </span>
        </span>
      ),
    },
    { key: "plan", priority: 4, header: "Plan", width: "minmax(100px,0.7fr)", cell: (o) => <span className="text-muted">{o.plan}</span> },
    {
      key: "seats",
      priority: 2,
      header: "Seats",
      width: "minmax(120px,0.8fr)",
      cell: (o) =>
        o.members / o.seats >= 0.9 ? (
          <StatusDot tone="warning" title="90% or more of seats used">
            {o.members} of {o.seats}
          </StatusDot>
        ) : (
          <span className="tnum text-muted">
            {o.members} of {o.seats}
          </span>
        ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(124px,0.8fr)",
      cell: (o) => <StatusDot tone={ORG_STATUS[o.status].tone}>{ORG_STATUS[o.status].label}</StatusDot>,
    },
    {
      key: "partner",
      priority: 3,
      header: "Client partner",
      width: "minmax(160px,1fr)",
      cell: (o) => (
        <span className="flex min-w-0 items-center gap-2 text-muted">
          <Avatar name={o.clientPartner} size={24} />
          <span className="truncate">{o.clientPartner}</span>
        </span>
      ),
    },
    {
      key: "holds",
      priority: 5,
      header: "Active holds",
      width: "minmax(104px,0.6fr)",
      align: "end",
      cell: (o) => <span className="text-ink">{o.activeHolds}</span>,
    },
    {
      key: "last",
      priority: 1,
      header: "Last active",
      width: "minmax(112px,0.7fr)",
      align: "end",
      cell: (o) => <span className="whitespace-nowrap text-subtle">{o.lastActive ? relativeAgo(o.lastActive, now) : "Not yet"}</span>,
    },
  ];

  const clearAll = () => {
    setQ("");
    setStatus("all");
    setPlan("all");
    setPartner("all");
  };

  return (
    <>
      <PageHeader
        title="Organizations"
        description="Customer workspaces: plans, seats, security and the client partner responsible for each."
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <IconPlus size={16} />
            New organization
          </Button>
        }
      />
      <PageBody>
        <Panel>
          <ListToolbar
            noun="organizations"
            summary={list.length}
            onClearAll={clearAll}
            search={{ value: q, onChange: setQ, placeholder: "Search name, domain or owner" }}
            sort={{
              value: sort,
              onChange: (v) => setSort(v as typeof sort),
              options: [
                { value: "name", label: "Name" },
                { value: "active", label: "Last active" },
                { value: "seats", label: "Seat usage" },
              ],
            }}
            filters={[
              {
                key: "status",
                label: "Status",
                value: status,
                onChange: (v) => setStatus(v as typeof status),
                options: [
                  { value: "all", label: "All statuses", meta: orgs.length },
                  ...(["active", "onboarding", "suspended"] as const).map((s) => ({
                    value: s,
                    label: ORG_STATUS[s].label,
                    meta: orgs.filter((o) => o.status === s).length,
                  })),
                ],
              },
              {
                key: "plan",
                label: "Plan",
                value: plan,
                onChange: (v) => setPlan(v as typeof plan),
                options: [
                  { value: "all", label: "All plans" },
                  ...PLANS.map((p) => ({ value: p.id, label: p.id, meta: orgs.filter((o) => o.plan === p.id).length })),
                ],
              },
              {
                key: "partner",
                label: "Client partner",
                value: partner,
                onChange: setPartner,
                options: [
                  { value: "all", label: "Anyone" },
                  ...PARTNERS.map((p) => ({ value: p.name, label: p.name, meta: orgs.filter((o) => o.clientPartner === p.name).length })),
                ],
              },
            ]}
          />
          <FitTable
            caption="Organizations"
            rows={pager.rows}
            columns={cols}
            rowKey={(o) => o.id}
            activeKey={openId}
            onRowClick={(o) => setOpenId(o.id)}
            empty={<EmptyState icon={<IconBuilding size={18} />} title="No organizations match" description="Try a different search, or clear the filters." />}
          />
          <Pagination {...pager} noun="organizations" />
        </Panel>
      </PageBody>

      <OrgPreview o={orgs.find((o) => o.id === openId) ?? null} onClose={() => setOpenId(null)} />
      <CreateOrg open={creating} onOpenChange={setCreating} />
    </>
  );
}
