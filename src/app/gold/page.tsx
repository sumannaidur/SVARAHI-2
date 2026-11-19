import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { business } from "@/content/business";
import { Breadcrumbs, Shell } from "@/components/site/shell";
import { Reveal } from "@/components/motion/reveal";
import { IngotStack } from "@/components/gold/ingot-stack";

export const metadata: Metadata = {
  title: "Svarahi Gold",
  description: "Svarahi Gold is Svarahi's separate bullion platform for gold and silver. This page explains the difference and opens Svarahi Gold in a new tab.",
  alternates: { canonical: "/gold" },
  openGraph: og("Svarahi Gold · Svarahi", "/gold"),
};

/**
 * Bridge to the separate bullion platform. Deliberately contains no rates,
 * no account features and no data exchange — it explains and links out.
 */
const COMPARE = [
  { k: "What it's for", j: "Jewellery — necklaces, bridal sets, bangles, earrings and more", g: "Gold and silver bullion" },
  { k: "Prices", j: "Confirmed in person: weight × the day's metal rate, with making charge and GST shown separately", g: "Rates are shown on Svarahi Gold itself" },
  { k: "How you buy", j: "In person at the Jayanagar showroom", g: "On the Svarahi Gold platform, under its own terms" },
  { k: "Accounts", j: "None — your trial tray stays on your device", g: "Its own account and KYC" },
];

export default function GoldPage() {
  return (
    <Shell>
      <Reveal>
        <section className="relative overflow-hidden pt-24 md:pt-28" style={{ background: "radial-gradient(60% 80% at 75% 30%, #3a2a0c, #140608 70%)" }}>
          <div className="shell grid items-center gap-12 pb-16 lg:grid-cols-12 lg:pb-24">
            <div className="lg:col-span-6">
              <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Svarahi Gold" }]} />
              <p data-reveal className="eyebrow mt-10 text-gold-soft">A separate platform</p>
              <h1 data-reveal="0.1" className="display-xl mt-5">Svarahi Gold</h1>
              <p data-reveal="0.2" className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-ivory/75">
                For gold and silver bullion, Svarahi has a dedicated platform: Svarahi Gold. It is run separately from this jewellery website, with its own rates, accounts and KYC.
              </p>
              <div data-reveal="0.3" className="mt-8">
                <a href={business.svarahiGold} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                  Open Svarahi Gold ↗
                </a>
                <p className="mt-3 max-w-md text-xs leading-relaxed text-ivory/60">
                  Opens svarahigold.xyz in a new tab. Nothing from this website — including your trial tray — is shared with it.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <IngotStack />
            </div>
          </div>
        </section>
      </Reveal>

      <section aria-labelledby="compare-title" className="border-t border-gold/15 py-16 md:py-24">
        <div className="shell">
          <p className="eyebrow text-gold-soft">Which one do you need?</p>
          <h2 id="compare-title" className="display-l mt-4 max-w-[18ch]">Jewellery here, bullion there</h2>
          <div className="mt-10 overflow-hidden ring-1 ring-gold/25">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Svarahi jewellery website compared with the Svarahi Gold bullion platform</caption>
              <thead>
                <tr className="bg-oxblood/60">
                  <th scope="col" className="w-1/4 p-4 md:p-5"><span className="sr-only">Topic</span></th>
                  <th scope="col" className="p-4 font-display text-xl font-normal md:p-5">Svarahi jewellery</th>
                  <th scope="col" className="p-4 font-display text-xl font-normal text-gold-soft md:p-5">Svarahi Gold</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.k} className="border-t border-gold/15 align-top">
                    <th scope="row" className="eyebrow p-4 !text-[0.6rem] font-semibold text-ivory/55 md:p-5">{r.k}</th>
                    <td className="p-4 leading-relaxed text-ivory/80 md:p-5">{r.j}</td>
                    <td className="p-4 leading-relaxed text-ivory/80 md:p-5">{r.g}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ivory/60">
            This website never shows gold or silver rates. For the day&apos;s jewellery pricing, ask us at the showroom or on WhatsApp.
          </p>
        </div>
      </section>

      <section aria-labelledby="next-title" className="border-t border-gold/15 bg-oxblood/40 py-16 md:py-20">
        <div className="shell grid gap-6 md:grid-cols-2">
          <h2 id="next-title" className="sr-only">Where next</h2>
          <a href={business.svarahiGold} target="_blank" rel="noopener noreferrer" className="group border border-gold/30 p-8 transition-colors hover:border-gold">
            <span className="eyebrow block text-gold-soft">Bullion</span>
            <span className="mt-3 block font-display text-3xl">Go to Svarahi Gold ↗</span>
            <span className="mt-2 block text-sm text-ivory/60">svarahigold.xyz — separate platform, new tab</span>
          </a>
          <Link href="/collections" className="group border border-gold/30 p-8 transition-colors hover:border-gold">
            <span className="eyebrow block text-gold-soft">Jewellery</span>
            <span className="mt-3 block font-display text-3xl">Explore the collections →</span>
            <span className="mt-2 block text-sm text-ivory/60">Then <span className="text-gold-soft">plan a visit</span> to see pieces in person</span>
          </Link>
        </div>
      </section>
    </Shell>
  );
}
