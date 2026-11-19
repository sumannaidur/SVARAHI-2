# Phase 1: Project isolation

## Environment as found (19 Nov 2026)
| Item | Finding |
|---|---|
| Session working directory | `C:\Users\suman\Desktop\svarahi`, the Phase 7 project |
| Phase 7 git root | `C:/Users/suman/Desktop/svarahi`. HEAD `a5d1b2b` ("Initial commit from Create Next App"). All Phase 7 work is uncommitted. |
| Parent repositories | None. `Desktop` and `C:\Users\suman` are not git repositories. |
| Running dev servers | Port **3000**: Phase 7 `next dev`. Port **4173**: Phase 7 static preview. Both left running and untouched. |
| Target | `C:\Users\suman\Desktop\svarahi-flagship-v2` didn't exist, so it was created as a **sibling**, outside the Phase 7 git root |

## V2 independence
| Concern | V2 |
|---|---|
| `package.json` / lockfile / `node_modules` | Its own, created by `create-next-app` inside the v2 folder |
| Next.js config, `tsconfig`, ESLint | Its own |
| Dev port | **3200** (`npm run dev`) |
| Source code | Written fresh. No imports from Phase 7. |
| Assets | **Copied** into `assets-originals/svarahi-co/`. Phase 7 originals are read, never modified. |
| Git | **No repository created** (`--disable-git`), pending your approval. |

## Proof that Phase 7 was not modified
`scripts/snapshot-phase7.mjs` hashes every Phase 7 file (SHA-256), excluding `node_modules`, `.next`, `out` and `.git`, and records the git HEAD and `git status --porcelain`.

| Snapshot | Files | Tree hash | HEAD | Git status |
|---|---|---|---|---|
| Baseline, before any v2 work: `docs/isolation/phase7-baseline.json` | 346 | `09919b89…a8a97` | a5d1b2b | recorded |
| After Phases 1–5: `docs/isolation/phase7-after-phase5.json` | 346 | `09919b89…a8a97` | a5d1b2b | identical |

**Result: 0 added, 0 removed, 0 changed. The Phase 7 project is unchanged.**

To re-check at any time:
```powershell
node scripts/snapshot-phase7.mjs C:\Users\suman\Desktop\svarahi docs\isolation\phase7-now.json
node scripts/compare-snapshots.mjs docs\isolation\phase7-baseline.json docs\isolation\phase7-now.json
```
