# Phase 11 — Mobile, accessibility and performance

Status: built, awaiting review. Not committed, not deployed. `noindex` is kept, and robots.txt now blocks all crawling as well.

## How it was measured

| Tool | What it covers |
|---|---|
| **axe-core 4.10** (WCAG 2.0/2.1/2.2 A and AA, plus best practice) | 22 routes × desktop and mobile = 44 page-views (`audit11.mjs`). Each page is scrolled first so lazy content is included. |
| **Lighthouse 12.2** on the **production build** (`next start`) | 10 routes. Mobile uses Lighthouse's default emulation: Moto G class, simulated slow 4G, 4× CPU. Desktop is 1440×900. |
| **Field-style vitals** with Playwright and CDP | 4× CPU and 1.6 Mbps / 150 ms. LCP element, CLS, and INP for a real tap with its delay, processing and paint broken out (`lcp11.mjs`). |
| **On-site monitor** | The `WebVitals` component (`useReportWebVitals`) records LCP, INP, CLS, FCP and TTFB on the device (`window.__svarahiVitals`). **Nothing is sent anywhere.** Connecting an analytics endpoint needs owner approval: a privacy notice and a choice of vendor. |

## Findings and fixes

### Accessibility
| Finding (before) | Fix |
|---|---|
| **color-contrast**: 75 nodes on 44 page-views. Small grey text at 35–50 % ivory opacity on velvet (2.98–4.24:1). | All such text raised to 60 % (≈5.9:1) across 22 files. The homepage craft caption went from 55 % to 70 % ink (homepage defect fix). |
| **target-size**: about 60 targets per page under 24 px (card "Enquire ↗" and "+ Trial tray", filter chips, breadcrumbs, footer links, Instagram "Post ↗", prev/next piece links). | Raised to 44 px (`inline-flex min-h-11`), and breadcrumbs to 24 px. Meets WCAG 2.5.8; most targets now meet the 44 px guideline. |
| **link-in-text-block**: in-text links distinguished only by colour (`/reels`, `/visit`). | Links are now always underlined. |
| **label-content-name-mismatch**: piece-card links had an `aria-label` different from their visible text, and the zoom button contained the "Style reference" label. | The card `aria-label` is removed (the visible text is a better name). The disclosure label is moved outside the zoom button and is still read from the paragraph below. |
| **crawlable-anchors**: the disabled "Reserve trial" was an `<a>` with no `href`. | Now a real `<button disabled>` when the tray is empty. |
| **Reveal animations hid content from screen readers**: GSAP `autoAlpha` sets `visibility:hidden`, so headings and text below the fold were missing from the accessibility tree until scrolled into view. This showed up as Lighthouse "heading-order" on `/collections`. | Entering reveals now animate **opacity only**: the shared `Reveal`, homepage hero intro, journey, craft and counter text, `/craft` chapters, and the gold bars. Content swaps that hide links (the hero's pinned copy swap, reel side cards) keep `autoAlpha`. The hero's duplicate transition copy is now `aria-hidden`. |
| Counter tabs had no arrow-key support. | WAI-ARIA tabs pattern: roving tabindex, ←/→, Home/End, focus follows selection, and the tabs are 44 px tall. |

**Result:** axe now reports **0 violations on all 44 page-views**, and Lighthouse accessibility is **100 on all 10 audited routes**, mobile and desktop.

### Performance
| Finding (before) | Fix |
|---|---|
| `/visit` mobile LCP **7.1 s**: an extremely detailed showroom photo (860 KB AVIF at 1280 px), loaded eagerly. | **Byte budget in the asset pipeline**: any photographic rendition over 0.11 B/px (AVIF) or 0.16 B/px (WebP) is re-encoded at stepped-down quality. That image is now 376 KB at 1280 px and 135 KB at 640 px. The library went from **44.9 MB to 39.6 MB** before the new 960 px rung; with the 34 extra 960 px renditions it totals 45.5 MB on disk, but each page now downloads less. The manifest's groups, licences and `publicUse` flags are unchanged. The `/visit` image is no longer forced eager or high-priority, and its `sizes` matches the real 448 px frame. |
| Homepage: a below-the-fold journey image loaded at **high priority**, competing with the hero. | `priority` removed, and `sizes` corrected. |
| No 960 px rendition, so 2× phones downloaded 1280 px files. | A 960 px rung was added to the ladder. |
| `/assets` served with `max-age=0`. | `Cache-Control: public, max-age=2592000, stale-while-revalidate=86400`. Not `immutable`, because the filenames aren't content-hashed. |
| Counter tab tap INP ≈ 570–630 ms under 4× CPU, almost all render or paint after the tap. | The tab highlight updates immediately and the new pieces render in a React transition (`useTransition`), with `aria-busy` on the panel. Unthrottled tap: **72 ms**. |
| Internal links using plain `<a>` (collections and piece prev/next) caused full page reloads. | Switched to `next/link`. |

### SEO plumbing (kept non-indexable)
- `src/lib/site.ts`:
  - `INDEXABLE = false`: one switch behind both the robots meta tag and robots.txt.
  - `SITE_URL`, read from `NEXT_PUBLIC_SITE_URL` once a domain is approved.
- `robots.txt`: `Disallow: /` until launch.
- `sitemap.xml`: 39 customer routes (8 static, 8 collections, 23 pieces), excluding `/direction`.
- Default **Open Graph image**: typographic and brand colours only, with no photograph, so a shared link can never show rights-unclear or non-Svarahi jewellery.
- Every route has:
  - `og:*` and Twitter card tags
  - a self canonical link
  - a description of at least 50 characters
  - a production-style title: "… · Svarahi", where it used to be "Svarahi v2 (in development)"
- `/visit` carries the `JewelryStore` JSON-LD from Phase 10.

## QA: every phase re-run

| Suite | Result |
|---|---|
| Phase 6 homepage | 16/16 |
| Phase 7 collections (32 pages) | 19/19 |
| Phase 8 counter and tray | 16/16 |
| Phase 9 craft, reels, bridal | 36/36 |
| Phase 10 gold and visit | 31/31 |
| **Phase 11 (`v2qa11.mjs`)** | **18/18** |
| **Total** | **136/136** |
| `tsc`, `eslint` | 0 errors, 0 warnings |
| `npm run build` | 48 routes (adds robots.txt, sitemap.xml, opengraph-image) |

**What the Phase 11 suite covers**
- **Accessibility:**
  - axe reports 0 violations, desktop and mobile.
  - Every mobile target is at least 24×24 px.
  - Counter tabs follow the keyboard pattern.
  - The skip link is the first tab stop and becomes visible on focus.
  - A visible focus outline.
  - No content is removed from the accessibility tree before scrolling.
- **Layout:** no overflow at 360 px.
- **SEO plumbing:**
  - robots.txt disallows all crawling.
  - The sitemap lists 39 routes.
  - The Open Graph image renders.
  - Every route has noindex, a canonical link, OG tags and a clean title.
  - `/visit` carries the JSON-LD.
- **Performance guards:**
  - The `/assets` cache header.
  - The image byte budget.
  - The `/visit` hero is not eager.
  - The vitals monitor collects on the device.
  - A counter tab tap responds in under 200 ms.

**Test changes**
- `v2qa7` now waits for hydration before its keyboard zoom check, which removes a timing flake. Behaviour was verified on both dev and production.
- The homepage allow-list now includes `/visit` and `/gold`.

## Results: production build

### Lighthouse 12.2 (lab)
| Route | Mobile P / A / BP / SEO | Mobile LCP | Desktop P / A / BP / SEO | Desktop LCP | CLS |
|---|---|---|---|---|---|
| / | 82 / 100 / 100 / 69 | 4.5 s | 87 / 100 / 100 / 69 | 1.1 s | 0 |
| /collections | 74 / 100 / 100 / 69 | 4.8 s | 99 / 100 / 100 / 69 | 0.9 s | 0 |
| /collections/necklaces | 80 / 100 / 79 / 69 | 4.0 s | 95 / 100 / 78 / 69 | 0.8 s | 0 |
| /pieces/sv-b01 | 85 / 100 / 100 / 69 | 4.0 s | 100 / 100 / 100 / 69 | 0.8 s | 0 |
| /counter | 87 / 100 / 100 / 69 | 3.9 s | 100 / 100 / 100 / 69 | 0.8 s | 0 |
| /craft | 78 / 100 / 100 / 69 | 4.1 s | 99 / 100 / 78 / 69 | 0.8 s | 0 |
| /reels | 93 / 100 / 79 / 69 | 3.2 s | 100 / 100 / 78 / 69 | 0.7 s | 0 |
| /bridal | 84 / 100 / 100 / 69 | 3.7 s | 100 / 100 / 78 / 69 | 0.8 s | 0 |
| /visit | 87 / 100 / 100 / 69 | 3.4 s | 100 / 100 / 100 / 69 | 0.7 s | 0 |
| /gold | 88 / 100 / 100 / 69 | 3.2 s | 100 / 100 / 100 / 69 | 0.6 s | 0 |

**Before** (same tool, previous build): mobile accessibility was 93–97, best practices 71–93 and `/visit` LCP 6.9 s. Full reports are in `docs/performance/lighthouse/`, with the before summary in `docs/performance/lighthouse-before-summary.json`.

### Field-style vitals (4× CPU, 1.6 Mbps / 150 ms, 390×844 @2×)
| Route | LCP before → after | INP after (real tap) | CLS |
|---|---|---|---|
| / | 2.7 s → 2.7 s | — (no button in view) | 0 |
| /collections | 4.6 s → 3.6 s (960 px image) | 32 ms | 0 |
| /pieces/sv-b01 | 2.7 s → 2.1 s | 168 ms | 0 |
| /counter | 2.4 s → 1.5 s | 632 ms → **88 ms** | 0 |
| /bridal | 3.6 s → 1.9 s | 88 ms | 0 |
| /visit | **7.1 s → 3.6 s** | 48 ms | 0 |

Every INP result is under the 200 ms "good" threshold, and CLS is 0 everywhere.

Axe results (before and after) are in `docs/performance/axe-*.json`. Screenshots are in `docs/screenshots/phase-11/`.

## Shared-shell and homepage changes (reported)
Homepage, all for verified defects:
- Contrast of the craft caption.
- Hero intro, journey, craft and counter text now reveal with opacity instead of visibility, so screen readers can reach it.
- The hero's duplicate transition copy is `aria-hidden`.
- The journey image no longer loads at high priority, and its `sizes` is corrected.

There is no visual or layout change, and the Phase 6 suite still passes 16/16.

Shared shell:
- Breadcrumb and footer link targets are larger.
- Root metadata: titles, description, Open Graph, `metadataBase`, `colorScheme`.
- The `WebVitals` monitor was added.

## Isolation
`Desktop/svarahi` is **unchanged** (346 files, tree `d9f422ca…`, HEAD `fcba436`). Saved as `docs/isolation/phase7-after-v2-phase11.json`.

## Known limits / still outstanding
- **Lighthouse SEO is 69 by design.** The only failing audit is "is crawlable", because of the intentional noindex. It will reach 100 when `INDEXABLE` is switched on at launch.
- **Best practices are 78–79 on pages with Instagram embeds**, because of third-party cookies and back/forward-cache blockers from Instagram's own iframe. This can't be changed short of removing the embeds. Every other page scores 100.
- **Mobile lab LCP/TBT**: Lighthouse's simulated slow 4G with 4× CPU is pessimistic, and TBT on this machine varied by ±300 ms between identical runs. **Real-device testing on iPhone and Android is still required** (Phase 12 checklist), ideally with field data from the on-device monitor.
- The homepage's pinned GSAP scenes are the largest JavaScript cost. The structure is approved (Phase 6), so it was left as is; no pins are registered under reduced motion.
- An analytics endpoint for the vitals monitor needs owner approval.
