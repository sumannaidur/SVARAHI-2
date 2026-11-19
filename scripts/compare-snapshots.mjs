// Compares two snapshot.mjs outputs. usage: node compare.mjs <before.json> <after.json>
import { readFileSync } from "node:fs";
const [a, b] = process.argv.slice(2).map((f) => JSON.parse(readFileSync(f, "utf8")));
const added = Object.keys(b.files).filter((k) => !a.files[k]);
const removed = Object.keys(a.files).filter((k) => !b.files[k]);
const changed = Object.keys(a.files).filter((k) => b.files[k] && b.files[k].sha256 !== a.files[k].sha256);
console.log(`before: ${a.fileCount} files  tree ${a.treeHash.slice(0, 16)}…  head ${a.gitHead?.slice(0, 7)}  (${a.takenAt})`);
console.log(`after:  ${b.fileCount} files  tree ${b.treeHash.slice(0, 16)}…  head ${b.gitHead?.slice(0, 7)}  (${b.takenAt})`);
console.log(`git status identical: ${a.gitStatusPorcelain === b.gitStatusPorcelain}`);
console.log(`added ${added.length}  removed ${removed.length}  changed ${changed.length}`);
for (const k of [...added.map((x) => "+ " + x), ...removed.map((x) => "- " + x), ...changed.map((x) => "~ " + x)].slice(0, 20)) console.log("  " + k);
console.log(a.treeHash === b.treeHash ? "RESULT: Phase 7 project UNCHANGED" : "RESULT: DIFFERENCES FOUND");
