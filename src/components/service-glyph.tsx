import { cn } from "@/lib/cn";
import { ACCENT, serviceBySlug, type ServiceSlug } from "@/lib/company";

// Service marks: one bespoke 32px drawing per service. Ink structure,
// the service's accent marks the part of the drawing that is the service.

const I = "var(--glyph-ink)";
const A = "currentColor";

const GLYPHS: Record<ServiceSlug, React.ReactNode> = {
  "contract-staffing": (
    <>
      <circle cx="13" cy="10" r="4.5" stroke={I} />
      <path d="M4.5 26c.8-5 4.2-8 8.5-8 2 0 3.8.6 5.2 1.8" stroke={I} />
      <circle cx="23" cy="22" r="5.5" stroke={A} />
      <path d="M23 19.2V22l1.9 1.3" stroke={A} />
    </>
  ),
  "agency-bench-partnerships": (
    <>
      <rect x="4" y="9" width="14" height="17" rx="2" stroke={I} />
      <rect x="14" y="5" width="14" height="17" rx="2" stroke={A} fill="var(--glyph-fill, transparent)" />
      <path d="M17.5 10.5h7M17.5 14h5" stroke={A} />
      <path d="M7.5 21h4" stroke={I} />
    </>
  ),
  "contract-to-hire": (
    <>
      <circle cx="9" cy="10" r="3.5" stroke={I} />
      <path d="M3.5 22c.6-3.8 2.8-6 5.5-6s4.9 2.2 5.5 6" stroke={I} />
      <path d="M14.5 13h6m-2.5-3 3 3-3 3" stroke={A} />
      <path d="M22 26V9.5l5-2.5v19" stroke={A} />
      <path d="M3 26h25" stroke={I} />
    </>
  ),
  "dedicated-delivery-teams": (
    <>
      <circle cx="16" cy="9" r="3.5" stroke={A} />
      <circle cx="7.5" cy="14" r="3" stroke={I} />
      <circle cx="24.5" cy="14" r="3" stroke={I} />
      <path d="M10.5 26c.6-4.4 2.7-7 5.5-7s4.9 2.6 5.5 7" stroke={A} />
      <path d="M3 25c.4-3.3 2-5.2 4.5-5.2M29 25c-.4-3.3-2-5.2-4.5-5.2" stroke={I} />
    </>
  ),
  "compliance-and-onboarding": (
    <>
      <path d="M8 4.5h11l5 5V27H8z" stroke={I} />
      <path d="M19 4.5v5h5" stroke={I} />
      <path d="M11.5 13h7M11.5 17h4" stroke={I} />
      <path d="M22 17.5 17 19.5v3.7c0 3 2.1 5.3 5 6.3 2.9-1 5-3.3 5-6.3v-3.7z" stroke={A} fill="var(--color-surface)" />
      <path d="m19.8 23.4 1.6 1.6 2.9-3.1" stroke={A} />
    </>
  ),
  "technical-vetting": (
    <>
      <rect x="3.5" y="6" width="25" height="18" rx="2" stroke={I} />
      <path d="m10.5 12-3 3 3 3M17 12l3 3-3 3" stroke={I} />
      <circle cx="24.5" cy="23.5" r="5" stroke={A} fill="var(--color-surface)" />
      <path d="m22.4 23.6 1.5 1.5 2.7-2.9" stroke={A} />
    </>
  ),
};

export function ServiceGlyph({ slug, size = 40, tone = "light", className }: { slug: ServiceSlug; size?: number; tone?: "light" | "dark" | "white"; className?: string }) {
  const acc = ACCENT[serviceBySlug.get(slug)!.accent];
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-[11px]",
        tone === "light" && cn(acc.bg, acc.text, "ring-1", acc.ring, "[--glyph-ink:var(--color-ink-2)]"),
        tone === "white" && cn("bg-white", acc.text, "[--glyph-ink:var(--color-ink-2)]"),
        tone === "dark" && "bg-white/[0.07] text-sky ring-1 ring-white/10 [--glyph-ink:#e2e8f0]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 32 32" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {GLYPHS[slug]}
      </svg>
    </span>
  );
}
