// Phase 6 homepage QA for Svarahi v2. usage: node v2qa.mjs <base> <manifestPath>
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
import { readFileSync } from "node:fs";
const [base, manifestPath] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")).assets;
const publicPaths = new Set(manifest.filter((a) => a.publicUse).map((a) => a.path));
const exe = BROWSER;
const res = [];
const ok = (n, p, d = "") => res.push(`${p ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);
const b = await chromium.launch({ executablePath: exe });

const scrollAll = async (p) => {
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) { await p.evaluate((v) => scrollTo({ top: v, behavior: "instant" }), y); await p.waitForTimeout(50); }
  await p.waitForTimeout(1200);
};

// 1. Widths: overflow, broken images, errors
for (const [w, h, mobile] of [[360, 780, true], [390, 844, true], [768, 1024, true], [1024, 768], [1440, 900], [1920, 1080]]) {
  const ctx = await b.newContext(mobile ? { viewport: { width: w, height: h }, isMobile: true, hasTouch: true } : { viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 120)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 120)));
  await p.goto(base + "/", { waitUntil: "load" });
  await scrollAll(p);
  const r = await p.evaluate(() => ({
    sw: document.documentElement.scrollWidth, iw: innerWidth,
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  }));
  ok(`${w}px: no horizontal overflow, no broken images, no errors`, r.sw <= r.iw && !r.broken.length && !errs.length, `scrollWidth ${r.sw}/${r.iw}; broken ${r.broken.length}; errors ${errs.length}${errs[0] ? " (" + errs[0] + ")" : ""}`);
  if (w === 390) {
    // hero CTAs visible in the first viewport above the action bar
    const cta = await p.evaluate(() => { scrollTo({ top: 0, behavior: "instant" }); const a = [...document.querySelectorAll("#top a")].find((x) => /Showroom enquiry/i.test(x.textContent)); const r = a.getBoundingClientRect(); return Math.round(r.bottom); });
    ok("390px: both hero CTAs above the mobile action bar", cta < 844 - 60, `bottom ${cta}px`);
  }
  await ctx.close();
}

// 2. Rights + links + noindex (desktop)
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + "/", { waitUntil: "load" });
  await scrollAll(p);
  const srcs = await p.evaluate(() => [...document.querySelectorAll("img, source")].flatMap((e) => (e.getAttribute("srcset") || e.getAttribute("src") || "").split(",").map((s) => s.trim().split(" ")[0])).filter(Boolean));
  const bgs = await p.evaluate(() => [...document.querySelectorAll("[style*='url(']")].map((e) => e.style.backgroundImage.match(/url\("?([^")]+)/)?.[1]).filter(Boolean));
  const base_ = (s) => s.replace(/-\d+\.(avif|webp|png|jpg)$/, "");
  const bad = [...srcs, ...bgs].filter((s) => s.startsWith("/assets/") && !publicPaths.has(base_(s)));
  ok("only rights-cleared assets rendered", bad.length === 0, bad.length ? bad.slice(0, 3).join(", ") : `${new Set([...srcs, ...bgs].map(base_)).size} distinct assets, all cleared`);
  const used = new Set([...srcs, ...bgs].map(base_));
  const groups = manifest.filter((a) => used.has(a.path)).reduce((m, a) => ((m[a.group] = (m[a.group] || 0) + 1), m), {});
  res.push(`      groups rendered: ${JSON.stringify(groups)}`);
  const capsOk = await p.evaluate(() => /AI-generated/.test(document.body.innerText) && /not our store/i.test(document.body.innerText));
  ok("AI/concept disclaimers present", capsOk);
  const links = await p.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  const allowed = /^(\/$|\/collections$|\/counter$|\/bridal$|\/craft$|\/reels$|\/visit$|\/gold$|\/#[\w-]+$|#[\w-]+|https:\/\/wa\.me\/918550000483\?text=|https:\/\/maps\.app\.goo\.gl\/Uw7Ez2wVE7kagTye9$|https:\/\/svarahigold\.xyz\/index\.html$|https:\/\/www\.instagram\.com\/svarahijewels\/$|tel:\+918550000483$|mailto:svarahi\.jewels@gmail\.com$)/;
  const badLinks = links.filter((l) => !allowed.test(l));
  const anchors = links.filter((l) => l.startsWith("#"));
  const missing = await p.evaluate((ids) => ids.filter((h) => !document.getElementById(h.replace(/^\/?#/, ""))), anchors.concat(links.filter((l) => l.startsWith("/#"))));
  ok("every link is a verified destination or a valid anchor", !badLinks.length && !missing.length, `${links.length} links${badLinks.length ? "; unexpected " + badLinks.slice(0, 3).join(" ") : ""}${missing.length ? "; missing anchors " + missing.join(" ") : ""}`);
  const robots = await p.$eval('meta[name="robots"]', (m) => m.content).catch(() => "none");
  ok("noindex present", /noindex/.test(robots), robots);
  const pending = await p.evaluate(() => /2\.5%|0% making|₹123|7\.5%|65%|4\.9|70191|parking/i.test(document.body.innerText));
  ok("no pending commercial claims rendered", !pending);
  // keyboard
  await p.evaluate(() => scrollTo(0, 0));
  await p.keyboard.press("Tab");
  const first = await p.evaluate(() => document.activeElement?.textContent?.trim());
  ok("first Tab focuses the skip link", /Skip to content/.test(first || ""), first);
  await p.close();
}

// 3. Reduced motion: no pins, all copy visible
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "load" });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({
    spacers: document.querySelectorAll(".pin-spacer").length,
    hidden: [...document.querySelectorAll("h1,h2,h3,[data-step],[data-term]")].filter((e) => !e.closest('[aria-hidden="true"]')).filter((e) => { const s = getComputedStyle(e); return s.visibility === "hidden" || +s.opacity < 0.5; }).length,
  }));
  ok("reduced motion: no pinned sections, all headings/steps visible", r.spacers === 0 && r.hidden === 0, JSON.stringify(r));
  await ctx.close();
}

// 4. JS disabled
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "domcontentloaded" });
  const r = await p.evaluate(() => ({ h1: document.querySelector("h1")?.textContent, h2: document.querySelectorAll("h2").length, imgs: document.images.length }));
  ok("renders without JavaScript", !!r.h1 && r.h2 >= 5 && r.imgs > 10, JSON.stringify(r));
  await ctx.close();
}

// 5. Desktop pins active
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + "/", { waitUntil: "load" });
  await p.waitForTimeout(1500);
  const spacers = await p.evaluate(() => document.querySelectorAll(".pin-spacer").length);
  ok("desktop: 5 pinned scenes (hero, journey, collections, counter, craft)", spacers === 5, `${spacers}`);
  await p.close();
}
await b.close();
console.log(res.join("\n"));
