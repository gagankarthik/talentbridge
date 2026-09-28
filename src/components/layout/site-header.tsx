"use client";

import * as Nav from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { serviceBySlug, type ServiceSlug } from "@/lib/company";

import { ServiceGlyph } from "@/components/service-glyph";
import { buttonClass } from "@/components/ui/button";
import { IconChevronDown, IconChevronRight, IconMenu, IconPhone, IconX } from "@/components/icons";

import { Logo } from "./logo";

const STAFFING: ServiceSlug[] = ["agency-bench-partnerships", "technical-vetting", "compliance-and-onboarding"];
const ENTERPRISE: ServiceSlug[] = ["contract-staffing", "contract-to-hire", "dedicated-delivery-teams"];
const CONSULTANT_LINKS = [
  { href: "/careers#roles", t: "Open roles", d: "Contract and contract-to-hire roles hiring now" },
  { href: "/careers#apply", t: "Join the talent network", d: "One screen, many enterprise opportunities" },
  { href: "/company#vetting", t: "How our screening works", d: "What to expect in the technical panel" },
  { href: "/contact?who=candidate", t: "Talk to a recruiter", d: "Questions about roles, W2 and C2C, or the process" },
];
const COMPANY = [
  { href: "/company", t: "About TalentBridge", d: "Who we are and how we work" },
  { href: "/company#vetting", t: "Our vetting standard", d: "Screening and compliance, step by step" },
  { href: "/recruiters#controls", t: "Trust and compliance", d: "Controls measured on the live bench" },
  { href: "/contact", t: "Contact", d: "Head office in Powell, Ohio" },
];

const triggerClass = () =>
  cn(
    "group relative inline-flex h-[72px] items-center gap-1 px-3 text-[14.5px] font-medium whitespace-nowrap text-ink-2 transition-colors hover:text-ink data-[state=open]:text-ink xl:px-4",
    // underline indicator instead of pill backgrounds
    "after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 hover:after:scale-x-100 data-[state=open]:after:scale-x-100 xl:after:inset-x-4",
  );

function Chevron() {
  return <IconChevronDown size={14} className="opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />;
}

function ServiceList({ slugs }: { slugs: ServiceSlug[] }) {
  return (
    <ul className="space-y-1">
      {slugs.map((slug) => {
        const s = serviceBySlug.get(slug)!;
        return (
          <li key={slug}>
            <Nav.Link asChild>
              <Link href={`/services/${slug}`} className="flex items-start gap-3 rounded-[10px] p-3 transition-colors hover:bg-paper focus-visible:bg-paper">
                <ServiceGlyph slug={slug} size={40} />
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-ink">{s.name}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-subtle">{s.summary}</span>
                </span>
              </Link>
            </Nav.Link>
          </li>
        );
      })}
    </ul>
  );
}

function LinkList({ links }: { links: { href: string; t: string; d: string }[] }) {
  return (
    <ul>
      {links.map((x) => (
        <li key={x.href + x.t}>
          <Nav.Link asChild>
            <Link href={x.href} className="block rounded-[10px] p-3 hover:bg-paper">
              <span className="block text-[14px] font-semibold text-ink">{x.t}</span>
              <span className="mt-0.5 block text-[13px] text-subtle">{x.d}</span>
            </Link>
          </Nav.Link>
        </li>
      ))}
    </ul>
  );
}

function FeatureCard({ img, title, body, href, cta }: { img: string; title: string; body: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col rounded-[12px] bg-paper p-5">
      <div className="relative h-28 overflow-hidden rounded-[10px]">
        <Image src={img} alt="" fill sizes="240px" className="object-cover" />
      </div>
      <p className="mt-4 text-[15px] font-semibold text-ink">{title}</p>
      <p className="mt-1 text-[13px] leading-snug text-muted">{body}</p>
      <Nav.Link asChild>
        <Link href={href} className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-white hover:bg-brand-strong">
          {cta}
        </Link>
      </Nav.Link>
    </div>
  );
}

