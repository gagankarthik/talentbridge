import Link from "next/link";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/icons";

/** Primary lockup: bridge mark + wordmark. Mark sits on the cap height. */
export function Logo({ tone = "ink", href = "/", className }: { tone?: "ink" | "white"; href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", tone === "ink" ? "text-ink" : "text-white", className)} aria-label="TalentBridge home">
      <span className={cn("grid size-8 place-items-center rounded-[8px]", tone === "ink" ? "bg-night text-brand-bright" : "bg-brand-bright text-night")}>
        <LogoMark size={20} />
      </span>
      <span className="text-[16px] font-semibold tracking-[-0.02em]">
        TalentBridge
      </span>
    </Link>
  );
}
