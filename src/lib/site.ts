/**
 * Site-level settings for metadata, sitemap and robots.
 * SITE_URL: set NEXT_PUBLIC_SITE_URL when a real domain is approved; until then
 * absolute URLs (Open Graph, sitemap) point at the local dev server.
 * INDEXABLE stays false until the owner approves launch — this is the single
 * switch behind both the noindex meta tag and robots.txt.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3200";
export const INDEXABLE = false;

/** Public, customer-facing routes (internal QA pages such as /direction are excluded). */
export const STATIC_ROUTES = ["/", "/collections", "/bridal", "/counter", "/craft", "/reels", "/visit", "/gold"] as const;

/** Full Open Graph block for a page (a page-level openGraph replaces the root one, so include everything). */
export const og = (title: string, url: string) => ({
  type: "website" as const,
  siteName: "Svarahi",
  locale: "en_IN",
  title,
  url,
  images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Svarahi — Jewellery straight from manufacturers, Jayanagar, Bengaluru" }],
});
