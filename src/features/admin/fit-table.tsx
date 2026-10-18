"use client";

import { useEffect, useRef, useState } from "react";
import { DataTable, type Column } from "@/components/ui/data-table";

/** A DataTable column with a drop order: higher `priority` numbers leave first when space runs out. */
export type FitColumn<T> = Column<T> & { priority?: number };

/** Smallest width a grid track can take, read from "120px" or "minmax(120px,1fr)". */
const minOf = (w?: string) => {
  const m = w?.match(/(\d+)px/);
  return m ? Number(m[1]) : 120;
};

type Props<T> = Omit<Parameters<typeof DataTable<T>>[0], "columns" | "minWidth"> & { columns: FitColumn<T>[]; keep?: number };

/**
 * DataTable that never clips a column: it measures its own card and drops the
 * lowest-priority columns until the rest fit, keeping at least `keep` columns
 * (the table then scrolls inside its card, never the page). Dropped details stay
 * one click away on the record or its preview sheet.
 */
export function FitTable<T>({ columns, keep = 2, ...rest }: Props<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let shown = columns;
  if (width !== null) {
    const order = [...columns].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    const sum = (cs: FitColumn<T>[]) => cs.reduce((n, c) => n + minOf(c.width), 0) + 16;
    for (const c of order) {
      if (sum(shown) <= width || shown.length <= keep) break;
      if (!c.priority) continue;
      shown = shown.filter((x) => x !== c);
    }
  }
  const minWidth = shown.reduce((n, c) => n + minOf(c.width), 0) + 16;

  return (
    <div ref={ref} className="min-w-0">
      <DataTable {...rest} columns={shown} minWidth={minWidth} />
    </div>
  );
}
