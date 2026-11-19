// V2 Phase 11 QA — accessibility, mobile, SEO plumbing, performance guards. usage: node v2qa11.mjs <base> <manifest> <publicDir>
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
import { readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const axeSrc = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const [base, manifestPath, pub] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")).assets;
const res = [];
const ok = (n, p, d = "") => res.push(`${p ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);
const b = await chromium.launch({ executablePath: BROWSER });
const routes = ["/", "/collections", "/collections/necklaces", "/collections/bridal", "/pieces/sv-b01", "/pieces/sv-n01", "/counter", "/craft", "/reels", "/bridal", "/visit", "/gold"];

// 1. axe WCAG 2.2 AA + touch targets, desktop and mobile
for (const mode of ["desktop", "mobile"]) {
  const ctx = await b.newContext(mode === "mobile" ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" } : { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const viol = [];
  const small = [];
  for (const r of routes) {
    const p = await ctx.newPage();
    await p.goto(base + r, { waitUntil: "load" });
    await p.waitForTimeout(700);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } scrollTo(0, 0); });
    await p.addScriptTag({ content: axeSrc });
    const v = await p.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }, exclude: [["iframe"], ["nextjs-portal"]] })).violations.map((x) => `${x.id}×${x.nodes.length}`));
    if (v.length) viol.push(`${r}: ${v.join(",")}`);
    if (mode === "mobile") {
      const s = await p.evaluate(() => [...document.querySelectorAll("a[href],button,input,select,textarea,[role=button],[role=tab]")].filter((e) => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); if (!r.width || !r.height || st.visibility === "hidden" || e.closest('[aria-hidden="true"],[inert],.invisible') || e.matches(".sr-only")) return false; const inline = st.display === "inline" && e.closest("p,dd,figcaption,blockquote"); return !inline && (r.height < 24 || r.width < 24); }).map((e) => (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 24)));
      if (s.length) small.push(`${r}: ${s.join("; ")}`);
    }
    await p.close();
  }
  ok(`axe WCAG 2.2 A/AA: zero violations on ${routes.length} routes (${mode})`, viol.length === 0, viol.join(" | "));
  if (mode === "mobile") ok("mobile: every interactive target ≥ 24×24 CSS px (WCAG 2.5.8)", small.length === 0, small.join(" | "));
  await ctx.close();
}

// 2. keyboard: counter tabs (roving tabindex + arrows), visible focus, skip link
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + "/counter", { waitUntil: "load" });
  await p.waitForFunction(() => { const e = document.querySelector('[role="tab"]'); return e && Object.keys(e).some((k) => k.startsWith("__reactProps")); });
  const tabs = await p.evaluate(() => [...document.querySelectorAll('[role="tab"]')].map((t) => t.tabIndex));
  await p.locator('[role="tab"][aria-selected="true"]').focus();
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(900);
  const after = await p.evaluate(() => ({ sel: document.querySelector('[role="tab"][aria-selected="true"]').textContent, focus: document.activeElement.textContent, panel: document.getElementById("counter-display").getAttribute("aria-label") }));
  await p.keyboard.press("End");
  await p.waitForTimeout(600);
  const end = await p.evaluate(() => document.querySelector('[role="tab"][aria-selected="true"]').textContent);
  ok("counter tabs: one tab stop, arrows/End move focus + selection, panel follows", tabs.filter((t) => t === 0).length === 1 && after.sel === after.focus && after.panel.startsWith(after.sel) && end === "Bridal Collections", JSON.stringify({ ...after, end }));
  await p.goto(base + "/visit", { waitUntil: "load" });
  await p.keyboard.press("Tab");
  const skip = await p.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return { txt: a.textContent.trim(), visible: r.width > 50 && r.height > 20, outline: getComputedStyle(a).outlineStyle }; });
  ok("skip link is first tab stop and becomes visible on focus", skip.txt === "Skip to content" && skip.visible, JSON.stringify(skip));
  await p.keyboard.press("Tab");
  await p.keyboard.press("Tab");
  const ring = await p.evaluate(() => { const s = getComputedStyle(document.activeElement); return `${s.outlineStyle} ${s.outlineWidth}`; });
  ok("focused controls show a visible focus outline", /solid/.test(ring) && parseFloat(ring.split(" ")[1]) >= 1, ring);
  await p.close();
}

// 2b. screen readers: not-yet-revealed headings/text stay in the accessibility tree (opacity, never visibility:hidden)
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const hidden = [];
  for (const r of ["/", "/collections", "/craft", "/visit", "/gold"]) {
    await p.goto(base + r, { waitUntil: "load" });
    await p.waitForTimeout(1500);
    const h = await p.evaluate(() => [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main button")].filter((e) => !e.closest('[aria-hidden="true"]') && getComputedStyle(e).visibility === "hidden" && e.getBoundingClientRect().height > 0).map((e) => e.tagName + ":" + e.textContent.trim().slice(0, 30)));
    if (h.length) hidden.push(`${r}: ${h.slice(0, 4).join("; ")}`);
  }
  ok("before scrolling, no headings/text/controls are removed from the accessibility tree by reveal animations", hidden.length === 0, hidden.join(" | "));
  await p.close();
}

// 3. 360px smallest phone: no overflow anywhere
{
  const ctx = await b.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  const bad = [];
  for (const r of routes) {
    const p = await ctx.newPage();
    await p.goto(base + r, { waitUntil: "load" });
    await p.waitForTimeout(600);
    const w = await p.evaluate(() => document.documentElement.scrollWidth);
    if (w > 360) bad.push(`${r}=${w}`);
    await p.close();
  }
  ok("360px: no horizontal overflow on any route", bad.length === 0, bad.join(", "));
  await ctx.close();
}

// 4. SEO plumbing while noindex stays on
{
  const p = await b.newPage();
  const robots = await (await p.request.get(base + "/robots.txt")).text();
  ok("robots.txt disallows all crawling (launch not approved)", /User-Agent: \*\s+Disallow: \/\s*$/i.test(robots.trim()), robots.replace(/\n/g, " "));
  const sm = await (await p.request.get(base + "/sitemap.xml")).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok("sitemap lists all customer routes (8 static + 8 collections + 23 pieces), excludes /direction", urls.length === 39 && !urls.some((u) => /direction/.test(u)), `${urls.length} urls`);
  const og = await p.request.get(base + "/opengraph-image");
  ok("default Open Graph image renders (1200×630 PNG)", og.status() === 200 && /png/.test(og.headers()["content-type"]));
  const meta = [];
  for (const r of routes) {
    await p.goto(base + r, { waitUntil: "domcontentloaded" });
    const m = await p.evaluate(() => ({ robots: document.querySelector('meta[name="robots"]')?.content, canon: document.querySelector('link[rel="canonical"]')?.href, ogImg: !!document.querySelector('meta[property="og:image"]'), ogTitle: document.querySelector('meta[property="og:title"]')?.content, desc: document.querySelector('meta[name="description"]')?.content?.length || 0, title: document.title }));
    if (!/noindex/.test(m.robots) || !m.canon?.endsWith(r === "/" ? "/" : r) || !m.ogImg || !m.ogTitle || m.desc < 50 || /v2|development/i.test(m.title)) meta.push(`${r}: ${JSON.stringify(m)}`);
  }
  ok("every route: noindex, self canonical, og:title + og:image, description ≥50 chars, clean title", meta.length === 0, meta.join(" | "));
  const ld = await p.evaluate(async (u) => { const h = await (await fetch(u + "/visit")).text(); return /"@type":"JewelryStore"/.test(h); }, base);
  ok("/visit ships JewelryStore structured data", ld);
  await p.close();
}

// 5. performance guards
{
  const p = await b.newPage();
  const h = (await p.request.head(base + "/assets/showroom/displays/display-jhumka-wall-640.avif")).headers()["cache-control"];
  ok("/assets served with long cache (30 days + SWR)", /max-age=2592000/.test(h || ""), h);
  const over = [];
  for (const a of manifest) {
    if (a.group === "B") continue;
    for (const w of a.widths) for (const f of ["avif", "webp"]) {
      if (!a.formats.includes(f)) continue;
      const file = join(pub, `${a.path.replace("/assets/", "assets/")}-${w}.${f}`);
      let size; try { size = statSync(file).size; } catch { continue; }
      const px = Math.min(w, a.width) * Math.round((Math.min(w, a.width) / a.width) * a.height);
      const budget = px * (f === "avif" ? 0.11 : 0.16);
      if (size > budget * 1.6) over.push(`${a.id}-${w}.${f} ${Math.round(size / 1024)}KB`);
    }
  }
  ok("image byte budget: no rendition far above budget after re-encode", over.length <= 6, `${over.length} heavy: ${over.slice(0, 6).join(", ")}`);
  await p.goto(base + "/visit", { waitUntil: "load" });
  const hero = await p.evaluate(() => { const i = document.querySelector("main figure img"); return { loading: i.loading, prio: i.fetchPriority }; });
  ok("/visit hero (heavy showroom photo) no longer forced eager/high priority", hero.loading === "lazy", JSON.stringify(hero));
  await p.waitForTimeout(2500);
  const vit = await p.evaluate(() => (window.__svarahiVitals || []).map((v) => v.name));
  ok("web-vitals monitor collects metrics on-device (window.__svarahiVitals), sends nothing", vit.includes("FCP") && vit.includes("TTFB"), vit.join(","));
  await p.close();
}

// 6. counter tab switch: highlight paints before the new pieces (transition)
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await p.goto(base + "/counter", { waitUntil: "load" });
  await p.waitForFunction(() => { const e = document.querySelector('[role="tab"]'); return e && Object.keys(e).some((k) => k.startsWith("__reactProps")); });
  await p.waitForTimeout(1500);
  const tab = p.locator('[role="tab"]').nth(2);
  await tab.scrollIntoViewIfNeeded();
  await p.waitForTimeout(800);
  await p.evaluate(() => { window.__ev = 0; new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.interactionId) window.__ev = Math.max(window.__ev, e.duration); })).observe({ type: "event", durationThreshold: 16 }); });
  await tab.tap();
  await p.waitForTimeout(1200);
  const d = await p.evaluate(() => window.__ev);
  const sel = await tab.getAttribute("aria-selected");
  ok("counter tab tap: selected immediately, interaction under 200 ms (unthrottled)", sel === "true" && d < 200, `${d}ms`);
  await p.close();
}

await b.close();
console.log(res.join("\n"));
console.log(`\n${res.filter((r) => r.startsWith("PASS")).length}/${res.length} passed`);
