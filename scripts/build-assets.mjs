// Svarahi Flagship v2 — asset library builder.
// Reads originals from /assets-originals (never served, never modified), classifies
// every file (groups A–E), writes optimized responsive copies to /public/assets/**,
// and generates the manifest, source & rights registers and a contact sheet.
// Usage: npm run assets
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const ORIG = join(ROOT, "assets-originals");
const PUB = join(ROOT, "public/assets");
const TODAY = "2026-11-19";
const GROUP = {
  A: "Official Svarahi product photography",
  B: "Official Svarahi brand and campaign artwork",
  C: "Licensed editorial and lifestyle photography",
  D: "Licensed showroom or interior inspiration",
  E: "Placeholder or concept imagery",
  F: "Nano Banana AI-generated editorial concept",
};

// ── svarahi.co files ────────────────────────────────────────────────────────
// svarahi.co publishes these as "representative". Seven were verified (visual
// comparison, 19 Nov 2026) as Unsplash photographs; the rest are unverified stock.
const UNSPLASH_MATCH = {
  "products/ruby-kadas": ["gold-and-red-beaded-accessory-itriu-lCKzs", "fotonium"],
  "products/stone-set-bangles": ["gold-and-diamond-studded-bracelet-zz6-LqiW4mY", "samarahmadkhan18"],
  "products/filigree-bracelet": ["gold-and-silver-beaded-necklace--nKCbZlOHek", "samarahmadkhan18"],
  "products/engraved-bangles": ["a-pair-of-gold-bracelets-sitting-on-top-of-a-velvet-cushion-ynts2uDw1ws", "manojornaments__12"],
  "products/gold-coin-necklace": ["gold-and-purple-beaded-necklace-e8LrvEAZqYM", "vaibhavnagare"],
  "look-bangles": ["woman-adjusts-ornate-earring-while-wearing-bangles-and-ring-_IA6l4oqkAE", "nupurbatra_"],
  "about-model": ["young-woman-with-large-ornate-earrings-and-sari-hwVsgXTm9v8", "dhruva15"],
};
const PRODUCT_CAT = {
  "ruby-pearl-haar": ["necklaces", "SV-N01"], "gold-coin-necklace": ["necklaces", "SV-N02"], "kundan-necklace-set": ["necklaces", "SV-N03"],
  "pastel-kundan-necklace": ["necklaces", "SV-N04"], "oxidised-silver-set": ["necklaces", "SV-N05"],
  "temple-jhumkas": ["earrings", "SV-E01"], "ruby-halo-earrings": ["earrings", "SV-E02"], "diamond-studs": ["earrings", "SV-E03"], "rose-gold-drops": ["earrings", "SV-E04"],
  "ruby-kadas": ["bangles", "SV-B01"], "stone-set-bangles": ["bangles", "SV-B02"], "engraved-bangles": ["bangles", "SV-B03"], "filigree-bracelet": ["bangles", "SV-B04"],
  "pear-diamond-ring": ["rings", "SV-R01"], "halo-solitaire": ["rings", "SV-R02"], "pink-sapphire-ring": ["rings", "SV-R03"], "diamond-bands": ["rings", "SV-R04"],
  "bar-pendant": ["pendants", "SV-P01"], "circle-pendant": ["pendants", "SV-P02"],
  "curb-chain": ["chains", "SV-C01"], "oval-loop-chain": ["chains", "SV-C02"],
  "kemp-bridal-set": ["bridal", "SV-S01"], "bridal-ensemble": ["bridal", "SV-S02"],
};
const SITE_IMAGES = {
  "look-necklaces": ["campaigns/promotional", "Model wearing a gold choker with long drop earrings"],
  "look-earrings": ["campaigns/promotional", "Close-up of a hoop earring set with coloured stones"],
  "look-bangles": ["models/everyday", "Hands wearing stacked bangles and a statement ring"],
  "look-bridal": ["campaigns/bridal", "Bride with mehendi wearing a maang tikka and chandbali earrings"],
  "occasion-bridal": ["campaigns/bridal", "Bride in a pink lehenga wearing a layered necklace and maang tikka"],
  "occasion-festive": ["campaigns/festive", "Woman in a gold saree wearing traditional earrings and bangles"],
  "occasion-everyday": ["models/everyday", "Close-up of a gold huggie earring"],
  "occasion-diamonds": ["campaigns/promotional", "Woman in navy wearing a diamond ring and earrings"],
  "occasion-feature": ["campaigns/bridal", "Woman in a maroon lehenga wearing a polki necklace, maang tikka and bangles"],
  "hero-wide": ["campaigns/bridal", "Bride in red with mehendi and a green kundan maang tikka, lit by warm light"],
  "hero-model": ["campaigns/promotional", "Model in a green silk drape wearing a diamond and emerald necklace"],
  "about-model": ["models/festive", "Woman in a silk saree wearing a long gold jhumka, lit by the evening sun"],
  "contact-model": ["models/festive", "Smiling woman in a green silk saree wearing a gold necklace and marigold garland"],
  "gram-1": ["models/everyday", "Woman in a white shirt wearing a gold coin necklace, earrings and ring"],
  "gram-2": ["models/festive", "Woman in an orange saree with gold bangles, in golden-hour light"],
  "gram-3": ["models/everyday", "Layered fine gold chains with a pendant, worn with a floral dress"],
  "gram-4": ["models/everyday", "Chunky gold link chain worn with an ivory blazer"],
  "gram-5": ["models/everyday", "Hand with gold bow rings and a hand chain beside a gold earring"],
  "gram-6": ["models/everyday", "Woman in a white sleeveless top wearing bold gold earrings"],
  "store-wide": ["generated/approved-concepts", "Warmly lit jewellery store with wood-panelled walls (NOT Svarahi's showroom)"],
};

