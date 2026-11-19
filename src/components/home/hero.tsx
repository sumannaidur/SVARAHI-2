"use client";

import { useRef } from "react";
import { wa } from "@/content/business";
import { publicAsset, srcSet, fallback, captionFor } from "@/lib/assets";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * HERO — jewellery-first campaign.
 * Art-directed: the 16:9 campaign frame on desktop, the 9:16 cover on phones
 * (both Group F AI editorial concepts, captioned as such).
 * Desktop: the hero pins briefly; the photograph narrows into a temple arch
 * while the headline lifts away — the arch carries into the next scene.
 * Mobile: no pin; gentle parallax only. Reduced motion: static.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const wide = publicAsset("ai-hero-bridal-001");
  const tall = publicAsset("ai-campaign-cover-001");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=90%", pin: true, scrub: 0.8 },
        });
        tl.fromTo("[data-frame]", { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)" }, { clipPath: "inset(15% 8% 0% 52% round 999px 999px 0px 0px)", duration: 1 }, 0)
          .fromTo("[data-img]", { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
          .to("[data-copy]", { y: -60, autoAlpha: 0, duration: 0.45 }, 0.05)
          .fromTo("[data-after]", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.6);
        // entrance
        gsap.from("[data-in]", { y: 28, autoAlpha: 0, duration: 1.2, stagger: 0.12, ease: "power3.out", delay: 0.15 });
      });
      mm.add(MQ.mobile, () => {
        gsap.fromTo("[data-img]", { yPercent: 0 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.from("[data-in]", { y: 22, autoAlpha: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.1 });
      });
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} aria-labelledby="hero-title" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-velvet">
      {/* Phones: the portrait cover fills the top ~60% so the necklace stays clear of the copy. */}
      <div data-frame className="absolute inset-x-0 top-0 h-[62svh] overflow-hidden md:inset-0 md:h-auto">
        <picture data-img className="absolute inset-0 block will-change-transform">
          {(["avif", "webp"] as const).map((f) => (
            <source key={`t-${f}`} media="(max-width: 767px)" type={`image/${f}`} srcSet={srcSet(tall, f)} sizes="100vw" />
          ))}
          {(["avif", "webp"] as const).map((f) => (
            <source key={`w-${f}`} type={`image/${f}`} srcSet={srcSet(wide, f)} sizes="100vw" />
          ))}
          <img
            src={fallback(wide)}
            alt={wide.alt}
            width={wide.width}
            height={wide.height}
            fetchPriority="high"
            className="h-full w-full object-cover object-[50%_8%] md:object-[70%_30%]"
            style={{ backgroundColor: wide.dominant }}
          />
        </picture>
        {/* legibility veils */}
        <div aria-hidden className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(180deg, rgb(20 6 8 / 0.5) 0%, transparent 20%, transparent 70%, rgb(20 6 8) 100%)" }} />
        <div aria-hidden className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(90deg, rgb(20 6 8 / 0.92) 0%, rgb(20 6 8 / 0.55) 38%, transparent 62%)" }} />
      </div>

      <div data-copy className="shell relative flex h-full flex-col justify-end pb-[calc(84px+env(safe-area-inset-bottom))] md:justify-center md:pb-0">
        <p data-in className="eyebrow text-gold-soft">Jayanagar · Bengaluru</p>
        <h1 id="hero-title" data-in className="display-xl mt-4 max-w-[11ch] md:mt-6">
          Jewellery straight from <em className="text-gold-soft">manufacturers</em>
        </h1>
        <p data-in className="mt-5 hidden max-w-sm text-[1rem] leading-relaxed text-ivory/75 sm:block md:mt-7 md:max-w-md md:text-[1.05rem]">
          See it in the light. Try it on at our showroom. Choose it with someone who explains every detail.
        </p>
        <div data-in className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-10">
          <a href="#collections" className="btn btn-solid">Explore collections</a>
          <a href={wa("Hi Svarahi, I'd like to enquire about visiting the showroom.")} target="_blank" rel="noopener noreferrer" className="btn btn-line">
            Showroom enquiry
          </a>
        </div>
      </div>

      {/* revealed once the photograph settles into its arch (desktop) */}
      <div data-after className="shell pointer-events-none invisible absolute inset-x-0 bottom-[14%] hidden lg:block">
        <p className="eyebrow text-gold-soft">The Svarahi way</p>
        <p className="display-l mt-4 max-w-[12ch]">From first look to forever</p>
      </div>

      <span className="pointer-events-none absolute bottom-5 right-[var(--gutter)] hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory/45 md:block">
        {captionFor(wide)}
      </span>
      <span className="pointer-events-none absolute left-[var(--gutter)] top-[4.6rem] text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory/55 md:hidden">
        {captionFor(tall)}
      </span>
    </section>
  );
}
