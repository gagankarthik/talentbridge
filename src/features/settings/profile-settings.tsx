"use client";

import { useState } from "react";
import { MEMBERS, ORG_ROLES, ORGANIZATION } from "@/lib/org";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/overlay";
import { DetailSection } from "@/components/ui/data-display";
import { Tag } from "@/components/ui/status";
import { Select } from "@/components/ui/select";
import { SettingRow, Switch } from "@/components/ui/switch";

const ME = MEMBERS[0];

const NOTIFICATIONS = [
  { key: "matches", title: "New matches for my open requisitions", body: "When a newly verified engineer fits a role you've searched for.", def: true },
  { key: "holds", title: "A hold is about to expire", body: "Six hours and one hour before a 48-hour hold ends.", def: true },
  { key: "status", title: "A submission changes status", body: "Interview scheduled, offer made, start confirmed.", def: true },
  { key: "digest", title: "Weekly bench digest", body: "Monday morning summary of who's available by practice.", def: false },
  { key: "product", title: "Product updates", body: "New features in the workspace, at most once a month.", def: false },
];

const SESSIONS = [
  { device: "Chrome on Windows", where: "Columbus, OH", when: "Active now", current: true },
  { device: "Safari on iPhone", where: "Columbus, OH", when: "2 days ago", current: false },
];

export function ProfileSettings() {
  const { notify } = useWorkspace();
  const [name, setName] = useState(ME.name);
  const [title, setTitle] = useState(ME.title);
  const [phone, setPhone] = useState("+1 (614) 555-0142");
  const [tz, setTz] = useState("America/New_York");
  const [prefs, setPrefs] = useState<Record<string, boolean>>(Object.fromEntries(NOTIFICATIONS.map((n) => [n.key, n.def])));
  const [pw, setPw] = useState(false);
  const [sessions, setSessions] = useState(SESSIONS);
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2);
  const roleName = ORG_ROLES.find((r) => r.id === ME.role)!.name;

  return (
    <div className="mx-auto grid w-full max-w-[1440px] items-start gap-6 px-4 py-6 sm:px-8 sm:py-8 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="overflow-hidden rounded-lg border border-hair bg-surface">
        {/* Identity */}
        <div className="flex items-center gap-4 px-5 py-5 shadow-[inset_0_-1px_0_var(--color-hair)]">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cobalt-wash text-[16px] font-semibold text-cobalt-strong">{initials}</span>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold text-ink">{name}</p>
            <p className="text-[13px] text-subtle">
              {title} · {roleName} at {ORGANIZATION.name}
            </p>
          </div>
        </div>

        <DetailSection
          title="Personal details"
          action={
            <Button size="sm" variant="primary" onClick={() => notify({ tone: "ok", title: "Profile saved" })}>
              Save changes
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="p-name">
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Job title" htmlFor="p-title">
              <Input id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Work email" htmlFor="p-email" hint="Managed by your organization's sign-in.">
              <Input id="p-email" value={ME.email} disabled className="bg-canvas text-ink-2" />
            </Field>
            <Field label="Phone" htmlFor="p-phone">
              <Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            </Field>
            <Field label="Time zone" htmlFor="p-tz">
              <Select
                id="p-tz"
                className="w-full"
                value={tz}
                onValueChange={setTz}
                options={[
                  { value: "America/New_York", label: "Eastern (ET)" },
                  { value: "America/Chicago", label: "Central (CT)" },
                  { value: "America/Denver", label: "Mountain (MT)" },
                  { value: "America/Los_Angeles", label: "Pacific (PT)" },
                ]}
              />
            </Field>
          </div>
        </DetailSection>

        <DetailSection id="notifications" title="Email notifications" bodyClassName="px-5 pt-1 pb-3">
          {NOTIFICATIONS.map((n) => (
            <SettingRow key={n.key} title={n.title} description={n.body}>
              <Switch
                checked={prefs[n.key]}
                label={n.title}
                onChange={(v) => {
                  setPrefs((p) => ({ ...p, [n.key]: v }));
                  notify({ tone: "ok", title: v ? "Notification turned on" : "Notification turned off", body: n.title });
                }}
              />
            </SettingRow>
          ))}
        </DetailSection>
      </div>

      <div className="overflow-hidden rounded-lg border border-hair bg-surface">
        <DetailSection title="Security" bodyClassName="px-5 pt-1 pb-3">
          <SettingRow title="Password" description="Last changed 4 months ago.">
            <Button size="sm" onClick={() => setPw(true)}>
              Change
            </Button>
          </SettingRow>
          <SettingRow title="Two-factor authentication">
            <Tag tone="green" dot>
              On
            </Tag>
          </SettingRow>
          <SettingRow title="Single sign-on">
            <span className="text-[13px] text-subtle">{ORGANIZATION.sso.provider}</span>
          </SettingRow>
        </DetailSection>

        <DetailSection title="Active sessions" bodyClassName="px-5 pt-1 pb-3">
          {sessions.map((s) => (
            <SettingRow key={s.device} title={s.device} description={`${s.where} · ${s.when}`}>
              {s.current ? (
                <Tag tone="blue" size="sm">
                  This device
                </Tag>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSessions((ss) => ss.filter((x) => x.device !== s.device));
                    notify({ tone: "ok", title: `Signed out of ${s.device}` });
                  }}
                >
                  Sign out
                </Button>
              )}
            </SettingRow>
          ))}
        </DetailSection>
      </div>

      <Modal
        open={pw}
        onOpenChange={setPw}
        title="Change password"
        description="You'll stay signed in on this device. Other sessions are signed out."
        footer={
          <>
            <Button variant="ghost" onClick={() => setPw(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setPw(false);
                notify({ tone: "ok", title: "Password updated" });
              }}
            >
              Update password
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Current password" htmlFor="pw-current">
            <Input id="pw-current" type="password" autoComplete="current-password" />
          </Field>
          <Field label="New password" htmlFor="pw-new" hint="At least 12 characters.">
            <Input id="pw-new" type="password" autoComplete="new-password" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
