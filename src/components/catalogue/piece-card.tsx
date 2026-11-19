import Link from "next/link";
import { wa } from "@/content/business";
import { enquiry, getCategory, type Piece } from "@/content/catalogue";
import { PieceVisual } from "./piece-visual";
import { PlaceOnTray } from "../tray/tray-ui";

/** Editorial piece card: arch visual, catalogue name + code, view + WhatsApp. */
export function PieceCard({ piece, sizes = "(min-width:1024px) 24vw, 70vw" }: { piece: Piece; sizes?: string }) {
  const cat = getCategory(piece.category);
  return (
    <article className="group relative">
      <Link href={`/pieces/${piece.slug}`} className="block">
        <PieceVisual piece={piece} sizes={sizes} />
        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-gold/25 pt-3">
          <p className="eyebrow !text-[0.6rem] text-ivory/55">{cat?.name}</p>
          <p className="text-[10px] tracking-[0.16em] text-ivory/60">{piece.code}</p>
        </div>
        <h3 className="mt-1.5 font-display text-[1.45rem] leading-tight transition-colors group-hover:text-gold-soft">{piece.name}</h3>
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <a href={wa(enquiry(piece))} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-gold-soft hover:underline">
          Enquire ↗
        </a>
        <PlaceOnTray piece={piece} compact />
      </div>
    </article>
  );
}
