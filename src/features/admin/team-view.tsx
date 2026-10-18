"use client";

import { useMemo, useState } from "react";
import { relativeAgo } from "@/lib/format";
import { useDemoNow } from "@/lib/clock";
import { STAFF, STAFF_ROLES, type StaffMember, type StaffRole } from "@/lib/platform";
import { useWorkspace } from "@/lib/workspace-store";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/overlay";
import { Select } from "@/components/ui/select";
import { FitTable, type FitColumn } from "./fit-table";
import { ListToolbar } from "./list-toolbar";
import { EmptyState } from "@/components/ui/data-display";
import { Pagination, usePage } from "@/components/ui/pagination";
import { IconPlus, IconUsers } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { Avatar, PageBody, Panel } from "./ui";

const roleName = (r: StaffRole) => STAFF_ROLES.find((x) => x.id === r)!.name;
const ROLE_OPTIONS = STAFF_ROLES.map((r) => ({ value: r.id, label: r.name, hint: r.summary }));

export function TeamView() {
  const { orgs } = useAdmin();
  const { notify } = useWorkspace();
  const now = useDemoNow(60_000);
  const [staff, setStaff] = useState<StaffMember[]>(STAFF);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | StaffRole>("all");
  const [sort, setSort] = useState<"name" | "active">("name");
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

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return staff
      .filter((s) => (roleFilter === "all" || s.role === roleFilter) && (!n || `${s.name} ${s.email}`.toLowerCase().includes(n)))
      .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : b.lastActive.localeCompare(a.lastActive)));
  }, [staff, q, roleFilter, sort]);
  const pager = usePage(list, 25, `${q}|${roleFilter}`);

  const cols: FitColumn<StaffMember>[] = [
    {
      key: "name",
      header: "Name",
      width: "minmax(260px,2fr)",
      cell: (s) => (
        <span className="flex min-w-0 items-center gap-3">
          <Avatar name={s.name} size={32} />
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink">{s.name}</span>
            <span className="block truncate text-[13px] text-subtle">{s.email}</span>
          </span>
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: "minmax(220px,1.2fr)",
      cell: (s) => (
        <Select
          label={`Role for ${s.name}`}
          value={s.role}
          options={ROLE_OPTIONS}
          onValueChange={(r) => {
            setStaff((xs) => xs.map((x) => (x.id === s.id ? { ...x, role: r } : x)));
            notify({ tone: "ok", title: `${s.name} is now ${roleName(r)}` });
          }}
        />
      ),
    },
    {
      key: "scope",
      priority: 2,
      header: "Organizations",
      width: "minmax(240px,1.6fr)",
      cell: (s) => {
        if (s.role !== "client_partner") return <span className="text-muted">All organizations</span>;
        const os = orgs.filter((o) => o.clientPartner === s.name);
        if (!os.length) return <span className="text-subtle">None assigned</span>;
        return (
          <span className="truncate text-muted" title={os.map((o) => o.name).join(", ")}>
            {os[0].name}
            {os.length > 1 && <span className="text-subtle"> and {os.length - 1} more</span>}
          </span>
        );
      },
    },
    {
      key: "last",
      priority: 1,
      header: "Last active",
      width: "minmax(112px,0.7fr)",
      align: "end",
      cell: (s) => <span className="whitespace-nowrap text-subtle">{relativeAgo(s.lastActive, now)}</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Platform team"
        description="TalentBridge staff with access to the console. Role changes are written to the audit log."
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <IconPlus size={16} />
            Invite team member
          </Button>
        }
      />
      <PageBody>
        <Panel>
          <ListToolbar
            noun="team members"
            summary={list.length}
            onClearAll={() => {
              setQ("");
              setRoleFilter("all");
            }}
            search={{ value: q, onChange: setQ, placeholder: "Search name or email" }}
            sort={{
              value: sort,
              onChange: (v) => setSort(v as typeof sort),
              options: [
                { value: "name", label: "Name" },
                { value: "active", label: "Last active" },
              ],
            }}
            filters={[
              {
                key: "role",
                label: "Role",
                value: roleFilter,
                onChange: (v) => setRoleFilter(v as typeof roleFilter),
                options: [
                  { value: "all", label: "All roles", meta: staff.length },
                  ...STAFF_ROLES.map((r) => ({ value: r.id, label: r.name, meta: staff.filter((s) => s.role === r.id).length })),
                ],
              },
            ]}
          />
          <FitTable
            caption="Platform team"
            rows={pager.rows}
            columns={cols}
            rowKey={(s) => s.id}
            empty={<EmptyState icon={<IconUsers size={18} />} title="Nobody matches" description="Try another name, or clear the role filter." />}
          />
          <Pagination {...pager} noun="team members" />
        </Panel>
      </PageBody>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Invite a team member"
        description="Platform roles can see across customer organizations, so only invite TalentBridge staff."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={add}>
              Send invitation
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Name" htmlFor="t-name" required>
            <Input id="t-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
          <Field label="Work email" htmlFor="t-email" required>
            <Input id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@talentbridge.com" />
          </Field>
          <Field label="Role" htmlFor="t-role" hint={STAFF_ROLES.find((r) => r.id === role)!.summary}>
            <Select id="t-role" value={role} onValueChange={setRole} className="w-full" options={ROLE_OPTIONS} />
          </Field>
          {err && (
            <p role="alert" className="text-[13px] font-medium text-[#b42318]">
              {err}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
