import Link from "next/link";
import { business, wa } from "@/content/business";

/** Mobile/tablet: persistent WhatsApp · Visit · Directions. */
export function ActionBar() {
  const item = "flex h-full flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em]";
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-velvet/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <ul className="grid h-[60px] grid-cols-3">
        <li>
          <a href={wa("Hi Svarahi, I'd like to enquire about your jewellery.")} target="_blank" rel="noopener noreferrer" className={`${item} bg-gold-soft text-velvet`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.8L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm4.4 11.7c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.5-.4Z" /></svg>
            WhatsApp
          </a>
        </li>
        <li>
          <Link href="/#visit" className={`${item} text-ivory`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6" /></svg>
            Visit
          </Link>
        </li>
        <li>
          <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className={`${item} text-ivory`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></svg>
            Directions
          </a>
        </li>
      </ul>
    </nav>
  );
}
