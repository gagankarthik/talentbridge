import { container, section, type } from "@/components/site/styles";
import { cn } from "@/lib/cn";
import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion";
import { Suspense } from "react";
import { ApplyForm } from "@/features/site/apply-form";
import { OpenRoles } from "@/features/site/open-roles";
import { OPEN_ROLES } from "@/lib/roles";
import { SITE_URL } from "@/lib/site";
import { IconCalendar, IconCheck, IconEyeOff, IconShield, IconUsers } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Careers for consultants",
  description: "Join the TalentBridge bench. Pass one technical screen and get matched to enterprise contract roles.",
};

const STEPS = [
  { t: "Apply", d: "Tell us your skills, experience and work authorization. It takes two minutes." },
  { t: "Intake call", d: "A 20-minute conversation about your recent projects, rate and availability." },
  { t: "Technical panel", d: "90 minutes with a senior engineer from your discipline. No trick puzzles." },
  { t: "Compliance", d: "We verify work authorization, run a background check and contact three references." },
  { t: "On the bench", d: "We match you to roles. You confirm availability once a week." },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsLd) }} />
      <section className="bg-surface">
        <div className={cn(container, "grid gap-12 pt-14 pb-20 lg:grid-cols-[1.1fr_1fr] lg:pt-20")}>
          <div>
            <p className="text-[14px] font-semibold text-acc-teal">For consultants</p>
            <h1 className={cn(type.hero, "mt-4")}>Stay on the bench between contracts, not on job boards.</h1>
            <p className="mt-7 max-w-[34em] text-[18px] leading-relaxed text-muted">
              Pass one technical screen and one compliance check. From then on we bring you enterprise contract roles that fit your stack, rate and location, and your
              identity stays private until a client places a hold.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [IconUsers, "One screen, many clients"],
                [IconEyeOff, "Private until a client places a hold"],
                [IconShield, "W2 with benefits, or corp-to-corp"],
                [IconCalendar, "Weekly check-ins, no job-board noise"],
              ].map(([Icon, t]) => {
                const I = Icon as typeof IconUsers;
                return (
                  <li key={t as string} className="flex items-center gap-3 text-[15px] font-medium">
                    <span className="grid size-10 place-items-center rounded-full bg-acc-teal-bg text-acc-teal">
                      <I size={18} />
                    </span>
                    {t as string}
                  </li>
                );
              })}
            </ul>
            <a href="#roles" className="mt-9 inline-flex h-12 items-center rounded-full px-6 text-[15px] font-semibold text-ink ring-1 ring-inset ring-line-strong hover:bg-paper">
              See open roles
            </a>
          </div>
          <div id="apply" className="scroll-mt-24 self-start rounded-[20px] bg-surface p-6 shadow-[0_32px_64px_-32px_rgb(10_22_49/0.3)] ring-1 ring-line sm:p-8">
            <p className="text-[20px] font-semibold tracking-[-0.01em]">Apply to join the bench</p>
            <p className="mt-1 mb-5 text-sm text-muted">We review every application within two business days.</p>
            <Suspense>
              <ApplyForm />
            </Suspense>
          </div>
        </div>
      </section>

      <section id="roles" className="scroll-mt-24 bg-surface">
        <div className={cn(container, section)}>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 className={type.h2}>Open roles</h2>
            <p className={cn(type.lede, "max-w-lg lg:justify-self-end")}>Roles our clients are hiring for now. Client names are shared once you&apos;re matched.</p>
          </div>
          <div className="mt-10">
            <OpenRoles />
          </div>
        </div>
      </section>

      <section className="bg-surface pb-4">
        <div className={cn(container, "grid gap-4 sm:grid-cols-[1fr_1.4fr]")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
            <Image src="/images/engineer-lab.jpg" alt="Engineer working at a hardware test bench" fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] sm:aspect-auto">
            <Image src="/images/consultants-at-work.jpg" alt="Consultants working at their desks" fill sizes="(min-width: 640px) 60vw, 100vw" className="object-cover" />
            <p className="absolute bottom-5 left-5 max-w-[80%] rounded-[18px] bg-surface/95 px-5 py-4 text-[15px] font-medium text-ink shadow-xl backdrop-blur">
              Consultants choose the roles they interview for. We never submit a profile without your approval.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className={cn(container, section)}>
          <Reveal>
            <h2 className={type.h2}>From application to your first match.</h2>
          </Reveal>
          <Reveal stagger className="mt-14 grid gap-4 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <article key={s.t} className="relative rounded-[22px] bg-surface p-6 ring-1 ring-line">
                <span className="tnum grid size-9 place-items-center rounded-full bg-acc-teal text-[14px] font-semibold text-white">{i + 1}</span>
                <h3 className="mt-5 text-[17px] font-semibold">{s.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.d}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-acc-teal text-white">
        <div className={cn(container, section, "grid gap-10 lg:grid-cols-2 lg:items-center")}>
          <h2 className={type.h2}>Who we&apos;re looking for</h2>
          <ul className="space-y-3 text-[16px]">
            {[
              "Four or more years of professional engineering experience",
              "Proven hands-on delivery in enterprise engineering roles",
              "Authorized to work in the US (citizen, green card, H-1B transfer, EAD or TN)",
              "Comfortable working with enterprise stakeholders in regulated industries",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/20">
                  <IconCheck size={13} strokeWidth={2.5} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
