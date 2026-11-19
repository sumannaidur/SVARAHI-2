# V2 Phase 8: Virtual showroom counter and product interactions

**Built:** 19 Nov 2026, in `Desktop\svarahi-flagship-v2` only.

## What it is
The **trial tray** turns browsing into a showroom visit. Visitors place the pieces they'd like to see on a velvet tray, from the virtual counter, the catalogue or any piece page. One tap then sends the whole tray to Svarahi on WhatsApp (or by email) to reserve a showroom trial.

There is no checkout, payment, reservation system or account. The tray is saved only on the visitor's device.

## New and changed
| Item | Detail |
|---|---|
| `/counter` (new) | **The virtual counter.** The empty velvet-counter concept (Group F, captioned "Conceptual counter visualisation — not our store") is the environment. Catalogue pieces stand on it, one collection at a time: tabs for all 8, with Bangles first since all 4 have images. Interactions: **3D tilt + gold glare** following the pointer; **drag a piece onto the velvet tray** (mouse/trackpad); **"+ Trial tray"** buttons (touch, keyboard, assistive tech); GSAP rise-onto-the-counter entrance and spotlight sweep on each tab change; 8 tray slots with live thumbnails; Reserve trial and Review. |
| Trial tray drawer (every page) | A dialog listing tray pieces (thumbnail, name, code, link, remove). **Reserve a trial on WhatsApp**: one message listing every piece with its code. Also Email the tray and Clear tray. Esc and backdrop close it; focus moves to Close on open and returns to the tray button on close. |
| Header (all pages) | Tray button with a count badge. **"The counter" nav now opens `/counter`** (previously the homepage `#counter` section). |
| Piece pages | "Place on my trial tray" toggle (`aria-pressed`) next to Enquire on WhatsApp |
| Piece cards (catalogue, rails, related) | "+ Trial tray" / "On your tray ✓" toggle beside Enquire |
| `src/lib/tray.ts` | Tray store: `useSyncExternalStore` over localStorage, syncs across tabs, 8-piece limit, works for the session if storage is blocked |

## Honesty rules kept
- **No AI jewellery on the counter.** Pieces show only rights-cleared representative images ("Style reference · not the actual piece") or "Photograph to follow". The QA suite confirms no Group F image appears in the counter display.
- **No 3D-scan pretence.** There are no 3D models, so Three.js isn't used. The tilt is an obvious card interaction, not a rotating object.
- The page states plainly that nothing is reserved or priced online, and that availability and prices are confirmed in person.

## Engineering
- **GSAP:** tab-change entrance and spotlight (`useGSAP` with `revertOnUpdate`, inside `matchMedia`, so nothing runs under reduced motion).
- **Framer Motion:** `drag` with `dragSnapToOrigin`, plus a drop test against the tray's bounds, and `layout` on the tray thumbnails. Drag is enabled only for **fine pointers**. On touch the cards keep `touch-action: auto`, so scrolling stays natural and the button places the piece.
- **CSS:** the 3D tilt and glare, written straight to the element style (no React re-renders). Inert under reduced motion.

## Defects found and fixed during QA
1. **Drag never started:** the browser's native HTML5 image drag hijacked the gesture. Fixed by disabling native image drag in counter cards.
2. **Tray below the fold:** at 1440×900 the pieces and the tray weren't visible together, making drag-to-tray impractical. The stage is now sized so both share one viewport (verified).
3. **Dragged piece rendered under the tray:** fixed the stacking order.
4. The "Style reference · not the actual piece" label clipped on narrow cards; it now wraps.
5. Counter captions were hard to read over background props; they now sit on a velvet backing.

## QA
**Phase 8 suite: 16/16 pass.**

| Check | Result |
|---|---|
| Viewport fit | Counter and tray fit in one 1440×900 viewport |
| Drag | **Mouse drag** onto the tray places the piece; the tray highlights "Release to place it"; screen readers hear "Ruby-set Kadas placed on your tray." |
| Keyboard placement | Works (`aria-pressed`) |
| Tabs | Switch the counter (Temple & Antique → SV-E01, SV-S01) |
| Imagery | No Group F image among counter pieces |
| Persistence | The tray survives a reload and navigation to other pages |
| Drawer | Dialog semantics, focus management, Esc closes and returns focus |
| WhatsApp | One message lists every piece with its code |
| Limit | 8-piece limit with a "full" announcement |
| Privacy | **No network request is made by tray interactions** |
| Piece pages | Toggle removes and re-adds; Clear tray empties it |
| Mobile | Drag off, tap works, no overflow |
| Reduced motion | No tilt; all pieces visible immediately |
| Storage blocked (private mode) | No errors; the tray works for the session |

**Regression:** homepage 16/16, Phase 7 19/19. The suites were updated for the `/counter` route and to ignore the closed drawer's hidden heading.

**Build:**
- `tsc`: pass.
- `eslint`: 0 errors (1 pre-existing warning in Antigravity's script).
- `next build`: pass, **40 static pages** (adds `/counter`).

## Screenshots (`docs/screenshots/phase-8/`)
- Desktop: counter intro, bangles on the counter, tilt and glare, mid-drag over the tray, filled tray with necklaces, tray drawer, piece page with the tray toggle.
- Mobile: counter, tray, drawer.

## Outstanding (owner-review checklist)
- [ ] Real iPhone and Android testing (the counter on touch especially), and Lighthouse.
- [ ] Owner to confirm they're happy receiving trial-tray requests on WhatsApp +91 85500 00483 (the number is still to be confirmed for jewellery).
- [ ] Real piece photography. 18 of 23 counter pieces still show "Photograph to follow"; the counter becomes far more compelling with Group A images. Transparent cut-outs would allow pieces to sit directly on the velvet.
- [ ] Optional: 3D scans or turntable frames for hero pieces. That's the point at which Three.js would add real value.

## Isolation
`Desktop\svarahi` was re-fingerprinted: **346 files, tree hash `09919b89…`, HEAD `a5d1b2b`, 0 changes.**
