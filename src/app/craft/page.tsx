import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { publicAsset } from "@/lib/assets";
import { wa } from "@/content/business";
import { Breadcrumbs, Shell } from "@/components/site/shell";
import { Picture, Provenance } from "@/components/media/picture";
import { Reveal } from "@/components/motion/reveal";
import { Loupe } from "@/components/craft/loupe";
import { Chapters } from "@/components/craft/chapters";
import { InstagramEmbed } from "@/components/catalogue/instagram-embed";
import { ShowroomCta } from "@/components/catalogue/showroom-cta";

export const metadata: Metadata = {
  title: "Craftsmanship",
  description: "Look closer at traditional Indian goldsmithing — nakshi, granulation, stone setting, kundan and antique finishes — and how to care for your jewellery.",
  alternates: { canonical: "/craft" },
  openGraph: og("Craftsmanship · Svarahi", "/craft"),
};

/* Care guidance quoted from Svarahi's own FAQ (svarahi.co). */
const CARE = "Store each piece separately in a soft pouch or box, keep it away from perfume, lotions and water, and wipe it gently with a soft dry cloth after wearing.";
const DETAIL_POSTS = ["Df33YXwBa9M", "Df1Sle8Bj40", "DfjRIoakc7D"];

export default function CraftPage() {
  const hero = publicAsset("ai-craftsmanship-macro-001");
  const loupe = publicAsset("ux-nakshi-pendant-black");

  return (
    <Shell>
      <Reveal>
        <section className="relative overflow-hidden pt-24 md:pt-28" style={{ background: "radial-gradient(70% 90% at 80% 10%, #3a0c16, #140608 70%)" }}>
          <div className="shell grid items-end gap-10 pb-16 lg:grid-cols-12 lg:pb-24">
            <div className="lg:col-span-6">
              <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Craftsmanship" }]} />
              <p data-reveal className="eyebrow mt-10 text-gold-soft">Craftsmanship</p>
              <h1 data-reveal="0.1" className="display-xl mt-5 max-w-[11ch]">Look closer</h1>
              <p data-reveal="0.2" className="mt-6 max-w-lg leading-relaxed text-ivory/75">
                Good jewellery rewards a second look. This is a guide to the traditional crafts behind Indian gold — what each one is, and what to look for when a piece is in your hand at our counter.
              </p>
              <div data-reveal="0.3" className="mt-8 flex flex-wrap gap-3">
                <a href="#loupe" className="btn btn-solid">Try the loupe</a>
                <Link href="/collections" className="btn btn-line">Browse collections</Link>
              </div>
            </div>
            <figure data-arch-reveal className="arch relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden ring-1 ring-gold/30 lg:col-span-5 lg:col-start-8">
              <Picture asset={hero} sizes="(min-width:1024px) 34vw, 90vw" priority className="absolute inset-0" imgClassName="h-full w-full object-cover" />
              <Provenance asset={hero} className="absolute bottom-4 left-1/2 max-w-[90%] -translate-x-1/2 text-center" />
            </figure>
          </div>
        </section>
      </Reveal>

      <section id="loupe" aria-labelledby="loupe-title" className="scroll-mt-20 border-t border-gold/15 py-16 md:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="eyebrow text-gold-soft">The jeweller&apos;s loupe</p>
            <h2 id="loupe-title" className="display-l mt-4">What a closer look shows</h2>
            <p className="mt-5 leading-relaxed text-ivory/70">
              At the counter, a loupe is how detail is judged — the depth of a carved motif, the edge of a setting, the evenness of a finish. Move across the photograph to look the way a jeweller would.
            </p>
            <p className="mt-4 text-sm text-ivory/60">Keyboard: focus the image and use the arrow keys (hold Shift for larger steps).</p>
          </div>
          <div className="lg:col-span-8">
            <Loupe asset={loupe} />
          </div>
        </div>
      </section>

      <Chapters />

      <section aria-labelledby="ig-title" className="border-t border-gold/15 py-16 md:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-gold-soft">Svarahi pieces, up close</p>
              <h2 id="ig-title" className="display-l mt-4 max-w-[16ch]">The real detail is on our own pieces</h2>
            </div>
            <Link href="/reels" className="btn btn-line">Watch the reels</Link>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ivory/60">
            Posted by Svarahi on Instagram and shown here through Instagram&apos;s official embed. Ask us about any of them — or see them in person.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {DETAIL_POSTS.map((c) => (
              <InstagramEmbed key={c} code={c} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="care-title" className="border-t border-gold/15 bg-oxblood/40 py-16 md:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-gold-soft">Caring for your jewellery</p>
            <h2 id="care-title" className="display-l mt-4">Kept well, worn for generations</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <blockquote className="border-l border-gold pl-6 font-display text-2xl leading-snug text-ivory/90 md:text-3xl">{CARE}</blockquote>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-ivory/60">From Svarahi&apos;s care guidance</p>
            <a href={wa("Hi Svarahi, I have a question about caring for my jewellery.")} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-8">
              Ask us about care ↗
            </a>
          </div>
        </div>
      </section>

      <ShowroomCta heading="Bring a loupe to the counter" message="Hi Svarahi, I'd like to visit and see some pieces up close. When can I come in?" />
    </Shell>
  );
}