const entries = [];
const add = (e) => entries.push(e);

for (const [slug, [cat, code]] of Object.entries(PRODUCT_CAT)) {
  const m = UNSPLASH_MATCH[`products/${slug}`];
  add({
    id: `sv-${slug}`, src: `svarahi-co/images/products/${slug}.webp`, out: `jewellery/${cat}/${slug}`, group: "C",
    alt: `Representative image for ${code} — ${slug.replace(/-/g, " ")}`, pieceCode: code, category: cat,
    source: `https://svarahi.co/images/products/${slug}.webp`, publisher: "svarahi.co (published as 'representative')",
    origin: m ? `Unsplash photo ${m[0]} by @${m[1]} (verified visual match)` : "Unverified stock — creator unknown",
    licence: m ? "Unsplash License" : "Unknown — owner to confirm", attribution: m ? "Not required (appreciated)" : "Unknown",
    exactProduct: false, note: "Not Svarahi inventory; never present as the actual piece",
  });
}
for (const [slug, [folder, alt]] of Object.entries(SITE_IMAGES)) {
  const m = UNSPLASH_MATCH[slug];
  add({
    id: `sv-${slug}`, src: `svarahi-co/images/${slug}.webp`, out: `${folder}/${slug}`, group: slug === "store-wide" ? "E" : "C", alt,
    source: `https://svarahi.co/images/${slug}.webp`, publisher: "svarahi.co",
    origin: m ? `Unsplash photo ${m[0]} by @${m[1]} (verified visual match)` : "Unverified stock — creator unknown",
    licence: m ? "Unsplash License" : "Unknown — owner to confirm", attribution: m ? "Not required (appreciated)" : "Unknown",
    exactProduct: false, note: slug === "store-wide" ? "Does not depict Svarahi's showroom — concept reference only" : "Lifestyle; models are not Svarahi customers",
  });
}
for (const f of ["svarahi-full", "svarahi-full-light", "svarahi-header"]) {
  add({ id: `brand-${f}`, src: `svarahi-co/logo/${f}.png`, out: `brand/logos/${f}`, group: "B", alt: "Svarahi logo", source: `https://svarahi.co/logo/${f}.png`, publisher: "Svarahi", origin: "Svarahi's own logo (raster)", licence: "Svarahi-owned", attribution: "—", exactProduct: false, note: "Official vector still required", graphic: true });
}
add({ id: "brand-svarahi-mark", src: "svarahi-co/logo/svarahi-mark.png", out: "brand/monograms/svarahi-mark", group: "B", alt: "Svarahi interlocking-S monogram", source: "https://svarahi.co/logo/svarahi-mark.png", publisher: "Svarahi", origin: "Svarahi's own monogram (raster, 240px)", licence: "Svarahi-owned", attribution: "—", exactProduct: false, note: "Official vector still required", graphic: true });

