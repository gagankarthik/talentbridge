import { forwardRef } from "react";
import { cn } from "@/lib/cn";

/**
 * App buttons, enterprise register: 6px rectangles, semibold labels, flat fills,
 * 150ms colour transitions. Sizes: sm 32px (toolbars, table actions), md 36px
 * (default), lg 40px (primary page actions), icon/icon-sm for square icon buttons.
 * One primary per view. Pass `className` to override; `cn` merges conflicts.
 */
type Variant = "primary" | "secondary" | "ghost" | "dark" | "danger" | "subtle";
type Size = "sm" | "md" | "lg" | "icon" | "icon-sm";

const variants: Record<Variant, string> = {
  /** Solid action blue: the one main action in a view */
  primary: "bg-cobalt text-white hover:bg-cobalt-strong active:bg-[#173a9e] disabled:bg-[#a9bdf1]",
  /** White with a border: everything else */
  secondary: "bg-surface text-ink ring-1 ring-inset ring-line-strong hover:bg-well hover:ring-control active:bg-[#eceff3] disabled:text-subtle disabled:hover:bg-surface",
  /** Canvas fill without a border: tertiary actions inside panels */
  subtle: "bg-well text-ink hover:bg-[#eceff3] disabled:text-subtle",
  ghost: "text-muted hover:bg-well hover:text-ink disabled:text-subtle",
  dark: "bg-ink text-white hover:bg-ink-2 disabled:opacity-60",
  danger: "bg-surface text-flag-ink ring-1 ring-inset ring-tag-red-border hover:bg-flag-bg",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-[13px]",
  md: "h-9 gap-2 px-4 text-[14px]",
  lg: "h-10 gap-2 px-5 text-[14px]",
  icon: "size-8 p-0",
  "icon-sm": "size-7 p-0",
};

const base =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md font-semibold whitespace-nowrap outline-none select-none transition-[background-color,color,box-shadow] duration-150 ease-power3-out focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 disabled:cursor-not-allowed";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className, type = "button", ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={cn(base, variants[variant], sizes[size], className)} {...rest} />;
});

/** Same styling for links and other elements: `<Link className={buttonClass("primary", "sm")}>`. */
export function buttonClass(variant: Variant = "secondary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}
