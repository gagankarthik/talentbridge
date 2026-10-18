"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { relativeAgo, fmtDateTime } from "@/lib/format";
import { useDemoNow } from "@/lib/clock";
import { MEMBERS, ORG_ROLES } from "@/lib/org";
import { ORG_MEMBERS, PLANS, STAFF, type OrgMember } from "@/lib/platform";
import { useWorkspace } from "@/lib/workspace-store";
import { PageHeader } from "@/components/layout/app-shell";
import { Button, buttonClass } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/overlay";
import { Select } from "@/components/ui/select";
import { StatusDot } from "@/components/ui/status-dot";
import { DataTable, type Column } from "@/components/ui/data-table";
import { DetailSection, EmptyState, KpiTile } from "@/components/ui/data-display";
import { Pagination, usePage } from "@/components/ui/pagination";
import { TabPanel, UnderlineTabs } from "@/components/ui/tabs";
import { IconBuilding, IconClock, IconUsers } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { Avatar, Meta, ORG_STATUS, OrgMark, PageBody, Panel, PanelHeader, textAction } from "./ui";

type TabId = "overview" | "members" | "activity";

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[52px] items-center justify-between gap-4 border-b border-line py-2 text-[14px] last:border-b-0">
      <dt className="text-subtle">{k}</dt>
      <dd className="min-w-0 text-right text-ink">{children}</dd>
    </div>
  );
}

/** Members tab: paged table. Its own component so the paging hook never runs conditionally. */
function MembersPanel({ orgName, members, columns, subtitle }: { orgName: string; members: OrgMember[]; columns: Column<OrgMember>[]; subtitle: string }) {
  const page = usePage(members, 25, orgName);
  return (
    <Panel>
      <PanelHeader title="Members" subtitle={subtitle} />
      <DataTable
        caption={`Members of ${orgName}`}
        rows={page.rows}
        columns={columns}
        rowKey={(m) => m.email}
        minWidth={640}
        empty={<EmptyState icon={<IconUsers size={18} />} title="No members yet" description="The owner's invite is still pending." />}
      />
      <Pagination {...page} noun="members" />
    </Panel>
  );
}

