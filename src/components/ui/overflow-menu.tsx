"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/cn";
import { IconCheck } from "@/components/icons";

/** Horizontal ellipsis in the icon set's 1.5px stroke, drawn as three round dots. */
function IconMore({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
    </svg>
  );
}

const item =
  "flex min-h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-[14px] text-ink outline-none select-none data-[disabled]:cursor-not-allowed data-[disabled]:text-subtle data-[highlighted]:bg-canvas";

/**
 * Toolbar overflow: one 32px icon-only "⋯" button (with a tooltip) that holds
 * secondary view options — columns, grouping, export — so the toolbar keeps a
 * single row. Compose the menu from the parts below.
 */
export function OverflowMenu({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <Dropdown.Root>
      <Tooltip.Provider delayDuration={300}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Dropdown.Trigger
              aria-label={label}
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-md bg-surface text-ink-2 ring-1 ring-control ring-inset transition-colors duration-150 outline-none hover:bg-canvas hover:text-ink focus-visible:ring-2 focus-visible:ring-cobalt data-[state=open]:bg-canvas sm:size-8",
                className,
              )}
            >
              <IconMore />
            </Dropdown.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content side="bottom" sideOffset={6} className="z-[90] rounded-md bg-ink px-2 py-1 text-[12px] font-medium text-white shadow-overlay">
              {label}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={6} className="app anim-pop z-[80] w-64 rounded-lg border border-hair bg-surface p-1.5 shadow-overlay">
          {children}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
  return <Dropdown.Label className="px-2.5 pt-2 pb-1 text-[13px] font-semibold text-ink-2">{children}</Dropdown.Label>;
}

export function MenuSeparator() {
  return <Dropdown.Separator className="mx-1 my-1.5 h-px bg-hair" />;
}

/** Toggle item that keeps the menu open (e.g. a visible column). */
export function MenuCheckbox({ checked, onCheckedChange, children }: { checked: boolean; onCheckedChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <Dropdown.CheckboxItem checked={checked} onCheckedChange={onCheckedChange} onSelect={(e) => e.preventDefault()} className={item}>
      <span className={cn("grid size-4 shrink-0 place-items-center rounded-[4px] ring-1 ring-control ring-inset", checked && "bg-cobalt ring-cobalt")}>
        <Dropdown.ItemIndicator>
          <IconCheck size={11} strokeWidth={3} className="text-white" />
        </Dropdown.ItemIndicator>
      </span>
      {children}
    </Dropdown.CheckboxItem>
  );
}

export function MenuRadioGroup<T extends string>({ value, onValueChange, children }: { value: T; onValueChange: (v: T) => void; children: React.ReactNode }) {
  return (
    <Dropdown.RadioGroup value={value} onValueChange={(v) => onValueChange(v as T)}>
      {children}
    </Dropdown.RadioGroup>
  );
}

export function MenuRadio({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Dropdown.RadioItem value={value} className={item}>
      <span className="grid size-4 shrink-0 place-items-center">
        <Dropdown.ItemIndicator>
          <IconCheck size={14} strokeWidth={2.5} className="text-cobalt" />
        </Dropdown.ItemIndicator>
      </span>
      {children}
    </Dropdown.RadioItem>
  );
}

export function MenuItem({ onSelect, disabled, children }: { onSelect: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Dropdown.Item onSelect={onSelect} disabled={disabled} className={cn(item, "[&>svg]:text-ink-2")}>
      {children}
    </Dropdown.Item>
  );
}
