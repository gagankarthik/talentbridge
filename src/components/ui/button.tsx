import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-cobalt text-white hover:bg-cobalt-strong disabled:bg-cobalt/50",
  secondary: "bg-surface text-ink ring-1 ring-inset ring-line-strong hover:bg-canvas hover:ring-faint disabled:text-faint",
  ghost: "text-muted hover:bg-placed-bg hover:text-ink disabled:text-faint",
  dark: "bg-ink text-white hover:bg-ink-2 disabled:bg-ink/50",
  danger: "bg-surface text-flag-ink ring-1 ring-inset ring-flag/40 hover:bg-flag-bg",
};

const sizes: Record<Size, string> = {
  sm: "h-7 px-2.5 text-xs gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-ctl font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    />
  );
});

export function buttonClass(variant: Variant = "secondary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-ctl font-medium whitespace-nowrap transition-colors",
    variants[variant],
    sizes[size],
    className,
  );
}
