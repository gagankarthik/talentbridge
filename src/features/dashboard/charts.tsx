"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Plain HTML/CSS bar charts following the dataviz method: thin bars (<=24px),
// 4px rounded data-end, square at the baseline, 2px surface gaps between
// stacked segments, recessive axes, hover tooltips and a table view.

export interface BarDatum {
  label: string;
  value: number;
  hint?: string;
}

function Tooltip({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-[8px] bg-ink px-2.5 py-1.5 text-[12px] whitespace-nowrap text-white shadow-lg" style={{ left: x, top: y - 8 }}>
      {children}
    </div>
  );
}

/** Horizontal bars, one series. Value sits at the bar tip. */
export function BarList({ data, color = "var(--color-brand)", unit }: { data: BarDatum[]; color?: string; unit: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const [tip, setTip] = useState<{ x: number; y: number; d: BarDatum } | null>(null);
  return (
    <div data-chart-host className="relative" onMouseLeave={() => setTip(null)}>
      <ul className="space-y-3">
        {data.map((d) => (
          <li key={d.label} className="grid grid-cols-[112px_1fr] items-center gap-3 text-[13px]">
            <span className="truncate text-muted">{d.label}</span>
            <span
              className="flex h-6 items-center gap-2"
              onMouseMove={(e) => {
                const host = (e.currentTarget.closest("[data-chart-host]") as HTMLElement).getBoundingClientRect();
                setTip({ x: e.clientX - host.left, y: e.currentTarget.getBoundingClientRect().top - host.top, d });
              }}
            >
              <span className="h-5 rounded-r-[4px] transition-[width] duration-500" style={{ width: `${(d.value / max) * 88}%`, minWidth: d.value ? 4 : 0, background: color }} />
              <span className="tnum text-[13px] font-semibold text-ink">{d.value}</span>
            </span>
          </li>
        ))}
      </ul>
      {tip && (
        <Tooltip x={tip.x} y={tip.y}>
          <span className="font-semibold">{tip.d.label}</span> {tip.d.value} {unit}
          {tip.d.hint && <span className="block text-slate-300">{tip.d.hint}</span>}
        </Tooltip>
      )}
    </div>
  );
}

export interface StackRow {
  label: string;
  parts: number[];
}

/** Horizontal stacked bars for an ordered breakdown, with legend, totals and a table view. */
export function StackedBars({ rows, series, colors }: { rows: StackRow[]; series: string[]; colors: string[] }) {
  const [table, setTable] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; row: string; s: number; v: number } | null>(null);
  const max = Math.max(1, ...rows.map((r) => r.parts.reduce((a, b) => a + b, 0)));
  const totals = series.map((_, i) => rows.reduce((n, r) => n + r.parts[i], 0));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted">
        {series.map((s, i) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: colors[i] }} />
            {s} <span className="tnum font-medium text-ink">{totals[i]}</span>
          </span>
        ))}
        <button onClick={() => setTable(!table)} className="ml-auto text-[12.5px] font-medium text-cobalt hover:underline">
          {table ? "Show chart" : "Show table"}
        </button>
      </div>

      {table ? (
        <table className="mt-4 w-full text-left text-[13px]">
          <thead className="text-xs text-subtle">
            <tr className="border-b border-line">
              <th className="py-2 font-medium">Practice</th>
              {series.map((s) => (
                <th key={s} className="py-2 text-right font-medium">
                  {s}
                </th>
              ))}
              <th className="py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="tnum">
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0">
                <td className="py-2 text-ink">{r.label}</td>
                {r.parts.map((v, i) => (
                  <td key={i} className="py-2 text-right">
                    {v}
                  </td>
                ))}
                <td className="py-2 text-right font-semibold">{r.parts.reduce((a, b) => a + b, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div data-chart-host className="relative mt-4" onMouseLeave={() => setTip(null)}>
          <ul className="space-y-3.5">
            {rows.map((r) => {
              const total = r.parts.reduce((a, b) => a + b, 0);
              return (
                <li key={r.label} className="grid grid-cols-[112px_1fr] items-center gap-3 text-[13px]">
                  <span className="truncate text-muted">{r.label}</span>
                  <span className="flex h-6 items-center gap-2">
                    <span className="flex h-5 overflow-hidden rounded-r-[4px]" style={{ width: `${(total / max) * 88}%`, gap: 2 }}>
                      {r.parts.map((v, i) =>
                        v ? (
                          <span
                            key={i}
                            className="h-full"
                            style={{ flexGrow: v, background: colors[i] }}
                            onMouseMove={(e) => {
                              const host = (e.currentTarget.closest("[data-chart-host]") as HTMLElement).getBoundingClientRect();
                              setTip({ x: e.clientX - host.left, y: e.currentTarget.getBoundingClientRect().top - host.top, row: r.label, s: i, v });
                            }}
                          />
                        ) : null,
                      )}
                    </span>
                    <span className="tnum text-[13px] font-semibold text-ink">{total}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          {tip && (
            <Tooltip x={tip.x} y={tip.y}>
              <span className="font-semibold">{tip.row}</span>
              <span className="block text-slate-300">
                {series[tip.s]}: <span className="tnum text-white">{tip.v}</span>
              </span>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
}

/** Stat tile: label, value, optional context line with direction-aware tone. */
export function StatTile({ label, value, note, tone }: { label: string; value: React.ReactNode; note?: string; tone?: "good" | "warn" }) {
  return (
    <div className="rounded-[12px] bg-surface p-5 ring-1 ring-line">
      <p className="text-[13px] text-subtle">{label}</p>
      <p className="tnum mt-1.5 text-[28px] leading-none font-semibold tracking-[-0.02em] text-ink">{value}</p>
      {note && <p className={cn("mt-2 text-[12.5px]", tone === "good" ? "text-avail-ink" : tone === "warn" ? "text-notice-ink" : "text-subtle")}>{note}</p>}
    </div>
  );
}
