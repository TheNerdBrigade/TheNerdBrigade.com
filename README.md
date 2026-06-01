# TheNerdBrigade.com

Marketing/informational site for **The Nerd Brigade** and the **Monitor** Shopify app, plus the Shopify-required Privacy Policy, Terms, and Support pages.

Built with [Astro](https://astro.build) + Tailwind CSS v4. Deployed free on Cloudflare Pages.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the built site
npm test         # structural + privacy-disclosure tests
```

## Project layout

- `src/pages/` — routes (one file per page; `[...slug].astro` are dynamic).
- `src/content/` — Markdown for the Field Manual (`docs/`) and Dispatches (`dispatches/`). Add a `.md` file with the right frontmatter to publish a new entry.
- `src/components/`, `src/layouts/` — UI building blocks.
- `src/data/site.ts` — nav, pricing, and contact constants.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, and select this repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. After the first deploy, add the custom domain under **Pages project → Custom domains**: add `thenerdbrigade.com` and `www.thenerdbrigade.com`. Because DNS is already on Cloudflare, the records and HTTPS are configured automatically.
5. The existing `monitor-app.thenerdbrigade.com` subdomain (Gadget) is unaffected.

## Open items

- **Final logo/insignia** — currently a wordmark placeholder (`src/components/Wordmark.astro` + `public/favicon.svg`); swap in the final mark there.
- **Governing-law state** — `[STATE TO BE CONFIRMED]` placeholder in `src/pages/terms.astro`.
- **Monitor App Store URL** — `monitorAppStoreUrl` in `src/data/site.ts`; update once the listing is live.
