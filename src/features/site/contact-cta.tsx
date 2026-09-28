import Link from "next/link";
import { cn } from "@/lib/cn";
import { cta } from "@/components/site/styles";

/** Primary contact CTA. Always a full-page navigation to /contact, never a dialog. */
export function ContactCta({ label = "Get in touch", variant = "primary", className, topic }: { label?: string; variant?: keyof typeof cta; className?: string; topic?: string }) {
  return (
    <Link href={topic ? `/contact?topic=${encodeURIComponent(topic)}` : "/contact"} className={cn(cta[variant], className)}>
      {label}
    </Link>
  );
}
