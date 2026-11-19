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
          <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block hover:text-gold-soft">Instagram @svarahijewels ↗</a>
        </div>
        <div>
          <p className="eyebrow text-gold-soft">About the imagery</p>
          <p className="mt-3 leading-relaxed">
            Photographs on this page are licensed editorial imagery, showroom inspiration or AI-generated editorial concepts. None shows Svarahi&apos;s
            actual jewellery, customers or showroom. Ask us on WhatsApp for photographs of current pieces.
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold-soft">Photography credits</p>
          <p className="mt-3 leading-relaxed">Unsplash: {credits.map((c) => `@${c}`).join(", ")}.</p>
        </div>
      </div>
      <p className="shell mt-12 text-[11px] text-ivory/35">Development build — not published. © 2026 Svarahi, Bengaluru.</p>
    </footer>
  );
}
