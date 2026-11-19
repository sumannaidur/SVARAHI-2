# V2 Phase 7: Collections and interactive jewellery discovery

**Built:** 19 Nov 2026, in `Desktop\svarahi-flagship-v2` only. 32 new pages, all statically prerendered.

## 1. Pages
| Route | What it contains |
|---|---|
| `/collections` | Editorial hero (arch reveal, parallax). An **eight-collection arch grid** with hover reveals. **Men's Jewellery shown as "Proposed — awaiting confirmation"**: it has no page, and its card asks on WhatsApp. **The catalogue**: all 23 pieces with category and style filters, a live count, an empty state and reset, and shareable URLs (`?category=&style=`). Showroom CTA. |
| `/collections/[slug]` ×8 | Necklaces & Haram Sets · Temple & Antique · Earrings & Jhumkas · Bangles & Bracelets · Rings · Pendants · Chains · Bridal Collections. Each has: a mood hero, a "how to choose" story band, a **horizontal piece rail**, **"Svarahi pieces, as posted"** (official Instagram embeds of Svarahi's real jewellery, on 6 of 8 collections), a link to the next collection, and a showroom CTA. |
| `/pieces/[code]` ×23 | Large arch-framed visual with an intro iris and light sweep; tap/hover zoom only where a real image exists. Category, **name and code** (svarahi.co catalogue references), style tags (derived from the piece name and labelled as such), and a **"Confirmed with you, in person"** panel instead of specifications. Enquire on WhatsApp (message includes name and code), Reserve a trial, Email enquiry, Call, Directions. Previous/next piece, related pieces, showroom CTA. |

**Temple & Antique** is a style collection. It includes pieces whose published names say temple or kemp (SV-E01 Temple Jhumka Set, SV-S01 Kemp Bridal Set), plus Svarahi's own antique kada, temple necklace and antique ring posts from Instagram.

## 2. Image authenticity
| Rule | Implementation |
|---|---|
| Unknown-licence images never appear publicly | `publicAsset()` fails the build. Only **5 of 23** catalogue images are cleared (SV-N02, SV-B01–B04, which are Unsplash photos svarahi.co uses). The other **18 show "Photograph to follow"**, a deliberate velvet arch with the monogram. |
| Representative is never shown as inventory | Every cleared piece image carries "Style reference · not the actual piece", and piece pages explain where the image comes from |
| Group F never on SKU pages | Verified on all 23 piece pages: 0 AI images. AI imagery appears only as collection mood heroes, with captions. |
| No fake angles or 360° | Each piece shows "One view only — additional angles have not been photographed". No 360° viewer is rendered. |
| Real Svarahi jewellery | Instagram embeds of @svarahijewels jewellery-only posts. Media stays on Instagram, with no copying; posts showing people are excluded. |
| No invented specifications | No purity, weight, price, stone or stock data exists in the code. All pages restate svarahi.co's published policy: price by weight and the day's rate, making charge and GST separate, purchase in person. |

## 3. Interaction engineering
- **GSAP + ScrollTrigger**, on native scroll:
  - `Reveal`: fade-up, temple-arch iris and parallax.
  - `PieceRail`: pins and travels horizontally on desktop *only when the rail overflows*. Necklaces pins; Bangles' 4 cards fit, so it doesn't.
  - `PieceStage`: intro arch iris and gold sweep.
  - All set up inside `gsap.matchMedia`, so reduced motion registers nothing.
- **Framer Motion** (new dependency, `framer-motion@11.18.2`): used only for the catalogue grid's **layout animation** when filters change. `AnimatePresence` was deliberately not used, because it generates random IDs during render, which this Next.js version's Cache Components mode rejects at prerender.
- **Three.js:** not used. No real 3D assets exist.
- **Mobile:** rails and Instagram strips use native swipe with scroll-snap; filter chips scroll horizontally; the persistent action bar appears on every page.

## 4. Phase 6 changes (necessary integration)
- **Header and action bar:** links changed from in-page anchors (`#counter`) to site paths (`/collections`, `/#counter`, `/#visit`) so they work from every route. They now use `next/link` (lint requirement, and faster navigation).
- **No homepage sections were changed.** The homepage collection cards still open WhatsApp; linking them to the new category pages is offered as an option.

## 5. QA results
**Phase 7 suite: 19/19 pass.**

| Check | Result |
|---|---|
| Pages render | All 32 pages render (200, h1, no errors) |
| Layout and images | No overflow or broken images at 1440 and 390 |
| Assets | Only rights-cleared assets on every page; no Group F on any piece page |
| Links | 1,233 links checked, every one a valid internal route or a verified destination; all 33 internal URLs resolve |
| Enquiries | Every piece's WhatsApp message names its code |
| Indexing | `noindex` on every page |
| Claims | No pending claim, purity or weight figure rendered |
| Filters | Click, combine, empty state, reset, URL; Temple & Antique cross-membership |
| Keyboard | Filter buttons and image zoom operable |
| Mobile | Action bar present |
| Reduced motion | No pins; all content visible; rails natively scrollable |
| Desktop rails | Pin only when they overflow |

**Homepage regression suite: 16/16 pass.** The link allow-list was updated for the new routes.

**Build:**
- `tsc`: pass.
- `eslint`: 0 errors (1 pre-existing warning in Antigravity's script).
- `next build`: pass, **39 static pages**.

**Fixed during QA** (framework compliance under Cache Components):
- Removed `dynamicParams`.
- Moved the `params` read inside `<Suspense>`.
- Removed `AnimatePresence`.
- Corrected a false positive in my claims check ("Instagram" contains "gram").

**Known behaviour (documented by Next.js):** unknown slugs, such as `/collections/mens`, render the not-found page, but because `notFound()` runs inside the Suspense boundary the HTTP status stays **200**, with `noindex` added. Every real route is prerendered.

## 6. Final owner-review checklist (outstanding)
- [ ] **Real iPhone (Safari) and Android (Chrome) testing.** Only Chromium emulation so far.
- [ ] **Lighthouse audits**: LCP, INP, CLS, accessibility and SEO on the home, collection and piece templates.
- [ ] Owner confirms the 23 catalogue names and codes are current, and supplies photographs.
- [ ] Owner confirms men's jewellery (to promote it from proposed to a live category).
- [ ] Owner approves the Instagram embeds and a third-party embed policy.

## 7. Remaining asset and business-information requirements
1. **Svarahi's own photographs of every piece.** Group A is still 0. Ideally 3–5 angles each, plus turntable frames for flagship pieces if a 360° view is wanted.
2. Licence confirmation, or replacement, for the 18 catalogue images of unknown origin.
3. Per-piece specifications to publish, if the owner wants them online: purity, weight, stones.
4. Confirmation of the men's range.
5. The vector logo, showroom photographs, confirmed hours, the WhatsApp number and the canonical Maps link (all unchanged from Phase 6).
6. Approved commercial terms. **No claims were changed.**

## Isolation
`Desktop\svarahi` was re-fingerprinted after this phase: **346 files, tree hash `09919b89…`, HEAD `a5d1b2b`, 0 changes.** The snapshot is in `docs/isolation/phase7-after-v2-phase7.json`.
