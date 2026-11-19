"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Asset } from "@/lib/assets";
import { Picture, Provenance } from "../media/picture";

/**
 * A jeweller's loupe over a macro photograph. The lens shows the 1920px
 * rendition at 2.4× the displayed size — real detail, not an upscale.
 * Mouse: follows the pointer. Touch: drag. Keyboard: arrow keys (focusable).
 */
export function Loupe({ asset, zoom = 2.4 }: { asset: Asset; zoom?: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0.55, y: 0.45 });
  const [active, setActive] = useState(false);
  const hi = `${asset.path}-${asset.widths[asset.widths.length - 1]}.webp`;

  const fromEvent = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) });
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.1 : 0.03;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d) return;
    e.preventDefault();
    setActive(true);
    setPos((p) => ({ x: Math.min(1, Math.max(0, p.x + d[0])), y: Math.min(1, Math.max(0, p.y + d[1])) }));
  };

  return (
    <figure>
      <div
        ref={frame}
        role="application"
        aria-label="Jeweller's loupe — move the pointer, drag, or use the arrow keys to look closer"
        tabIndex={0}
        onPointerMove={fromEvent}
        onPointerDown={(e) => { setActive(true); fromEvent(e); }}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onKeyDown={onKey}
        className="relative cursor-none touch-none select-none overflow-hidden ring-1 ring-gold/30"
        style={{ aspectRatio: `${asset.width} / ${asset.height}`, backgroundColor: asset.dominant }}
      >
        <Picture asset={asset} sizes="(min-width:1024px) 60vw, 100vw" className="absolute inset-0" imgClassName="pointer-events-none h-full w-full object-cover" />
        <div
          aria-hidden
          className={`pointer-events-none absolute size-[clamp(140px,22vw,260px)] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_20px_60px_-10px_rgb(0_0_0/0.8),inset_0_0_0_3px_rgb(212_169_79),inset_0_0_30px_rgb(0_0_0/0.4)] transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
          style={{
            left: `${pos.x * 100}%`,
            top: `${pos.y * 100}%`,
            backgroundImage: `url(${hi})`,
            backgroundSize: `${zoom * 100}% auto`,
            backgroundPosition: `${pos.x * 100}% ${pos.y * 100}%`,
            backgroundRepeat: "no-repeat",
          }}
        />
        {!active && (
          <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-velvet/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft">
            Hover, drag or use arrow keys to look closer
          </span>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ivory/55">
        <span>Magnified {zoom}× from the full-resolution photograph.</span>
        <Provenance asset={asset} className="!bg-transparent !px-0" />
      </figcaption>
    </figure>
  );
}
