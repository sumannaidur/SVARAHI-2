# Isolation comparison: the Phase 7 website was not modified

Delivery requirement 12: *"A clear comparison confirming the Phase 7 project was not modified."*

## Method
`scripts/snapshot-phase7.mjs` reads every file under `C:\Users\suman\Desktop\svarahi` and records a SHA-256 hash for each one. It excludes `node_modules`, `.next`, `out` and `.git`. It also records the tree hash, the git HEAD and `git status --porcelain`.

`scripts/compare-snapshots.mjs` reports every added, removed or changed file between two snapshots. Both scripts only read; neither writes to the Phase 7 folder.

## Timeline (all 19 Nov 2026, UTC)
| Snapshot (`docs/isolation/`) | Taken | Files | Tree hash | HEAD | vs previous |
|---|---|---|---|---|---|
| `phase7-baseline.json`, before any v2 work | 02:32 | 346 | `09919b89…` | a5d1b2b | — |
| `phase7-after-phase5.json` | 03:01 | 346 | `09919b89…` | a5d1b2b | unchanged |
| `phase7-after-ai-assets.json` | 03:47 | 346 | `09919b89…` | a5d1b2b | unchanged |
| `phase7-after-v2-phase7.json` | 04:53 | 346 | `09919b89…` | a5d1b2b | unchanged |
| `phase7-after-v2-phase8.json` | 05:15 | 346 | `09919b89…` | a5d1b2b | unchanged |
| *two commits made in the Phase 7 repository at 05:44 UTC (11:14 IST), outside the v2 work (see below)* | | | | | |
| `phase7-after-v2-phase9.json` | 08:48 | 346 | `d9f422ca…` | fcba436 | **README.md changed; HEAD moved** |
| `phase7-after-v2-phase10.json` | 09:06 | 346 | `d9f422ca…` | fcba436 | unchanged |
| `phase7-after-v2-phase11.json` | 10:56 | 346 | `d9f422ca…` | fcba436 | unchanged |
| `phase7-after-v2-phase12.json` | 11:40 | 346 | `d9f422ca…` | fcba436 | unchanged |

## The one difference, explained
Between the Phase 8 and Phase 9 checks, the Phase 7 repository received two commits:

| Commit | Time (IST) | Author | Message |
|---|---|---|---|
| `ba15a43` | 19 Nov 2026 11:14:11 | sumannaidur | feat: complete svarahi website implementation with assets and components |
| `fcba436` | 19 Nov 2026 11:14:38 | sumannaidur | Merge origin/main and update README |

- **Effect on files:** only `README.md` changed (23 insertions, 25 deletions). The other 345 files are byte-identical to the baseline.
- **Not part of the v2 work:**
  - No v2 step writes to the Phase 7 folder.
  - No git command was ever run in the Phase 7 repository during v2 development; v2 work only reads it to fingerprint it.
  - The commits merge a GitHub `origin`, which this work never configured or pushed to.
- **Action for the owner:** please confirm these commits were intended. This is item C10 in `docs/12-owner-review-checklist.md`.

## Code independence
- **No imports:** v2 imports nothing from the Phase 7 project. `src/` contains no `../svarahi` path, and the site crawl (`tests/qa/phase12-site-crawl.mjs`) checks every page for references to `localhost:3000` and the Phase 7 folder.
- **Its own setup:** v2 has its own `package.json`, lockfile, `node_modules`, Next.js config, assets (`assets-originals/`, `public/assets/`), tests (`tests/`) and docs.
- **Separate repositories:** v2 has its own Git repository, created and pushed outside this work under the owner's account (`github.com/sumannaidur/SVARAHI-2`, 11:03 and 11:06 IST). It is unrelated to the Phase 7 repository. This work ran no Git commands in either folder.
- **Separate servers:** v2 runs only on its own ports: 3200 for development and 3210 for production audits. It never uses the Phase 7 ports (3000 dev, 4173 preview).

## Re-check at any time
```powershell
npm run qa:isolation
```

## Final result (end of Phase 12)
| Comparison | Added | Removed | Changed |
|---|---|---|---|
| Phase 11 → Phase 12 (final) | 0 | 0 | 0 |
| Original baseline → final | 0 | 0 | 1 (`README.md`, from the owner-account commits above) |

**The v2 work changed nothing in the Phase 7 project.** The only difference since the baseline is the README edit from the two Git commits made outside this work, which awaits your confirmation.
