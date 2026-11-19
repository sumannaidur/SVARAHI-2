"use client";

/**
 * The trial tray — pieces a visitor would like laid out on the velvet counter.
 * Stored only on this device (localStorage); nothing is sent anywhere until the
 * visitor chooses to send it via WhatsApp or email. No accounts, no checkout.
 */
import { useSyncExternalStore } from "react";

const KEY = "svarahi-tray-v1";
export const TRAY_MAX = 8;
const EMPTY: string[] = [];
let state: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, TRAY_MAX) : EMPTY;
  } catch {
    return EMPTY; // storage blocked (private mode) — tray works for this page view only
  }
}
function ensure() {
  if (!loaded && typeof window !== "undefined") {
    state = read();
    loaded = true;
  }
}
function set(next: string[]) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = read();
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}
const getSnapshot = () => (ensure(), state);
const getServerSnapshot = () => EMPTY;

export function useTray() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export type AddResult = "added" | "exists" | "full";
export function addToTray(code: string): AddResult {
  ensure();
  if (state.includes(code)) return "exists";
  if (state.length >= TRAY_MAX) return "full";
  set([...state, code]);
  return "added";
}
export function removeFromTray(code: string) {
  ensure();
  set(state.filter((c) => c !== code));
}
export function clearTray() {
  set(EMPTY);
}

/** Drawer open/close via a DOM event so any component can open it. */
export const openTray = () => window.dispatchEvent(new CustomEvent("svarahi:tray-open"));

/** Polite screen-reader announcements for tray changes. */
export function announce(msg: string) {
  window.dispatchEvent(new CustomEvent("svarahi:announce", { detail: msg }));
}
