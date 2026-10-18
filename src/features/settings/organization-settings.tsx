"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { relativeAgo } from "@/lib/format";
import { can, MEMBERS, ORG_ROLES, ORGANIZATION, PERMISSIONS, ROLE_PERMISSIONS, type Member, type OrgRole } from "@/lib/org";
import { useWorkspace } from "@/lib/workspace-store";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/overlay";
import { DataTable, type Column } from "@/components/ui/data-table";
import { DetailSection, EmptyState, SegmentBar } from "@/components/ui/data-display";
import { ActiveFilters, FilterMenu, FilterSearch, Toolbar } from "@/components/ui/filter-menu";
import { plural } from "@/features/dashboard/kpi";
import { UnderlineTabs } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/status";
import { Select } from "@/components/ui/select";
import { SettingRow, Switch } from "@/components/ui/switch";
import { IconCheck, IconPlus, IconUsers } from "@/components/icons";

// Signed-in member for this demo (owner of the organization)
const ME = MEMBERS[0];

const roleName = (r: OrgRole) => ORG_ROLES.find((x) => x.id === r)!.name;
const STATUS_NAME: Record<Member["status"], string> = { active: "Active", invited: "Invite pending", suspended: "Suspended" };
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

function General() {
  const { notify } = useWorkspace();
  const [name, setName] = useState(ORGANIZATION.name);
  const [address, setAddress] = useState(ORGANIZATION.address);
  const [industry, setIndustry] = useState(ORGANIZATION.industry);
  const used = MEMBERS.filter((m) => m.status !== "suspended").length;
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="overflow-hidden rounded-lg border border-hair bg-surface">
        <div className="flex items-center gap-4 px-5 py-5 shadow-[inset_0_-1px_0_var(--color-hair)]">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cobalt-wash text-[16px] font-semibold text-cobalt-strong">{initials(name)}</span>
          <div className="min-w-0 text-[13px]">
            <p className="text-[16px] font-semibold text-ink">{name}</p>
            <p className="text-subtle">Initials are used until you upload a logo.</p>
          </div>
        </div>
        <DetailSection
          title="Organization details"
          action={
            <Button size="sm" variant="primary" onClick={() => notify({ tone: "ok", title: "Organization details saved" })}>
              Save changes
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organization name" htmlFor="o-name">
              <Input id="o-name" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Primary domain" htmlFor="o-domain" hint="Verified. Contact support to change it.">
              <Input id="o-domain" value={ORGANIZATION.domain} disabled className="bg-canvas text-ink-2" />
            </Field>
            <Field label="Industry" htmlFor="o-industry">
              <Input id="o-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </Field>
            <Field label="Location" htmlFor="o-address">
              <Input id="o-address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </Field>
          </div>
        </DetailSection>
      </div>

      <div className="overflow-hidden rounded-lg border border-hair bg-surface">
        <DetailSection title="Plan">
          <p className="text-[20px] font-semibold tracking-[-0.015em] text-ink">{ORGANIZATION.plan}</p>
          <p className="tnum mt-1 text-[13px] text-subtle">
            {used} of {ORGANIZATION.seats} seats used
          </p>
          <SegmentBar percent={(used / ORGANIZATION.seats) * 100} segments={ORGANIZATION.seats} tone="brand" className="mt-3" label={`${used} of ${ORGANIZATION.seats} seats used`} />
          <dl className="mt-5 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-subtle">Organization ID</dt>
              <dd className="tnum text-ink">{ORGANIZATION.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-subtle">Customer since</dt>
              <dd className="text-ink">March 2025</dd>
            </div>
          </dl>
          <Button className="mt-5 w-full" onClick={() => notify({ tone: "ok", title: "Your client partner will be in touch about your plan" })}>
            Talk to us about seats
          </Button>
        </DetailSection>
      </div>
    </div>
  );
}

function Members() {
  const { notify } = useWorkspace();
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Member["status"]>("all");
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrgRole>("recruiter");
  const [err, setErr] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Member | null>(null);
  const canManage = can(ME.role, "members.manage");

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return members
      .filter((m) => roleFilter === "all" || m.role === roleFilter)
      .filter((m) => statusFilter === "all" || m.status === statusFilter)
      .filter((m) => !n || `${m.name} ${m.email} ${m.title}`.toLowerCase().includes(n));
  }, [members, q, roleFilter, statusFilter]);

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

  const columns: Column<Member>[] = [
    {
      key: "member",
      header: "Member",
      width: "minmax(240px,2fr)",
      cell: (m) => (
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-cobalt-wash text-[11px] font-semibold text-cobalt capitalize">{initials(m.name)}</span>
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink capitalize">
              {m.name}
              {m.id === ME.id && <span className="ml-1.5 text-[12px] font-normal text-subtle">(you)</span>}
            </span>
            <span className="block truncate text-[13px] text-ink-2">{m.email}</span>
          </span>
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: "180px",
      cell: (m) =>
        canManage && m.role !== "owner" && m.id !== ME.id ? (
          <span onClick={(e) => e.stopPropagation()}>
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
          </span>
        ) : (
          <span className="font-medium text-ink">{roleName(m.role)}</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      width: "140px",
      cell: (m) =>
        m.status === "active" ? (
          <Tag tone="green" dot>
            Active
          </Tag>
        ) : m.status === "invited" ? (
          <Tag tone="amber" dot>
            Invite pending
          </Tag>
        ) : (
          <Tag dot>Suspended</Tag>
        ),
    },
    {
      key: "mfa",
      header: "Two-factor",
      width: "110px",
      cell: (m) =>
        m.mfa ? (
          <span className="inline-flex items-center gap-1 text-ink">
            <IconCheck size={13} strokeWidth={2.5} className="text-cobalt" /> On
          </span>
        ) : (
          <span className="text-subtle">Off</span>
        ),
    },
    { key: "last", header: "Last active", width: "120px", cell: (m) => <span className="tnum text-subtle">{m.lastActive ? relativeAgo(m.lastActive) : "Never"}</span> },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      width: "96px",
      align: "end",
      cell: (m) =>
        canManage && m.role !== "owner" ? (
          <Button size="sm" variant="ghost" onClick={() => setRemoving(m)}>
            {m.status === "invited" ? "Revoke" : "Remove"}
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-hair bg-surface">
        <Toolbar
          summary={`${plural(list.length, "member")} · ${members.length} of ${ORGANIZATION.seats} seats used`}
          actions={
            canManage && (
              <Button size="sm" variant="primary" onClick={() => setInviting(true)}>
                <IconPlus size={14} />
                Invite member
              </Button>
            )
          }
          chips={
            <ActiveFilters
              filters={[
                ...(q.trim() ? [{ key: "q", label: "Search", value: `“${q.trim()}”`, onRemove: () => setQ("") }] : []),
                ...(roleFilter !== "all" ? [{ key: "role", label: "Role", value: roleName(roleFilter as OrgRole), onRemove: () => setRoleFilter("all") }] : []),
                ...(statusFilter !== "all" ? [{ key: "status", label: "Status", value: STATUS_NAME[statusFilter], onRemove: () => setStatusFilter("all") }] : []),
              ]}
              onClearAll={() => {
                setQ("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
            />
          }
        >
          <FilterSearch value={q} onChange={setQ} placeholder="Search name, email or title" className="sm:w-[280px]" />
          <FilterMenu
            label="Role"
            value={roleFilter}
            allValue="all"
            options={[{ value: "all", label: "Any" }, ...ORG_ROLES.map((r) => ({ value: r.id, label: r.name, meta: members.filter((m) => m.role === r.id).length }))]}
            onChange={setRoleFilter}
          />
          <FilterMenu
            label="Status"
            value={statusFilter}
            allValue="all"
            options={[{ value: "all", label: "Any" }, ...(Object.keys(STATUS_NAME) as Member["status"][]).map((k) => ({ value: k, label: STATUS_NAME[k], meta: members.filter((m) => m.status === k).length }))]}
            onChange={setStatusFilter}
          />
        </Toolbar>
        <DataTable
          caption="Members"
          rows={list}
          columns={columns}
          rowKey={(m) => m.id}
          rowHeight="h-[52px]"
          minWidth={820}
          empty={<EmptyState icon={<IconUsers size={18} />} title="No members match these filters" description="Search by name, email or job title, or clear the role and status filters." />}
        />
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
          <Field label="Work email" htmlFor="i-email" hint={`Must be an @${ORGANIZATION.allowedDomains[0]} address.`} error={err}>
            <Input id="i-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus aria-invalid={!!err} />
          </Field>
          <fieldset>
            <legend className="text-[13px] font-medium text-ink-2">Role</legend>
            <div className="mt-2 space-y-1.5">
              {ORG_ROLES.filter((r) => r.id !== "owner").map((r) => (
                <label
                  key={r.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-lg p-3 transition-[background-color,box-shadow] duration-150 ease-power3-out",
                    role === r.id ? "border border-cobalt bg-cobalt-wash" : "border border-hair hover:bg-canvas",
                  )}
                >
                  <input type="radio" name="role" checked={role === r.id} onChange={() => setRole(r.id)} className="mt-0.5 accent-[var(--color-cobalt)]" />
                  <span>
                    <span className="block text-[13.5px] font-medium text-ink">{r.name}</span>
                    <span className="block text-[13px] text-ink-2">{r.summary}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {ORG_ROLES.map((r) => (
          <div key={r.id} className="flex flex-col rounded-lg border border-hair bg-surface p-4">
            <p className="flex items-center justify-between gap-2 text-[14px] font-semibold text-ink">
              {r.name}
              <span className="tnum text-[12.5px] font-normal text-subtle">{MEMBERS.filter((m) => m.role === r.id).length}</span>
            </p>
            <p className="mt-1.5 text-[12.5px] leading-snug text-subtle">{r.summary}</p>
          </div>
        ))}
      </div>
      <div className="scroll-thin relative overflow-x-auto rounded-lg border border-hair bg-surface">
        <table className="w-full min-w-[760px] text-left text-[13.5px]">
          <caption className="sr-only">Permissions by role</caption>
          <thead className="bg-canvas text-[13px] text-ink-2">
            <tr className="border-b border-hair">
              <th className="h-[38px] px-5 font-normal">Permission</th>
              {ORG_ROLES.map((r) => (
                <th key={r.id} className="h-[38px] px-3 text-center font-normal">
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g}>
              <tr className="bg-canvas">
                <th colSpan={ORG_ROLES.length + 1} scope="colgroup" className="px-5 py-2 text-left">
                  <span className="text-[13px] font-semibold text-ink">{g}</span>
                </th>
              </tr>
              {PERMISSIONS.filter((p) => p.group === g).map((p) => (
                <tr key={p.id} className="border-b border-hair last:border-0">
                  <th scope="row" className="h-[42px] px-5 font-normal text-ink">
                    {p.name}
                  </th>
                  {ORG_ROLES.map((r) => (
                    <td key={r.id} className="h-[42px] px-3 text-center">
                      {ROLE_PERMISSIONS[r.id].includes(p.id) ? (
                        <span className="mx-auto grid size-5 place-items-center rounded-full bg-cobalt-wash text-cobalt" aria-label="Allowed">
                          <IconCheck size={12} strokeWidth={2.75} />
                        </span>
                      ) : (
                        <span className="text-subtle" aria-label="Not allowed">
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
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="overflow-hidden rounded-lg border border-hair bg-surface">
        <DetailSection title="Sign-in" bodyClassName="px-5 pt-1 pb-3">
          <SettingRow title="Single sign-on" description={`Connected to ${ORGANIZATION.sso.provider}.`}>
            <Tag tone="green" dot>
              Connected
            </Tag>
          </SettingRow>
          <SettingRow title="Require single sign-on" description="Members must sign in through your identity provider. Passwords are disabled.">
            <Switch
              checked={enforceSso}
              label="Require single sign-on"
              onChange={(v) => {
                setEnforceSso(v);
                notify({ tone: "ok", title: v ? "SSO is now required" : "Password sign-in allowed" });
              }}
            />
          </SettingRow>
          <SettingRow title="Require two-factor authentication" description="Members without two-factor are asked to set it up at their next sign-in.">
            <Switch
              checked={mfa}
              label="Require two-factor authentication"
              onChange={(v) => {
                setMfa(v);
                notify({ tone: "ok", title: v ? "Two-factor is now required" : "Two-factor is optional" });
              }}
            />
          </SettingRow>
        </DetailSection>
      </div>
      <div className="overflow-hidden rounded-lg border border-hair bg-surface">
        <DetailSection
          title="Allowed email domains"
          action={
            <Button size="sm" variant="primary" onClick={() => notify({ tone: "ok", title: "Allowed domains saved" })}>
              Save domains
            </Button>
          }
        >
          <Field label="Domains" htmlFor="s-domains" hint="Separate domains with commas. Invites to other domains are blocked.">
            <Input id="s-domains" value={domains} onChange={(e) => setDomains(e.target.value)} />
          </Field>
        </DetailSection>
      </div>
    </div>
  );
}

type Tab = "general" | "members" | "roles" | "security";

const PANELS: Record<Tab, () => React.ReactElement> = { general: General, members: Members, roles: Roles, security: Security };

export function OrganizationSettings() {
  const [tab, setTab] = useState<Tab>("general");
  const Panel = PANELS[tab];
  return (
    <>
      <PageHeader
        title={ORGANIZATION.name}
        breadcrumb={[{ label: "Account" }, { label: "Organization" }]}
        status={
          <Tag tone="blue" size="sm">
            {ORGANIZATION.plan}
          </Tag>
        }
        description="Organization details, members, roles and sign-in security."
        tabs={
          <UnderlineTabs
            listClassName="border-b-0 px-0 sm:px-0"
            label="Organization settings"
            value={tab}
            onValueChange={setTab}
            tabs={[
              { value: "general", label: "General" },
              { value: "members", label: "Members", count: MEMBERS.length },
              { value: "roles", label: "Roles and permissions" },
              { value: "security", label: "Security" },
            ]}
          />
        }
      />
      <div role="region" aria-label={`${tab} settings`} className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 sm:py-8">
        <Panel />
      </div>
    </>
  );
}
