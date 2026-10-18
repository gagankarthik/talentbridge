import { availabilityOf } from "@/lib/format";
import type { Candidate } from "@/lib/types";
import { StatusDot, type StatusTone } from "./status-dot";

/** Dot-plus-text status (alias of StatusDot) for workspace screens. */
export { StatusDot as StatusText, type StatusTone };

/** Availability as dot + text. Only "Immediate" carries colour; a later start is not a warning, so it stays neutral. */
export function AvailabilityText({ c, className }: { c: Pick<Candidate, "availability" | "availableFrom">; className?: string }) {
  const a = availabilityOf(c);
  return (
    <StatusDot tone={a.tone === "avail" ? "success" : "neutral"} className={className}>
      {a.label}
    </StatusDot>
  );
}
