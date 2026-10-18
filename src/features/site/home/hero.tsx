import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { container, type } from "@/components/site/styles";
import { ActionLink, Surface } from "@/components/site/premium";
import { IconArrowRight } from "@/components/icons";

/** The three ways in, beside the one claim */
const WAYS_IN = [
  {
    t: "Enterprises",
    line: "Contract, contract-to-hire and delivery teams, with a shortlist in one business day.",
    href: "/services/contract-staffing",
    label: "Enterprise staffing",
  },
  {
    t: "Staffing firms",
    line: "Present our cleared engineers under your brand, protected by 48-hour holds.",
    href: "/services/agency-bench-partnerships",
    label: "Bench partnerships",
  },
  {
    t: "Consultants",
    line: "One 90-minute panel, then contract roles with enterprise clients. Never a fee.",
    href: "/careers#roles",
    label: "Open roles",
  },
];

/** One claim on the left; on the right, where each kind of visitor goes next. */
export function HomeHero() {
  return (
    <section aria-labelledby="hero-h" className="relative isolate overflow-hidden bg-navy py-10 sm:py-14 lg:py-20">
      {/* Engineers at work behind the claim, held down under the brand navy so the panels read first */}
      <Image
        src="/images/engineers-pairing.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-[50%_30%] saturate-[0.6]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/[0.82]" />

      <div className={cn(container, "grid gap-4 lg:grid-cols-12 lg:gap-5")}>
        <Surface className="lg:col-span-7" coreClassName="flex flex-col justify-center p-6 sm:p-10 xl:p-14">
          <h1 id="hero-h" className={cn(type.hero, "max-w-[15ch] xl:text-[64px]")}>
            Cleared engineers in 48 hours.
          </h1>
          <p className="mt-6 max-w-[36em] text-[17px] leading-[1.6] text-ink-2 sm:text-[19px]">
            Contract, contract-to-hire and dedicated teams. Every engineer passes a live technical panel and clears E-Verify, I-9 and background checks before
            you see a profile.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ActionLink href="/contact?topic=requisition">Send a requisition</ActionLink>
            <ActionLink href="/recruiters" variant="quiet" arrow={false}>
              Match a job description
            </ActionLink>
          </div>
        </Surface>

        <ul className="grid gap-4 lg:col-span-5 lg:gap-5">
          {WAYS_IN.map((x) => (
            <li key={x.t}>
              <Link
                href={x.href}
                className="group flex h-full flex-col justify-between rounded-[20px] bg-white p-6 transition-colors duration-300 hover:bg-brand-wash sm:p-7"
              >
                <span>
                  <span className="block text-[22px] leading-tight font-semibold tracking-[-0.01em] text-ink">
                    {x.t}
                  </span>
                  <span className="mt-2 block max-w-[40ch] text-[16px] leading-[1.55] text-ink-2">
                    {x.line}
                  </span>
                </span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand">
                  {x.label}
                  <IconArrowRight size={16} strokeWidth={1.75} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
