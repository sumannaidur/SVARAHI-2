// Lighthouse lab audits (mobile emulation + simulated throttling, and desktop) via Edge.
// usage: node lh11.mjs <base> <outDir> <path>...
import lighthouse from "lighthouse";
import { BROWSER } from "../browser.mjs";
import * as chromeLauncher from "chrome-launcher";
import { mkdirSync, writeFileSync } from "node:fs";
const [base, out, ...paths] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const chrome = await chromeLauncher.launch({ chromePath: BROWSER, chromeFlags: ["--headless=new", "--no-first-run", "--disable-extensions"] });
const rows = [];
for (const formFactor of ["mobile", "desktop"]) {
  for (const path of paths) {
    const cfg = formFactor === "desktop"
      ? { extends: "lighthouse:default", settings: { formFactor: "desktop", screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } }
      : { extends: "lighthouse:default" };
    const r = await lighthouse(base + path, { port: chrome.port, output: "html", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] }, cfg);
    const l = r.lhr;
    const a = (id) => l.audits[id];
    const name = `${formFactor}-${path.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home"}`;
    writeFileSync(`${out}/${name}.html`, r.report);
    const fails = Object.values(l.audits).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== "informative" && x.scoreDisplayMode !== "notApplicable" && x.scoreDisplayMode !== "manual").map((x) => `${x.id}${x.displayValue ? "(" + x.displayValue + ")" : ""}`);
    rows.push({ name, perf: Math.round(l.categories.performance.score * 100), a11y: Math.round(l.categories.accessibility.score * 100), bp: Math.round(l.categories["best-practices"].score * 100), seo: Math.round(l.categories.seo.score * 100), lcp: a("largest-contentful-paint").displayValue, cls: a("cumulative-layout-shift").displayValue, tbt: a("total-blocking-time").displayValue, fcp: a("first-contentful-paint").displayValue, lcpEl: a("largest-contentful-paint-element")?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(0, 90), fails });
    const snip = (it) => it?.node?.snippet || it?.node?.selector || it?.url || it?.source?.url || it?.description || "";
    const detail = {};
    for (const id of ["largest-contentful-paint-element", "errors-in-console", "image-size-responsive", "image-aspect-ratio", "label-content-name-mismatch", "target-size", "crawlable-anchors", "color-contrast", "lcp-lazy-loaded", "prioritize-lcp-image", "render-blocking-resources"]) {
      const au = l.audits[id];
      if (!au || au.score === null || au.score >= 0.9) { if (id !== "largest-contentful-paint-element") continue; }
      const items = au?.details?.items || [];
      const flat = items.flatMap((it) => (it.items ? it.items : [it]));
      detail[id] = flat.slice(0, 6).map((it) => (snip(it) + (it.phase ? ` [${it.phase} ${Math.round(it.timing)}ms]` : "") + (it.displayedSize ? ` shown ${it.displayedSize} actual ${it.actualSize} expected ${it.expectedSize}` : "")).toString().slice(0, 160));
    }
    if (process.env.DETAIL) console.log(JSON.stringify(detail, null, 1));
    console.log(`${name.padEnd(28)} P${rows.at(-1).perf} A${rows.at(-1).a11y} BP${rows.at(-1).bp} SEO${rows.at(-1).seo}  LCP ${rows.at(-1).lcp}  CLS ${rows.at(-1).cls}  TBT ${rows.at(-1).tbt}\n   below 0.9: ${fails.join(", ")}\n   LCP el: ${rows.at(-1).lcpEl}`);
  }
}
writeFileSync(`${out}/summary.json`, JSON.stringify(rows, null, 1));
await chrome.kill();
