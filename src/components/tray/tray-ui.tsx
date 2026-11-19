"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { business, wa } from "@/content/business";
import { getPieceByCode, trayMessage, type Piece } from "@/content/catalogue";
import { publicAsset } from "@/lib/assets";
import { addToTray, announce, clearTray, openTray, removeFromTray, TRAY_MAX, useTray } from "@/lib/tray";
import { Picture } from "../media/picture";

/** Small arch thumbnail: cleared representative image or the monogram. */
export function TrayThumb({ piece, className = "size-14" }: { piece: Piece; className?: string }) {
  if (piece.image) {
    const a = publicAsset(piece.image);
    return (
      <span className={`arch relative block shrink-0 overflow-hidden ring-1 ring-gold/30 ${className}`} style={{ backgroundColor: a.dominant }}>
        <Picture asset={a} sizes="64px" className="absolute inset-0" imgClassName="h-full w-full object-cover" />
      </span>
    );
  }
  const m = publicAsset("brand-svarahi-mark");
  return (
    <span className={`arch relative flex shrink-0 items-center justify-center bg-oxblood ring-1 ring-gold/30 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative brand mark */}
      <img src={`${m.path}-${m.widths[0]}.png`} alt="" aria-hidden width={240} height={240} className="w-1/2 opacity-30" />
    </span>
  );
}

const TrayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
    <path d="M3 15h18l-2 4H5l-2-4ZM7 15c0-3 2-7 5-7s5 4 5 7" />
    <path d="M12 8V5" />
  </svg>
);

export function TrayButton() {
  const tray = useTray();
  return (
    <button
      type="button"
      onClick={openTray}
      aria-label={`Your trial tray, ${tray.length} ${tray.length === 1 ? "piece" : "pieces"}`}
      className="relative flex size-11 items-center justify-center text-ivory transition-colors hover:text-gold-soft"
    >
      <TrayIcon />
      {tray.length > 0 && (
        <span className="absolute right-0.5 top-1 flex size-[18px] items-center justify-center rounded-full bg-gold-soft text-[10px] font-bold tabular-nums text-velvet">
          {tray.length}
        </span>
      )}
    </button>
  );
}

export function PlaceOnTray({ piece, compact = false }: { piece: Piece; compact?: boolean }) {
  const tray = useTray();
  const on = tray.includes(piece.code);
  const toggle = () => {
    if (on) {
      removeFromTray(piece.code);
      announce(`${piece.name} removed from your tray.`);
      return;
    }
    const r = addToTray(piece.code);
    announce(r === "full" ? `Your tray is full — it holds ${TRAY_MAX} pieces. Remove one to add another.` : `${piece.name} placed on your tray.`);
  };
  if (compact)
    return (
      <button type="button" onClick={toggle} aria-pressed={on} className={`text-[0.66rem] font-semibold uppercase tracking-[0.18em] transition-colors ${on ? "text-gold-soft" : "text-ivory/60 hover:text-gold-soft"}`}>
        {on ? "On your tray ✓" : "+ Trial tray"}
      </button>
    );
  return (
    <button type="button" onClick={toggle} aria-pressed={on} className={`btn ${on ? "btn-solid" : "btn-line"}`}>
      {on ? "On your trial tray ✓" : "Place on my trial tray"}
    </button>
  );
}

/** Polite live region shared by all tray interactions. */
export function Announcer() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const on = (e: Event) => {
      setMsg("");
      requestAnimationFrame(() => setMsg((e as CustomEvent<string>).detail));
    };
    window.addEventListener("svarahi:announce", on);
    return () => window.removeEventListener("svarahi:announce", on);
  }, []);
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {msg}
    </p>
  );
}

export function TrayDrawer() {
  const tray = useTray();
  const [open, setOpen] = useState(false);
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const items = tray.map(getPieceByCode).filter((p): p is Piece => !!p);

  useEffect(() => {
    const on = () => {
      opener.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener("svarahi:tray-open", on);
    return () => window.removeEventListener("svarahi:tray-open", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    close.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.documentElement.style.overflow = "";
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  const mail = `mailto:${business.email}?subject=${encodeURIComponent("Showroom trial request")}&body=${encodeURIComponent(trayMessage(tray) + "\n\nName:\nPhone:\n")}`;

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "visible" : "invisible"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-velvet/70 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="tray-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-velvet ring-1 ring-gold/25 transition-transform duration-500 ease-[var(--ease-velvet)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-gold/20 px-6 py-5">
          <div>
            <p className="eyebrow !text-[0.6rem] text-gold-soft">Your trial tray</p>
            <h2 id="tray-title" className="font-display text-2xl">
              {items.length ? `${items.length} of ${TRAY_MAX} pieces` : "Nothing on the tray yet"}
            </h2>
          </div>
          <button ref={close} type="button" onClick={() => setOpen(false)} aria-label="Close tray" className="flex size-11 items-center justify-center text-ivory hover:text-gold-soft">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length ? (
            <ul className="space-y-4">
              {items.map((p) => (
                <li key={p.code} className="flex items-center gap-4 border-b border-gold/10 pb-4">
                  <TrayThumb piece={p} />
                  <div className="min-w-0 flex-1">
                    <Link href={`/pieces/${p.slug}`} onClick={() => setOpen(false)} className="font-display text-lg leading-tight hover:text-gold-soft">{p.name}</Link>
                    <p className="text-[11px] tracking-[0.14em] text-ivory/50">{p.code}</p>
                  </div>
                  <button type="button" onClick={() => { removeFromTray(p.code); announce(`${p.name} removed from your tray.`); }} aria-label={`Remove ${p.name}`} className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ivory/55 hover:text-gold-soft">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm leading-relaxed text-ivory/65">
              <p>Place pieces on your tray from the catalogue or the virtual counter. Send the tray to us and we&apos;ll have them laid out on the velvet counter when you visit.</p>
              <Link href="/counter" onClick={() => setOpen(false)} className="btn btn-line mt-6">Open the virtual counter</Link>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-gold/20 px-6 py-5">
            <a href={wa(trayMessage(tray))} target="_blank" rel="noopener noreferrer" className="btn btn-solid w-full">Reserve a trial on WhatsApp</a>
            <div className="grid grid-cols-2 gap-3">
              <a href={mail} className="btn btn-line !px-3">Email the tray</a>
              <button type="button" onClick={() => { clearTray(); announce("Tray cleared."); }} className="btn btn-line !px-3">Clear tray</button>
            </div>
            <p className="text-[11px] leading-relaxed text-ivory/45">Saved only on this device. Nothing is sent until you choose WhatsApp or email. Prices and availability are confirmed in person.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
