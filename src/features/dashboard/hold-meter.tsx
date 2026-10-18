import { formatCountdown, LOCK_HOURS } from "@/lib/format";
import { cn } from "@/lib/cn";
import { StatusText } from "@/components/ui/status-text";

/** Under this much time left a hold is urgent: amber text and an amber bar. */
export const URGENT_MS = 6 * 3_600_000;

/**
 * Time left on a 48-hour hold: the countdown as text, then a 6px bar of the time
 * remaining. Blue while healthy; amber (dot + text and bar) once under 6 hours.
 * The bar never drops below 8% wide so an expiring hold stays visible.
 */
export function HoldMeter({ left, className }: { left: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (left / (LOCK_HOURS * 3_600_000)) * 100));
  const urgent = left < URGENT_MS;
  return (
    <span className={cn("flex w-full flex-col items-end gap-1.5", className)}>
      {urgent ? (
        <StatusText tone="warning" className="tnum">
          {formatCountdown(left)} left
        </StatusText>
      ) : (
        <span className="tnum text-[13px] font-medium text-ink">{formatCountdown(left)} left</span>
      )}
      <span
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={`${Math.round(pct)}% of the 48-hour hold left`}
        className="block h-1.5 w-full overflow-hidden rounded-full bg-[#e4e8ee]"
      >
        <span className={cn("block h-full rounded-full", urgent ? "bg-[#c98a1b]" : "bg-cobalt")} style={{ width: `${Math.max(8, pct)}%` }} />
      </span>
    </span>
  );
}
