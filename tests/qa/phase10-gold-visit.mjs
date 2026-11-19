// V2 Phase 10 QA — /visit, /gold and conversion wiring. usage: node v2qa10.mjs <base> <manifest>
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
import { readFileSync } from "node:fs";
const [base, manifestPath] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")).assets;
const byPath = Object.fromEntries(manifest.map((a) => [a.path, a]));
const res = [];
const ok = (n, p, d = "") => res.push(`${p ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);
const b = await chromium.launch({ executablePath: BROWSER });
const hydrated = (p, sel) => p.waitForFunction((s) => { const e = document.querySelector(s); return e && Object.keys(e).some((k) => k.startsWith("__reactProps")); }, sel);
const GOLD = "https://svarahigold.xyz/index.html";

for (const mode of ["desktop", "mobile"]) {
  const ctx = await b.newContext(mode === "mobile" ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });
  for (const path of ["/visit", "/gold"]) {
    const p = await ctx.newPage();
    const errs = [];
    const external = [];
    p.on("pageerror", (e) => errs.push(e.message.slice(0, 120)));
    p.on("request", (r) => { const h = new URL(r.url()).host; if (!/localhost/.test(h)) external.push(h); });
    const r = await p.goto(base + path, { waitUntil: "load" });
    await p.waitForTimeout(1500);
    const info = await p.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      robots: document.querySelector('meta[name="robots"]')?.content,
      text: document.querySelector("main").innerText,
      imgs: [...document.querySelectorAll("main img")].map((i) => i.getAttribute("src")),
      links: [...document.querySelectorAll("a[href]")].map((a) => ({ h: a.getAttribute("href"), t: a.target, rel: a.rel })),
      overflow: document.documentElement.scrollWidth > innerWidth,
      iframes: document.querySelectorAll("iframe").length,
      forms: [...document.querySelectorAll("form")].map((f) => f.getAttribute("action")),
    }));
    if (mode === "desktop") {
      ok(`${path}: 200, one h1, noindex`, r.status() === 200 && info.h1 === 1 && /noindex/.test(info.robots));
      const bad = info.imgs.filter((s) => !byPath[s.replace(/-\d+\.(webp|avif|jpg|png)$/, "")]?.publicUse);
      ok(`${path}: only public-cleared images, each captioned`, bad.length === 0 && (info.imgs.length === 0 || /not our store|Licensed editorial|AI-generated/i.test(info.text)), bad.join(","));
      ok(`${path}: no rates, prices, weights, hours or ratings stated`, !/₹|\bper gram\b|\d+\s?(g|gm|grams?)\b|\d(\.\d)?\s?★|\b\d(\.\d)?\s?\/\s?5\b|\b\d{1,2}(:\d\d)?\s?(am|pm)\b|0% making|buyback|hallmark|HUID/i.test(info.text));
      const ext = info.links.filter((l) => /^https?:/.test(l.h));
      const notAllowed = ext.filter((l) => !/^https:\/\/(wa\.me\/918550000483\?text=|maps\.app\.goo\.gl\/Uw7Ez2wVE7kagTye9$|svarahigold\.xyz\/index\.html$|www\.instagram\.com\/svarahijewels\/$)/.test(l.h));
      ok(`${path}: external links approved and open in a new tab with noopener`, notAllowed.length === 0 && ext.every((l) => l.t === "_blank" && /noopener/.test(l.rel)), notAllowed.map((l) => l.h).join(","));
      ok(`${path}: no third-party requests or embeds, no form posts anywhere`, external.length === 0 && info.iframes === 0 && info.forms.every((a) => !a), [...new Set(external)].join(","));
    }
    ok(`${path} ${mode}: no overflow, no page errors`, !info.overflow && !errs.length, errs.join(" | "));
    await p.close();
  }
  await ctx.close();
}

// /gold bridge semantics
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + "/gold", { waitUntil: "load" });
  await p.waitForTimeout(800);
  const g = await p.evaluate((u) => ({ cta: [...document.querySelectorAll(`main a[href="${u}"]`)].length, text: document.querySelector("main").innerText, inputs: document.querySelectorAll("main input,main form").length, table: !!document.querySelector("table caption") }), GOLD);
  ok("/gold: opens the existing platform (2 CTAs), states separation and no shared data", g.cta === 2 && /separate/i.test(g.text) && /Nothing from this website/i.test(g.text) && /never shows gold or silver rates/i.test(g.text), `ctas=${g.cta}`);
  ok("/gold: no account, login or trading UI on this site", g.inputs === 0 && !/log ?in|sign ?in|sign up|buy now|sell now|place order/i.test(g.text));
  ok("/gold: comparison table has caption and row headers", g.table && (await p.locator("tbody th[scope=row]").count()) === 4);
  await p.close();
}

// /visit planner
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { localStorage.setItem("svarahi-tray-v1", JSON.stringify(["SV-B01", "SV-S01"])); window.__opened = []; window.open = (u) => { window.__opened.push(String(u)); return null; }; });
  const p = await ctx.newPage();
  await p.goto(base + "/visit", { waitUntil: "load" });
  await hydrated(p, 'form button[type="submit"]');
  const msg = () => p.evaluate(() => document.querySelector("pre[aria-live]").textContent);
  await p.waitForFunction(() => /SV-B01/.test(document.querySelector("pre[aria-live]").textContent), null, { timeout: 5000 }).catch(() => {});
  const m0 = await msg();
  ok("planner: trial tray pieces are included by default", /Ruby-set Kadas \(SV-B01\)/.test(m0) && /SV-S01/.test(m0), m0.replace(/\n/g, " / ").slice(0, 160));
  await p.getByLabel(/Your name/).fill("Asha");
  await p.getByRole("button", { name: "Bridal / wedding" }).click();
  await p.getByLabel("Time of day").selectOption("Evening");
  await p.getByLabel(/Anything we should know/).fill("Red lehenga");
  await p.getByLabel(/Include my trial tray/).uncheck();
  const m1 = await msg();
  ok("planner: message preview reflects every field live", /this is Asha/.test(m1) && /Occasion: Bridal/.test(m1) && /evening/.test(m1) && /Notes: Red lehenga/.test(m1) && !/SV-B01/.test(m1), m1.replace(/\n/g, " / "));
  ok("planner: occasion chips expose aria-pressed", (await p.getByRole("button", { name: "Bridal / wedding" }).getAttribute("aria-pressed")) === "true");
  // past date is rejected, accessible error
  await p.getByLabel(/Preferred day/).fill("2020-01-01");
  await p.getByRole("button", { name: /Send on WhatsApp/ }).click();
  await p.waitForTimeout(500);
  const err = await p.evaluate(() => ({ alert: document.querySelector('[role="alert"]')?.textContent, invalid: document.querySelector('input[type="date"]').getAttribute("aria-invalid") }));
  ok("planner: past date blocked with an announced error, nothing opened", /today or a later date/.test(err.alert || "") && err.invalid === "true" && (await p.evaluate(() => window.__opened.length)) === 0, JSON.stringify(err));
  // valid future date → opens WhatsApp with exact message
  const future = new Date(Date.now() + 5 * 864e5);
  const iso = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, "0")}-${String(future.getDate()).padStart(2, "0")}`;
  await p.getByLabel(/Preferred day/).fill(iso);
  await p.getByRole("button", { name: /Send on WhatsApp/ }).click();
  await p.waitForTimeout(300);
  const url = (await p.evaluate(() => window.__opened))[0] || "";
  const sent = url ? new URL(url).searchParams.get("text") || "" : "";
  const m2 = await msg();
  ok("planner: valid submit opens WhatsApp to the verified number with the previewed message", /^https:\/\/wa\.me\/918550000483\?text=/.test(url) && sent.trim() === m2.trim() && /Preferred day: \w+day/.test(sent), url.slice(0, 80));
  const stored = await p.evaluate(() => Object.keys(localStorage));
  ok("planner: nothing persisted except the existing trial tray", stored.every((k) => k === "svarahi-tray-v1"), stored.join(","));
  // JSON-LD
  const ld = await p.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent));
  ok("/visit: JewelryStore JSON-LD with verified facts only (no hours, rating, price range)", ld["@type"] === "JewelryStore" && ld.telephone === "+918550000483" && ld.address.postalCode === "560041" && !("openingHours" in ld) && !("aggregateRating" in ld) && !("priceRange" in ld));
  const hours = await p.evaluate(() => document.querySelector("main").innerText.match(/Opening hours\s*\n?\s*(.*)/i)?.[1]);
  ok("/visit: hours shown as 'to be confirmed' (claim pending)", /To be confirmed/i.test(hours || ""), hours);
  await ctx.close();
}

