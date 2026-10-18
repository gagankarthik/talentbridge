import type { Metadata } from "next";
import { candidateByCode, presentable } from "@/lib/data";
import { availabilityOf } from "@/lib/format";
import { OPEN_ROLES } from "@/lib/roles";
import { CONTACT } from "@/lib/company";
import type { Discipline } from "@/lib/types";
import { Faq, FAQS } from "@/features/site/faq";
import { RoleBuilder, type BenchItem } from "@/features/site/landing/role-builder";
import { Checks } from "@/features/site/landing/checks";
import { Partners } from "@/features/site/landing/partners";
import { Consultants } from "@/features/site/landing/consultants";
import { Requisition } from "@/features/site/landing/requisition";
import { Closing } from "@/features/site/landing/closing";

export const metadata: Metadata = {
  title: { absolute: "TalentBridge | Pre-vetted engineers for enterprises and staffing firms" },
  description:
    "TalentBridge is an IT staffing partner. Technically screened, compliance-cleared engineers for contract, contract-to-hire and dedicated teams, ready to start in 48 hours.",
  alternates: { canonical: "/" },
};

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

const PRACTICE: Record<Discipline, BenchItem["discipline"]> = {
  "Data & AI": "Data & AI",
  "DevOps / Cloud": "Cloud & DevOps",
  "Full-Stack": "Full-Stack",
};

export default function HomePage() {
  // The available bench, reduced to what a blind profile may show
  const bench: BenchItem[] = presentable
    .filter((c) => c.benchStage === "Available")
    .map((c) => {
      const a = availabilityOf(c);
      return {
        code: c.code,
        title: c.title,
        discipline: PRACTICE[c.discipline],
        years: c.yearsExperience,
        days: a.tone === "avail" ? 0 : a.sortKey,
        start: a.label,
        score: c.technicalScreenScore ?? 0,
        metro: c.metro,
        skills: c.skills.slice(0, 3).map((s) => s.skill),
        i9: candidateByCode.get(c.code)?.compliance.i9Complete ?? false,
      };
    });
  const sample = [...bench].sort((a, b) => b.score - a.score).find((b) => b.i9) ?? bench[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />

      <RoleBuilder bench={bench} />
      <Checks sample={sample} />
      <Partners sample={bench.find((b) => b.discipline === "Data & AI" && b.code !== sample.code) ?? sample} />
      <Consultants openRoles={OPEN_ROLES.length} />
      <Requisition />

      <section id="faq" aria-labelledby="faq-h" className="scroll-mt-20 bg-[#f5f7fb] py-24 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="faq-h" className="font-display text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] text-ink sm:text-[42px]">
            Common questions
          </h2>
          <div className="mt-10">
            <Faq items={FAQS.slice(0, 6)} />
          </div>
        </div>
      </section>

      <Closing />
    </>
  );
}
