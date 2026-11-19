"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Performance monitoring (LCP, INP, CLS, FCP, TTFB). Kept on the device:
 * metrics are collected on window.__svarahiVitals for QA and logged in
 * development. Nothing is sent anywhere — connecting an analytics endpoint
 * needs owner approval (privacy notice + vendor choice).
 */
type Vital = { name: string; value: number; rating?: string; id: string; path: string };
declare global {
  interface Window {
    __svarahiVitals?: Vital[];
  }
}

export function WebVitals() {
  useReportWebVitals((m) => {
    const v: Vital = { name: m.name, value: Math.round(m.name === "CLS" ? m.value * 1000 : m.value) / (m.name === "CLS" ? 1000 : 1), rating: m.rating, id: m.id, path: location.pathname };
    (window.__svarahiVitals ??= []).push(v);
    if (process.env.NODE_ENV === "development") console.debug(`[vitals] ${v.name} ${v.value} (${v.rating}) ${v.path}`);
  });
  return null;
}
