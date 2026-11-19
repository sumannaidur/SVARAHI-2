// V2 Phase 8 QA — virtual counter & trial tray. usage: node v2qa8.mjs <base> <manifest>
import { chromium } from "playwright-core";
import { BROWSER } from "../browser.mjs";
import { readFileSync } from "node:fs";
const [base, manifestPath] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")).assets;
const groupOf = Object.fromEntries(manifest.map((a) => [a.path, a.group]));
const res = [];
const ok = (n, p, d = "") => res.push(`${p ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`);
const b = await chromium.launch({ executablePath: BROWSER });
const badge = (p) => p.evaluate(() => document.querySelector('button[aria-label^="Your trial tray"]')?.getAttribute("aria-label"));
const status = (p) => p.evaluate(() => document.querySelector('[role="status"]')?.textContent);

// Desktop: drag, keyboard, persistence, drawer
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const external = [];
  p.on("request", (r) => { const u = new URL(r.url()); if (!/localhost|instagram|cdninstagram|fbcdn/.test(u.host) && !["image", "font", "stylesheet"].includes(r.resourceType())) external.push(r.url()); });
  await p.goto(base + "/counter", { waitUntil: "load" });
  await p.waitForTimeout(1800);
  // drag first card onto the tray
  const card = p.locator("#counter-display li").first().locator("div.cursor-grab");
  await p.evaluate(() => { const t = document.querySelector('[role="tablist"]'); scrollTo({ top: t.getBoundingClientRect().top + scrollY - 90, behavior: "instant" }); });
  await p.waitForTimeout(400);
  const bothVisible = await p.evaluate(() => { const c = document.querySelector("#counter-display li").getBoundingClientRect(); const t = document.querySelector('ul[aria-label="Pieces on your tray"]').getBoundingClientRect(); return c.top >= 0 && t.bottom <= innerHeight; });
  ok("1440×900: counter pieces and tray fit in one viewport", bothVisible);
  const cb = await card.boundingBox();
  const tray = p.locator('ul[aria-label="Pieces on your tray"]');
  const tb = await tray.boundingBox();
  await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2);
  await p.mouse.down();
  for (let i = 1; i <= 15; i++) await p.mouse.move(cb.x + cb.width / 2 + ((tb.x + 60 - cb.x - cb.width / 2) * i) / 15, cb.y + cb.height / 2 + ((tb.y + tb.height / 2 - cb.y - cb.height / 2) * i) / 15);
  await p.waitForTimeout(150);
  const hint = await p.evaluate(() => document.querySelector('[ref], div.relative.mx-auto.max-w-4xl p.mt-1')?.textContent);
  await p.mouse.up();
  await p.waitForTimeout(600);
  ok("mouse drag onto the velvet tray places the piece", /1 piece/.test(await badge(p)), `${await badge(p)}; hint while over tray: "${hint}"; announce: "${await status(p)}"`);
  // keyboard: second card's "+ Trial tray"
  const btn = p.locator("#counter-display li").nth(1).locator("button[aria-pressed]").first();
  await btn.focus();
  await p.keyboard.press("Enter");
  await p.waitForTimeout(300);
  ok("keyboard placement via + Trial tray (aria-pressed)", /2 pieces/.test(await badge(p)) && (await btn.getAttribute("aria-pressed")) === "true", await badge(p));
  // tabs
  await p.click('[role="tab"]:has-text("Temple & Antique")');
  await p.waitForTimeout(900);
  const templeCodes = await p.$$eval("#counter-display li", (ls) => ls.map((l) => l.textContent.match(/SV-[A-Z]\d\d/)?.[0]));
  ok("collection tabs switch the counter (Temple & Antique → SV-E01, SV-S01)", templeCodes.join() === "SV-E01,SV-S01", templeCodes.join());
  // no AI jewellery on the counter pieces
  const pieceSrcs = await p.$$eval("#counter-display img, #counter-display source", (e) => e.map((x) => (x.getAttribute("srcset") || x.getAttribute("src") || "").split(" ")[0]));
  ok("counter pieces never use AI (Group F) imagery", pieceSrcs.every((s) => groupOf[s.replace(/-\d+\.(avif|webp|png)$/, "")] !== "F"));
  // persistence
  await p.reload({ waitUntil: "load" });
  await p.waitForTimeout(800);
  const afterReload = await badge(p);
  await p.goto(base + "/collections", { waitUntil: "load" });
  await p.waitForTimeout(800);
  ok("tray persists across reload and pages", /2 pieces/.test(afterReload) && /2 pieces/.test(await badge(p)), `${afterReload} → ${await badge(p)}`);
  // drawer
  await p.click('button[aria-label^="Your trial tray"]');
  await p.waitForTimeout(600);
  const dlg = await p.evaluate(() => ({ open: !document.querySelector('[aria-labelledby="tray-title"]').closest("[aria-hidden]")?.getAttribute("aria-hidden") || document.querySelector('[aria-labelledby="tray-title"]').closest("[aria-hidden]").getAttribute("aria-hidden") === "false", focus: document.activeElement?.getAttribute("aria-label"), items: document.querySelectorAll('[aria-labelledby="tray-title"] li').length, wa: decodeURIComponent(document.querySelector('[aria-labelledby="tray-title"] a[href^="https://wa.me/"]')?.getAttribute("href") || "") }));
  ok("drawer opens as a dialog with focus on Close, lists both pieces", dlg.open && dlg.focus === "Close tray" && dlg.items === 2, JSON.stringify({ focus: dlg.focus, items: dlg.items }));
  ok("one WhatsApp message lists every tray piece with codes", /SV-B01/.test(dlg.wa) && /SV-B02/.test(dlg.wa) && dlg.wa.startsWith("https://wa.me/918550000483?text="), dlg.wa.split("?text=")[1]?.replace(/\n/g, " | ").slice(0, 160));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(500);
  const closed = await p.evaluate(() => ({ hidden: document.querySelector('[aria-labelledby="tray-title"]').closest("[aria-hidden]").getAttribute("aria-hidden"), focus: document.activeElement?.getAttribute("aria-label") }));
  ok("Escape closes the drawer and returns focus to the tray button", closed.hidden === "true" && /Your trial tray/.test(closed.focus || ""), JSON.stringify(closed));
  // limit
  const adds = p.locator('main button[aria-pressed="false"]', { hasText: "Trial tray" });
  for (let i = 0; i < 9; i++) { if (await adds.count()) { await adds.first().click(); await p.waitForTimeout(80); } }
  ok("tray stops at 8 pieces with a 'full' announcement", /8 pieces/.test(await badge(p)) && /full/i.test(await status(p)), `${await badge(p)}; "${await status(p)}"`);
  ok("nothing sent to any server by tray interactions", external.length === 0, external.slice(0, 2).join(" "));
  // piece page toggle + clear
  await p.goto(base + "/pieces/sv-b01", { waitUntil: "load" });
  await p.waitForTimeout(800); // client reads the device-only tray after hydration
  const pt = p.locator("main button", { hasText: /trial tray/i }).first();
  const before = await pt.getAttribute("aria-pressed");
  await pt.click();
  await p.waitForTimeout(300);
  ok("piece page toggle removes / re-adds", before === "true" && (await pt.getAttribute("aria-pressed")) === "false", `${before} → ${await pt.getAttribute("aria-pressed")}`);
  await p.click('button[aria-label^="Your trial tray"]');
  await p.click("text=Clear tray");
  await p.waitForTimeout(300);
  ok("clear tray empties it", /0 pieces/.test(await badge(p)));
  await ctx.close();
}

