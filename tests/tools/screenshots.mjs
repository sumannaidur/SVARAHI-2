// Scroll-walks pages and captures viewport frames. usage: node v2pages.mjs <base> <outDir> <mode desktop|mobile> <path>...
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
import { mkdirSync } from "node:fs";
const [base, out, mode, ...paths] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const mobile = mode === "mobile";
const b = await chromium.launch({ executablePath: BROWSER });
for (const path of paths) {
  const ctx = await b.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 140)));
  p.on("console", (m) => m.type() === "error" && !/instagram|ERR_|Failed to load resource/i.test(m.text()) && errs.push(m.text().slice(0, 140)));
  await p.goto(base + path, { waitUntil: "load" });
  await p.waitForTimeout(2500);
  const name = (path.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home") + "-" + mode;
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  const vh = mobile ? 844 : 900;
  const step = vh * (mobile ? 0.95 : 0.75);
  let k = 0;
  for (let y = 0; y <= H - vh + 1; y += step / 5) {
    await p.evaluate((v) => scrollTo({ top: v, behavior: "instant" }), y);
    await p.waitForTimeout(45);
    if (Math.round(y) % Math.round(step) < step / 5) {
      await p.waitForTimeout(1300);
      await p.screenshot({ path: `${out}/${name}-${String(k++).padStart(2, "0")}.png` });
    }
  }
  const sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  console.log(name, "frames", k, "overflow", sw[0] > sw[1] ? "YES " + sw : "no", errs.length ? "ERRORS " + errs.join(" | ") : "no errors");
  await ctx.close();
}
await b.close();
