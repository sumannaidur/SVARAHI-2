// Loads each Instagram embed on its own and reports whether Instagram renders it or shows the "broken/removed" card.
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
const codes = process.argv.slice(2);
const b = await chromium.launch({ executablePath: BROWSER });
const p = await b.newPage({ viewport: { width: 420, height: 800 } });
for (const c of codes) {
  for (const kind of ["reel", "p"]) {
    await p.goto(`https://www.instagram.com/${kind}/${c}/embed/`, { waitUntil: "load" });
    await p.waitForTimeout(3500);
    const t = await p.evaluate(() => document.body.innerText);
    console.log(c, kind, /may be broken|removed/.test(t) ? "BROKEN" : /svarahijewels/.test(t) ? "OK" : "UNKNOWN:" + t.slice(0, 60).replace(/\s+/g, " "));
  }
}
await b.close();
