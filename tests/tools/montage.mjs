// usage: node montage.mjs <dir> <out.png> <cols> <cell>
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";
const [dir, out, cols = 6, cell = 220] = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => /\.(webp|png|jpg)$/.test(f) && statSync(join(dir, f)).isFile());
const C = +cols, S = +cell, LBL = 22;
const rows = Math.ceil(files.length / C);
const comps = [];
for (const [i, f] of files.entries()) {
  const x = (i % C) * S, y = Math.floor(i / C) * (S + LBL);
  comps.push({ input: await sharp(join(dir, f)).resize(S - 8, S - 8, { fit: "contain", background: "#eee" }).png().toBuffer(), left: x + 4, top: y + 4 });
  const svg = `<svg width="${S}" height="${LBL}"><text x="4" y="15" font-size="11" font-family="Arial">${basename(f).slice(0, 34)}</text></svg>`;
  comps.push({ input: Buffer.from(svg), left: x, top: y + S - 2 });
}
await sharp({ create: { width: C * S, height: rows * (S + LBL), channels: 3, background: "#fff" } }).composite(comps).png().toFile(out);
console.log("ok", files.length);
