import { cn } from "@/lib/cn";
import { freshnessDays, FRESHNESS_WINDOW_DAYS, relativeAgo } from "@/lib/format";

/**
 * The 7-day availability verification window (PRD KPI: profile freshness).
 * Each tick is one day of remaining validity; an empty meter means the
 * candidate must re-confirm before they can be submitted.
 */
export function FreshnessMeter({ lastVerifiedAt, compact, className }: { lastVerifiedAt: string; compact?: boolean; className?: string }) {
  const days = freshnessDays(lastVerifiedAt);
  const remaining = Math.max(0, FRESHNESS_WINDOW_DAYS - days);
  const tone = remaining === 0 ? "bg-flag" : remaining <= 2 ? "bg-notice" : "bg-avail";
  const label = remaining === 0 ? "Re-verification due" : `Verified ${relativeAgo(lastVerifiedAt)}`;
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      title={`Availability confirmed ${relativeAgo(lastVerifiedAt)}. ${remaining} of ${FRESHNESS_WINDOW_DAYS} days left in the verification window.`}
    >
      <span className="flex items-end gap-[2px]" role="img" aria-label={`${remaining} of ${FRESHNESS_WINDOW_DAYS} days of verification remaining`}>
        {Array.from({ length: FRESHNESS_WINDOW_DAYS }, (_, i) => (
          <span key={i} className={cn("w-[3px] rounded-[1px]", compact ? "h-2.5" : "h-3", i < remaining ? tone : "bg-line")} />
        ))}
      </span>
      {!compact && <span className={cn("text-xs tnum", remaining === 0 ? "text-flag-ink font-medium" : "text-subtle")}>{label}</span>}
    </span>
  );
}
