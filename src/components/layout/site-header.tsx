"use client";

import * as Nav from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/company";
import { IconChevronDown, IconPhone } from "@/components/icons";
import { Logo } from "./logo";
import { SITE_NAV } from "./site-nav";

const trigger =
  "group inline-flex h-10 items-center gap-1.5 rounded-[8px] px-3.5 text-[15px] font-medium whitespace-nowrap text-[#dce3ee] transition-colors duration-200 hover:bg-white/[0.08] hover:text-white data-[state=open]:bg-white/[0.08] data-[state=open]:text-white";

/** Three lines that fold into a cross */
function Burger({ open }: { open: boolean }) {
  const bar = "absolute left-1/2 h-[1.5px] w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300";
  return (
    <span aria-hidden="true" className="relative block size-5">
      <span className={cn(bar, open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[5px]")} />
      <span className={cn(bar, "top-1/2 -translate-y-1/2", open && "opacity-0")} />
      <span className={cn(bar, open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[5px]")} />
    </span>
  );
}

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
    <header className="sticky top-0 z-40 w-full bg-navy text-white">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Logo tone="white" />

        {/* The same four groups as the footer, each a short single list */}
        <Nav.Root className="hidden lg:block" delayDuration={80}>
          <Nav.List className="flex items-center gap-0.5">
            {SITE_NAV.map((g) => (
              <Nav.Item key={g.title} className="relative">
                <Nav.Trigger className={trigger}>
                  {g.title}
                  <IconChevronDown size={14} strokeWidth={1.75} className="text-[#9aa8bf] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Nav.Trigger>
                <Nav.Content className="absolute top-full left-0 pt-2">
                  {/* A floating menu: the one place a shadow belongs */}
                  <ul className="anim-dialog w-[300px] rounded-[12px] bg-white p-1.5 shadow-[0_18px_44px_-14px_rgb(11_27_51/0.35)]">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Nav.Link asChild>
                          <Link href={l.href} className="group/item block rounded-[8px] px-3.5 py-2.5 transition-colors duration-150 hover:bg-[#f0f3f8] focus-visible:bg-[#f0f3f8]">
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

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          <a href={`tel:${CONTACT.tel}`} className="tnum hidden h-10 items-center gap-2 rounded-[8px] px-3 text-[15px] font-medium text-[#dce3ee] hover:text-white xl:inline-flex">
            <IconPhone size={16} strokeWidth={1.5} className="text-sky" />
            {CONTACT.phone}
          </a>
          <Link href="/login" className="inline-flex h-10 items-center rounded-[8px] px-3.5 text-[15px] font-medium text-[#dce3ee] transition-colors duration-200 hover:bg-white/[0.08] hover:text-white">
            Sign in
          </Link>
          <Link
            href="/contact?topic=requisition"
            className="ml-2 inline-flex h-10 items-center rounded-[8px] bg-brand px-4 text-[15px] font-semibold whitespace-nowrap text-white transition-[background-color,transform] duration-200 hover:bg-brand-strong active:scale-[0.98]"
          >
            Send a requisition
          </Link>
        </div>

        <button
          onClick={() => setMobile((v) => !v)}
          className="ml-auto grid size-11 place-items-center rounded-[8px] text-white transition-colors hover:bg-white/[0.08] lg:hidden"
          aria-expanded={mobile}
          aria-controls="mobile-menu"
          aria-label={mobile ? "Close menu" : "Open menu"}
        >
          <Burger open={mobile} />
        </button>
      </div>

      {/* Mobile: the footer's groups, as a full sheet under the bar */}
      {mobile && (
        <div id="mobile-menu" className="anim-fade fixed inset-x-0 top-[68px] bottom-0 flex flex-col bg-navy lg:hidden">
          <nav aria-label="Mobile" className="grid flex-1 content-start gap-x-6 gap-y-8 overflow-y-auto px-5 pt-6 pb-8 sm:grid-cols-2 sm:px-6">
            {SITE_NAV.map((g) => (
              <div key={g.title}>
                <p className="text-[14px] font-semibold text-[#9aa8bf]">{g.title}</p>
                <ul className="mt-2">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block py-2 text-[17px] font-medium text-white">
                        {l.t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-3 bg-[#07142a] p-4">
            <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-[8px] bg-white/[0.08] text-[16px] font-semibold text-white">
              Sign in
            </Link>
            <Link href="/contact?topic=requisition" className="inline-flex h-12 items-center justify-center rounded-[8px] bg-brand text-[16px] font-semibold text-white">
              Send a requisition
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
