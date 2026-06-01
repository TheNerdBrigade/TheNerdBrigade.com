# TheNerdBrigade.com Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, brigade-themed marketing/informational site for thenerdbrigade.com that markets the Monitor Shopify app and hosts the Shopify-required Privacy Policy plus Terms and Support pages, deployable free on Cloudflare Pages.

**Architecture:** Astro static site. Tailwind CSS v4 (via the Vite plugin) supplies the design system from a small token set. Marketing pages are `.astro` files; Docs (Field Manual) and Changelog (Dispatches) are Markdown content collections validated by Zod schemas at build time. A tiny Vitest suite guards the structural + legal-content requirements; `astro build` is the primary integration check (it also validates content schemas). Deploys from the GitHub repo to Cloudflare Pages (`astro build` → `dist`).

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@tailwindcss/vite`), `@astrojs/sitemap`, Vitest, Node 20+, npm. Hosting: Cloudflare Pages. DNS: Cloudflare.

---

## File Structure

```
package.json                         # scripts + deps
astro.config.mjs                     # site URL, sitemap, tailwind vite plugin
tsconfig.json                        # extends astro/tsconfigs/strict
vitest.config.ts                     # test runner config
src/
  content.config.ts                  # docs + dispatches collections (Zod schemas)
  data/site.ts                       # shared constants (nav, routes, contact, pricing)
  styles/global.css                  # @import tailwindcss + @theme tokens
  layouts/Layout.astro               # <head>, meta/OG, theme, slot
  components/
    Wordmark.astro                   # swappable logo slot (placeholder wordmark)
    Nav.astro
    Footer.astro
    CTAButton.astro
    BattalionCard.astro
    PricingTable.astro
    Prose.astro                      # styled wrapper for Markdown/legal bodies
  pages/
    index.astro                      # Command HQ (home)
    monitor.astro                    # Sentinel Battalion (product + pricing)
    about.astro                      # The Brigade
    privacy.astro                    # Privacy Protocol
    terms.astro                      # Rules of Engagement
    support.astro                    # Comms
    docs/index.astro                 # Field Manual index
    docs/[...slug].astro             # Field Manual entry
    dispatches/index.astro           # Dispatches index
    dispatches/[...slug].astro       # Dispatch entry
    404.astro
  content/
    docs/getting-started.md          # seed doc
    dispatches/2026-05-31-monitor-launch.md  # seed changelog entry
public/
  favicon.svg                        # placeholder mark
  robots.txt
tests/
  structure.test.ts                  # routes exist; nav covers routes; privacy has required disclosures
README.md                            # build + deploy instructions
```

**Conventions for the engineer (Astro basics):**
- `.astro` files: frontmatter (JS/TS) sits between `---` fences at the top; everything below is HTML-ish template. `{expr}` interpolates; `{items.map(...)}` renders lists.
- Components are imported in frontmatter and used as `<Component prop="x" />`. `<slot />` renders children.
- Pages under `src/pages/` become routes by filename. `[...slug].astro` is a catch-all dynamic route and needs `getStaticPaths()`.
- Content collections are defined in `src/content.config.ts`; query with `getCollection('name')` and render an entry with `const { Content } = await render(entry)`.

---

## Task 1: Scaffold project (Astro + Tailwind + Vitest)

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "thenerdbrigade-com",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.5.0",
    "@astrojs/sitemap": "^3.2.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://thenerdbrigade.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 5: Create `src/styles/global.css` with the design tokens**

```css
@import "tailwindcss";

