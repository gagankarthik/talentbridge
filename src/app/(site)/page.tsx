import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { deckProfiles } from "@/lib/landing";
import { CONTACT, INDUSTRIES } from "@/lib/company";
import { cn } from "@/lib/cn";
import { container, cta, headGap, section, type } from "@/components/site/styles";
import { ScrollFillText } from "@/components/scroll-fill-text";
import { INDUSTRY_ICON } from "@/components/site/industry-icons";
import { TalentDeck } from "@/features/site/talent-deck";
import { HireTalentForm } from "@/features/site/hire-talent";
import { Faq } from "@/features/site/faq";
import { ServicesBento } from "@/features/site/services-bento";
import { VettingStory } from "@/features/site/vetting-story";
import { HeroSlideshow, type HeroSlide } from "@/features/site/hero-slideshow";

export const metadata: Metadata = {
  title: { absolute: "TalentBridge | Pre-vetted engineers for enterprises and staffing firms" },
  description:
    "TalentBridge is an IT staffing partner. Technically screened, compliance-cleared engineers for contract, contract-to-hire and dedicated teams, ready to start in 48 hours.",
  alternates: { canonical: "/" },
};

// Engagement-led, not technology-led: the stack is matched to each client's need.
const HERO_SLIDES: HeroSlide[] = [
  {
    practice: "Contract staffing",
    role: "Senior engineers for project roles",
    line: "Screened, cleared and ready to start in 48 hours.",
    img: "/images/engineers-pairing.jpg",
    alt: "Two engineers reviewing work together",
    href: "/services/contract-staffing",
  },
  {
    practice: "Staffing partnerships",
    role: "A vetted bench for your clients",
    line: "Submit under your brand with 48-hour client holds.",
    img: "/images/technical-panel.jpg",
    alt: "A team working together at laptops",
    href: "/services/agency-bench-partnerships",
  },
  {
    practice: "Contract-to-hire",
    role: "Evaluate before you hire",
    line: "Start on contract, convert on terms agreed up front.",
    img: "/images/consultants-at-work.jpg",
    alt: "Engineers working at their desks",
    href: "/services/contract-to-hire",
  },
];

const AUDIENCES = [
  {
    img: "/images/recruiter-discussion.jpg",
    who: "For staffing firms",
    title: "Submit vetted engineers to the clients you already serve.",
    body: "Redacted, co-branded profiles and 48-hour client holds that stop duplicate submissions.",
    href: "/services/agency-bench-partnerships",
    cta: "Partner with us",
    tone: "bg-acc-violet",
  },
  {
    img: "/images/enterprise-floor.jpg",
    who: "For enterprises",
    title: "Senior contractors on your team within 48 hours.",
    body: "Contract, contract-to-hire or a full delivery team, all from a compliance-cleared bench.",
    href: "/services/contract-staffing",
    cta: "Hire contractors",
    tone: "bg-brand",
  },
  {
    img: "/images/consultants-at-work.jpg",
    who: "For consultants",
    title: "Pass one screen. Get matched to enterprise roles.",
    body: "Stay on the bench between contracts. Your identity stays private until a client places a hold.",
    href: "/careers",
    cta: "Join the network",
    tone: "bg-coral",
  },
];

const MODELS = [
  { name: "Contract", best: "Project roles and backfills", start: "48 hours", term: "3 to 18 months", billing: "Hourly, W2 or C2C", href: "/services/contract-staffing" },
  { name: "Contract-to-hire", best: "Roles you plan to make permanent", start: "48 hours", term: "3 to 6 months, then convert", billing: "Hourly, fixed conversion fee", href: "/services/contract-to-hire" },
  { name: "Delivery team", best: "Migrations and platform builds", start: "2 weeks", term: "6 months or more", billing: "Monthly per engineer", href: "/services/dedicated-delivery-teams" },
];

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "EmploymentAgency",
  name: "TalentBridge",
  description: "IT staffing partner providing pre-vetted, compliance-cleared engineers to enterprises and staffing firms.",
  telephone: CONTACT.tel,
  email: CONTACT.email,
  address: { "@type": "PostalAddress", addressLocality: "Powell", addressRegion: "OH", addressCountry: "US" },
  openingHours: "Mo-Fr 08:00-17:00",
  areaServed: "US",
};

