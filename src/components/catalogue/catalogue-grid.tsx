"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { categories, pieces, STYLE_LABEL, type CategorySlug, type Style } from "@/content/catalogue";
import { PieceCard } from "./piece-card";

/**
 * The full catalogue with category + style filters. Framer Motion is used
 * here (and only here) because the grid re-flows on filter changes — its
 * layout animation keeps cards visually continuous. Filters mirror to the URL
 * (?category=&style=) so a filtered view can be shared.
 */
export function CatalogueGrid() {
  const reduce = useReducedMotion();
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const [style, setStyle] = useState<Style | "all">("all");

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const c = q.get("category"), s = q.get("style");
    /* eslint-disable react-hooks/set-state-in-effect -- one-time read of shareable URL state after hydration */
    if (c && categories.some((x) => x.slug === c)) setCat(c as CategorySlug);
    if (s && s in STYLE_LABEL) setStyle(s as Style);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    const u = new URL(location.href);
    if (cat === "all") u.searchParams.delete("category");
    else u.searchParams.set("category", cat);
    if (style === "all") u.searchParams.delete("style");
    else u.searchParams.set("style", style);
    history.replaceState(history.state, "", u);
  }, [cat, style]);

  const list = useMemo(
    () => pieces.filter((p) => (cat === "all" || p.category === cat || p.alsoIn.includes(cat)) && (style === "all" || p.styles.includes(style))),
    [cat, style],
  );
  const styles = Object.keys(STYLE_LABEL) as Style[];

  const chip = (on: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center whitespace-nowrap border px-3.5 text-[12px] transition-colors ${on ? "border-gold-soft bg-gold-soft text-velvet" : "border-gold/30 text-ivory/75 hover:border-gold-soft hover:text-gold-soft"}`;

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-[var(--gutter)] border-y border-gold/15 bg-velvet/95 px-[var(--gutter)] py-4 backdrop-blur-md md:top-20">
        <div role="group" aria-label="Filter by collection" className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>All</button>
          {categories.map((c) => (
            <button key={c.slug} type="button" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)} className={chip(cat === c.slug)}>{c.name}</button>
          ))}
        </div>
        <div role="group" aria-label="Filter by style" className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px]">
          <span className="eyebrow !text-[0.58rem] text-ivory/60">Style, from the piece name</span>
          {styles.map((s) => (
            <button key={s} type="button" aria-pressed={style === s} onClick={() => setStyle(style === s ? "all" : s)} className={`inline-flex min-h-11 items-center transition-colors ${style === s ? "text-gold-soft underline underline-offset-4" : "text-ivory/65 hover:text-gold-soft"}`}>
              {STYLE_LABEL[s]}
            </button>
          ))}
          <span className="ml-auto text-ivory/60" aria-live="polite">{list.length} {list.length === 1 ? "piece" : "pieces"}</span>
        </div>
      </div>

      {list.length ? (
        <motion.ul layout={!reduce} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {/* No AnimatePresence: it generates random ids during render, which Cache Components rejects at
              prerender. Layout animation alone keeps remaining cards gliding into place; new cards fade up. */}
          {list.map((p) => (
            <motion.li
              key={p.code}
              layout={!reduce}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.19, 0.8, 0.2, 1] }}
            >
              <PieceCard piece={p} sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw" />
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <div className="py-20 text-center">
          <p className="display-m">No pieces match both filters yet.</p>
          <button type="button" onClick={() => { setCat("all"); setStyle("all"); }} className="btn btn-line mt-6">Show everything</button>
        </div>
      )}
    </div>
  );
}
