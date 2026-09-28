"use client";

import * as Switch from "@radix-ui/react-checkbox";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { MEMBERS, ORG_ROLES, ORGANIZATION } from "@/lib/org";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Modal } from "@/components/ui/overlay";
import { Pill } from "@/components/ui/status";
import { Select } from "@/components/ui/select";

const ME = MEMBERS[0];

function Card({ id, title, children, footer }: { id?: string; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-[12px] bg-surface ring-1 ring-line">
      <h2 className="border-b border-line px-5 py-4 text-[15px] font-semibold text-ink">{title}</h2>
      <div className="p-5">{children}</div>
      {footer && <footer className="flex justify-end gap-2 border-t border-line bg-canvas/60 px-5 py-3">{footer}</footer>}
    </section>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Switch.Root checked={checked} onCheckedChange={(v) => onChange(v === true)} aria-label={label} className="relative h-6 w-11 shrink-0 rounded-full bg-line-strong transition-colors data-[state=checked]:bg-cobalt">
      <span className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-surface shadow transition-transform", checked && "translate-x-5")} />
    </Switch.Root>
  );
}

const NOTIFICATIONS = [
  { key: "matches", title: "New matches for my open requisitions", def: true },
  { key: "holds", title: "A hold is about to expire", def: true },
  { key: "status", title: "A submission changes status", def: true },
  { key: "digest", title: "Weekly bench digest", def: false },
  { key: "product", title: "Product updates", def: false },
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

  return (
    <div className="grid gap-5 px-4 py-5 sm:px-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <Card
          title="Personal details"
          footer={
            <Button variant="primary" onClick={() => notify({ tone: "ok", title: "Profile saved" })}>
              Save changes
            </Button>
          }
        >
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-night text-[20px] font-semibold text-brand-bright">{initials}</span>
            <div>
              <p className="text-[16px] font-semibold text-ink">{name}</p>
              <p className="text-[13px] text-subtle">
                {ORG_ROLES.find((r) => r.id === ME.role)!.name} at {ORGANIZATION.name}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="p-name">
              <Input inputSize="lg" id="p-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Job title" htmlFor="p-title">
              <Input inputSize="lg" id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Work email" htmlFor="p-email" hint="Managed by your organization's sign-in.">
              <Input inputSize="lg" id="p-email" value={ME.email} disabled className="bg-canvas text-muted" />
            </Field>
            <Field label="Phone" htmlFor="p-phone">
              <Input inputSize="lg" id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            </Field>
            <Field label="Time zone" htmlFor="p-tz">
              <Select
                id="p-tz"
                size="lg"
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
        </Card>

        <Card id="notifications" title="Email notifications">
          <ul className="-my-3 divide-y divide-line">
            {NOTIFICATIONS.map((n) => (
              <li key={n.key} className="flex items-center justify-between gap-6 py-3.5">
                <span className="text-[14px] text-ink">{n.title}</span>
                <Toggle
                  checked={prefs[n.key]}
                  label={n.title}
                  onChange={(v) => {
                    setPrefs((p) => ({ ...p, [n.key]: v }));
                    notify({ tone: "ok", title: v ? "Notification turned on" : "Notification turned off", body: n.title });
                  }}
                />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="Security">
          <dl className="space-y-4 text-[14px]">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink">Password</dt>
              <dd>
                <Button size="sm" onClick={() => setPw(true)}>
                  Change
                </Button>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink">Two-factor authentication</dt>
              <dd>
                <Pill tone="avail">On</Pill>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink">Single sign-on</dt>
              <dd className="text-[13px] text-subtle">{ORGANIZATION.sso.provider}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Active sessions">
          <ul className="-my-2 divide-y divide-line">
            {sessions.map((s) => (
              <li key={s.device} className="flex items-center justify-between gap-4 py-3">
                <span>
                  <span className="block text-[14px] font-medium text-ink">{s.device}</span>
                  <span className="block text-xs text-subtle">
                    {s.where}, {s.when}
                  </span>
                </span>
                {s.current ? (
                  <span className="text-xs font-medium text-avail-ink">This device</span>
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
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Modal
        open={pw}
        onOpenChange={setPw}
        title="Change password"
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
