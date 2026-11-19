"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { wa } from "@/content/business";
import { publicAsset, captionFor } from "@/lib/assets";
import { Picture } from "../media/picture";
import { gsap, useGSAP } from "../motion/gsap";

/**
 * Bridal & heritage looks on a curved arch carousel — the arches stand on a
 * CSS-3D cylinder and GSAP turns it. Drag, arrows or the buttons; the active
 * look is lit, the rest recede. Images are licensed editorial photography or
 * AI concepts (each captioned) — style references, never Svarahi inventory.
 */
const LOOKS = [
  { img: "ux-bridal-red-choker", t: "Choker with layered haram", n: "A close choker anchors the neckline; longer layers fall over the blouse." },
  { img: "ux-bridal-kundan-smile", t: "Kundan set with maang tikka", n: "Kundan necklace and matching tikka — a complete set chosen together." },
  { img: "ux-bridal-red-veil", t: "Gold layers under the veil", n: "Several graduated gold necklaces, worn so each length shows." },
  { img: "ai-lookbook-bridal-001", t: "Temple bridal set", n: "Temple choker, long haram, jhumkas and tikka on deep maroon." },
  { img: "ux-bridal-kundan-choker", t: "Kundan choker & chandbalis", n: "A wide kundan choker balanced by crescent-shaped chandbali earrings." },
  { img: "ux-festive-temple-haar", t: "Long temple haar", n: "One long temple necklace over silk — a reception or muhurtham look." },
  { img: "ai-lookbook-heritage-001", t: "Heritage choker & pendant", n: "An antique-finish choker with ruby and emerald drops." },
  { img: "ux-bridal-maang-tikka", t: "Pearl maang tikka", n: "Pearl and kundan detailing that softens a heavy set." },
  { img: "ux-bridal-gold-layers", t: "Layers with a nath", n: "Layered gold with a nose ring — traditional and complete." },
];
const STEP = 360 / LOOKS.length;

export function ArchCarousel() {
  const [turn, setTurn] = useState(0); // unbounded, so the ring always takes the short way round
  const ring = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; base: number } | null>(null);
  const n = LOOKS.length;
  const i = ((turn % n) + n) % n;
  const look = LOOKS[i];
  const a = publicAsset(look.img);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(ring.current, { rotationY: -turn * STEP, duration: reduce ? 0 : 1.1, ease: "power3.out", overwrite: true });
    },
    { scope: root, dependencies: [turn] },
  );

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); setTurn((t) => t - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); setTurn((t) => t + 1); }
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, base: turn };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    gsap.set(ring.current, { rotationY: -drag.current.base * STEP + dx * 0.18 });
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const base = drag.current.base;
    drag.current = null;
    const steps = Math.round((-dx * 0.18) / STEP);
    if (steps === 0) gsap.to(ring.current, { rotationY: -base * STEP, duration: 0.5, ease: "power2.out" });
    else setTurn(base + steps);
  };

  return (
    <div ref={root} role="region" aria-roledescription="carousel" aria-label="Bridal and heritage looks" onKeyDown={onKey}>
      <div
        className="relative mx-auto h-[clamp(300px,52vw,560px)] cursor-grab touch-pan-y select-none overflow-hidden [perspective:1800px] active:cursor-grabbing"
        style={{ ["--w" as string]: "clamp(180px,24vw,340px)" }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div ref={ring} className="absolute inset-x-0 top-[4%] mx-auto h-full w-[var(--w)] [transform-style:preserve-3d]" style={{ transformOrigin: "50% 50% calc(var(--w) * -1.62)" }}>
          {LOOKS.map((l, k) => {
            const img = publicAsset(l.img);
            const on = k === i;
            return (
              <figure
                key={l.img}
                aria-hidden={!on}
                className="absolute inset-x-0 top-0 aspect-[3/4] [backface-visibility:hidden]"
                style={{ transform: `rotateY(${k * STEP}deg)`, transformOrigin: "50% 50% calc(var(--w) * -1.62)" }}
              >
                <div className={`arch relative h-full w-full ring-1 transition-[opacity,filter] duration-700 ${on ? "opacity-100 ring-gold/60" : "opacity-35 ring-gold/20 motion-safe:blur-[1.5px]"}`}>
                  <Picture asset={img} sizes="(min-width:1024px) 24vw, 50vw" className="absolute inset-0" imgClassName="pointer-events-none h-full w-full object-cover [-webkit-user-drag:none]" />
                </div>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-2xl text-center">
        <div className="flex items-center justify-center gap-6">
          <button type="button" onClick={() => setTurn((t) => t - 1)} aria-label="Previous look" className="flex size-12 shrink-0 items-center justify-center border border-gold/50 text-gold-soft hover:bg-gold/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <div aria-live="polite" className="min-w-0">
            <p className="font-display text-sm italic text-gold">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </p>
            <h3 className="mt-1 font-display text-2xl leading-tight md:text-3xl">{look.t}</h3>
          </div>
          <button type="button" onClick={() => setTurn((t) => t + 1)} aria-label="Next look" className="flex size-12 shrink-0 items-center justify-center border border-gold/50 text-gold-soft hover:bg-gold/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <p className="mt-3 text-ivory/70">{look.n}</p>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory/60">{captionFor(a)}</p>
        <a href={wa(`Hi Svarahi, I'm planning bridal jewellery and like this style: "${look.t}". Could you show me sets like this at the showroom?`)} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-6">
          Ask about a bridal set in this style ↗
        </a>
      </div>
    </div>
  );
}
