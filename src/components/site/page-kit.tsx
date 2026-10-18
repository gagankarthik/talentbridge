import Link from "next/link";
import { cn } from "@/lib/cn";
import { availabilityOf, WORK_AUTH_LABEL } from "@/lib/format";
import type { BlindCandidate } from "@/lib/types";
import { IconArrowRight, IconCheck, IconChevronRight } from "@/components/icons";

/*
 * Inner-page kit for the public site (careers, recruiters, contact, legal, 404).
 * Corporate structure per the enterprise spec: measured type, 1px borders instead
 * of shadows, 6px controls, 8px cards, 12px media, one blue for everything
 * interactive. Colours are the spec's literal values so these pages do not shift
 * while shared tokens are being reworked.
 */

export const wrap = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

export const ui = {
  h1: "text-[36px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#0b1b33] text-balance sm:text-[44px] lg:text-[52px]",
  h2: "text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-[#0b1b33] text-balance sm:text-[36px]",
  h3: "text-[20px] leading-snug font-semibold tracking-[-0.01em] text-[#0b1b33]",
  lead: "text-[18px] leading-[1.6] text-[#3d4a60] sm:text-[20px]",
  body: "text-[17px] leading-[1.6] text-[#3d4a60]",
  small: "text-[14px] leading-[1.5] text-[#5f6b80]",
  card: "rounded-[8px] border border-[#dfe3ea] bg-white",
  link: "font-semibold text-[#2558e0] underline decoration-[#2558e0]/40 underline-offset-4 transition-colors hover:text-[#1d47c0] hover:decoration-[#1d47c0]",
};

const btnBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[6px] px-5 text-[16px] font-semibold whitespace-nowrap transition-[background-color,border-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2558e0]";
export const btn = {
  primary: `${btnBase} bg-[#2558e0] text-white hover:bg-[#1d47c0]`,
  secondary: `${btnBase} border border-[#7b8598] bg-white text-[#0b1b33] hover:border-[#3d4a60] hover:bg-[#f5f7fa]`,
  onDark: `${btnBase} border border-white/50 text-white hover:border-white hover:bg-white/10`,
  white: `${btnBase} bg-white text-[#0b1b33] hover:bg-[#eef3fd]`,
};

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[14px] text-[#5f6b80]">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5">
            {i > 0 && <IconChevronRight size={14} className="text-[#7b8598]" />}
            {it.href ? (
              <Link href={it.href} className="hover:text-[#2558e0] hover:underline hover:underline-offset-4">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-[#3d4a60]">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Inner-page hero: breadcrumb, H1, lead, actions; the right column carries the page's own evidence. */
export function PageHero({
  crumbs,
  title,
  lead,
  actions,
  aside,
  children,
}: {
  crumbs: { href?: string; label: string }[];
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-[#eef3fd]">
      <div className={cn(wrap, "grid gap-10 pt-8 pb-14 lg:grid-cols-12 lg:gap-12 lg:pt-10 lg:pb-20")}>
        <div className={cn("flex flex-col", aside ? "lg:col-span-7" : "lg:col-span-9")}>
          <Breadcrumbs items={crumbs} />
          <h1 className={cn(ui.h1, "mt-8 lg:mt-12")}>{title}</h1>
          {lead && <div className={cn(ui.lead, "mt-5 max-w-[60ch]")}>{lead}</div>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          {children}
        </div>
        {aside && <div className="lg:col-span-5 lg:self-end">{aside}</div>}
      </div>
    </section>
  );
}

/** Section heading row: title left, optional lead and action right on wide screens. */
export function SectionHead({ id, title, lead, action, className }: { id?: string; title: React.ReactNode; lead?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
      <h2 id={id} className={cn(ui.h2, "lg:col-span-6")}>
        {title}
      </h2>
      {(lead || action) && (
        <div className="lg:col-span-6">
          {lead && <p className={cn(ui.body, "max-w-[60ch]")}>{lead}</p>}
          {action && <div className="mt-4">{action}</div>}
        </div>
      )}
    </div>
  );
}

/** Related destinations at the foot of an inner page. */
export function RelatedLinks({ title = "Related", links }: { title?: string; links: { href: string; t: string; d: string }[] }) {
  return (
    <section aria-labelledby="related-h" className="border-t border-[#dfe3ea] bg-white">
      <div className={cn(wrap, "py-14 lg:py-16")}>
        <h2 id="related-h" className="text-[20px] font-semibold tracking-[-0.01em] text-[#0b1b33]">
          {title}
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex h-full items-start justify-between gap-4 rounded-[8px] border border-[#dfe3ea] bg-white p-5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#2558e0] hover:shadow-[0_12px_24px_-16px_rgb(11_27_51/0.35)] motion-reduce:hover:translate-y-0"
              >
                <span>
                  <span className="block text-[17px] font-semibold text-[#0b1b33] group-hover:text-[#1d47c0]">{l.t}</span>
                  <span className="mt-1 block text-[15px] leading-[1.5] text-[#3d4a60]">{l.d}</span>
                </span>
                <IconArrowRight size={18} className="mt-1 shrink-0 text-[#2558e0] transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * A blind profile exactly as a client sees it, from real bench data. The name is
 * replaced by the redaction bar; everything a hiring decision needs is present.
 */
export function BlindProfileCard({ c, caption, className }: { c: BlindCandidate; caption?: React.ReactNode; className?: string }) {
  const avail = availabilityOf(c);
  return (
    <figure className={cn(ui.card, "overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-[#dfe3ea] bg-[#f5f7fa] px-5 py-3">
        <span className="tnum text-[14px] font-semibold text-[#0b1b33]">{c.code}</span>
        <span className="flex items-center gap-2 text-[13px] text-[#5f6b80]">
          <span aria-hidden="true" className="h-3 w-16 rounded-[2px] bg-[#0b1b33]" />
          Name withheld
        </span>
      </div>
      <div className="p-5">
        <p className="text-[20px] leading-snug font-semibold tracking-[-0.01em] text-[#0b1b33]">{c.title}</p>
        <p className="tnum mt-1 text-[15px] text-[#3d4a60]">
          {c.yearsExperience} years · {c.discipline}
        </p>
        <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-[6px] border border-[#dfe3ea] bg-[#dfe3ea] text-[14px]">
          <div className="bg-white p-3">
            <dt className="text-[#5f6b80]">Authorization</dt>
            <dd className="mt-1 flex items-center gap-1 font-semibold text-[#0b1b33]">
              <IconCheck size={14} strokeWidth={2.5} className="shrink-0 text-[#1a7f4b]" />
              <span className="truncate">{WORK_AUTH_LABEL[c.workAuthorization]}</span>
            </dd>
          </div>
          <div className="bg-white p-3">
            <dt className="text-[#5f6b80]">Available</dt>
            <dd className="mt-1 flex items-center gap-1.5 font-semibold text-[#0b1b33]">
              <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", avail.tone === "avail" ? "bg-[#1a7f4b]" : "bg-[#9a5b00]")} />
              <span className="truncate">{avail.label}</span>
            </dd>
          </div>
          <div className="bg-white p-3">
            <dt className="text-[#5f6b80]">Screen score</dt>
            <dd className="tnum mt-1 font-semibold text-[#0b1b33]">{c.technicalScreenScore ?? "Pending"}</dd>
          </div>
        </dl>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Verified skills">
          {c.skills.slice(0, 5).map((s) => (
            <li key={s.skill} className="tnum inline-flex h-7 items-center gap-1.5 rounded-[4px] border border-[#dfe3ea] bg-[#f5f7fa] px-2.5 text-[13px] text-[#0b1b33]">
              {s.skill}
              <span className="text-[#5f6b80]">{s.years}y</span>
            </li>
          ))}
        </ul>
      </div>
      {caption && <figcaption className="border-t border-[#dfe3ea] px-5 py-3 text-[14px] text-[#3d4a60]">{caption}</figcaption>}
    </figure>
  );
}
