"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { SERVICES, type ServiceSlug } from "@/lib/company";
import { ServiceGlyph } from "@/components/service-glyph";
import { buttonClass } from "@/components/ui/button";
import { IconCheck } from "@/components/icons";

const AUDIENCES: {
  id: string;
  tab: string;
  headline: string;
  body: string;
  outcomes: string[];
  services: ServiceSlug[];
  cta: { href: string; label: string };
  panel: string;
}[] = [
  {
    id: "enterprises",
    tab: "Enterprises",
    headline: "Fill critical engineering roles without a months-long search.",
    body: "Engineering and talent leaders use TalentBridge when a project can't wait. You get senior consultants who have already been screened, cleared and confirmed available.",
    outcomes: ["Matched shortlist within one business day", "Consultants start within 48 hours", "Replacement at no cost in the first two weeks"],
    services: ["contract-staffing", "contract-to-hire", "dedicated-delivery-teams"],
    cta: { href: "/contact", label: "Talk to a client partner" },
    panel: "bg-acc-cobalt",
  },
  {
    id: "agencies",
    tab: "Staffing agencies",
    headline: "Submit more qualified candidates to the clients you already serve.",
    body: "Recruiters and account managers extend their bench with ours. Profiles arrive redacted and co-branded, and 48-hour holds protect you from duplicate submissions.",
    outcomes: ["Pre-vetted profiles under your agency brand", "Client-scoped 48-hour holds", "Live bench access through the partner portal"],
    services: ["agency-bench-partnerships", "technical-vetting", "compliance-and-onboarding"],
    cta: { href: "/talent", label: "Open the partner portal" },
    panel: "bg-acc-violet",
  },
  {
    id: "consultants",
    tab: "Consultants",
    headline: "Get matched to enterprise roles that fit your stack and rate.",
    body: "Pass one technical panel and one compliance check, then stay on the bench between engagements. We bring you roles; you confirm availability once a week.",
    outcomes: ["One screen, many client opportunities", "Your identity stays private until you're reserved", "W2 or corp-to-corp, your choice"],
    services: ["technical-vetting", "compliance-and-onboarding"],
    cta: { href: "/careers", label: "Join the talent network" },
    panel: "bg-acc-teal",
  },
];

export function TeamSolutions() {
  const [tab, setTab] = useState(AUDIENCES[0].id);

  // Deep links such as /#agencies
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.slice(1);
      if (AUDIENCES.some((t) => t.id === h)) {
        setTab(h);
        document.getElementById("who-we-serve")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <Tabs.Root value={tab} onValueChange={setTab}>
      <Tabs.List aria-label="Who we serve" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-placed-bg p-1 ring-1 ring-line">
        {AUDIENCES.map((t) => (
          <Tabs.Trigger
            key={t.id}
            value={t.id}
            className="h-10 shrink-0 rounded-full px-5 text-[14px] font-medium whitespace-nowrap text-muted transition-colors hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-[0_2px_8px_-2px_rgb(10_22_49/0.15)]"
          >
            {t.tab}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {AUDIENCES.map((t) => (
        <Tabs.Content key={t.id} value={t.id} className="anim-fade mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[24px] bg-surface p-8 ring-1 ring-line sm:p-10">
            <h3 className="max-w-lg text-[28px] leading-tight font-semibold tracking-[-0.025em]">{t.headline}</h3>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted">{t.body}</p>
            <ul className="mt-7 space-y-3">
              {t.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 text-[15px] font-medium text-ink">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-avail-bg text-avail-ink">
                    <IconCheck size={12} strokeWidth={2.5} />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
            <Link href={t.cta.href} className={buttonClass("dark", "lg", "mt-8 rounded-full")}>
              {t.cta.label}
            </Link>
          </div>
          <div className={cn("flex flex-col justify-between gap-6 rounded-[24px] p-8 text-white sm:p-10", t.panel)}>
            <p className="text-[14px] font-medium text-white/80">Services for {t.tab.toLowerCase()}</p>
            <ul className="space-y-3">
              {t.services.map((slug) => {
                const s = SERVICES.find((x) => x.slug === slug)!;
                return (
                  <li key={slug}>
                    <Link href={`/services/${slug}`} className="flex items-center gap-4 rounded-[14px] bg-white/10 p-4 ring-1 ring-white/15 transition-colors hover:bg-white/[0.16]">
                      <ServiceGlyph slug={slug} size={44} tone="white" />
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold">{s.name}</span>
                        <span className="block text-[13px] leading-snug text-white/75">{s.summary}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
