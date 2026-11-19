import type { MetadataRoute } from "next";
import { categories, pieces } from "@/content/catalogue";
import { SITE_URL, STATIC_ROUTES } from "@/lib/site";

/** Customer-facing routes only. Ready for launch; robots.txt does not advertise it until INDEXABLE. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${SITE_URL}${p === "/" ? "" : p}`;
  return [
    ...STATIC_ROUTES.map((p) => ({ url: url(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...categories.map((c) => ({ url: url(`/collections/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...pieces.map((p) => ({ url: url(`/pieces/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
