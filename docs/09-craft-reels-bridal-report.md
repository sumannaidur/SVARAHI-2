# Phase 9 — Craftsmanship, Instagram and bridal experiences

Status: built, awaiting review. Not committed, not deployed, `noindex` kept.

## What was built

| Route | Experience | Motion |
|---|---|---|
| `/craft` | **Jeweller's loupe**: a circular lens over a macro photograph (C, `ux-nakshi-pendant-black`). It shows the real 1920px image at 2.4×, not an upscale. It follows the mouse, can be dragged on touch, and moves with the arrow keys (Shift for bigger steps). | React state only; the lens fades in and out. |
| | **Five crafts to look for** (nakshi, granulation, stone setting, kundan, antique finish). These describe the traditional techniques in general terms, never Svarahi's own workshop, which is unverified. Each has a "look for" tip for use at the counter. | On desktop, a GSAP pin with scrubbed crossfades, a slow push-in and progress ticks. Mobile and reduced motion get a stacked list. |
| | **Svarahi's own detail posts**: three Instagram embeds (kada, temple pendant, ring). | — |
| | **Care guidance**, quoted from Svarahi's FAQ on svarahi.co, with a WhatsApp care question. | — |
| `/reels` | **Instagram stage**: the 8 embeddable on-site posts, reels first. Only the centre item loads an iframe; the neighbours are angled text cards. It has Prev/Next buttons, ←/→ keys and swipe, and an `aria-live` counter. Nothing autoplays. | GSAP moves the cards in 3D perspective. Reduced motion places them instantly. |
| `/bridal` | **Split hero** (F, AI concept, captioned) with the "Reserve a bridal trial" WhatsApp CTA. | Reveal |
| | **Curved arch carousel**: 9 bridal and heritage looks (7 licensed C, 2 F) on a CSS-3D cylinder. You can drag it, use the buttons or use the arrow keys. The active look is lit and the rest are dimmed and softened. Each look has a caption, its provenance, and "Ask about a bridal set in this style", a WhatsApp message that names the look. | GSAP turns the ring. Reduced motion is instant, with no blur. |
| | Four steps for the bridal trial, 8 catalogue pieces with trial-tray toggles, 2 Svarahi reels, and a showroom CTA. | — |

## Shared-shell changes (reported)

- **Header:**
  - Added **Bridal**.
  - **Craft** now goes to `/craft` instead of `/#craft`.
  - Nav gap is `gap-6` at lg and `gap-9` at xl, plus `nowrap`, so the 6 links fit at 1024px. QA checks this.
- **Footer:**
  - Added a link row (Collections, Bridal, The counter, Craft, Reels).
  - The imagery disclosure now says that Instagram posts and reels are Svarahi's own. The previous wording ("none shows Svarahi's actual jewellery") was inaccurate once embeds appeared on site.
- **The homepage itself was not modified.**

## Verified defect fixed (affects Phase 7)

Reel **DfwJDxcD1Vg** shows Instagram's "link may be broken or the post may have been removed" card for both the `/p/` and `/reel/` embed URLs. The other reels and posts render normally; this was checked on each code individually on 19 Nov 2026.

- `instagram.json` now marks it `embeddable: false`.
- `igPost()` excludes non-embeddable posts. This also removes the broken embed from the Phase 7 `/collections/bridal` page.
- **Owner action:** check whether that reel's embedding is disabled (or its audio blocks embeds) and re-enable it if desired.

## Authenticity rules held

- Every image is a public-cleared library asset. QA checks each `<img>` against the manifest's `publicUse` flag.
- Group C images carry the caption "Licensed editorial imagery — not Svarahi inventory". Group F images carry "AI-generated … not Svarahi jewellery".
- No Group C, D or F image appears as a product card or on a SKU page. Bridal looks are labelled as style references.
- Instagram:
  - Only posts with no people and that can be embedded appear.
  - The customer, staff and purity-machine posts remain excluded.
- No prices, weights, purity, hallmark or "0% making" claims. No checkout. Purchases stay showroom-based.
- Craft descriptions are general explanations of each technique. There is no claim about in-house manufacture, karigars or certification.
- The only quotation is Svarahi's own published care guidance.

## QA

| Suite | Result |
|---|---|
| Phase 9 (`v2qa9.mjs`): 36 checks | **36/36** |
| Phase 6 homepage regression | 16/16 |
| Phase 7 collections regression | 19/19 |
| Phase 8 counter regression | 16/16 |
| `tsc`, `eslint` | 0 errors |
| `npm run build` | 43 static pages |

**What the Phase 9 suite checks**
- Page basics on all three pages: 200, a single h1 and noindex.
- Asset rights, provenance captions, and that excluded Instagram posts are absent.
- No commerce or weight copy, and an external-link allow-list.
- No overflow or page errors at 1440 and 390.
- Loupe: mouse tracking with the 1920 source, and keyboard movement.
- Chapters: the section pins and scroll advances it.
- Reduced motion: no pins.
- Reels: exactly one iframe at a time; Next and ← both work and are announced.
- Bridal carousel: buttons and drag work, in normal and reduced motion. The WhatsApp message names the look.
- Bridal pieces can be placed on the trial tray.
- The header fits at 1024px.

**Test notes**
- The two regression flakes seen during the run, both timing-related, passed on rerun with no code change: a page-load timeout and keyboard zoom before hydration.
- The Phase 6 suite's link allow-list was extended with `/bridal`, `/craft` and `/reels`.

Screenshots are in `docs/screenshots/phase-9/`: desktop 1440×900 and mobile 390×844 scroll-walks, plus `contact-sheet-mobile.png`.

## Isolation check: one change to report

The snapshot of `Desktop/svarahi` against the baseline shows 346 files, **README.md changed**, and **HEAD moved from a5d1b2b to fcba436**.

- The change comes from two commits under the **sumannaidur** account at 11:14 IST on 19 Nov 2026:
  - "feat: complete svarahi website implementation with assets and components"
  - "Merge origin/main and update README"
- They were made outside this build session. Nothing in V2 writes to that folder, and no git command was run there.
- No other file differs.
- Saved as `docs/isolation/phase7-after-v2-phase9.json`. Please confirm that these commits were intended.

## Known limits / for owner review

- Real iPhone and Android testing and Lighthouse audits are still outstanding; they stay on the final checklist.
- Instagram embeds depend on Instagram, which shows its own UI and counts.
- On the reels page, the side cards are text placeholders, so no Instagram media is copied.
- The images for "granulation" and "antique finish" are licensed close-ups that show the general look, not a step-by-step of the technique. Real workshop macro photography from Svarahi would replace them once supplied and approved.
- Owner confirmations still pending: real piece photos, the bridal trial process wording, and approval to embed Instagram.
