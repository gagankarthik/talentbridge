import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { PageHero, ui, wrap } from "@/components/site/page-kit";

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

/**
 * Policy pages: a corporate page hero with the effective date, then long-form
 * prose at a 68-character measure beside a sticky contents list.
 */
export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro?: React.ReactNode; sections: LegalSection[] }) {
  const other = title === "Privacy policy" ? { href: "/terms", t: "Terms of use" } : { href: "/privacy", t: "Privacy policy" };
  return (
    <>
      <PageHero crumbs={[{ href: "/", label: "Home" }, { label: "Legal" }, { label: title }]} title={title} lead={intro}>
        <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-[#3d4a60]">
          <span>
            Effective <time className="tnum font-semibold text-[#0b1b33]">{updated}</time>
          </span>
          <Link href={other.href} className={`${ui.link} inline-flex items-center gap-1.5 no-underline hover:underline`}>
            Read our {other.t.toLowerCase()}
            <IconArrowRight size={15} />
          </Link>
        </p>
      </PageHero>

      <section className="bg-white">
        <div className={`${wrap} grid gap-10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16`}>
          <nav aria-label="On this page" className="lg:sticky lg:top-[96px] lg:col-span-3 lg:self-start">
            <p className="text-[14px] font-semibold text-[#0b1b33]">On this page</p>
            <ol className="mt-3 border-l border-[#dfe3ea]">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[15px] leading-snug text-[#3d4a60] transition-colors hover:border-[#2558e0] hover:text-[#1d47c0]"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="lg:col-span-8 lg:col-start-5">
            <article className="max-w-[68ch] text-[17px] leading-[1.7] text-[#26324a] [&_a]:font-semibold [&_a]:text-[#2558e0] [&_a]:underline [&_a]:decoration-[#2558e0]/40 [&_a]:underline-offset-4 [&_a:hover]:text-[#1d47c0] [&_li]:pl-1.5 [&_li::marker]:text-[#5f6b80] [&_p+p]:mt-4 [&_p+ul]:mt-3 [&_strong]:font-semibold [&_strong]:text-[#0b1b33] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul+p]:mt-4">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className={i === 0 ? "scroll-mt-[96px]" : "mt-10 scroll-mt-[96px] border-t border-[#dfe3ea] pt-10"}>
                  <h2 className="mb-4 text-[22px] leading-snug font-semibold tracking-[-0.01em] text-[#0b1b33]">{s.title}</h2>
                  {s.body}
                </section>
              ))}
            </article>

          </div>
        </div>
      </section>
    </>
  );
}
