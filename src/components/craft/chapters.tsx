"use client";

import { useRef } from "react";
import { publicAsset } from "@/lib/assets";
import { Picture, Provenance } from "../media/picture";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * Technique chapters — general descriptions of traditional Indian goldsmithing.
 * They describe crafts, not Svarahi's own workshop (unverified). Desktop: pinned,
 * each chapter crossfades in with a slow push-in. Mobile/reduced: stacked.
 */
const CHAPTERS = [
  { k: "Nakshi", d: "Relief work chased into the gold from the front and back — deities, peacocks, lotus and mango forms standing out from the surface.", look: "Look for crisp edges on the raised motifs and depth in the recesses.", img: "ux-nakshi-pendant-black" },
  { k: "Granulation", d: "Tiny spheres of gold set side by side to build texture and borders, each catching its own point of light.", look: "Look for even beads and clean joins where they meet the base.", img: "ux-macro-gold-chain-black" },
  { k: "Stone setting", d: "Cabochon rubies and emeralds held in a raised gold bezel that wraps the stone's edge.", look: "Look for a bezel that sits flush all the way around the stone.", img: "ux-gem-emerald-ring-macro" },
  { k: "Kundan", d: "Stones set in refined gold foil, traditionally with enamel on the reverse — the setting itself becomes part of the design.", look: "Look at the back of the piece as well as the front.", img: "ux-bridal-kundan-choker" },
  { k: "Antique finish", d: "A softened, low-lustre finish that lets carved detail read clearly instead of being lost in shine.", look: "Turn the piece in the light — the detail should stay legible.", img: "ux-bangles-stack-dark" },
];

export function Chapters() {
  const root = useRef<HTMLElement>(null);
  const imgs = CHAPTERS.map((c) => publicAsset(c.img));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const pics = gsap.utils.toArray<HTMLElement>("[data-cpic]");
        const texts = gsap.utils.toArray<HTMLElement>("[data-ctext]");
        const dots = gsap.utils.toArray<HTMLElement>("[data-cdot]");
        gsap.set([...pics.slice(1), ...texts.slice(1)], { opacity: 0 });
        gsap.set(dots.slice(1), { opacity: 0.3 });
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: `+=${CHAPTERS.length * 80}%`, pin: true, scrub: 0.7 } });
        pics.forEach((p) => tl.fromTo(p.querySelector("img"), { scale: 1.18 }, { scale: 1, duration: CHAPTERS.length }, 0));
        for (let i = 1; i < CHAPTERS.length; i++) {
          tl.to([pics[i - 1], texts[i - 1]], { opacity: 0, duration: 0.35 }, i - 0.45)
            .fromTo(texts[i], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, i - 0.3)
            .to(pics[i], { opacity: 1, duration: 0.45 }, i - 0.45)
            .to(dots[i - 1], { opacity: 0.3, duration: 0.2 }, i - 0.4)
            .to(dots[i], { opacity: 1, duration: 0.2 }, i - 0.4);
        }
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="chapters-title" className="relative overflow-hidden bg-velvet lg:h-svh">
      <div className="shell grid h-full gap-10 py-20 lg:grid-cols-12 lg:items-center lg:py-0 lg:pt-20">
        <div className="lg:col-span-5">
          <p className="eyebrow text-gold-soft">Five crafts to look for</p>
          <h2 id="chapters-title" className="display-l mt-4">How detail is made</h2>
          <ol aria-hidden className="mt-8 hidden gap-3 lg:flex">
            {CHAPTERS.map((c) => (
              <li key={c.k} data-cdot className="h-px w-10 bg-gold" />
            ))}
          </ol>
          {/* desktop: stacked texts that crossfade */}
          <div className="relative mt-8 hidden min-h-[16rem] lg:block">
            {CHAPTERS.map((c, i) => (
              <div key={c.k} data-ctext className="absolute inset-0">
                <p className="font-display text-sm italic text-gold">0{i + 1} / 0{CHAPTERS.length}</p>
                <h3 className="display-m mt-2">{c.k}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-ivory/75">{c.d}</p>
                <p className="mt-4 max-w-md border-l border-gold/40 pl-4 text-sm text-gold-soft/85">{c.look}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative hidden lg:col-span-6 lg:col-start-7 lg:block lg:h-[74svh]">
          {imgs.map((a, i) => (
            <figure key={a.id} data-cpic className="arch absolute inset-0 overflow-hidden ring-1 ring-gold/30">
              <Picture asset={a} sizes="50vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
              <Provenance asset={a} className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap" />
              <span className="sr-only">{CHAPTERS[i].k}</span>
            </figure>
          ))}
        </div>

        {/* mobile / tablet / reduced motion */}
        <ol className="space-y-12 lg:hidden">
          {CHAPTERS.map((c, i) => (
            <li key={c.k}>
              <div className="arch relative aspect-[4/3] overflow-hidden ring-1 ring-gold/30">
                <Picture asset={imgs[i]} sizes="100vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
              </div>
              <p className="mt-5 font-display text-sm italic text-gold">0{i + 1}</p>
              <h3 className="display-m mt-1">{c.k}</h3>
              <p className="mt-3 leading-relaxed text-ivory/75">{c.d}</p>
              <p className="mt-3 border-l border-gold/40 pl-4 text-sm text-gold-soft/85">{c.look}</p>
            </li>
          ))}
          <li className="text-[10px] uppercase tracking-[0.16em] text-ivory/60">Images: licensed editorial photography — not Svarahi pieces.</li>
        </ol>
      </div>
    </section>
  );
}
