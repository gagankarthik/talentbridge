import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CONTACT } from "@/lib/company";

/** The close returns to the hero's cobalt field, with the same single action. */
export function Closing() {
  return (
    <section aria-labelledby="cta-h" className="bg-brand text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <h2 id="cta-h" className="max-w-[22ch] font-display text-[34px] text-balance leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[48px]">
          Tell us the role. Get a shortlist in one business day.
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/contact?topic=requisition"
            className="group inline-flex h-13 items-center gap-2 rounded-[10px] bg-white px-6 text-[16px] font-semibold text-brand-strong transition-[background-color,transform] duration-200 hover:bg-brand-wash active:scale-[0.98]"
          >
            Send a requisition
            <ArrowRight aria-hidden="true" weight="bold" size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <a href={`tel:${CONTACT.tel}`} className="tnum text-[16px] font-semibold text-white underline decoration-white/50 underline-offset-[6px] hover:decoration-white">
            or call {CONTACT.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
