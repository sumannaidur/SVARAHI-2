// Phase 7 (v2) QA. usage: node v2qa7.mjs <base> <manifestPath>
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
import { readFileSync } from "node:fs";
const [base, manifestPath] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")).assets;
const cleared = new Set(manifest.filter((a) => a.publicUse).map((a) => a.path));
const groupOf = Object.fromEntries(manifest.map((a) => [a.path, a.group]));
const CATS = ["necklaces", "temple-antique", "earrings", "bangles", "rings", "pendants", "chains", "bridal"];
const CODES = ["n01","n02","n03","n04","n05","e01","e02","e03","e04","b01","b02","b03","b04","r01","r02","r03","r04","p01","p02","c01","c02","s01","s02"].map((c) => "sv-" + c);
const res = [];
const ok = (n, p, d = "") => res.push(`${p ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);
const b = await chromium.launch({ executablePath: BROWSER });
const assetBase = (s) => s.replace(/-\d+\.(avif|webp|png|jpg)$/, "");
const ALLOWED = /^(\/(collections(\/[a-z-]+)?|pieces\/sv-[a-z]\d\d|#[\w-]+|\/#(counter|craft|visit|collections))?|#[\w-]+|\/#[\w-]+|https:\/\/wa\.me\/918550000483\?text=|https:\/\/maps\.app\.goo\.gl\/Uw7Ez2wVE7kagTye9$|https:\/\/svarahigold\.xyz\/index\.html$|https:\/\/www\.instagram\.com\/(svarahijewels\/|(p|reel)\/[\w-]+\/)$|tel:\+918550000483$|mailto:svarahi\.jewels@gmail\.com)/;

async function audit(page, path) {
  const errs = [];
  page.removeAllListeners("pageerror");
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 100)));
  const r = await page.goto(base + path, { waitUntil: "load" });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((v) => scrollTo({ top: v, behavior: "instant" }), y); await page.waitForTimeout(30); }
  await page.waitForTimeout(700);
  const d = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim(),
    sw: document.documentElement.scrollWidth, iw: innerWidth,
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
    srcs: [...document.querySelectorAll("img,source")].flatMap((e) => (e.getAttribute("srcset") || e.getAttribute("src") || "").split(",").map((s) => s.trim().split(" ")[0])).filter((s) => s.startsWith("/assets/")),
    links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    wa: [...document.querySelectorAll('a[href^="https://wa.me/"]')].map((a) => decodeURIComponent(a.getAttribute("href"))),
    stageImgs: [...document.querySelectorAll("[data-stage-frame] img, [data-stage-frame] source")].map((e) => e.getAttribute("srcset") || e.getAttribute("src")),
    robots: document.querySelector('meta[name="robots"]')?.content,
  }));
  return { status: r.status(), errs, ...d };
}

const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
// Landing + categories + pieces
const all = [];
for (const path of ["/collections", ...CATS.map((c) => `/collections/${c}`), ...CODES.map((c) => `/pieces/${c}`)]) {
  const a = await audit(page, path);
  all.push([path, a]);
}
const fails = (fn) => all.filter(([, a]) => !fn(a)).map(([p]) => p);
let f;
f = fails((a) => a.status === 200 && a.h1 && !a.errs.length);
ok(`all ${all.length} pages render (200, h1, no errors)`, !f.length, f.slice(0, 4).join(" "));
f = fails((a) => a.sw <= a.iw && a.broken === 0);
ok("no overflow / broken images (1440)", !f.length, f.join(" "));
const unclear = all.flatMap(([p, a]) => a.srcs.filter((s) => !cleared.has(assetBase(s))).map((s) => `${p}:${s}`));
ok("only rights-cleared assets on every page", !unclear.length, unclear.slice(0, 3).join(" ") || "all cleared");
const aiOnPieces = all.filter(([p]) => p.startsWith("/pieces/")).flatMap(([p, a]) => a.srcs.filter((s) => groupOf[assetBase(s)] === "F").map((s) => `${p}:${s}`));
ok("no AI (Group F) imagery on any piece page", !aiOnPieces.length, aiOnPieces.slice(0, 3).join(" "));
const stageAI = all.filter(([p]) => p.startsWith("/pieces/")).filter(([, a]) => a.stageImgs.some((s) => /generated|\/ux-|models|showroom/.test(s || "")));
ok("piece stages show only representative piece images or photo-to-follow", !stageAI.length);
const badLinks = all.flatMap(([p, a]) => a.links.filter((l) => !ALLOWED.test(l)).map((l) => `${p} → ${l}`));
ok("every link is internal-valid or a verified destination", !badLinks.length, badLinks.slice(0, 4).join(" | ") || `${all.reduce((s, [, a]) => s + a.links.length, 0)} links`);
const internal = [...new Set(all.flatMap(([, a]) => a.links.filter((l) => l.startsWith("/") && !l.includes("#"))))];
const dead = [];
for (const l of internal) { const r = await page.request.get(base + l); if (r.status() !== 200) dead.push(`${l}:${r.status()}`); }
ok("every internal link resolves", !dead.length, dead.join(" ") || `${internal.length} distinct internal URLs`);
f = all.filter(([p]) => p.startsWith("/pieces/")).filter(([p, a]) => !a.wa.some((w) => w.includes(`(${p.slice(-3).toUpperCase().replace(/^/, "SV-").replace("SV-SV", "SV")}`) || w.includes(p.slice(8).toUpperCase())));
ok("every piece page WhatsApp message names the piece code", !f.length, f.map(([p]) => p).join(" "));
f = fails((a) => /noindex/.test(a.robots || ""));
ok("noindex on every page", !f.length);
const claimText = await Promise.all([]);
void claimText;
const r404 = await page.request.get(base + "/pieces/sv-zzz");
const c404 = await page.request.get(base + "/collections/mens");
const t404 = (await r404.text()) + (await c404.text());
ok("unknown piece/category → not-found page + noindex (men's not a live category)", (t404.match(/could not be found/gi) || []).length >= 2 && /noindex/.test(t404), `HTTP ${r404.status()}/${c404.status()} (documented: notFound inside Suspense keeps 200 + adds noindex)`);

// Pending claims never rendered
let claimHits = [];
for (const [p] of all.slice(0, 12)) {
  await page.goto(base + p, { waitUntil: "domcontentloaded" });
  if (await page.evaluate(() => /2\.5%|0% making|₹123|7\.5%|65%|4\.9★|70191|parking|\b(22|18)\s?k(arat|t)?\b|\bgrams?\b/i.test(document.querySelector("main").innerText))) claimHits.push(p);
}
ok("no pending claims, purity or weight figures rendered", !claimHits.length, claimHits.join(" "));

// Filters
await page.goto(base + "/collections", { waitUntil: "load" });
await page.waitForTimeout(800);
const count = () => page.locator("main ul.grid li article").count();
const total = await count();
await page.click('[aria-label="Filter by collection"] button:has-text("Bangles & Bracelets")');
await page.waitForTimeout(700);
const bangles = await count();
const urlB = page.url();
await page.click('[aria-label="Filter by style"] button:has-text("Diamond")');
await page.waitForTimeout(700);
const none = await page.locator("text=No pieces match both filters yet").count();
await page.click("text=Show everything");
await page.waitForTimeout(700);
const reset = await count();
await page.goto(base + "/collections?category=rings&style=diamond", { waitUntil: "load" });
await page.waitForTimeout(900);
const fromUrl = await count();
ok("catalogue filters (click, combine, empty state, reset, URL)", total === 23 && bangles === 4 && urlB.includes("category=bangles") && none === 1 && reset === 23 && fromUrl === 3, `all ${total}, bangles ${bangles}, empty-state ${none}, reset ${reset}, rings+diamond from URL ${fromUrl}`);
const temple = await page.request.get(base + "/collections/temple-antique").then((r) => r.text());
ok("Temple & Antique includes temple/kemp pieces from other collections", /SV-E01/.test(temple) && /SV-S01/.test(temple));

// Keyboard
await page.goto(base + "/collections", { waitUntil: "load" });
await page.focus('[aria-label="Filter by collection"] button:has-text("Rings")');
await page.keyboard.press("Enter");
await page.waitForTimeout(600);
const pressed = await page.getAttribute('[aria-label="Filter by collection"] button:has-text("Rings")', "aria-pressed");
ok("filters operable by keyboard (aria-pressed)", pressed === "true");
await page.goto(base + "/pieces/sv-b01", { waitUntil: "load" });
await page.waitForFunction(() => { const e = document.querySelector('[role="button"][aria-pressed]'); return e && Object.keys(e).some((k) => k.startsWith("__reactProps")); }, null, { timeout: 15000 });
await page.focus('[aria-label="Zoom in on the image"]');
await page.keyboard.press("Enter");
await page.waitForTimeout(400);
  await page.waitForTimeout(400);
  const zoomed = await page.getAttribute('[aria-pressed][role="button"]', "aria-pressed");
ok("piece image zoom operable by keyboard", zoomed === "true");
await page.close();

// Mobile overflow on every page
const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mf = [];
for (const [p] of all) { const a = await audit(m, p, { mobile: true }); if (a.sw > a.iw || a.broken || a.errs.length) mf.push(p); }
ok(`mobile 390px: all ${all.length} pages no overflow / errors`, !mf.length, mf.join(" "));
const bar = await m.evaluate(() => !!document.querySelector('nav[aria-label="Quick actions"]') && getComputedStyle(document.querySelector('nav[aria-label="Quick actions"]')).display !== "none");
ok("mobile action bar present", bar);
await m.close();

// Reduced motion + desktop pins
const rctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await rctx.newPage();
await rp.goto(base + "/collections/necklaces", { waitUntil: "load" });
await rp.waitForTimeout(1200);
const rr = await rp.evaluate(() => ({ spacers: document.querySelectorAll(".pin-spacer").length, hidden: [...document.querySelectorAll("h1,h2,h3,article")].filter((e) => !e.closest('[aria-hidden="true"]')).filter((e) => getComputedStyle(e).visibility === "hidden" || +getComputedStyle(e).opacity < 0.5).length, scrollable: (() => { const v = document.querySelector('[aria-label$="scroll or swipe sideways"]'); return v ? getComputedStyle(v).overflowX : "none"; })() }));
ok("reduced motion: no pins, all visible, rail natively scrollable", rr.spacers === 0 && rr.hidden === 0 && rr.scrollable === "auto", JSON.stringify(rr));
await rctx.close();
const dp = await b.newPage({ viewport: { width: 1440, height: 900 } });
await dp.goto(base + "/collections/necklaces", { waitUntil: "load" });
await dp.waitForTimeout(1200);
const pinned = await dp.evaluate(() => document.querySelectorAll(".pin-spacer").length);
await dp.goto(base + "/collections/bangles", { waitUntil: "load" });
await dp.waitForTimeout(1200);
const notPinned = await dp.evaluate(() => document.querySelectorAll(".pin-spacer").length);
ok("desktop: rail pins when it overflows (necklaces) and not when it fits (bangles)", pinned === 1 && notPinned === 0, `${pinned} / ${notPinned}`);
await b.close();
console.log(res.join("\n"));
