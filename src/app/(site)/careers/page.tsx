import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { presentable, toBlind } from "@/lib/data";
import { freshnessDays } from "@/lib/format";
import { OPEN_ROLES } from "@/lib/roles";
import { SITE_URL } from "@/lib/site";
import { BlindProfileCard, PageHero, RelatedLinks, SectionHead, btn, ui, wrap } from "@/components/site/page-kit";
import { ApplyForm } from "@/features/site/apply-form";
import { OpenRoles } from "@/features/site/open-roles";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Careers for consultants",
  description: "Join the TalentBridge bench. Pass one technical screen and get matched to enterprise contract roles.",
};

/** The path onto the bench, with the real duration of each stage. */
const STEPS = [
  { t: "Apply", when: "2 minutes", d: "Tell us your skills, experience and work authorization." },
  { t: "Intake call", when: "20 minutes", d: "A conversation about your recent projects, rate and availability." },
  { t: "Technical panel", when: "90 minutes", d: "A live session with a senior engineer from your discipline. No trick puzzles." },
  { t: "Compliance", when: "Before any match", d: "We verify work authorization, run a background check and contact three references." },
  { t: "On the bench", when: "Every week", d: "We match you to roles. You confirm availability once a week." },
];

const TERMS = [
  { t: "One screen, many clients", d: "Pass the panel once and we match you to every role that fits." },
  { t: "Private until you say yes", d: "Clients see a blind profile until you approve a submission." },
  { t: "W2 with benefits, or corp-to-corp", d: "We run payroll and benefits, or contract with your corporation." },
  { t: "No fees, ever", d: "Screening, placement and visa support cost you nothing." },
];

const LOOKING_FOR = [
  { t: "Experience", d: "Four or more years of professional engineering." },
  { t: "Delivery", d: "Hands-on delivery in enterprise engineering roles." },
  { t: "Work authorization", d: "US citizen, green card, H-1B transfer, EAD or TN." },
  { t: "Working style", d: "At ease with enterprise stakeholders in regulated industries." },
];

const jobsLd = OPEN_ROLES.map((r) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: r.title,
  description: `<p>${r.summary}</p><ul>${r.responsibilities.map((x) => `<li>${x}</li>`).join("")}</ul><p>Skills: ${r.skills.join(", ")}. Work authorization: ${r.workAuth}.</p>`,
  datePosted: r.posted,
  validThrough: new Date(new Date(r.posted).getTime() + 60 * 86_400_000).toISOString().slice(0, 10),
  employmentType: "CONTRACTOR",
  hiringOrganization: { "@type": "Organization", name: "TalentBridge", sameAs: SITE_URL },
  ...(r.setting === "Remote"
    ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "USA" } }
    : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: r.location.split(",")[0], addressRegion: r.location.split(",")[1]?.trim(), addressCountry: "US" } } }),
  directApply: true,
  url: `${SITE_URL}/careers?role=${r.slug}`,
}));

