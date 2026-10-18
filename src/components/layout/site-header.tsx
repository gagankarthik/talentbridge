"use client";

import * as Nav from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CaretDown, List, X } from "@phosphor-icons/react";
import { Logo } from "./logo";
import { SITE_NAV } from "./site-nav";

const trigger =
  "group inline-flex h-10 items-center gap-1.5 rounded-[10px] px-3.5 text-[15px] font-medium whitespace-nowrap text-ink-2 transition-colors duration-200 hover:bg-[#f0f2f6] hover:text-ink data-[state=open]:bg-[#f0f2f6] data-[state=open]:text-ink";

export function SiteHeader() {
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobile(false);
  }
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e3e7ee] bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* The same four groups as the footer, each a short single list */}
        <Nav.Root className="hidden lg:block" delayDuration={80}>
          <Nav.List className="flex items-center gap-0.5">
            {SITE_NAV.map((g) => (
              <Nav.Item key={g.title} className="relative">
                <Nav.Trigger className={trigger}>
                  {g.title}
                  <CaretDown size={14} weight="bold" aria-hidden="true" className="text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Nav.Trigger>
                <Nav.Content className="absolute top-full left-0 pt-2">
                  {/* A floating menu: the one place a shadow belongs, tinted to the ink */}
                  <ul className="anim-dialog w-[300px] rounded-[16px] border border-[#e3e7ee] bg-white p-1.5 shadow-[0_18px_44px_-18px_rgb(11_27_51/0.3)]">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Nav.Link asChild>
                          <Link href={l.href} className="group/item block rounded-[10px] px-3.5 py-2.5 transition-colors duration-150 hover:bg-[#f7f8fa] focus-visible:bg-[#f7f8fa]">
                            <span className="block text-[15px] font-semibold text-ink group-hover/item:text-brand">{l.t}</span>
                            <span className="mt-0.5 block text-[14px] leading-snug text-muted">{l.d}</span>
                          </Link>
                        </Nav.Link>
                      </li>
                    ))}
                  </ul>
                </Nav.Content>
              </Nav.Item>
            ))}
          </Nav.List>
        </Nav.Root>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link href="/login" className="inline-flex h-10 items-center rounded-[10px] px-3.5 text-[15px] font-medium text-ink-2 transition-colors duration-200 hover:bg-[#f0f2f6] hover:text-ink">
            Sign in
          </Link>
          <Link
            href="/contact?topic=requisition"
            className="inline-flex h-10 items-center rounded-[10px] bg-brand px-4 text-[15px] font-semibold whitespace-nowrap text-white transition-[background-color,transform] duration-200 hover:bg-brand-strong active:scale-[0.98]"
          >
            Send a requisition
          </Link>
        </div>

        <button
          onClick={() => setMobile((v) => !v)}
          className="ml-auto grid size-11 place-items-center rounded-[10px] text-ink transition-colors hover:bg-[#f0f2f6] lg:hidden"
          aria-expanded={mobile}
          aria-controls="mobile-menu"
          aria-label={mobile ? "Close menu" : "Open menu"}
        >
          {mobile ? <X size={22} aria-hidden="true" /> : <List size={22} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile: the footer's groups, as a full sheet under the bar */}
      {mobile && (
        <div id="mobile-menu" className="anim-fade fixed inset-x-0 top-[73px] bottom-0 flex flex-col bg-white lg:hidden">
          <nav aria-label="Mobile" className="grid flex-1 content-start gap-x-6 gap-y-8 overflow-y-auto px-5 pt-6 pb-8 sm:grid-cols-2 sm:px-6">
            {SITE_NAV.map((g) => (
              <div key={g.title}>
                <p className="text-[14px] font-semibold text-muted">{g.title}</p>
                <ul className="mt-2">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block py-2 text-[17px] font-medium text-ink">
                        {l.t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-3 border-t border-[#e3e7ee] p-4">
            <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#c5ccd8] text-[16px] font-semibold text-ink">
              Sign in
            </Link>
            <Link href="/contact?topic=requisition" className="inline-flex h-12 items-center justify-center rounded-[10px] bg-brand text-[16px] font-semibold text-white">
              Send a requisition
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
