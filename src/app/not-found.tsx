import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { IconArrowRight } from "@/components/icons";
import { btn, ui, wrap } from "@/components/site/page-kit";

const DESTINATIONS = [
  { href: "/recruiters", t: "Browse the bench", d: "Blind profiles of engineers available now" },
  { href: "/contact?topic=requisition", t: "Send a requisition", d: "Matched profiles within one business day" },
  { href: "/careers#roles", t: "Open roles", d: "Contract roles for engineers" },
  { href: "/company", t: "About TalentBridge", d: "Who we are and how we vet" },
];

export default function NotFound() {
  return (
    <div className="site flex min-h-svh flex-col bg-[#f5f7fa]">
      <header className="border-b border-[#dfe3ea] bg-white">
        <div className={`${wrap} flex h-[72px] items-center justify-between`}>
          <Logo />
          <Link href="/contact" className={ui.link}>
            Contact us
          </Link>
        </div>
      </header>
      <main id="main" className={`${wrap} flex flex-1 flex-col justify-center py-16 lg:py-24`}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="tnum text-[15px] font-semibold text-[#3d4a60]">Error 404</p>
            <h1 className={`${ui.h1} mt-3`}>We can&apos;t find that page</h1>
            <p className={`${ui.lead} mt-5 max-w-[46ch]`}>The link may be out of date, or the page has moved. These are the places most people are looking for.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className={btn.primary}>
                Go to the homepage
              </Link>
              <Link href="/contact" className={btn.secondary}>
                Contact us
              </Link>
            </div>
          </div>
          <nav aria-label="Popular pages" className="lg:col-span-6">
            <ul className="divide-y divide-[#dfe3ea] overflow-hidden rounded-[8px] border border-[#dfe3ea] bg-white">
              {DESTINATIONS.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#eef3fd]">
                    <span>
                      <span className="block text-[17px] font-semibold text-[#0b1b33] group-hover:text-[#1d47c0]">{d.t}</span>
                      <span className="mt-0.5 block text-[15px] text-[#3d4a60]">{d.d}</span>
                    </span>
                    <IconArrowRight size={18} className="shrink-0 text-[#2558e0] transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </div>
  );
}
