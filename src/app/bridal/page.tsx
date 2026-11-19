import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { wa } from "@/content/business";
import { piecesIn } from "@/content/catalogue";
import { publicAsset } from "@/lib/assets";
import { Breadcrumbs, Shell } from "@/components/site/shell";
import { Picture, Provenance } from "@/components/media/picture";
import { Reveal } from "@/components/motion/reveal";
import { ArchCarousel } from "@/components/bridal/arch-carousel";
import { PieceCard } from "@/components/catalogue/piece-card";
import { InstagramEmbed } from "@/components/catalogue/instagram-embed";
import { ShowroomCta } from "@/components/catalogue/showroom-cta";

export const metadata: Metadata = {
  title: "Bridal & heritage",
  description: "Bridal and heritage jewellery styles — temple, kundan and layered gold — and how to book a bridal trial at Svarahi's Jayanagar showroom.",
  alternates: { canonical: "/bridal" },
  openGraph: og("Bridal & heritage · Svarahi", "/bridal"),
};

const TRIAL_MSG = "Hi Svarahi, I'd like to reserve a bridal trial at the showroom. Wedding date: ___. Looks I like: ___.";

const STEPS = [
  { t: "Tell us about the wedding", d: "The date, the outfits and the looks you like. A message on WhatsApp is enough to start." },
  { t: "We prepare the counter", d: "Sets in the styles you choose are laid out for you before you arrive." },
  { t: "Try them on, with family", d: "Take your time in the showroom. Weight, metal rate, making charge and GST are explained piece by piece." },
  { t: "Decide when you're ready", d: "Bridal sets are rarely chosen in one visit. Come back as often as you need." },
];

export default function BridalPage() {
  const hero = publicAsset("ai-hero-bridal-001");
  const seen = new Set<string>();
  const pieces = [...piecesIn("bridal"), ...piecesIn("temple-antique"), ...piecesIn("necklaces")].filter((p) => !seen.has(p.code) && seen.add(p.code)).slice(0, 8);

  return (
    <Shell>
      <Reveal>
        <section className="relative overflow-hidden bg-velvet pt-16 md:pt-20">
          <div className="relative lg:min-h-[min(88svh,820px)]">
            <figure className="relative aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
              <Picture asset={hero} sizes="100vw" priority className="absolute inset-0" imgClassName="h-full w-full object-cover object-[70%_center]" />
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#140608_0%,rgb(20_6_8/0.85)_30%,transparent_65%)] max-lg:bg-[linear-gradient(0deg,#140608_0%,transparent_45%)]" />
              <Provenance asset={hero} className="absolute bottom-4 right-4" />
            </figure>
            <div className="shell relative pb-14 pt-6 lg:flex lg:min-h-[min(88svh,820px)] lg:items-center lg:py-20">
              <div className="max-w-xl">
                <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Bridal & heritage" }]} />
                <p data-reveal className="eyebrow mt-8 text-gold-soft">Bridal &amp; heritage</p>
                <h1 data-reveal="0.1" className="display-xl mt-5 max-w-[13ch] !text-[clamp(3rem,6.2vw,6.4rem)]">Chosen together, worn for a lifetime</h1>
                <p data-reveal="0.2" className="mt-6 max-w-md leading-relaxed text-ivory/75">
                  Temple, kundan and layered gold — explore the styles, then come to Jayanagar and try complete sets on, with the people whose opinion matters.
                </p>
                <div data-reveal="0.3" className="mt-8 flex flex-wrap gap-3">
                  <a href={wa(TRIAL_MSG)} target="_blank" rel="noopener noreferrer" className="btn btn-solid">Reserve a bridal trial ↗</a>
                  <a href="#looks" className="btn btn-line">Explore the looks</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <section id="looks" aria-labelledby="looks-title" className="scroll-mt-20 border-t border-gold/15 py-16 md:py-24" style={{ background: "radial-gradient(60% 60% at 50% 40%, #3a0c16, #140608 75%)" }}>
        <div className="shell">
          <div className="text-center">
            <p className="eyebrow text-gold-soft">Styles to start from</p>
            <h2 id="looks-title" className="display-l mx-auto mt-4 max-w-[18ch]">Nine bridal &amp; heritage looks</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ivory/60">Drag, use the arrows, or the arrow keys. Every image is a style reference — licensed photography or an AI concept — not a Svarahi piece.</p>
          </div>
          <div className="mt-10">
            <ArchCarousel />
          </div>
        </div>
      </section>

      <section aria-labelledby="trial-title" className="border-t border-gold/15 py-16 md:py-24">
        <div className="shell">
          <p className="eyebrow text-gold-soft">The bridal trial</p>
          <h2 id="trial-title" className="display-l mt-4 max-w-[16ch]">How a bridal trial works</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, k) => (
              <li key={s.t} className="border-t border-gold/30 pt-5">
                <p className="font-display text-lg italic text-gold">0{k + 1}</p>
                <h3 className="mt-2 font-display text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="pieces-title" className="border-t border-gold/15 py-16 md:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-gold-soft">From our catalogue</p>
              <h2 id="pieces-title" className="display-l mt-4 max-w-[18ch]">Pieces for the trial tray</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/counter" className="btn btn-line">Open the counter</Link>
              <Link href="/collections/bridal" className="btn btn-line">Bridal collection</Link>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-ivory/60">Add the pieces you&apos;d like to try to your trial tray and send it to us with your wedding date.</p>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {pieces.map((p) => (
              <PieceCard key={p.code} piece={p} sizes="(min-width:1024px) 22vw, 45vw" />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="bridal-reels" className="border-t border-gold/15 py-16 md:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-gold-soft">On Instagram</p>
            <h2 id="bridal-reels" className="display-l mt-4">Svarahi sets, in motion</h2>
            <p className="mt-4 text-ivory/65">Two of our own reels — real Svarahi jewellery.</p>
            <Link href="/reels" className="btn btn-line mt-6">All reels</Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
            <InstagramEmbed code="Dfl11nDlO1E" />
            <InstagramEmbed code="DfoapF2lJmf" />
          </div>
        </div>
      </section>

      <ShowroomCta heading="Reserve a bridal trial" message={TRIAL_MSG} />
    </Shell>
  );
}