const prov = JSON.parse(readFileSync(join(ORIG, "unsplash/provenance.json"), "utf8"));
const UNSPLASH_ALT = {
  "bridal-red-choker": "Bride in a red lehenga wearing a gold choker and layered necklaces",
  "bridal-kundan-smile": "Smiling bride wearing a kundan necklace set and maang tikka",
  "bridal-red-veil": "Bride in a red and gold veil wearing layered gold necklaces",
  "bridal-kundan-choker": "Bride wearing a kundan choker, chandbalis and maang tikka",
  "bridal-maang-tikka": "Bride with a pearl maang tikka and kundan jewellery",
  "bridal-gold-layers": "Bride wearing layered gold necklaces and a nose ring",
  "festive-temple-haar": "Woman in a sea-green silk saree wearing a long temple haar",
  "festive-green-saree": "Woman in a green saree wearing a pearl and gold necklace set",
  "everyday-jhumka-profile": "Close-up of a pearl-drop gold jhumka worn on the ear",
  "macro-gold-necklace-black": "Gold necklace with fine beadwork on black",
  "macro-gold-chain-black": "Gold beaded chain and earrings on black",
  "display-jhumka-wall": "Wall of gold jhumkas on display",
  "nakshi-pendant-black": "Detailed gold pendant with red stones on black",
  "gem-emerald-ring-macro": "Gold ring with an emerald centre, macro",
  "bangle-wooden-box": "Gold bangles resting on a carved wooden box",
  "bangles-stack-dark": "Stack of ornate gold bangles on a dark surface",
  "display-gold-bracelets": "Rows of gold bracelets in a jewellery shop window",
  "bangles-stone-dark": "Stone-set bangles on a dark background",
  "display-warm-counter": "Warmly lit jewellery counter with trays of gold",
  "interior-modern-store": "Modern jewellery store interior with display cases",
  "counter-dark-case": "Dark display case filled with jewellery",
  "display-necklace-bust": "Diamond necklace displayed on a black bust",
  "display-gold-tray": "Gold jewellery arranged on trays in a showroom",
};
for (const p of prov) {
  const showroom = p.group.startsWith("showroom");
  add({
    id: `ux-${p.id}`, src: p.file.replace("assets-originals/", ""), out: `${p.group}/${p.id}`, group: showroom ? "D" : "C",
    alt: UNSPLASH_ALT[p.id] ?? p.use, source: p.sourcePage, publisher: `Unsplash — @${p.photographer}`, origin: p.profile,
    licence: "Unsplash License", attribution: "Not required (appreciated); credited on /credits", exactProduct: false,
    note: showroom ? "Inspiration only — never present as Svarahi's showroom" : "Licensed editorial — not Svarahi inventory; no model release",
  });
}

// ── Group F: Nano Banana AI-generated editorial concepts ───────────────────
// Originals copied from public/assets/generated/nano-banana/**.jpg (their existing
// optimized files are left untouched); new responsive variants go to …/web/.
const aiMeta = JSON.parse(readFileSync(join(ROOT, "docs/ai-assets/asset-manifest.json"), "utf8"));
const AI_CAPTION = {
  "ai-showroom-concept-001": "Conceptual showroom visualisation — not our store",
  "ai-counter-stage-001": "Conceptual counter visualisation — not our store",
  "ai-craftsmanship-macro-001": "AI-generated craft concept — not a Svarahi piece or workshop",
};
for (const a of Object.values(aiMeta)) {
  const orig = a.files.original.replace("/assets/generated/nano-banana/", "nano-banana/");
  const name = orig.split("/").pop().replace(/\.jpg$/, "");
  add({
    id: a.assetId, src: orig, out: `generated/nano-banana/web/${name}`, group: "F", alt: `AI-generated concept: ${a.altText}`,
    source: "Nano Banana 2 via Antigravity (docs/ai-assets/generation-log.md)", publisher: "Generated for Svarahi v2",
    origin: "AI-generated — fictional models, jewellery and spaces", licence: "Generated asset — commercial use subject to Google generative AI terms",
    attribution: "—", exactProduct: false,
    note: "Group F: never product/SKU imagery, never real customers, never the real showroom (docs/ai-assets/usage-restrictions.md)",
    caption: AI_CAPTION[a.assetId] ?? "AI-generated editorial concept — not Svarahi jewellery",
  });
}

