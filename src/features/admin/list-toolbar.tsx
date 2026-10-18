"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Sheet } from "@/components/ui/overlay";
import { ActiveFilters, FilterMenu, FilterSearch, Toolbar, ToolbarDivider, type FilterOption } from "@/components/ui/filter-menu";
import { IconSliders } from "@/components/icons";

export interface ListFilter {
  key: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
  /** The option meaning "no filter"; defaults to the first option */
  allValue?: string;
}

export interface OverflowAction {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

const neutralOf = (f: ListFilter) => f.allValue ?? f.options[0]?.value;
const labelOf = (f: ListFilter) => f.options.find((o) => o.value === f.value)?.label ?? f.value;

/** One filter as a grouped radio list, for the "More filters" sheet and the phone sheet. */
function FilterGroup({ f }: { f: ListFilter }) {
  return (
    <fieldset className="border-b border-hair px-5 py-5 last:border-b-0">
      <legend className="float-left mb-3 w-full text-[14px] font-semibold text-ink">{f.label}</legend>
      <div className="space-y-1">
        {f.options.map((o) => (
          <label key={o.value} className="flex h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-[14px] text-ink hover:bg-well">
            <input type="radio" name={`f-${f.key}`} checked={f.value === o.value} onChange={() => f.onChange(o.value)} className="size-4 accent-[#2558e0]" />
            <span className="min-w-0 flex-1 truncate">{o.label}</span>
            {o.meta !== undefined && <span className="tnum text-[13px] text-subtle">{o.meta}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Overflow({ actions }: { actions: OverflowAction[] }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className="grid size-9 place-items-center rounded-md text-muted ring-1 ring-line-strong ring-inset transition-colors duration-150 outline-none hover:bg-well hover:text-ink focus-visible:ring-2 focus-visible:ring-cobalt data-[state=open]:bg-well"
        aria-label="More actions"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="19" cy="12" r="1.75" />
        </svg>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={6} className="app anim-pop z-[80] min-w-[200px] rounded-lg bg-surface p-1.5 shadow-overlay">
          {actions.map((a) => (
            <Dropdown.Item
              key={a.label}
              disabled={a.disabled}
              onSelect={a.onSelect}
              className="flex h-9 cursor-pointer items-center rounded-md px-2.5 text-[14px] text-ink outline-none select-none data-[disabled]:cursor-not-allowed data-[disabled]:text-subtle data-[highlighted]:bg-well"
            >
              {a.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

/**
 * The one list toolbar for the console, composed from the shared filter parts:
 *   [ search · up to 3 filters · More filters ]          [ N results · Sort · ⋯ ]
 *   [ Filtered by: chips · Clear all ]
 * Phones get a full-width search and a "Filters (n)" button that opens every
 * filter, grouped, in a bottom sheet.
 */
export function ListToolbar({
  search,
  filters,
  sort,
  summary,
  overflow,
  onClearAll,
  noun = "results",
  className,
}: {
  search: { value: string; onChange: (v: string) => void; placeholder: string };
  filters: ListFilter[];
  sort?: { value: string; options: FilterOption[]; onChange: (v: string) => void };
  summary: number;
  overflow?: OverflowAction[];
  onClearAll: () => void;
  noun?: string;
  /** Passed to the toolbar row, e.g. "border-b-0" when nothing sits beneath it in the card */
  className?: string;
}) {
  const [more, setMore] = useState(false);
  const [phone, setPhone] = useState(false);
  const inline = filters.slice(0, 3);
  const extra = filters.slice(3);
  const active = filters.filter((f) => f.value !== neutralOf(f));
  const extraActive = extra.filter((f) => f.value !== neutralOf(f)).length;
  const summaryText = `${summary} ${summary === 1 ? noun.replace(/s$/, "") : noun}`;

  return (
    <>
      <Toolbar
        className={className}
        summary={<span className="hidden sm:inline">{summaryText}</span>}
        actions={
          (sort || overflow?.length) && (
            <>
              {sort && (
                <FilterMenu
                  label="Sort"
                  variant="sort"
                  align="end"
                  value={sort.value}
                  options={sort.options}
                  onChange={sort.onChange}
                  className="hidden sm:inline-flex"
                />
              )}
              {overflow && overflow.length > 0 && <Overflow actions={overflow} />}
            </>
          )
        }
        chips={
          active.length > 0 ? (
            <ActiveFilters
              filters={active.map((f) => ({ key: f.key, label: f.label, value: labelOf(f), onRemove: () => f.onChange(neutralOf(f)) }))}
              onClearAll={onClearAll}
            />
          ) : undefined
        }
      >
        <FilterSearch value={search.value} onChange={search.onChange} placeholder={search.placeholder} className="sm:w-[280px]" />
        <span className="hidden items-center gap-2 sm:flex">
          <span className="hidden xl:contents">
            <ToolbarDivider />
          </span>
          {inline.map((f) => (
            <FilterMenu key={f.key} label={f.label} value={f.value} options={f.options} onChange={f.onChange} allValue={f.allValue} />
          ))}
          {extra.length > 0 && (
            <Button variant="ghost" onClick={() => setMore(true)} className={cn(extraActive > 0 && "font-semibold text-brand")}>
              <IconSliders size={16} />
              More filters{extraActive > 0 ? ` (${extraActive})` : ""}
            </Button>
          )}
        </span>
        <span className="flex w-full items-center justify-between gap-2 sm:hidden">
          <Button onClick={() => setPhone(true)} className={cn(active.length > 0 && "text-brand")}>
            <IconSliders size={16} />
            Filters{active.length > 0 ? ` (${active.length})` : ""}
          </Button>
          <span className="tnum text-[13px] text-muted">{summaryText}</span>
        </span>
      </Toolbar>

      {extra.length > 0 && (
        <Sheet
          open={more}
          onOpenChange={setMore}
          title="More filters"
          width="max-w-[420px]"
          footer={
            <div className="flex w-full justify-between gap-2">
              <Button variant="ghost" onClick={() => extra.forEach((f) => f.onChange(neutralOf(f)))}>
                Reset these
              </Button>
              <Button variant="primary" onClick={() => setMore(false)}>
                Show {summaryText}
              </Button>
            </div>
          }
        >
          {extra.map((f) => (
            <FilterGroup key={f.key} f={f} />
          ))}
        </Sheet>
      )}

      <BottomSheet
        open={phone}
        onOpenChange={setPhone}
        title="Filters"
        footer={
          <>
            <Button variant="secondary" onClick={onClearAll} className="flex-1">
              Clear all
            </Button>
            <Button variant="primary" onClick={() => setPhone(false)} className="flex-1">
              Show {summaryText}
            </Button>
          </>
        }
      >
        {sort && <FilterGroup f={{ key: "sort", label: "Sort by", ...sort }} />}
        {filters.map((f) => (
          <FilterGroup key={f.key} f={f} />
        ))}
      </BottomSheet>
    </>
  );
}
