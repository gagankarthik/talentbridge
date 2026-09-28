"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { usd, usd2 } from "@/lib/format";
import { burdenPct, C2C_BURDEN_PCT, DEFAULT_W2_BURDEN, fromBill, fromMargin, type Basis, type BurdenBreakdown } from "@/lib/rates";
import { Field, Input, Segmented } from "@/components/ui/form";

export interface RateCardRow {
  discipline: string;
  band: string;
  n: number;
  p25: number;
  p50: number;
  p75: number;
}

function Num({ id, value, onChange, suffix, step = 1 }: { id: string; value: number; onChange: (v: number) => void; suffix?: string; step?: number }) {
  return (
    <div className="relative">
      <Input id={id} type="number" inputMode="decimal" step={step} value={Number.isFinite(value) ? value : ""} onChange={(e) => onChange(parseFloat(e.target.value))} className="tnum pr-14" />
      {suffix && <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-subtle">{suffix}</span>}
    </div>
  );
}

export function RateDesk({ rateCard }: { rateCard: RateCardRow[] }) {
  const [basis, setBasis] = useState<Basis>("W2");
  const [pay, setPay] = useState(92);
  const [mode, setMode] = useState<"margin" | "bill">("margin");
  const [margin, setMargin] = useState(24);
  const [bill, setBill] = useState(135);
  const [burden, setBurden] = useState<BurdenBreakdown>(DEFAULT_W2_BURDEN);
  const [hours, setHours] = useState(40);
  const [weeks, setWeeks] = useState(26);

  const safe = (n: number) => (Number.isFinite(n) ? n : 0);
  const r = mode === "margin" ? fromMargin(safe(pay), basis, Math.min(90, safe(margin)), burden) : fromBill(safe(pay), basis, safe(bill), burden);
  const weekly = r.marginPerHour * safe(hours);
  const total = weekly * safe(weeks);
  const negative = r.marginPerHour < 0;
  const burdenAmt = r.loadedCost - r.pay;
  const seg = (v: number) => `${Math.max(0, (v / Math.max(r.bill, r.loadedCost)) * 100)}%`;

  return (
    <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-[400px_1fr]">
      {/* Inputs */}
      <section className="space-y-5 rounded-panel bg-surface p-5 ring-1 ring-line" aria-label="Inputs">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold">Engagement</h2>
          <Segmented label="Employment basis" value={basis} onChange={setBasis} options={[{ value: "W2", label: "W2" }, { value: "C2C", label: "C2C" }]} />
        </div>
        <Field label="Consultant pay rate" htmlFor="pay">
          <Num id="pay" value={pay} onChange={setPay} suffix="$/hr" />
        </Field>

        {basis === "W2" ? (
          <fieldset>
            <legend className="text-[13px] font-medium text-ink-2">
              W2 burden <span className="tnum font-normal text-subtle">({burdenPct("W2", burden).toFixed(2)}% of pay)</span>
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {(
                [
                  ["fica", "FICA"],
                  ["futaSuta", "FUTA and SUTA"],
                  ["workersComp", "Workers' comp"],
                  ["benefits", "Benefits load"],
                ] as const
              ).map(([k, l]) => (
                <label key={k} className="block text-xs text-subtle">
                  {l}
                  <span className="mt-1 block">
                    <Num id={k} value={burden[k]} step={0.05} onChange={(v) => setBurden({ ...burden, [k]: v })} suffix="%" />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <p className="rounded-ctl bg-canvas p-3 text-xs text-muted ring-1 ring-line">
            C2C vendors carry their own taxes and insurance. We apply {C2C_BURDEN_PCT}% for payment processing and liability cover.
          </p>
        )}

        <div className="border-t border-line pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold">Pricing</h2>
            <Segmented
              label="Solve for"
              value={mode}
              onChange={setMode}
              options={[
                { value: "margin", label: "Target margin" },
                { value: "bill", label: "Fixed bill rate" },
              ]}
            />
          </div>
          <div className="mt-3">
            {mode === "margin" ? (
              <Field label="Target gross margin" htmlFor="margin" hint="Share of the bill rate kept after pay and burden.">
                <Num id="margin" value={margin} onChange={setMargin} suffix="%" />
              </Field>
            ) : (
              <Field label="Client bill rate" htmlFor="bill" hint="Use when the client's budget is fixed.">
                <Num id="bill" value={bill} onChange={setBill} suffix="$/hr" />
              </Field>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-line pt-5">
          <Field label="Hours per week" htmlFor="hours">
            <Num id="hours" value={hours} onChange={setHours} />
          </Field>
          <Field label="Duration" htmlFor="weeks">
            <Num id="weeks" value={weeks} onChange={setWeeks} suffix="weeks" />
          </Field>
        </div>
      </section>

      {/* Outputs */}
      <section className="min-w-0 space-y-6" aria-label="Results" aria-live="polite">
        <div className="overflow-hidden rounded-panel bg-surface ring-1 ring-line">
          <div className="grid sm:grid-cols-3">
            {[
              { k: "Client bill rate", v: usd2.format(r.bill), sub: `${r.markupPct.toFixed(1)}% markup on pay` },
              { k: "Gross margin per hour", v: usd2.format(r.marginPerHour), sub: `${r.marginPct.toFixed(1)}% of bill rate`, warn: negative },
              { k: "Margin over engagement", v: usd.format(total), sub: `${usd.format(weekly)} per week` },
            ].map((s, i) => (
              <div key={s.k} className={cn("px-5 py-5", i > 0 && "border-t border-line sm:border-t-0 sm:border-l", i === 0 && "bg-ink text-white")}>
                <p className={cn("text-xs", i === 0 ? "text-slate-400" : "text-subtle")}>{s.k}</p>
                <p className={cn("tnum mt-1 text-[28px] font-semibold tracking-[-0.025em]", s.warn && "text-flag-ink")}>{s.v}</p>
                <p className={cn("tnum text-xs", i === 0 ? "text-slate-400" : s.warn ? "text-flag-ink" : "text-subtle")}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-line px-5 py-5">
            <p className="text-xs font-medium text-ink-2">Where each billed hour goes</p>
            <div className="mt-3 flex h-8 overflow-hidden rounded-ctl ring-1 ring-line" role="img" aria-label={`Pay ${usd2.format(r.pay)}, burden ${usd2.format(burdenAmt)}, margin ${usd2.format(r.marginPerHour)}`}>
              <span className="bg-ink-2" style={{ width: seg(r.pay) }} />
              <span className="bg-[repeating-linear-gradient(135deg,var(--color-line-strong)_0_4px,var(--color-placed-bg)_4px_8px)]" style={{ width: seg(burdenAmt) }} />
              <span className={negative ? "bg-flag" : "bg-avail"} style={{ width: seg(Math.abs(r.marginPerHour)) }} />
            </div>
            <dl className="tnum mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-[2px] bg-ink-2" />
                <dt className="text-subtle">Pay</dt>
                <dd className="font-medium">{usd2.format(r.pay)}</dd>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-[2px] bg-line-strong" />
                <dt className="text-subtle">Burden</dt>
                <dd className="font-medium">{usd2.format(burdenAmt)}</dd>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-[2px]", negative ? "bg-flag" : "bg-avail")} />
                <dt className="text-subtle">Margin</dt>
                <dd className={cn("font-medium", negative && "text-flag-ink")}>{usd2.format(r.marginPerHour)}</dd>
              </div>
            </dl>
            {negative && <p className="mt-3 text-[13px] text-flag-ink">This bill rate doesn&apos;t cover pay and burden. Raise the bill rate or lower pay.</p>}
          </div>
        </div>

        <div className="overflow-hidden rounded-panel bg-surface ring-1 ring-line">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-3.5">
            <h2 className="text-[14px] font-semibold">Bench rate card, C2C</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="tnum w-full min-w-[560px] text-left text-[13px]">
              <thead className="text-xs text-subtle">
                <tr className="border-b border-line">
                  <th className="py-2.5 pl-5 font-medium">Discipline</th>
                  <th className="py-2.5 font-medium">Seniority</th>
                  <th className="py-2.5 text-right font-medium">Consultants</th>
                  <th className="py-2.5 text-right font-medium">P25</th>
                  <th className="py-2.5 text-right font-medium">Median</th>
                  <th className="py-2.5 pr-5 text-right font-medium">P75</th>
                </tr>
              </thead>
              <tbody>
                {rateCard.map((row, i) => (
                  <tr key={row.discipline + row.band} className={cn("border-b border-line last:border-0", i % 3 === 0 && i > 0 && "border-t border-t-line-strong")}>
                    <td className="py-2.5 pl-5 font-medium">{i % 3 === 0 ? row.discipline : ""}</td>
                    <td className="py-2.5 text-ink-2">{row.band}</td>
                    <td className="py-2.5 text-right text-subtle">{row.n}</td>
                    <td className="py-2.5 text-right">{usd.format(row.p25)}</td>
                    <td className="py-2.5 text-right font-semibold">{usd.format(row.p50)}</td>
                    <td className="py-2.5 pr-5 text-right">{usd.format(row.p75)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
