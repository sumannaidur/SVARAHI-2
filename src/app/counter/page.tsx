import type { Metadata } from "next";
import { og } from "@/lib/site";
import { Breadcrumbs, Shell } from "@/components/site/shell";
import { CounterStage } from "@/components/tray/counter-stage";
import { ShowroomCta } from "@/components/catalogue/showroom-cta";

export const metadata: Metadata = {
  title: "The virtual counter",
  description: "Lay out Svarahi pieces on a virtual velvet counter, place your favourites on a trial tray, and send it to us to reserve a showroom trial in Jayanagar.",
  alternates: { canonical: "/counter" },
  openGraph: og("The virtual counter · Svarahi", "/counter"),
};

const STEPS = [
  { t: "Lay them out", d: "Choose a collection and the pieces are placed on the counter, the way we would show them to you." },
  { t: "Fill your tray", d: "Drag a piece onto the velvet tray, or tap “+ Trial tray”. Up to eight pieces — saved only on this device." },
  { t: "Send it to us", d: "Reserve a trial on WhatsApp with one tap. We'll confirm availability and have them waiting at the counter." },
];

export default function CounterPage() {
  return (
    <Shell>
      <section className="pt-24 md:pt-28" style={{ background: "radial-gradient(60% 80% at 50% 0%, #3a0c16, #140608 70%)" }}>
        <div className="shell pb-6 text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "The virtual counter" }]} />
          </div>
          <p className="eyebrow mt-8 text-gold-soft">The virtual counter</p>
          <h1 className="display-l mx-auto mt-4 max-w-[18ch]">Lay it out on velvet before you visit</h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ivory/70">
            Build a trial tray of the pieces you&apos;d like to see. Send it to us, and they&apos;ll be waiting on the counter when you come to Jayanagar.
          </p>
        </div>
      </section>

      <CounterStage />

      <section aria-labelledby="how" className="border-t border-gold/15 py-16 md:py-20">
        <div className="shell">
          <h2 id="how" className="display-m">How the trial tray works</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="border-t border-gold/30 pt-5">
                <p className="font-display text-lg italic text-gold">0{i + 1}</p>
                <h3 className="mt-2 font-display text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-2xl text-xs leading-relaxed text-ivory/60">
            The counter is a conceptual visualisation, not a photograph of our showroom. Piece images are licensed style references or photographs still to come — never the actual piece. Nothing is reserved or priced online: availability and prices are confirmed with you, and purchases are made in person.
          </p>
        </div>
      </section>

      <ShowroomCta />
    </Shell>
  );
}