export default function HomePage() {

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />

      {/* 1. Hero */}
      <HeroSlideshow slides={HERO_SLIDES} />

      {/* 2. Who we serve */}
      <section className="bg-surface">
        <div className={cn(container, section)}>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 className={type.h2}>One bench. Three ways to work with us.</h2>
            <p className={cn(type.lede, "max-w-lg lg:justify-self-end")}>Whether you hire directly, staff for your own clients or are looking for your next contract, it starts with the same vetted bench.</p>
          </div>
          <div className={cn(headGap, "grid gap-10 md:grid-cols-3 md:gap-6")}>
            {AUDIENCES.map((a) => (
              <Link key={a.who} href={a.href} className="group flex flex-col">
                <div className="relative aspect-[4/3.3] overflow-hidden rounded-[20px]">
                  <Image src={a.img} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <span className={cn("absolute right-4 bottom-4 left-4 inline-flex h-12 items-center justify-center rounded-full text-[15px] font-semibold text-white", a.tone)}>{a.cta}</span>
                </div>
                <p className="mt-6 text-[13.5px] font-semibold text-subtle">{a.who}</p>
                <h3 className="mt-1.5 text-[22px] leading-snug font-semibold tracking-[-0.015em] text-ink">{a.title}</h3>
                <p className={cn(type.body, "mt-2")}>{a.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The bench is ready */}
      <section className="bg-paper">
        <div className={cn(container, section, "grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center")}>
          <div>
            <ScrollFillText text="The right engineer is vetted before you ask." className={cn(type.statement, "max-w-[12ch]")} />
            <p className={cn(type.lede, "mt-8 max-w-[32em]")}>
              Tell us the role. Within a business day you see profiles of engineers who have passed a live technical panel, cleared compliance and confirmed they can
              start. Names stay private until you place a hold.
            </p>
            <ul className="mt-8 max-w-md border-t border-line-strong text-[16px] text-ink">
              {["Verified skills and delivery history", "Technical screen scores in four dimensions", "Rates agreed before you interview"].map((t) => (
                <li key={t} className="border-b border-line-strong py-3">
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/recruiters" className={cn(cta.dark, "mt-10")}>
              See sample profiles
            </Link>
          </div>
          <div className="rounded-[20px] bg-night p-6 sm:p-10">
            <TalentDeck profiles={deckProfiles()} />
          </div>
        </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="scroll-mt-24 bg-surface">
        <div className={cn(container, section)}>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 className={type.h2}>Staffing services built on verified talent.</h2>
            <p className={cn(type.lede, "max-w-lg lg:justify-self-end")}>
              One senior engineer next week or a delivery team for a year-long program. Every engagement starts from the same vetted, compliant bench.
            </p>
          </div>
          <div className={headGap}>
            <ServicesBento />
          </div>

          {/* Engagement models, for buyers comparing options */}
          <h3 className="mt-20 text-[22px] font-semibold tracking-[-0.015em] text-ink">Compare engagement models</h3>
          <div className="mt-5 overflow-x-auto rounded-[20px] ring-1 ring-line">
            <table className="w-full min-w-[720px] text-left text-[15px]">
              <caption className="sr-only">Engagement models compared</caption>
              <thead className="bg-paper text-[13px] text-subtle">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Engagement</th>
                  <th scope="col" className="px-6 py-4 font-medium">Best for</th>
                  <th scope="col" className="px-6 py-4 font-medium">Time to start</th>
                  <th scope="col" className="px-6 py-4 font-medium">Typical term</th>
                  <th scope="col" className="px-6 py-4 font-medium">Billing</th>
                </tr>
              </thead>
              <tbody>
                {MODELS.map((m) => (
                  <tr key={m.name} className="border-t border-line">
                    <th scope="row" className="px-6 py-5 font-semibold text-ink">
                      <Link href={m.href} className="underline-offset-4 hover:text-brand hover:underline">
                        {m.name}
                      </Link>
                    </th>
                    <td className="px-6 py-5 text-muted">{m.best}</td>
                    <td className="px-6 py-5 font-medium text-ink">{m.start}</td>
                    <td className="px-6 py-5 text-muted">{m.term}</td>
                    <td className="px-6 py-5 text-muted">{m.billing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[14px] text-subtle">Every engagement includes free replacement in the first two weeks and no fee unless you hire.</p>
        </div>
      </section>

      {/* 5. How we vet */}
      <section id="vetting" className="scroll-mt-24 bg-paper">
        <div className={cn(container, section)}>
          <VettingStory
            heading={
              <>
                <h2 className={type.h2}>Four checks before you ever see a profile.</h2>
                <p className={cn(type.lede, "mt-5 max-w-md")}>The same standard applies whether we place directly or through one of our agency partners.</p>
              </>
            }
          />
        </div>
      </section>

      {/* 7. Industries */}
      <section id="industries" className="scroll-mt-24 bg-paper">
        <div className={cn(container, section)}>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 className={type.h2}>Engineers who already know your industry.</h2>
            <p className={cn(type.lede, "max-w-lg lg:justify-self-end")}>Regulated industries need people who understand the rules as well as the systems.</p>
          </div>
          <ul className={cn(headGap, "grid gap-px overflow-hidden rounded-[20px] bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3")}>
            {INDUSTRIES.map((ind) => {
              const Icon = INDUSTRY_ICON[ind.query];
              return (
                <li key={ind.name} className="bg-surface">
                  <Link href={`/contact?industry=${encodeURIComponent(ind.query)}`} className="group flex h-full items-start gap-5 p-7 transition-colors hover:bg-brand-wash/60">
                    <span className="grid size-14 shrink-0 place-items-center rounded-[14px] bg-paper text-ink ring-1 ring-line transition-colors group-hover:bg-surface">
                      <Icon size={30} />
                    </span>
                    <span>
                      <span className="block text-[18px] font-semibold text-ink">{ind.name}</span>
                      <span className="mt-1 block text-[15px] text-muted">{ind.note}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 8. Commitments (verifiable service levels instead of testimonials) */}
      <section className="bg-brand-wash">
        <div className={cn(container, section)}>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 className={type.h2}>What you can hold us to.</h2>
            <p className={cn(type.lede, "max-w-lg lg:justify-self-end")}>Service levels written into every engagement, so hiring managers know exactly what to expect.</p>
          </div>
          <dl className={cn(headGap, "grid gap-px overflow-hidden rounded-[20px] bg-brand/15 sm:grid-cols-2 lg:grid-cols-4")}>
            {[
              ["1 business day", "Matched, redacted profiles for every requisition we accept."],
              ["48 hours", "From your selection to the consultant's first day."],
              ["4 checks", "Technical panel, compliance, references and weekly availability."],
              ["2 weeks", "Free replacement if a consultant isn't the right fit."],
            ].map(([v, d]) => (
              <div key={v} className="bg-surface p-7">
                <dt className="font-display text-[40px] leading-none font-light tracking-[-0.02em] text-brand">{v}</dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 9. Requisition */}
      <section id="hire" className="scroll-mt-24 bg-night text-white">
        <div className={cn(container, section, "grid gap-12 lg:grid-cols-[1fr_520px] lg:items-center")}>
          <div>
            <h2 className="font-display text-[42px] leading-[1.03] font-light tracking-[-0.025em] sm:text-[60px]">Send us the role you haven&apos;t been able to fill.</h2>
            <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-slate-300">
              Tell us the role and the rate. Within one business day you&apos;ll have matched, pre-vetted profiles, and your consultant can start 48 hours after you choose.
            </p>
            <ul className="mt-8 max-w-md border-t border-white/15 text-[16px] text-slate-200">
              {["No placement, no fee", "Free replacement in the first two weeks", "W2, corp-to-corp and contract-to-hire"].map((t) => (
                <li key={t} className="border-b border-white/15 py-3">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[15px] text-slate-300">
              Prefer to talk?{" "}
              <a href={`tel:${CONTACT.tel}`} className="font-semibold text-white underline-offset-4 hover:underline">
                {CONTACT.phone}
              </a>
            </p>
          </div>
          <div className="rounded-[20px] bg-surface p-6 text-ink sm:p-8">
            <p className="text-[21px] font-semibold tracking-[-0.015em]">Hire pre-vetted talent</p>
            <p className="mt-1 mb-6 text-[15px] text-muted">Takes under a minute. We reply within one business day.</p>
            <HireTalentForm />
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="scroll-mt-24 bg-surface">
        <div className={cn(container, section, "grid gap-12 lg:grid-cols-[1fr_1.6fr]")}>
          <div>
            <h2 className={type.h2}>Questions, answered.</h2>
            <p className={cn(type.body, "mt-5 max-w-sm")}>Can&apos;t find what you need? We answer within one business day.</p>
            <Link href="/contact" className={cn(cta.outline, "mt-7")}>
              Contact us
            </Link>
          </div>
          <Faq />
        </div>
      </section>

      {/* 11. Closing */}
      <section className="bg-paper">
        <div className={cn(container, section, "grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
            <Image src="/images/office-standup.jpg" alt="A delivery team in a morning standup" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className={cn(type.h2, "max-w-[14ch]")}>Your next great hire is one requisition away.</h2>
            <p className={cn(type.lede, "mt-6 max-w-[32em]")}>Browse blind profiles or send us the role and we&apos;ll do the matching.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className={cta.primary}>
                Get in touch
              </Link>
              <Link href="/recruiters" className={cta.outline}>
                Browse available talent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
