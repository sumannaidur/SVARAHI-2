import type { Metadata } from "next";
import manifest from "@/content/asset-manifest.json";
import claims from "@/content/commercial-claims.json";
import { asset } from "@/lib/assets";
import { Picture, Provenance } from "@/components/media/picture";

export const metadata: Metadata = { title: "Visual direction — Velvet & Gold" };

const PALETTE = [
  ["velvet", "#140608", "Primary dark ground"],
  ["oxblood", "#3A0C16", "Raised dark surface"],
  ["maroon", "#5C1426", "Brand continuity"],
  ["sindoor", "#B3122E", "Accent — from the red wordmark"],
  ["gold", "#D4A94F", "Hairlines, numerals"],
  ["gold-soft", "#EAD2A0", "Text accent on velvet"],
  ["ivory", "#FBF6EE", "Editorial pages"],
  ["sandstone", "#EDE3D3", "Secondary light"],
] as const;

export default function DirectionPage() {
  const hero = asset("ux-macro-gold-necklace-black");
  const logo = asset("brand-svarahi-full-light");
  const arches = ["ux-bridal-red-choker", "ux-festive-temple-haar", "ux-bridal-maang-tikka", "ux-bridal-kundan-smile", "ux-bridal-gold-layers"].map(asset);
  const counter = ["sv-ruby-pearl-haar", "sv-temple-jhumkas", "sv-kemp-bridal-set"].map(asset);
  const showroom = asset("ux-display-warm-counter");
  const groups = (["A", "B", "C", "D", "E"] as const).map((g) => [g, manifest.groups[g], manifest.assets.filter((a) => a.group === g).length] as const);
  const approved = claims.claims.filter((c) => c.status === "approved").length;

  return (
    <main>
      {/* 01 — Hero concept */}
      <section className="relative min-h-svh overflow-hidden">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 70% at 68% 45%, #3a0c16 0%, #140608 70%)" }} />
        <header className="shell relative flex h-20 items-center justify-between">
          <Picture asset={logo} sizes="120px" imgClassName="h-14 w-auto" />
          <nav className="hidden gap-10 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-ivory/70 md:flex">
            <span>Collections</span><span>Bridal</span><span>Craft</span><span>Showroom</span><span>Svarahi Gold ↗</span>
          </nav>
        </header>
        <div className="shell relative grid min-h-[calc(100svh-5rem)] items-center gap-12 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow text-gold-soft">Jayanagar · Bengaluru</p>
            <h1 className="display-xl mt-6">
              Jewellery straight from <em className="text-gold-soft">manufacturers</em>
            </h1>
            <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-ivory/70">
              See it in the light. Try it on at our Jayanagar showroom. Choose it with someone who explains every detail.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <span className="btn btn-solid">Explore the collection</span>
              <span className="btn btn-line">Reserve a showroom trial</span>
            </div>
          </div>
          <div className="relative lg:col-span-5 lg:col-start-8">
            <div className="arch light-sweep relative aspect-[3/4] shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)] ring-1 ring-gold/40">
              <Picture asset={hero} sizes="(min-width:1024px) 40vw, 90vw" priority className="absolute inset-0" imgClassName="h-full w-full object-cover" />
            </div>
            <Provenance asset={hero} className="mt-3" />
          </div>
        </div>
        <p className="absolute bottom-4 left-[var(--gutter)] text-[10px] uppercase tracking-[0.2em] text-ivory/35">Direction preview · not the final homepage</p>
      </section>

      {/* 02 — Palette + type */}
      <section className="bg-ivory py-24 text-ink">
        <div className="shell grid gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-maroon">Palette</p>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PALETTE.map(([n, hex, role]) => (
                <li key={n}>
                  <div className="aspect-square ring-1 ring-ink/10" style={{ background: hex }} />
                  <p className="mt-2 text-sm font-semibold">{n}</p>
                  <p className="text-xs text-mute">{hex} · {role}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-maroon">Typography</p>
            <p className="display-l mt-8">Cormorant Garamond</p>
            <p className="display-m mt-3 italic text-maroon">Temple gold, in the light</p>
            <p className="mt-6 max-w-lg leading-relaxed">
              Manrope carries the reading voice: clear, modern and calm, so the jewellery and the display type can be expressive.
              <span className="mt-3 block text-sm text-mute">Eyebrow · Body 16/1.65 · Tabular numerals for codes and (approved) prices</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="btn border-maroon text-maroon">Square, hairline buttons</span>
              <span className="btn border-ink bg-ink text-ivory">Primary on ivory</span>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Arch carousel concept */}
      <section className="overflow-hidden py-24">
        <div className="shell">
          <p className="eyebrow text-gold-soft">Signature shape · Bridal &amp; heritage carousel</p>
          <h2 className="display-l mt-5 max-w-3xl">The temple arch frames every hero piece</h2>
        </div>
        <ul className="mt-14 flex items-end justify-center gap-4 px-[var(--gutter)] sm:gap-6" style={{ perspective: "1400px" }}>
          {arches.map((a, i) => {
            const off = i - 2;
            return (
              <li key={a.id} className="shrink-0" style={{ transform: `rotateY(${off * -14}deg) translateZ(${-Math.abs(off) * 60}px)`, opacity: 1 - Math.abs(off) * 0.22, filter: off ? "saturate(0.85)" : "none" }}>
                <div className={`arch relative ${off === 0 ? "h-[min(62vw,460px)] w-[min(44vw,330px)]" : "h-[min(46vw,340px)] w-[min(32vw,240px)]"} ring-1 ring-gold/30`}>
                  <Picture asset={a} sizes="330px" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="shell mt-6 text-center"><Provenance asset={arches[0]} /></p>
      </section>

      {/* 04 — Velvet counter concept */}
      <section className="py-24" style={{ background: "radial-gradient(70% 60% at 50% 0%, #3a0c16, #140608 75%)" }}>
        <div className="shell">
          <p className="eyebrow text-gold-soft">Virtual velvet counter · concept</p>
          <h2 className="display-l mt-5 max-w-3xl">Pieces laid out the way they are in the showroom</h2>
          <div className="mt-14 grid gap-6 rounded-t-[48px] bg-oxblood/60 p-6 ring-1 ring-gold/25 sm:grid-cols-3 md:p-10">
            {counter.map((a) => (
              <figure key={a.id} className="group">
                <div className="light-sweep relative aspect-square overflow-hidden ring-1 ring-gold/20">
                  <Picture asset={a} sizes="(min-width:640px) 30vw, 90vw" className="absolute inset-0" imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <figcaption className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-display text-xl">{a.pieceCode}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-ivory/50">Representative image</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — Showroom destination */}
      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[60vh]">
          <Picture asset={showroom} sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
          <Provenance asset={showroom} className="absolute bottom-4 left-4" />
        </div>
        <div className="flex flex-col justify-center bg-ivory px-[var(--gutter)] py-20 text-ink lg:px-20">
          <p className="eyebrow text-sindoor">The destination</p>
          <h2 className="display-l mt-5">Come and see it in the light</h2>
          <p className="mt-6 max-w-md leading-relaxed text-ink/75">
            1st Floor, 33rd Cross Road, 4th T Block East, Jayanagar, Bengaluru 560041. Real showroom photography replaces this inspiration image once Svarahi supplies it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="btn border-ink bg-ink text-ivory">Reserve a trial</span>
            <span className="btn border-maroon text-maroon">WhatsApp concierge</span>
          </div>
        </div>
      </section>

      {/* 06 — Honesty system */}
      <section className="bg-sandstone py-20 text-ink">
        <div className="shell grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-maroon">Asset classification (live from asset-manifest.json)</p>
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {groups.map(([g, label, n]) => (
                <li key={g} className="flex items-center justify-between py-3 text-sm">
                  <span><strong className="mr-3 font-display text-xl">{g}</strong>{label}</span>
                  <span className="tabular-nums text-mute">{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-maroon">Commercial claims</p>
            <p className="display-m mt-6">{approved} of {claims.claims.length} approved</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">
              Offers, schemes, buyback, ratings and hours stay off customer pages until the owner approves wording, terms and dates.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
