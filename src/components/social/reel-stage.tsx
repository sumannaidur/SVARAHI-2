"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { igPost } from "@/content/catalogue";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * Instagram stage (reels first, then posts): one official Instagram embed in the centre (only the active item
 * loads an iframe — no autoplay, nothing from Instagram before the visitor
 * looks), neighbours as quiet cards angled in perspective. Prev/next buttons,
 * arrow keys and horizontal swipe; the change is announced politely.
 */
export function ReelStage({ codes }: { codes: string[] }) {
  const reels = codes.map((c) => igPost(c)).filter((p) => p !== undefined);
  const [i, setI] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const n = reels.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-reel]");
      const place = (animate: boolean, wide: boolean) =>
        cards.forEach((el, k) => {
          let off = k - i;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          off = Math.max(-2, Math.min(2, off)); // park far items just off-stage, never beyond the page edge
          const props = {
            xPercent: -50 + off * (wide ? 92 : 104),
            rotationY: off * -24,
            z: Math.abs(off) * -160,
            scale: off === 0 ? 1 : 0.82,
            autoAlpha: Math.abs(off) > 1 ? 0 : off === 0 ? 1 : 0.45,
            zIndex: 10 - Math.abs(off),
          };
          if (animate) gsap.to(el, { ...props, duration: 0.9, ease: "power3.out" });
          else gsap.set(el, props);
        });
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => place(true, true));
      mm.add(MQ.mobile, () => place(true, false));
      mm.add("(prefers-reduced-motion: reduce)", () => place(false, window.innerWidth >= 1024));
    },
    { scope: root, dependencies: [i], revertOnUpdate: false },
  );

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  };
  const down = (e: PointerEvent) => (start.current = e.clientX);
  const up = (e: PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const active = reels[i];
  return (
    <div ref={root} role="region" aria-roledescription="carousel" aria-label="Svarahi on Instagram" onKeyDown={onKey} className="overflow-x-clip">
      <div className="relative mx-auto h-[min(760px,calc(100svh-7rem))] max-w-5xl [perspective:1400px]" onPointerDown={down} onPointerUp={up}>
        {reels.map((r, k) => (
          <div
            key={r.code}
            data-reel
            aria-hidden={k !== i}
            className="absolute left-1/2 top-0 h-full w-[min(92vw,380px)] [transform-style:preserve-3d]"
            style={k === 0 ? undefined : { visibility: "hidden" }}
          >
            {k === i ? (
              <figure className="flex h-full flex-col">
                <div className="relative min-h-0 flex-1 overflow-hidden bg-oxblood ring-1 ring-gold/40">
                  <iframe
                    key={r.code}
                    src={`https://www.instagram.com/${r.type === "reel" ? "reel" : "p"}/${r.code}/embed/`}
                    title={`Svarahi on Instagram (${r.type === "reel" ? "reel" : "post"}): ${r.subject}`}
                    loading="lazy"
                    scrolling="no"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
                <figcaption className="mt-3 text-[13px] text-ivory/70">{r.subject}</figcaption>
              </figure>
            ) : (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setI(k)}
                className="flex h-full w-full flex-col justify-end bg-[radial-gradient(80%_60%_at_50%_30%,#5c1426,#140608)] p-6 text-left ring-1 ring-gold/25"
              >
                <span className="font-display text-sm italic text-gold">{r.type === "reel" ? "Reel" : "Post"} · 0{k + 1}</span>
                <span className="mt-2 font-display text-2xl leading-tight text-ivory/85">{r.subject}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button type="button" onClick={() => go(-1)} aria-label="Previous post" className="flex size-12 items-center justify-center border border-gold/50 text-gold-soft hover:bg-gold/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <p className="min-w-[7rem] text-center text-xs uppercase tracking-[0.2em] text-ivory/60" aria-live="polite">
          {i + 1} of {n}
          <span className="sr-only">: {active?.subject}</span>
        </p>
        <button type="button" onClick={() => go(1)} aria-label="Next post" className="flex size-12 items-center justify-center border border-gold/50 text-gold-soft hover:bg-gold/10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <p className="mt-4 text-center">
        <a href={`https://www.instagram.com/${active?.type === "reel" ? "reel" : "p"}/${active?.code}/`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft hover:underline">
          Open on Instagram ↗
        </a>
      </p>
    </div>
  );
}
