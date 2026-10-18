import Link from "next/link";
import { CONTACT } from "@/lib/company";
import { IconMail, IconPhone, LogoMark } from "@/components/icons";
import { CookiePrefsButton } from "@/features/site/cookie-notice";
import { Logo } from "./logo";
import { SITE_NAV } from "./site-nav";

/** Full-width close: brand and contact, the three ways in, then a legal bar. */
export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo tone="white" />
            <p className="mt-5 max-w-[34ch] text-[16px] leading-[1.6] text-[#c8d3e6]">
              Pre-vetted, compliance-cleared engineers for enterprises and staffing firms, ready to start in 48 hours.
            </p>
            <ul className="mt-8 space-y-3 text-[15px]">
              <li>
                <a href={`tel:${CONTACT.tel}`} className="tnum inline-flex items-center gap-2.5 font-medium transition-colors hover:text-sky">
                  <IconPhone size={17} strokeWidth={1.5} className="text-sky" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2.5 font-medium transition-colors hover:text-sky">
                  <IconMail size={17} strokeWidth={1.5} className="text-sky" />
                  {CONTACT.email}
                </a>
              </li>
            </ul>
            <p className="mt-5 text-[14px] leading-relaxed text-[#9aa8bf]">
              {CONTACT.office}
              <br />
              {CONTACT.hours}
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8">
            {SITE_NAV.map((c) => (
              <div key={c.title}>
                <p className="text-[15px] font-semibold text-white">{c.title}</p>
                <ul className="mt-4 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.href + l.t}>
                      <Link href={l.href} className="text-[15px] text-[#c8d3e6] transition-colors duration-200 hover:text-white">
                        {l.t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Legal bar: one tone deeper than the footer, the full width of the page */}
      <div className="bg-[#07142a]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 text-[14px] text-[#9aa8bf] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex items-center gap-2.5">
            <LogoMark size={16} className="shrink-0 text-sun" />
            © 2026 TalentBridge, Inc. An equal opportunity employer.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of use
            </Link>
            <CookiePrefsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
