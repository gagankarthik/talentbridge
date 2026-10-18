"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/company";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { DetailSection, EmptyState, Kbd } from "@/components/ui/data-display";
import { ActiveFilters, FilterMenu, FilterSearch, Toolbar } from "@/components/ui/filter-menu";
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

const SHORTCUTS: [string[], string][] = [
  [["⌘", "K"], "Open the command palette"],
  [["/"], "Search the talent inventory"],
  [["↑", "↓"], "Move through palette results"],
  [["Esc"], "Close a panel or dialog"],
  [["Enter"], "Open the focused candidate"],
];

export function HelpCenter() {
  const { notify } = useWorkspace();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return TOPICS.filter((t) => topic === "all" || t.topic === topic)
      .map((t) => ({ ...t, items: t.items.filter((i) => !n || `${i.q} ${i.a}`.toLowerCase().includes(n)) }))
      .filter((t) => t.items.length);
  }, [q, topic]);
  const count = filtered.reduce((n, t) => n + t.items.length, 0);

  return (
    <div className="mx-auto grid w-full max-w-[1440px] items-start gap-6 px-4 py-6 sm:px-8 sm:py-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="overflow-hidden rounded-lg border border-hair bg-surface">
        <Toolbar
          summary={`${count} ${count === 1 ? "article" : "articles"}`}
          chips={
            <ActiveFilters
              filters={[
                ...(q.trim() ? [{ key: "q", label: "Search", value: `“${q.trim()}”`, onRemove: () => setQ("") }] : []),
                ...(topic !== "all" ? [{ key: "topic", label: "Topic", value: topic, onRemove: () => setTopic("all") }] : []),
              ]}
              onClearAll={() => {
                setQ("");
                setTopic("all");
              }}
            />
          }
        >
          <FilterSearch value={q} onChange={setQ} placeholder="Search help articles" className="sm:w-[320px]" />
          <FilterMenu
            label="Topic"
            value={topic}
            allValue="all"
            options={[{ value: "all", label: "All topics" }, ...TOPICS.map((t) => ({ value: t.topic, label: t.topic, meta: t.items.length }))]}
            onChange={setTopic}
          />
        </Toolbar>

        {filtered.length === 0 ? (
          <div className="border-t border-hair">
            <EmptyState icon={<IconSearch size={18} />} title="No articles match" description="Try another word or topic, or send us a message and we'll help." />
          </div>
        ) : (
          filtered.map((t) => (
            <section key={t.topic} className="border-t border-hair">
              <h2 className="flex h-10 items-center border-y border-hair bg-canvas px-5 text-[14px] font-semibold text-ink">{t.topic}</h2>
              <ul>
                {t.items.map((i) => {
                  const on = open === i.q;
                  return (
                    <li key={i.q} className="border-t border-hair first:border-0">
                      <button
                        onClick={() => setOpen(on ? null : i.q)}
                        aria-expanded={on}
                        className="flex min-h-[44px] w-full items-center justify-between gap-4 px-5 py-2.5 text-left text-[14px] font-medium text-ink transition-colors duration-150 hover:bg-canvas"
                      >
                        {i.q}
                        <IconChevronDown size={15} className={cn("shrink-0 text-subtle transition-transform duration-150 ease-power3-out", on && "rotate-180")} />
                      </button>
                      {on && <p className="anim-fade max-w-[72ch] px-5 pb-4 text-[14px] leading-relaxed text-ink-2">{i.a}</p>}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-hair bg-surface">
          <div className="flex items-center gap-2.5 px-5 py-3.5 shadow-[inset_0_-1px_0_var(--color-hair)]">
            <span className="relative flex size-2">
                            <span className="relative size-2 rounded-full bg-avail" />
            </span>
            <p className="text-[13.5px] font-medium text-ink">All systems operational</p>
          </div>

          <DetailSection title="Contact support">
            <ul className="space-y-2.5 text-[13.5px]">
              <li className="flex items-center gap-3">
                <IconPhone size={15} className="text-subtle" />
                <a href={`tel:${CONTACT.tel}`} className="tnum font-medium text-ink hover:text-cobalt">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IconMail size={15} className="text-subtle" />
                <a href={`mailto:${CONTACT.email}`} className="font-medium break-all text-ink hover:text-cobalt">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconClock size={15} className="mt-0.5 text-subtle" />
                <span className="text-subtle">{CONTACT.hours}</span>
              </li>
            </ul>
          </DetailSection>

          <DetailSection title="Send us a message">
            <form
              className="space-y-4"
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
              <Field label="How can we help?" htmlFor="h-message" error={err}>
                <Textarea id="h-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} aria-invalid={!!err} />
              </Field>
              <Button type="submit" variant="primary" className="w-full">
                Send message
              </Button>
            </form>
          </DetailSection>
        </div>

        <div id="shortcuts" className="scroll-mt-24 overflow-hidden rounded-lg border border-hair bg-surface">
          <DetailSection title="Keyboard shortcuts" bodyClassName="px-5 pt-2 pb-4">
            <ul>
              {SHORTCUTS.map(([keys, d]) => (
                <li key={d} className="flex items-center justify-between gap-4 py-2 text-[13px]">
                  <span className="text-ink-2">{d}</span>
                  <span className="flex shrink-0 gap-1">
                    {keys.map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}
