import { igPost } from "@/content/catalogue";

/**
 * Svarahi's own Instagram post via Instagram's official embed — real Svarahi
 * jewellery, kept on Instagram with attribution (no media copied). Lazy-loaded
 * and sized exactly (embed height = 1.25 × width + 208px) so it never scrolls.
 */
export function InstagramEmbed({ code }: { code: string }) {
  const p = igPost(code);
  if (!p) return null;
  const kind = p.type === "reel" ? "reel" : "p";
  return (
    <figure>
      <div className="@container relative overflow-hidden bg-oxblood ring-1 ring-gold/25">
        <iframe
          src={`https://www.instagram.com/${kind}/${p.code}/embed/`}
          title={`Svarahi on Instagram: ${p.subject}`}
          loading="lazy"
          scrolling="no"
          referrerPolicy="strict-origin-when-cross-origin"
          className="block w-full border-0"
          style={{ height: "calc(125cqw + 208px)" }}
        />
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-3 text-[13px] leading-snug text-ivory/65">
        <span>{p.subject}</span>
        <a href={`https://www.instagram.com/${kind}/${p.code}/`} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-soft hover:underline">
          {p.type === "reel" ? "Reel" : "Post"} ↗
        </a>
      </figcaption>
    </figure>
  );
}
