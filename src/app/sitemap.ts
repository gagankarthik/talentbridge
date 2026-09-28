import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/company";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/recruiters", priority: 0.8 },
    { path: "/company", priority: 0.6 },
    { path: "/careers", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, priority: 0.8 })),
  ];
  return pages.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, changeFrequency: "monthly", priority: p.priority }));
}
