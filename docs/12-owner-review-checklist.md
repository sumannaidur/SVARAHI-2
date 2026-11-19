# Owner review checklist

This lists everything that only Svarahi can do or decide before launch. Nothing on the site depends on these to work today: each item is either hidden, labelled, or shown as "to be confirmed" until it is resolved.

## A. Testing the owner needs to do (still outstanding)
- [ ] **Real iPhone (Safari) test.** Try:
  - The menu, collections and a piece page
  - The trial tray (add, drag on the counter, open the drawer, send on WhatsApp)
  - Reels playback, the bridal carousel swipe, and the loupe drag
  - The visit planner, then WhatsApp opening in the app
  - The Maps link and the call link
- [ ] **Real Android (Chrome) test.** Same list.
- [ ] **Firefox and Safari on desktop.** Automated testing used Chromium (Edge) only.
- [ ] **Lighthouse on the hosted site.** Lab audits so far ran on a local production build (`docs/performance/`).
- [ ] **Field performance.** Once hosted, read real-visitor LCP, INP and CLS from the on-device monitor. This needs item C6.

## B. Content only Svarahi can supply
- [ ] **Real photography** (most important). Group A, Svarahi's own product photos, has 0 files today.
  - Original files of the Instagram product posts
  - Studio photos of at least 20 pieces across the 7 categories, 3–5 angles each
  - Macro detail shots
  - Showroom photos (entrance, counters, seating)
  - See `docs/registers/missing-assets.md`.
- [ ] **Official vector logo and monogram** (SVG/AI). The current logo is a high-resolution raster.
- [ ] **Per-piece details** (purity, weight), if you want them shown. Claim `purity-weight`.
- [ ] **Customer testimonials** with written consent. Claim `reviews`.

## C. Decisions and approvals
1. [ ] **Phone and WhatsApp:** confirm +91 85500 00483. Instagram also lists +91 70191 03928 (claim `phone-alt`).
2. [ ] **Opening hours**, including holidays. They are hidden now; once claim `hours` is approved they appear automatically on `/visit` and the homepage. The JSON-LD needs a one-line addition.
3. [ ] **Google Maps link** (canonical) and the **landmark** wording.
4. [ ] **Men's Jewellery:** make it a live collection? It is "Proposed" now.
5. [ ] **Commercial claims** (`src/content/commercial-claims.json`). Approve with terms and dates, or keep hidden:
   - [ ] V.A. from 2.5 %
   - [ ] 0 % making charges
   - [ ] ₹123/g benefit
   - [ ] Gold+ up to 7.5 %
   - [ ] Stone-less value
   - [ ] 65 % stone buyback
   - [ ] BIS hallmark / HUID
   - [ ] GST invoice
   - [ ] In-store purity testing
   - [ ] Google rating 4.9★ (60)
   - [ ] Parking and amenities
   - Approving the pricing claims also unlocks the **savings visualiser** (brief priority 8), which is not built because it would publish unapproved figures.
6. [ ] **Analytics:** connect the on-device web-vitals monitor to an analytics service? This needs a vendor and a privacy notice.
7. [ ] **Instagram:**
   - [ ] Approve embedding Svarahi's posts on the site
   - [ ] Consent for the customer reel (DfwJFHMFBlr), staff skit (Dftw0yrkQou) and purity-machine reel (Dfmadx8k0jE)
   - [ ] Re-enable embedding for reel DfwJDxcD1Vg, which Instagram reports as unavailable
8. [ ] **Imagery policy at launch.** Are licensed editorial (Unsplash) and AI concept images acceptable, captioned as they are now? Unsplash images carry no model releases.
9. [ ] **Copy sign-off:**
   - [ ] Svarahi Gold bridge ("own rates, accounts and KYC")
   - [ ] Bridal-trial steps
   - [ ] "What to expect" at the showroom
   - [ ] Care guidance (quoted from svarahi.co)
10. [ ] **Phase 7 project:** confirm that the two commits made on 19 Nov 2026 at 11:14 (HEAD `fcba436`, README.md only) were intended. See `docs/12-isolation-comparison.md`.
11. [ ] **v2 Git repository:** confirm intended. The v2 folder was committed (11:03 and 11:06 IST) and pushed to `github.com/sumannaidur/SVARAHI-2` under the `sumannaidur` account, which captures the Phase 8 state. Phases 9–12 are uncommitted. Is that repository private? Should the current work be committed and pushed there? That needs your explicit approval.

## D. Launch approvals (nothing has been done yet)
- [ ] Approve committing Phases 9–12 to the existing v2 repository (`sumannaidur/SVARAHI-2`), or name another repository.
- [ ] Choose a domain and host; approve deployment.
- [ ] At launch, set `NEXT_PUBLIC_SITE_URL` and `INDEXABLE = true` (`src/lib/site.ts`). That one switch turns on both indexing and robots.txt.
- [ ] Submit the sitemap and re-run Lighthouse on the live URL.
