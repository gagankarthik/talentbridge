import { container, cta, section, type } from "@/components/site/styles";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { ACCENT, SERVICES, serviceBySlug, type ServiceSlug } from "@/lib/company";
import { ServiceGlyph } from "@/components/service-glyph";
import { Reveal } from "@/components/motion";
import { IconCheck, IconChevronRight } from "@/components/icons";
import { HireTalentForm } from "@/features/site/hire-talent";
import { ContactCta } from "@/features/site/contact-cta";
import { Workflow } from "@/features/landing/workflow";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug.get(slug as ServiceSlug);
  return s ? { title: s.name, description: `${s.summary} ${s.lede}`, alternates: { canonical: `/services/${s.slug}` }, openGraph: { title: s.name, description: s.summary, images: [s.image] } } : {};
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = serviceBySlug.get(slug as ServiceSlug);
  if (!s) notFound();
  const acc = ACCENT[s.accent];
  const others = SERVICES.filter((x) => x.slug !== s.slug);

  return (
    <>
      <section className="bg-surface">
        <div className={cn(container, "pt-10 pb-20 lg:pt-14")}>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-subtle">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <IconChevronRight size={13} />
            <Link href="/#services" className="hover:text-ink">
              Services
            </Link>
            <IconChevronRight size={13} />
            <span aria-current="page" className="text-ink">
              {s.name}
            </span>
          </nav>

          <div className="mt-10 flex items-center gap-3">
            <ServiceGlyph slug={s.slug} size={52} />
            <div>
              <p className="text-[16px] font-semibold">{s.name}</p>
              <p className="text-[13.5px] text-subtle">For {s.audience.toLowerCase()}</p>
            </div>
          </div>
          <h1 className={cn(type.hero, "mt-8 max-w-[18ch]")}>{s.headline}</h1>
          <div className="mt-10 grid gap-8 border-t border-line pt-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <p className="max-w-[38em] text-[18px] leading-relaxed text-muted">{s.lede}</p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ContactCta />
              <Link href="/recruiters" className={cta.outline}>
                Browse available talent
              </Link>
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-[20px] bg-night">
            <div className="relative aspect-[16/10] sm:aspect-[21/9]">
              <Image src={s.image} alt="" fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
            </div>
            <dl className={cn("grid gap-6 p-6 text-white sm:absolute sm:inset-x-6 sm:bottom-6 sm:grid-cols-3 sm:rounded-[22px] sm:p-7", acc.solid)}>
              {s.model.map((m, i) => (
                <div key={m.label} className={cn(i > 0 && "sm:border-l sm:border-white/20 sm:pl-7")}>
                  <dt className="text-[14px] text-white/80">{m.label}</dt>
                  <dd className="mt-2 font-display text-[34px] leading-none font-light tracking-[-0.02em]">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className={cn(container, section)}>
          <Reveal>
            <h2 className={type.h2}>What&apos;s included</h2>
          </Reveal>
          <Reveal stagger className="mt-12 grid gap-5 md:grid-cols-3">
            {s.includes.map((x) => (
              <article key={x.title} className="rounded-[20px] bg-canvas p-8 ring-1 ring-line">
                <span className={cn("grid size-10 place-items-center rounded-full", acc.bg, acc.text)}>
                  <IconCheck size={18} strokeWidth={2} />
                </span>
                <h3 className="mt-6 text-[19px] font-semibold tracking-[-0.01em]">{x.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{x.body}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-canvas">
        <div className={cn(container, section)}>
          <Reveal>
            <h2 className={type.h2}>Every consultant passes four checks first.</h2>
          </Reveal>
          <Reveal className="mt-12">
            <Workflow />
          </Reveal>
        </div>
      </section>

      <section className="bg-night text-white">
        <div className={cn(container, section, "grid gap-12 lg:grid-cols-[1fr_520px] lg:items-center")}>
          <Reveal>
            <h2 className="font-display text-[44px] leading-[1.03] font-light tracking-[-0.025em] sm:text-[60px]">Start with one role.</h2>
            <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-slate-300">Tell us what you need and a client partner will reply within one business day with matched, pre-vetted profiles.</p>
          </Reveal>
          <div className="rounded-[20px] bg-surface p-6 text-ink sm:p-8">
            <HireTalentForm />
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className={cn(container, section)}>
          <h2 className="text-[22px] font-semibold tracking-[-0.01em]">Other services</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}`} className="group rounded-[18px] p-5 ring-1 ring-line transition-all hover:-translate-y-0.5 hover:ring-line-strong">
                <ServiceGlyph slug={o.slug} size={40} />
                <p className="mt-4 text-[15px] font-semibold">{o.name}</p>
                <p className="mt-1 text-[13px] leading-snug text-subtle">{o.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
