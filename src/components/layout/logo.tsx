import Link from "next/link";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/icons";

/** Primary lockup: deck-and-arch mark + wordmark in the brand face. */
export function Logo({ tone = "ink", href = "/", className }: { tone?: "ink" | "white"; href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 font-brand", tone === "ink" ? "text-ink" : "text-white", className)} aria-label="TalentBridge home">
      <LogoMark size={26} className={tone === "ink" ? "text-brand" : "text-signal"} />
      <span className="text-[19px] leading-none font-semibold tracking-[-0.035em]">TalentBridge</span>
    </Link>
  );
}
