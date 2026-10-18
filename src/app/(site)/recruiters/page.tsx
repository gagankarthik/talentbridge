import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { serviceBySlug } from "@/lib/company";
import { presentable, toBlind } from "@/lib/data";
import { FRESHNESS_WINDOW_DAYS, freshnessDays } from "@/lib/format";
import { BlindProfileCard, PageHero, RelatedLinks, SectionHead, btn, ui, wrap } from "@/components/site/page-kit";
import { InlineRequest } from "@/features/request-engine/talent-request";

export const metadata: Metadata = {
  alternates: { canonical: "/recruiters" },
  title: "Talent Network",
  description: "Browse pre-vetted, compliance-cleared engineers or match a job description against our bench.",
};

/** The standard every profile clears before it is listed, with when each check runs. */
const CONTROLS = [
  { t: "Work authorization verified", when: "Before listing", d: "E-Verify match plus document review by our compliance team." },
  { t: "Live technical panel", when: "90 minutes, once", d: "A senior engineer in the same discipline scores system design, coding, domain depth and communication." },
  { t: "Background screening", when: "Before listing", d: "Criminal, employment and education checks through an FCRA-compliant provider." },
  { t: "Availability re-confirmed", when: `Every ${FRESHNESS_WINDOW_DAYS} days`, d: "Consultants re-confirm weekly. Stale profiles can't be put on hold." },
  { t: "Identity protected", when: "Until you place a hold", d: "Names and contact details are removed from every profile and one-sheet." },
];

const ANATOMY = [
  { t: "Candidate ID", d: "How you reference the engineer. The name stays hidden until you hold." },
  { t: "Verified work authorization", d: "Checked against documents, not self-reported." },
  { t: "Availability", d: `Confirmed by the consultant within the last ${FRESHNESS_WINDOW_DAYS} days.` },
  { t: "Screen score", d: "From the 90-minute live panel, out of 100." },
  { t: "Skills with years", d: "Primary skills first; years come from verified engagements." },
];

