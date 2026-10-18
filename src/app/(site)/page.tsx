import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { presentable } from "@/lib/data";
import { availabilityOf, relativeAgo } from "@/lib/format";
import { CONTACT, INDUSTRIES } from "@/lib/company";
import { cn } from "@/lib/cn";
import { container, type } from "@/components/site/styles";
import { ActionLink, Surface } from "@/components/site/premium";
import { IconArrowRight } from "@/components/icons";
import { HireTalentForm } from "@/features/site/hire-talent";
import { Faq, FAQS } from "@/features/site/faq";
import { HomeHero } from "@/features/site/home/hero";
import { BenchFeed, type FeedRow } from "@/features/site/home/bench-feed";
import { VettingSteps } from "@/features/site/home/vetting-steps";
import { ClosingCta } from "@/features/site/home/closing-cta";

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

/** Section rhythm: generous, so the page breathes */
const band = "py-20 sm:py-24 lg:py-28";

const LEVELS = [
  { v: "1 day", l: "to a matched shortlist" },
  { v: "48 hrs", l: "from selection to day one" },
  { v: "2 wks", l: "free replacement window" },
];

const INDUSTRY_PHOTO: Record<string, { src: string; alt: string }> = {
  Banking: { src: "/images/client-briefing.jpg", alt: "A project briefing around a meeting table" },
  "Capital Markets": { src: "/images/data-center.jpg", alt: "Server racks in a data centre" },
  Insurance: { src: "/images/agreement.jpg", alt: "Two people reviewing an agreement" },
  Healthcare: { src: "/images/engineer-lab.jpg", alt: "An engineer working at a lab bench" },
  Retail: { src: "/images/team-laptops.jpg", alt: "A team working side by side at laptops" },
  "Public Sector": { src: "/images/office-interior.jpg", alt: "An open-plan office interior" },
};

