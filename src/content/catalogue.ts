/**
 * Collections and pieces for v2.
 *
 * Pieces: the 23 names + codes Svarahi publishes on svarahi.co/collections
 * (the business's own catalogue references). svarahi.co states its photos are
 * "representative", so no image here is ever the actual piece. Only images whose
 * licence is resolved (publicUse) are shown; the rest use the photograph-to-follow
 * state. Group F (AI) imagery is never attached to a piece.
 *
 * No purity, weight, price, gemstone specification or stock is stored — none is verified.
 */
import manifest from "./asset-manifest.json";
import ig from "./instagram.json";

export type CategorySlug = "necklaces" | "temple-antique" | "earrings" | "bangles" | "rings" | "pendants" | "chains" | "bridal";

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  /** Descriptive story copy — styles and wearing occasions, no product claims. */
  story: string[];
  hero: string; // asset id (public, C or F mood imagery)
  instagram: string[]; // official @svarahijewels post codes (jewellery-only)
}

export const categories: Category[] = [
  {
    slug: "necklaces", name: "Necklaces & Haram Sets", short: "Chokers, haars and long harams",
    story: ["From a close choker to a long haram that falls past the heart, a necklace sets the tone for everything else you wear.", "Bring the outfit you are planning for — we will lay out options on the counter so you can see them against it."],
    hero: "ai-lookbook-festive-001", instagram: ["Df1Sle8Bj40", "DfoapF2lJmf", "Dfl11nDlO1E"],
  },
  {
    slug: "temple-antique", name: "Temple & Antique", short: "Deity motifs, nakshi relief and antique finishes",
    story: ["Temple jewellery borrows its forms from South Indian temple architecture and deity ornaments — Lakshmi motifs, peacocks, lotus and mango shapes.", "An antique finish softens the shine so every carved detail reads clearly. These are pieces best seen in person, turning in the light."],
    hero: "ai-lookbook-heritage-001", instagram: ["Df1Sle8Bj40", "Df33YXwBa9M", "DfjRIoakc7D"],
  },
  {
    slug: "earrings", name: "Earrings & Jhumkas", short: "Jhumkas, chandbalis and studs",
    story: ["Jhumkas sway, chandbalis catch the light, studs stay quietly put. Earrings are the easiest place to start a set — or to finish one.", "Try them on with your hair the way you plan to wear it; we will hold up a mirror."],
    hero: "ux-everyday-jhumka-profile", instagram: ["Dfyty5eAS5t", "Dfq_aIBEYlT"],
  },
  {
    slug: "bangles", name: "Bangles & Bracelets", short: "Kadas, stacks and stone-set bangles",
    story: ["A single kada, a pair for a wedding, or a stack that builds over years.", "Size matters more here than anywhere else — we measure in the showroom so every bangle sits right."],
    hero: "ux-bangles-stack-dark", instagram: ["Df33YXwBa9M", "DftkM4CDBn1"],
  },
  {
    slug: "rings", name: "Rings", short: "Statement rings and everyday bands",
    story: ["From an antique-finish cocktail ring to a band you never take off.", "We size your finger at the counter and talk you through the setting before you decide."],
    hero: "ux-gem-emerald-ring-macro", instagram: ["DfjRIoakc7D"],
  },
  {
    slug: "pendants", name: "Pendants", short: "Pendants for chains and necklaces",
    story: ["A pendant changes a plain chain into something personal.", "Ask us to pair a pendant with the chain you already own, or with one from the counter."],
    hero: "ux-nakshi-pendant-black", instagram: [],
  },
  {
    slug: "chains", name: "Chains", short: "Everyday and layering chains",
    story: ["The piece you wear most days. Length, link and weight all change how a chain sits.", "Try a few lengths together at the counter to find your layering."],
    hero: "ux-macro-gold-chain-black", instagram: [],
  },
  {
    slug: "bridal", name: "Bridal Collections", short: "Complete sets for the wedding",
    story: ["A bridal set is chosen over more than one visit — with family, with the outfit, and with time to think.", "Book a showroom trial and we will lay out complete sets on the velvet counter for you."],
    hero: "ai-lookbook-bridal-001", instagram: ["DfwJDxcD1Vg", "Dfl11nDlO1E"],
  },
];

/** Proposed only — not a verified Svarahi category (business confirmation pending). */
export const proposedCategory = { name: "Men's Jewellery", short: "Kadas, chains and rings", status: "Proposed — awaiting confirmation", hero: "ai-lookbook-mens-001" };

