"use client";

import * as RS from "@radix-ui/react-select";
import { cn } from "@/lib/cn";
import { IconCheck, IconChevronDown } from "@/components/icons";

export interface SelectOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  /** Secondary line shown in the menu only */
  hint?: string;
  disabled?: boolean;
}

type Size = "sm" | "md" | "lg";

const trigger: Record<Size, string> = {
  sm: "h-8 rounded-md pl-3 pr-2 text-[13px] gap-1.5",
  md: "h-9 rounded-md pl-3 pr-2.5 text-[14px] gap-2",
  lg: "h-11 rounded-md pl-3.5 pr-3 text-[15px] gap-2",
};

/**
 * Design-system select built on Radix: keyboard and screen-reader support,
 * type-ahead, and a menu that matches the rest of the UI. `sm` is a 30px pill
 * for toolbars; `md` a 36px field; `lg` the marketing-form size.
 */
export function Select<T extends string>({
  value,
  onValueChange,
  options,
  size = "md",
  label,
  id,
  placeholder = "Select",
  className,
  prefix,
  align = "start",
}: {
  value: T;
  onValueChange: (v: T) => void;
  options: SelectOption<T>[];
  size?: Size;
  /** Accessible name when there is no visible <label htmlFor> */
  label?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  /** Muted text inside the trigger before the value, e.g. "Sort:" */
  prefix?: string;
  align?: "start" | "end";
}) {
  return (
    <RS.Root value={value} onValueChange={(v) => onValueChange(v as T)}>
      <RS.Trigger
        id={id}
        aria-label={label}
        className={cn(
          "group inline-flex min-w-0 items-center justify-between bg-surface text-left text-ink ring-1 ring-inset ring-control transition-colors outline-none hover:bg-well focus-visible:ring-2 focus-visible:ring-cobalt data-[placeholder]:text-subtle data-[state=open]:ring-2 data-[state=open]:ring-cobalt",
          trigger[size],
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          {prefix && <span className="shrink-0 text-subtle">{prefix}</span>}
          <span className="truncate">
            <RS.Value placeholder={placeholder} />
          </span>
        </span>
        <RS.Icon asChild>
          <IconChevronDown size={size === "sm" ? 14 : 16} className="shrink-0 text-subtle transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </RS.Icon>
      </RS.Trigger>
      <RS.Portal>
        <RS.Content
          position="popper"
          align={align}
          sideOffset={6}
          className="anim-pop z-[80] max-h-[min(var(--radix-select-content-available-height),340px)] min-w-[max(var(--radix-select-trigger-width),168px)] overflow-hidden rounded-lg bg-surface shadow-overlay"
        >
          <RS.ScrollUpButton className="grid h-6 place-items-center text-subtle">
            <IconChevronDown size={14} className="rotate-180" />
          </RS.ScrollUpButton>
          <RS.Viewport className="p-1">
            {options.map((o) => (
              <RS.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className="relative flex cursor-pointer items-center gap-2 rounded-md py-2 pr-2.5 pl-8 text-[13.5px] text-ink-2 outline-none select-none focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[highlighted]:bg-well data-[highlighted]:text-ink data-[state=checked]:font-medium data-[state=checked]:text-ink"
              >
                <RS.ItemIndicator className="absolute left-2.5 text-cobalt">
                  <IconCheck size={14} strokeWidth={2.25} />
                </RS.ItemIndicator>
                <span className="min-w-0">
                  <RS.ItemText>{o.label}</RS.ItemText>
                  {o.hint && <span className="block text-xs font-normal text-subtle">{o.hint}</span>}
                </span>
              </RS.Item>
            ))}
          </RS.Viewport>
          <RS.ScrollDownButton className="grid h-6 place-items-center text-subtle">
            <IconChevronDown size={14} />
          </RS.ScrollDownButton>
        </RS.Content>
      </RS.Portal>
    </RS.Root>
  );
}
