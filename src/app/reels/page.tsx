import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { business } from "@/content/business";
import ig from "@/content/instagram.json";
import { igPost } from "@/content/catalogue";
import { Breadcrumbs, Shell } from "@/components/site/shell";
import { ReelStage } from "@/components/social/reel-stage";
import { ShowroomCta } from "@/components/catalogue/showroom-cta";

export const metadata: Metadata = {
  title: "Reels",
  description: "Svarahi's own jewellery reels and posts from Instagram — necklaces, bridal sets, bangles and earrings from our Jayanagar showroom.",
  alternates: { canonical: "/reels" },
  openGraph: og("Reels · Svarahi", "/reels"),
};

/* Only posts without people (consent pending for the rest) that Instagram allows to embed. */
const allowed = ig.posts.filter((p) => igPost(p.code));
const STAGE = [...allowed.filter((p) => p.type === "reel"), ...allowed.filter((p) => p.type !== "reel")].map((p) => p.code);

export default function ReelsPage() {
  return (
    <Shell>
      <section className="pt-24 md:pt-28" style={{ background: "radial-gradient(60% 70% at 50% 0%, #3a0c16, #140608 70%)" }}>
        <div className="shell pb-10 text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Reels" }]} />
          </div>
          <p className="eyebrow mt-8 text-gold-soft">From @svarahijewels</p>
          <h1 className="display-l mx-auto mt-4 max-w-[16ch]">Jewellery, in motion</h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ivory/70">
            Real Svarahi pieces from our Instagram — reels first, then the latest posts. Nothing plays until you press play.
          </p>
        </div>
        <div className="shell pb-16 md:pb-24">
          <ReelStage codes={STAGE} />
        </div>
      </section>

      <section aria-labelledby="more-title" className="border-t border-gold/15 py-14 md:py-20">
        <div className="shell flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 id="more-title" className="display-m">More on Instagram</h2>
            <p className="mt-3 text-sm leading-relaxed text-ivory/60">
              Shown through Instagram&apos;s official embed — media stays on Instagram. Availability and prices of any piece are confirmed with you directly. Looking for a piece by type? <Link href="/collections" className="text-gold-soft underline underline-offset-4">Browse the collections</Link>.
            </p>
          </div>
          <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-line">Follow @svarahijewels ↗</a>
        </div>
      </section>

      <ShowroomCta heading="Seen something you like?" message="Hi Svarahi, I saw a piece on your Instagram and would like to see it in person." />
    </Shell>
  );
}
