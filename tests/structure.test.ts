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
