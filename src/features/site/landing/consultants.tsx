import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const STEPS = [
  { t: "Apply once", d: "A short intake call about your stack, rate and where you want to work." },
  { t: "Pass one panel", d: "90 minutes with a senior engineer from your discipline. No repeat screens." },
  { t: "Get matched", d: "We bring you contract roles. Your name stays private until you approve each one." },
];

/** Consultants: the ice band. A real photograph beside the three things they actually do. */
export function Consultants({ openRoles }: { openRoles: number }) {
  return (
    <section id="consultants" aria-labelledby="cons-h" className="scroll-mt-20 bg-brand-wash">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-32">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] lg:col-span-6 lg:aspect-[5/4]">
          <Image src="/images/engineers-pairing.jpg" alt="Two engineers reviewing code together" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[50%_35%]" />
        </div>
        <div className="lg:col-span-6">
          <h2 id="cons-h" className="max-w-[16ch] font-display text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] text-ink sm:text-[46px]">
            One panel. Then the roles come to you.
          </h2>
          <p className="mt-6 max-w-[44ch] text-[18px] leading-[1.6] text-ink-2">For engineers who want enterprise contract work without starting over at every agency. You never pay a fee.</p>
          <ol className="mt-10 space-y-6">
            {STEPS.map((s) => (
              <li key={s.t}>
                <h3 className="text-[19px] font-semibold text-ink">{s.t}</h3>
                <p className="mt-1 text-[16px] leading-[1.6] text-ink-2">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/careers#apply"
              className="group inline-flex h-12 items-center gap-2 rounded-[10px] bg-brand px-6 text-[16px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-brand-strong active:scale-[0.98]"
            >
              Join the bench
              <ArrowRight aria-hidden="true" weight="bold" size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/careers#roles" className="text-[16px] font-semibold text-brand underline decoration-brand/40 underline-offset-[6px] hover:decoration-brand">
              See {openRoles} open roles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
