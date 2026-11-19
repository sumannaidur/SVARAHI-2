"use client";

import { useRef } from "react";
import { publicAsset } from "@/lib/assets";
import { Picture, Provenance } from "../media/picture";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * CRAFTSMANSHIP — describes traditional techniques in general terms. It does
 * not claim an in-house workshop (unverified); the macro is a Group F concept.
 */
const TERMS = [
  { t: "Nakshi", d: "Relief motifs — deities, peacocks, florals — chased into the gold by hand." },
  { t: "Granulation", d: "Tiny gold spheres, set one by one, that catch the light along every edge." },
  { t: "Stone setting", d: "Cabochon rubies and emeralds held in a hand-raised gold bezel." },
];

export function Craft() {
  const root = useRef<HTMLElement>(null);
  const macro = publicAsset("ai-craftsmanship-macro-001");
  const detailA = publicAsset("ux-nakshi-pendant-black");
  const detailB = publicAsset("ux-gem-emerald-ring-macro");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const terms = gsap.utils.toArray<HTMLElement>("[data-term]");
        gsap.set(terms, { autoAlpha: 0, y: 30 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=180%", pin: true, scrub: 0.8 },
        });
        tl.fromTo("[data-macro]", { scale: 2.1 }, { scale: 1, duration: 3 }, 0)
          .fromTo("[data-macro-frame]", { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(8% 6% 8% 6% round 999px 999px 0px 0px)", duration: 3 }, 0)
          .fromTo("[data-sweep]", { xPercent: -140 }, { xPercent: 260, duration: 3 }, 0);
        terms.forEach((el, i) => tl.to(el, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.5 + i * 0.85));
        tl.fromTo("[data-detail='a']", { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8 }, 1.6)
          .fromTo("[data-detail='b']", { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8 }, 2.0);
      });
      mm.add(MQ.mobile, () => {
        gsap.fromTo("[data-macro]", { scale: 1.5 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-macro-frame]", start: "top bottom", end: "bottom 30%", scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <section id="craft" ref={root} aria-labelledby="craft-title" className="relative overflow-hidden bg-ivory text-ink lg:h-svh">
      <div className="shell grid h-full items-center gap-10 py-20 lg:grid-cols-12 lg:py-0">
        <div className="lg:col-span-4">
          <p className="eyebrow text-maroon">Craftsmanship</p>
          <h2 id="craft-title" className="display-l mt-5">The beauty is in the detail</h2>
          <ol className="mt-10 space-y-7">
            {TERMS.map((x, i) => (
              <li key={x.t} data-term className="grid grid-cols-[2.2rem_1fr] gap-3">
                <span className="font-display text-lg italic text-maroon">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl">{x.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">{x.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-sm text-sm text-ink/60">Ask us to show you these details on the pieces in our showroom.</p>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6 lg:h-[82svh]">
          <div data-macro-frame className="light-sweep relative aspect-[3/4] overflow-hidden bg-velvet lg:aspect-auto lg:h-full">
            <div data-macro className="absolute inset-0 origin-[58%_45%] will-change-transform">
              <Picture asset={macro} sizes="(min-width:1024px) 55vw, 100vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
            </div>
            <div aria-hidden data-sweep className="pointer-events-none absolute inset-y-0 left-0 w-1/3 mix-blend-soft-light" style={{ background: "linear-gradient(100deg, transparent, rgb(255 230 180 / 0.45), transparent)" }} />
          </div>
          <Provenance asset={macro} className="mt-3 !bg-transparent !px-0 !text-ink/55 lg:absolute lg:-bottom-7 lg:right-0 lg:mt-0" />
          <figure data-detail="a" className="absolute -left-10 bottom-[12%] hidden w-[30%] ring-8 ring-ivory lg:block">
            <div className="relative aspect-square"><Picture asset={detailA} sizes="18vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" /></div>
          </figure>
          <figure data-detail="b" className="absolute -right-6 top-[10%] hidden w-[24%] ring-8 ring-ivory lg:block">
            <div className="relative aspect-square"><Picture asset={detailB} sizes="14vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" /></div>
          </figure>
        </div>
      </div>
    </section>
  );
}
