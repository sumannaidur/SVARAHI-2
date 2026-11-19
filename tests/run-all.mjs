// Runs every phase's QA suite against a running server and writes a summary.
// usage: npm run qa            (dev server on :3200 must be running: npm run dev)
//        QA_BASE=http://localhost:3210 npm run qa   (e.g. against `next start` on another port)
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.QA_BASE || "http://localhost:3200";
const manifest = join(root, "src/content/asset-manifest.json");
const ig = join(root, "src/content/instagram.json");
const pub = join(root, "public");

try {
  const r = await fetch(base + "/");
  if (!r.ok) throw new Error(String(r.status));
} catch (e) {
  console.error(`No server at ${base} (${e.message}). Start one with: npm run dev`);
  process.exit(2);
}

const suites = [
  ["Phase 6 — homepage", "phase06-home.mjs", [manifest]],
  ["Phase 7 — collections & discovery", "phase07-collections.mjs", [manifest]],
  ["Phase 8 — virtual counter & trial tray", "phase08-counter.mjs", [manifest]],
  ["Phase 9 — craft, reels, bridal", "phase09-craft-reels-bridal.mjs", [manifest, ig]],
  ["Phase 10 — Svarahi Gold bridge & visit", "phase10-gold-visit.mjs", [manifest]],
  ["Phase 11 — accessibility, mobile, SEO, performance", "phase11-a11y-perf.mjs", [manifest, pub]],
  ["Phase 12 — whole-site crawl", "phase12-site-crawl.mjs", []],
];

const rows = [];
let pass = 0, total = 0;
const started = new Date();
for (const [name, file, args] of suites) {
  process.stdout.write(`${name} … `);
  const t = Date.now();
  const r = spawnSync(process.execPath, [join(root, "tests/qa", file), base, ...args], { encoding: "utf8", cwd: join(root, "tests"), maxBuffer: 1 << 26 });
  const out = (r.stdout || "") + (r.stderr || "");
  const p = (out.match(/^PASS/gm) || []).length;
  const f = (out.match(/^FAIL/gm) || []).length;
  const crashed = r.status !== 0 && p + f === 0;
  pass += p;
  total += p + f + (crashed ? 1 : 0);
  rows.push({ name, file, pass: p, fail: f, crashed, secs: Math.round((Date.now() - t) / 1000), fails: out.split("\n").filter((l) => l.startsWith("FAIL")), tail: crashed ? out.slice(-600) : "" });
  console.log(crashed ? "CRASHED" : `${p}/${p + f}`);
}

const md = [
  `# QA run — ${started.toISOString().slice(0, 16).replace("T", " ")} UTC`,
  "",
  `Server: ${base}  ·  Browser: system Edge/Chromium (BROWSER_PATH to override)`,
  "",
  "| Suite | Passed | Time |",
  "|---|---|---|",
  ...rows.map((r) => `| ${r.name} (\`tests/qa/${r.file}\`) | ${r.crashed ? "**crashed**" : `${r.pass}/${r.pass + r.fail}`} | ${r.secs}s |`),
  `| **Total** | **${pass}/${total}** | |`,
  "",
  ...rows.flatMap((r) => (r.fails.length || r.crashed ? [`### ${r.name}`, ...r.fails.map((l) => `- ${l}`), r.tail ? "```\n" + r.tail + "\n```" : ""] : [])),
].join("\n");
mkdirSync(join(root, "docs/testing"), { recursive: true });
writeFileSync(join(root, "docs/testing/qa-latest.md"), md + "\n");
console.log(`\nTOTAL ${pass}/${total} — written to docs/testing/qa-latest.md`);
process.exit(pass === total ? 0 : 1);
