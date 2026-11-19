"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "./gsap";

/**
 * Declarative scroll reveals for a page region (GSAP/ScrollTrigger only):
 *  [data-reveal]      fade + rise on entry
 *  [data-arch-reveal] temple-arch iris opening on entry
 *  [data-parallax]    slow vertical drift while scrolling (desktop)
 * Mobile gets lighter, once-only reveals; reduced motion registers nothing.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const reveals = (dist: number) => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, { y: dist, autoAlpha: 0, duration: 1, ease: "power3.out", delay: Number(el.dataset.reveal || 0), scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
        );
        gsap.utils.toArray<HTMLElement>("[data-arch-reveal]").forEach((el) =>
          gsap.fromTo(el, { clipPath: "inset(45% 30% 0% 30% round 999px 999px 0px 0px)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)", duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
        );
      };
      mm.add(MQ.desktop, () => {
        reveals(36);
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) =>
          gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }),
        );
      });
      mm.add(MQ.mobile, () => reveals(22));
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
