# Svarahi Flagship V2 — Missing Real Business Assets Register

This register details the physical, verified business assets that must be supplied by the Svarahi client/stakeholder before full commercial launch of the website. Group F AI editorial assets temporarily establish creative direction, but cannot replace verified inventory and store reality.

---

## 1. Verified Product & Inventory Assets (Group A)

| Priority | Asset Type | Description | Required Specifications | Intended Use |
|---|---|---|---|---|
| **High** | **Product Flat-Lays** | Isolated photographs of real Svarahi jewellery on velvet or white cyclorama | Min 2000&times;2000px, PNG with transparent background or high-contrast studio JPG | Interactive Showroom Counter, Product Grid Cards |
| **High** | **SKU Catalog Details** | Genuine SKU numbers, gold purity (18K/22K), gross weight (g), net gold weight (g), gemstone carat weights | Structured CSV / JSON or Product Master Sheet | Product Detail Modals, Cart & Price Estimator |
| **Medium** | **360&deg; Spin / Video Rotations** | High-framerate turntable rotations of flagship necklace sets and bridal chokers | 60fps MP4/WebM or 36-frame sequence | Luxury Interactive Viewer |
| **Medium** | **Hallmarking & Certifications** | Sample BIS Hallmark documentation and IGI/GIA certificate templates | Official scanned PDF/PNG samples | Authenticity & Trust Assurance Section |

---

## 2. Showroom & Physical Store Assets (Group B)

| Priority | Asset Type | Description | Required Specifications | Intended Use |
|---|---|---|---|---|
| **High** | **Jayanagar Showroom Facade** | High-resolution exterior day & evening exterior photograph of Svarahi's store in Jayanagar, Bengaluru | 16:9 Landscape, min 3840&times;2160px | Location Page, Google Maps Preview, Footer |
| **High** | **Showroom Interior & Consultation Suite** | Genuine interior photographs showing display counters, lighting, and VIP private consultation lounge | Min 2560&times;1440px wide-angle architectural | Store Experience Page, Visit Appointment Page |
| **Medium** | **Staff & Karigar Photography** | Real photographs of Svarahi master artisans, gemologists, and showroom sales consultants | Portrait & candid workshop shots | Brand Heritage & About Us Page |

---

## 3. Brand Identity & Customer Trust (Group C & D)

| Priority | Asset Type | Description | Required Specifications | Intended Use |
|---|---|---|---|---|
| **High** | **Official Brand Vector Files** | Master vector logo (`.svg`, `.eps`, `.ai`) for Svarahi wordmark, emblem, and monogram | Vector SVG format with transparent background | Global Navbar, Footers, Favicons |
| **High** | **Real Customer Testimonials** | Authentic customer reviews, bride photos with permission, and wedding credits | Verified quotes + high-res wedding photos | Social Proof / Testimonials Pavilion |
| **Medium** | **Instagram Content Sync** | Direct access to Svarahi’s authentic Instagram media library or API integration | Official handles / CDN feed | Live Instagram / Editorial Lookbook Module |

---

## 4. Retouching & Compositing Workflow

Once physical jewellery photos are provided:
1. Product cutouts will be layered directly onto `velvet-counter-stage-01.webp` using CSS absolute placement or Canvas compositing.
2. The strict editing rules specified in Prompt 14 of `docs/ai-assets/generation-prompts.md` must be enforced to ensure 100% preservation of actual gold weight and gemstone accuracy.
