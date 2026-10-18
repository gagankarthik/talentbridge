import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/company";
import { cn } from "@/lib/cn";
import { card, container, cta, headGap, section, type } from "@/components/site/styles";
import { Reveal } from "@/components/motion";
import { IconChevronRight, IconMail, IconPhone } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/company" },
  title: "About TalentBridge",
  description: "An IT staffing partner built around a verified bench of senior engineers.",
};

const PRINCIPLES = [
  { t: "Verified, not claimed", d: "We confirm work authorization, delivery history and availability ourselves. Nothing on a profile is taken on trust." },
  { t: "Fast because we prepared", d: "Profiles are ready before the requisition arrives, which is how we deliver shortlists in a day and starts in 48 hours." },
  { t: "Fair to engineers", d: "Clear rates, private profiles and one screen that opens many doors. Engineers who are treated well stay and deliver." },
  { t: "Your client stays yours", d: "Redacted profiles and client-scoped holds protect the relationships our agency partners have built." },
];

/** The vetting standard as a real table: what each check is, how long it takes and who runs it. */
const STANDARD = [
  { check: "Technical panel", when: "90 minutes", who: "A senior engineer from the same discipline", what: "System design, hands-on coding, domain depth and communication, each scored" },
  { check: "Compliance", when: "Before any presentation", who: "Our compliance team", what: "E-Verify match, I-9 review, background check and three professional references" },
  { check: "Availability", when: "Every 7 days", who: "The engineer, confirmed by us", what: "Anyone who doesn't re-confirm is held back from the bench" },
  { check: "Deployment", when: "Within 48 hours", who: "Your client partner", what: "Contract, onboarding and first day, once you choose" },
];

const FIGURES = [
  { v: "48 hours", l: "from selection to the first day" },
  { v: "1 business day", l: "to a matched, redacted shortlist" },
  { v: "4 checks", l: "before any profile is presented" },
  { v: "2 weeks", l: "free replacement window" },
];

