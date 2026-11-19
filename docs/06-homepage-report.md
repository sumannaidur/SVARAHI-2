# Phase 6: Homepage report ("Velvet & Gold")

**Built:** 19 Nov 2026, in Claude Code. Runs at `http://localhost:3200/`.

## 1. Homepage
| Scene | What it does | Desktop (≥1024px, motion allowed) | Mobile / tablet |
|---|---|---|---|
| **Hero** | Jewellery-first campaign. Copy: "Jewellery straight from manufacturers" (the approved positioning). CTAs: Explore collections, Showroom enquiry. Small logo. | Pinned. The photograph narrows into a **temple arch** while the headline lifts away, then "From first look to forever" appears. | The portrait campaign cover fills the top 62% (the necklace stays clear of the copy). Gentle parallax. Both CTAs sit above the action bar. |
| **Journey** | Discover → Understand → Experience → Decide → Make it yours. Copy restates svarahi.co's published buying process. | Pinned stepper with a gold progress line. The arch image crossfades per step. | Stacked steps, each with an arch thumbnail, revealed on entry |
| **Signature collections** | Temple & Antique, Bridal, Bangles, Earrings, Necklaces, Men's. Arch cards, each opening a WhatsApp enquiry for that collection. | Pinned **horizontal** gallery: cards scale from depth with inner parallax. | Native swipe with scroll-snap. No hijacked scrolling. |
| **Velvet counter** | The empty counter concept as the presentation environment. Three points: see it in the light, purity and weight explained, price on the day's rate. CTAs: Reserve a showroom trial, Directions. | Pinned. The scene opens from an arch to full width, a spotlight travels across, and the hotspots appear. | Image with zoom-out on scroll, plus a list of the three points |
| **Craftsmanship** | Nakshi, granulation and stone setting, described as general techniques. No in-house workshop claim. | Pinned macro zoom-out into an arch, a light sweep, the terms in sequence, and two detail images rising in parallax. | Macro with zoom-out on scroll |
| **Visit** | "Find the piece that becomes yours". WhatsApp, Explore, Google Maps, Call. Address, phone and email. Hours show "to be confirmed". A separate Svarahi Gold link. | Static editorial | Same, stacked |

**Persistent actions:**
- **Mobile and tablet:** a bottom bar with WhatsApp, Visit and Directions.
- **Desktop:** a "WhatsApp concierge" button in the header.

## 2. Animation architecture
- **One engine:** GSAP 3.13 + ScrollTrigger on **native scroll**. There's no Lenis or smooth-scroll library, so mobile momentum, find-in-page and accessibility stay natural.
- **`useGSAP` + `gsap.matchMedia()`** in every scene:
  - Desktop gets the cinematic version.
  - Mobile gets light reveals and parallax, with no pins.
  - Reduced motion registers nothing.
  - Everything reverts on unmount or breakpoint change.
- **Hidden-until-animated states are set only from JS.** With JS off or reduced motion on, all content is visible.
- **Transforms, opacity and `clip-path` only.** `containerAnimation` drives the per-card effects inside the horizontal gallery.
- **Framer Motion and React Three Fiber were not installed.** No component interaction needed them yet, and the homepage has no real 3D model to justify Three.js. They'll be added where Phases 7–9 need them (the lookbook and counter interactions).
- **CSS only** for hovers and the light-sweep keyframe (disabled under reduced motion).

## 3. Asset integration
- **Pipeline:** `npm run assets` now includes **Group F**.
  - The 13 Nano Banana originals are *copied* into `assets-originals/nano-banana/`.
  - New variants go to `public/assets/generated/nano-banana/web/`.
  - Antigravity's own optimized files are untouched.
- **Totals:** 83 assets: B 4 · C 58 · D 7 · E 1 · F 13.
- **Rights gate:**
  - Each asset now has `publicUse` (false when the licence is "Unknown").
  - `publicAsset()` **fails the build** if a public page references an unresolved asset.
  - **36 svarahi.co stock images of unknown origin are excluded** from the homepage.
  - 47 are eligible: 30 Unsplash-licensed, 4 brand, 13 AI.
- **On the homepage:** 15 distinct assets (B 1 · C 5 · D 1 · F 8). Every non-brand image carries its caption:
  - "AI-generated editorial concept — not Svarahi jewellery"
  - "Conceptual counter visualisation — not our store"
  - "Licensed editorial imagery — not Svarahi inventory"

