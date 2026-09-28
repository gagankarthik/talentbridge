import Link from "next/link";
import { COMPANY_LINKS, CONTACT, INDUSTRIES, SERVICES } from "@/lib/company";
import { IconBuilding, IconClock, IconMail, IconPhone } from "@/components/icons";
import { Logo } from "./logo";
import { CookiePrefsButton } from "@/features/site/cookie-notice";

export function SiteFooter() {
  const cols = [
    { title: "Services", links: SERVICES.map((s) => ({ href: `/services/${s.slug}`, t: s.name })) },
    { title: "Industries", links: INDUSTRIES.map((i) => ({ href: "/#industries", t: i.name })) },
    { title: "Company", links: [...COMPANY_LINKS.map((c) => ({ href: c.href, t: c.t })), { href: "/login", t: "Partner login" }] },
  ];
  return (
    <footer className="bg-night text-slate-400">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 pt-16 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo tone="white" />
          <p className="mt-5 text-sm leading-relaxed">IT staffing partner for enterprises and staffing agencies. Pre-vetted engineers matched to your requirement, ready in 48 hours.</p>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <IconPhone size={15} className="text-slate-500" />
              <a href={`tel:${CONTACT.tel}`} className="hover:text-white">{CONTACT.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <IconMail size={15} className="text-slate-500" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <IconBuilding size={15} className="text-slate-500" />
              {CONTACT.office}
            </li>
            <li className="flex items-center gap-2">
              <IconClock size={15} className="text-slate-500" />
              Mon–Fri, 8:00 AM–5:00 PM EST
            </li>
          </ul>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href + l.t}>
                  <Link href={l.href} className="hover:text-white">
                    {l.t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="overflow-hidden px-4 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-[1280px] translate-y-[18%] font-display text-[22vw] leading-[0.8] font-light tracking-[-0.05em] text-night-3 select-none lg:text-[220px]">
          TalentBridge
        </p>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs sm:px-6">
          <p>© 2026 TalentBridge, Inc. An equal opportunity employer.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of use
            </Link>
            <CookiePrefsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
