"use client";

import { useRef, useState, type PointerEvent } from "react";
import { publicAsset } from "@/lib/assets";
import type { Piece } from "@/content/catalogue";
import { Picture } from "../media/picture";
import { PhotoToFollow } from "./piece-visual";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * Large piece visual. Arch iris + gold light sweep on arrival (GSAP; skipped
 * under reduced motion). Hover/tap zoom only when a real image exists. One
 * image = one view: no simulated angles and no fake 360°.
 */
export function PieceStage({ piece }: { piece: Piece }) {
  const root = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const a = piece.image ? publicAsset(piece.image) : null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const intro = () => {
        gsap.fromTo("[data-stage-frame]", { clipPath: "inset(40% 25% 0% 25% round 999px 999px 0px 0px)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)", duration: 1.4, ease: "power3.inOut" });
        gsap.fromTo("[data-stage-sweep]", { xPercent: -150 }, { xPercent: 420, duration: 2.2, ease: "power2.inOut", delay: 0.6 });
      };
      mm.add(MQ.desktop, intro);
      mm.add(MQ.mobile, intro);
    },
    { scope: root },
  );

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div ref={root}>
      <div data-stage-frame className="arch relative overflow-hidden">
        {a ? (
          <div
            role="button"
            tabIndex={0}
            aria-label={zoom ? "Zoom out" : "Zoom in on the image"}
            aria-pressed={zoom}
            onClick={() => setZoom((z) => !z)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setZoom((z) => !z))}
            onPointerMove={move}
            onPointerLeave={(e) => e.pointerType === "mouse" && setZoom(false)}
            className={`relative aspect-[4/5] ring-1 ring-gold/30 ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            style={{ backgroundColor: a.dominant }}
          >
            <Picture
              asset={a}
              sizes="(min-width:1024px) 50vw, 100vw"
              priority
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-velvet)]"
              style={{ transform: zoom ? "scale(2.2)" : "scale(1)", transformOrigin: origin }}
            />
          </div>
        ) : (
          <PhotoToFollow piece={piece} large />
        )}
        {/* Outside the zoom button so the button's accessible name matches its visible content; the same disclosure is also read from the paragraph below. */}
        {a && (
          <span aria-hidden className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap bg-velvet/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/85">
            Style reference · not the actual piece
          </span>
        )}
        <div aria-hidden data-stage-sweep className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[150%] mix-blend-soft-light" style={{ background: "linear-gradient(100deg, transparent, rgb(255 230 180 / 0.5), transparent)" }} />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ivory/55">
        {a
          ? "Representative image published on svarahi.co (a licensed stock photograph). It shows the style, not the piece in our showroom. One view only — additional angles have not been photographed."
          : "Svarahi's own photograph of this piece is being prepared. Ask on WhatsApp and we'll send current photographs."}
      </p>
    </div>
  );
}
