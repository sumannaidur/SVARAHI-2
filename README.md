# Svarahi Flagship v2

**Jewellery is the hero. The showroom is the destination.**

This is an independent second website for Svarahi. It is fully separate from the Phase 7 project at `Desktop\svarahi`: its own dependencies, config, source, assets, tests and docs. It isn't deployed or published, and this build work has not committed or pushed anything. `noindex` and robots.txt both block search engines until launch is approved.

> **Git note (found in Phase 12).** This build work has not run Git, committed or pushed anything. However, the v2 folder **is** a Git repository: it was committed under the `sumannaidur` account on 19 Nov 2026 at 11:03 and 11:06 IST and **pushed to `github.com/sumannaidur/SVARAHI-2`** (`main` = `32d4655`), which captures the work as of Phase 8. Everything since (Phases 9–12) is uncommitted. Please confirm this was intended, and whether that GitHub repository is private. See `docs/12-owner-review-checklist.md` item C11.

**Start here:** open `docs/owner-presentation/index.html` in a browser. It is the owner presentation, works offline, and is navigated with the arrow keys.

## Run
```powershell
npm install
npm run dev      # http://localhost:3200
npm run assets   # rebuild the optimised asset library from /assets-originals
```

## Test
```powershell
npm run qa            # all suites, Phases 6–12 (needs npm run dev), then writes docs/testing/qa-latest.md
npm run qa:a11y       # axe WCAG 2.2 AA audit
npm run build; npm run start:audit   # production build on :3210, then:
npm run qa:lighthouse # Lighthouse, mobile and desktop
npm run qa:vitals     # throttled LCP / CLS / INP
npm run qa:isolation  # prove the Phase 7 project is unchanged
```
Tests drive the system Microsoft Edge browser. Set `BROWSER_PATH` to use another Chromium browser.

## Status
| Phase | State |
|---|---|
| 1. Project isolation | Done. See `docs/01-project-isolation.md` |
| 2. Business research and claims register | Done. See `docs/02-business-research.md` and `src/content/commercial-claims.json` (1 of 16 approved) |
| 3. Asset discovery and collection | Done: 47 svarahi.co files, 23 licensed Unsplash images, and 12 Instagram posts catalogued (embed only) |
| 4. Classification and registers | Done. See `docs/registers/` |
| 5. Design system and visual direction | **Approved** ("Velvet & Gold"). See `docs/05-design-system.md` and `/direction` |
| 6. Homepage | **Approved**. See `docs/06-homepage-report.md` |
| 7. Collections and discovery | **Approved**. See `docs/07-collections-report.md` |
| 8. Virtual counter and trial tray | **Approved**. See `docs/08-counter-report.md` |
| 9. Craftsmanship, Instagram and bridal (`/craft`, `/reels`, `/bridal`) | **Approved**. See `docs/09-craft-reels-bridal-report.md` |
| 10. Svarahi Gold bridge and showroom conversion (`/gold`, `/visit`) | **Approved**. See `docs/10-gold-visit-report.md` |
| 11. Mobile, accessibility and performance | **Approved**. See `docs/11-mobile-a11y-performance-report.md` |
| 12. Testing and owner presentation | Built, **awaiting review**. See `docs/12-testing-report.md` and `docs/owner-presentation/` |

## Deliverables (brief, section 10)
| # | Deliverable | Where |
|---|---|---|
| 1 | Independent second website project | This folder (own `package.json`, lockfile, config, source) |
| 2 | Separate asset library | `assets-originals/` (sources) and `public/assets/` (AVIF/WebP, 640/960/1280/1920) |
| 3 | Complete asset source inventory | `docs/registers/image-source-register.csv`, `src/content/asset-manifest.json`, `docs/ai-assets/` |
| 4 | Commercial claims verification register | `src/content/commercial-claims.json` |
| 5 | Image rights register | `docs/registers/image-rights-register.csv` and `missing-assets.md` |
| 6 | Design system | `docs/05-design-system.md`, `src/app/globals.css`, `/direction` |
| 7 | Interactive and animated website | `src/`: GSAP/ScrollTrigger scenes, counter, loupe, carousels, planner |
| 8 | Desktop and mobile experiences | `docs/screenshots/phase-*/`, `docs/owner-presentation/screens/` |
| 9 | Functional testing report | `docs/12-testing-report.md`, `docs/testing/` |
| 10 | Performance report | `docs/11-mobile-a11y-performance-report.md`, `docs/performance/` |
| 11 | Owner presentation screenshots | `docs/owner-presentation/` (28 curated screens and the presentation) |
| 12 | Phase 7 unmodified: comparison | `docs/12-isolation-comparison.md`, `docs/isolation/` |

**Open items for the owner:** `docs/12-owner-review-checklist.md`. This covers real-device testing, photography, hours, claims, Instagram consent and launch approvals.

## Where things are
| Path | Contents |
|---|---|
| `assets-originals/` | Untouched source files (never served) |
| `public/assets/` | Optimised AVIF/WebP library (brand, jewellery, models, showroom, craftsmanship, campaigns, generated) |
| `src/content/asset-manifest.json` | Every asset with group A–F, licence, source, alt text and `publicUse` |
| `src/content/commercial-claims.json` | Commercial claims register. Only `approved` entries may render. |
| `src/content/instagram.json` | Instagram catalogue (people and embeddability flags) |
| `src/lib/site.ts` | `SITE_URL` and the single `INDEXABLE` launch switch |
| `tests/` | QA suites (`tests/qa/`), audit tools (`tests/tools/`) and the runner |
| `docs/` | Phase reports 01–12, registers, isolation snapshots, testing, performance, screenshots, owner presentation |
