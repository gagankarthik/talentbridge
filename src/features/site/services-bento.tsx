import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { serviceBySlug, type ServiceSlug } from "@/lib/company";

/**
 * Asymmetric services layout: two photographic tiles for the core
 * engagements, four solid-color tiles for supporting services.
 */
const PHOTO: ServiceSlug[] = ["contract-staffing", "agency-bench-partnerships"];
const SOLID: { slug: ServiceSlug; tone: string; sub: string }[] = [
  { slug: "contract-to-hire", tone: "bg-coral text-white", sub: "text-white/80" },
  { slug: "dedicated-delivery-teams", tone: "bg-night text-white", sub: "text-slate-300" },
  { slug: "compliance-and-onboarding", tone: "bg-sun text-night", sub: "text-night/75" },
  { slug: "technical-vetting", tone: "bg-acc-violet text-white", sub: "text-white/80" },
];

export function ServicesBento() {
  const photo = PHOTO.map((s) => serviceBySlug.get(s)!);
  return (
    <div className="grid gap-4 md:grid-cols-6 lg:grid-cols-12">
      {photo.map((s, i) => (
        <Link
          key={s.slug}
          href={`/services/${s.slug}`}
          className={cn("group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[20px] p-7 text-white", i === 0 ? "md:col-span-4 lg:col-span-8" : "md:col-span-2 lg:col-span-4")}
        >
          <Image src={s.image} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          <span className="absolute inset-0 bg-night/45" />
          <span className="relative">
            <span className="block text-[13.5px] text-white/80">For {s.audience.toLowerCase()}</span>
            <span className="mt-1 block font-display text-[30px] leading-tight font-light tracking-[-0.02em] sm:text-[36px]">{s.name}</span>
            <span className="mt-2 block max-w-md text-[15px] text-white/85">{s.summary}</span>
          </span>
        </Link>
      ))}
      {SOLID.map(({ slug, tone, sub }) => {
        const s = serviceBySlug.get(slug)!;
        return (
          <Link key={slug} href={`/services/${slug}`} className={cn("flex min-h-[240px] flex-col justify-between rounded-[20px] p-7 md:col-span-3", tone)}>
            <span className={cn("text-[13.5px]", sub)}>For {s.audience.toLowerCase()}</span>
            <span>
              <span className="block text-[22px] leading-snug font-semibold tracking-[-0.015em]">{s.name}</span>
              <span className={cn("mt-1.5 block text-[15px] leading-relaxed", sub)}>{s.summary}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
