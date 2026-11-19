"use client";

import { useRef } from "react";
import { business, wa } from "@/content/business";
import { captionFor, publicAsset } from "@/lib/assets";
import { Picture } from "../media/picture";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * SHOWROOM PREVIEW — the empty velvet counter (Group F concept) used as a
 * presentation environment. Labelled as a conceptual visualisation; no
 * generated jewellery is placed on it as if it were inventory.
 */
const POINTS = [
  { x: "15%", y: "50%", k: "01", t: "See it in the light", d: "Every piece is brought to the counter for you to hold and try on." },
  { x: "50%", y: "44%", k: "02", t: "Purity & weight, explained", d: "We take you through purity, weight, finish and care before you decide." },
  { x: "83%", y: "50%", k: "03", t: "Price on the day's rate", d: "Confirmed with you by weight and the day's metal rate, charges shown separately." },
];

export function Counter() {
  const root = useRef<HTMLElement>(null);
  const stage = publicAsset("ai-counter-stage-001");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", pin: true, scrub: 0.8 },
        });
        tl.fromTo("[data-stage]", { clipPath: "inset(14% 26% 14% 26% round 999px 999px 0px 0px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", duration: 1 }, 0)
          .fromTo("[data-stage-img]", { scale: 1.25 }, { scale: 1, duration: 1 }, 0)
          .fromTo("[data-spot]", { xPercent: -60 }, { xPercent: 60, duration: 2.2 }, 0.4)
          .from("[data-point]", { opacity: 0, y: 24, stagger: 0.35, duration: 0.4 }, 0.9)
          .from("[data-counter-cta]", { opacity: 0, y: 24, duration: 0.4 }, 2);
      });
      mm.add(MQ.mobile, () => {
        gsap.fromTo("[data-stage-img]", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-stage]", start: "top bottom", end: "bottom 40%", scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <section id="counter" ref={root} aria-labelledby="counter-title" className="relative overflow-hidden bg-velvet lg:h-svh">
      <div className="shell pt-20 lg:absolute lg:inset-x-0 lg:top-24 lg:z-10 lg:pt-0">
        <p className="eyebrow text-gold-soft">The velvet counter</p>
        <h2 id="counter-title" className="display-l mt-5 max-w-[14ch]">Where your piece is chosen</h2>
      </div>

      <div data-stage className="relative mt-10 aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto">
        <div data-stage-img className="absolute inset-0 will-change-transform">
          <Picture asset={stage} sizes="100vw" className="absolute inset-0" imgClassName="h-full w-full object-cover object-[50%_60%]" />
        </div>
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(20 6 8 / 0.85) 0%, rgb(20 6 8 / 0.2) 30%, rgb(20 6 8 / 0.1) 60%, rgb(20 6 8 / 0.75) 100%)" }} />
        {/* travelling spotlight (decorative) */}
        <div aria-hidden data-spot className="pointer-events-none absolute inset-y-0 left-1/4 w-1/2 mix-blend-soft-light" style={{ background: "radial-gradient(40% 60% at 50% 55%, rgb(255 225 170 / 0.45), transparent 70%)" }} />
        {/* hotspots — desktop only */}
        {POINTS.map((p) => (
          <div key={p.k} data-point className="absolute hidden w-[240px] -translate-x-1/2 lg:block" style={{ left: p.x, top: p.y }}>
            <span className="mx-auto block size-3 rotate-45 border border-gold-soft bg-velvet/60" />
            <div className="mt-3 bg-velvet/80 p-4 text-center backdrop-blur-sm ring-1 ring-gold/30">
              <p className="font-display text-sm italic text-gold">{p.k}</p>
              <p className="mt-1 font-display text-xl">{p.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-ivory/70">{p.d}</p>
            </div>
          </div>
        ))}
        <span className="absolute right-4 top-4 bg-velvet/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory/75 lg:bottom-4 lg:top-auto">{captionFor(stage)}</span>
      </div>

      {/* mobile points */}
      <ol className="shell mt-8 space-y-6 lg:hidden">
        {POINTS.map((p) => (
          <li key={p.k} className="border-l border-gold/40 pl-5">
            <p className="font-display text-sm italic text-gold">{p.k}</p>
            <p className="font-display text-2xl">{p.t}</p>
            <p className="mt-1 text-sm leading-relaxed text-ivory/70">{p.d}</p>
          </li>
        ))}
      </ol>

      <div data-counter-cta className="shell flex flex-col gap-3 py-12 sm:flex-row lg:absolute lg:inset-x-0 lg:bottom-12 lg:z-10 lg:justify-center lg:py-0">
        <a href={wa("Hi Svarahi, I'd like to reserve a showroom trial. When can I visit?")} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
          Reserve a showroom trial
        </a>
        <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line bg-velvet/40">
          Directions to Jayanagar
        </a>
      </div>
    </section>
  );
}