@theme {
  --color-ink: #16121f;
  --color-panel: #211a2e;
  --color-panel-2: #1a1527;
  --color-line: #3b3450;
  --color-purple: #a78bfa;
  --color-purple-deep: #7c3aed;
  --color-cyan: #22d3ee;
  --color-pink: #f472b6;
  --color-gold: #fde68a;
  --color-fg: #f8fafc;
  --color-muted: #c4b5fd;

  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

html {
  scroll-behavior: smooth;
  background-color: var(--color-ink);
  color: var(--color-fg);
}

body {
  font-family: var(--font-sans);
  margin: 0;
}
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: dependencies install with no errors; `node_modules/` and `package-lock.json` created.

- [ ] **Step 7: Verify the toolchain builds an empty site**

Run: `npm run build`
Expected: Astro builds. It will warn "no pages" or produce an empty `dist/` — that's fine at this stage; the command must exit 0. (If Astro errors that `src/pages` is missing, create an empty `src/pages/.gitkeep` and re-run.)

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts src/styles/global.css
git commit -m "chore: scaffold Astro + Tailwind v4 + Vitest"
```

---

## Task 2: Shared site data

**Files:**
- Create: `src/data/site.ts`

- [ ] **Step 1: Create `src/data/site.ts`**

```ts
export const SITE = {
  name: 'The Nerd Brigade',
  tagline: 'An elite brigade of nerds, building tools that guard your store.',
  url: 'https://thenerdbrigade.com',
  contactEmail: 'TheNerd@thenerdbrigade.com',
  // TODO: replace with the live Monitor App Store listing URL once approved.
  monitorAppStoreUrl: 'https://apps.shopify.com/',
  year: new Date().getFullYear(),
};

// Themed primary navigation. `label` is themed; `plain` clarifies where it helps.
export const NAV = [
  { href: '/monitor', label: 'Sentinel Battalion', plain: 'Monitor' },
  { href: '/docs', label: 'Field Manual', plain: 'Docs' },
  { href: '/dispatches', label: 'Dispatches', plain: 'Changelog' },
  { href: '/about', label: 'The Brigade', plain: 'About' },
];

export const LEGAL_NAV = [
  { href: '/privacy', label: 'Privacy Protocol' },
  { href: '/terms', label: 'Rules of Engagement' },
  { href: '/support', label: 'Comms' },
];

export const PRICING = [
  { price: '$9.99', cadence: '/mo', tier: 'Recruit', limit: 'Up to 1,000 orders/mo' },
  { price: '$24.99', cadence: '/mo', tier: 'Squad', limit: 'Up to 5,000 orders/mo' },
  { price: '$49.99', cadence: '/mo', tier: 'Platoon', limit: 'Up to 10,000 orders/mo' },
  { price: '$79.99', cadence: '/mo', tier: 'Battalion', limit: 'Unlimited orders' },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/site.ts
git commit -m "feat: add shared site data (nav, pricing, contact)"
```

---

## Task 3: Base layout + logo placeholder

**Files:**
- Create: `src/components/Wordmark.astro`
- Create: `src/layouts/Layout.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create `src/components/Wordmark.astro` (swappable logo slot)**

```astro
---
// Placeholder brand mark. Final insignia is deferred; swap this component's
// internals later without touching consumers.
interface Props { class?: string }
const { class: className = '' } = Astro.props;
---
<span class={`inline-flex items-baseline gap-1 font-extrabold tracking-wide ${className}`}>
  <span class="text-fg">NERD</span>
  <span class="text-gold">BRIGADE</span>
</span>
```

- [ ] **Step 2: Create `public/favicon.svg` (placeholder mark)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#16121f"/>
  <path d="M7 21 L16 16 L25 21" fill="none" stroke="#f472b6" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="16" y="14" text-anchor="middle" fill="#fde68a" font-family="monospace" font-size="11" font-weight="700">NB</text>
</svg>
```

- [ ] **Step 3: Create `src/layouts/Layout.astro`**

```astro
---
import '../styles/global.css';
import { SITE } from '../data/site';

interface Props {
  title: string;
  description: string;
  /** Path-only canonical, e.g. "/monitor". Defaults to current path. */
  path?: string;
}
const { title, description, path = Astro.url.pathname } = Astro.props;
const canonical = new URL(path, SITE.url).href;
const fullTitle = title === SITE.name ? title : `${title} · ${SITE.name}`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={SITE.name} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body class="bg-ink text-fg min-h-screen flex flex-col">
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Verify build still passes**

Run: `npm run build`
Expected: exits 0 (still no pages, or `.gitkeep` placeholder present).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro src/components/Wordmark.astro public/favicon.svg
git commit -m "feat: add base layout, meta/OG tags, and placeholder wordmark"
```

---

## Task 4: Nav and Footer

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
import { NAV, SITE } from '../data/site';
import Wordmark from './Wordmark.astro';
const current = Astro.url.pathname;
---
<header class="border-b border-line bg-panel-2/70 backdrop-blur sticky top-0 z-20">
  <nav class="mx-auto max-w-6xl flex items-center gap-4 px-5 py-3">
    <a href="/" class="flex items-center gap-2 shrink-0" aria-label={`${SITE.name} home`}>
      <span class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-purple-deep text-gold font-mono text-sm font-bold shadow-[2px_2px_0_var(--color-cyan)]">NB</span>
      <Wordmark class="text-sm" />
    </a>
    <ul class="ml-auto hidden md:flex items-center gap-5 text-sm">
      {NAV.map((item) => (
        <li>
          <a
            href={item.href}
            aria-current={current.startsWith(item.href) ? 'page' : undefined}
            class:list={[
              'text-muted hover:text-fg transition-colors',
              { 'text-fg font-semibold': current.startsWith(item.href) },
            ]}
          >{item.label}</a>
        </li>
      ))}
    </ul>
    <a
      href={SITE.monitorAppStoreUrl}
      class="ml-auto md:ml-0 rounded-md bg-gradient-to-r from-pink to-purple px-3 py-1.5 text-sm font-bold text-white shadow-[2px_2px_0_var(--color-cyan)] hover:brightness-110"
    >Enlist →</a>
  </nav>
</header>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
import { NAV, LEGAL_NAV, SITE } from '../data/site';
---
<footer class="mt-auto border-t border-line bg-panel-2">
  <div class="mx-auto max-w-6xl px-5 py-10 grid gap-8 sm:grid-cols-3 text-sm">
    <div>
      <p class="font-extrabold tracking-wide"><span class="text-fg">NERD</span> <span class="text-gold">BRIGADE</span></p>
      <p class="mt-2 text-muted">{SITE.tagline}</p>
    </div>
    <div>
      <p class="text-gold font-bold text-xs tracking-widest uppercase mb-3">Battalions</p>
      <ul class="space-y-2">
        {NAV.map((i) => <li><a class="text-muted hover:text-fg" href={i.href}>{i.label}</a></li>)}
      </ul>
    </div>
    <div>
      <p class="text-gold font-bold text-xs tracking-widest uppercase mb-3">HQ</p>
      <ul class="space-y-2">
        {LEGAL_NAV.map((i) => <li><a class="text-muted hover:text-fg" href={i.href}>{i.label}</a></li>)}
        <li><a class="text-muted hover:text-fg" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-line">
    <p class="mx-auto max-w-6xl px-5 py-4 text-xs text-muted">© {SITE.year} {SITE.name}. All rights reserved.</p>
  </div>
</footer>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro
git commit -m "feat: add themed nav and footer"
```

---

## Task 5: Reusable UI components

**Files:**
- Create: `src/components/CTAButton.astro`
- Create: `src/components/BattalionCard.astro`
- Create: `src/components/PricingTable.astro`
- Create: `src/components/Prose.astro`

- [ ] **Step 1: Create `src/components/CTAButton.astro`**

```astro
---
interface Props { href: string; variant?: 'primary' | 'ghost'; class?: string }
const { href, variant = 'primary', class: className = '' } = Astro.props;
const base = 'inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition';
const styles = variant === 'primary'
  ? 'bg-gradient-to-r from-pink to-purple text-white shadow-[3px_3px_0_var(--color-cyan)] hover:brightness-110'
  : 'border border-purple/50 text-fg hover:bg-panel';
---
<a href={href} class={`${base} ${styles} ${className}`}><slot /></a>
```

- [ ] **Step 2: Create `src/components/BattalionCard.astro`**

```astro
---
interface Props {
  icon: string;
  title: string;
  codename?: string;
  status?: string;
  href?: string;
  cta?: string;
  dashed?: boolean;
}
const { icon, title, codename, status, href, cta, dashed = false } = Astro.props;
---
<div class:list={[
  'relative rounded-xl bg-panel p-5',
  dashed ? 'border border-dashed border-line' : 'border border-line',
]}>
  {status && (
    <span class="absolute top-4 right-4 rounded-full bg-cyan/15 px-2 py-0.5 text-[10px] font-bold text-cyan">● {status}</span>
  )}
  <div class="text-2xl mb-2">{icon}</div>
  <h3 class="font-extrabold text-lg">{title}</h3>
  {codename && <p class="text-purple text-xs font-bold tracking-wide mb-2">CODENAME: {codename}</p>}
  <p class="text-muted text-sm mt-1"><slot /></p>
  {href && cta && <a href={href} class="mt-3 inline-block text-pink text-sm font-bold hover:underline">{cta} →</a>}
</div>
```

- [ ] **Step 3: Create `src/components/PricingTable.astro`**

```astro
---
import { PRICING } from '../data/site';
import CTAButton from './CTAButton.astro';
import { SITE } from '../data/site';
---
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {PRICING.map((p) => (
    <div class="rounded-xl border border-line bg-panel p-5 flex flex-col">
      <p class="text-gold text-xs font-bold tracking-widest uppercase">{p.tier}</p>
      <p class="mt-2"><span class="text-3xl font-extrabold">{p.price}</span><span class="text-muted text-sm">{p.cadence}</span></p>
      <p class="mt-2 text-muted text-sm flex-1">{p.limit}</p>
      <CTAButton href={SITE.monitorAppStoreUrl} variant="ghost" class="mt-4">Choose {p.tier}</CTAButton>
    </div>
  ))}
</div>
<p class="mt-3 text-xs text-muted">Billing is handled securely through Shopify. Prices in USD.</p>
```

- [ ] **Step 4: Create `src/components/Prose.astro` (Markdown/legal body styling)**

```astro
---
interface Props { class?: string }
const { class: className = '' } = Astro.props;
---
<div class={`prose-brigade max-w-none ${className}`}>
  <slot />
</div>

<style is:global>
  .prose-brigade { color: var(--color-fg); line-height: 1.7; }
  .prose-brigade h1 { font-size: 2rem; font-weight: 800; margin: 0 0 1rem; }
  .prose-brigade h2 { font-size: 1.4rem; font-weight: 800; margin: 2rem 0 .75rem; color: var(--color-gold); }
  .prose-brigade h3 { font-size: 1.1rem; font-weight: 700; margin: 1.5rem 0 .5rem; }
  .prose-brigade p, .prose-brigade li { color: var(--color-muted); }
  .prose-brigade a { color: var(--color-cyan); text-decoration: underline; }
  .prose-brigade ul { padding-left: 1.25rem; list-style: disc; margin: .75rem 0; }
  .prose-brigade strong { color: var(--color-fg); }
  .prose-brigade code { font-family: var(--font-mono); background: var(--color-panel); padding: .1rem .35rem; border-radius: 4px; font-size: .9em; }
  .prose-brigade hr { border: none; border-top: 1px solid var(--color-line); margin: 2rem 0; }
</style>
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: exits 0 (components compile; still no routed pages yet, or `.gitkeep` present).

- [ ] **Step 6: Commit**

```bash
git add src/components/CTAButton.astro src/components/BattalionCard.astro src/components/PricingTable.astro src/components/Prose.astro
git commit -m "feat: add reusable UI components (CTA, battalion card, pricing, prose)"
```

---

## Task 6: Structural test harness (TDD guardrail)

This suite encodes the spec's hard requirements: every route exists, the nav covers the marketing routes, and the privacy page contains the required disclosures. Write it now so subsequent page tasks turn it green.

**Files:**
- Create: `tests/structure.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');
const p = (rel: string) => resolve(root, rel);

const REQUIRED_PAGES = [
  'src/pages/index.astro',
  'src/pages/monitor.astro',
  'src/pages/about.astro',
  'src/pages/privacy.astro',
  'src/pages/terms.astro',
  'src/pages/support.astro',
  'src/pages/docs/index.astro',
  'src/pages/docs/[...slug].astro',
  'src/pages/dispatches/index.astro',
  'src/pages/dispatches/[...slug].astro',
  'src/pages/404.astro',
];

describe('site structure', () => {
  it('has every required route file', () => {
    for (const rel of REQUIRED_PAGES) {
      expect(existsSync(p(rel)), `${rel} should exist`).toBe(true);
    }
  });

  it('nav links cover all marketing routes', () => {
    const site = readFileSync(p('src/data/site.ts'), 'utf8');
    for (const href of ['/monitor', '/docs', '/dispatches', '/about']) {
      expect(site.includes(`'${href}'`), `nav should include ${href}`).toBe(true);
    }
  });
});

describe('privacy policy required disclosures', () => {
  const privacy = () => readFileSync(p('src/pages/privacy.astro'), 'utf8');

  it.each([
    ['90-day retention', '90'],
    ['data request webhook', 'customers/data_request'],
    ['customer redact webhook', 'customers/redact'],
    ['shop redact webhook', 'shop/redact'],
    ['SMTP encryption', 'AES-256-GCM'],
    ['Shopify read scopes', 'read_orders'],
    ['contact email', 'TheNerd@thenerdbrigade.com'],
  ])('mentions %s', (_label, needle) => {
    expect(privacy().includes(needle), `privacy.astro should mention "${needle}"`).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — required page files do not exist yet, and `privacy.astro` is missing.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/structure.test.ts
git commit -m "test: add structural + privacy-disclosure guardrail (red)"
```

---

## Task 7: Command HQ (home page)

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import CTAButton from '../components/CTAButton.astro';
import BattalionCard from '../components/BattalionCard.astro';
import { SITE } from '../data/site';
---
<Layout title={SITE.name} description="The Nerd Brigade builds small, sharp Shopify apps. First into the field: Monitor — 24/7 storefront health monitoring." path="/">
  <Nav />
  <main class="flex-1">
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 opacity-60" style="background:radial-gradient(900px 320px at 50% -10%, rgba(124,58,237,.45), transparent)"></div>
      <div class="relative mx-auto max-w-4xl px-5 py-24 text-center">
        <span class="inline-flex items-center gap-2 rounded-full border border-cyan/30 px-3 py-1 text-xs font-bold tracking-widest text-cyan">▸ ENLISTING NERDS · EST. {SITE.year}</span>
        <h1 class="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight">
          An elite brigade of nerds,<br />building tools that <span class="text-gold">guard your store.</span>
        </h1>
        <p class="mx-auto mt-5 max-w-xl text-muted">We deploy small, focused apps for Shopify merchants — each one a battalion with a single mission. First into the field: <strong>Monitor</strong>.</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <CTAButton href="/monitor">Deploy Monitor</CTAButton>
          <CTAButton href="/docs" variant="ghost">Read the Field Manual</CTAButton>
        </div>
      </div>
    </section>

    <!-- BATTALIONS -->
    <section class="mx-auto max-w-6xl px-5 pb-24">
      <div class="flex items-center gap-3 mb-6">
        <span class="text-gold text-xs font-extrabold tracking-widest">◤ ACTIVE BATTALIONS</span>
        <span class="flex-1 border-t border-dashed border-line"></span>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <BattalionCard icon="🛰️" title="Sentinel Battalion" codename="Monitor" status="ON DUTY" href="/monitor" cta="View battalion">
          24/7 watch over storefront uptime, checkout, cart & order volume. Sounds the alarm before customers notice.
        </BattalionCard>
        <BattalionCard icon="🎖️" title="Recruiting" dashed>
          More battalions are in basic training. Room to grow as we ship new apps.
        </BattalionCard>
        <BattalionCard icon="📖" title="Field Manual" href="/docs" cta="Open manual">
          Setup guides and docs for getting any battalion combat-ready in minutes.
        </BattalionCard>
      </div>
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Verify it builds and renders**

Run: `npm run build`
Expected: exits 0; `dist/index.html` exists. (Remove `src/pages/.gitkeep` if you created one.)

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git rm --ignored --cached src/pages/.gitkeep 2>/dev/null || true
git commit -m "feat: add Command HQ home page"
```

---

## Task 8: Sentinel Battalion (Monitor product page)

**Files:**
- Create: `src/pages/monitor.astro`

- [ ] **Step 1: Create `src/pages/monitor.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import CTAButton from '../components/CTAButton.astro';
import PricingTable from '../components/PricingTable.astro';
import { SITE } from '../data/site';

const features = [
  { icon: '🌐', title: 'Uptime & page health', body: 'Homepage and product-page checks track HTTP status and response time against thresholds you set (minimum 500ms).' },
  { icon: '🛒', title: 'Cart & checkout flow', body: 'End-to-end add-to-cart and checkout monitoring with automatic product-variant discovery.' },
  { icon: '🚚', title: 'Shipping rates', body: 'Verifies your storefront returns the shipping rates customers expect for a test address.' },
  { icon: '📉', title: 'Order-volume anomalies', body: 'Detects drops in sales versus yesterday or your 7-day average, so a silent outage never hides.' },
  { icon: '🔔', title: 'Multi-channel alerts', body: 'Email (default or your own SMTP), webhooks, and Slack — filtered by severity, with cooldowns to prevent spam.' },
  { icon: '📊', title: 'Uptime SLA & audit log', body: 'Per-check 24h and 7-day uptime, response-time sparklines, and a full notification audit trail.' },
];
---
<Layout title="Sentinel Battalion (Monitor)" description="Monitor watches your Shopify storefront 24/7 — uptime, cart, checkout, shipping, and order volume — and alerts you before customers notice." path="/monitor">
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-4xl px-5 py-20 text-center">
      <span class="text-purple text-xs font-bold tracking-widest">CODENAME: MONITOR</span>
      <h1 class="mt-3 text-4xl sm:text-5xl font-extrabold">The Sentinel Battalion</h1>
      <p class="mx-auto mt-4 max-w-xl text-muted">Standing watch over your storefront around the clock. When uptime, checkout, shipping, or order volume goes sideways, Monitor sounds the alarm — before your customers do.</p>
      <div class="mt-8 flex justify-center gap-3">
        <CTAButton href={SITE.monitorAppStoreUrl}>Install on Shopify</CTAButton>
        <CTAButton href="/docs" variant="ghost">Read the docs</CTAButton>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-5 pb-16">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div class="rounded-xl border border-line bg-panel p-5">
            <div class="text-2xl mb-2">{f.icon}</div>
            <h3 class="font-bold">{f.title}</h3>
            <p class="text-muted text-sm mt-1">{f.body}</p>
          </div>
        ))}
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-5 pb-24">
      <div class="flex items-center gap-3 mb-6">
        <span class="text-gold text-xs font-extrabold tracking-widest">◤ ENLISTMENT TIERS</span>
        <span class="flex-1 border-t border-dashed border-line"></span>
      </div>
      <PricingTable />
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exits 0; `dist/monitor/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/monitor.astro
git commit -m "feat: add Sentinel Battalion (Monitor) product page with pricing"
```

---

## Task 9: The Brigade (about page)

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import CTAButton from '../components/CTAButton.astro';
import { SITE } from '../data/site';
---
<Layout title="The Brigade" description="The Nerd Brigade is a small studio shipping focused, dependable Shopify apps — built by nerds who sweat the details." path="/about">
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-3xl px-5 py-20">
      <span class="text-gold text-xs font-extrabold tracking-widest">◤ THE BRIGADE</span>
      <h1 class="mt-3 text-4xl font-extrabold">Nerds. Organized. Deployed.</h1>
      <div class="mt-6 space-y-5 text-muted leading-relaxed">
        <p>The Nerd Brigade is a small studio with one rule: ship focused tools that do their job and stay out of the way. No bloat, no dark patterns — just dependable apps for Shopify merchants.</p>
        <p>We organize our work like a brigade. Each app is a <strong class="text-fg">battalion</strong> with a single mission and a clear chain of command. Our first deployment, <strong class="text-fg">Monitor</strong> (the Sentinel Battalion), stands watch over storefront health so merchants find out about problems before their customers do.</p>
        <p>Everything we build, we build to be quietly excellent. If something's wrong, we want you to hear it from us first.</p>
      </div>
      <div class="mt-8 flex gap-3">
        <CTAButton href="/monitor">Meet Monitor</CTAButton>
        <CTAButton href={`mailto:${SITE.contactEmail}`} variant="ghost">Contact HQ</CTAButton>
      </div>
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exits 0; `dist/about/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add The Brigade about page"
```

---

## Task 10: Privacy Protocol (privacy policy)

This is the Shopify-critical deliverable. Content must reflect how Monitor actually handles data. The structural test (Task 6) asserts the required disclosures appear here.

**Files:**
- Create: `src/pages/privacy.astro`

- [ ] **Step 1: Create `src/pages/privacy.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Prose from '../components/Prose.astro';
import { SITE } from '../data/site';
const updated = '2026-05-31';
---
<Layout title="Privacy Protocol" description="Privacy Policy for The Nerd Brigade and the Monitor app: what data we access, how we use it, retention, and your rights." path="/privacy">
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-3xl px-5 py-16">
      <span class="text-gold text-xs font-extrabold tracking-widest">◤ PRIVACY PROTOCOL</span>
      <Prose class="mt-3">
        <h1>Privacy Policy</h1>
        <p><em>Last updated: {updated}</em></p>
        <p>This Privacy Policy explains how <strong>The Nerd Brigade</strong> ("we", "us") collects, uses, and protects information in connection with our website and our Shopify application, <strong>Monitor</strong> (the "App"). By installing or using the App, you agree to this Policy.</p>

        <h2>1. Information we access through Shopify</h2>
        <p>When a merchant installs the App, Shopify grants us read-only access to the following, used solely to run store-health checks:</p>
        <ul>
          <li><code>read_orders</code> — to detect order-volume anomalies (e.g. a sudden drop versus your previous day or 7-day average).</li>
          <li><code>read_products</code> — to validate product pages and discover variants for cart/checkout checks.</li>
          <li><code>read_inventory</code> and <code>read_locations</code> — to validate inventory and shipping-rate checks.</li>
        </ul>
        <p>We do not sell this data and do not share it except as needed to provide the service (see "Service providers" below).</p>

        <h2>2. Information you provide</h2>
        <ul>
          <li><strong>Monitoring configuration:</strong> storefront and product URLs, thresholds, and check settings.</li>
          <li><strong>Notification recipients:</strong> names and email addresses you enter to receive alerts.</li>
          <li><strong>Integration endpoints:</strong> webhook URLs and Slack webhook URLs you choose to configure.</li>
          <li><strong>SMTP credentials (optional):</strong> if you configure your own mail server, the password is encrypted at rest using <strong>AES-256-GCM</strong> and is only decrypted server-side when sending your alerts.</li>
        </ul>

        <h2>3. Customer (buyer) data</h2>
        <p>The App monitors storefront <em>health</em>; it does not collect or process your customers' personal data for our own purposes. Order information accessed via Shopify is used in aggregate for volume monitoring and is not used to build profiles or sold to anyone.</p>

        <h2>4. How we use information</h2>
        <p>We use the information above only to operate the App: running scheduled and on-demand checks, generating alerts and uptime statistics, delivering notifications through the channels you configure, and providing support.</p>

        <h2>5. Where data is processed</h2>
        <p>The App runs on <strong>Gadget.dev</strong> infrastructure (hosted on Amazon Web Services) in the <strong>United States</strong>. Information is stored and processed there.</p>

        <h2>6. Service providers</h2>
        <ul>
          <li><strong>Shopify</strong> — the platform through which the App is installed and authorized.</li>
          <li><strong>Gadget.dev</strong> — application hosting, database, and background jobs.</li>
          <li><strong>Email, webhook, and Slack endpoints</strong> that you configure to receive alerts.</li>
        </ul>

        <h2>7. Data retention</h2>
        <p>Check results and notification logs are automatically deleted after <strong>90 days</strong>. Your monitoring configuration is retained while the App is installed. When you uninstall the App, or upon a valid erasure request, your data is deleted in accordance with the compliance webhooks below.</p>

        <h2>8. GDPR / CCPA compliance webhooks</h2>
        <p>As required for Shopify apps, we implement Shopify's mandatory compliance webhooks:</p>
        <ul>
          <li><code>customers/data_request</code> — respond to a customer's request for their data.</li>
          <li><code>customers/redact</code> — delete a specific customer's data on request.</li>
          <li><code>shop/redact</code> — delete a shop's data after the App is uninstalled.</li>
        </ul>

        <h2>9. Security</h2>
        <p>Data is transmitted over HTTPS and stored on managed infrastructure. Sensitive secrets such as SMTP passwords are encrypted at rest (AES-256-GCM). No method of transmission or storage is 100% secure, but we take reasonable measures to protect your information.</p>

        <h2>10. Your rights</h2>
        <p>Depending on your jurisdiction, you may have rights to access, correct, export, or delete your personal data, and to restrict or object to certain processing. To exercise these rights, contact us at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>

        <h2>11. Changes to this Policy</h2>
        <p>We may update this Policy from time to time. Material changes will be reflected by updating the "Last updated" date above.</p>

        <h2>12. Contact</h2>
        <p>Questions about this Policy? Reach The Nerd Brigade at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>
      </Prose>
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Run the structural test — privacy disclosures should now pass**

Run: `npm test`
Expected: the `privacy policy required disclosures` block PASSES. (The `site structure` block may still fail because other pages — terms, support, docs, dispatches, 404 — are not created yet. That's expected; remaining page tasks turn them green.)

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: exits 0; `dist/privacy/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add src/pages/privacy.astro
git commit -m "feat: add Privacy Protocol (privacy policy) reflecting Monitor data handling"
```

---

## Task 11: Rules of Engagement (Terms of Service)

**Files:**
- Create: `src/pages/terms.astro`

- [ ] **Step 1: Create `src/pages/terms.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Prose from '../components/Prose.astro';
import { SITE } from '../data/site';
const updated = '2026-05-31';
---
<Layout title="Rules of Engagement" description="Terms of Service for The Nerd Brigade and the Monitor app." path="/terms">
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-3xl px-5 py-16">
      <span class="text-gold text-xs font-extrabold tracking-widest">◤ RULES OF ENGAGEMENT</span>
      <Prose class="mt-3">
        <h1>Terms of Service</h1>
        <p><em>Last updated: {updated}</em></p>
        <p>These Terms of Service ("Terms") govern your use of the website and the <strong>Monitor</strong> application (the "App") provided by <strong>The Nerd Brigade</strong> ("we", "us"). By installing or using the App, you agree to these Terms.</p>

        <h2>1. The service</h2>
        <p>Monitor performs automated checks on a Shopify store's storefront — including uptime, cart and checkout flows, shipping rates, and order volume — and sends notifications when it detects potential problems.</p>

        <h2>2. Subscriptions and billing</h2>
        <p>The App is offered on monthly subscription tiers (Recruit, Squad, Platoon, and Battalion) based on monthly order volume. All billing is handled securely through Shopify's billing system under your Shopify account. Prices are in U.S. dollars and may change with notice.</p>

        <h2>3. Acceptable use</h2>
        <p>You agree to use the App only for monitoring stores you own or are authorized to manage, and not to misuse, reverse engineer, or attempt to disrupt the service or use it to monitor third-party sites without permission.</p>

        <h2>4. Service is provided "as is" — best effort</h2>
        <p>Monitoring is provided on a <strong>best-effort basis</strong>. While we work to detect issues quickly, we do not guarantee that the App will detect every problem, that checks or alerts will always be timely or delivered, or that the service will be uninterrupted or error-free. The App is a monitoring aid and is not a substitute for your own operational diligence.</p>

        <h2>5. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, The Nerd Brigade will not be liable for any indirect, incidental, special, or consequential damages, or for lost sales, revenue, or data, arising from your use of (or inability to use) the App — including any missed or delayed detection of downtime or other issues. Our total liability for any claim will not exceed the amount you paid for the App in the three (3) months preceding the claim.</p>

        <h2>6. Termination</h2>
        <p>You may stop using the App at any time by uninstalling it from your Shopify admin. We may suspend or terminate access for violation of these Terms. Upon uninstallation, your data is handled as described in our <a href="/privacy">Privacy Policy</a>.</p>

        <h2>7. Governing law</h2>
        <p>These Terms are governed by the laws of the State of <strong>[STATE TO BE CONFIRMED]</strong>, United States, without regard to its conflict-of-laws rules.</p>

        <h2>8. Changes to these Terms</h2>
        <p>We may update these Terms from time to time. Material changes will be reflected by updating the "Last updated" date above. Continued use of the App after changes constitutes acceptance.</p>

        <h2>9. Contact</h2>
        <p>Questions about these Terms? Contact us at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>
      </Prose>
    </section>
  </main>
  <Footer />
</Layout>
```

> **Note for the engineer:** `[STATE TO BE CONFIRMED]` is an intentional placeholder from the spec's Open Items — leave it exactly as written; the owner will fill it in. Do not invent a state.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exits 0; `dist/terms/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/terms.astro
git commit -m "feat: add Rules of Engagement (Terms of Service)"
```

---

## Task 12: Comms (Support page)

**Files:**
- Create: `src/pages/support.astro`

- [ ] **Step 1: Create `src/pages/support.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import CTAButton from '../components/CTAButton.astro';
import { SITE } from '../data/site';
---
<Layout title="Comms" description="Need backup? Contact The Nerd Brigade for help with Monitor — email support and documentation." path="/support">
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-3xl px-5 py-20">
      <span class="text-gold text-xs font-extrabold tracking-widest">◤ COMMS</span>
      <h1 class="mt-3 text-4xl font-extrabold">Request backup</h1>
      <p class="mt-4 text-muted">Stuck, confused, or found a bug? We're here. The fastest way to reach HQ is email — we typically respond within <strong class="text-fg">1–2 business days</strong>.</p>

      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-line bg-panel p-5">
          <div class="text-2xl mb-2">📡</div>
          <h2 class="font-bold">Email support</h2>
          <p class="text-muted text-sm mt-1">Reach the brigade directly.</p>
          <a class="mt-3 inline-block text-cyan font-bold text-sm hover:underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </div>
        <div class="rounded-xl border border-line bg-panel p-5">
          <div class="text-2xl mb-2">📖</div>
          <h2 class="font-bold">Field Manual</h2>
          <p class="text-muted text-sm mt-1">Setup guides and answers to common questions.</p>
          <a class="mt-3 inline-block text-cyan font-bold text-sm hover:underline" href="/docs">Open the docs →</a>
        </div>
      </div>

      <div class="mt-8">
        <CTAButton href={`mailto:${SITE.contactEmail}`}>Email HQ</CTAButton>
      </div>
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exits 0; `dist/support/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/support.astro
git commit -m "feat: add Comms (support) page"
```

---

## Task 13: Content collections + seed content

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/docs/getting-started.md`
- Create: `src/content/dispatches/2026-05-31-monitor-launch.md`

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    order: z.number().default(0),
  }),
});

const dispatches = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dispatches' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
  }),
});

export const collections = { docs, dispatches };
```

- [ ] **Step 2: Create `src/content/docs/getting-started.md`**

```markdown
---
title: "Getting started with Monitor"
description: "Install Monitor and run your first store-health checks."
order: 1
---

# Getting started with Monitor

Welcome to the Sentinel Battalion. This guide gets Monitor watching your store in a few minutes.

## 1. Install the app

Install **Monitor** from the Shopify App Store and open it from your Shopify admin under **Apps**.

## 2. Run the setup wizard

On first launch, the setup guide walks you through the essentials:

- Confirm your **storefront URL**.
- Add one or more **product URLs** to test cart, checkout, and shipping checks.
- Set **response-time thresholds** (minimum 500ms) for your homepage and product pages.

## 3. Add notification recipients

Under **Settings → Recipients**, add the people who should get alerts. For each recipient you can choose which check types they care about and a minimum severity.

## 4. Choose your alert channels

Monitor can notify you by:

- **Email** — using our default mailer or your own SMTP server.
- **Webhook** — POSTed to a URL you control.
- **Slack** — via an incoming webhook URL.

## 5. Let it stand watch

Monitor runs checks automatically every 10 minutes. You can also trigger a run on demand from the dashboard. Visit the **Uptime SLA** dashboard any time to see 24-hour and 7-day health per check type.

Need a hand? Contact us from the [Comms page](/support).
```

- [ ] **Step 3: Create `src/content/dispatches/2026-05-31-monitor-launch.md`**

```markdown
---
title: "Monitor reports for duty"
date: 2026-05-31
summary: "The Sentinel Battalion is deployed — 24/7 storefront monitoring for Shopify is live."
---

# Monitor reports for duty

The Sentinel Battalion has officially deployed. **Monitor** is now available for Shopify, standing watch over your storefront around the clock.

**In this release:**

- Homepage and product-page uptime + response-time checks.
- Add-to-cart and full checkout-flow monitoring.
- Shipping-rate validation.
- Order-volume anomaly detection (versus yesterday or your 7-day average).
- Email, webhook, and Slack alerts with severity filtering and cooldowns.
- Uptime SLA dashboard and a full notification audit log.

Welcome to the brigade.
```

- [ ] **Step 4: Verify content schemas validate at build**

Run: `npm run build`
Expected: exits 0; no Zod/content errors. (Pages that render these collections come next; the collections themselves must compile.)

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/docs/getting-started.md src/content/dispatches/2026-05-31-monitor-launch.md
git commit -m "feat: add docs + dispatches content collections with seed entries"
```

---

## Task 14: Field Manual (docs index + entry pages)

**Files:**
- Create: `src/pages/docs/index.astro`
- Create: `src/pages/docs/[...slug].astro`

- [ ] **Step 1: Create `src/pages/docs/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

const entries = (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);
---
<Layout title="Field Manual" description="Documentation and setup guides for Monitor and other Nerd Brigade apps." path="/docs">
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-3xl px-5 py-16">
      <span class="text-gold text-xs font-extrabold tracking-widest">◤ FIELD MANUAL</span>
      <h1 class="mt-3 text-4xl font-extrabold">Field Manual</h1>
      <p class="mt-3 text-muted">Everything you need to get a battalion combat-ready.</p>
      <ul class="mt-8 space-y-3">
        {entries.map((e) => (
          <li class="rounded-xl border border-line bg-panel p-5">
            <a href={`/docs/${e.id}`} class="font-bold text-fg hover:text-cyan">{e.data.title}</a>
            {e.data.description && <p class="text-muted text-sm mt-1">{e.data.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Create `src/pages/docs/[...slug].astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import Prose from '../../components/Prose.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('docs');
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<Layout title={entry.data.title} description={entry.data.description || entry.data.title} path={`/docs/${entry.id}`}>
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-3xl px-5 py-16">
      <a href="/docs" class="text-cyan text-sm hover:underline">← Field Manual</a>
      <Prose class="mt-4"><Content /></Prose>
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 3: Verify build renders docs**

Run: `npm run build`
Expected: exits 0; `dist/docs/index.html` and `dist/docs/getting-started/index.html` exist.

- [ ] **Step 4: Commit**

```bash
git add src/pages/docs/index.astro "src/pages/docs/[...slug].astro"
git commit -m "feat: add Field Manual docs index and entry pages"
```

---

## Task 15: Dispatches (changelog index + entry pages)

**Files:**
- Create: `src/pages/dispatches/index.astro`
- Create: `src/pages/dispatches/[...slug].astro`

- [ ] **Step 1: Create `src/pages/dispatches/index.astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

const entries = (await getCollection('dispatches')).sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime(),
);
const fmt = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
---
<Layout title="Dispatches" description="Release notes and announcements from The Nerd Brigade." path="/dispatches">
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-3xl px-5 py-16">
      <span class="text-gold text-xs font-extrabold tracking-widest">◤ DISPATCHES</span>
      <h1 class="mt-3 text-4xl font-extrabold">Dispatches</h1>
      <p class="mt-3 text-muted">Field reports: what's new across the brigade.</p>
      <ul class="mt-8 space-y-3">
        {entries.map((e) => (
          <li class="rounded-xl border border-line bg-panel p-5">
            <p class="text-xs text-muted">{fmt(e.data.date)}</p>
            <a href={`/dispatches/${e.id}`} class="font-bold text-fg hover:text-cyan">{e.data.title}</a>
            <p class="text-muted text-sm mt-1">{e.data.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Create `src/pages/dispatches/[...slug].astro`**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import Prose from '../../components/Prose.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('dispatches');
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const fmt = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
---
<Layout title={entry.data.title} description={entry.data.summary} path={`/dispatches/${entry.id}`}>
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-3xl px-5 py-16">
      <a href="/dispatches" class="text-cyan text-sm hover:underline">← Dispatches</a>
      <p class="mt-4 text-xs text-muted">{fmt(entry.data.date)}</p>
      <Prose class="mt-2"><Content /></Prose>
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 3: Verify build renders dispatches**

Run: `npm run build`
Expected: exits 0; `dist/dispatches/index.html` and `dist/dispatches/2026-05-31-monitor-launch/index.html` exist.

- [ ] **Step 4: Commit**

```bash
git add src/pages/dispatches/index.astro "src/pages/dispatches/[...slug].astro"
git commit -m "feat: add Dispatches changelog index and entry pages"
```

---

## Task 16: 404 page, robots.txt

**Files:**
- Create: `src/pages/404.astro`
- Create: `public/robots.txt`

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import CTAButton from '../components/CTAButton.astro';
---
<Layout title="Position not found" description="That position could not be located." path="/404">
  <Nav />
  <main class="flex-1">
    <section class="mx-auto max-w-2xl px-5 py-28 text-center">
      <p class="text-6xl font-extrabold text-gold">404</p>
      <h1 class="mt-3 text-2xl font-extrabold">Position not found</h1>
      <p class="mt-3 text-muted">This sector is empty, soldier. Let's get you back to base.</p>
      <div class="mt-8 flex justify-center gap-3">
        <CTAButton href="/">Return to HQ</CTAButton>
        <CTAButton href="/monitor" variant="ghost">See Monitor</CTAButton>
      </div>
    </section>
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Create `public/robots.txt`**

```text
User-agent: *
Allow: /

Sitemap: https://thenerdbrigade.com/sitemap-index.xml
```

- [ ] **Step 3: Run the full structural test — it should now pass**

Run: `npm test`
Expected: ALL tests PASS (every required page now exists, nav covers routes, privacy disclosures present).

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: exits 0; `dist/404.html`, `dist/robots.txt`, and `dist/sitemap-index.xml` exist.

- [ ] **Step 5: Commit**

```bash
git add src/pages/404.astro public/robots.txt
git commit -m "feat: add 404 page and robots.txt"
```

---

## Task 17: README + Cloudflare Pages deploy docs

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

````markdown
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
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with develop and Cloudflare Pages deploy instructions"
```

---

## Task 18: Final verification

- [ ] **Step 1: Clean build from scratch**

Run: `npm run build`
Expected: exits 0 with no warnings about missing pages or invalid content.

- [ ] **Step 2: Run the test suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 3: Manual smoke check in preview**

Run: `npm run preview`
Then open the served URL and confirm:
- Home, Monitor (with pricing), About, Privacy, Terms, Support all render with nav + footer.
- `/docs` lists "Getting started with Monitor" and the entry page renders.
- `/dispatches` lists "Monitor reports for duty" and the entry page renders.
- Visiting a bad URL shows the themed 404.

Expected: every page renders correctly with the dark brigade theme; no console errors.

- [ ] **Step 4: Verify SEO artifacts exist in `dist/`**

Confirm `dist/sitemap-index.xml` and `dist/robots.txt` are present.

- [ ] **Step 5: Final commit (if any cleanup was needed)**

```bash
git add -A
git commit -m "chore: final verification pass for the site"
```

---

## Self-Review Notes (author)

- **Spec coverage:** Tech/hosting → Tasks 1, 17. Brand tokens → Tasks 1, 3. All 8 pages → Tasks 7–15. Privacy disclosures (90-day retention, compliance webhooks, AES-256-GCM, read scopes, contact) → Task 10, guarded by Task 6 tests. Terms best-effort + governing-law placeholder → Task 11. Support → Task 12. Docs/Dispatches collections + seed content → Tasks 13–15. SEO (sitemap/robots/meta/OG) → Tasks 1, 3, 16. 404 → Task 16. Deploy → Task 17.
- **Intentional placeholders (from spec Open Items, not plan defects):** `[STATE TO BE CONFIRMED]` in terms; `monitorAppStoreUrl` pointing at the App Store root until the listing is live; the logo wordmark placeholder. All are called out for the engineer to leave as-is.
- **Type/name consistency:** `SITE`, `NAV`, `LEGAL_NAV`, `PRICING` exports in `src/data/site.ts` match every import. Collection names `docs`/`dispatches` match `getCollection` calls and folder paths. Entry rendering uses `render(entry)` + `<Content />` consistently in both dynamic routes; `entry.id` used for slugs in both index and `getStaticPaths`.
```
