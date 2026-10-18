import Link from "next/link";
import { ArrowRight, Check, Clock } from "@phosphor-icons/react/dist/ssr";
import type { BenchItem } from "./role-builder";

/** Staffing firms: the navy band, with the co-branded profile and its hold as the proof. */
export function Partners({ sample }: { sample: BenchItem }) {
  return (
    <section id="partners" aria-labelledby="partners-h" className="scroll-mt-20 bg-navy text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-32">
        <div>
          <h2 id="partners-h" className="max-w-[19ch] font-display text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[46px]">
            Present our bench under your own brand.
          </h2>
          <p className="mt-6 max-w-[46ch] text-[18px] leading-[1.6] text-[#c8d3e6]">
            For staffing firms. Submit our cleared engineers to the clients you already serve, without a duplicate submission ever reaching them.
          </p>
          <ul className="mt-8 space-y-3">
            {["Blind, co-branded profiles with your logo", "A 48-hour hold on each engineer for a named client", "One partner portal to search, hold and track"].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[17px]">
                <Check aria-hidden="true" weight="bold" className="mt-1 size-4 shrink-0 text-sky" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/services/agency-bench-partnerships"
              className="group inline-flex h-12 items-center gap-2 rounded-[10px] bg-white px-6 text-[16px] font-semibold text-navy transition-[background-color,transform] duration-200 hover:bg-brand-wash active:scale-[0.98]"
            >
              Become a bench partner
              <ArrowRight aria-hidden="true" weight="bold" size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/login" className="text-[16px] font-semibold text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white">
              Partner sign in
            </Link>
          </div>
        </div>

        <figure>
          <div className="overflow-hidden rounded-[16px] bg-white text-ink shadow-[0_28px_60px_-24px_rgb(0_0_0/0.5)]">
            <div className="flex items-center justify-between gap-4 bg-[#f5f7fb] px-6 py-4">
              <p className="flex items-center gap-3 text-[15px] font-semibold">
                <span aria-hidden="true" className="grid size-8 place-items-center rounded-[8px] bg-navy text-[13px] text-white">
                  YF
                </span>
                Presented by Your Firm
              </p>
              <p className="text-[13px] text-muted">Blind profile</p>
            </div>
            <div className="px-6 py-6">
              <p className="flex items-center gap-2">
                <span className="tnum text-[13px] font-semibold text-muted">{sample.code}</span>
                <span role="img" aria-label="Name withheld" className="inline-block h-2.5 w-16 rounded-[2px] bg-ink" />
              </p>
              <p className="mt-2 text-[20px] font-semibold">{sample.title}</p>
              <p className="tnum mt-0.5 text-[15px] text-ink-2">
                {sample.discipline} · {sample.years} years · screen score {sample.score}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-[#e9f6ef] px-6 py-4 text-[15px] text-[#0f4d2e]">
              <Clock aria-hidden="true" size={20} className="shrink-0" />
              <p>
                <span className="font-semibold">Held for your client for 48 hours.</span> No other firm can submit this engineer to them.
              </p>
            </div>
          </div>
          <figcaption className="mt-3 text-[13px] text-[#9aa8bf]">Your logo and client name appear here. Sample profile from our demo bench.</figcaption>
        </figure>
      </div>
    </section>
  );
}
