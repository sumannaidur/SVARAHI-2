/**
 * Verified business facts only (docs/02-business-research.md).
 * Anything commercial (offers, hours, rating, parking, extra phone) lives in
 * commercial-claims.json and renders only when its status is "approved".
 */
import claimsFile from "./commercial-claims.json";

export const business = {
  name: "Svarahi",
  positioning: "Jewellery straight from manufacturers", // approved (claims: manufacturer-direct)
  voice: "Modern elegance. Traditional soul.", // Instagram bio
  address: ["1st Floor, Svarahi, 33rd Cross Road", "4th T Block East, Jayanagar", "Bengaluru, Karnataka 560041"],
  landmark: "Beside Emmadi (Silver) / Rajalakshmi Jewellery", // Instagram captions, svarahigold.xyz
  postal: { street: "1st Floor, 33rd Cross Road, 4th T Block East", locality: "Jayanagar, Bengaluru", region: "Karnataka", code: "560041", country: "IN" },
  geo: { lat: 12.9260901, lng: 77.5875978 }, // Google Maps
  phone: { display: "+91 85500 00483", tel: "+918550000483" }, // svarahi.co
  whatsapp: "918550000483", // svarahigold.xyz lists this number for WhatsApp
  email: "svarahi.jewels@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/Uw7Ez2wVE7kagTye9", // link supplied in the brief (canonical link still to confirm)
  instagram: "https://www.instagram.com/svarahijewels/",
  svarahiGold: "https://svarahigold.xyz/index.html", // separate bullion platform
} as const;

export const wa = (text: string) => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
export const tel = () => `tel:${business.phone.tel}`;

type Claim = (typeof claimsFile.claims)[number];
/** Returns a claim only if approved — the single gate for commercial content. */
export function approvedClaim(id: string): Claim | null {
  const c = claimsFile.claims.find((x) => x.id === id);
  return c && c.status === "approved" ? c : null;
}
