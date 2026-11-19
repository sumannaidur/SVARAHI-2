// Curated owner-presentation screenshots (desktop 1440×900 + mobile 390×844 @2x).
// usage: node tests/tools/owner-shots.mjs <base> <outDir>
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
import { mkdirSync } from "node:fs";
const [base = "http://localhost:3200", out = "docs/owner-presentation/screens"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: BROWSER });
const hydrated = (p, sel = "header button") => p.waitForFunction((s) => { const e = document.querySelector(s); return e && Object.keys(e).some((k) => k.startsWith("__reactProps")); }, sel, { timeout: 20000 }).catch(() => {});
const to = async (p, sel, offset = 90) => { await p.evaluate(([s, o]) => { const e = document.querySelector(s); if (e) scrollTo({ top: e.getBoundingClientRect().top + scrollY - o, behavior: "instant" }); }, [sel, offset]); await p.waitForTimeout(1800); };

const SHOTS = [
  { id: "01-home", path: "/", act: async (p) => { await p.waitForTimeout(2200); } },
  { id: "02-collections", path: "/collections", act: async (p) => { await p.waitForTimeout(1500); } },
  { id: "03-category-bridal", path: "/collections/bridal", act: async (p) => { await p.waitForTimeout(1500); } },
  { id: "04-piece-zoom", path: "/pieces/sv-b01", act: async (p, m) => { await hydrated(p, '[role="button"][aria-pressed]'); if (m === "desktop") { const z = p.locator('[aria-label="Zoom in on the image"]'); const bb = await z.boundingBox(); await p.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.45); await z.click(); await p.waitForTimeout(800); } else await p.waitForTimeout(1200); } },
  { id: "05-counter-tray", path: "/counter", act: async (p, m) => { await hydrated(p, '[role="tab"]'); await to(p, '[role="tablist"]', m === "mobile" ? 70 : 90); const add = p.locator("#counter-display button[aria-pressed]:visible"); for (let i = 0; i < 3; i++) { await add.nth(i).click().catch(() => {}); await p.waitForTimeout(300); } await p.waitForTimeout(800); } },
  // the tray persists on the device from the previous shot — just open the drawer
  { id: "06-tray-drawer", path: "/counter", act: async (p) => { await hydrated(p, '[role="tab"]'); await p.locator('button[aria-label^="Your trial tray"]').click(); await p.waitForTimeout(900); } },
  { id: "07-craft-loupe", path: "/craft", act: async (p, m) => { await hydrated(p); await to(p, "#loupe-title", 100); const l = p.locator('[role="application"]'); const bb = await l.boundingBox(); if (m === "desktop") await p.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.58); else { await l.focus(); for (let i = 0; i < 2; i++) await p.keyboard.press("ArrowDown"); } await p.waitForTimeout(700); } },
  { id: "08-craft-chapters", path: "/craft", act: async (p, m) => { await to(p, "#chapters-title", m === "desktop" ? 0 : 90); if (m === "desktop") { await p.evaluate(() => scrollBy(0, innerHeight * 2.4)); await p.waitForTimeout(1600); } } },
  { id: "09-reels", path: "/reels", act: async (p) => { await hydrated(p, 'button[aria-label="Next post"]'); await to(p, '[aria-roledescription="carousel"]', 120); await p.waitForTimeout(3500); } },
  { id: "10-bridal-hero", path: "/bridal", act: async (p) => { await p.waitForTimeout(1800); } },
  { id: "11-bridal-carousel", path: "/bridal", act: async (p, m) => { await hydrated(p, 'button[aria-label="Next look"]'); await to(p, '[aria-label="Bridal and heritage looks"]', m === "desktop" ? 110 : 80); await p.locator('button[aria-label="Next look"]').click(); await p.waitForTimeout(700); await p.locator('button[aria-label="Next look"]').click(); await p.waitForTimeout(1500); } },
  { id: "12-visit-planner", path: "/visit", act: async (p) => { await hydrated(p, 'form button[type="submit"]'); await p.getByRole("button", { name: "Bridal / wedding" }).click(); await p.getByLabel("Time of day").selectOption("Evening"); await p.getByLabel(/Anything we should know/).fill("Temple choker to match a maroon silk saree"); await to(p, "#plan-title", 90); } },
  { id: "13-gold-bridge", path: "/gold", act: async (p) => { await p.waitForTimeout(2000); } },
  { id: "14-not-found", path: "/a-missing-page", act: async (p) => { await p.waitForTimeout(800); } },
];

for (const mode of ["desktop", "mobile"]) {
  const ctx = await b.newContext(mode === "mobile" ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });
  for (const s of SHOTS) {
    const p = await ctx.newPage();
    await p.goto(base + s.path, { waitUntil: "load" });
    await p.waitForTimeout(600);
    try { await s.act(p, mode); } catch (e) { console.log(`  ${s.id} ${mode}: ${e.message.split("\n")[0]}`); }
    await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    await p.screenshot({ path: `${out}/${s.id}-${mode}.png` });
    await p.close();
    // fresh tray per shot (localStorage is per context)
    await ctx.clearCookies();
  }
  await ctx.close();
  console.log(`${mode}: ${SHOTS.length} shots`);
}
await b.close();
