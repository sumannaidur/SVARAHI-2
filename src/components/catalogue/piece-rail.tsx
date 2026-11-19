"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * Horizontal piece discovery.
 * Desktop (motion allowed): if the track is wider than the viewport, the
 * section pins and vertical scroll drives it sideways; cards rise from depth.
 * Mobile / reduced motion: a native swipe rail with scroll-snap.
 */
export function PieceRail({ title, eyebrow, aside, children }: { title: string; eyebrow: string; aside?: ReactNode; children: ReactNode[] }) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const distance = () => Math.max(0, track.current!.scrollWidth - viewport.current!.clientWidth);
        if (distance() < 120) return; // fits on screen — no pin needed
        root.current!.dataset.pinned = "true";
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-rail-item]").forEach((el) =>
          gsap.fromTo(el, { y: 50, opacity: 0.4 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 100%", end: "left 60%", scrub: true } }),
        );
        return () => delete root.current!.dataset.pinned;
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={title} className="relative overflow-hidden py-16 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-0 lg:pt-24">
      <div className="shell flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-gold-soft">{eyebrow}</p>
          <h2 className="display-l mt-4">{title}</h2>
        </div>
        {aside}
      </div>
      <div ref={viewport} className="mt-10 snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:motion-safe:snap-none lg:motion-safe:overflow-hidden" tabIndex={0} aria-label={`${title} — scroll or swipe sideways`}>
        <ul ref={track} className="relative flex w-max gap-5 px-[var(--gutter)] pb-6 lg:gap-8">
          {children.map((c, i) => (
            <li key={i} data-rail-item className="w-[70vw] max-w-[320px] shrink-0 snap-start scroll-ml-[var(--gutter)] lg:w-[min(22vw,calc((100svh-330px)*0.8))] lg:max-w-none">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