export function OrgDetail({ id }: { id: string }) {
  const { orgs, audit, session, updateOrg, startSession, endSession } = useAdmin();
  const { notify } = useWorkspace();
  const now = useDemoNow(1000);
  const [tab, setTab] = useState<TabId>("overview");
  const [supportOpen, setSupportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const o = orgs.find((x) => x.id === id);
  if (!o)
    return (
      <>
        <PageHeader breadcrumb={[{ label: "Organizations", href: "/admin/organizations" }]} title="Organization not found" />
        <EmptyState
          className="py-24"
          icon={<IconBuilding size={18} />}
          title="Organization not found"
          description="It may have been removed, or the link is wrong."
          action={
            <Link href="/admin/organizations" className={buttonClass("secondary", "md")}>
              Back to organizations
            </Link>
          }
        />
      </>
    );

  const members: OrgMember[] =
    o.id === "org_keystone"
      ? MEMBERS.map((m) => ({
          name: m.name,
          email: m.email,
          role: m.role,
          status: m.status === "invited" ? "invited" : "active",
        }))
      : (ORG_MEMBERS[o.id] ?? [
          {
            name: o.owner.name,
            email: o.owner.email,
            role: "owner",
            status: o.owner.invitePending ? "invited" : "active",
          },
        ]);
  const events = audit.filter((e) => e.orgId === o.id);
  const liveHere = session && session.orgId === o.id && session.expiresAt > now;
  const busyElsewhere = session && session.orgId !== o.id && session.expiresAt > now;

  const memberCols: Column<OrgMember>[] = [
    {
      key: "name",
      header: "Member",
      width: "minmax(260px,2fr)",
      cell: (m) => (
        <span className="flex min-w-0 items-center gap-3">
          <Avatar name={m.name} size={32} />
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink">{m.name}</span>
            <span className="block truncate text-[13px] text-subtle">{m.email}</span>
          </span>
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: "minmax(160px,1fr)",
      cell: (m) => <span className="text-muted">{ORG_ROLES.find((r) => r.id === m.role)!.name}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(150px,1fr)",
      cell: (m) => (m.status === "invited" ? <StatusDot tone="warning">Invite pending</StatusDot> : <StatusDot tone="success">Active</StatusDot>),
    },
  ];

  const activity = (limit?: number) =>
    events.length === 0 ? (
      <EmptyState icon={<IconClock size={18} />} title="No activity yet" description="Plan changes, support sessions and member changes appear here." />
    ) : (
      <ol className="divide-y divide-line">
        {events.slice(0, limit).map((e) => (
          <li key={e.id} className="flex min-h-[64px] items-start gap-3 px-5 py-3.5 sm:px-6">
            <Avatar name={e.actor} size={32} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] text-ink">
                <span className="font-medium">{e.actor}</span> <span className="text-muted">{e.action.charAt(0).toLowerCase() + e.action.slice(1)}</span>
              </p>
              <p className="mt-0.5 text-[13px] text-subtle">{e.detail}</p>
            </div>
            <time className="tnum shrink-0 text-[13px] text-subtle" dateTime={e.at} title={fmtDateTime(e.at)}>
              {relativeAgo(e.at, now)}
            </time>
          </li>
        ))}
      </ol>
    );

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Organizations", href: "/admin/organizations" }, { label: o.name }]}
        title={o.name}
        status={
          <span className="flex items-center gap-4">
            <StatusDot tone={ORG_STATUS[o.status].tone}>{ORG_STATUS[o.status].label}</StatusDot>
            {liveHere && <StatusDot tone="warning">Support session live</StatusDot>}
          </span>
        }
        description={<Meta items={[o.domain, o.type, `${o.plan} plan`, `Customer since ${o.createdAt}`]} />}
        actions={
          <>
            {o.owner.invitePending && <Button onClick={() => updateOrg(o.id, {}, "Resent owner invite", `To ${o.owner.email}`)}>Resend owner invite</Button>}
            {liveHere ? (
              <Button onClick={endSession}>End support session</Button>
            ) : (
              <Button
                onClick={() => setSupportOpen(true)}
                disabled={o.status === "suspended" || !!busyElsewhere}
                title={busyElsewhere ? "End your other support session first" : undefined}
              >
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
          </>
        }
        tabs={<></>}
      />
      <UnderlineTabs
        listClassName="bg-surface"
        value={tab}
        onValueChange={setTab}
        label="Organization sections"
        tabs={[
          { value: "overview", label: "Overview" },
          { value: "members", label: "Members", count: o.members },
          { value: "activity", label: "Activity", count: events.length },
        ]}
      >
        <TabPanel value="overview" className="outline-none">
          <PageBody className="space-y-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:gap-6">
              <KpiTile
                label="Seats used"
                value={`${o.members} of ${o.seats}`}
                hint={
                  <span className={o.members / o.seats >= 0.9 ? "font-medium text-[#9a5b00]" : undefined}>
                    {Math.round((o.members / o.seats) * 100)}% of the plan
                  </span>
                }
              />
              <KpiTile label="Active holds" value={o.activeHolds} hint="Across all members" />
              <KpiTile label="Requests, last 30 days" value={o.requests30} hint="Requisitions sent" />
              <KpiTile
                label="Last active"
                value={o.lastActive ? relativeAgo(o.lastActive, now) : "Not yet"}
                hint={o.lastActive ? fmtDateTime(o.lastActive) : "No sign-in yet"}
              />
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="space-y-6">
                <DetailSection card title="Plan and ownership" bodyClassName="py-0">
                  <dl>
                    <Row k="Plan">
                      <Select
                        label="Plan"
                        align="end"
                        value={o.plan}
                        options={PLANS.map((p) => ({ value: p.id, label: p.id, hint: `${p.seats} seats` }))}
                        onValueChange={(plan) => {
                          const seats = PLANS.find((p) => p.id === plan)!.seats;
                          if (seats < o.members) {
                            notify({
                              tone: "error",
                              title: `${plan} allows ${seats} seats`,
                              body: `${o.name} has ${o.members} members. Remove members first.`,
                            });
                            return;
                          }
                          updateOrg(o.id, { plan, seats }, "Changed plan", `${o.plan} to ${plan}, ${seats} seats`);
                        }}
                      />
                    </Row>
                    <Row k="Owner">
                      <span className="block font-medium">{o.owner.name}</span>
                      <span className="block text-[13px] text-subtle">{o.owner.email}</span>
                    </Row>
                    <Row k="Client partner">
                      <Select
                        label="Client partner"
                        align="end"
                        value={o.clientPartner}
                        options={STAFF.filter((s) => s.role === "client_partner").map((s) => ({ value: s.name, label: s.name }))}
                        onValueChange={(v) => updateOrg(o.id, { clientPartner: v }, "Reassigned client partner", `${o.clientPartner} to ${v}`)}
                      />
                    </Row>
                  </dl>
                </DetailSection>
                <DetailSection card title="Security" description="Set by the customer's own admins." bodyClassName="py-0">
                  <dl>
                    <Row k="Single sign-on">{o.sso ? <StatusDot tone="success">Connected</StatusDot> : <StatusDot tone="neutral">Not set up</StatusDot>}</Row>
                    <Row k="Two-factor sign-in">
                      {o.mfaRequired ? <StatusDot tone="success">Required</StatusDot> : <StatusDot tone="neutral">Optional</StatusDot>}
                    </Row>
                  </dl>
                </DetailSection>
              </div>
              <DetailSection
                card
                title="Recent activity"
                action={
                  <button type="button" onClick={() => setTab("activity")} className={textAction}>
                    View all
                  </button>
                }
                bodyClassName="p-0"
              >
                {activity(5)}
              </DetailSection>
            </div>
          </PageBody>
        </TabPanel>

        <TabPanel value="members" className="outline-none">
          <PageBody>
            <MembersPanel
              orgName={o.name}
              members={members}
              columns={memberCols}
              subtitle={members.length < o.members ? `Showing ${members.length} of ${o.members} on record` : `${o.members} people with access`}
            />
          </PageBody>
        </TabPanel>

        <TabPanel value="activity" className="outline-none">
          <PageBody>
            <Panel>
              <PanelHeader
                title="Activity"
                subtitle="Every change to this organization, newest first"
                action={
                  <Link href={`/admin/audit?org=${o.id}`} className={textAction}>
                    Open in audit log
                  </Link>
                }
              />
              {activity()}
            </Panel>
          </PageBody>
        </TabPanel>
      </UnderlineTabs>

      <Modal
        open={supportOpen}
        onOpenChange={setSupportOpen}
        title={`Start a support session for ${o.name}`}
        description="You'll see their workspace as they do. The session is time-limited and every action is logged."
        footer={
          <>
            <Button variant="secondary" onClick={() => setSupportOpen(false)}>
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
          <Field label="Reason" htmlFor="sup-reason" hint="For example, a ticket number or the issue you're helping with." required>
            <Input id="sup-reason" value={reason} onChange={(e) => setReason(e.target.value)} autoFocus />
          </Field>
          <div className="space-y-1.5">
            <p className="text-[13px] font-medium text-ink-2">Duration</p>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Duration">
              {[15, 30, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={minutes === m}
                  onClick={() => setMinutes(m)}
                  className={cn(
                    "h-10 rounded-[6px] border text-[14px] font-medium transition-colors duration-150",
                    minutes === m
                      ? "border-cobalt bg-[#eef3fd] text-cobalt-strong shadow-[0_0_0_1px_var(--color-cobalt)]"
                      : "border-control bg-surface text-ink hover:bg-canvas",
                  )}
                >
                  {m} minutes
                </button>
              ))}
            </div>
          </div>
          {err && (
            <p role="alert" className="text-[13px] font-medium text-[#b42318]">
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
            <Button variant="secondary" onClick={() => setSuspendOpen(false)}>
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
        <div className="flex items-center gap-3 rounded-[6px] border border-line bg-canvas p-3">
          <OrgMark name={o.name} size={32} />
          <Meta items={[`${o.members} members`, `${o.activeHolds} active holds`]} />
        </div>
        <Field label="Reason" htmlFor="sus-reason" className="mt-4" required>
          <Input id="sus-reason" value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} />
        </Field>
        {err && (
          <p role="alert" className="mt-3 text-[13px] font-medium text-[#b42318]">
            {err}
          </p>
        )}
      </Modal>
    </>
  );
}
