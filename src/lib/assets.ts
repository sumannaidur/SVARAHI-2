import manifest from "@/content/asset-manifest.json";

export type AssetGroup = "A" | "B" | "C" | "D" | "E" | "F";
export type Asset = (typeof manifest.assets)[number] & { group: AssetGroup };

const byId = new Map(manifest.assets.map((a) => [a.id, a as Asset]));

/** Any asset (internal/QA pages). */
export function asset(id: string): Asset {
  const a = byId.get(id);
  if (!a) throw new Error(`Unknown asset "${id}" — run npm run assets`);
  return a;
}

/**
 * Asset for a customer-facing page. Fails the build if the asset's licence or
 * ownership is unresolved (e.g. svarahi.co stock of unknown origin).
 */
export function publicAsset(id: string): Asset {
  const a = asset(id);
  if (!a.publicUse) throw new Error(`Asset "${id}" has unresolved usage rights and cannot appear on public pages`);
  return a;
}

export const assetsIn = (group: AssetGroup) => manifest.assets.filter((a) => a.group === group) as Asset[];

export const srcSet = (a: Asset, fmt: string) => a.widths.map((w) => `${a.path}-${w}.${fmt} ${w}w`).join(", ");
export const fallback = (a: Asset) => `${a.path}-${a.widths[a.widths.length - 1]}.${a.formats.includes("webp") ? "webp" : a.formats[0]}`;

/** Customer-facing honesty caption for each classification group. */
export const GROUP_CAPTION: Record<AssetGroup, string | null> = {
  A: null,
  B: null,
  C: "Licensed editorial imagery — not Svarahi inventory",
  D: "Showroom inspiration — not our store",
  E: "Concept",
  F: "AI-generated editorial concept — not Svarahi jewellery",
};

export const captionFor = (a: Asset) => a.caption ?? GROUP_CAPTION[a.group];
