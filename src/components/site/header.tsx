"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { business, wa } from "@/content/business";
import { publicAsset } from "@/lib/assets";
import { Picture } from "../media/picture";
import { Announcer, TrayButton, TrayDrawer } from "../tray/tray-ui";

// Absolute paths so the header works on every route (Phase 7 added /collections and /pieces).
const NAV = [
  { href: "/collections", label: "Collections" },
  { href: "/counter", label: "The counter" }, // Phase 8: the virtual counter page
  { href: "/#craft", label: "Craft" },
  { href: "/#visit", label: "Visit" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const logo = publicAsset("brand-svarahi-full-light");

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "bg-velvet/92 backdrop-blur-md" : "bg-transparent"}`}>
        <div className="shell flex h-16 items-center justify-between md:h-20">
          {/* Small, understated branding — the jewellery is the hero. */}
          <Link href="/" aria-label="Svarahi — home" className="block">
            <Picture asset={logo} sizes="80px" priority imgClassName="h-11 w-auto md:h-12" />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory/75 transition-colors hover:text-gold-soft">
                {n.label}
              </Link>
            ))}
            <a href={business.svarahiGold} target="_blank" rel="noopener noreferrer" className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory/50 transition-colors hover:text-gold-soft">
              Svarahi Gold ↗
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={wa("Hi Svarahi, I'd like to enquire about your jewellery.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-line hidden !min-h-[42px] !px-5 lg:inline-flex"
            >
              WhatsApp concierge
            </a>
            <TrayButton />
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="menu" className="flex size-11 items-center justify-center text-ivory lg:hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="M3 8h18M7 16h14" /></svg>
            </button>
          </div>
        </div>
      </header>

      <TrayDrawer />
      <Announcer />

      <div
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[60] flex flex-col bg-velvet transition-[opacity,visibility] duration-500 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
      >
        <div className="shell flex h-16 items-center justify-between">
          <Picture asset={logo} sizes="80px" imgClassName="h-11 w-auto" />
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex size-11 items-center justify-center text-ivory">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>
        <nav aria-label="Menu" className="shell mt-10 flex flex-col">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="border-b border-gold/15 py-4 font-display text-4xl text-ivory">
              {n.label}
            </Link>
          ))}
          <a href={business.svarahiGold} target="_blank" rel="noopener noreferrer" className="py-4 font-display text-3xl text-ivory/60">
            Svarahi Gold ↗
          </a>
        </nav>
      </div>
    </>
  );
}