type Seed = [code: string, name: string, cat: CategorySlug, image: string];
const SEEDS: Seed[] = [
  ["SV-N01", "Ruby and Pearl Haar", "necklaces", "sv-ruby-pearl-haar"],
  ["SV-N02", "Gold Coin Necklace", "necklaces", "sv-gold-coin-necklace"],
  ["SV-N03", "Kundan Necklace Set", "necklaces", "sv-kundan-necklace-set"],
  ["SV-N04", "Pastel Kundan Necklace", "necklaces", "sv-pastel-kundan-necklace"],
  ["SV-N05", "Oxidised Silver Set", "necklaces", "sv-oxidised-silver-set"],
  ["SV-E01", "Temple Jhumka Set", "earrings", "sv-temple-jhumkas"],
  ["SV-E02", "Ruby Halo Earrings", "earrings", "sv-ruby-halo-earrings"],
  ["SV-E03", "Diamond Flower Studs", "earrings", "sv-diamond-studs"],
  ["SV-E04", "Rose Gold Drops", "earrings", "sv-rose-gold-drops"],
  ["SV-B01", "Ruby-set Kadas", "bangles", "sv-ruby-kadas"],
  ["SV-B02", "Stone-set Bangles", "bangles", "sv-stone-set-bangles"],
  ["SV-B03", "Engraved Gold Bangles", "bangles", "sv-engraved-bangles"],
  ["SV-B04", "Filigree Bracelet", "bangles", "sv-filigree-bracelet"],
  ["SV-R01", "Pear Diamond Ring", "rings", "sv-pear-diamond-ring"],
  ["SV-R02", "Halo Solitaire Ring", "rings", "sv-halo-solitaire"],
  ["SV-R03", "Pink Sapphire Ring", "rings", "sv-pink-sapphire-ring"],
  ["SV-R04", "Diamond Stacking Bands", "rings", "sv-diamond-bands"],
  ["SV-P01", "Gold Bar Pendant", "pendants", "sv-bar-pendant"],
  ["SV-P02", "Circle Pendant Chain", "pendants", "sv-circle-pendant"],
  ["SV-C01", "Curb Link Chain", "chains", "sv-curb-chain"],
  ["SV-C02", "Oval Loop Chain", "chains", "sv-oval-loop-chain"],
  ["SV-S01", "Kemp Bridal Set", "bridal", "sv-kemp-bridal-set"],
  ["SV-S02", "Bridal Ensemble", "bridal", "sv-bridal-ensemble"],
];

/** Style tags derived only from words in the published piece name. */
const STYLE_RULES: [RegExp, Style][] = [
  [/temple|kemp/i, "temple-kemp"],
  [/kundan/i, "kundan"],
  [/diamond|solitaire/i, "diamond"],
  [/ruby|pearl|sapphire|stone/i, "gemstone"],
  [/gold/i, "gold"],
  [/silver/i, "silver"],
];
export type Style = "temple-kemp" | "kundan" | "diamond" | "gemstone" | "gold" | "silver";
export const STYLE_LABEL: Record<Style, string> = {
  "temple-kemp": "Temple & kemp", kundan: "Kundan", diamond: "Diamond", gemstone: "Gemstone & pearl", gold: "Gold", silver: "Silver",
};

const cleared = new Set(manifest.assets.filter((a) => a.publicUse).map((a) => a.id));

export interface Piece {
  code: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Rights-cleared representative image id, or null → photograph-to-follow state. */
  image: string | null;
  styles: Style[];
  /** Temple & Antique membership is by name (temple / kemp). */
  alsoIn: CategorySlug[];
}

export const pieces: Piece[] = SEEDS.map(([code, name, cat, image]) => {
  const styles = STYLE_RULES.filter(([r]) => r.test(name)).map(([, s]) => s);
  return {
    code,
    slug: code.toLowerCase(),
    name,
    category: cat,
    image: cleared.has(image) ? image : null,
    styles,
    alsoIn: styles.includes("temple-kemp") ? ["temple-antique"] : [],
  };
});

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getPiece = (slug: string) => pieces.find((p) => p.slug === slug);
export const piecesIn = (slug: CategorySlug) => pieces.filter((p) => p.category === slug || p.alsoIn.includes(slug));
export const related = (p: Piece, n = 6) => [...pieces.filter((x) => x.code !== p.code && x.category === p.category), ...pieces.filter((x) => x.code !== p.code && x.category !== p.category && x.styles.some((s) => p.styles.includes(s)))].slice(0, n);

export const igPost = (code: string) => ig.posts.find((p) => p.code === code && p.people === "none");
export const getPieceByCode = (code: string) => pieces.find((p) => p.code === code);

/** One WhatsApp message for the whole trial tray. */
export const trayMessage = (codes: string[]) => {
  const lines = codes.map((c) => getPieceByCode(c)).filter(Boolean).map((p) => `• ${p!.name} (${p!.code})`);
  return `Hi Svarahi, I'd like to reserve a showroom trial for these pieces from your website:\n${lines.join("\n")}\n\nWhen could I come in to see them?`;
};

export const enquiry = (p: Piece) =>
  `Hi Svarahi, I saw the ${p.name} (${p.code}) on your website. Could you share current photographs and details, and when I could see it in the showroom?`;
