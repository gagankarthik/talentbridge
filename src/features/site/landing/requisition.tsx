import Link from "next/link";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { CONTACT, INDUSTRIES } from "@/lib/company";
import { HireTalentForm } from "@/features/site/hire-talent";

/** The commitments, said as commitments, beside the form that starts one. Industries close the column. */
export function Requisition() {
  return (
    <section id="hire" aria-labelledby="hire-h" className="scroll-mt-20 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <h2 id="hire-h" className="max-w-[14ch] font-display text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] text-ink sm:text-[46px]">
            Send us the role you need to fill.
          </h2>
          <p className="mt-6 max-w-[42ch] text-[18px] leading-[1.6] text-ink-2">
            A matched shortlist within one business day. Your engineer starts 48 hours after you choose, with a free replacement in the first two weeks. No placement, no fee.
          </p>
          <a href={`tel:${CONTACT.tel}`} className="tnum mt-8 inline-flex items-center gap-2 text-[17px] font-semibold text-ink hover:text-brand">
            <Phone aria-hidden="true" size={20} />
            {CONTACT.phone}
          </a>

          <h3 className="mt-14 text-[17px] font-semibold text-ink">Engineers for regulated work</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
            {INDUSTRIES.map((i) => (
              <li key={i.name}>
                <Link href={`/contact?industry=${encodeURIComponent(i.query)}`} className="text-[16px] text-ink-2 hover:text-brand hover:underline underline-offset-4">
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[16px] bg-white p-6 shadow-[0_24px_60px_-32px_rgb(11_27_51/0.3)] ring-1 ring-[#e3e7ee] sm:p-9 lg:col-span-7">
          <h3 className="text-[22px] font-semibold tracking-[-0.01em] text-ink">Hire pre-vetted engineers</h3>
          <p className="mt-1 mb-7 text-[16px] text-ink-2">Takes under a minute. We reply within one business day.</p>
          <HireTalentForm />
        </div>
      </div>
    </section>
  );
}
