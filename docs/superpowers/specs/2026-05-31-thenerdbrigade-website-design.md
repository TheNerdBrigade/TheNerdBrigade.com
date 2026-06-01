# TheNerdBrigade.com — Website Design Spec

**Date:** 2026-05-31
**Status:** Approved (design); logo mark deferred
**Author:** The Nerd Brigade (TheNerd@thenerdbrigade.com)

## Overview

A full marketing/informational website for **thenerdbrigade.com**. Its primary jobs:

1. Present **The Nerd Brigade** as a (developer/studio) brand that ships small, focused Shopify apps.
2. Market the first app, **Monitor** (a Shopify store-health monitoring app), and link merchants to its App Store listing.
3. Host the **legal/policy pages required for Shopify app distribution** — chiefly a publicly accessible Privacy Policy, plus Terms of Service and a Support page.

The Monitor app itself is a separate codebase hosted on Gadget.dev at `monitor-app.thenerdbrigade.com`. This website does **not** contain app code; it is purely static informational content that links out to the app and its App Store listing.

### Brand concept

Lean into the **"Brigade"** half of the name: The Nerd Brigade is framed as an elite squad of nerds, with the site organized as a military "chain of command" and individual apps presented as **battalions** — all wearing a playful retro-arcade visual style ("Option C" palette). The military-nerd voice is applied to navigation and marketing copy, but **legal pages keep plain, unambiguous wording** (only the page *title* is themed) so Shopify reviewers and merchants are never confused.

## Goals / Non-goals

**Goals**
- Zero/near-zero monthly hosting cost.
- Fast, accessible, SEO-friendly static site.
- A privacy policy that accurately reflects how Monitor handles data (Shopify requirement).
- Easy to add content (changelog posts, docs) and to add future apps ("battalions") without restructuring.

**Non-goals (out of scope for now)**
- Final logo/insignia (deferred — see Open Items).
- Blog, live status page, user accounts, e-commerce/checkout, or any dynamic backend.

## Tech & Hosting

- **Framework:** Astro (static output). Markdown-based **content collections** for Dispatches (changelog) and Field Manual (docs) — adding a post = adding a `.md` file.
- **Styling:** Tailwind CSS v4 with design tokens for the Option C palette; a small set of reusable components (Nav, Footer, BattalionCard, Insignia placeholder, CTAButton, PricingTable, Prose wrapper for Markdown).
- **Hosting:** Cloudflare Pages, deployed from the GitHub repo. Build command `astro build`, output directory `dist`.
- **Domain/DNS:** `thenerdbrigade.com` is registered via Google Workspace with DNS on Cloudflare. Point the apex (and `www`) at the Cloudflare Pages project; HTTPS is automatic. The existing `monitor-app.thenerdbrigade.com` subdomain (Gadget) is untouched.
- **Cost:** $0/month on Cloudflare Pages' free tier.
- **SEO/quality baseline:** per-page `<title>`/meta + Open Graph tags, `sitemap.xml`, `robots.txt`, accessible color contrast verified against the dark theme.

## Brand System

- **Palette:** ink `#16121f`, panel `#211a2e`, purple `#a78bfa` / deep purple `#7c3aed`, cyan `#22d3ee`, pink `#f472b6`, gold `#fde68a`, light text `#f8fafc`, muted `#c4b5fd`.
- **Voice:** military-nerd ("Command HQ", "battalions", "dispatches", "deploy", "enlist") for navigation and marketing; plain language for legal pages.
- **Logo:** bold **"NERD BRIGADE" wordmark** used as a working header treatment. The final mark is deferred and must be swappable without layout changes (a single `Insignia`/`Wordmark` component).

## Site Map (Chain of Command)

| Themed name | Route | Purpose / content |
|---|---|---|
| Command HQ | `/` | Hero; what The Nerd Brigade is; **Active Battalions** grid (Monitor card + a "Recruiting" slot for future apps); primary CTA to install Monitor |
| Sentinel Battalion | `/monitor` | Monitor product page: capabilities (uptime, add-to-cart/checkout, shipping-rate, order-volume monitoring, multi-channel alerts), feature sections, **pricing tiers**, install CTA → App Store listing |
| Field Manual | `/docs` | Setup & usage documentation (mirrors the in-app setup guide); Markdown content collection |
| Dispatches | `/dispatches` | Changelog / release notes; Markdown content collection |
| The Brigade | `/about` | Story / mission |
| Privacy Protocol | `/privacy` | Required privacy policy (see Legal Content) |
| Rules of Engagement | `/terms` | Terms of Service |
| Comms | `/support` | Support/contact: email, response expectations, link to Field Manual |