/** Dropdown panel anchored to its own trigger. */
function MenuPanel({ align, children }: { align: "start" | "center" | "end"; children: React.ReactNode }) {
  return (
    <Nav.Content
      className={cn(
        "absolute top-full z-50 pt-1",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
      )}
    >
      <div className="anim-dialog overflow-hidden rounded-[14px] bg-surface shadow-[0_24px_56px_-16px_rgb(7_26_20/0.3)] ring-1 ring-line">{children}</div>
    </Nav.Content>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-left text-[17px] font-semibold">
        {title}
        <IconChevronDown size={18} className={cn("text-subtle transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="anim-fade pb-4">{children}</div>}
    </div>
  );
}

function MobileServices({ slugs }: { slugs: ServiceSlug[] }) {
  return (
    <>
      {slugs.map((slug) => {
        const s = serviceBySlug.get(slug)!;
        return (
          <Link key={slug} href={`/services/${slug}`} className="flex items-center gap-3 py-2.5">
            <ServiceGlyph slug={slug} size={36} />
            <span>
              <span className="block text-[15px] font-medium">{s.name}</span>
              <span className="block text-xs text-subtle">{s.summary}</span>
            </span>
          </Link>
        );
      })}
    </>
  );
}


export function SiteHeader() {
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
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
    <header className={cn("sticky top-0 z-40 border-b bg-surface transition-shadow duration-300", scrolled ? "border-line shadow-[0_8px_24px_-16px_rgb(7_26_20/0.25)]" : "border-transparent")}>
      <div className="mx-auto grid h-[72px] max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Logo />

        <Nav.Root className="relative hidden justify-self-center lg:block" delayDuration={60}>
          <Nav.List className="flex items-center">
            <Nav.Item className="relative">
              <Nav.Trigger className={triggerClass()}>
                For Staffing Firms <Chevron />
              </Nav.Trigger>
              <MenuPanel align="start">
                <div className="grid w-[680px] grid-cols-[1.45fr_1fr] gap-3 p-3">
                  <div>
                    <p className="px-3 pt-2 pb-1 text-[12px] font-semibold text-subtle">For recruiters and account managers</p>
                    <ServiceList slugs={STAFFING} />
                  </div>
                  <FeatureCard img="/images/recruiter-discussion.jpg" title="See who's ready to submit" body="Blind profiles with verified skills, screen scores and confirmed availability." href="/recruiters" cta="Browse available talent" />
                </div>
              </MenuPanel>
            </Nav.Item>

            <Nav.Item className="relative">
              <Nav.Trigger className={triggerClass()}>
                For Enterprises <Chevron />
              </Nav.Trigger>
              <MenuPanel align="start">
                <div className="grid w-[640px] grid-cols-[1.45fr_1fr] gap-3 p-3">
                  <div>
                    <p className="px-3 pt-2 pb-1 text-[12px] font-semibold text-subtle">Engagement models</p>
                    <ServiceList slugs={ENTERPRISE} />
                  </div>
                  <FeatureCard img="/images/enterprise-floor.jpg" title="Start in 48 hours" body="Share the role and target rate. Matched profiles arrive within one business day." href="/contact?topic=requisition" cta="Send a requisition" />
                </div>
              </MenuPanel>
            </Nav.Item>

            <Nav.Item className="relative">
              <Nav.Trigger className={triggerClass()}>
                For Consultants <Chevron />
              </Nav.Trigger>
              <MenuPanel align="center">
                <div className="grid w-[600px] grid-cols-[1.35fr_1fr] gap-3 p-3">
                  <div className="pt-1">
                    <LinkList links={CONSULTANT_LINKS} />
                  </div>
                  <FeatureCard img="/images/consultants-at-work.jpg" title="Stay on the bench between contracts" body="We bring you enterprise roles. You confirm availability once a week." href="/careers" cta="Apply to join" />
                </div>
              </MenuPanel>
            </Nav.Item>

            <Nav.Item className="relative">
              <Nav.Trigger className={triggerClass()}>
                Company <Chevron />
              </Nav.Trigger>
              <MenuPanel align="end">
                <div className="w-[360px] p-3">
                  <LinkList links={COMPANY} />
                </div>
              </MenuPanel>
            </Nav.Item>
          </Nav.List>
        </Nav.Root>

        <div className="hidden items-center justify-self-end gap-2 lg:flex">
          <a
            href="tel:+16148446925"
            className="hidden h-10 items-center gap-2 px-3 text-[14px] font-medium whitespace-nowrap text-ink-2 hover:text-brand 2xl:inline-flex"
          >
            <IconPhone size={15} />
            +1 (614) 844-6925
          </a>
          <Link href="/login" className="inline-flex h-10 items-center px-3 text-[14px] font-medium whitespace-nowrap text-ink-2 hover:text-brand">
            Partner login
          </Link>
          <Link href="/contact" className="inline-flex h-10 items-center rounded-full bg-brand px-5 text-[14px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-strong">
            Get in touch
          </Link>
        </div>

        <button
          onClick={() => setMobile((v) => !v)}
          className="justify-self-end rounded-full p-2 text-ink hover:bg-placed-bg lg:hidden"
          aria-expanded={mobile}
          aria-controls="mobile-menu"
          aria-label={mobile ? "Close menu" : "Open menu"}
        >
          {mobile ? <IconX size={22} /> : <IconMenu size={22} />}
        </button>
      </div>

      {mobile && (
        <div id="mobile-menu" className="anim-fade fixed inset-x-0 top-[72px] bottom-0 z-40 flex flex-col bg-surface lg:hidden">
          <div className="flex-1 overflow-y-auto px-5">
            <MobileSection title="For Staffing Firms">
              <MobileServices slugs={STAFFING} />
            </MobileSection>
            <MobileSection title="For Enterprises">
              <MobileServices slugs={ENTERPRISE} />
            </MobileSection>
            <MobileSection title="For Consultants">
              {CONSULTANT_LINKS.map((x) => (
                <Link key={x.href} href={x.href} onClick={() => setMobile(false)} className="block py-2.5 text-[15px] font-medium">
                  {x.t}
                </Link>
              ))}
            </MobileSection>
            <MobileSection title="Company">
              {COMPANY.map((x) => (
                <Link key={x.href} href={x.href} onClick={() => setMobile(false)} className="block py-2.5 text-[15px] font-medium">
                  {x.t}
                </Link>
              ))}
            </MobileSection>
            <Link href="/recruiters" className="flex items-center justify-between py-4 text-[15px] font-medium">
              Browse available talent
              <IconChevronRight size={16} className="text-subtle" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
            <Link href="/login" className={buttonClass("secondary", "lg", "rounded-full")}>
              Partner login
            </Link>
            <Link href="/contact" className="inline-flex h-11 items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-white hover:bg-brand-strong">
              Get in touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
