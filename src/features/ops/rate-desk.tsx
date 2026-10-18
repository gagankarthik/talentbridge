"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { usd, usd2 } from "@/lib/format";
import { burdenPct, C2C_BURDEN_PCT, DEFAULT_W2_BURDEN, fromBill, fromMargin, type Basis, type BurdenBreakdown } from "@/lib/rates";
import { PageBody, PageHeader } from "@/components/layout/app-shell";
import { Field, Input, Segmented } from "@/components/ui/form";
import { DataTable, type Column } from "@/components/ui/data-table";
import { DetailSection, KpiTile } from "@/components/ui/data-display";
import { practiceLabel } from "@/features/admin/candidate-list";
import { Panel, PanelHeader } from "@/features/admin/ui";
import type { Discipline } from "@/lib/types";

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
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        step={step}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="tnum pr-14"
      />
      {suffix && <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[13px] text-subtle">{suffix}</span>}
    </div>
  );
}

// Chart ramp from the spec: the emphasised part (margin) carries the strongest blue.
const PART = { pay: "#6f93ec", burden: "#b4c8f6", margin: "#2558e0", loss: "#b42318" };

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
  const whole = Math.max(r.bill, r.loadedCost, 1);
  const pct = (v: number) => `${Math.max(0, (v / whole) * 100)}%`;

  const lo = Math.min(...rateCard.filter((x) => x.n).map((x) => x.p25));
  const hi = Math.max(...rateCard.filter((x) => x.n).map((x) => x.p75));
  const pos = (v: number) => `${((v - lo) / Math.max(1, hi - lo)) * 100}%`;

  const cols: Column<RateCardRow & { first: boolean }>[] = [
    {
      key: "d",
      header: "Practice",
      width: "minmax(130px,1fr)",
      cell: (x) => (x.first ? <span className="font-semibold text-ink">{practiceLabel(x.discipline as Discipline)}</span> : null),
    },
    { key: "b", header: "Seniority", width: "minmax(150px,1fr)", cell: (x) => <span className="text-muted">{x.band}</span> },
    { key: "n", header: "Consultants", width: "minmax(100px,0.6fr)", align: "end", cell: (x) => <span className="text-muted">{x.n}</span> },
    {
      key: "range",
      header: "Range, P25 to P75",
      width: "minmax(150px,1.3fr)",
      cell: (x) =>
        x.n ? (
          <span
            className="relative block h-2 w-full rounded-full bg-[#e6eaf0]"
            role="img"
            aria-label={`${usd.format(x.p25)} to ${usd.format(x.p75)}, median ${usd.format(x.p50)}`}
          >
            <span className="absolute inset-y-0 rounded-full bg-[#b4c8f6]" style={{ left: pos(x.p25), width: `calc(${pos(x.p75)} - ${pos(x.p25)})` }} />
            <span className="absolute -inset-y-1 w-[3px] -translate-x-1/2 rounded-full bg-cobalt" style={{ left: pos(x.p50) }} />
          </span>
        ) : (
          <span className="text-subtle">No consultants</span>
        ),
    },
    { key: "p25", header: "P25", width: "minmax(72px,0.5fr)", align: "end", cell: (x) => <span className="text-muted">{x.n ? usd.format(x.p25) : "–"}</span> },
    {
      key: "p50",
      header: "Median",
      width: "minmax(80px,0.5fr)",
      align: "end",
      cell: (x) => <span className="font-semibold text-ink">{x.n ? usd.format(x.p50) : "–"}</span>,
    },
    { key: "p75", header: "P75", width: "minmax(72px,0.5fr)", align: "end", cell: (x) => <span className="text-muted">{x.n ? usd.format(x.p75) : "–"}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Rates and margin"
        description="Price an engagement from pay rate and burden, then check it against what the bench costs today. All rates are per hour."
      />

      <PageBody className="grid items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* Inputs */}
        <Panel className="xl:sticky xl:top-[80px]">
          <PanelHeader title="Engagement" subtitle="Change any value; results update as you type" />
          <DetailSection
            title="Employment basis"
            action={
              <Segmented
                label="Employment basis"
                value={basis}
                onChange={setBasis}
                options={[
                  { value: "W2", label: "W2" },
                  { value: "C2C", label: "Corp-to-corp" },
                ]}
              />
            }
          >
            <div className="space-y-5">
              <Field label="Consultant pay rate" htmlFor="pay">
                <Num id="pay" value={pay} onChange={setPay} suffix="$/hr" />
              </Field>
              {basis === "W2" ? (
                <fieldset>
                  <legend className="text-[13px] font-medium text-ink-2">
                    W2 burden <span className="tnum font-normal text-subtle">· {burdenPct("W2", burden).toFixed(2)}% of pay</span>
                  </legend>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {(
                      [
                        ["fica", "FICA"],
                        ["futaSuta", "FUTA and SUTA"],
                        ["workersComp", "Workers' comp"],
                        ["benefits", "Benefits load"],
                      ] as const
                    ).map(([k, l]) => (
                      <Field key={k} label={l} htmlFor={k}>
                        <Num id={k} value={burden[k]} step={0.05} onChange={(v) => setBurden({ ...burden, [k]: v })} suffix="%" />
                      </Field>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <p className="rounded-[6px] border border-hair bg-canvas px-3 py-2.5 text-[13px] leading-snug text-muted">
                  Corp-to-corp vendors carry their own taxes and insurance. We apply {C2C_BURDEN_PCT}% for payment processing and liability cover.
                </p>
              )}
            </div>
          </DetailSection>

          <DetailSection
            title="Pricing"
            action={
              <Segmented
                label="Solve for"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "margin", label: "Target margin" },
                  { value: "bill", label: "Bill rate" },
                ]}
              />
            }
          >
            {mode === "margin" ? (
              <Field label="Target gross margin" htmlFor="margin" hint="Share of the bill rate kept after pay and burden.">
                <Num id="margin" value={margin} onChange={setMargin} suffix="%" />
              </Field>
            ) : (
              <Field label="Client bill rate" htmlFor="bill" hint="Use when the client's budget is fixed.">
                <Num id="bill" value={bill} onChange={setBill} suffix="$/hr" />
              </Field>
            )}
          </DetailSection>

          <DetailSection title="Term">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Hours per week" htmlFor="hours">
                <Num id="hours" value={hours} onChange={setHours} />
              </Field>
              <Field label="Duration" htmlFor="weeks">
                <Num id="weeks" value={weeks} onChange={setWeeks} suffix="weeks" />
              </Field>
            </div>
          </DetailSection>
        </Panel>

        {/* Outputs */}
        <section className="min-w-0 space-y-6" aria-label="Results" aria-live="polite">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:gap-6">
            <KpiTile label="Client bill rate" value={usd2.format(r.bill)} hint={`${r.markupPct.toFixed(1)}% markup on pay`} />
            <KpiTile
              label="Gross margin per hour"
              value={usd2.format(r.marginPerHour)}
              hint={
                <span className={cn(negative && "font-medium text-[#b42318]")}>{negative ? "Below cost" : `${r.marginPct.toFixed(1)}% of the bill rate`}</span>
              }
            />
            <KpiTile label="Margin over the engagement" value={usd.format(total)} hint={`${usd.format(weekly)} a week for ${safe(weeks)} weeks`} />
          </div>

          <DetailSection card title="Where each billed hour goes" description={`Of ${usd2.format(r.bill)} billed per hour`}>
            <div
              role="img"
              aria-label={`Pay ${usd2.format(r.pay)}, burden ${usd2.format(burdenAmt)}, margin ${usd2.format(r.marginPerHour)}`}
              className="flex h-4 overflow-hidden rounded-[4px] bg-[#e6eaf0]"
            >
              <span className="h-full transition-[width] duration-200" style={{ width: pct(r.pay), background: PART.pay }} />
              <span className="h-full border-l-2 border-surface transition-[width] duration-200" style={{ width: pct(burdenAmt), background: PART.burden }} />
              <span
                className="h-full border-l-2 border-surface transition-[width] duration-200"
                style={{ width: pct(Math.abs(r.marginPerHour)), background: negative ? PART.loss : PART.margin }}
              />
            </div>
            <dl className="tnum mt-5 grid gap-3 text-[14px] sm:grid-cols-3">
              {[
                { k: "Consultant pay", v: r.pay, c: PART.pay },
                { k: "Burden", v: burdenAmt, c: PART.burden },
                { k: "Gross margin", v: r.marginPerHour, c: negative ? PART.loss : PART.margin },
              ].map((x) => (
                <div key={x.k} className="flex items-center gap-2.5 rounded-[6px] border border-hair px-3 py-2.5">
                  <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[2px]" style={{ background: x.c }} />
                  <dt className="text-muted">{x.k}</dt>
                  <dd className={cn("ml-auto font-semibold text-ink", x.k === "Gross margin" && negative && "text-[#b42318]")}>{usd2.format(x.v)}</dd>
                </div>
              ))}
            </dl>
            {negative && (
              <p role="alert" className="mt-4 text-[14px] font-medium text-[#b42318]">
                This bill rate doesn&apos;t cover pay and burden. Raise the bill rate or lower the pay rate.
              </p>
            )}
          </DetailSection>

          <Panel>
            <PanelHeader title="Bench rate card" subtitle="Corp-to-corp pay rates on the bench today. The blue mark is the median." />
            <DataTable
              caption="Bench rate card, corp-to-corp"
              rows={rateCard.map((x, i) => ({ ...x, first: i % 3 === 0 }))}
              columns={cols}
              rowKey={(x) => x.discipline + x.band}
              minWidth={760}
              rowClassName={(x) => (x.first ? "border-t border-t-control" : undefined)}
            />
          </Panel>
        </section>
      </PageBody>
    </>
  );
}
