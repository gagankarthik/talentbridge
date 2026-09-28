import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Public marketing pages are indexable; the partner portal and API are not.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/talent", "/shortlist", "/requests", "/ops", "/one-sheet", "/settings", "/help", "/login", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
