# Phase 12 — Functional testing report

Delivery requirement 9: functional testing report. For requirement 10 (performance report), see `docs/11-mobile-a11y-performance-report.md` and `docs/performance/`.

Status: complete. This work has not committed, pushed or deployed anything; noindex is on. See the Git note in the README: the folder was committed and pushed at its Phase 8 state by the owner's account.

## The test suite now lives in the project
Before Phase 12 the QA scripts ran from a temporary working folder. They are now part of the project, so anyone can re-run them:

| Command | What it runs |
|---|---|
| `npm run qa` | All seven suites (Phases 6–12) against `http://localhost:3200` (`npm run dev`). Writes `docs/testing/qa-latest.md`. Set `QA_BASE` to test another server, e.g. a production build started with `npm run start:audit`. |
| `npm run qa:a11y` | axe-core WCAG 2.2 AA audit of 22 routes × desktop and mobile. Writes `docs/performance/axe-latest.json`. |
| `npm run qa:lighthouse` | Lighthouse (mobile and desktop) against a production build on :3210 |
| `npm run qa:vitals` | Throttled LCP, CLS and INP measurement against :3210 |
| `npm run qa:isolation` | Fingerprints the Phase 7 project and compares it with the baseline |
| `node tests/tools/owner-shots.mjs` | Re-captures the owner presentation screenshots |

**Tooling:**
- Dev dependencies: `playwright-core`, `axe-core`, `lighthouse`.
- The tests drive the **system Microsoft Edge**; nothing extra is downloaded. Set `BROWSER_PATH` to use another Chromium browser.

## Results

| Suite | Dev server | Production build |
|---|---|---|
| Phase 6: homepage (`tests/qa/phase06-home.mjs`) | 16/16 | 16/16 |
| Phase 7: collections and discovery, 32 pages | 19/19 | 19/19 |
| Phase 8: virtual counter and trial tray | 16/16 | 16/16 |
| Phase 9: craft, reels, bridal | 36/36 | 36/36 |
| Phase 10: Svarahi Gold bridge and visit | 31/31 | 31/31 |
| Phase 11: accessibility, mobile, SEO, performance | 18/18 | 18/18 |
| Phase 12: whole-site crawl | 8/8 | 8/8 |
| **Total** | **144/144** | **144/144** |
| `tsc --noEmit` | 0 errors | — |
| `eslint .` | 0 errors. 1 warning in the unmodified AI-asset script `scripts/process-ai-assets.js`. | — |
| `next build` | 48 routes | — |

Run logs: `docs/testing/qa-dev-server.md` and `docs/testing/qa-production-build.md`.

## What is covered

### Functional journeys
- **Discover:**
  - The homepage's pinned scenes.
  - The collections landing page and the URL-synced filters.
  - All 8 collections and all 23 piece pages, desktop and 390 px.
  - Related-piece rails, prev/next, and keyboard zoom.
- **Shortlist:**
  - The trial tray: add and remove, the 8-piece limit, drag onto the tray, keyboard add, and persistence across pages.
  - Blocked-storage fallback.
  - The drawer's focus handling, WhatsApp, email and clear.
  - Reduced motion and mobile touch.
- **Explore:**
  - The loupe: mouse, keyboard, and the 1920 px source.
  - The pinned craft chapters.
  - The reel stage: one embed at a time, buttons, keys and announcements.
  - The bridal carousel: buttons, drag and reduced motion.
- **Convert:**
  - The visit planner: tray included, live preview, past date blocked, exact message to `wa.me/918550000483`, nothing stored.
  - The tray drawer to planner hand-off.
  - The showroom CTA band and the mobile action bar.
- **Bridge:** `/gold` opens svarahigold.xyz in a new tab and has no account, rate or trading UI.

### Whole-site crawl (new in Phase 12)
- **Pages:** starting from the sitemap and following every internal link reaches **39 pages**. All return 200 with exactly one h1, no page errors and unique titles.
- **Images:** all **174 image files** (every `src` and `srcset` candidate) resolve.
- **Outbound links:** all **107 distinct outbound links** go to verified destinations only: WhatsApp to the verified number, the Maps link, svarahigold.xyz, Svarahi's Instagram, and the verified phone and email.
- **WhatsApp messages:** all **71 WhatsApp messages** are prefilled "Hi Svarahi…" enquiries, with no price, weight or offer.
- **Instagram:** no link or embed to an excluded post.
- **Not-found page:** unknown pages, piece codes and collections show the **branded not-found page** with noindex.
- **Without JavaScript:** headings, images and the WhatsApp enquiry still render on the homepage and on category, piece, visit and gold pages.

### Content integrity (asserted on every relevant page)
- Only public-cleared images appear, and each carries its provenance caption (Groups C, D and F).
- No prices, weights, purity, hours, ratings or unapproved claims.
- Instagram shows only posts without people that can be embedded.
- Every page is noindex, and robots.txt disallows all crawling.

### Accessibility and devices
- axe WCAG 2.2 A/AA reports **0 violations**. Lighthouse accessibility is **100** on every audited route.
- Touch targets are at least 24 px on mobile, most at 44 px.
- Keyboard: the skip link, visible focus, and the tabs pattern.
- No content is hidden from screen readers by animation.
- No horizontal overflow: the homepage at 360, 390, 768, 1024, 1440 and 1920 px; every other route at 360, 390 and 1440 px.
- Reduced motion: no pins, all content visible.

## Defects found and fixed in Phase 12
| Defect | Fix |
|---|---|
| Unknown URLs showed Next.js's plain default 404, with no branding or way back into the site | `src/app/not-found.tsx`: a branded page with Browse collections, Ask on WhatsApp and Home links, and noindex. It also covers unknown piece codes and collections. Asserted by the crawl. |
| Two owner-screenshot states were captured wrong (the tray toggled off between shots; the carousel framed too high) | Screenshot script fixed and re-captured. Test tooling only; no change to the site. |

## Not covered by automation (owner action)
- **Real iPhone (Safari) and Android (Chrome)**, plus **desktop Firefox and Safari**. All automated runs used Chromium (Edge). The checklist is in `docs/12-owner-review-checklist.md`, section A.
- Instagram's own embed UI and playback, which Instagram controls.
- WhatsApp, email and Maps opening in the native apps. The tests verify the exact URLs handed to them.
