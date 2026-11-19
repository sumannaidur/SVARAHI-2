"use client";

import { useRef } from "react";
import { wa } from "@/content/business";
import { publicAsset, type Asset } from "@/lib/assets";
import { Picture, Provenance } from "../media/picture";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/** Copy restates svarahi.co's own published buying process (About / FAQ). */
const STEPS: { k: string; title: string; body: string; img: string }[] = [
  { k: "01", title: "Discover", body: "Browse necklaces, earrings, bangles, rings, pendants, chains and bridal sets — here and on our Instagram.", img: "ux-display-jhumka-wall" },
  { k: "02", title: "Understand", body: "We talk you through each piece — its purity, weight, finish and care — before you decide.", img: "ux-nakshi-pendant-black" },
  { k: "03", title: "Experience", body: "Come to the Jayanagar showroom. Try every piece on, and take your time choosing.", img: "ai-counter-stage-001" },
  { k: "04", title: "Decide", body: "Prices depend on each piece's weight and the day's metal rate, so we confirm the exact price with you — making charge and GST shown separately.", img: "ux-gem-emerald-ring-macro" },
  { k: "05", title: "Make it yours", body: "Purchases are made in person at our store, so the piece you choose is the piece you take home.", img: "ai-lookbook-bridal-001" },
];

export function Journey() {
  const root = useRef<HTMLElement>(null);
  const imgs: Asset[] = STEPS.map((s) => publicAsset(s.img));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const pics = gsap.utils.toArray<HTMLElement>("[data-pic]");
        gsap.set(pics.slice(1), { autoAlpha: 0, scale: 1.08 });
        gsap.set(steps.slice(1), { opacity: 0.28 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${STEPS.length * 70}%`, pin: true, scrub: 0.7 },
        });
        tl.fromTo("[data-progress]", { scaleY: 0 }, { scaleY: 1, duration: STEPS.length - 1 }, 0);
        for (let i = 1; i < STEPS.length; i++) {
          tl.to(steps[i - 1], { opacity: 0.28, duration: 0.3 }, i - 0.5)
            .to(steps[i], { opacity: 1, duration: 0.3 }, i - 0.5)
            .to(pics[i - 1], { autoAlpha: 0, duration: 0.4 }, i - 0.5)
            .to(pics[i], { autoAlpha: 1, scale: 1, duration: 0.5 }, i - 0.5);
        }
      });
      mm.add(MQ.mobile, () => {
        gsap.utils.toArray<HTMLElement>("[data-mstep]").forEach((el) =>
          gsap.from(el, { y: 36, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%", once: true } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="journey-title" className="relative overflow-hidden bg-oxblood lg:h-svh">
      <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-soft-light" style={{ backgroundImage: "url(/assets/generated/nano-banana/web/texture-oxblood-velvet-01-1024.webp)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="shell relative grid h-full gap-12 py-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-6 lg:pt-24">
        <div className="lg:col-span-4">
          <p className="eyebrow text-gold-soft">The Svarahi way</p>
          <h2 id="journey-title" className="display-l mt-5">From first look to forever</h2>
          <p className="mt-6 max-w-sm leading-relaxed text-ivory/70">Buying jewellery should feel personal. This is how choosing a piece with us works.</p>
          <a href={wa("Hi Svarahi, I'd like to plan a visit to try some pieces.")} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-8">Plan a visit</a>
        </div>

        {/* desktop: pinned stepper */}
        <div className="relative hidden lg:col-span-4 lg:col-start-5 lg:block">
          <span aria-hidden className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-gold/20" />
          <span aria-hidden data-progress className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px origin-top bg-gold" />
          <ol className="space-y-5 pl-8 [@media(min-height:860px)]:space-y-7">
            {STEPS.map((s) => (
              <li key={s.k} data-step>
                <p className="font-display text-sm italic text-gold">{s.k}</p>
                <h3 className="display-m mt-1">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative hidden aspect-[3/4] max-h-[76svh] lg:col-span-4 lg:col-start-9 lg:block">
          {imgs.map((a, i) => (
            <figure key={a.id} data-pic className="arch absolute inset-0 ring-1 ring-gold/30">
              <Picture asset={a} sizes="34vw" priority={i === 0} className="absolute inset-0" imgClassName="h-full w-full object-cover" />
              <Provenance asset={a} className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap" />
            </figure>
          ))}
        </div>

        {/* mobile / tablet / reduced motion: stacked cards */}
        <ol className="space-y-10 lg:hidden">
          {STEPS.map((s, i) => (
            <li key={s.k} data-mstep className="grid grid-cols-[88px_1fr] items-start gap-5 sm:grid-cols-[120px_1fr]">
              <div className="arch relative aspect-[3/4] ring-1 ring-gold/30">
                <Picture asset={imgs[i]} sizes="120px" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-display text-sm italic text-gold">{s.k}</p>
                <h3 className="display-m mt-1">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory/75">{s.body}</p>
              </div>
            </li>
          ))}
          <li className="text-[10px] uppercase tracking-[0.16em] text-ivory/45">
            Images: licensed editorial, showroom inspiration and AI-generated concepts — not Svarahi jewellery or our store.
          </li>
        </ol>
      </div>
    </section>
  );
}
