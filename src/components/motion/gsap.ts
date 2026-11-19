"use client";

/**
 * The single scroll/animation engine for v2: GSAP + ScrollTrigger on native
 * scroll (no smooth-scroll library). Every scene registers its timelines inside
 * gsap.matchMedia() so desktop, mobile and reduced-motion get their own
 * behaviour and everything is reverted on unmount/breakpoint change.
 * Initial "hidden" states are only ever set from JS — with JS off or reduced
 * motion on, all content is simply visible.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
