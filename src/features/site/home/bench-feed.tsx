import Link from "next/link";
import { cn } from "@/lib/cn";
import { container, type } from "@/components/site/styles";
import { ActionLink } from "@/components/site/premium";

export interface FeedRow {
  code: string;
  title: string;
  practice: string;
  metro: string;
  ago: string;
  start: string;
  immediate: boolean;
}

function Row({ r, dup }: { r: FeedRow; dup?: boolean }) {
  return (
    <li aria-hidden={dup || undefined} className="flex items-center justify-between gap-4 rounded-[14px] bg-white px-5 py-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2">
          <span className="tnum text-[13px] font-semibold text-muted">{r.code}</span>
          <span role="img" aria-label="Name withheld" className="inline-block h-2.5 w-12 rounded-[2px] bg-ink" />
        </p>
        <p className="mt-0.5 truncate text-[16px] font-semibold text-ink">{r.title}</p>
        <p className="truncate text-[14px] text-muted">
          {r.practice} · {r.metro}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className={cn("inline-flex items-center gap-1.5 text-[14px] font-medium", r.immediate ? "text-[#166c40]" : "text-ink-2")}>
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", r.immediate ? "bg-[#1f9d5c]" : "bg-[#5f6b80]")} />
          {r.start}
        </p>
        <p className="tnum mt-0.5 text-[13px] text-muted">Re-confirmed {r.ago}</p>
      </div>
    </li>
  );
}

/**
 * The weekly availability check, shown happening: the latest re-confirmations
 * from the bench roll past slowly. Paused on hover; still under reduced motion.
 */
export function BenchFeed({ rows }: { rows: FeedRow[] }) {
  return (
    <section id="bench" aria-labelledby="feed-h" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className={cn(container, "grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16")}>
        <div className="lg:col-span-5">
          <h2 id="feed-h" className={cn(type.h2, "sm:text-[44px]")}>
            On the bench this week.
          </h2>
          <p className="mt-5 max-w-[38ch] text-[18px] leading-[1.6] text-ink-2">
            Every engineer re-confirms availability every seven days, or we hold their profile back. These are the latest check-ins, names withheld.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink href="/recruiters">Match a job description</ActionLink>
            <ActionLink href="/contact?topic=requisition" variant="quiet" arrow={false}>
              Send a requisition
            </ActionLink>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-[20px] bg-[#e4e9f1] p-2">
            <div className="flex items-center justify-between px-4 pt-2 pb-3">
              <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                <span aria-hidden="true" className="size-2 rounded-full bg-[#1f9d5c]" />
                Latest availability check-ins
              </p>
              <Link href="/company#vetting" className="text-[14px] font-semibold text-brand hover:underline underline-offset-4">
                How it works
              </Link>
            </div>
            <div className="feed-wrap relative h-[420px] overflow-hidden rounded-[14px] [mask-image:linear-gradient(to_bottom,transparent,#000_20px,#000_calc(100%-20px),transparent)]">
              <ul className="feed-track space-y-2">
                {rows.map((r) => (
                  <Row key={r.code} r={r} />
                ))}
                {/* Second copy for a seamless loop; hidden from assistive tech */}
                {rows.map((r) => (
                  <Row key={`${r.code}-dup`} r={r} dup />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
