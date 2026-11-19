# Phase 10 — Svarahi Gold bridge and showroom conversion

Status: built, awaiting review. Not committed, not deployed, `noindex` kept.

## What was built

### `/gold`: the Svarahi Gold bridge
This page explains Svarahi Gold and opens it. It does nothing else, as the brief requires: "must open the existing separate bullion platform" and "do not merge trading accounts, order management or financial data".

- **Hero:**
  - Says that Svarahi Gold is a separate platform with its own rates, accounts and KYC.
  - **Open Svarahi Gold ↗** opens `svarahigold.xyz` in a new tab (`noopener`).
  - A note says that nothing from this site, including the trial tray, is shared with it.
- **Comparison table** of jewellery here and bullion on Svarahi Gold: what each is for, prices, how you buy, accounts. It has a caption and row headers.
- **Rates:** the site states plainly that it never shows gold or silver rates.
- **Illustration:** stacked gold bars drawn in CSS and labelled "Illustration". GSAP drops them in and sweeps light across on scroll; reduced motion keeps them static. No photograph or 3D model is used, so nothing can be mistaken for inventory, and Three.js wasn't used because no real 3D assets exist.
- **What the page does not have:** forms, inputs, logins, rates or third-party requests.

### `/visit`: showroom conversion
- **Hero:**
  - The verified address and landmark. The landmark, "Beside Emmadi (Silver) / Rajalakshmi Jewellery", comes from Instagram captions and svarahigold.xyz.
  - **Plan your visit** and **Directions ↗** buttons.
  - Showroom inspiration image (Group D), captioned "Showroom inspiration — not our store".
- **Visit planner** (`components/visit/visit-planner.tsx`):
  - Optional fields:
    - Name.
    - Occasion chips (`aria-pressed`).
    - Preferred day: past dates are blocked with an announced error.
    - Time of day: a window, not a slot, because hours are unconfirmed.
    - Group size.
    - Include my trial tray: on by default when the tray has pieces.
    - Notes.
  - A **live preview of the exact message** is shown next to the form.
  - **Send on WhatsApp** goes to the verified number. **Email instead** is also offered.
  - Nothing is stored or posted by the site.
- **What to expect** (4 steps). The pricing step reuses the sales model already published in the FAQ: weight × the day's rate, with making charge and GST shown separately, and purchase in person.
- **Concierge:**
  - Contact tiles: WhatsApp, call, email, directions.
  - Opening hours read "To be confirmed" while the claim is pending.
  - "Read reviews on Google Maps ↗". No rating is shown because it is unverified.
- **Svarahi Gold link card** (→ `/gold`).
- **`JewelryStore` JSON-LD** with verified facts only: name, address, geo, phone, email, map and Instagram. There are no hours, rating or price range.

## Conversion wiring across the site (shared-shell changes)

| Where | Change |
|---|---|
| Header (desktop and mobile menu) | **Visit** → `/visit` (was `/#visit`). **Svarahi Gold** → `/gold` (was a direct external link). |
| Mobile action bar | Visit → `/visit` |
| Footer link row | + Visit, + Svarahi Gold |
| Trial-tray drawer | + "Plan a visit with this tray", which goes to `/visit#plan` with the pieces already in the message |
| Showroom CTA band (every inner page) | + "Plan your visit →" |
| `business.ts` | + `landmark`, `postal`, `geo` (verified in `docs/02-business-research.md`) |

The homepage itself was not modified. Its own Visit section still links to Svarahi Gold directly, which still opens the platform as the brief requires.

## Not built: blocked on owner approval

**Savings visualiser** (brief priority 8). Every figure it would need is still `pending` in `commercial-claims.json`: 2.5% V.A., 0% making charges, ₹123/g, Gold+ up to 7.5%, stone policy and buyback. Building it now would mean publishing unapproved claims. It can be added once claims are approved with their terms and dates.

## QA: all phases re-run

| Suite | Result |
|---|---|
| Phase 10 (`v2qa10.mjs`) | **31/31** |
| Phase 9 (craft, reels, bridal) | 36/36 |
| Phase 8 (counter and tray) | 16/16 |
| Phase 7 (collections, 32 pages) | 19/19 |
| Phase 6 (homepage) | 16/16 |
| **Total** | **118/118** |
| `tsc`, `eslint` | 0 errors, 0 warnings |
| `npm run build` | 45 static pages |

The Phase 10 suite covers:
- **Page basics:** 200, a single h1 and noindex on both pages; no overflow or page errors at 1440 and 390.
- **Rights and claims:** only public-cleared, captioned images; no rates, prices, weights, hours or ratings.
- **Links and requests:** external links are on the allow-list and open in a new tab with `noopener`; there are no third-party requests, embeds or form posts.
- **`/gold`:** it states the separation, has exactly two CTAs to the existing platform, and has no account or trading UI.
- **Planner:**
  - Tray pieces are included by default.
  - The live preview updates for every field.
  - Past dates are blocked and announced.
  - Submitting opens `wa.me/918550000483` with exactly the previewed text.
  - Nothing new is persisted.
- **`/visit`:** the JSON-LD contains verified facts only, and hours show "To be confirmed".
- **Wiring:** header, footer, CTA band, mobile action bar, and the tray drawer to planner hand-off.
- **Reduced motion:** the gold illustration is static.

The Phase 6 suite's link allow-list was extended with `/visit` and `/gold`.

Screenshots are in `docs/screenshots/phase-10/`: desktop and mobile scroll-walks plus two contact sheets.

## Isolation

`Desktop/svarahi` is **unchanged since the Phase 9 check**: 346 files, tree `d9f422ca…`, HEAD `fcba436`. Saved as `docs/isolation/phase7-after-v2-phase10.json`.

The Phase 9 report noted the earlier README commit made there outside this session (fcba436), which still awaits your confirmation.

## For owner review
- Confirm the bridge copy: "own rates, accounts and KYC" and "Rates are shown on Svarahi Gold itself".
- Confirm the opening hours. Once the `hours` claim is approved, it appears automatically on `/visit`, on the homepage and in the JSON-LD (the JSON-LD needs a one-line addition).
- Confirm the landmark wording and the canonical Maps link.
- Approve the claims needed for the savings visualiser.
- Real iPhone and Android testing and Lighthouse are still outstanding, scheduled for Phases 11 and 12.