export default function CareersPage() {
  // A real, freshly confirmed engineer: what a client sees instead of your name
  const sample = toBlind(
    [...presentable]
      .filter((c) => c.benchStage === "Available" && freshnessDays(c.lastVerifiedAt) <= 3)
      .sort((a, b) => (b.technicalScreenScore ?? 0) - (a.technicalScreenScore ?? 0))[0] ?? presentable[0],
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsLd) }} />

      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Careers" }]}
        title="Contract roles with enterprise clients"
        lead="Pass one technical screen and one compliance check. From then on we bring you contract roles that fit your stack, rate and location, and clients see only a blind profile until you approve a submission."
        actions={
          <>
            <a href="#apply" className={btn.primary}>
              Apply to join the bench
            </a>
            <a href="#roles" className={btn.secondary}>
              See {OPEN_ROLES.length} open roles
            </a>
          </>
        }
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
            <Image src="/images/collaboration-mono.jpg" alt="Engineers collaborating at a shared desk" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        }
      />

      {/* The terms of being on the bench, beside what a client actually sees */}
      <section aria-labelledby="terms-h" className="bg-white">
        <div className={`${wrap} grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-32`}>
          <div className="lg:col-span-6">
            <h2 id="terms-h" className={ui.h2}>
              What being on the bench means
            </h2>
            <dl className="mt-10 space-y-7">
              {TERMS.map((x) => (
                <div key={x.t}>
                  <dt className={ui.h3}>{x.t}</dt>
                  <dd className={`${ui.body} mt-1`}>{x.d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:self-center">
            <BlindProfileCard
              c={sample}
              caption={
                <>
                  <span className="font-semibold text-[#0b1b33]">How clients see you.</span> A live profile from our bench, name withheld.
                </>
              }
            />
          </div>
        </div>
      </section>

      <section id="roles" aria-labelledby="roles-h" className="scroll-mt-[88px] bg-[#eef3fd]">
        <div className={`${wrap} py-20 lg:py-32`}>
          <SectionHead id="roles-h" title="Open roles" lead="Client names are shared once you're matched. Until then, every role describes its client by industry only." />
          <div className="mt-10 lg:mt-12">
            <OpenRoles />
          </div>
        </div>
      </section>

      {/* The process as a sequence with real durations */}
      <section aria-labelledby="path-h" className="bg-white">
        <div className={`${wrap} grid gap-10 py-20 lg:grid-cols-12 lg:gap-16 lg:py-32`}>
          <div className="lg:col-span-5">
            <h2 id="path-h" className={ui.h2}>
              From application to your first match
            </h2>
            <p className={`${ui.body} mt-4 max-w-[40ch]`}>Most engineers finish within two weeks of applying.</p>
          </div>
          <ol className="divide-y divide-[#dfe3ea] border-y border-[#dfe3ea] lg:col-span-7">
            {STEPS.map((s) => (
              <li key={s.t} className="grid gap-1 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8">
                <div>
                  <p className="text-[18px] font-semibold text-[#0b1b33]">{s.t}</p>
                  <p className="mt-1 text-[16px] leading-[1.55] text-[#3d4a60]">{s.d}</p>
                </div>
                <p className="tnum text-[15px] font-semibold text-[#1d47c0] sm:text-right">{s.when}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Requirements beside the one rule that protects the engineer */}
      <section aria-labelledby="who-h" className="bg-[#eef3fd]">
        <div className={`${wrap} grid gap-10 py-16 lg:grid-cols-12 lg:gap-12 lg:py-24`}>
          <div className="lg:col-span-6">
            <h2 id="who-h" className={ui.h2}>
              Who we&apos;re looking for
            </h2>
            <dl className="mt-8 divide-y divide-[#c9d6f5] border-y border-[#c9d6f5]">
              {LOOKING_FOR.map((x) => (
                <div key={x.t} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
                  <dt className="text-[16px] font-semibold text-[#0b1b33]">{x.t}</dt>
                  <dd className="text-[16px] leading-[1.55] text-[#3d4a60]">{x.d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="lg:col-span-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[12px]">
              <Image src="/images/consultants-at-work.jpg" alt="Consultants working at their desks" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-5 max-w-[52ch] text-[18px] leading-[1.5] font-semibold text-[#0b1b33]">
              You choose the roles you interview for. We never submit a profile without your approval.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="apply" aria-labelledby="apply-h" className="scroll-mt-[88px] bg-white">
        <div className={`${wrap} grid gap-10 py-16 lg:grid-cols-12 lg:gap-12 lg:py-24`}>
          <div className="lg:col-span-5">
            <h2 id="apply-h" className={ui.h2}>
              Apply to join the bench
            </h2>
            <p className={`${ui.body} mt-4 max-w-[46ch]`}>
              We review every application within two business days, then email you to book a 20-minute intake call.
            </p>
            <p className={`${ui.body} mt-6 max-w-[46ch]`}>
              Questions first?{" "}
              <a href="/contact?who=candidate" className={ui.link}>
                Talk to a recruiter
              </a>
              .
            </p>
          </div>
          <div className={`${ui.card} p-6 sm:p-8 lg:col-span-7`}>
            <Suspense>
              <ApplyForm />
            </Suspense>
          </div>
        </div>
      </section>

      <RelatedLinks
        links={[
          { href: "/company#vetting", t: "How our screening works", d: "What the technical panel covers and how it is scored." },
          { href: "/contact?who=candidate", t: "Talk to a recruiter", d: "Questions about roles, W2 and C2C, or the process." },
          { href: "/privacy#consultants", t: "How we handle your data", d: "What clients see, and what stays private." },
        ]}
      />
    </>
  );
}
