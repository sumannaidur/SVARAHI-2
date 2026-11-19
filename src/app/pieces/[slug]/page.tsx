import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { business, tel, wa } from "@/content/business";
import { enquiry, getCategory, getPiece, pieces, related, STYLE_LABEL } from "@/content/catalogue";
import { Breadcrumbs, Shell } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";
import { PieceStage } from "@/components/catalogue/piece-stage";
import { PieceCard } from "@/components/catalogue/piece-card";
import { ShowroomCta } from "@/components/catalogue/showroom-cta";
import { PlaceOnTray } from "@/components/tray/tray-ui";

export function generateStaticParams() {
  return pieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/pieces/[slug]">): Promise<Metadata> {
  const p = getPiece((await params).slug);
  if (!p) notFound(); // real 404 status for unknown slugs (resolves before streaming)
  return p ? { title: `${p.name} (${p.code})`, description: `${p.name}, catalogue code ${p.code}, at Svarahi, Jayanagar. Ask for photographs, price and availability on WhatsApp.` } : {};
}

/** Not verified anywhere — always confirmed in person (svarahi.co FAQ / About). */
const IN_PERSON = ["Purity", "Weight", "Making charge", "Stones & setting", "Price on the day's rate", "Availability"];

/** params are read inside <Suspense> (Cache Components instant navigation); all 23 are prerendered. */
export default function PiecePage({ params }: PageProps<"/pieces/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-velvet" aria-busy="true" />}>
      <PieceContent params={params} />
    </Suspense>
  );
}

async function PieceContent({ params }: Pick<PageProps<"/pieces/[slug]">, "params">) {
  const p = getPiece((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const i = pieces.findIndex((x) => x.code === p.code);
  const prev = pieces[(i - 1 + pieces.length) % pieces.length];
  const next = pieces[(i + 1) % pieces.length];
  const rel = related(p);
  const trial = `Hi Svarahi, I'd like to reserve a showroom trial for the ${p.name} (${p.code}). When could I come in?`;
  const mail = `mailto:${business.email}?subject=${encodeURIComponent(`Enquiry: ${p.name} (${p.code})`)}&body=${encodeURIComponent(`${enquiry(p)}\n\nName:\nPhone:\n`)}`;

  return (
    <Shell>
      <section className="relative pt-24 md:pt-28" style={{ background: "radial-gradient(60% 70% at 30% 30%, #3a0c16, #140608 72%)" }}>
        <div className="shell pb-16 md:pb-24">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/collections", label: "Collections" }, { href: `/collections/${cat.slug}`, label: cat.name }, { label: p.name }]} />
          <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <PieceStage piece={p} />
            </div>

            <Reveal className="lg:col-span-5 lg:col-start-8 lg:pt-6">
              <div className="lg:sticky lg:top-28">
                <p data-reveal className="eyebrow text-gold-soft">
                  <a href={`/collections/${cat.slug}`} className="hover:underline">{cat.name}</a>
                </p>
                <h1 data-reveal="0.08" className="display-l mt-4">{p.name}</h1>
                <dl data-reveal="0.14" className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                  <dt className="text-ivory/50">Catalogue code</dt>
                  <dd className="tracking-[0.12em]">{p.code}</dd>
                  <dt className="text-ivory/50">Listed on</dt>
                  <dd>svarahi.co catalogue</dd>
                  {p.styles.length > 0 && (
                    <>
                      <dt className="text-ivory/50">Style</dt>
                      <dd>{p.styles.map((s) => STYLE_LABEL[s]).join(" · ")} <span className="text-ivory/40">(from the name)</span></dd>
                    </>
                  )}
                </dl>

                <div data-reveal="0.2" className="mt-9 border border-gold/25 p-6">
                  <p className="eyebrow !text-[0.6rem] text-gold-soft">Confirmed with you, in person</p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-ivory/85">
                    {IN_PERSON.map((k) => (
                      <li key={k} className="flex items-center gap-2.5">
                        <span aria-hidden className="size-[5px] rotate-45 bg-gold" />
                        {k}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-ivory/55">
                    We don&apos;t publish specifications online. Prices depend on the piece&apos;s weight and the day&apos;s metal rate; the making charge and GST are shown separately. Purchases are made in person at the showroom.
                  </p>
                </div>

                <div data-reveal="0.26" className="mt-8 grid gap-3">
                  <a href={wa(enquiry(p))} target="_blank" rel="noopener noreferrer" className="btn btn-solid">Enquire on WhatsApp</a>
                  <PlaceOnTray piece={p} />
                  <div className="grid grid-cols-2 gap-3">
                    <a href={wa(trial)} target="_blank" rel="noopener noreferrer" className="btn btn-line !px-3">Reserve a trial</a>
                    <a href={mail} className="btn btn-line !px-3">Email enquiry</a>
                    <a href={tel()} className="btn btn-line !px-3">Call</a>
                    <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line !px-3">Directions</a>
                  </div>
                </div>

                <nav aria-label="More pieces" className="mt-10 flex justify-between gap-4 border-t border-gold/20 pt-5 text-sm">
                  <a href={`/pieces/${prev.slug}`} className="text-ivory/70 hover:text-gold-soft">← {prev.name}</a>
                  <a href={`/pieces/${next.slug}`} className="text-right text-ivory/70 hover:text-gold-soft">{next.name} →</a>
                </nav>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {rel.length > 0 && (
        <section aria-labelledby="related" className="border-t border-gold/15 py-16 md:py-20">
          <div className="shell flex items-end justify-between gap-4">
            <h2 id="related" className="display-m">You may also like</h2>
            <a href={`/collections/${cat.slug}`} className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-soft hover:underline">All {cat.name} →</a>
          </div>
          <ul className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] lg:mx-auto lg:grid lg:max-w-[1440px] lg:grid-cols-6 lg:gap-6 lg:overflow-visible">
            {rel.map((r) => (
              <li key={r.code} className="w-[58vw] max-w-[260px] shrink-0 snap-start scroll-ml-[var(--gutter)] lg:w-auto lg:max-w-none">
                <PieceCard piece={r} sizes="(min-width:1024px) 15vw, 58vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ShowroomCta message={trial} heading="Hold it before you decide" />
    </Shell>
  );
}
