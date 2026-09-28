import { container, cta, section, type } from "@/components/site/styles";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/company";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CountUp, Reveal } from "@/components/motion";
import { ScrollFillText } from "@/components/scroll-fill-text";
import { Workflow } from "@/features/landing/workflow";
import { ContactCta } from "@/features/site/contact-cta";

export const metadata: Metadata = {
  alternates: { canonical: "/company" },
  title: "About TalentBridge",
  description: "An IT staffing partner built around a verified bench of senior engineers.",
};

const PRINCIPLES = [
  { t: "Verified, not claimed", d: "We confirm work authorization, delivery history and availability ourselves. Nothing on a profile is taken on trust.", tone: "bg-acc-cobalt" },
  { t: "Fast because we prepared", d: "Profiles are ready before the requisition arrives, which is how we deliver shortlists in a day and starts in 48 hours.", tone: "bg-acc-violet" },
  { t: "Fair to consultants", d: "Clear rates, private profiles and one screen that opens many doors. Consultants who are treated well stay and deliver.", tone: "bg-acc-teal" },
  { t: "Your client stays yours", d: "Redacted profiles and client-scoped holds protect the relationships our agency partners have built.", tone: "bg-acc-plum" },
];

export default function CompanyPage() {

  return (
    <>
      <section className="bg-surface">
        <div className={cn(container, "pt-14 pb-16 lg:pt-20")}>
          <p className="text-[14px] font-semibold text-brand">About TalentBridge</p>
          <h1 className={cn(type.hero, "mt-4 max-w-[16ch]")}>
            We built the bench we always wanted to submit from.
          </h1>
          <div className="mt-10 grid gap-8 border-t border-line pt-8 lg:grid-cols-2">
            <p className="max-w-[36em] text-[18px] leading-relaxed text-muted">
              Tech staffing usually means reading hundreds of resumes, chasing references and discovering on day one that a candidate&apos;s visa has lapsed. We do that
              work before anyone asks, so our clients and agency partners get engineers who are ready to start.
            </p>
            <div className="flex flex-wrap items-end gap-3 lg:justify-end">
              <ContactCta label="Work with us" />
              <Link href="/careers" className={cta.outline}>
                Join as a consultant
              </Link>
            </div>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-[1.6fr_1fr]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] sm:aspect-auto sm:min-h-[420px]">
              <Image src="/images/office-standup.jpg" alt="TalentBridge team in a morning standup" fill priority sizes="(min-width: 640px) 60vw, 100vw" className="object-cover" />
            </div>
            <div className="grid gap-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] sm:aspect-auto">
                <Image src="/images/office-interior.jpg" alt="" fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover" />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] sm:aspect-auto">
                <Image src="/images/client-briefing.jpg" alt="" fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-night text-white">
        <dl className={cn(container, "grid grid-cols-2 gap-y-10 py-16 lg:grid-cols-4")}>
          {[
            { v: 48, s: "h", l: "From selection to first day" },
            { v: 1, s: " day", l: "To a matched shortlist" },
            { v: 4, s: "", l: "Checks before any presentation" },
            { v: 2, s: " wks", l: "Free replacement window" },
          ].map((x) => (
            <div key={x.l}>
              <dd className="font-display text-[56px] leading-none font-light tracking-[-0.03em]">
                <CountUp value={x.v} suffix={x.s} />
              </dd>
              <dt className="mt-3 max-w-[14em] text-[14px] text-slate-400">{x.l}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-surface">
        <div className={cn(container, section)}>
          <ScrollFillText
            as="p"
            text="Every engineer we present has been screened by an engineer, verified by our compliance team and confirmed available in the last seven days."
            className="max-w-5xl text-[36px] leading-[1.12] font-light tracking-[-0.02em] sm:text-[56px]"
          />
        </div>
      </section>

      <section className="bg-canvas">
        <div className={cn(container, section)}>
          <Reveal>
            <h2 className={type.h2}>What we stand for</h2>
          </Reveal>
          <Reveal stagger className="mt-12 grid gap-5 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <article key={p.t} className="flex gap-6 rounded-[20px] bg-surface p-8 ring-1 ring-line">
                <span className={`mt-1 h-12 w-1.5 shrink-0 rounded-full ${p.tone}`} />
                <div>
                  <h3 className="text-[21px] font-semibold tracking-[-0.015em]">{p.t}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{p.d}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="vetting" className="scroll-mt-24 bg-surface">
        <div className={cn(container, section)}>
          <Reveal className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 className={type.h2}>Our vetting standard</h2>
            <p className="max-w-lg text-[17px] leading-relaxed text-muted lg:justify-self-end">
              The same four checks apply to every consultant, whether they&apos;re placed directly with an enterprise or submitted by one of our agency partners.
            </p>
          </Reveal>
          <Reveal className="mt-12">
            <Workflow />
          </Reveal>
        </div>
      </section>

      <section className="bg-paper">
        <div className={cn(container, section, "grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center")}>
          <div>
            <p className={type.context}>Head office</p>
            <h2 className={cn(type.h2, "mt-3")}>{CONTACT.office}</h2>
            <p className={cn(type.lede, "mt-4 max-w-md")}>Our client partners, talent operations and compliance team work from one office, so a requisition never waits on a handoff.</p>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-[16px] bg-line ring-1 ring-line sm:grid-cols-3">
            {[
              ["Call", CONTACT.phone, `tel:${CONTACT.tel}`],
              ["Email", CONTACT.email, `mailto:${CONTACT.email}`],
              ["Hours", "Mon–Fri, 8:00 AM–5:00 PM EST", ""],
            ].map(([k, v, href]) => (
              <div key={k} className="bg-surface p-5">
                <dt className="text-[13px] text-subtle">{k}</dt>
                <dd className="mt-1 text-[15px] font-semibold break-words text-ink">{href ? <a href={href} className="hover:text-brand">{v}</a> : v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
