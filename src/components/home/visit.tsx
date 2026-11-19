import { approvedClaim, business, tel, wa } from "@/content/business";

/** CUSTOMER ACTIONS — the showroom is the destination. Verified details only. */
export function Visit() {
  const hours = approvedClaim("hours"); // pending → not rendered as fact
  return (
    <section id="visit" aria-labelledby="visit-title" className="bg-ivory text-ink">
      <div className="shell grid gap-14 py-24 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-6">
          <p className="eyebrow text-sindoor">The destination</p>
          <h2 id="visit-title" className="display-xl mt-5">
            Find the piece that becomes <em className="text-maroon">yours</em>
          </h2>
          <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-ink/75">
            Every piece is chosen in person. Come and see it in the light, try it on, and take your time.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <a href={wa("Hi Svarahi, I'd like to enquire about your jewellery.")} target="_blank" rel="noopener noreferrer" className="btn border-ink bg-ink text-ivory hover:bg-maroon">
              Enquire on WhatsApp
            </a>
            <a href="#collections" className="btn border-maroon text-maroon hover:bg-maroon/5">Explore collections</a>
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn border-maroon text-maroon hover:bg-maroon/5">Google Maps directions</a>
            <a href={tel()} className="btn border-maroon text-maroon hover:bg-maroon/5">Call {business.phone.display}</a>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="overflow-hidden rounded-t-[140px] bg-velvet p-8 pt-24 text-center text-ivory ring-1 ring-gold/40 sm:rounded-t-[200px] md:p-14 md:pt-28">
            <p className="eyebrow text-gold-soft">Visit the showroom</p>
            <address className="mt-6 font-display text-[1.7rem] not-italic leading-snug">
              {business.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
            <dl className="mt-8 grid gap-5 border-t border-gold/25 pt-6 text-sm">
              <div>
                <dt className="eyebrow !text-[0.62rem] text-ivory/60">Hours</dt>
                <dd className="mt-1 text-ivory/85">{hours ? hours.claim : "To be confirmed — please call or WhatsApp before visiting"}</dd>
              </div>
              <div>
                <dt className="eyebrow !text-[0.62rem] text-ivory/60">Phone</dt>
                <dd className="mt-1"><a href={tel()} className="hover:text-gold-soft">{business.phone.display}</a></dd>
              </div>
              <div>
                <dt className="eyebrow !text-[0.62rem] text-ivory/60">Email</dt>
                <dd className="mt-1"><a href={`mailto:${business.email}`} className="break-all hover:text-gold-soft">{business.email}</a></dd>
              </div>
            </dl>
          </div>

          <a href={business.svarahiGold} target="_blank" rel="noopener noreferrer" className="group mt-6 flex items-center justify-between gap-6 border border-ink/15 p-6 transition-colors hover:border-maroon">
            <span>
              <span className="eyebrow block text-maroon">Svarahi Gold</span>
              <span className="mt-2 block text-sm text-ink/70">Bullion rates and trading are on our separate Svarahi Gold platform.</span>
            </span>
            <span className="font-display text-2xl text-maroon transition-transform group-hover:translate-x-1">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
