import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { approvedClaim, business, tel, wa } from "@/content/business";
import { publicAsset } from "@/lib/assets";
import { Breadcrumbs, Shell } from "@/components/site/shell";
import { Picture, Provenance } from "@/components/media/picture";
import { Reveal } from "@/components/motion/reveal";
import { VisitPlanner } from "@/components/visit/visit-planner";

export const metadata: Metadata = {
  title: "Visit the showroom",
  description: "Plan a visit to Svarahi's jewellery showroom in Jayanagar, Bengaluru — reserve a trial, talk to our concierge on WhatsApp, and get directions.",
  alternates: { canonical: "/visit" },
  openGraph: og("Visit the showroom · Svarahi", "/visit"),
};

const EXPECT = [
  { t: "A seat at the counter", d: "Tell us what you're looking for. If you sent a trial tray, those pieces are already laid out." },
  { t: "Try everything on", d: "Take your time, with whoever you've brought along." },
  { t: "The price, explained", d: "Each piece is priced by its weight and the day's metal rate, with the making charge and GST shown separately." },
  { t: "Decide in person", d: "Every purchase is made in the showroom. There's no online checkout, and no pressure to decide on the day." },
];

/* LocalBusiness structured data — verified facts only (no hours, rating or price range until approved). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: business.name,
  slogan: business.positioning,
  telephone: business.phone.tel,
  email: business.email,
  address: { "@type": "PostalAddress", streetAddress: business.postal.street, addressLocality: business.postal.locality, addressRegion: business.postal.region, postalCode: business.postal.code, addressCountry: business.postal.country },
  geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
  hasMap: business.mapsUrl,
  sameAs: [business.instagram],
};

export default function VisitPage() {
  const img = publicAsset("ux-display-jhumka-wall");
  const hours = approvedClaim("hours");
  const contacts = [
    { k: "WhatsApp concierge", v: business.phone.display, href: wa("Hi Svarahi, I have a question before I visit."), ext: true },
    { k: "Call", v: business.phone.display, href: tel(), ext: false },
    { k: "Email", v: business.email, href: `mailto:${business.email}`, ext: false },
    { k: "Directions", v: "Open in Google Maps", href: business.mapsUrl, ext: true },
  ];

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Reveal>
        <section className="relative overflow-hidden pt-24 md:pt-28" style={{ background: "radial-gradient(70% 90% at 85% 10%, #3a0c16, #140608 70%)" }}>
          <div className="shell grid items-center gap-12 pb-16 lg:grid-cols-12 lg:pb-24">
            <div className="lg:col-span-6">
              <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Visit" }]} />
              <p data-reveal className="eyebrow mt-10 text-gold-soft">The showroom is the destination</p>
              <h1 data-reveal="0.1" className="display-xl mt-5 max-w-[11ch]">Come and see it in the light</h1>
              <address data-reveal="0.2" className="mt-8 font-display text-2xl not-italic leading-snug text-ivory/90">
                {business.address.map((l) => <span key={l} className="block">{l}</span>)}
              </address>
              <p data-reveal="0.25" className="mt-3 text-sm text-ivory/60">Landmark: {business.landmark}</p>
              <div data-reveal="0.3" className="mt-8 flex flex-wrap gap-3">
                <a href="#plan" className="btn btn-solid">Plan your visit</a>
                <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line">Directions ↗</a>
              </div>
            </div>
            <figure data-arch-reveal className="arch relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden ring-1 ring-gold/30 lg:col-span-5 lg:col-start-8">
              <Picture asset={img} sizes="(min-width:1024px) 34vw, min(90vw, 448px)" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
              <Provenance asset={img} className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap" />
            </figure>
          </div>
        </section>
      </Reveal>

      <section id="plan" aria-labelledby="plan-title" className="scroll-mt-20 border-t border-gold/15 py-16 md:py-24">
        <div className="shell">
          <p className="eyebrow text-gold-soft">Plan your visit</p>
          <h2 id="plan-title" className="display-l mt-4 max-w-[18ch]">Tell us when, and what you&apos;d like to see</h2>
          <p className="mt-4 max-w-2xl text-ivory/65">We&apos;ll reply to confirm a time and have pieces ready at the counter.</p>
          <div className="mt-10">
            <VisitPlanner />
          </div>
        </div>
      </section>

      <section aria-labelledby="expect-title" className="border-t border-gold/15 bg-oxblood/40 py-16 md:py-24">
        <div className="shell">
          <p className="eyebrow text-gold-soft">At the showroom</p>
          <h2 id="expect-title" className="display-l mt-4">What to expect</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {EXPECT.map((s, k) => (
              <li key={s.t} className="border-t border-gold/30 pt-5">
                <p className="font-display text-lg italic text-gold">0{k + 1}</p>
                <h3 className="mt-2 font-display text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="contact-title" className="border-t border-gold/15 py-16 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-gold-soft">The concierge</p>
            <h2 id="contact-title" className="display-l mt-4">Ask us anything first</h2>
            <dl className="mt-8 space-y-5 text-sm">
              <div>
                <dt className="eyebrow !text-[0.62rem] text-ivory/60">Opening hours</dt>
                <dd className="mt-1 text-ivory/85">{hours ? hours.claim : "To be confirmed — please call or WhatsApp before visiting"}</dd>
              </div>
              <div>
                <dt className="eyebrow !text-[0.62rem] text-ivory/60">What customers say</dt>
                <dd className="mt-1 text-ivory/85">
                  <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-gold-soft underline underline-offset-4">Read reviews on Google Maps ↗</a>
                </dd>
              </div>
            </dl>
          </div>
          <ul className="grid gap-px self-start bg-gold/20 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {contacts.map((c) => (
              <li key={c.k} className="bg-velvet">
                <a href={c.href} {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex h-full min-h-32 flex-col justify-between p-6 transition-colors hover:bg-oxblood/60">
                  <span className="eyebrow !text-[0.62rem] text-gold-soft">{c.k}</span>
                  <span className="mt-6 flex items-end justify-between gap-4 font-display text-xl break-all">
                    {c.v}
                    <span aria-hidden className="text-gold transition-transform group-hover:translate-x-1">{c.ext ? "↗" : "→"}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Svarahi Gold" className="border-t border-gold/15 py-12">
        <div className="shell">
          <Link href="/gold" className="group flex flex-wrap items-center justify-between gap-6 border border-gold/25 p-6 transition-colors hover:border-gold md:p-8">
            <span>
              <span className="eyebrow block text-gold-soft">Looking for gold or silver bullion?</span>
              <span className="mt-2 block text-ivory/70">Bullion is handled by Svarahi Gold, our separate platform.</span>
            </span>
            <span className="font-display text-2xl text-gold transition-transform group-hover:translate-x-1">About Svarahi Gold →</span>
          </Link>
        </div>
      </section>
    </Shell>
  );
}
