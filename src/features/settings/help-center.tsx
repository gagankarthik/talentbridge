"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/company";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { IconChevronDown, IconClock, IconMail, IconPhone, IconSearch } from "@/components/icons";

const TOPICS = [
  {
    topic: "Getting started",
    items: [
      { q: "What can I see in the workspace?", a: "Blind profiles of pre-vetted consultants, your shortlist, your requests and holds, and a dashboard of what needs attention." },
      { q: "Why are candidate names hidden?", a: "Profiles are redacted to protect consultants and your client relationships. The first name and last initial appear once you place a hold for a named client." },
    ],
  },
  {
    topic: "Searching talent",
    items: [
      { q: "How do filters and counts work?", a: "Each filter shows how many results you would get if you selected it, based on everything else you have selected. Options with no matches are dimmed. Use Quick views for common searches." },
      { q: "How do I match a job description?", a: "Choose Match a job spec, then paste the requirements or upload the document. Results show which requirements each consultant meets and misses." },
      { q: "Can I export profiles?", a: "Recruiters, admins and owners can export results to CSV. Exports include blind fields only and never names or contact details." },
    ],
  },
  {
    topic: "Holds and submissions",
    items: [
      { q: "What does a 48-hour hold do?", a: "It reserves a consultant for one named client so no other partner can submit them there for 48 hours. Release a hold early if the client passes." },
      { q: "Why can't I place a hold?", a: "Holds are blocked when a consultant hasn't confirmed availability in the last 7 days, or when another partner already holds them for the same client." },
      { q: "How do I send a profile to my client?", a: "Open the candidate and choose One-sheet. It opens a redacted, co-branded page you can print or save as PDF." },
    ],
  },
  {
    topic: "Account and organization",
    items: [
      { q: "How do I invite a teammate?", a: "Admins and owners can invite members from Organization, Members. Invites are limited to your organization's approved email domains." },
      { q: "What can each role do?", a: "See Organization, Roles and permissions for the full list. Owners and admins manage members and security; recruiters search, hold and export; account managers track submissions; viewers have read-only access." },
      { q: "How do I turn on single sign-on?", a: "An organization admin can connect your identity provider under Organization, Security. Contact support and we'll help with the setup." },
    ],
  },
];

const SHORTCUTS = [
  ["/", "Search the talent inventory"],
  ["Esc", "Close a panel or dialog"],
  ["Tab", "Move between controls"],
  ["Enter", "Open the focused candidate"],
];

export function HelpCenter() {
  const { notify } = useWorkspace();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return TOPICS.map((t) => ({ ...t, items: t.items.filter((i) => !n || `${i.q} ${i.a}`.toLowerCase().includes(n)) })).filter((t) => t.items.length);
  }, [q]);

  return (
    <div className="grid gap-5 px-4 py-5 sm:px-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="relative">
          <IconSearch size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search help articles"
            aria-label="Search help articles"
            className="h-12 w-full rounded-[12px] bg-surface pr-4 pl-11 text-[15px] ring-1 ring-inset ring-line-strong placeholder:text-faint focus:ring-2 focus:ring-cobalt focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[12px] bg-surface p-10 text-center ring-1 ring-line">
            <p className="text-[15px] font-semibold text-ink">No articles match &ldquo;{q}&rdquo;.</p>
            <p className="mt-1 text-[14px] text-muted">Try another word, or send us a message and we&apos;ll help.</p>
          </div>
        ) : (
          filtered.map((t) => (
            <section key={t.topic} className="rounded-[12px] bg-surface ring-1 ring-line">
              <h2 className="border-b border-line px-5 py-3.5 text-[15px] font-semibold text-ink">{t.topic}</h2>
              <ul className="divide-y divide-line">
                {t.items.map((i) => {
                  const on = open === i.q;
                  return (
                    <li key={i.q}>
                      <button onClick={() => setOpen(on ? null : i.q)} aria-expanded={on} className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left text-[14px] font-medium text-ink hover:bg-canvas">
                        {i.q}
                        <IconChevronDown size={16} className={cn("shrink-0 text-subtle transition-transform", on && "rotate-180")} />
                      </button>
                      {on && <p className="anim-fade px-5 pb-4 text-[14px] leading-relaxed text-muted">{i.a}</p>}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}

        <section id="shortcuts" className="scroll-mt-24 rounded-[12px] bg-surface ring-1 ring-line">
          <h2 className="border-b border-line px-5 py-3.5 text-[15px] font-semibold text-ink">Keyboard shortcuts</h2>
          <ul className="divide-y divide-line">
            {SHORTCUTS.map(([k, d]) => (
              <li key={k} className="flex items-center justify-between px-5 py-3 text-[14px]">
                <span className="text-ink">{d}</span>
                <kbd className="min-w-8 rounded-[6px] bg-canvas px-2 py-0.5 text-center font-sans text-[12px] font-medium text-ink-2 ring-1 ring-line-strong">{k}</kbd>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="space-y-5">
        <section className="rounded-[12px] bg-surface ring-1 ring-line">
          <h2 className="border-b border-line px-5 py-3.5 text-[15px] font-semibold text-ink">Contact support</h2>
          <ul className="space-y-3 p-5 text-[14px]">
            <li className="flex items-center gap-3">
              <IconPhone size={17} className="text-subtle" />
              <a href={`tel:${CONTACT.tel}`} className="font-medium text-ink hover:text-cobalt">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <IconMail size={17} className="text-subtle" />
              <a href={`mailto:${CONTACT.email}`} className="font-medium break-all text-ink hover:text-cobalt">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <IconClock size={17} className="text-subtle" />
              <span className="text-muted">{CONTACT.hours}</span>
            </li>
          </ul>
        </section>

        <section className="rounded-[12px] bg-surface ring-1 ring-line">
          <h2 className="border-b border-line px-5 py-3.5 text-[15px] font-semibold text-ink">Send us a message</h2>
          <form
            className="space-y-4 p-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!subject.trim() || message.trim().length < 10) return setErr("Add a subject and a few words about what you need.");
              setErr(null);
              setSubject("");
              setMessage("");
              notify({ tone: "ok", title: "Message sent to support", body: "We reply within one business day." });
            }}
          >
            <Field label="Subject" htmlFor="h-subject">
              <Input id="h-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Field>
            <Field label="How can we help?" htmlFor="h-message">
              <textarea
                id="h-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-ctl bg-surface px-3 py-2 text-sm text-ink ring-1 ring-inset ring-line-strong focus:ring-2 focus:ring-cobalt focus:outline-none"
              />
            </Field>
            {err && (
              <p role="alert" className="text-[13px] text-flag-ink">
                {err}
              </p>
            )}
            <Button type="submit" variant="primary" className="w-full">
              Send message
            </Button>
          </form>
        </section>

        <section className="rounded-[12px] bg-surface p-5 ring-1 ring-line">
          <p className="flex items-center gap-2 text-[14px] font-medium text-ink">
            <span className="size-2 rounded-full bg-avail" />
            All systems operational
          </p>
        </section>
      </div>
    </div>
  );
}
