// Phase 11 audit: axe-core (WCAG 2.2 A/AA) + touch targets + image hygiene across every route.
// usage: node audit11.mjs <base> <out.json>
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const axeSrc = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const [base, out] = process.argv.slice(2);
const cats = ["necklaces", "temple-antique", "earrings", "bangles", "rings", "pendants", "chains", "bridal"];
const pieces = ["sv-n01", "sv-n02", "sv-b01", "sv-s01", "sv-r01", "sv-e01"];
const routes = ["/", "/collections", ...cats.map((c) => `/collections/${c}`), ...pieces.map((p) => `/pieces/${p}`), "/counter", "/craft", "/reels", "/bridal", "/visit", "/gold"];
const b = await chromium.launch({ executablePath: BROWSER });
const report = [];
for (const mode of ["desktop", "mobile"]) {
  const ctx = await b.newContext(mode === "mobile" ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" } : { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  for (const r of routes) {
    const p = await ctx.newPage();
    await p.goto(base + r, { waitUntil: "load" }).catch(() => {});
    await p.waitForTimeout(800);
    // scroll through so lazy content renders
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
    await p.waitForTimeout(400);
    await p.addScriptTag({ content: axeSrc });
    const axe = await p.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] }, exclude: [["iframe"], ["nextjs-portal"]] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, sample: v.nodes.slice(0, 3).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n").slice(1, 2).join(" ")) }));
    });
    const extra = await p.evaluate((mobile) => {
      const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && !e.closest('[aria-hidden="true"],[inert],.invisible'); };
      const small = mobile ? [...document.querySelectorAll("a[href],button,input,select,textarea,[role=button]")].filter(vis).filter((e) => { const r = e.getBoundingClientRect(); const inline = getComputedStyle(e).display === "inline" && e.closest("p,li,dd,figcaption"); return !inline && (r.height < 24 || r.width < 24); }).map((e) => `${e.tagName.toLowerCase()}[${(e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 30)}] ${Math.round(e.getBoundingClientRect().width)}×${Math.round(e.getBoundingClientRect().height)}`) : [];
      const imgs = [...document.querySelectorAll("img")];
      const noDims = imgs.filter((i) => !i.getAttribute("width") || !i.getAttribute("height")).length;
      const noAlt = imgs.filter((i) => !i.hasAttribute("alt")).length;
      const eagerBelow = imgs.filter((i) => i.loading !== "lazy" && i.getBoundingClientRect().top > innerHeight * 1.5).length;
      const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => +h.tagName[1]);
      let skip = 0; for (let k = 1; k < headings.length; k++) if (headings[k] - headings[k - 1] > 1) skip++;
      return { small: [...new Set(small)].slice(0, 12), smallCount: small.length, noDims, noAlt, eagerBelow, headingSkips: skip, lang: document.documentElement.lang, title: document.title, desc: document.querySelector('meta[name="description"]')?.content?.length || 0, og: !!document.querySelector('meta[property="og:title"]'), canonical: document.querySelector('link[rel="canonical"]')?.href || null, skipLink: !!document.querySelector('a[href="#main"]'), main: document.querySelectorAll("main").length };
    }, mode === "mobile");
    report.push({ mode, route: r, axe, ...extra });
    await p.close();
  }
  await ctx.close();
}
await b.close();
writeFileSync(out, JSON.stringify(report, null, 1));
// summary
const agg = {};
for (const x of report) for (const v of x.axe) { agg[v.id] ??= { impact: v.impact, help: v.help, pages: new Set(), nodes: 0, sample: v.sample[0] }; agg[v.id].pages.add(`${x.route}(${x.mode[0]})`); agg[v.id].nodes += v.n; }
console.log("AXE VIOLATIONS");
for (const [id, a] of Object.entries(agg)) console.log(`- ${id} [${a.impact}] ${a.help} — ${a.nodes} nodes on ${a.pages.size} page-views e.g. ${[...a.pages].slice(0, 4).join(", ")}\n    ${a.sample}`);
console.log("\nOTHER");
for (const x of report) { const issues = []; if (x.smallCount) issues.push(`small targets ${x.smallCount}: ${x.small.slice(0, 4).join("; ")}`); if (x.noDims) issues.push(`img without dims ${x.noDims}`); if (x.noAlt) issues.push(`img without alt ${x.noAlt}`); if (x.eagerBelow) issues.push(`eager imgs below fold ${x.eagerBelow}`); if (x.headingSkips) issues.push(`heading skips ${x.headingSkips}`); if (!x.og) issues.push("no og"); if (!x.desc) issues.push("no description"); if (issues.length) console.log(`${x.route} ${x.mode}: ${issues.join(" | ")}`); }
console.log(`\nlang=${report[0].lang} skip-link=${report.every((x) => x.skipLink)} one-main=${report.every((x) => x.main === 1)} canonical=${report[0].canonical}`);
