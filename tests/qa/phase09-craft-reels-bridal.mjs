// V2 Phase 9 QA — /craft, /reels, /bridal. usage: node v2qa9.mjs <base> <manifest> <instagram.json>
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
import { readFileSync } from "node:fs";
const [base, manifestPath, igPath] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")).assets;
const ig = JSON.parse(readFileSync(igPath, "utf8")).posts;
const groupOf = Object.fromEntries(manifest.map((a) => [a.path, a]));
const excluded = ig.filter((p) => p.people !== "none" || p.embeddable === false).map((p) => p.code);
const res = [];
const ok = (n, p, d = "") => res.push(`${p ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);
const b = await chromium.launch({ executablePath: BROWSER });
const pages = ["/craft", "/reels", "/bridal"];

// shared checks on every page, desktop + mobile
for (const mode of ["desktop", "mobile"]) {
  const ctx = await b.newContext(mode === "mobile" ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });
  for (const path of pages) {
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message.slice(0, 120)));
    const r = await p.goto(base + path, { waitUntil: "load" });
    await p.waitForTimeout(1500);
    const info = await p.evaluate(() => {
      const imgs = [...document.querySelectorAll("main img")].map((i) => i.getAttribute("src"));
      const iframes = [...document.querySelectorAll("iframe")].map((f) => f.src);
      const h1 = document.querySelectorAll("h1").length;
      const robots = document.querySelector('meta[name="robots"]')?.content;
      const text = document.querySelector("main").innerText;
      const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
      const overflow = document.documentElement.scrollWidth > innerWidth;
      return { imgs, iframes, h1, robots, text, links, overflow };
    });
    if (mode === "desktop") {
      ok(`${path}: 200, one h1, noindex`, r.status() === 200 && info.h1 === 1 && /noindex/.test(info.robots), `${r.status()} h1=${info.h1} robots=${info.robots}`);
      const bad = info.imgs.filter((s) => { const base = s.replace(/-\d+\.(webp|avif|jpg|png)$/, ""); const a = groupOf[base]; return !a || !a.publicUse; });
      ok(`${path}: every image is a public-cleared library asset`, bad.length === 0, bad.join(", "));
      const groups = new Set(info.imgs.map((s) => groupOf[s.replace(/-\d+\.(webp|avif|jpg|png)$/, "")]?.group));
      const needC = groups.has("C") ? /Licensed editorial imagery/i.test(info.text) : true;
      const needF = groups.has("F") ? /AI-generated/i.test(info.text) : true;
      ok(`${path}: provenance captions present for groups ${[...groups].join("")}`, needC && needF);
      const exIn = info.iframes.filter((u) => excluded.some((c) => u.includes(c)));
      ok(`${path}: no excluded/non-embeddable Instagram posts embedded`, exIn.length === 0, exIn.join(", "));
      ok(`${path}: no checkout, cart, price or weight claims`, !/add to cart|checkout|buy now|₹\s?\d|\bgrams?\b|\d+\s?g\b|hallmark|BIS|0% making/i.test(info.text));
      const ext = info.links.filter((h) => /^https?:/.test(h) && !/wa\.me|instagram\.com|maps\.app\.goo\.gl|svarahigold\.xyz/.test(h));
      ok(`${path}: external links only to approved destinations`, ext.length === 0, ext.join(", "));
    }
    ok(`${path} ${mode}: no horizontal overflow, no page errors`, !info.overflow && errs.length === 0, errs.join(" | "));
    await p.close();
  }
  await ctx.close();
}

// /craft: loupe and pinned chapters
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + "/craft", { waitUntil: "load" });
  await p.waitForTimeout(1200);
  const loupe = p.locator('[role="application"]');
  await loupe.scrollIntoViewIfNeeded();
  const bb = await loupe.boundingBox();
  await p.mouse.move(bb.x + bb.width * 0.3, bb.y + bb.height * 0.6);
  await p.waitForTimeout(400);
  const lens = await p.evaluate(() => { const l = document.querySelector('[role="application"] > div[aria-hidden]'); const s = getComputedStyle(l); return { op: s.opacity, left: l.style.left, bg: s.backgroundImage }; });
  ok("loupe: lens follows the mouse and uses the 1920px photograph", Number(lens.op) > 0.5 && /^3\d/.test(lens.left) && /-1920\.webp/.test(lens.bg), JSON.stringify(lens));
  await p.mouse.move(5, 5);
  await loupe.focus();
  const before = await p.evaluate(() => document.querySelector('[role="application"] > div[aria-hidden]').style.left);
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("ArrowRight");
  const after = await p.evaluate(() => document.querySelector('[role="application"] > div[aria-hidden]').style.left);
  ok("loupe: keyboard arrows move the lens", before !== after, `${before} → ${after}`);
  // chapters pin and advance
  const top = await p.evaluate(() => document.getElementById("chapters-title").closest("section").getBoundingClientRect().top + scrollY);
  await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);
  await p.waitForTimeout(800);
  const vis = () => p.evaluate(() => [...document.querySelectorAll("[data-ctext]")].map((e) => Number(getComputedStyle(e).opacity) > 0.5));
  const v0 = await vis();
  await p.evaluate((y) => scrollTo({ top: y + innerHeight * 2.5, behavior: "instant" }), top);
  await p.waitForTimeout(1500);
  const v1 = await vis();
  const pinned = await p.evaluate(() => { const s = document.getElementById("chapters-title").closest("section"); return Math.abs(s.getBoundingClientRect().top) < 2; });
  ok("chapters: section pins and scroll advances the technique", v0[0] && !v1[0] && v1.some(Boolean) && pinned, `start ${v0.indexOf(true) + 1}, later ${v1.indexOf(true) + 1}, pinned=${pinned}`);
  await ctx.close();
}

// reduced motion: chapters stacked, no pin
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(base + "/craft", { waitUntil: "load" });
  await p.waitForTimeout(1200);
  const spacers = await p.evaluate(() => document.querySelectorAll(".pin-spacer").length);
  ok("reduced motion: no pinned sections on /craft", spacers === 0, `pin-spacers=${spacers}`);
  await ctx.close();
}

// /reels: stage navigation
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + "/reels", { waitUntil: "load" });
  await p.waitForFunction(() => { const b = document.querySelector('button[aria-label="Next post"]'); return b && Object.keys(b).some((k) => k.startsWith("__reactProps")); });
  await p.waitForTimeout(500);
  const state = () => p.evaluate(() => ({ live: document.querySelector('[aria-roledescription="carousel"] [aria-live]').textContent, frames: [...document.querySelectorAll('[aria-roledescription="carousel"] iframe')].map((f) => f.src.split("/")[4]) }));
  const s0 = await state();
  const nextBtn = p.getByRole("button", { name: "Next post" });
  await nextBtn.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await nextBtn.click();
  await p.waitForTimeout(1000);
  const s1 = await state();
  await p.locator('[aria-roledescription="carousel"]').press("ArrowLeft");
  await p.waitForTimeout(800);
  const s2 = await state();
  ok("reels: exactly one embed loaded at a time (no autoplay wall)", s0.frames.length === 1 && s1.frames.length === 1, JSON.stringify([s0.frames, s1.frames]));
  ok("reels: Next and ArrowLeft change the active item and announce it", s0.live !== s1.live && s2.live === s0.live && s0.frames[0] !== s1.frames[0], `${s0.live} → ${s1.live} → ${s2.live}`);
  await ctx.close();
}

// /bridal: carousel + trial tray
for (const rm of ["no-preference", "reduce"]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
  const p = await ctx.newPage();
  await p.goto(base + "/bridal", { waitUntil: "load" });
  await p.waitForTimeout(1200);
  await p.locator("#looks").scrollIntoViewIfNeeded();
  const title = () => p.evaluate(() => document.querySelector('[aria-label="Bridal and heritage looks"] h3').textContent);
  const t0 = await title();
  await p.getByRole("button", { name: "Next look" }).click();
  await p.waitForTimeout(rm === "reduce" ? 200 : 1300);
  const t1 = await title();
  const rot = await p.evaluate(() => getComputedStyle(document.querySelector('[aria-label="Bridal and heritage looks"] [style*="transform-origin"]')).transform);
  ok(`bridal carousel (${rm}): Next advances the look and turns the ring`, t0 !== t1 && rot !== "none", `${t0} → ${t1}`);
  if (rm === "no-preference") {
    const stage = p.locator('[aria-label="Bridal and heritage looks"] .cursor-grab');
    const sb = await stage.boundingBox();
    await p.mouse.move(sb.x + sb.width / 2 + 200, sb.y + sb.height / 2);
    await p.mouse.down();
    for (let k = 1; k <= 10; k++) await p.mouse.move(sb.x + sb.width / 2 + 200 - k * 40, sb.y + sb.height / 2);
    await p.mouse.up();
    await p.waitForTimeout(1300);
    const t2 = await title();
    ok("bridal carousel: drag left advances", t2 !== t1, `${t1} → ${t2}`);
    const wa = await p.evaluate(() => document.querySelector('[aria-label="Bridal and heritage looks"] a[href*="wa.me"]').href);
    ok("bridal carousel: style CTA is a WhatsApp enquiry naming the look", decodeURIComponent(wa).includes(t2), wa.slice(0, 90));
    const btn = p.locator('#pieces-title').locator("xpath=ancestor::section").locator("button[aria-pressed]").first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await p.waitForTimeout(400);
    const badge = await p.evaluate(() => document.querySelector('button[aria-label^="Your trial tray"]')?.getAttribute("aria-label"));
    ok("bridal: pieces can be placed on the trial tray", /1 piece/.test(badge || ""), badge);
  }
  await ctx.close();
}

// header nav fits at 1024 and links to the new pages
{
  const ctx = await b.newContext({ viewport: { width: 1024, height: 768 } });
  const p = await ctx.newPage();
  await p.goto(base + "/craft", { waitUntil: "load" });
  await p.waitForTimeout(800);
  const nav = await p.evaluate(() => { const n = document.querySelector('nav[aria-label="Primary"]'); const r = n.getBoundingClientRect(); const logo = document.querySelector('header a[aria-label^="Svarahi"]').getBoundingClientRect(); const right = document.querySelector('header .btn')?.getBoundingClientRect(); const items = [...n.querySelectorAll("a")]; return { hrefs: items.map((a) => a.getAttribute("href")), wraps: items.some((a) => a.getBoundingClientRect().height > 24), clash: r.left < logo.right || (right && r.right > right.left) }; });
  ok("1024px header: nav fits without wrapping or overlap, links /bridal and /craft", !nav.wraps && !nav.clash && nav.hrefs.includes("/bridal") && nav.hrefs.includes("/craft"), JSON.stringify(nav));
  await ctx.close();
}

await b.close();
console.log(res.join("\n"));
console.log(`\n${res.filter((r) => r.startsWith("PASS")).length}/${res.length} passed`);
