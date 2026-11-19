import Link from "next/link";
import { business } from "@/content/business";
import manifest from "@/content/asset-manifest.json";

/** Footer with full image-source disclosure (Unsplash credits are appreciated, not required). */
export function Footer() {
  const credits = [...new Set(manifest.assets.filter((a) => a.publicUse && a.licence === "Unsplash License").map((a) => a.publisher.replace("Unsplash — ", "")))];
  return (
    <footer className="bg-velvet pb-28 pt-16 text-ivory/60 lg:pb-12">
      <div className="shell grid gap-10 text-sm md:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-[0.3em] text-ivory">SVARAHI</p>
          <p className="mt-3">{business.positioning}. Jayanagar, Bengaluru.</p>
          <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center hover:text-gold-soft">Instagram @svarahijewels ↗</a>
          <nav aria-label="Footer" className="mt-4 flex flex-wrap gap-x-5 text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
            {[["/collections", "Collections"], ["/bridal", "Bridal"], ["/counter", "The counter"], ["/craft", "Craft"], ["/reels", "Reels"], ["/visit", "Visit"], ["/gold", "Svarahi Gold"]].map(([h, l]) => (
              <Link key={h} href={h} className="inline-flex min-h-11 items-center hover:text-gold-soft">{l}</Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="eyebrow text-gold-soft">About the imagery</p>
          <p className="mt-3 leading-relaxed">
            Photographs hosted on this site are licensed editorial imagery, showroom inspiration or AI-generated editorial concepts. None shows Svarahi&apos;s
            actual jewellery, customers or showroom. Instagram posts and reels are Svarahi&apos;s own, shown through Instagram&apos;s official embed. Ask us on WhatsApp for photographs of current pieces.
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold-soft">Photography credits</p>
          <p className="mt-3 leading-relaxed">Unsplash: {credits.map((c) => `@${c}`).join(", ")}.</p>
        </div>
      </div>
      <p className="shell mt-12 text-[11px] text-ivory/60">Development build — not published. © 2026 Svarahi, Bengaluru.</p>
    </footer>
  );
}
