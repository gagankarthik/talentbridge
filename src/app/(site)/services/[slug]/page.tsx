import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTACT, SERVICES, serviceBySlug, type ServiceSlug } from "@/lib/company";
import { cn } from "@/lib/cn";
import { card, container, cta, headGap, section, textLink, type } from "@/components/site/styles";
import { Reveal } from "@/components/motion";
import { IconArrowRight, IconCheck, IconChevronRight, IconMail, IconPhone } from "@/components/icons";
import { HireTalentForm } from "@/features/site/hire-talent";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug.get(slug as ServiceSlug);
  return s ? { title: s.name, description: `${s.summary} ${s.lede}`, alternates: { canonical: `/services/${s.slug}` }, openGraph: { title: s.name, description: s.summary, images: [s.image] } } : {};
}

const CHECKS = [
  { t: "Live technical panel", d: "90 minutes with a senior engineer from the same discipline" },
  { t: "Compliance verification", d: "E-Verify, I-9 review, background and three references" },
  { t: "Weekly availability check", d: "Every engineer re-confirms every 7 days" },
  { t: "Matched and deployed", d: "Your engineer starts within 48 hours of selection" },
];

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = serviceBySlug.get(slug as ServiceSlug);
  if (!s) notFound();
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  const buyer = s.audience === "Staffing agencies" ? "staffing firms" : s.audience === "Enterprises" ? "enterprises" : "enterprises and staffing firms";

  return (
    <>
      {/* Page hero */}
      <section className="border-b border-[#dfe3ea] bg-white">
        <div className={cn(container, "grid gap-10 py-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-16")}>
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-[14px] text-muted">
                <li>
                  <Link href="/" className="hover:text-brand">
                    Home
                  </Link>
                </li>
                <IconChevronRight size={14} aria-hidden="true" />
                <li>
                  <Link href="/#services" className="hover:text-brand">
                    Solutions
                  </Link>
                </li>
                <IconChevronRight size={14} aria-hidden="true" />
                <li aria-current="page" className="font-medium text-ink">
                  {s.name}
                </li>
              </ol>
            </nav>
            <h1 className={cn(type.hero, "mt-6 xl:text-[50px]")}>{s.headline}</h1>
            <p className={cn(type.lede, "mt-5 max-w-[36em]")}>{s.lede}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#hire" className={cta.primary}>
                Send a requisition
              </Link>
              <Link href="/recruiters" className={cta.outline}>
                Browse the bench
              </Link>
            </div>
          </div>
          {/* Full-colour photo with the engagement terms set on its lower-left corner */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#f5f7fa] lg:aspect-[4/5]">
              <Image src={s.image} alt={`${s.name}: engineers at work`} fill priority sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
            </div>
            <dl className={cn(card, "relative mx-4 -mt-16 divide-y divide-[#dfe3ea] shadow-[0_12px_32px_-8px_rgb(11_27_51/0.18)] sm:mr-auto sm:ml-6 sm:max-w-[320px]")}>
              <div className="px-5 py-3">
                <dt className="text-[13px] font-semibold text-ink-2">Engagement terms</dt>
                <dd className="text-[14px] text-muted first-letter:uppercase">For {buyer}</dd>
              </div>
              {s.model.map((m) => (
                <div key={m.label} className="flex items-baseline justify-between gap-4 px-5 py-3">
                  <dt className="text-[14px] text-ink-2">{m.label}</dt>
                  <dd className="tnum text-right text-[15px] font-semibold text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section aria-labelledby="inc-h" className="bg-[#eef3fd]">
        <div className={cn(container, section, "grid gap-10 lg:grid-cols-12 lg:gap-12")}>
          <Reveal className="lg:col-span-4">
            <h2 id="inc-h" className={type.h2}>
              What&apos;s included
            </h2>
            <p className={cn(type.body, "mt-4 max-w-[34ch]")}>{s.summary}</p>
          </Reveal>
          <ul className={cn(card, "divide-y divide-[#dfe3ea] lg:col-span-8")}>
            {s.includes.map((x) => (
              <li key={x.title} className="flex gap-4 p-6 sm:p-7">
                <IconCheck size={22} strokeWidth={2} className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <h3 className="text-[18px] font-semibold text-ink">{x.title}</h3>
                  <p className="mt-1.5 max-w-[60ch] text-[16px] leading-[1.6] text-ink-2">{x.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The standard behind it: the one navy band */}
      <section aria-labelledby="std-h" className="bg-navy text-white">
        <div className={cn(container, section, "grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12")}>
          <div className="lg:col-span-6">
            <h2 id="std-h" className={cn(type.h2, "text-white")}>
              Every engineer is vetted the same way.
            </h2>
            <p className="mt-4 max-w-[44ch] text-[17px] leading-[1.6] text-[#c3cbd9]">Four checks clear before any profile reaches you, whether we place directly or through a partner.</p>
            <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {CHECKS.map((c) => (
                <li key={c.t} className="border-t-2 border-signal pt-4">
                  <p className="text-[16px] font-semibold">{c.t}</p>
                  <p className="mt-1 text-[15px] leading-snug text-[#c3cbd9]">{c.d}</p>
                </li>
              ))}
            </ul>
            <Link href="/company#vetting" className="mt-8 inline-flex items-center gap-1.5 text-[16px] font-semibold text-signal underline-offset-4 hover:text-white hover:underline">
              Read the full vetting standard <IconArrowRight size={18} />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] lg:col-span-6">
            <Image src="/images/technical-panel.jpg" alt="Engineers working through a technical problem together" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Requisition */}
      <section id="hire" aria-labelledby="hire-h" className="scroll-mt-20 bg-white">
        <div className={cn(container, section, "grid gap-10 lg:grid-cols-12 lg:gap-12")}>
          <div className={cn(card, "order-2 p-6 sm:p-8 lg:order-1 lg:col-span-7")}>
            <h3 className="text-[20px] font-semibold text-ink">Request {s.name.toLowerCase()}</h3>
            <p className="mt-1 mb-7 text-[15px] text-ink-2">Takes under a minute. We reply within one business day.</p>
            <HireTalentForm initialWho={s.audience === "Staffing agencies" ? "Staffing agency" : "Enterprise"} />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5">
            <h2 id="hire-h" className={type.h2}>
              Start with one role.
            </h2>
            <p className={cn(type.body, "mt-4 max-w-[40ch]")}>
              A client partner replies within one business day with matched, pre-vetted profiles for your {s.name.toLowerCase()} roles.
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
            <p className="mt-4 text-[15px] text-ink-2">{CONTACT.hours}</p>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section aria-labelledby="more-h" className="border-t border-[#dfe3ea] bg-white">
        <div className={cn(container, section)}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="more-h" className={type.h2}>
              Related services
            </h2>
            <Link href="/#services" className={textLink}>
              All solutions <IconArrowRight size={16} />
            </Link>
          </div>
          <ul className={cn(headGap, "grid gap-4 sm:grid-cols-2 lg:grid-cols-3")}>
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}`} className={cn(card, "group flex h-full flex-col p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#c5ccd8] hover:shadow-[0_12px_28px_-12px_rgb(11_27_51/0.2)] motion-reduce:hover:translate-y-0")}>
                  <span className="text-[14px] text-muted">For {o.audience === "Staffing agencies" ? "staffing firms" : o.audience.toLowerCase().replace("agencies", "staffing firms")}</span>
                  <span className="mt-1 text-[18px] font-semibold text-ink group-hover:text-brand">{o.name}</span>
                  <span className="mt-2 text-[15px] leading-snug text-ink-2">{o.summary}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[15px] font-semibold text-brand">
                    Learn more <IconArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
