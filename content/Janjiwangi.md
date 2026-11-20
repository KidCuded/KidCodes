---
slug: "janjiwangi"
title: "Janjiwangi: Shopify Store for a Fragrance Retailer"
date: "2026-10-01"
description: "A playful orange-and-white Shopify store for a Malaysian fragrance retailer, with a heavily customised theme, custom product sections and metafield-driven fragrance details."
liveUrl: "https://janjiwangi.myshopify.com/"
image: "/images/projects/Janjiwangi.webp"
tags: ["Shopify", "Liquid", "GraphQL", "JavaScript"]
---

**Janjiwangi** is a Shopify store I designed and built for a Malaysian fragrance retailer, from the design direction to the theme, content and setup.

- **Role:** Store designer and builder (design direction, theme customisation, content, setup)
- **Platform:** Shopify (Basic plan) · Horizon theme, heavily customised
- **Timeline:** October – November 2026
- **Status:** Built and styled. Final launch steps (domain, HitPay) pending.

---

## Overview

Janjiwangi is a Malaysian online fragrance store that stocks two perfume brands:

- **OPAI**: the *Nostalgic* (40ml) and *Niche* (50ml) collections
- **NBDY**: *Volume I* and *Volume II* (50ml Extrait de Parfum)

The brief was a **playful, bright store in orange and white** that still feels premium enough for fragrance. It also had to make shopping by collection, scent and brand easy.

**At a glance:** 28 products · 4 collections · 2 brands · prices in MYR (RM119 – RM199)

---

## Design

### Visual identity
- **Palette:** orange and white, with warm cream and peach accents (`#FF7A1A`, `#F05A00`, `#FFF6EC`, `#FFE3CC`). Text is a deep warm brown (`#2E1A0F`) instead of black.
- **Typography:** Poppins (headings and subheadings) with Nunito Sans (body).
- **Mood:** sunset gradients, soft glows and rounded shapes. It's fun without feeling cheap.

### Header and navigation
- Sticky header with a **sideways sunset gradient**: golden on the left, bright orange in the middle, soft coral on the right. The dark tones in the reference were lightened to keep the mood bright.
- Logo centred, white semibold menu links, and a white cart bubble.
- **Custom dropdowns:** small rounded menus in the same gradient, replacing the theme's full-width white panel. The menu is grouped by brand (OPAI → Nostalgic / Niche, NBDY → Volume I / Volume II).
- Announcement bar: "Free shipping on orders above RM200".

### Homepage
- **Hero banner:** a photo strip of four lifestyle shots (one from each collection) blended with orange gradient seams, a sunset tint and a soft text shadow. An illustrated version (bottles, citrus, blossoms, scent swirls) was also made as an alternative.
- **Collection rows** titled "OPAI | Nostalgic", "OPAI | Niche", "NBDY | Volume I" and "NBDY | Volume II", 4 cards per row.
- **Backgrounds:** radial orange glows that alternate left and right in each section, with seamless colour fades so there are no hard edges between sections.

### Product cards
- **Content:** brand/collection tag, product name, top scent notes, price.
- **Photo frame:** a soft orange-to-cream gradient, with the photo filling the rounded frame edge to edge.
- **Hover:**
  - The card lifts and tilts slightly with a warm shadow.
  - A shine sweeps across it.
  - The bottle does a gentle wiggle.
  - The second (lifestyle) photo fades in, loaded by a small custom script.
- **Sale pricing:** the original price sits on the left, crossed out at 70% opacity, and the default "Sale" badge is removed.
- Reduced-motion users get a calmer version.

### Collection pages
- Each collection has its **own heading template**: a big uppercase title ("NBDY | Volume II") with a tagline ("Symphony of Notes"), a full-width background image, a warm overlay and a text shadow.
- **Banner images:** custom wide 3:1 banners made from the products' own photos, so bottles are never cropped.

### Product page
- **Info column:** a "Brand · Collection" tag, large title, scent notes, sale price and rounded buttons.
- **Photo:** a single large, sharp product photo. NBDY images were replaced with higher-resolution versions (up to 2687px).
- **"You may also like":** 5 smaller cards with equal heights and clean spacing.
- **Custom "Fragrance facts" section**, built from scratch:
  - **Fragrance facts:** family, character, longevity, projection, concentration, size, brand.
  - **The smell:** top, heart and base notes.
  - **How to wear:** an application tip.
  - **Photo:** a large lifestyle image beside the panel.
  - All of it is driven by product metafields, so the store owner can edit it per product without code.

### Checkout
- Branding plan: logo, a custom sunset-gradient header image and orange buttons, applied in Shopify's checkout editor.

---

## Content and data

- **Products:** 28 perfumes with photos, a second hover photo, prices, compare-at (sale) prices and descriptions.
- **Metafields (custom fields):**
  - **Card fields:** collection label and scent notes for the cards.
  - **Fragrance facts fields:** family, character, longevity, projection, top/heart/base notes and a how-to-wear tip.
  - **Source:** the details were gathered from each brand's official pages.
- **Pages:** FAQ, Contact, Shipping Policy, Refund Policy and Terms of Service, adapted from the supplier's policies to Janjiwangi's business details.
- **Footer:** Shop, Help and Policies menus, a newsletter sign-up, and social links (Instagram, TikTok, Threads).
- **Shipping:** RM5 flat rate under RM200, free from RM200 (Malaysia).

---

## Technical highlights

- **Theme work:** custom CSS and JavaScript in a dedicated snippet, a new Liquid section (Fragrance facts), per-collection JSON templates, and template-scoped styling.
- **Shopify Admin GraphQL API:**
  - Bulk product and price updates.
  - Metafield definitions and values.
  - Theme file uploads.
  - Menus, pages and collection templates.
- **Image work:** banner composites made in the browser with HTML canvas from existing product photography, then uploaded through Shopify's staged uploads.
- **Workflow:**
  - **Two themes:** design changes are made on an unpublished theme, checked in Preview, then published, so the live store is never broken.
  - **Project log:** a Google Doc tracks to-dos, decisions and notes throughout.

---

## Domain

- **Current address:** the store runs on its Shopify address (`janjiwangi.myshopify.com`).
- **Plan:** buy and connect a custom domain (e.g. `janjiwangi.my` or `janjiwangi.com`).
- **After connecting:** point the customer accounts and order-tracking address to it (e.g. `account.janjiwangi.my`).

## Payments: HitPay

- **Choice:** HitPay was chosen as the payment provider for Malaysian customers.
- **Methods:** FPX online banking, DuitNow QR, e-wallets such as Touch 'n Go and GrabPay, and cards.
- **Setup steps:** the owner signs up with business (SSM) details, connects HitPay in Shopify under Settings → Payments, and places a test order from start to finish before launch.

---

## What I learned

- **Shopify theme architecture:** Online Store 2.0 JSON templates, sections, blocks and metafields.
- **Brand look on a stock theme:** getting a playful, cohesive look out of an existing theme without breaking its editor.
- **Data before design:** structuring product information (scent notes, fragrance facts) so the design can show it consistently.
- **Launch planning:** working through payments, policies, shipping, domains and handover so the owner can run the store on their own.
