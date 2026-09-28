import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/company";
import { container, section, type } from "@/components/site/styles";
import { HireTalentForm } from "@/features/site/hire-talent";
import { ApplyForm } from "@/features/site/apply-form";
import { CANDIDATE_FAQS, Faq } from "@/features/site/faq";
import { IconBuilding, IconClock, IconMail, IconPhone } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Hiring or looking for your next contract? Talk to TalentBridge. Call ${CONTACT.phone} or email ${CONTACT.email}.`,
  alternates: { canonical: "/contact" },
};

const DETAILS = [
  { icon: IconPhone, label: "Call", value: CONTACT.phone, href: `tel:${CONTACT.tel}` },
  { icon: IconMail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: IconClock, label: "Hours", value: CONTACT.hours },
  { icon: IconBuilding, label: "Head office", value: CONTACT.office },
];

const COPY = {
  hiring: {
    title: "Tell us who you need to hire.",
    lede: "Share the role and target rate. We reply within one business day, usually with matched profiles attached.",
    formTitle: "Send us a requisition",
    formNote: "Takes under a minute.",
    next: [
      { t: "Within 4 business hours", d: "We confirm the role, rate and start date with you." },
      { t: "Within 1 business day", d: "You receive matched, redacted profiles with screen scores." },
      { t: "48 hours after you choose", d: "Your consultant starts. Contract and onboarding are handled for you." },
    ],
  },
  candidate: {
    title: "Find your next contract with us.",
    lede: "Tell us what you do best. A recruiter will reach out to learn what you're looking for and match you to roles that fit.",
    formTitle: "Tell us about yourself",
    formNote: "Takes about two minutes.",
    next: [
      { t: "Within 2 business days", d: "A recruiter emails you to book a 30-minute intake call." },
      { t: "Technical panel", d: "A 90-minute live session with a senior engineer in your discipline." },
      { t: "Checks and matching", d: "We complete references and compliance, then start submitting you to roles you approve." },
    ],
  },
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const who = sp.who === "candidate" ? "candidate" : "hiring";
  const agency = sp.who === "agency";
  const c = COPY[who];

  return (
    <>
      <section className="bg-surface">
        <div className={cn(container, "grid gap-12 pt-14 pb-20 lg:grid-cols-[1fr_540px] lg:gap-16 lg:pt-20")}>
          <div>
            <nav aria-label="Who is getting in touch" className="inline-flex rounded-full bg-canvas p-1 ring-1 ring-line">
              {(
                [
                  ["hiring", "I'm hiring", "/contact"],
                  ["candidate", "I'm looking for work", "/contact?who=candidate"],
                ] as const
              ).map(([k, l, href]) => (
                <Link
                  key={k}
                  href={href}
                  scroll={false}
                  aria-current={who === k ? "page" : undefined}
                  className={cn("h-10 rounded-full px-5 text-[14px] leading-10 font-medium transition-colors", who === k ? "bg-surface text-ink shadow-sm ring-1 ring-line" : "text-muted hover:text-ink")}
                >
                  {l}
                </Link>
              ))}
            </nav>
            <h1 className={cn(type.hero, "mt-8 max-w-[13ch]")}>{c.title}</h1>
            <p className={cn(type.lede, "mt-6 max-w-[32em]")}>{c.lede}</p>

            <dl className="mt-12 grid gap-px overflow-hidden rounded-[16px] bg-line ring-1 ring-line sm:grid-cols-2">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex gap-4 bg-surface p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-brand-wash text-brand">
                    <d.icon size={19} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[13px] text-subtle">{d.label}</dt>
                    <dd className="mt-0.5 text-[15.5px] font-semibold break-words text-ink">
                      {d.href ? (
                        <a href={d.href} className="hover:text-brand">
                          {d.value}
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 text-[17px] font-semibold text-ink">What happens next</h2>
            <ol className="mt-5 border-l border-line">
              {c.next.map((n, i) => (
                <li key={n.t} className="relative pb-7 pl-8 last:pb-0">
                  <span className="tnum absolute top-0 -left-[14px] grid size-7 place-items-center rounded-full bg-surface text-[13px] font-semibold text-brand ring-1 ring-brand/40">
                    {i + 1}
                  </span>
                  <p className="text-[15.5px] font-semibold text-ink">{n.t}</p>
                  <p className="mt-0.5 text-[15px] text-muted">{n.d}</p>
                </li>
              ))}
            </ol>
            {who === "candidate" && (
              <p className="mt-10 text-[15px] text-muted">
                Have a specific role in mind?{" "}
                <Link href="/careers#roles" className="font-semibold text-brand underline-offset-4 hover:underline">
                  See open roles
                </Link>
              </p>
            )}
          </div>

          <div className="self-start rounded-[20px] bg-surface p-6 shadow-[0_32px_64px_-32px_rgb(7_26_20/0.3)] ring-1 ring-line sm:p-9">
            <h2 className="text-[22px] font-semibold tracking-[-0.015em]">{c.formTitle}</h2>
            <p className="mt-1 mb-6 text-[15px] text-muted">{c.formNote}</p>
            {who === "candidate" ? (
              <Suspense>
                <ApplyForm />
              </Suspense>
            ) : (
              <HireTalentForm initialWho={agency ? "Staffing agency" : "Enterprise"} />
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className={cn(container, section, "grid gap-12 lg:grid-cols-[1fr_1.6fr]")}>
          <h2 className={type.h2}>Before you reach out</h2>
          <Faq items={who === "candidate" ? CANDIDATE_FAQS : undefined} />
        </div>
      </section>
    </>
  );
}
