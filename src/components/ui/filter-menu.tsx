"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/cn";
import { IconCheck, IconChevronDown, IconSearch, IconX } from "@/components/icons";

export interface FilterOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  /** Trailing count or note in the menu */
  meta?: React.ReactNode;
}

const textOf = (n: React.ReactNode, fallback: string) => (typeof n === "string" || typeof n === "number" ? String(n) : fallback);

/**
 * List-view filter (enterprise pattern). At rest it is a plain secondary button
 * naming the field ("Practice ▾"); once a value is chosen it shows the value on a
 * blue wash ("Practice: Data & AI ▾") so active filters read at a glance. The
 * menu is a single-choice list with a check on the current option.
 *
 * `allValue` is the option meaning "no filter" (defaults to the first option).
 * `variant="sort"` renders a quieter borderless control for ordering, which
 * belongs in the view zone of the toolbar, not among the filters.
 */
export function FilterMenu<T extends string>({
  label,
  value,
  options,
  onChange,
  align = "start",
  allValue,
  variant = "filter",
  className,
}: {
  label: string;
  value: T;
  options: FilterOption<T>[];
  onChange: (v: T) => void;
  align?: "start" | "end";
  allValue?: T;
  variant?: "filter" | "sort";
  className?: string;
}) {
  const current = options.find((o) => o.value === value);
  const neutral = allValue ?? options[0]?.value;
  const active = variant === "filter" && value !== neutral;
  const currentText = textOf(current?.label, String(value));

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className={cn(
          "group inline-flex h-9 max-w-full shrink-0 items-center gap-1.5 rounded-md px-3 text-[14px] whitespace-nowrap transition-colors duration-150 ease-power3-out outline-none focus-visible:ring-2 focus-visible:ring-cobalt",
          variant === "sort"
            ? "text-muted hover:bg-well hover:text-ink data-[state=open]:bg-well"
            : active
              ? "bg-cobalt-wash font-semibold text-brand-strong ring-1 ring-[#b9cbf6] ring-inset hover:bg-[#e3ebfc]"
              : "bg-surface font-medium text-ink ring-1 ring-line-strong ring-inset hover:bg-well hover:ring-control data-[state=open]:bg-well",
          className,
        )}
        aria-label={`${label}: ${currentText}`}
      >
        {variant === "sort" ? (
          <>
            <span>{label}:</span>
            <span className="truncate font-semibold text-ink">{current?.label ?? value}</span>
          </>
        ) : active ? (
          <span className="truncate">
            {label}: {current?.label ?? value}
          </span>
        ) : (
          <span>{label}</span>
        )}
        <IconChevronDown size={14} className={cn("shrink-0 transition-transform duration-150 group-data-[state=open]:rotate-180", active ? "text-brand" : "text-subtle")} />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align={align} sideOffset={6} className="app anim-pop z-[80] max-h-[min(420px,70dvh)] min-w-[220px] overflow-y-auto rounded-lg bg-surface p-1.5 shadow-overlay">
          <Dropdown.Label className="px-2.5 pt-1.5 pb-2 text-[12px] font-semibold text-subtle">{label}</Dropdown.Label>
          <Dropdown.RadioGroup value={value} onValueChange={(v) => onChange(v as T)}>
            {options.map((o) => (
              <Dropdown.RadioItem
                key={o.value}
                value={o.value}
                className="flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-[14px] text-ink-2 outline-none select-none data-[highlighted]:bg-well data-[highlighted]:text-ink data-[state=checked]:font-semibold data-[state=checked]:text-ink"
              >
                <span className="grid w-4 shrink-0 place-items-center">
                  <Dropdown.ItemIndicator>
                    <IconCheck size={16} strokeWidth={2} className="text-cobalt" />
                  </Dropdown.ItemIndicator>
                </span>
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {o.meta !== undefined && <span className="tnum text-[13px] font-normal text-subtle">{o.meta}</span>}
              </Dropdown.RadioItem>
            ))}
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

/** Toolbar search: 36px field with a leading icon and an optional shortcut hint. */
export function FilterSearch({
  value,
  onChange,
  placeholder = "Search",
  label,
  shortcut,
  inputRef,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** Accessible name; defaults to the placeholder */
  label?: string;
  /** Visible key hint, e.g. "/" */
  shortcut?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
}) {
  return (
    <label className={cn("relative flex h-9 w-full min-w-0 items-center sm:w-[300px]", className)}>
      <span className="sr-only">{label ?? placeholder}</span>
      <IconSearch size={16} className="pointer-events-none absolute left-3 text-subtle" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full rounded-md bg-surface pr-9 pl-9 text-[14px] text-ink ring-1 ring-control ring-inset transition-shadow duration-150 placeholder:text-subtle focus:ring-2 focus:ring-cobalt focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button type="button" onClick={() => onChange("")} className="absolute right-1.5 grid size-7 place-items-center rounded text-subtle hover:bg-well hover:text-ink" aria-label="Clear search">
          <IconX size={14} />
        </button>
      ) : (
        shortcut && (
          <kbd className="pointer-events-none absolute right-2.5 rounded bg-well px-1.5 font-brand text-[12px] leading-5 text-muted ring-1 ring-hair ring-inset">{shortcut}</kbd>
        )
      )}
    </label>
  );
}

