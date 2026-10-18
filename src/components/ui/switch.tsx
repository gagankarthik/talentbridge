"use client";

import * as Toggle from "@radix-ui/react-checkbox";
import { cn } from "@/lib/cn";

/**
 * On/off switch for settings rows: 36×20 pill track, cobalt when on, white knob
 * that slides with the app easing. Built on the Radix checkbox (role="checkbox"),
 * so it needs an accessible `label`.
 */
export function Switch({ checked, onChange, label, className }: { checked: boolean; onChange: (v: boolean) => void; label: string; className?: string }) {
  return (
    <Toggle.Root
      checked={checked}
      onCheckedChange={(v) => onChange(v === true)}
      aria-label={label}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full bg-line-strong transition-colors duration-150 ease-power3-out outline-none focus-visible:ring-2 focus-visible:ring-cobalt/40 data-[state=checked]:bg-cobalt",
        className,
      )}
    >
      <span className={cn("absolute top-0.5 left-0.5 size-4 rounded-full bg-surface shadow-[0_1px_2px_rgb(11_27_51/0.25)] transition-transform duration-150 ease-power3-out", checked && "translate-x-4")} />
    </Toggle.Root>
  );
}

/** Settings row: title and one line of explanation on the left, the control on the right. */
export function SettingRow({ title, description, children }: { title: React.ReactNode; description?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 [&+&]:border-t [&+&]:border-hair">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-ink">{title}</p>
        {description && <p className="mt-0.5 max-w-[56ch] text-[12.5px] leading-snug text-subtle">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
