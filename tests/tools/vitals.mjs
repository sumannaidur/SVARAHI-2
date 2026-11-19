// LCP/CLS/INP field-style measurement with mobile throttling (CDP): 4× CPU, ~Fast 3G/slow 4G network.
// usage: node lcp11.mjs <base> <path>...
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
const [base, ...paths] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: BROWSER });
for (const mode of ["mobile", "desktop"]) {
  for (const path of paths) {
    const ctx = await b.newContext(mode === "mobile" ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    if (mode === "mobile") {
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    }
    await p.addInitScript(() => {
      window.__lcp = []; window.__cls = 0; window.__inp = 0;
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lcp.push({ t: Math.round(e.startTime), el: e.element ? e.element.tagName + (e.element.id ? "#" + e.element.id : "") + " " + (e.element.className?.baseVal ?? e.element.className ?? "").toString().slice(0, 60) + " " + (e.url ? e.url.split("/").pop() : (e.element.textContent || "").trim().slice(0, 40)) : "?", size: e.size }))).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.interactionId && e.duration > window.__inp) { window.__inp = e.duration; window.__inpD = `${e.name} on ${e.target?.tagName}[${(e.target?.getAttribute?.("aria-label") || e.target?.textContent || "").trim().slice(0, 30)}] delay ${Math.round(e.processingStart - e.startTime)} proc ${Math.round(e.processingEnd - e.processingStart)} paint ${Math.round(e.startTime + e.duration - e.processingEnd)}`; } })).observe({ type: "event", buffered: true, durationThreshold: 16 });
    });

    await p.goto(base + path, { waitUntil: "load", timeout: 90000 });
    await p.waitForTimeout(mode === "mobile" ? +(process.env.IDLE || 5000) : 2500);
    // one interaction for INP: tap the first visible button (not a link), else scroll
    const btn = p.locator(process.env.SEL || "main button:visible").first();
    if (await btn.count()) { await btn.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(2500); await p.evaluate(() => { window.__inp = 0; }); await btn.click({ timeout: 3000 }).catch(() => {}); }
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => ({ lcp: window.__lcp.at(-1), all: window.__lcp.map((x) => `${x.t}:${x.el.slice(0, 50)}`), cls: +window.__cls.toFixed(3), inp: Math.round(window.__inp), inpD: window.__inpD, fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0), vitals: (window.__svarahiVitals || []).map((v) => `${v.name}=${v.value}`).join(" ") }));
    console.log(`${mode.padEnd(7)} ${path.padEnd(22)} FCP ${r.fcp}  LCP ${r.lcp?.t}ms  CLS ${r.cls}  INP≈${r.inp}ms (${r.inpD}) | LCP el: ${r.lcp?.el}\n          candidates: ${r.all.join("  →  ")}\n          next/web-vitals: ${r.vitals}`);
    await ctx.close();
  }
}
await b.close();