export interface ActiveFilter {
  key: string;
  /** e.g. "Practice" */
  label: string;
  /** e.g. "Data & AI" */
  value: React.ReactNode;
  onRemove: () => void;
}

/** Applied filters as removable chips, with "Clear all". Renders nothing when empty. */
export function ActiveFilters({ filters, onClearAll, className }: { filters: ActiveFilter[]; onClearAll?: () => void; className?: string }) {
  if (!filters.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-[13px] text-muted">Filtered by</span>
      {filters.map((f) => (
        <span key={f.key} className="inline-flex h-7 items-center gap-1 rounded-md bg-well pr-1 pl-2.5 text-[13px] text-ink ring-1 ring-hair ring-inset">
          <span className="text-muted">{f.label}:</span>
          <span className="font-semibold">{f.value}</span>
          <button type="button" onClick={f.onRemove} className="ml-0.5 grid size-5 place-items-center rounded text-subtle hover:bg-[#e4e8ee] hover:text-ink" aria-label={`Remove ${f.label} filter`}>
            <IconX size={12} />
          </button>
        </span>
      ))}
      {onClearAll && filters.length > 1 && (
        <button type="button" onClick={onClearAll} className="h-7 rounded-md px-2 text-[13px] font-semibold text-brand hover:bg-cobalt-wash">
          Clear all
        </button>
      )}
    </div>
  );
}

/** Thin vertical divider between toolbar groups (hidden when the row wraps on phones). */
export function ToolbarDivider() {
  return <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-hair sm:block" />;
}

/**
 * List toolbar with two zones, laid out the way enterprise list views are:
 *   [ search · filters · More filters ]                [ 113 results · Sort · view · ⋯ ]
 *   [ Filtered by: chip × chip ×  Clear all ]   ← `chips`, only when filters apply
 * `children` is the filter zone, `actions` the view zone (keep it to sort, view
 * toggle and one overflow menu), `summary` the result count. Sits at the top of
 * the table card, divided from the table by a 1px rule.
 */
export function Toolbar({
  children,
  actions,
  summary,
  chips,
  className,
}: {
  children?: React.ReactNode;
  actions?: React.ReactNode;
  summary?: React.ReactNode;
  chips?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-hair px-4 py-3 sm:px-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{children}</div>
        {(summary || actions) && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {summary && <span className="tnum mr-1 text-[13px] whitespace-nowrap text-muted">{summary}</span>}
            {actions}
          </div>
        )}
      </div>
      {chips && <div className="mt-3">{chips}</div>}
    </div>
  );
}
