import Link from "next/link";
import { cn } from "@/lib/cn";
import { IconArrowRight } from "@/components/icons";

/*
 * Landing-page primitives. Surfaces are told apart by fill alone: no trays,
 * outlines or resting shadows. One radius for surfaces (20px), one for
 * actions (8px).
 */

type Tone = "white" | "navy" | "ice" | "brand" | "sun" | "mist";

const fill: Record<Tone, string> = {
  white: "bg-white text-ink",
  mist: "bg-[#f3f5f9] text-ink",
  navy: "bg-navy text-white",
  ice: "bg-brand-wash text-ink",
  brand: "bg-brand text-white",
  sun: "bg-sun text-navy",
};

/** A filled surface. `className` places it; `coreClassName` lays out its content. */
export function Surface({
  tone = "white",
  className,
  coreClassName,
  children,
}: {
  tone?: Tone;
  className?: string;
  coreClassName?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("relative overflow-hidden rounded-[20px]", fill[tone], className, coreClassName)}>{children}</div>;
}

type Variant = "primary" | "light" | "dark" | "quiet" | "quietDark";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong",
  light: "bg-white text-navy hover:bg-brand-wash",
  dark: "bg-navy text-white hover:bg-navy-2",
  quiet: "bg-navy/[0.06] text-ink hover:bg-navy/[0.1]",
  quietDark: "bg-white/10 text-white hover:bg-white/[0.16]",
};

/** The page's one button shape: 48px tall, 8px corners, arrow inline when it leads somewhere. */
export function ActionLink({
  href,
  children,
  variant = "primary",
  arrow = true,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-12 items-center gap-2 rounded-[8px] px-6 text-[16px] font-semibold whitespace-nowrap transition-[background-color,transform] duration-200 active:scale-[0.98]",
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow && <IconArrowRight size={17} strokeWidth={1.75} />}
    </Link>
  );
}