export default function HomePage() {
  const bench = presentable.filter((c) => c.benchStage === "Available");
  const practice: Record<string, string> = { "Data & AI": "Data & AI", "DevOps / Cloud": "Cloud & DevOps", "Full-Stack": "Full-Stack" };
  const feed: FeedRow[] = [...bench]
    .sort((x, y) => y.lastVerifiedAt.localeCompare(x.lastVerifiedAt))
    // Every third check-in, so the feed spans the week rather than one busy hour
    .filter((_, i) => i % 3 === 0)
    .slice(0, 10)
    .map((c) => {
      const a = availabilityOf(c);
      return { code: c.code, title: c.title, practice: practice[c.discipline], metro: c.metro, ago: relativeAgo(c.lastVerifiedAt), start: a.label, immediate: a.tone === "avail" };
    });
  return (
    <div className="bg-[#eef1f6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />

      <HomeHero />

      <BenchFeed rows={feed} />

      {/* Vetting: four checks, each with its own mark, on a white slab */}
      <section id="vetting" aria-labelledby="how-h" className="scroll-mt-24 px-3 sm:px-4">
        <div className={cn("mx-auto max-w-[1600px] rounded-[28px] bg-white", band)}>
          <div className={cn(container, "grid gap-12 lg:grid-cols-12 lg:gap-16")}>
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <h2 id="how-h" className={cn(type.h2, "sm:text-[44px]")}>
                  Four checks before any profile.
                </h2>
                <p className="mt-5 max-w-[34ch] text-[18px] leading-[1.6] text-ink-2">The same standard applies whether we place directly or through a partner.</p>
                <ActionLink href="/company#vetting" variant="quiet" className="mt-8">
                  Read the vetting standard
                </ActionLink>
              </div>
            </div>

            <VettingSteps />
          </div>
        </div>
      </section>

      {/* Industries: photographs in machined frames */}
      <section id="industries" aria-labelledby="ind-h" className={cn("scroll-mt-24", band)}>
        <div className={container}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[40rem]">
              <h2 id="ind-h" className={cn(type.h2, "sm:text-[44px]")}>
                Engineers who know your industry.
              </h2>
            </div>
            <p className="max-w-[36ch] text-[18px] leading-[1.6] text-ink-2">Regulated work needs people who understand the rules as well as the systems.</p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {INDUSTRIES.map((ind) => {
              const photo = INDUSTRY_PHOTO[ind.name];
              return (
                <li key={ind.name}>
                  <Link href={`/contact?industry=${encodeURIComponent(ind.query)}`} className="group block h-full">
                    <Surface className="h-full" coreClassName="flex h-full flex-col">
                      <span className="relative block aspect-[16/10] overflow-hidden">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover saturate-[0.85]"
                        />
                      </span>
                      <span className="flex flex-1 items-start justify-between gap-4 p-6">
                        <span>
                          <span className="block text-[20px] font-semibold tracking-[-0.01em] text-ink">{ind.name}</span>
                          <span className="mt-1 block text-[15px] leading-snug text-ink-2">{ind.note}</span>
                        </span>
                        <IconArrowRight size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-brand" />
                      </span>
                    </Surface>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Requisition: service levels on navy, the form on a white core */}
      <section id="hire" aria-labelledby="hire-h" className="scroll-mt-24 px-3 sm:px-4">
        <div className={cn("mx-auto max-w-[1600px] rounded-[28px] bg-navy text-white", band)}>
          <div className={cn(container, "grid gap-12 lg:grid-cols-12 lg:gap-16")}>
            <div className="lg:col-span-5">
              <h2 id="hire-h" className="font-display text-[30px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[44px]">
                Send us the role you need to fill.
              </h2>
              <p className="mt-5 max-w-[38ch] text-[18px] leading-[1.6] text-[#c8d3e6]">No placement, no fee. W2, corp-to-corp and contract-to-hire.</p>
              <dl className="mt-10 grid grid-cols-3 gap-3">
                {LEVELS.map((x) => (
                  <div key={x.v} className="flex flex-col-reverse rounded-[16px] bg-white/[0.07] p-4 sm:p-5">
                    <dt className="mt-2 text-[14px] leading-snug text-[#c8d3e6]">{x.l}</dt>
                    <dd className="tnum text-[26px] leading-none font-semibold tracking-[-0.02em] text-sun sm:text-[32px]">{x.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-10 text-[16px] text-[#c8d3e6]">
                Prefer to talk?{" "}
                <a href={`tel:${CONTACT.tel}`} className="tnum font-semibold text-white underline-offset-4 hover:underline">
                  {CONTACT.phone}
                </a>
              </p>
            </div>
            <div className="lg:col-span-7">
              <div>
                <div className="rounded-[20px] bg-white p-6 text-ink sm:p-9">
                  <h3 className="text-[22px] font-semibold tracking-[-0.01em] text-ink">Hire pre-vetted engineers</h3>
                  <p className="mt-1 mb-7 text-[15px] text-ink-2">Takes under a minute. We reply within one business day.</p>
                  <HireTalentForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-h" className={cn("scroll-mt-24", band)}>
        <div className={cn(container, "grid gap-12 lg:grid-cols-12 lg:gap-16")}>
          <div className="lg:col-span-4">
            <h2 id="faq-h" className={cn(type.h2, "sm:text-[44px]")}>
              Common questions
            </h2>
            <p className="mt-5 max-w-[30ch] text-[18px] leading-[1.6] text-ink-2">Anything else? A client partner replies within one business day.</p>
            <ActionLink href="/contact" variant="quiet" className="mt-8">
              Ask a question
            </ActionLink>
          </div>
          <div className="lg:col-span-8">
            <Surface coreClassName="p-3 sm:p-4">
              <Faq variant="cards" items={FAQS.slice(0, 6)} />
            </Surface>
          </div>
        </div>
      </section>

      {/* Close: the enterprise action with a real due date, then the other two ways in */}
      <section aria-labelledby="cta-h" className="pb-16 sm:pb-24">
        <div className={container}>
          <ClosingCta />
        </div>
      </section>
    </div>
  );
}
