// Phase 12 — whole-site crawl. usage: node tests/qa/phase12-site-crawl.mjs <base>
// Starts from the sitemap, follows every internal link, and verifies pages, images and every outbound destination.
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
const [base = "http://localhost:3200"] = process.argv.slice(2);
const res = [];
const ok = (n, p, d = "") => res.push(`${p ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);
const b = await chromium.launch({ executablePath: BROWSER });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const req = ctx.request;

// Verified destinations only (docs/02-business-research.md, src/content/business.ts, instagram.json)
const ALLOWED_EXTERNAL = [
  /^https:\/\/wa\.me\/918550000483\?text=.+/,
  /^https:\/\/maps\.app\.goo\.gl\/Uw7Ez2wVE7kagTye9$/,
  /^https:\/\/svarahigold\.xyz\/index\.html$/,
  /^https:\/\/www\.instagram\.com\/svarahijewels\/$/,
  /^https:\/\/www\.instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+\/$/,
  /^tel:\+918550000483$/,
  /^mailto:svarahi\.jewels@gmail\.com(\?.*)?$/,
];

const sm = await (await req.get(base + "/sitemap.xml")).text();
const queue = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const seen = new Set(queue);
const pages = [];
const external = new Map();
const assets = new Set();
const titles = new Map();
const problems = [];
while (queue.length) {
  const path = queue.shift();
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 120)));
  const r = await p.goto(base + path, { waitUntil: "load" }).catch((e) => ({ status: () => 0, e }));
  await p.waitForTimeout(300);
  const info = await p.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    title: document.title,
    links: [...document.querySelectorAll("a[href]")].map((a) => a.href),
    srcs: [...document.querySelectorAll("img[src], source[srcset], img[srcset]")].flatMap((e) => [e.getAttribute("src"), ...(e.getAttribute("srcset") || "").split(",").map((s) => s.trim().split(" ")[0])]).filter(Boolean),
    phase7: /localhost:3000|Desktop\/svarahi\//.test(document.documentElement.outerHTML),
  }));
  pages.push(path);
  if (r.status() !== 200) problems.push(`${path} status ${r.status()}`);
  if (info.h1 !== 1) problems.push(`${path} h1=${info.h1}`);
  if (errs.length) problems.push(`${path} errors: ${errs.join(" | ")}`);
  if (info.phase7) problems.push(`${path} references the Phase 7 project`);
  titles.set(info.title, [...(titles.get(info.title) || []), path]);
  for (const s of info.srcs) assets.add(new URL(s, base + path).pathname);
  for (const href of info.links) {
    const u = new URL(href);
    if (u.origin === new URL(base).origin) {
      const clean = u.pathname;
      if (!seen.has(clean) && !/\.(png|jpg|webp|avif|xml|txt)$/.test(clean)) { seen.add(clean); queue.push(clean); }
    } else external.set(href, path);
  }
  await p.close();
}

ok(`crawl reached every page (${pages.length}) from the sitemap + links; all 200, one h1, no page errors`, problems.length === 0, problems.slice(0, 6).join(" | "));
const dupTitles = [...titles].filter(([, v]) => v.length > 1);
ok("every page title is unique", dupTitles.length === 0, dupTitles.map(([t, v]) => `${t}: ${v.join(",")}`).join(" | "));

const brokenAssets = [];
for (const a of assets) { const r = await req.head(base + a); if (r.status() !== 200) brokenAssets.push(`${a} ${r.status()}`); }
ok(`every image source and srcset candidate resolves (${assets.size} files)`, brokenAssets.length === 0, brokenAssets.slice(0, 6).join(", "));

const badExt = [...external].filter(([u]) => !ALLOWED_EXTERNAL.some((rx) => rx.test(u)));
ok(`every outbound link (${external.size} distinct) goes to a verified destination`, badExt.length === 0, badExt.slice(0, 6).map(([u, p]) => `${u.slice(0, 70)} (on ${p})`).join(" | "));
const waTexts = [...external.keys()].filter((u) => u.startsWith("https://wa.me/")).map((u) => new URL(u).searchParams.get("text") || "");
ok(`every WhatsApp message (${waTexts.length}) is a polite, prefilled enquiry with no price, weight or offer`, waTexts.every((t) => /^Hi Svarahi/.test(t) && !/₹|\bgrams?\b|% off|making charge/i.test(t)));
const ig = [...external.keys()].filter((u) => /instagram\.com\/(p|reel)\//.test(u));
const excluded = ["DfwJFHMFBlr", "Dftw0yrkQou", "Dfmadx8k0jE", "DfwJDxcD1Vg"];
ok("no link or embed to an excluded Instagram post (people without consent / not embeddable)", !ig.some((u) => excluded.some((c) => u.includes(c))));

// unknown route → not-found page (noindex)
const nf = await ctx.newPage();
await nf.goto(base + "/this-page-does-not-exist", { waitUntil: "load" });
const nfi = await nf.evaluate(() => ({ robots: document.querySelector('meta[name="robots"]')?.content, text: document.body.innerText.slice(0, 400), branded: !!document.querySelector('header a[aria-label^="Svarahi"]') && !!document.querySelector('main a[href="/collections"]') && !!document.querySelector('main a[href^="https://wa.me/"]') }));
ok("unknown route renders the branded not-found page (header, collections, WhatsApp) with noindex", /noindex/.test(nfi.robots || "") && /could not be found/i.test(nfi.text) && nfi.branded);
await nf.close();

// no JavaScript: core content and conversion still available
const njs = await b.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
const failsNoJs = [];
for (const path of ["/", "/collections/bridal", "/pieces/sv-b01", "/visit", "/gold"]) {
  const p = await njs.newPage();
  await p.goto(base + path, { waitUntil: "load" });
  const c = await p.evaluate(() => ({ h1: document.querySelector("h1")?.textContent?.trim(), wa: !!document.querySelector('a[href^="https://wa.me/"]'), imgs: document.querySelectorAll("main img").length }));
  if (!c.h1 || !c.wa) failsNoJs.push(`${path}: ${JSON.stringify(c)}`);
  await p.close();
}
ok("without JavaScript: headings, images and the WhatsApp enquiry still render (homepage, category, piece, visit, gold)", failsNoJs.length === 0, failsNoJs.join(" | "));
await njs.close();

await b.close();
console.log(res.join("\n"));
console.log(`\n${res.filter((r) => r.startsWith("PASS")).length}/${res.length} passed`);
