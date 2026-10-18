"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

/** Square checkbox with an optional label and trailing count (filter lists). */
export function Checkbox({
  checked,
  onCheckedChange,
  id,
  label,
  count,
  muted,
  className,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id: string;
  label?: React.ReactNode;
  count?: number;
  muted?: boolean;
  className?: string;
}) {
  const box = (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={(v) => onCheckedChange(v === true)}
      aria-label={label ? undefined : "Select"}
      className="grid size-4 shrink-0 place-items-center rounded-[4px] bg-surface shadow-[0_0_0_1px_var(--color-control)] transition-[background-color,box-shadow] duration-150 ease-power3-out outline-none group-hover:shadow-[0_0_0_1px_var(--color-muted)] focus-visible:ring-2 focus-visible:ring-cobalt/40 data-[state=checked]:bg-cobalt data-[state=checked]:shadow-[0_0_0_1px_var(--color-cobalt)]"
    >
      <CheckboxPrimitive.Indicator>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5.5 12.5 4 4 9-9.5" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  if (!label) return box;
  return (
    <label htmlFor={id} className={cn("group flex cursor-pointer items-center gap-2.5 rounded-[6px] py-1 text-[14px] text-ink-2 select-none", muted && "opacity-60", className)}>
      {box}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && <span className="tnum text-[12px] text-faint">{count}</span>}
    </label>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** "md" for app screens (36px), "lg" for marketing forms (44px) */
  inputSize?: "md" | "lg";
};

/** Text input. App size: 36px, rounded-lg, hairline ring, cobalt focus ring; invalid via aria-invalid. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, inputSize = "md", ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full bg-surface text-ink ring-1 ring-inset ring-control transition-shadow duration-150 ease-power3-out placeholder:text-subtle focus:ring-2 focus:ring-cobalt focus:outline-none aria-[invalid=true]:ring-tag-red-text",
        inputSize === "md" ? "h-9 rounded-md px-3 text-[14px]" : "h-11 rounded-md px-3.5 text-[15px]",
        className,
      )}
      {...rest}
    />
  );
});

/** Multi-line companion to Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-md bg-surface px-3 py-2 text-[14px] text-ink ring-1 ring-inset ring-control placeholder:text-subtle focus:ring-2 focus:ring-cobalt focus:outline-none",
        className,
      )}
      {...rest}
    />
  );
});

/**
 * Label + control + hint/error. `required` adds a muted asterisk; `error`
 * replaces the hint and is announced (role="alert").
 */
export function Field({
  label,
  hint,
  error,
  required,
  children,
  htmlFor,
  className,
}: {
  label: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-[13px] font-medium text-ink-2">
        {label}
        {required && <span className="ml-0.5 text-faint">*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-[12.5px] text-tag-red-text">
          {error}
        </p>
      ) : (
        hint && <p className="text-[12.5px] text-subtle">{hint}</p>
      )}
    </div>
  );
}

/** Segmented control for small mutually exclusive sets (view mode, rate basis). 30px, pill track. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode; title?: string }[];
  label: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex h-9 items-center rounded-md bg-[#eceff3] p-[3px]", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-[30px] items-center gap-1.5 rounded px-3 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-150 ease-power3-out",
            value === o.value ? "bg-surface font-semibold text-ink shadow-[0_1px_2px_rgb(11_27_51/0.12)]" : "text-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
