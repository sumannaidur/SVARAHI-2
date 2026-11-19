"use client";

import { useId, useState, type FormEvent } from "react";
import { business, wa } from "@/content/business";
import { getPieceByCode } from "@/content/catalogue";
import { useTray } from "@/lib/tray";

/**
 * Visit planner — composes a WhatsApp (or email) message to the showroom.
 * Nothing is stored or sent by the site itself: the visitor sees the exact
 * message, and it only leaves when they press send in WhatsApp or email.
 * Opening hours are unconfirmed, so a time *window* is requested, never a slot.
 */
const OCCASIONS = ["Bridal / wedding", "Festive", "Everyday wear", "A gift", "Just browsing"];
const WINDOWS = ["Morning", "Afternoon", "Evening", "Any time"];

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const prettyDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
};

export function VisitPlanner() {
  const id = useId();
  const tray = useTray();
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState("");
  const [win, setWin] = useState("Any time");
  const [people, setPeople] = useState("1–2");
  const [withTray, setWithTray] = useState(true);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const pieces = tray.map((c) => getPieceByCode(c)).filter((p) => p !== undefined);
  const lines = [
    `Hi Svarahi, I'd like to plan a showroom visit${name.trim() ? ` — this is ${name.trim()}` : ""}.`,
    occasion && `Occasion: ${occasion}`,
    date ? `Preferred day: ${prettyDate(date)} (${win.toLowerCase()})` : `Preferred time: ${win.toLowerCase()} — any day that suits`,
    `Group size: ${people} people`,
    withTray && pieces.length > 0 && `Pieces I'd like to see:\n${pieces.map((p) => `• ${p.name} (${p.code})`).join("\n")}`,
    notes.trim() && `Notes: ${notes.trim()}`,
    "Could you confirm a time that works?",
  ].filter(Boolean);
  const message = lines.join("\n");

  const validate = () => {
    if (date && date < today()) {
      setError("Please choose today or a later date.");
      return false;
    }
    setError("");
    return true;
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    window.open(wa(message), "_blank", "noopener,noreferrer");
  };
  const email = () => {
    if (!validate()) return;
    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent("Showroom visit")}&body=${encodeURIComponent(message)}`;
  };

  const field = "mt-2 block w-full border border-gold/35 bg-velvet px-4 py-3 text-ivory placeholder:text-ivory/60 focus:border-gold focus:outline-none";
  const label = "eyebrow !text-[0.62rem] text-gold-soft";

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <form onSubmit={submit} noValidate aria-describedby={`${id}-privacy`} className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-name`} className={label}>Your name <span className="normal-case tracking-normal text-ivory/60">(optional)</span></label>
          <input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className={field} />
        </div>
        <fieldset className="sm:col-span-2">
          <legend className={label}>The occasion</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button key={o} type="button" aria-pressed={occasion === o} onClick={() => setOccasion(occasion === o ? "" : o)} className={`min-h-11 border px-4 text-sm transition-colors ${occasion === o ? "border-gold-soft bg-gold-soft text-velvet" : "border-gold/35 text-ivory/80 hover:border-gold"}`}>
                {o}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor={`${id}-date`} className={label}>Preferred day <span className="normal-case tracking-normal text-ivory/60">(optional)</span></label>
          <input
            id={`${id}-date`}
            type="date"
            value={date}
            onFocus={(e) => (e.currentTarget.min = today())}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-err` : undefined}
            className={`${field} [color-scheme:dark]`}
          />
          {error && <p id={`${id}-err`} role="alert" className="mt-2 text-sm text-[#f3a1a1]">{error}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-win`} className={label}>Time of day</label>
          <select id={`${id}-win`} value={win} onChange={(e) => setWin(e.target.value)} className={field}>
            {WINDOWS.map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-ppl`} className={label}>Coming with</label>
          <select id={`${id}-ppl`} value={people} onChange={(e) => setPeople(e.target.value)} className={field}>
            {["1–2", "3–4", "5 or more"].map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          {pieces.length > 0 ? (
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ivory/80">
              <input type="checkbox" checked={withTray} onChange={(e) => setWithTray(e.target.checked)} className="size-5 accent-[#d4a94f]" />
              Include my trial tray ({pieces.length} {pieces.length === 1 ? "piece" : "pieces"})
            </label>
          ) : (
            <p className="text-sm text-ivory/60">Tip: add pieces to your trial tray and they&apos;ll be included here.</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-notes`} className={label}>Anything we should know <span className="normal-case tracking-normal text-ivory/60">(optional)</span></label>
          <textarea id={`${id}-notes`} value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={400} placeholder="Outfit colours, a style you have in mind, a wedding date…" className={field} />
        </div>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" className="btn btn-solid">Send on WhatsApp ↗</button>
          <button type="button" onClick={email} className="btn btn-line">Email instead</button>
        </div>
        <p id={`${id}-privacy`} className="text-xs leading-relaxed text-ivory/60 sm:col-span-2">
          Nothing is saved or sent by this website. Your message opens in WhatsApp or your email app, and only leaves when you press send there.
        </p>
      </form>

      <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
        <p className={label}>Your message</p>
        <pre aria-live="polite" className="mt-3 whitespace-pre-wrap border-l-2 border-gold/50 bg-oxblood/50 p-5 font-sans text-sm leading-relaxed text-ivory/85">{message}</pre>
      </div>
    </div>
  );
}