export default function CompanyPage() {
  return (
    <>
      {/* Page hero */}
      <section className="border-b border-[#dfe3ea] bg-white">
        <div className={cn(container, "grid gap-10 py-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-16")}>
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-[14px] text-muted">
                <li>
                  <Link href="/" className="hover:text-brand">
                    Home
                  </Link>
                </li>
                <IconChevronRight size={14} aria-hidden="true" />
                <li aria-current="page" className="font-medium text-ink">
                  Company
                </li>
              </ol>
            </nav>
            <h1 className={cn(type.hero, "mt-6")}>A staffing partner built on a verified bench.</h1>
            <p className={cn(type.lede, "mt-5 max-w-[36em]")}>
              Tech staffing usually means reading hundreds of resumes, chasing references and discovering on day one that a visa has lapsed. We do that work before
              anyone asks, so our clients and agency partners get engineers who are ready to start.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className={cta.primary}>
                Work with us
              </Link>
              <Link href="/careers" className={cta.outline}>
                Join as an engineer
              </Link>
            </div>
          </div>
          {/* Full-colour photo with what clients can hold us to, set on its lower-left corner */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#f5f7fa] lg:aspect-[4/5]">
              <Image src="/images/office-standup.jpg" alt="The TalentBridge delivery team in a morning standup" fill priority sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
            </div>
            <dl className={cn(card, "relative mx-4 -mt-16 divide-y divide-[#dfe3ea] shadow-[0_12px_32px_-8px_rgb(11_27_51/0.18)] sm:mr-auto sm:ml-6 sm:max-w-[320px]")}>
              <div className="px-5 py-3">
                <dt className="text-[13px] font-semibold text-ink-2">What clients can hold us to</dt>
              </div>
              {FIGURES.map((x) => (
                <div key={x.l} className="flex items-baseline justify-between gap-4 px-5 py-3">
                  <dt className="text-[14px] text-ink-2 first-letter:uppercase">{x.l}</dt>
                  <dd className="tnum shrink-0 text-right text-[15px] font-semibold text-ink">{x.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="pr-h" className="bg-[#eef3fd]">
        <div className={cn(container, section, "grid gap-10 lg:grid-cols-12 lg:gap-12")}>
          <Reveal className="lg:col-span-4">
            <h2 id="pr-h" className={type.h2}>
              Four principles we work by
            </h2>
            <p className={cn(type.body, "mt-4 max-w-[34ch]")}>They decide how we screen engineers, price engagements and treat the partners we work with.</p>
          </Reveal>
          <dl className={cn(card, "grid divide-y divide-[#dfe3ea] sm:grid-cols-2 sm:divide-y-0 lg:col-span-8")}>
            {PRINCIPLES.map((p, i) => (
              <div key={p.t} className={cn("p-6 sm:p-8", i % 2 === 1 && "sm:border-l sm:border-[#dfe3ea]", i > 1 && "sm:border-t sm:border-[#dfe3ea]")}>
                <dt className="text-[19px] font-semibold text-ink">{p.t}</dt>
                <dd className="mt-2 text-[16px] leading-[1.6] text-ink-2">{p.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The vetting standard: a real table, because it is one */}
      <section id="vetting" aria-labelledby="vet-h" className="scroll-mt-20 bg-navy text-white">
        <div className={cn(container, section)}>
          <Reveal className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <h2 id="vet-h" className={cn(type.h2, "text-white lg:col-span-7")}>
              Our vetting standard
            </h2>
            <p className={cn(type.body, "max-w-[44ch] text-[#c3cbd9] lg:col-span-5")}>
              The same four checks apply to every engineer, whether placed directly with an enterprise or submitted by one of our agency partners.
            </p>
          </Reveal>

          <dl className={cn(headGap, "space-y-4 lg:hidden")}>
            {STANDARD.map((r) => (
              <div key={r.check} className={cn(card, "p-6")}>
                <dt className="text-[19px] font-semibold text-ink">{r.check}</dt>
                <dd className="tnum mt-1 text-[15px] font-semibold text-brand">{r.when}</dd>
                <dd className="mt-3 text-[16px] leading-[1.6] text-ink">{r.what}</dd>
                <dd className="mt-2 text-[15px] text-ink-2">Run by {r.who.charAt(0).toLowerCase() + r.who.slice(1)}</dd>
              </div>
            ))}
          </dl>

          <div className={cn(headGap, card, "hidden overflow-hidden lg:block")}>
            <table className="w-full text-left">
              <caption className="sr-only">The four checks every engineer passes</caption>
              <thead className="bg-[#f5f7fa] text-[14px] text-ink-2">
                <tr>
                  <th scope="col" className="px-6 py-3.5 font-semibold">
                    Check
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold">
                    When
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold">
                    Run by
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold">
                    What it covers
                  </th>
                </tr>
              </thead>
              <tbody>
                {STANDARD.map((r) => (
                  <tr key={r.check} className="border-t border-[#dfe3ea] align-top">
                    <th scope="row" className="px-6 py-5 text-[17px] font-semibold text-ink">
                      {r.check}
                    </th>
                    <td className="tnum px-6 py-5 text-[16px] font-semibold whitespace-nowrap text-brand">{r.when}</td>
                    <td className="px-6 py-5 text-[16px] text-ink-2">{r.who}</td>
                    <td className="max-w-[46ch] px-6 py-5 text-[16px] leading-[1.6] text-ink">{r.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Head office */}
      <section aria-labelledby="office-h" className="bg-white">
        <div className={cn(container, section, "grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12")}>
          <div className="lg:col-span-5">
            <h2 id="office-h" className={type.h2}>
              Head office in {CONTACT.office}
            </h2>
            <p className={cn(type.body, "mt-4 max-w-[40ch]")}>
              Client partners, talent operations and compliance work side by side, so a requisition never waits on a handoff.
            </p>
            <ul className="mt-8 space-y-3 text-[16px]">
              <li>
                <a href={`tel:${CONTACT.tel}`} className="tnum inline-flex items-center gap-2.5 font-medium text-ink hover:text-brand">
                  <IconPhone size={18} className="text-brand" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2.5 font-medium text-ink hover:text-brand">
                  <IconMail size={18} className="text-brand" />
                  {CONTACT.email}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-[15px] text-ink-2">{CONTACT.hours}. We reply within one business day.</p>
            <Link href="/contact" className={cn(cta.primary, "mt-8")}>
              Contact us
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#f5f7fa] lg:col-span-7">
            <Image src="/images/office-interior.jpg" alt="Inside the TalentBridge office" fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
