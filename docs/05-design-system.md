# Phase 5: Design system and first visual direction, "Velvet & Gold"

**Creative line:** *Jewellery is the hero. The showroom is the destination.*

## Concept
Every screen behaves like a jeweller's **velvet counter**: a deep, quiet ground where the only bright thing is the jewellery.
- **Ivory editorial pages** interrupt the dark like a turned page in a lookbook.
- **Temple-arch frames** (the jharokha / gopuram silhouette) are the signature shape. They're Indian, architectural and jewellery-scaled, and they don't depend on the logo.
- **The logo stays small and quiet.** The jewellery is the attraction.

## Palette
| Token | Hex | Role |
|---|---|---|
| `velvet` | #140608 | Primary dark ground (counters, hero) |
| `oxblood` | #3A0C16 | Raised dark surfaces |
| `maroon` | #5C1426 | Brand continuity (svarahi.co theme colour) |
| `sindoor` | #B3122E | Accent from Svarahi's red wordmark. Small doses only: "visit" markers, live states. |
| `gold` | #D4A94F | Hairlines, numerals, focus rings |
| `gold-soft` | #EAD2A0 | Text accents on velvet |
| `ivory` | #FBF6EE | Editorial pages |
| `sandstone` | #EDE3D3 | Secondary light surface |
| `ink` | #1E1214 | Body text on light |

**Contrast:** ivory on velvet is 17.6:1, ink on ivory is 16.9:1, and gold-soft on velvet is 11.9:1, all AA/AAA. Gold #D4A94F on ivory fails for text, so it's used for decoration only.

## Typography
- **Display:** *Cormorant Garamond* (300/500, plus italic). Engraved, high-contrast, editorial. A distinct voice from Phase 7's Bodoni.
- **Text and UI:** *Manrope* (400/500/600). Clean and modern, with tabular numerals for prices and codes once approved.
- **Scale (fluid):**
  - Display XL clamp(3rem, 8vw, 8.5rem) / 0.92
  - Display L clamp(2.4rem, 5vw, 5rem)
  - Display M clamp(1.8rem, 3vw, 3rem)
  - Body 1rem / 1.65
  - Eyebrow 0.7rem with +0.28em tracking

*svarahi.co uses Bodoni Moda + Jost. The owner may prefer continuity, and switching is a token change.*

## Shape and composition
- **Arch masks:** a radius-top "temple arch" for featured imagery and bridal cards.
- **Square-cornered buttons with a gold hairline**, not pills. They read jeweller, not app.
- **Grid:** 12 columns, 1440px max, gutter clamp(16px, 4vw, 56px). Product imagery is generous; copy columns stay ≤ 60ch.

## Motion principles (implemented in Phase 6+)
- **One engine:** GSAP + ScrollTrigger for scroll; Framer Motion only for component state; R3F only where real 3D adds value.
- **Light, not bounce:** gold light sweeps, slow parallax, scale-from-depth. No springy UI.
- **Reduced motion:** every scene has a static composition.

## Honesty system (visible in the UI)
Every image carries its classification. On the site, groups C, D and E show a discreet caption:
- **C:** "Licensed editorial imagery — not Svarahi inventory"
- **D:** "Showroom inspiration — not our store"
- **E:** "Concept"

Representative catalogue images say so. Commercial claims render only when approved in `commercial-claims.json`.
