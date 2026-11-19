import { ImageResponse } from "next/og";

/**
 * Default social preview: typographic, brand colours only — no photograph, so
 * nothing in a shared link can be mistaken for Svarahi inventory or rights-unclear imagery.
 */
export const alt = "Svarahi — Jewellery straight from manufacturers, Jayanagar, Bengaluru";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(70% 90% at 50% 20%, #3a0c16, #140608 70%)", color: "#fbf6ee", fontFamily: "serif" }}>
        <div style={{ display: "flex", width: 120, height: 120, border: "3px solid #d4a94f", transform: "rotate(45deg)", marginBottom: 56 }} />
        <div style={{ fontSize: 92, letterSpacing: 28, marginLeft: 28 }}>SVARAHI</div>
        <div style={{ width: 180, height: 2, background: "#d4a94f", margin: "28px 0" }} />
        <div style={{ fontSize: 34, color: "#ead2a0", fontStyle: "italic" }}>Jewellery straight from manufacturers</div>
        <div style={{ fontSize: 24, marginTop: 18, color: "rgba(251,246,238,0.7)", letterSpacing: 6, textTransform: "uppercase" }}>Jayanagar · Bengaluru</div>
      </div>
    ),
    size,
  );
}
