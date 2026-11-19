import Link from "next/link";
import { business, wa } from "@/content/business";

/** Reusable conversion band: the showroom is the destination. */
export function ShowroomCta({ message = "Hi Svarahi, I'd like to reserve a showroom trial. When can I visit?", heading = "See it in the light" }: { message?: string; heading?: string }) {
  return (
    <section aria-label="Visit the showroom" className="bg-ivory text-ink">
      <div className="shell grid items-center gap-8 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-7">
          <p className="eyebrow text-sindoor">The showroom is the destination</p>
          <h2 className="display-l mt-4">{heading}</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-ink/70">
            Every purchase is made in person at our Jayanagar showroom. Prices are confirmed by weight and the day&apos;s metal rate, with the making charge and GST shown separately.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:col-span-5">
          <a href={wa(message)} target="_blank" rel="noopener noreferrer" className="btn border-ink bg-ink text-ivory hover:bg-maroon">Reserve a showroom trial</a>
          <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn border-maroon text-maroon hover:bg-maroon/5">Google Maps directions</a>
          <Link href="/visit" className="py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-maroon underline-offset-4 hover:underline">Plan your visit →</Link>
        </div>
      </div>
    </section>
  );
}
