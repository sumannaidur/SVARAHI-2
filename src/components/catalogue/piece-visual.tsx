import { publicAsset } from "@/lib/assets";
import type { Piece } from "@/content/catalogue";
import { Picture } from "../media/picture";

/**
 * A piece's visual inside a temple arch.
 * - Cleared representative image → shown with "Style reference · not the actual piece".
 * - Otherwise → the photograph-to-follow state (never an AI image, never a fake angle).
 */
export function PieceVisual({ piece, sizes, priority = false, large = false }: { piece: Piece; sizes: string; priority?: boolean; large?: boolean }) {
  if (!piece.image) return <PhotoToFollow piece={piece} large={large} />;
  const a = publicAsset(piece.image);
  return (
    <div className="arch relative aspect-[4/5] w-full overflow-hidden ring-1 ring-gold/30" style={{ backgroundColor: a.dominant }}>
      <Picture asset={a} sizes={sizes} priority={priority} className="absolute inset-0" imgClassName="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-velvet)] group-hover:scale-[1.05]" />
      <span className={`absolute bottom-3 left-1/2 w-max max-w-[90%] -translate-x-1/2 bg-velvet/75 px-2 py-1 text-center font-semibold uppercase leading-tight tracking-[0.14em] text-ivory/80 backdrop-blur-sm ${large ? "text-[10px]" : "text-[8.5px]"}`}>
        Style reference · not the actual piece
      </span>
    </div>
  );
}

export function PhotoToFollow({ piece, large = false }: { piece: Piece; large?: boolean }) {
  const mark = publicAsset("brand-svarahi-mark");
  return (
    <div
      role="img"
      aria-label={`${piece.name} — Svarahi's photograph of this piece is to follow`}
      className="arch relative flex aspect-[4/5] w-full flex-col items-center justify-center overflow-hidden ring-1 ring-gold/30"
      style={{ background: "radial-gradient(70% 55% at 50% 42%, #3a0c16 0%, #140608 80%)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small decorative brand mark from the asset library */}
      <img src={`${mark.path}-${mark.widths[0]}.png`} alt="" aria-hidden width={240} height={240} loading="lazy" className={`${large ? "w-28" : "w-16"} opacity-25`} />
      <p className={`mt-5 font-display italic text-gold-soft/80 ${large ? "text-2xl" : "text-base"}`}>Photograph to follow</p>
      <p className={`mt-1 tracking-[0.16em] text-ivory/60 ${large ? "text-xs" : "text-[10px]"}`}>{piece.code}</p>
    </div>
  );
}
