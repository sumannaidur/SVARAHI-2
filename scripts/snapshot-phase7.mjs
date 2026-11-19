// Read-only fingerprint of a project tree (excludes build output and dependencies).
// usage: node snapshot.mjs <projectDir> <out.json>
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { execSync } from "node:child_process";

const [dir, out] = process.argv.slice(2);
const SKIP = new Set(["node_modules", ".next", "out", ".git"]);
const files = {};
const walk = (d) => {
  for (const f of readdirSync(d)) {
    if (SKIP.has(f)) continue;
    const p = join(d, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else files[relative(dir, p).replace(/\\/g, "/")] = { size: s.size, sha256: createHash("sha256").update(readFileSync(p)).digest("hex") };
  }
};
walk(dir);
const git = (c) => { try { return execSync(`git -C "${dir}" ${c}`, { encoding: "utf8" }).trim(); } catch { return null; } };
const snap = {
  project: dir,
  takenAt: new Date().toISOString(),
  gitHead: git("rev-parse HEAD"),
  gitStatusPorcelain: git("status --porcelain"),
  fileCount: Object.keys(files).length,
  treeHash: createHash("sha256").update(JSON.stringify(files)).digest("hex"),
  files,
};
writeFileSync(out, JSON.stringify(snap, null, 2));
console.log(`files: ${snap.fileCount}  treeHash: ${snap.treeHash}  head: ${snap.gitHead}`);
