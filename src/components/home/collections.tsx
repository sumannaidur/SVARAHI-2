"use client";

import { useRef } from "react";
import { wa } from "@/content/business";
import { publicAsset } from "@/lib/assets";
import { Picture, Provenance } from "../media/picture";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * SIGNATURE COLLECTIONS — editorial mood cards (not inventory). Each card
 * opens a WhatsApp conversation about that collection until collection pages
 * exist (Phase 7). Men's jewellery is not yet a verified Svarahi category, so
 * its card asks rather than asserts.
 */
const CARDS = [
  { slug: "temple-antique", title: "Temple & Antique", line: "Lakshmi motifs, nakshi relief and antique finishes", img: "ai-lookbook-heritage-001" },
  { slug: "bridal", title: "Bridal", line: "Chokers, harams, jhumkas and complete sets for the wedding", img: "ai-lookbook-bridal-001" },
  { slug: "bangles", title: "Bangles", line: "Kadas, stacks and stone-set bangles", img: "ux-bangles-stack-dark" },
  { slug: "earrings", title: "Earrings", line: "Jhumkas, chandbalis and studs", img: "ux-everyday-jhumka-profile" },
  { slug: "necklaces", title: "Necklaces", line: "Haars, chokers and everyday chains", img: "ux-macro-gold-necklace-black" },
  { slug: "mens", title: "Men's", line: "Kadas, chains and rings — ask what's in store today", img: "ai-lookbook-mens-001" },
] as const;

export function Collections() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const distance = () => Math.max(0, track.current!.scrollWidth - viewport.current!.clientWidth);
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          gsap.fromTo(card, { scale: 0.88, opacity: 0.55 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 45%", scrub: true } });
          const img = card.querySelector("[data-cimg]");
          if (img) gsap.fromTo(img, { xPercent: -7 }, { xPercent: 7, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="collections" ref={root} aria-labelledby="collections-title" className="relative overflow-hidden bg-velvet lg:h-svh">
      <div className="flex h-full flex-col py-20 lg:py-0 lg:pt-28">
        <div className="shell flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-gold-soft">Signature collections</p>
            <h2 id="collections-title" className="display-l mt-5">Find the piece you came for</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ivory/65">
            Mood imagery for each collection. Ask us on WhatsApp and we&apos;ll show you what&apos;s in the showroom today.
          </p>
        </div>

        <div ref={viewport} className="mt-10 min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:mt-12 lg:motion-safe:snap-none lg:motion-safe:overflow-hidden" aria-label="Collections — swipe to browse">
          <ul ref={track} className="relative flex h-full w-max gap-4 px-[var(--gutter)] will-change-transform lg:gap-8 lg:pb-[6vh]">
            {CARDS.map((c, i) => {
              const a = publicAsset(c.img);
              return (
                <li key={c.slug} data-card className="w-[78vw] max-w-[360px] shrink-0 snap-start scroll-ml-[var(--gutter)] lg:h-full lg:w-[min(30vw,calc((100svh-260px)*0.72))] lg:max-w-none">
                  <a
                    href={wa(`Hi Svarahi, I'd like to see your ${c.title} jewellery. What do you have in the showroom?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col"
                  >
                    <div className="arch relative aspect-[3/4] w-full ring-1 ring-gold/30 lg:aspect-auto lg:flex-1">
                      <div data-cimg className="absolute inset-y-0 -left-[8%] -right-[8%]">
                        <Picture asset={a} sizes="(min-width:1024px) 32vw, 80vw" className="absolute inset-0" imgClassName="h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-[var(--ease-velvet)] group-hover:scale-[1.05]" />
                      </div>
                      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgb(20 6 8 / 0.85))" }} />
                      <span className="absolute left-1/2 top-[7%] -translate-x-1/2 font-display text-xl italic text-gold-soft [text-shadow:0_1px_8px_rgb(0_0_0/0.8)]">0{i + 1}</span>
                      <Provenance asset={a} className="absolute bottom-3 left-4 max-w-[85%]" />
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-4 border-t border-gold/25 pt-4">
                      <div>
                        <h3 className="display-m transition-colors group-hover:text-gold-soft">{c.title}</h3>
                        <p className="mt-1 text-sm text-ivory/65">{c.line}</p>
                      </div>
                      <span className="eyebrow shrink-0 text-gold-soft">Ask ↗</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