Footer links to Privacy / Terms / Comms appear on every page. Themed names are paired with plain descriptors where clarity matters.

### Monitor product page — content source

Capabilities to describe (from the Monitor app's CLAUDE.md):
- Homepage & product-page checks (HTTP status + response time, configurable thresholds, min 500ms).
- Add-to-cart & checkout flow monitoring (variant auto-discovery).
- Shipping-rate validation.
- Order-volume anomaly detection (vs. yesterday / 7-day average).
- Multi-channel alerts: email (default or custom SMTP), webhook, Slack — with severity filtering and cooldowns.
- Uptime SLA dashboard, notification audit log.

**Pricing tiers** (display on `/monitor`):
- $9.99/mo — up to 1,000 orders
- $24.99/mo — up to 5,000 orders
- $49.99/mo — up to 10,000 orders
- $79.99/mo — unlimited

## Legal Content Plan

Operating name **"The Nerd Brigade"**; **United States** jurisdiction (governing-law **state is a placeholder** to be filled/confirmed); contact **TheNerd@thenerdbrigade.com**; email-only contact (no mailing address for now).

> **Disclaimer:** These pages will be written as solid, standard policy text but are **not legal advice**. The owner should review final wording (and consider counsel) before publishing.

### Privacy Protocol (`/privacy`) — must reflect how Monitor actually works
- **Data accessed via Shopify APIs:** read-only scopes `read_orders, read_products, read_inventory, read_locations`, used to run store-health and order-volume checks. Not sold; not shared except as needed to provide the service.
- **Data provided by the merchant:** monitoring configuration (storefront/product URLs, thresholds), notification recipients (names + email addresses entered by the merchant), webhook/Slack URLs, and SMTP credentials (**password encrypted at rest with AES-256-GCM**).
- **Customer (buyer) data:** the app monitors storefront health and does **not** collect or process buyer personal data for its own purposes; order data is used in aggregate for volume monitoring.
- **Hosting & processing:** Gadget.dev infrastructure (AWS), United States.
- **Subprocessors / third parties:** Shopify, Gadget.dev, and any email/Slack/webhook endpoints the merchant configures.
- **Retention:** check results and notification logs are pruned after **90 days**; configuration is retained until the app is uninstalled. **GDPR/CCPA compliance webhooks** (`customers/data_request`, `customers/redact`, `shop/redact`) are implemented.
- **Security, data-subject rights (access/correction/erasure), and contact info.**

### Rules of Engagement / Terms (`/terms`)
- Subscription & billing handled through Shopify; the pricing tiers above.
- Acceptable use.
- **Service is best-effort:** monitoring does not guarantee detection of every issue; no liability for missed downtime/alerts.
- Limitation of liability, termination, governing law (US + state placeholder), changes to terms.

### Comms / Support (`/support`)
- How to get help, contact email, link to the Field Manual, and response-time expectations.

## Components (initial)

- `Layout` (base HTML head, meta/OG, theme tokens)
- `Nav` (themed links + CTA)
- `Footer` (legal links, copyright)
- `Wordmark` / `Insignia` (swappable logo slot)
- `BattalionCard` (app cards on HQ)
- `CTAButton`
- `PricingTable` (Monitor tiers)
- `Prose` (Markdown wrapper for docs/dispatches/legal)

## Open Items / TODO

- **Final logo/insignia** — none of the explored directions were a fit; revisit later. Site must keep the logo swappable.
- **Governing-law state** — placeholder in Terms until confirmed.
- **App Store listing URL** — insert the live Monitor App Store URL on the install CTAs once available.
- **Docs/Dispatches initial content** — seed with at least one real entry each; full content to follow.

## Success Criteria

- Site builds with `astro build` and deploys to Cloudflare Pages with the custom domain + HTTPS.
- All eight pages render with the themed nav/footer and correct content.
- Privacy Policy is publicly reachable at a stable URL suitable for linking from the Shopify App Store listing.
- Lighthouse: good performance/accessibility/SEO scores on the dark theme; color contrast passes.
