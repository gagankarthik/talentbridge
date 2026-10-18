import Link from "next/link";
import { EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { CONTACT } from "@/lib/company";
import { CookiePrefsButton } from "@/features/site/cookie-notice";
import { Logo } from "./logo";
import { SITE_NAV } from "./site-nav";

/** The navy close: brand and contact, the same four groups as the header, then legal. */
export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo tone="white" />
            <p className="mt-5 max-w-[34ch] text-[16px] leading-[1.6] text-[#c8d3e6]">
              Pre-vetted, compliance-cleared engineers for enterprises and staffing firms, ready to start in 48 hours.
            </p>
            <ul className="mt-7 space-y-3 text-[15px]">
              <li>
                <a href={`tel:${CONTACT.tel}`} className="tnum inline-flex items-center gap-2.5 font-medium text-white hover:text-sky">
                  <Phone size={18} aria-hidden="true" className="text-sky" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2.5 font-medium text-white hover:text-sky">
                  <EnvelopeSimple size={18} aria-hidden="true" className="text-sky" />
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

        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-6 text-[14px] text-[#9aa8bf] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TalentBridge, Inc. An equal opportunity employer.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
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
