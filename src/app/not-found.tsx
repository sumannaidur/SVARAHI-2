import type { Metadata } from "next";
import Link from "next/link";
import { wa } from "@/content/business";
import { Shell } from "@/components/site/shell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** Branded 404 — also shown for unknown piece codes and collections (notFound()). */
export default function NotFound() {
  return (
    <Shell>
      <section className="flex min-h-[80svh] items-center pt-24" style={{ background: "radial-gradient(60% 70% at 50% 30%, #3a0c16, #140608 70%)" }}>
        <div className="shell text-center">
          <p className="eyebrow text-gold-soft">404</p>
          <h1 className="display-l mx-auto mt-4 max-w-[16ch]">This page could not be found</h1>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-ivory/70">
            The piece or page may have moved. Browse the collections, or ask us on WhatsApp and we&apos;ll help you find it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/collections" className="btn btn-solid">Browse collections</Link>
            <a href={wa("Hi Svarahi, I was looking for a piece on your website but couldn't find the page.")} target="_blank" rel="noopener noreferrer" className="btn btn-line">Ask on WhatsApp ↗</a>
            <Link href="/" className="btn btn-line">Home</Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
