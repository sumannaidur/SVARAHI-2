import type { CSSProperties } from "react";
import { captionFor, fallback, srcSet, type Asset } from "@/lib/assets";

/** Responsive AVIF/WebP picture from the v2 asset library, with intrinsic size (no CLS). */
export function Picture({
  asset,
  sizes,
  priority = false,
  className = "",
  imgClassName = "",
  style,
}: {
  asset: Asset;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
}) {
  return (
    <picture className={className}>
      {asset.formats
        .filter((f) => f === "avif" || f === "webp")
        .map((f) => (
          <source key={f} type={`image/${f}`} srcSet={srcSet(asset, f)} sizes={sizes} />
        ))}
      <img
        src={fallback(asset)}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={imgClassName}
        // Dominant-colour backdrop while loading — but never behind transparent logo artwork.
        style={{ backgroundColor: asset.formats.includes("png") ? undefined : asset.dominant, ...style }}
      />
    </picture>
  );
}

/** Discreet provenance caption (groups C, D, E) — never omitted on customer pages. */
export function Provenance({ asset, className = "" }: { asset: Asset; className?: string }) {
  const text = captionFor(asset);
  if (!text) return null;
  return (
    <span className={`pointer-events-none inline-block bg-velvet/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory/75 backdrop-blur-sm ${className}`}>
      {text}
    </span>
  );
}