export default function TalentNetworkPage() {
  const available = presentable.filter((c) => c.benchStage === "Available");
  const sample = toBlind(
    [...available].filter((c) => freshnessDays(c.lastVerifiedAt) <= 3).sort((a, b) => (b.technicalScreenScore ?? 0) - (a.technicalScreenScore ?? 0))[0] ?? available[0],
  );
  const agency = serviceBySlug.get("agency-bench-partnerships")!;

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Talent network" }]}
        title="Search a bench that is verified every week"
        lead="Every engineer has passed a live technical panel and cleared compliance before you see a profile. Paste a job description to rank the bench against it, or send us the role."
        actions={
          <>
            <a href="#request" className={btn.primary}>
              Match a job description
            </a>
            <Link href="/contact?topic=requisition" className={btn.secondary}>
              Send a requisition
            </Link>
          </>
        }
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
            <Image src="/images/client-briefing.jpg" alt="An account team reviewing candidate profiles with a client" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        }
      />

      <section id="request" aria-labelledby="request-h" className="scroll-mt-[88px] bg-white">
        <div className={`${wrap} grid gap-10 py-16 lg:grid-cols-12 lg:gap-12 lg:py-24`}>
          <div className="lg:col-span-4">
            <h2 id="request-h" className={ui.h2}>
              Match a job description
            </h2>
            <p className={`${ui.body} mt-4`}>Upload the requisition or paste the requirements. Results show why each engineer matched.</p>
          </div>
          <div className={`${ui.card} p-5 sm:p-8 lg:col-span-8`}>
            <InlineRequest publicView />
          </div>
        </div>
      </section>

      {/* Anatomy: what each field of a blind profile means, beside a real one */}
      <section aria-labelledby="anatomy-h" className="bg-[#eef3fd]">
        <div className={`${wrap} grid gap-10 py-16 lg:grid-cols-12 lg:gap-12 lg:py-24`}>
          <div className="lg:col-span-6">
            <h2 id="anatomy-h" className={ui.h2}>
              What a blind profile tells you
            </h2>
            <p className={`${ui.body} mt-4 max-w-[52ch]`}>Everything a hiring manager decides on, and nothing that lets a client go around you.</p>
            <dl className="mt-8 divide-y divide-[#dfe3ea] border-y border-[#dfe3ea]">
              {ANATOMY.map((a) => (
                <div key={a.t} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
                  <dt className="text-[16px] font-semibold text-[#0b1b33]">{a.t}</dt>
                  <dd className="text-[16px] leading-[1.55] text-[#3d4a60]">{a.d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6 lg:self-center">
            <BlindProfileCard c={sample} caption={`Sample profile from today's bench, re-confirmed ${freshnessDays(sample.lastVerifiedAt) <= 1 ? "in the last day" : `${freshnessDays(sample.lastVerifiedAt)} days ago`}.`} />
          </div>
        </div>
      </section>

      {/* The standard, as a real table */}
      <section id="controls" aria-labelledby="controls-h" className="scroll-mt-[88px] bg-white">
        <div className={`${wrap} py-20 lg:py-32`}>
          <SectionHead id="controls-h" title="Five checks before any profile is listed" lead="Every engineer clears all five before a recruiter or client sees their profile. There are no exceptions for urgent roles." />
          <div className="mt-10 overflow-x-auto rounded-[8px] border border-[#dfe3ea] lg:mt-12">
            <table className="w-full min-w-[640px] text-left">
              <caption className="sr-only">Controls applied to every engineer</caption>
              <thead>
                <tr className="bg-[#f5f7fa] text-[14px] text-[#3d4a60]">
                  <th scope="col" className="w-[30%] px-6 py-3 font-semibold">
                    Check
                  </th>
                  <th scope="col" className="w-[20%] px-6 py-3 font-semibold">
                    When
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    What it covers
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONTROLS.map((c) => (
                  <tr key={c.t} className="border-t border-[#dfe3ea] align-top">
                    <th scope="row" className="px-6 py-4 text-[16px] font-semibold text-[#0b1b33]">
                      {c.t}
                    </th>
                    <td className="tnum px-6 py-4 text-[15px] font-medium text-[#0b1b33]">{c.when}</td>
                    <td className="px-6 py-4 text-[15px] leading-[1.55] text-[#3d4a60]">{c.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The page's one dark band: agency partners */}
      <section aria-labelledby="partner-h" className="bg-[#0b1b33] text-white">
        <div className={`${wrap} grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-24`}>
          <div className="lg:col-span-6">
            <h2 id="partner-h" className="text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[36px]">
              Submit our bench to your clients, under your own brand
            </h2>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.6] text-[#c9d3e3]">{agency.lede}</p>
            <dl className="mt-8 space-y-5">
              {agency.includes.map((x) => (
                <div key={x.title}>
                  <dt className="text-[17px] font-semibold">{x.title}</dt>
                  <dd className="mt-1 max-w-[56ch] text-[16px] leading-[1.55] text-[#c9d3e3]">{x.body}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact?who=agency" className={btn.white}>
                Become a partner
              </Link>
              <Link href="/login" className={btn.onDark}>
                Partner login
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] lg:col-span-6">
            <Image src="/images/recruiter-discussion.jpg" alt="Recruiters discussing a shortlist with a client" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <RelatedLinks
        links={[
          { href: "/services/agency-bench-partnerships", t: "Agency bench partnerships", d: "Holds, co-branded profiles and the partner portal." },
          { href: "/services/technical-vetting", t: "Technical vetting", d: "How the 90-minute live panel is run and scored." },
          { href: "/services/compliance-and-onboarding", t: "Compliance and onboarding", d: "Right-to-work, I-9 and visa tracking." },
        ]}
      />
    </>
  );
}
