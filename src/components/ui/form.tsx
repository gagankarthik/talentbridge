"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export function Checkbox({ checked, onCheckedChange, id, label, count, muted }: { checked: boolean; onCheckedChange: (v: boolean) => void; id: string; label: React.ReactNode; count?: number; muted?: boolean }) {
  return (
    <label htmlFor={id} className={cn("group flex cursor-pointer items-center gap-2.5 rounded-[5px] py-1 text-[13px] text-ink-2 select-none", muted && "opacity-45")}>
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="grid size-4 shrink-0 place-items-center rounded-[4px] bg-surface ring-1 ring-inset ring-line-strong group-hover:ring-faint data-[state=checked]:bg-cobalt data-[state=checked]:ring-cobalt"
      >
        <CheckboxPrimitive.Indicator>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5.5 12.5 4 4 9-9.5" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && <span className="tnum text-xs text-faint">{count}</span>}
    </label>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** "md" for dense app screens, "lg" for marketing forms */
  inputSize?: "md" | "lg";
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, inputSize = "md", ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full bg-surface text-ink ring-1 ring-inset ring-line-strong placeholder:text-faint focus:ring-2 focus:ring-cobalt focus:outline-none",
        inputSize === "md" ? "h-9 rounded-ctl px-3 text-sm" : "h-11 rounded-[12px] px-3.5 text-[15px]",
        className,
      )}
      {...rest}
    />
  );
});

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: React.ReactNode; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-[13px] font-medium text-ink-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-subtle">{hint}</p>}
    </div>
  );
}

/** Segmented control for small mutually exclusive sets (view mode, rate basis). */
export function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: React.ReactNode; title?: string }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex h-8 rounded-ctl bg-placed-bg p-0.5 ring-1 ring-inset ring-line">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[5px] px-2.5 text-xs font-medium transition-colors",
            value === o.value ? "bg-surface text-ink shadow-[0_1px_2px_rgb(15_23_42/0.08)] ring-1 ring-line" : "text-subtle hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
