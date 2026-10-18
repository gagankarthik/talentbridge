import { cn } from "@/lib/cn";

/* Status as the enterprise spec renders it by default: a 6px dot plus text in
   the status colour. Use filled Tags only in a table's status column. Colours
   are the spec's status values, all at least 4.5:1 on white and canvas. */

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

const TONE: Record<StatusTone, { dot: string; text: string }> = {
  success: { dot: "bg-[#1a7f4b]", text: "text-[#1a7f4b]" },
  warning: { dot: "bg-[#c98a1b]", text: "text-[#9a5b00]" },
  danger: { dot: "bg-[#b42318]", text: "text-[#b42318]" },
  neutral: { dot: "bg-[#8792a6]", text: "text-[#5f6b80]" },
  info: { dot: "bg-[#2558e0]", text: "text-[#2558e0]" },
};

export function StatusDot({ tone, children, className, title }: { tone: StatusTone; children: React.ReactNode; className?: string; title?: string }) {
  return (
    <span title={title} className={cn("inline-flex min-w-0 items-center gap-2 text-[13px] font-medium whitespace-nowrap", TONE[tone].text, className)}>
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", TONE[tone].dot)} />
      <span className="truncate">{children}</span>
    </span>
  );
}
