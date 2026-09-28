import Link from "next/link";
import { cn } from "@/lib/cn";
import { container, type } from "./styles";

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

/** Shared layout for policy pages: title, date, sticky contents and readable prose. */
export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro?: React.ReactNode; sections: LegalSection[] }) {
  return (
    <section className="bg-surface">
      <div className={cn(container, "pt-14 pb-24 lg:pt-20")}>
        <p className={type.context}>Legal</p>
        <h1 className={cn(type.hero, "mt-4")}>{title}</h1>
        <p className="mt-4 text-[15px] text-subtle">
          Last updated {updated}.{" "}
          <Link href={title === "Privacy policy" ? "/terms" : "/privacy"} className="underline underline-offset-2 hover:text-ink">
            {title === "Privacy policy" ? "Terms of use" : "Privacy policy"}
          </Link>
        </p>
        {intro && <div className="mt-6 max-w-[70ch] text-[17px] leading-relaxed text-muted">{intro}</div>}

        <div className="mt-12 grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[13px] font-semibold text-ink">On this page</p>
            <ol className="mt-3 space-y-1.5 border-l border-line text-[14px]">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-0.5 pl-4 text-muted hover:border-brand hover:text-ink">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-[70ch] space-y-12 text-[16px] leading-relaxed text-ink-2 [&_li]:pl-1 [&_p+p]:mt-4 [&_p+ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul+p]:mt-4">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.015em] text-ink">{s.title}</h2>
                {s.body}
              </section>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}
