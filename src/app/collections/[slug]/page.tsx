import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { wa } from "@/content/business";
import { categories, getCategory, piecesIn } from "@/content/catalogue";
import { publicAsset } from "@/lib/assets";
import { Picture, Provenance } from "@/components/media/picture";
import { Breadcrumbs, Shell } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";
import { PieceRail } from "@/components/catalogue/piece-rail";
import { PieceCard } from "@/components/catalogue/piece-card";
import { InstagramEmbed } from "@/components/catalogue/instagram-embed";
import { ShowroomCta } from "@/components/catalogue/showroom-cta";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) notFound(); // real 404 status for unknown slugs (resolves before streaming)
  return c ? { title: c.name, description: `${c.name} at Svarahi, Jayanagar, Bengaluru — ${c.short.toLowerCase()}. Enquire on WhatsApp or try them in the showroom.` } : {};
}

/** params are read inside <Suspense> (Cache Components instant navigation); all 8 are prerendered. */
export default function CategoryPage({ params }: PageProps<"/collections/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-velvet" aria-busy="true" />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: Pick<PageProps<"/collections/[slug]">, "params">) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const hero = publicAsset(c.hero);
  const list = piecesIn(c.slug);
  const idx = categories.findIndex((x) => x.slug === c.slug);
  const next = categories[(idx + 1) % categories.length];
  const msg = `Hi Svarahi, I'd like to see your ${c.name} in the showroom. What do you have at the moment?`;

  return (
    <Shell>
      <Reveal>
        {/* Category hero — mood imagery, clearly captioned */}
        <section className="relative overflow-hidden" style={{ background: "radial-gradient(70% 80% at 72% 35%, #3a0c16, #140608 72%)" }}>
          <div className="shell grid min-h-[86svh] items-center gap-10 pb-14 pt-24 md:pt-28 lg:grid-cols-12 lg:pb-16">
            <div className="lg:col-span-6">
              <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/collections", label: "Collections" }, { label: c.name }]} />
              <p data-reveal className="eyebrow mt-10 text-gold-soft">Collection {String(idx + 1).padStart(2, "0")} / 08</p>
              <h1 data-reveal="0.1" className="display-xl mt-5 max-w-[11ch]">{c.name}</h1>
              <p data-reveal="0.2" className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ivory/75">{c.story[0]}</p>
              <div data-reveal="0.3" className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={wa(msg)} target="_blank" rel="noopener noreferrer" className="btn btn-solid">Ask what&apos;s in the showroom</a>
                <a href="#pieces" className="btn btn-line">See the pieces</a>
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div data-arch-reveal className="arch relative mx-auto aspect-[3/4] max-h-[70svh] ring-1 ring-gold/30">
                <div data-parallax className="absolute -inset-y-[8%] inset-x-0">
                  <Picture asset={hero} sizes="(min-width:1024px) 40vw, 90vw" priority className="absolute inset-0" imgClassName="h-full w-full object-cover object-top" />
                </div>
              </div>
              <Provenance asset={hero} className="mx-auto mt-3 block w-fit" />
            </div>
          </div>
        </section>

        {/* Story band */}
        <section className="bg-ivory text-ink">
          <div className="shell grid gap-8 py-16 md:grid-cols-12 md:py-20">
            <p data-reveal className="eyebrow text-maroon md:col-span-3">How to choose</p>
            <p data-reveal="0.1" className="display-m md:col-span-8 md:col-start-5">{c.story[1]}</p>
          </div>
        </section>
      </Reveal>

      {/* Horizontal piece discovery */}
      <div id="pieces">
        <PieceRail
          eyebrow={`${list.length} catalogue ${list.length === 1 ? "reference" : "references"}`}
          title={`${c.name} in our catalogue`}
          aside={<p className="max-w-sm text-sm leading-relaxed text-ivory/60">Names and codes from Svarahi&apos;s catalogue. Svarahi&apos;s own photographs are being prepared; ask on WhatsApp for current photos.</p>}
        >
          {list.map((p) => (
            <PieceCard key={p.code} piece={p} sizes="(min-width:1024px) 22vw, 70vw" />
          ))}
        </PieceRail>
      </div>

      {/* Real Svarahi jewellery — official Instagram */}
      {c.instagram.length > 0 && (
        <Reveal>
          <section aria-labelledby="ig" className="border-t border-gold/15 bg-oxblood/40 py-16 md:py-24">
            <div className="shell flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p data-reveal className="eyebrow text-gold-soft">From @svarahijewels</p>
                <h2 id="ig" data-reveal className="display-l mt-4">Svarahi pieces, as posted</h2>
              </div>
              <p data-reveal className="max-w-sm text-sm leading-relaxed text-ivory/60">Svarahi&apos;s own photographs, shown through Instagram. Ask about any post on WhatsApp.</p>
            </div>
            <ul className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] md:mx-auto md:grid md:max-w-[1180px] md:grid-cols-3 md:gap-8 md:overflow-visible">
              {c.instagram.map((code) => (
                <li key={code} data-reveal className="w-[78vw] max-w-[340px] shrink-0 snap-start scroll-ml-[var(--gutter)] md:w-auto md:max-w-none">
                  <InstagramEmbed code={code} />
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {/* Next collection */}
      <a href={`/collections/${next.slug}`} className="group block border-t border-gold/15">
        <div className="shell flex items-center justify-between gap-6 py-12 md:py-16">
          <span>
            <span className="eyebrow block text-ivory/50">Next collection</span>
            <span className="display-l mt-3 block transition-colors group-hover:text-gold-soft">{next.name}</span>
          </span>
          <span className="font-display text-5xl text-gold transition-transform duration-500 group-hover:translate-x-2" aria-hidden>→</span>
        </div>
      </a>

      <ShowroomCta message={msg} heading={`Try ${c.name.toLowerCase()} at the counter`} />
    </Shell>
  );
}
