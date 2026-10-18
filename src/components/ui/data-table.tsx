"use client";

import { cn } from "@/lib/cn";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  /** CSS grid track, e.g. "minmax(220px,2fr)", "120px", "max-content". Default "minmax(120px,1fr)". */
  width?: string;
  /** Numbers and actions align to the end */
  align?: "start" | "end" | "center";
  className?: string;
  headerClassName?: string;
}

export interface Aggregate {
  value: React.ReactNode;
  label: React.ReactNode;
}

/**
 * CSS-grid data table, enterprise register: 40px header on the canvas tone with
 * 13px semibold labels, 52px rows divided by 1px borders, row hover tint, an
 * active/selected state (blue wash), and an optional aggregate/summary strip. Scrolls horizontally inside its
 * frame below `minWidth`. Rows are keyboard-activatable when `onRowClick` is set.
 *
 *   <DataTable caption="Candidates" rows={list} rowKey={(c) => c.id} columns={cols}
 *     onRowClick={open} activeKey={openId} aggregates={[{ value: 42, label: "In view" }]} />
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  caption,
  onRowClick,
  activeKey,
  selectedKeys,
  empty,
  aggregates,
  minWidth = 720,
  rowHeight = "min-h-[52px] py-2",
  className,
  rowClassName,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Accessible table name */
  caption: string;
  onRowClick?: (row: T) => void;
  activeKey?: string | null;
  selectedKeys?: Set<string>;
  /** Shown in place of rows when there are none (use EmptyState) */
  empty?: React.ReactNode;
  aggregates?: Aggregate[];
  minWidth?: number;
  /** Override for taller rows, e.g. "min-h-[52px] py-2" for two-line cells */
  rowHeight?: string;
  className?: string;
  rowClassName?: (row: T) => string | undefined;
}) {
  const template = columns.map((c) => c.width ?? "minmax(120px,1fr)").join(" ");
  const alignCls = (a?: Column<T>["align"]) => (a === "end" ? "justify-end text-right" : a === "center" ? "justify-center text-center" : "justify-start");

  return (
    <div className={cn("min-w-0", className)}>
      {/* relative: keeps sr-only text inside cells from escaping the scroll clip */}
      <div className="scroll-thin relative overflow-x-auto">
        <div role="table" aria-label={caption} className="grid" style={{ gridTemplateColumns: template, minWidth }}>
          <div role="rowgroup" className="contents">
            <div role="row" className="col-span-full grid grid-cols-subgrid border-b border-hair bg-well">
              {columns.map((c) => (
                <div
                  key={c.key}
                  role="columnheader"
                  className={cn("flex h-10 items-center px-3 text-[13px] font-semibold whitespace-nowrap text-muted first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5", alignCls(c.align), c.headerClassName)}
                >
                  {c.header}
                </div>
              ))}
            </div>
          </div>
          <div role="rowgroup" className="contents">
            {rows.length === 0 ? (
              <div role="row" className="col-span-full">
                <div role="cell">{empty ?? <p className="grid h-[140px] place-items-center text-[14px] text-subtle">Nothing to show.</p>}</div>
              </div>
            ) : (
              rows.map((r, i) => {
                const k = rowKey(r);
                const active = activeKey === k || selectedKeys?.has(k);
                return (
                  <div
                    key={k}
                    role="row"
                    data-active={active || undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
                              e.preventDefault();
                              onRowClick(r);
                            }
                          }
                        : undefined
                    }
                    className={cn(
                      "col-span-full grid grid-cols-subgrid border-b border-hair bg-surface transition-colors duration-150 ease-power3-out outline-none last:border-b-0 data-[active]:bg-cobalt-wash focus-visible:bg-well",
                      onRowClick && "cursor-pointer hover:bg-well",
                      rowClassName?.(r),
                    )}
                  >
                    {columns.map((c) => (
                      <div
                        key={c.key}
                        role="cell"
                        className={cn("flex min-w-0 items-center px-3 text-[14px] text-ink first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5", rowHeight, alignCls(c.align), c.align === "end" && "tnum", c.className)}
                      >
                        {c.cell(r, i)}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {aggregates && aggregates.length > 0 && <AggregateStrip items={aggregates} />}
    </div>
  );
}

/** Totals under a table: "42 In view · $96 Median C2C …". Also usable on its own. */
export function AggregateStrip({ items, className }: { items: Aggregate[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hair bg-surface px-4 py-3 text-[13px] sm:px-5", className)}>
      {items.map((a, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="tnum font-semibold text-ink">{a.value}</span>
          <span className="text-muted">{a.label}</span>
        </div>
      ))}
    </div>
  );
}