// ── optimize ────────────────────────────────────────────────────────────────
const manifest = [];
const LADDER = [640, 1280, 1920];
for (const e of entries) {
  const src = join(ORIG, e.src);
  if (!existsSync(src)) throw new Error(`missing original ${e.src}`);
  const buf = readFileSync(src);
  const meta = await sharp(buf).metadata();
  const { dominant } = await sharp(buf).stats();
  const widths = e.graphic ? [Math.min(meta.width, 520)] : [...new Set([...LADDER.filter((w) => w < meta.width), Math.min(meta.width, 1920)])].sort((a, b) => a - b);
  const formats = e.graphic ? ["webp", "png"] : ["avif", "webp"];
  for (const w of widths) for (const f of formats) {
    const out = join(PUB, `${e.out}-${w}.${f}`);
    if (existsSync(out) && !process.env.FORCE) continue; // cache: originals are immutable
    mkdirSync(dirname(out), { recursive: true });
    let p = sharp(buf).resize({ width: w, withoutEnlargement: true });
    p = f === "avif" ? p.avif({ quality: 56, effort: 5 }) : f === "webp" ? p.webp({ quality: e.graphic ? 92 : 80, effort: 5 }) : p.png({ compressionLevel: 9 });
    await p.toFile(out);
  }
  manifest.push({
    id: e.id, group: e.group, groupLabel: GROUP[e.group], path: `/assets/${e.out}`, widths, formats,
    width: meta.width, height: meta.height, dominant: `#${[dominant.r, dominant.g, dominant.b].map((n) => n.toString(16).padStart(2, "0")).join("")}`,
    alt: e.alt, category: e.category ?? null, pieceCode: e.pieceCode ?? null, exactProduct: e.exactProduct,
    source: e.source, publisher: e.publisher, origin: e.origin, licence: e.licence, attribution: e.attribution, note: e.note,
    caption: e.caption ?? null,
    // Public pages may only use assets whose licence/ownership is resolved.
    publicUse: !/Unknown/.test(e.licence),
    original: `assets-originals/${e.src}`, sha256: createHash("sha256").update(buf).digest("hex"), bytes: buf.length,
  });
}
mkdirSync(join(ROOT, "src/content"), { recursive: true });
writeFileSync(join(ROOT, "src/content/asset-manifest.json"), JSON.stringify({ generated: TODAY, groups: GROUP, assets: manifest }, null, 2) + "\n");

// ── registers ───────────────────────────────────────────────────────────────
const csv = (rows) => rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";
mkdirSync(join(ROOT, "docs/registers"), { recursive: true });
writeFileSync(join(ROOT, "docs/registers/image-source-register.csv"), csv([
  ["id", "group", "library_path", "source_url", "publisher_or_photographer", "origin", "download_date", "original_file", "sha256"],
  ...manifest.map((m) => [m.id, m.group, m.path, m.source, m.publisher, m.origin, TODAY, m.original, m.sha256]),
]));
writeFileSync(join(ROOT, "docs/registers/image-rights-register.csv"), csv([
  ["id", "group", "licence", "attribution_required", "exact_svarahi_product", "intended_usage", "restrictions", "owner_permission", "publication_approval"],
  ...manifest.map((m) => [m.id, `${m.group} — ${m.groupLabel}`, m.licence, m.attribution, m.exactProduct ? "yes" : "no", m.alt, m.note, m.group === "B" ? "owned (vector pending)" : "pending", "pending"]),
]));

// ── contact sheet ───────────────────────────────────────────────────────────
const S = 240, L = 34, C = 8;
const comps = [];
for (const [i, m] of manifest.entries()) {
  const file = join(PUB, `${m.path.replace("/assets/", "")}-${m.widths[0]}.${m.formats.includes("webp") ? "webp" : m.formats[0]}`);
  const x = (i % C) * S, y = Math.floor(i / C) * (S + L);
  comps.push({ input: await sharp(file).resize(S - 8, S - 8, { fit: m.formats.includes("png") ? "contain" : "cover", background: "#24090F" }).toBuffer(), left: x + 4, top: y + 4 });
  const label = `${m.group} · ${m.path.replace("/assets/", "")}`.slice(0, 40).replace(/&/g, "&amp;");
  comps.push({ input: Buffer.from(`<svg width="${S}" height="${L}"><text x="4" y="14" font-size="10.5" font-family="Arial" font-weight="bold" fill="#5C1426">${m.group}</text><text x="18" y="14" font-size="10" font-family="Arial">${label.slice(4)}</text><text x="4" y="28" font-size="9" font-family="Arial" fill="#6B5A5E">${m.licence.slice(0, 44)}</text></svg>`), left: x, top: y + S - 2 });
}
const rows = Math.ceil(manifest.length / C);
await sharp({ create: { width: C * S, height: rows * (S + L), channels: 3, background: "#FCF7EF" } }).composite(comps).jpeg({ quality: 84 }).toFile(join(ROOT, "docs/registers/image-contact-sheet.jpg"));

const byGroup = Object.fromEntries(Object.keys(GROUP).map((g) => [g, manifest.filter((m) => m.group === g).length]));
console.log(`assets: ${manifest.length}  by group: ${JSON.stringify(byGroup)}`);
