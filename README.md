# Svarahi Flagship v2

**Jewellery is the hero. The showroom is the destination.**

This is an independent second website for Svarahi. It is fully separate from the Phase 7 project at `Desktop\svarahi`: its own dependencies, config, source, assets and docs. It isn't deployed or published, and `noindex` stays on.

## Run
```powershell
npm install
npm run dev      # http://localhost:3200
npm run assets   # rebuild the optimized asset library from /assets-originals
```

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
| 8. Virtual counter and trial tray | Built, **awaiting review**. See `docs/08-counter-report.md` and `docs/screenshots/phase-8/` |
| 9–12 | Not started |

## Where things are
| Path | Contents |
|---|---|
| `assets-originals/` | Untouched source files (never served) |
| `public/assets/` | Optimized AVIF/WebP library (brand, jewellery, models, showroom, craftsmanship, campaigns, generated) |
| `src/content/asset-manifest.json` | Every asset with group A–E, licence, source and alt text |
| `src/content/commercial-claims.json` | Commercial claims register. Only `approved` entries may render. |
| `src/content/instagram.json` | Instagram catalogue |
| `docs/registers/` | `image-source-register.csv`, `image-rights-register.csv`, `missing-assets.md`, `image-contact-sheet.jpg` |
| `docs/screenshots/` | Milestone screenshots |
