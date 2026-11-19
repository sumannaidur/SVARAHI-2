import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/site";

/** Blocks all crawling until launch is approved (INDEXABLE in src/lib/site.ts). */
export default function robots(): MetadataRoute.Robots {
  return INDEXABLE
    ? { rules: { userAgent: "*", allow: "/", disallow: ["/direction"] }, sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
