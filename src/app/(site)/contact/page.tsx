import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { cn } from "@/lib/cn";
import { CONTACT, INDUSTRIES } from "@/lib/company";
import { candidateByCode, isPresentable, toBlind } from "@/lib/data";
import { IconClock, IconMail, IconPhone, IconBuilding } from "@/components/icons";
import { BlindProfileCard, PageHero, ui, wrap } from "@/components/site/page-kit";
import { HireTalentForm } from "@/features/site/hire-talent";
import { ApplyForm } from "@/features/site/apply-form";
import { CANDIDATE_FAQS, Faq } from "@/features/site/faq";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Hiring or looking for your next contract? Talk to TalentBridge. Call ${CONTACT.phone} or email ${CONTACT.email}.`,
  alternates: { canonical: "/contact" },
};

const COPY = {
  hiring: {
    title: "Tell us who you need to hire",
    lede: "Share the role and target rate. We reply within one business day, usually with matched profiles attached.",
    formTitle: "Send us a requisition",
    formNote: "Takes under a minute. Fields are required unless marked optional.",
    next: [
      { t: "Within 4 business hours", d: "A client partner confirms the role, rate and start date with you." },
      { t: "Within 1 business day", d: "You receive matched, redacted profiles with screen scores." },
      { t: "48 hours after you choose", d: "Your consultant starts. Contract and onboarding are handled for you." },
    ],
  },
  candidate: {
    title: "Find your next contract with us",
    lede: "Tell us what you do best. A recruiter will reach out to learn what you're looking for and match you to roles that fit.",
    formTitle: "Tell us about yourself",
    formNote: "Takes about two minutes.",
    next: [
      { t: "Within 2 business days", d: "A recruiter emails you to book a 30-minute intake call." },
      { t: "Technical panel", d: "A 90-minute live session with a senior engineer in your discipline." },
      { t: "Checks and matching", d: "We complete references and compliance, then submit you only to roles you approve." },
    ],
  },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const whoParam = one(sp.who);
  const who = whoParam === "candidate" ? "candidate" : "hiring";
  const agency = whoParam === "agency";
  const c = COPY[who];

  // Context carried in from elsewhere on the site
  const industry = INDUSTRIES.find((i) => i.query === one(sp.industry));
  const requested = candidateByCode.get(one(sp.profile) ?? "");
  const profile = who === "hiring" && requested && isPresentable(requested) ? requested : undefined;
  // The home page's role builder sends its sentence as three parameters
  const built = [one(sp.seniority), one(sp.discipline), one(sp.start)];
  const sentence = built.every(Boolean) ? `1 ${built[0]} ${built[1]} engineer, able to start ${built[2]}` : "";
  const lede = profile
    ? `You asked about ${profile.code}: ${profile.title}, ${profile.yearsExperience} years of experience. Send the role and we'll confirm availability and rate within one business day.`
    : industry && who === "hiring"
      ? `We'll match engineers with ${industry.name.toLowerCase()} delivery experience: ${industry.note.toLowerCase()}. ${c.lede}`
      : c.lede;

  const tabs = [
    { k: "hiring", l: "I'm hiring", href: "/contact", on: who === "hiring" && !agency },
    { k: "agency", l: "I'm a staffing firm", href: "/contact?who=agency", on: agency },
    { k: "candidate", l: "I'm looking for work", href: "/contact?who=candidate", on: who === "candidate" },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        title={c.title}
        lead={lede}
        aside={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
            <Image
              src={who === "candidate" ? "/images/code-desk.jpg" : "/images/agreement.jpg"}
              alt={who === "candidate" ? "An engineer's desk with code on screen" : "A client and a TalentBridge partner agreeing a start date"}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      >
        <nav aria-label="Who is getting in touch" className="mt-8 inline-flex max-w-full flex-wrap self-start overflow-hidden rounded-[6px] border border-[#7b8598] bg-white">
          {tabs.map((t, i) => (
            <Link
              key={t.k}
              href={t.href}
              scroll={false}
              aria-current={t.on ? "page" : undefined}
              className={cn(
                "inline-flex h-11 items-center px-4 text-[15px] font-medium transition-colors duration-150",
                i > 0 && "border-l border-[#7b8598]",
                t.on ? "bg-[#eef3fd] text-[#1d47c0]" : "text-[#3d4a60] hover:bg-[#f5f7fa] hover:text-[#0b1b33]",
              )}
            >
              {t.l}
            </Link>
          ))}
        </nav>
      </PageHero>

      <section aria-labelledby="form-h" className="bg-white">
        <div className={`${wrap} grid gap-10 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20`}>
          <div className="lg:col-span-7">
            {profile && (
              <BlindProfileCard
                c={toBlind(profile)}
                className="mb-6"
                caption="The engineer you asked about. We'll confirm availability and rate in our reply."
              />
            )}
            <div className={`${ui.card} p-6 sm:p-8`}>
              <h2 id="form-h" className="text-[22px] font-semibold tracking-[-0.01em] text-[#0b1b33]">
                {c.formTitle}
              </h2>
              <p className="mt-1 mb-7 text-[15px] text-[#3d4a60]">{c.formNote}</p>
              {who === "candidate" ? (
                <Suspense>
                  <ApplyForm />
                </Suspense>
              ) : (
                <div className="[&_form]:space-y-5 [&_input]:h-12 [&_input]:rounded-[6px] [&_input]:text-[16px] [&_input]:ring-[#7b8598] [&_[aria-pressed]]:rounded-[6px] [&_[aria-pressed=false]]:ring-[#7b8598] [&_button[role=combobox]]:h-12 [&_button[role=combobox]]:rounded-[6px]">
                  <HireTalentForm initialWho={agency ? "Staffing agency" : "Enterprise"} initialRoles={profile ? `${profile.title} (${profile.code})` : sentence} />
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className={ui.card}>
              <p className="border-b border-[#dfe3ea] px-5 py-3 text-[14px] font-semibold text-[#0b1b33]">Talk to a client partner</p>
              <ul className="divide-y divide-[#dfe3ea] text-[16px]">
                <li className="flex items-center gap-3 px-5 py-3.5">
                  <IconPhone size={18} className="shrink-0 text-[#5f6b80]" />
                  <a href={`tel:${CONTACT.tel}`} className="tnum font-semibold text-[#0b1b33] hover:text-[#2558e0]">
                    {CONTACT.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 px-5 py-3.5">
                  <IconMail size={18} className="shrink-0 text-[#5f6b80]" />
                  <a href={`mailto:${CONTACT.email}`} className="truncate font-semibold text-[#0b1b33] hover:text-[#2558e0]">
                    {CONTACT.email}
                  </a>
                </li>
                <li className="flex items-center gap-3 px-5 py-3.5 text-[#3d4a60]">
                  <IconClock size={18} className="shrink-0 text-[#5f6b80]" />
                  {CONTACT.hours}
                </li>
                <li className="flex items-center gap-3 px-5 py-3.5 text-[#3d4a60]">
                  <IconBuilding size={18} className="shrink-0 text-[#5f6b80]" />
                  Head office in {CONTACT.office}
                </li>
              </ul>
            </div>
            <h2 className={`${ui.h3} mt-12`}>What happens next</h2>
            <ol className="mt-6">
              {c.next.map((n, i) => (
                <li key={n.t} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < c.next.length - 1 && <span aria-hidden="true" className="absolute top-8 bottom-1 left-[13px] w-px bg-[#dfe3ea]" />}
                  <span className="tnum relative grid size-7 shrink-0 place-items-center rounded-full border border-[#b4c8f6] bg-[#eef3fd] text-[13px] font-semibold text-[#1d47c0]">
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[16px] font-semibold text-[#0b1b33]">{n.t}</p>
                    <p className="mt-1 text-[15px] leading-[1.55] text-[#3d4a60]">{n.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            {who === "candidate" && (
              <p className="mt-10 text-[16px] text-[#3d4a60]">
                Have a specific role in mind?{" "}
                <Link href="/careers#roles" className={ui.link}>
                  See open roles
                </Link>
              </p>
            )}
          </aside>
        </div>
      </section>

      <section aria-labelledby="contact-faq-h" className="bg-[#eef3fd]">
        <div className={`${wrap} grid gap-8 py-16 lg:grid-cols-12 lg:gap-12 lg:py-20`}>
          <div className="lg:col-span-4">
            <h2 id="contact-faq-h" className={ui.h2}>
              Before you reach out
            </h2>
            <p className={`${ui.body} mt-4`}>Answers to the questions we hear most often.</p>
          </div>
          <div className="rounded-[8px] border border-[#dfe3ea] bg-white px-5 py-2 sm:px-6 lg:col-span-8 [&_details[open]]:bg-[#eef3fd]">
            <Faq items={who === "candidate" ? CANDIDATE_FAQS : undefined} />
          </div>
        </div>
      </section>
    </>
  );
}
