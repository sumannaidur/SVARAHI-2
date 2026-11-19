import type { Metadata } from "next";
import { wa } from "@/content/business";
import { categories, piecesIn, proposedCategory } from "@/content/catalogue";
import { publicAsset } from "@/lib/assets";
import { Picture, Provenance } from "@/components/media/picture";
import { Breadcrumbs, Shell } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";
import { CatalogueGrid } from "@/components/catalogue/catalogue-grid";
import { ShowroomCta } from "@/components/catalogue/showroom-cta";

export const metadata: Metadata = {
  title: "Collections",
  description: "Necklaces and harams, temple and antique, earrings and jhumkas, bangles, rings, pendants, chains and bridal jewellery at Svarahi, Jayanagar, Bengaluru.",
};

export default function CollectionsPage() {
  const hero = publicAsset("ux-festive-temple-haar");
  const mens = publicAsset(proposedCategory.hero);
  return (
    <Shell>
      <Reveal>
        {/* Hero */}
        <section className="relative overflow-hidden pt-24 md:pt-28" style={{ background: "radial-gradient(60% 80% at 75% 30%, #3a0c16, #140608 70%)" }}>
          <div className="shell grid items-end gap-10 pb-14 lg:grid-cols-12 lg:pb-20">
            <div className="lg:col-span-7">
              <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Collections" }]} />
              <p data-reveal className="eyebrow mt-10 text-gold-soft">The collections</p>
              <h1 data-reveal="0.1" className="display-xl mt-5 max-w-[12ch]">A showroom, <em className="text-gold-soft">laid out</em> for you</h1>
              <p data-reveal="0.2" className="mt-7 max-w-lg text-[1.05rem] leading-relaxed text-ivory/70">
                Browse by collection, then ask us on WhatsApp about any piece. We&apos;ll share current photographs and keep it ready for you to try at the counter.
              </p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <div data-arch-reveal className="arch relative aspect-[3/4] ring-1 ring-gold/30">
                <div data-parallax className="absolute -inset-y-[8%] inset-x-0">
                  <Picture asset={hero} sizes="(min-width:1024px) 32vw, 90vw" priority className="absolute inset-0" imgClassName="h-full w-full object-cover object-top" />
                </div>
              </div>
              <Provenance asset={hero} className="mt-3" />
            </div>
          </div>
        </section>

        {/* Collections grid */}
        <section aria-labelledby="cats" className="shell py-16 md:py-24">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 id="cats" data-reveal className="display-l">Eight collections</h2>
            <p data-reveal className="max-w-sm text-sm text-ivory/60">Collection imagery sets the mood — it is licensed editorial or AI-generated concept imagery, not Svarahi pieces.</p>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
            {categories.map((c, i) => {
              const a = publicAsset(c.hero);
              const n = piecesIn(c.slug).length;
              return (
                <li key={c.slug} data-reveal={(i % 4) * 0.08}>
                  <a href={`/collections/${c.slug}`} className="group block">
                    <div className="arch relative aspect-[3/4] ring-1 ring-gold/30">
                      <Picture asset={a} sizes="(min-width:1024px) 23vw, 46vw" className="absolute inset-0" imgClassName="h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-[var(--ease-velvet)] group-hover:scale-[1.06]" />
                      <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" style={{ background: "linear-gradient(180deg, transparent 40%, rgb(20 6 8 / 0.7))" }} />
                      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold-soft opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        Explore →
                      </span>
                    </div>
                    <div className="mt-4 border-t border-gold/25 pt-3">
                      <h3 className="font-display text-[1.5rem] leading-tight transition-colors group-hover:text-gold-soft md:text-[1.7rem]">{c.name}</h3>
                      <p className="mt-1 text-[13px] text-ivory/60">{c.short}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ivory/45">{n} catalogue {n === 1 ? "reference" : "references"}</p>
                    </div>
                  </a>
                </li>
              );
            })}
            {/* Proposed — not a confirmed category */}
            <li data-reveal="0.24">
              <a href={wa("Hi Svarahi, do you have men's jewellery — kadas, chains or rings — in the showroom?")} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="arch relative aspect-[3/4] opacity-70 outline-1 outline-dashed outline-gold/40 grayscale-[35%] transition-opacity group-hover:opacity-100">
                  <Picture asset={mens} sizes="(min-width:1024px) 23vw, 46vw" className="absolute inset-0" imgClassName="h-full w-full object-cover object-top" />
                  <span className="absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap bg-velvet/80 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-soft">Proposed</span>
                </div>
                <div className="mt-4 border-t border-dashed border-gold/25 pt-3">
                  <h3 className="font-display text-[1.5rem] leading-tight text-ivory/80 md:text-[1.7rem]">{proposedCategory.name}</h3>
                  <p className="mt-1 text-[13px] text-ivory/55">{proposedCategory.status}. Ask us what&apos;s available ↗</p>
                </div>
              </a>
            </li>
          </ul>
        </section>

        {/* Catalogue */}
        <section aria-labelledby="catalogue" className="shell pb-24">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p data-reveal className="eyebrow text-gold-soft">The catalogue</p>
              <h2 id="catalogue" data-reveal className="display-l mt-4">Every piece we list</h2>
            </div>
            <p data-reveal className="max-w-md text-sm leading-relaxed text-ivory/60">
              Names and codes from Svarahi&apos;s current catalogue. Designs in the showroom change — ask for the code and we&apos;ll confirm what&apos;s available.
            </p>
          </div>
          <CatalogueGrid />
        </section>
      </Reveal>
      <ShowroomCta />
    </Shell>
  );
}
