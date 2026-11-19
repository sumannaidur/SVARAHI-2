"use client";

import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { wa } from "@/content/business";
import { categories, getPieceByCode, piecesIn, trayMessage, type CategorySlug, type Piece } from "@/content/catalogue";
import { captionFor, publicAsset } from "@/lib/assets";
import { addToTray, announce, openTray, TRAY_MAX, useTray } from "@/lib/tray";
import { Picture } from "../media/picture";
import { PieceVisual } from "../catalogue/piece-visual";
import { PlaceOnTray, TrayThumb } from "./tray-ui";
import { gsap, MQ, useGSAP } from "../motion/gsap";

/**
 * THE VIRTUAL COUNTER.
 * Environment: the empty velvet counter (Group F concept, captioned — not our store).
 * On it: catalogue pieces (cleared representative images or photograph-to-follow;
 * never AI jewellery). Interactions:
 *  - 3D tilt + gold glare following the pointer (fine pointers, motion allowed)
 *  - drag a piece onto the velvet tray (Framer Motion drag; fine pointers)
 *  - "+ Trial tray" button for touch, keyboard and assistive tech
 *  - GSAP: pieces rise onto the counter when a collection is chosen
 * No 3D models exist, so nothing here is presented as a 3D scan.
 */
export function CounterStage({ initial = "bangles" as CategorySlug }) {
  const root = useRef<HTMLDivElement>(null);
  const trayZone = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<CategorySlug>(initial);
  const [fine, setFine] = useState(false);
  const [over, setOver] = useState(false);
  const [dragging, setDragging] = useState(false);
  const tray = useTray();
  const stage = publicAsset("ai-counter-stage-001");
  const list = piecesIn(tab);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const enter = () => {
        gsap.fromTo("[data-enter]", { y: 70, autoAlpha: 0, rotateX: -18 }, { y: 0, autoAlpha: 1, rotateX: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" });
        gsap.fromTo("[data-spot]", { xPercent: -80, autoAlpha: 0 }, { xPercent: 80, autoAlpha: 1, duration: 1.6, ease: "power2.inOut" });
      };
      mm.add(MQ.desktop, enter);
      mm.add(MQ.mobile, enter);
    },
    { scope: root, dependencies: [tab], revertOnUpdate: true },
  );

  const insideTray = (info: PanInfo) => {
    const r = trayZone.current?.getBoundingClientRect();
    if (!r) return false;
    const x = info.point.x - window.scrollX;
    const y = info.point.y - window.scrollY;
    return x >= r.left - 20 && x <= r.right + 20 && y >= r.top - 30 && y <= r.bottom + 20;
  };

  const drop = (p: Piece, info: PanInfo) => {
    setDragging(false);
    setOver(false);
    if (!insideTray(info)) return;
    const res = addToTray(p.code);
    announce(res === "added" ? `${p.name} placed on your tray.` : res === "exists" ? `${p.name} is already on your tray.` : `Your tray is full — it holds ${TRAY_MAX} pieces.`);
  };

  return (
    <div ref={root} className="relative overflow-hidden bg-velvet">
      {/* environment */}
      <div aria-hidden className="absolute inset-0">
        <Picture asset={stage} sizes="100vw" priority className="absolute inset-0" imgClassName="h-full w-full object-cover object-[50%_35%]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(20 6 8 / 0.92) 0%, rgb(20 6 8 / 0.45) 30%, rgb(20 6 8 / 0.35) 62%, rgb(20 6 8 / 0.95) 100%)" }} />
        <div data-spot className="absolute inset-y-0 left-1/4 w-1/2 mix-blend-soft-light" style={{ background: "radial-gradient(45% 55% at 50% 55%, rgb(255 225 170 / 0.4), transparent 70%)" }} />
      </div>

      {/* Sized so the display and the tray share one viewport (drag needs both visible). */}
      <div className="relative flex flex-col">
        {/* collection tabs */}
        <div role="tablist" aria-label="Choose a collection to lay out" className="shell flex gap-2 overflow-x-auto pt-6 [scrollbar-width:none] lg:flex-wrap lg:justify-center">
          {categories.map((c) => (
            <button
              key={c.slug}
              role="tab"
              type="button"
              aria-selected={tab === c.slug}
              aria-controls="counter-display"
              onClick={() => setTab(c.slug)}
              className={`shrink-0 whitespace-nowrap border px-3.5 py-2 text-[12px] backdrop-blur-sm transition-colors ${tab === c.slug ? "border-gold-soft bg-gold-soft text-velvet" : "border-gold/35 bg-velvet/40 text-ivory/80 hover:border-gold-soft"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* the counter display */}
        <div id="counter-display" role="tabpanel" aria-label={`${categories.find((c) => c.slug === tab)?.name} on the counter`} className="shell relative z-20 flex flex-1 items-end py-10 lg:py-8">
          <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:flex lg:items-end lg:justify-center lg:gap-8" style={{ perspective: "1200px" }}>
            {list.map((p) => (
              <li key={p.code} data-enter className="lg:w-[clamp(140px,min(12vw,calc((100svh-480px)*0.8)),190px)]">
                <motion.div
                  drag={fine}
                  dragSnapToOrigin
                  dragElastic={0.5}
                  whileDrag={{ scale: 1.06, zIndex: 40, cursor: "grabbing" }}
                  onDragStart={() => setDragging(true)}
                  onDrag={(_, info) => setOver(insideTray(info))}
                  onDragEnd={(_, info) => drop(p, info)}
                  // Native HTML5 image drag would hijack the gesture — disable it inside the card.
                  className={`relative select-none [&_img]:pointer-events-none [&_img]:[-webkit-user-drag:none] ${fine ? "cursor-grab" : ""}`}
                  style={{ touchAction: fine ? "none" : "auto" }}
                >
                  <TiltCard piece={p} enabled={fine} />
                </motion.div>
                <div className="mx-auto mt-3 w-fit bg-velvet/70 px-3 py-2 text-center backdrop-blur-sm">
                  <p className="font-display text-[1.15rem] leading-tight">{p.name}</p>
                  <p className="text-[10px] tracking-[0.16em] text-ivory/50">{p.code}</p>
                  <div className="mt-2 flex items-center justify-center gap-4">
                    <PlaceOnTray piece={p} compact />
                    <Link href={`/pieces/${p.slug}`} className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ivory/60 hover:text-gold-soft">Details</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* the velvet tray (below the display layer so a dragged piece passes over it) */}
        <div className="shell relative z-10 pb-8">
          <div
            ref={trayZone}
            className={`relative mx-auto max-w-4xl rounded-[28px] border bg-oxblood/85 p-4 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 md:p-5 ${
              over ? "border-gold-soft shadow-[0_0_0_4px_rgb(234_210_160/0.25)]" : dragging ? "border-gold/70" : "border-gold/35"
            }`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="md:w-48">
                <p className="eyebrow !text-[0.6rem] text-gold-soft">Your trial tray</p>
                <p className="mt-1 text-sm text-ivory/70">
                  {dragging ? (over ? "Release to place it" : "Drop the piece here") : `${tray.length} of ${TRAY_MAX} · ${fine ? "drag pieces here" : "tap + Trial tray"}`}
                </p>
              </div>
              <ul className="flex flex-1 gap-2 overflow-x-auto [scrollbar-width:none]" aria-label="Pieces on your tray">
                {Array.from({ length: TRAY_MAX }).map((_, i) => {
                  const p = tray[i] ? getPieceByCode(tray[i]) : undefined;
                  return (
                    <li key={i} className="shrink-0">
                      {p ? (
                        <motion.button layout type="button" onClick={openTray} title={`${p.name} (${p.code})`} aria-label={`${p.name} on your tray — review tray`}>
                          <TrayThumb piece={p} className="h-14 w-11 md:h-16 md:w-12" />
                        </motion.button>
                      ) : (
                        <span aria-hidden className="arch block h-14 w-11 border border-dashed border-gold/25 md:h-16 md:w-12" />
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="flex gap-2 md:flex-col">
                <a
                  href={tray.length ? wa(trayMessage(tray)) : undefined}
                  aria-disabled={!tray.length}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-solid !min-h-[44px] flex-1 !px-4 ${tray.length ? "" : "pointer-events-none opacity-40"}`}
                >
                  Reserve trial
                </a>
                <button type="button" onClick={openTray} className="btn btn-line !min-h-[44px] flex-1 !px-4">Review</button>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-ivory/45">{captionFor(stage)} · piece images are style references or photographs to follow</p>
        </div>
      </div>
    </div>
  );
}

/** 3D tilt + glare following the pointer. Inert on touch and under reduced motion. */
function TiltCard({ piece, enabled }: { piece: Piece; enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
    ref.current.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
    ref.current.style.setProperty("--go", "1");
  };
  const leave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "";
    ref.current.style.setProperty("--go", "0");
  };
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className="relative transition-transform duration-300 ease-out [transform-style:preserve-3d]"
      style={{ ["--go" as string]: 0 }}
    >
      <PieceVisual piece={piece} sizes="(min-width:1024px) 14vw, 45vw" />
      <span
        aria-hidden
        className="arch pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ opacity: "var(--go)", background: "radial-gradient(40% 35% at var(--gx,50%) var(--gy,40%), rgb(255 236 200 / 0.35), transparent 70%)", mixBlendMode: "soft-light" }}
      />
      <span aria-hidden className="absolute -bottom-3 left-1/2 h-3 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/50 blur-md" />
    </div>
  );
}
