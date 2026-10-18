"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { IconChevronRight } from "@/components/icons";

/**
 * Client-side paging for a list. Resets to the first page whenever `resetKey`
 * changes (pass the active filters), so a filter never strands you on page 4.
 */
export function usePage<T>(rows: T[], pageSize = 25, resetKey = "") {
  const [state, setState] = useState({ page: 1, key: resetKey });
  const page = state.key === resetKey ? state.page : 1;
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pages);
  return {
    page: current,
    pages,
    total: rows.length,
    from: rows.length ? (current - 1) * pageSize + 1 : 0,
    to: Math.min(rows.length, current * pageSize),
    rows: rows.slice((current - 1) * pageSize, current * pageSize),
    setPage: (p: number) => setState({ page: Math.max(1, Math.min(pages, p)), key: resetKey }),
  };
}

const btn =
  "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-[6px] border border-control bg-surface px-2.5 text-[13px] font-medium text-ink transition-colors duration-150 hover:bg-canvas disabled:cursor-not-allowed disabled:border-line disabled:text-subtle disabled:hover:bg-surface";

/** Table footer: "Showing 1–25 of 148" with previous / next. */
export function Pagination({
  from,
  to,
  total,
  page,
  pages,
  setPage,
  noun = "results",
  className,
}: {
  from: number;
  to: number;
  total: number;
  page: number;
  pages: number;
  setPage: (p: number) => void;
  noun?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-14 flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-[13px] text-subtle sm:px-6", className)}>
      <p className="tnum">
        {total === 0 ? (
          `No ${noun}`
        ) : (
          <>
            Showing <span className="font-medium text-ink">{from}</span>–<span className="font-medium text-ink">{to}</span> of{" "}
            <span className="font-medium text-ink">{total}</span> {noun}
          </>
        )}
      </p>
      {pages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-2">
          <button type="button" className={btn} onClick={() => setPage(page - 1)} disabled={page <= 1} aria-label="Previous page">
            <IconChevronRight size={14} className="rotate-180" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <span className="tnum px-1">
            Page {page} of {pages}
          </span>
          <button type="button" className={btn} onClick={() => setPage(page + 1)} disabled={page >= pages} aria-label="Next page">
            <span className="hidden sm:inline">Next</span>
            <IconChevronRight size={14} />
          </button>
        </nav>
      )}
    </div>
  );
}
