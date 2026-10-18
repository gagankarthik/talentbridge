import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import type { DisciplineRow } from "@/lib/bench";

export interface LedgerEvent {
  code: string;
  title: string;
  metro: string;
  discipline: DisciplineRow["discipline"];
  /** Days since the engineer last re-confirmed availability */
  verifiedDays?: number;
}

const ago = (d?: number) => (d === undefined ? "" : d <= 0 ? "Today" : d === 1 ? "Yesterday" : `${d} days ago`);

/**
 * Bench snapshot (PRD §5.1): available engineers by discipline from the server
 * snapshot, and the most recent availability re-confirmations with their real dates.
 */
export function BenchLedger({ rows, events, freshPct, className }: { rows: DisciplineRow[]; events: LedgerEvent[]; freshPct: number; className?: string }) {
  const total = rows.reduce((a, r) => a + r.available, 0);

  return (
    <section aria-label="Bench snapshot" className={cn("overflow-hidden rounded-[8px] border border-[#dfe3ea] bg-white", className)}>
      <header className="flex items-center justify-between gap-4 border-b border-[#dfe3ea] bg-[#f5f7fa] px-5 py-3">
        <span className="flex items-center gap-2 text-[14px] font-semibold text-[#0b1b33]">
          <span aria-hidden="true" className="size-2 rounded-full bg-[#1a7f4b]" />
          Bench today
        </span>
        <span className="tnum text-[13px] text-[#3d4a60]">{freshPct}% confirmed in the last 7 days</span>
      </header>

      <div className="flex items-baseline justify-between gap-4 px-5 pt-5">
        <p className="text-[14px] text-[#3d4a60]">Engineers available to submit</p>
        <p className="tnum text-[40px] leading-none font-semibold tracking-[-0.02em] text-[#0b1b33]">{total}</p>
      </div>

      <table className="mt-4 w-full text-left text-[14px]">
        <caption className="sr-only">Available engineers by discipline</caption>
        <thead>
          <tr className="border-y border-[#dfe3ea] bg-[#f5f7fa] text-[13px] text-[#3d4a60]">
            <th scope="col" className="py-2 pl-5 font-semibold">
              Discipline
            </th>
            <th scope="col" className="py-2 text-right font-semibold">
              Bench
            </th>
            <th scope="col" className="hidden py-2 text-right font-semibold sm:table-cell">
              Immediate
            </th>
            <th scope="col" className="py-2 pr-5 text-right font-semibold">
              Median C2C
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.discipline} className="border-b border-[#dfe3ea] last:border-b-0">
              <td className="py-3 pl-5">
                <span className="font-semibold text-[#0b1b33]">{r.discipline}</span>
                <span className="mt-0.5 block truncate text-[13px] text-[#5f6b80]">{r.topSkills.slice(0, 3).join(", ")}</span>
              </td>
              <td className="tnum py-3 text-right text-[16px] font-semibold text-[#0b1b33]">{r.available}</td>
              <td className="tnum hidden py-3 text-right text-[#3d4a60] sm:table-cell">{r.immediate}</td>
              <td className="tnum py-3 pr-5 text-right text-[#3d4a60]">
                {usd.format(r.medianRate)}
                <span className="text-[#5f6b80]">/hr</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {events.length > 0 && (
        <div className="border-t border-[#dfe3ea] px-5 py-3">
          <p className="mb-2 text-[13px] font-semibold text-[#3d4a60]">Latest availability confirmations</p>
          <ul className="space-y-1.5">
            {events.slice(0, 3).map((e) => (
              <li key={e.code} className="flex items-center gap-3 text-[13px]">
                <span className="tnum font-semibold text-[#0b1b33]">{e.code}</span>
                <span className="min-w-0 flex-1 truncate text-[#3d4a60]">
                  {e.title}, {e.metro}
                </span>
                <span className="shrink-0 text-[#5f6b80]">{ago(e.verifiedDays)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