// conversion wiring
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + "/collections", { waitUntil: "load" });
  await p.waitForTimeout(800);
  const nav = await p.evaluate(() => [...document.querySelectorAll('nav[aria-label="Primary"] a')].map((a) => a.getAttribute("href")));
  ok("header: Visit → /visit and Svarahi Gold → /gold bridge", nav.includes("/visit") && nav.includes("/gold") && !nav.includes("/#visit"), nav.join(" "));
  const foot = await p.evaluate(() => [...document.querySelectorAll('nav[aria-label="Footer"] a')].map((a) => a.getAttribute("href")));
  ok("footer: links to /visit and /gold", foot.includes("/visit") && foot.includes("/gold"));
  const cta = await p.evaluate(() => !!document.querySelector('section[aria-label="Visit the showroom"] a[href="/visit"]'));
  ok("showroom CTA band: 'Plan your visit' link", cta);
  await p.close();
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await m.goto(base + "/pieces/sv-b01", { waitUntil: "load" });
  await m.waitForTimeout(800);
  const bar = await m.evaluate(() => [...document.querySelectorAll('nav[aria-label="Quick actions"] a')].map((a) => a.getAttribute("href")));
  ok("mobile action bar: Visit → /visit", bar.includes("/visit"), bar.join(" "));
  // tray drawer → plan a visit
  await hydrated(m, "button[aria-pressed]");
  await m.locator("main button[aria-pressed]:visible").first().click();
  await m.waitForTimeout(300);
  await m.locator('button[aria-label^="Your trial tray"]').click();
  await m.waitForTimeout(500);
  await m.getByRole("link", { name: "Plan a visit with this tray" }).click();
  await m.waitForURL(/\/visit/);
  await m.waitForTimeout(1500);
  const carried = await m.evaluate(() => document.querySelector("pre[aria-live]")?.textContent || "");
  ok("tray drawer → 'Plan a visit with this tray' carries the pieces into the planner", JSON.parse(await m.evaluate(() => localStorage.getItem("svarahi-tray-v1"))).every((c) => carried.includes(c)) && /Pieces I'd like to see/.test(carried) && m.url().endsWith("/visit#plan"), m.url() + " :: " + carried.replace(/\n/g, " / ") + " :: tray=" + await m.evaluate(() => localStorage.getItem("svarahi-tray-v1")));
  await m.close();
}

// reduced motion
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(base + "/gold", { waitUntil: "load" });
  await p.waitForTimeout(1000);
  const vis = await p.evaluate(() => [...document.querySelectorAll("[data-bar]")].every((e) => +getComputedStyle(e).opacity === 1));
  ok("reduced motion: gold illustration static and fully visible", vis);
  await ctx.close();
}

await b.close();
console.log(res.join("\n"));
console.log(`\n${res.filter((r) => r.startsWith("PASS")).length}/${res.length} passed`);
