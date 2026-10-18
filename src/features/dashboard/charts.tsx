"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { KpiTile } from "@/components/ui/data-display";

// Plain HTML/CSS charts: 14px bars with a 3px radius on a neutral track, tabular
// values at the tip, a recessive legend, hover tooltips and a table view.
// Colour is the blue ramp only (enterprise spec): #2558e0, #6f93ec, #b4c8f6.

/** Blue ramp for ordered series (strongest first). */
export const COBALT_RAMP = ["#2558e0", "#6f93ec", "#b4c8f6"];

export interface BarDatum {
  label: string;
  value: number;
  hint?: string;
}

function Tooltip({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2.5 py-1.5 text-[12px] whitespace-nowrap text-white shadow-overlay" style={{ left: x, top: y - 8 }}>
      {children}
    </div>
  );
}

/**
 * Horizontal bars, one series, value at the tip. With `conversion`, each row after
 * the first shows the step rate from the row above (funnels).
 */
export function BarList({ data, color = "var(--color-cobalt)", unit, conversion }: { data: BarDatum[]; color?: string; unit: string; conversion?: boolean }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const [tip, setTip] = useState<{ x: number; y: number; d: BarDatum } | null>(null);
  return (
    <div data-chart-host className="relative" onMouseLeave={() => setTip(null)}>
      <ul className="space-y-1">
        {data.map((d, i) => {
          const prev = data[i - 1]?.value;
          const step = conversion && i > 0 && prev ? Math.round((d.value / prev) * 100) : null;
          return (
            <li key={d.label} className="grid min-h-8 grid-cols-[112px_1fr_auto] items-center gap-3 text-[13px]">
              <span className="truncate text-ink-2">{d.label}</span>
              <span
                className="flex h-3.5 items-center rounded-[3px] bg-[#f0f2f5]"
                onMouseMove={(e) => {
                  const host = (e.currentTarget.closest("[data-chart-host]") as HTMLElement).getBoundingClientRect();
                  setTip({ x: e.clientX - host.left, y: e.currentTarget.getBoundingClientRect().top - host.top, d });
                }}
              >
                <span className="h-full rounded-[3px] transition-[width] duration-300 ease-out" style={{ width: `${(d.value / max) * 100}%`, minWidth: d.value ? 6 : 0, background: color }} />
              </span>
              <span className="flex w-[72px] items-baseline justify-end gap-1.5">
                <span className="tnum font-semibold text-ink">{d.value}</span>
                {step !== null && <span className="tnum text-[12px] text-subtle">{step}%</span>}
              </span>
            </li>
          );
        })}
      </ul>
      {tip && (
        <Tooltip x={tip.x} y={tip.y}>
          <span className="font-semibold">{tip.d.label}</span> {tip.d.value} {unit}
          {tip.d.hint && <span className="block text-ash">{tip.d.hint}</span>}
        </Tooltip>
      )}
    </div>
  );
}

export interface StackRow {
  label: string;
  parts: number[];
}

/** Horizontal stacked bars for an ordered breakdown, with legend totals and a table view. */
export function StackedBars({ rows, series, colors = COBALT_RAMP }: { rows: StackRow[]; series: string[]; colors?: string[] }) {
  const [table, setTable] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; row: string; s: number; v: number } | null>(null);
  const max = Math.max(1, ...rows.map((r) => r.parts.reduce((a, b) => a + b, 0)));
  const totals = series.map((_, i) => rows.reduce((n, r) => n + r.parts[i], 0));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-subtle">
        {series.map((s, i) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px]" style={{ background: colors[i] }} />
            {s} <span className="tnum font-medium text-ink">{totals[i]}</span>
          </span>
        ))}
        <button onClick={() => setTable(!table)} className="ml-auto text-[13px] font-medium text-cobalt hover:underline">
          {table ? "Show chart" : "Show table"}
        </button>
      </div>

      {table ? (
        <div className="mt-4 overflow-hidden rounded-md border border-hair">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-canvas text-[13px] text-ink-2">
              <tr>
                <th className="px-3 py-2 font-semibold">Practice</th>
                {series.map((s) => (
                  <th key={s} className="px-3 py-2 text-right font-semibold">
                    {s}
                  </th>
                ))}
                <th className="px-3 py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="tnum">
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-hair">
                  <td className="px-3 py-2 text-ink">{r.label}</td>
                  {r.parts.map((v, i) => (
                    <td key={i} className="px-3 py-2 text-right text-ink-2">
                      {v}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right font-semibold">{r.parts.reduce((a, b) => a + b, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div data-chart-host className="relative mt-5" onMouseLeave={() => setTip(null)}>
          <ul className="space-y-1">
            {rows.map((r) => {
              const total = r.parts.reduce((a, b) => a + b, 0);
              return (
                <li key={r.label} className="grid min-h-8 grid-cols-[112px_1fr_auto] items-center gap-3 text-[13px]">
                  <span className="truncate text-ink-2">{r.label}</span>
                  <span className="flex h-3.5 items-center rounded-[3px] bg-[#f0f2f5]">
                    <span className="flex h-full overflow-hidden rounded-[3px]" style={{ width: `${(total / max) * 100}%`, gap: 2 }}>
                      {r.parts.map((v, i) =>
                        v ? (
                          <span
                            key={i}
                            className="h-full transition-[filter] hover:brightness-95"
                            style={{ flexGrow: v, background: colors[i] }}
                            onMouseMove={(e) => {
                              const host = (e.currentTarget.closest("[data-chart-host]") as HTMLElement).getBoundingClientRect();
                              setTip({ x: e.clientX - host.left, y: e.currentTarget.getBoundingClientRect().top - host.top, row: r.label, s: i, v });
                            }}
                          />
                        ) : null,
                      )}
                    </span>
                  </span>
                  <span className="tnum w-8 text-right font-semibold text-ink">{total}</span>
                </li>
              );
            })}
          </ul>
          {tip && (
            <Tooltip x={tip.x} y={tip.y}>
              <span className="font-semibold">{tip.row}</span>
              <span className="block text-ash">
                {series[tip.s]}: <span className="tnum text-white">{tip.v}</span>
              </span>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
}

/** Stat tile (kept for the platform console): a KpiTile with a direction-aware note. */
export function StatTile({ label, value, note, tone }: { label: string; value: React.ReactNode; note?: string; tone?: "good" | "warn" }) {
  return (
    <KpiTile
      label={label}
      value={value}
      hint={note && <span className={cn(tone === "good" ? "text-[#1a7f4b]" : tone === "warn" ? "text-[#9a5b00]" : "text-ink-2")}>{note}</span>}
    />
  );
}
