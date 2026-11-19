"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * Decorative illustration of stacked bars (CSS only — no photographs, no 3D
 * models, so nothing here could be mistaken for real inventory or a live rate).
 * Desktop: bars settle in and a light sweep crosses as the section scrolls.
 * Reduced motion: static.
 */
export function IngotStack() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const run = (dist: number) => {
        const bars = gsap.utils.toArray<HTMLElement>("[data-bar]");
        gsap.from(bars, { y: -dist, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.14, scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
        gsap.fromTo("[data-sheen]", { xPercent: -160 }, { xPercent: 260, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      };
      mm.add(MQ.desktop, () => run(60));
      mm.add(MQ.mobile, () => run(30));
    },
    { scope: root },
  );

  const bar = "relative h-[clamp(54px,7vw,92px)] [clip-path:polygon(9%_0,91%_0,100%_100%,0_100%)] bg-[linear-gradient(180deg,#f5dca0_0%,#d4a94f_38%,#a77a2a_70%,#7a5418_100%)] shadow-[inset_0_2px_0_rgb(255_245_210/0.6)]";
  return (
    <div ref={root} role="img" aria-label="Illustration of stacked gold bars" className="relative mx-auto w-full max-w-md overflow-hidden px-6 py-10">
      <div className="mx-auto flex w-[62%] flex-col">
        <div data-bar className={bar} />
      </div>
      <div className="mx-auto mt-1 flex w-[100%] gap-1">
        <div data-bar className={`${bar} flex-1`} />
        <div data-bar className={`${bar} flex-1`} />
      </div>
      <div aria-hidden data-sheen className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(255_240_200/0.35),transparent)] mix-blend-soft-light" />
      <div aria-hidden className="mx-auto mt-3 h-6 w-[90%] rounded-[50%] bg-black/50 blur-md" />
      <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory/60">Illustration</p>
    </div>
  );
}