// Mobile: no drag (touch scroll stays natural), tap works, layout
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(base + "/counter", { waitUntil: "load" });
  await p.waitForTimeout(1200);
  const touchAction = await p.$eval("#counter-display li > div", (e) => e.style.touchAction);
  await p.locator("#counter-display li").first().locator("button", { hasText: "Trial tray" }).tap();
  await p.waitForTimeout(300);
  const sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  ok("mobile: drag off (touch-action auto), tap places piece, no overflow", touchAction === "auto" && /1 piece/.test(await badge(p)) && sw[0] <= sw[1], `touch-action ${touchAction}; ${await badge(p)}; ${sw}`);
  await ctx.close();
}

// Reduced motion: no tilt
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(base + "/counter", { waitUntil: "load" });
  await p.waitForTimeout(800);
  const c = p.locator("#counter-display li").first().locator("div[style*='--go']");
  const bb = await c.boundingBox();
  await p.mouse.move(bb.x + 20, bb.y + 20);
  await p.mouse.move(bb.x + bb.width - 20, bb.y + 40);
  const t = await c.evaluate((e) => e.style.transform);
  const vis = await p.evaluate(() => [...document.querySelectorAll("#counter-display li")].every((l) => getComputedStyle(l).visibility !== "hidden" && +getComputedStyle(l).opacity > 0.9));
  ok("reduced motion: no tilt, all pieces visible immediately", !t && vis, `transform="${t}"`);
  await ctx.close();
}

// Storage blocked (private mode)
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(base + "/counter", { waitUntil: "load" });
  await p.waitForTimeout(800);
  await p.locator("#counter-display li").first().locator("button", { hasText: "Trial tray" }).click();
  await p.waitForTimeout(300);
  ok("storage blocked: no errors, tray still works for the session", !errs.length && /1 piece/.test(await badge(p)), errs[0] || (await badge(p)));
  await ctx.close();
}
await b.close();
console.log(res.join("\n"));