### Group F review
| Asset | Verdict | Used for |
|---|---|---|
| hero-bridal-campaign (16:9) | Strong. Believable temple choker, warm light, left negative space. Only 1376px wide, so slightly soft on 1920px screens. | Desktop hero |
| campaign-cover-01 (9:16) | Strongest image. Detailed choker, jhumkas and maang tikka. | Mobile hero |
| lookbook-heritage-01 | Strong. Lakshmi haram and choker, carved arch backdrop. | Temple & Antique card |
| lookbook-bridal-01 | Strong. South Indian bridal set. | Bridal card, journey step 5 |
| lookbook-mens-01 | Good. Kada, chain and signet ring. | Men's card |
| macro-craftsmanship-01 | Excellent macro detail | Craftsmanship |
| velvet-counter-stage-01 | Excellent empty stage. On-palette. | Velvet counter, journey step 3 |
| texture-oxblood-velvet-01 | Good | Journey background (soft-light) |
| lookbook-festive-01, lookbook-everyday-01 | Good | Not used yet (reserved for the lookbook, Phase 7) |
| interior-concept-01 | Polished, but shows a high-rise with a city view, which contradicts a first-floor Jayanagar store | **Not used** on the homepage |
| texture-brushed-gold, texture-ivory-silk | Usable | Not used yet |

## 4. Responsive testing (automated, Edge/Chromium)
| Viewport | Result |
|---|---|
| 360, 390, 768, 1024, 1440, 1920 | No horizontal overflow, 0 broken images, 0 console or page errors |
| 390×844 | Both hero CTAs end at 760px, above the 60px action bar |

## 5. Accessibility and reduced motion
| Check | Result |
|---|---|
| Reduced motion | 0 pinned sections; every heading, step and term visible |
| JavaScript disabled | Full content renders: h1, 5 sections, 23 images |
| Keyboard | First Tab reaches "Skip to content"; all actions are real links or buttons; gold focus ring |
| Semantics | One h1; each section labelled by its h2; address in `<address>`; decorative layers `aria-hidden` |
| `noindex` | Present (`noindex, nofollow`) |
| Claims | No pending commercial claim rendered (checked for 2.5%, 0% making, ₹123, 7.5%, 65%, 4.9, 70191, parking) |
| Links | 35 links, all either valid in-page anchors or verified destinations (wa.me 918550000483, the Maps link, svarahigold.xyz, Instagram, tel, mailto) |

## 6. Build and lint
- `tsc --noEmit`: **pass**.
- `eslint src scripts`: **0 errors**. One warning, inside Antigravity's `scripts/process-ai-assets.js`, left unmodified. ESLint now allows `require()` in `scripts/**/*.js`.
- `next build`: **pass**. Routes `/` and `/direction` are statically prerendered.
- **Fixed during QA:**
  - `new Date()` in the footer broke prerendering under Cache Components.
  - Mobile hero headline covered the necklace.
  - Hero caption sat on the model's head.
  - Arch dome hidden under the header.
  - Velvet texture tile seams.
  - Craft caption clipped by its mask.
  - Visit-card and collection numbers clipped by the arch curves.

## 7. Not done or not verified
- Real iOS and Android devices (only emulated).
- Lighthouse, LCP, INP and CLS measurement (scheduled for Phase 11).
- Collection cards open WhatsApp because collection pages don't exist yet (Phase 7).
- Men's jewellery isn't a verified Svarahi category, so its card asks rather than asserts.
- WhatsApp uses +91 85500 00483, which svarahigold.xyz lists as WhatsApp. The owner should confirm it for jewellery.
- The Maps link is the one from your brief; the canonical link is still to confirm.

## 8. Remaining missing assets
See `docs/registers/missing-assets.md` and `docs/ai-assets/missing-real-assets.md`. The critical ones:
- Real Svarahi product photography (**Group A is still 0**).
- Showroom photographs.
- Vector logo.
- Original Instagram media.
- Approved offer terms.
- Confirmed hours.

## Isolation
The Phase 7 project was re-fingerprinted after Phase 6: **346 files, tree hash `09919b89…`, HEAD `a5d1b2b`, 0 changes.**
