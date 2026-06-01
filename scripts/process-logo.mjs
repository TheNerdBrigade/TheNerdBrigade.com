// Generates the site's logo asset set from the master badge illustration.
// Run: node scripts/process-logo.mjs
import sharp from 'sharp';

const SRC = 'src/assets/brand/nerd-brigade-badge.png';
// Tight crop of the badge: removes side margins, the "A1: ..." caption, and the stray sparkle.
const CROP = { left: 824, top: 187, width: 1170, height: 1205 };

const badge = await sharp(SRC).extract(CROP).png().toBuffer();

// Web badge (hero / about), capped for retina.
await sharp(badge).resize({ width: 1000 }).png().toFile('public/badge.png');

// Small nav mark (72px ~= 36px @2x).
await sharp(badge).resize({ height: 72 }).png().toFile('public/badge-nav.png');

// Favicons / app icons (square, padded onto the ink background).
const square = (size, out) =>
  sharp(badge).resize(size, size, { fit: 'contain', background: '#16121f' }).png().toFile(out);
await square(32, 'public/favicon-32.png');
await square(180, 'public/apple-touch-icon.png');
await square(512, 'public/icon-512.png');

// Open Graph image: badge on the left, tagline + URL on the right.
const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><radialGradient id="g" cx="28%" cy="0%" r="90%">
    <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="#16121f"/>
  <rect width="1200" height="630" fill="url(#g)"/>
</svg>`;
const textOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" font-family="Arial, sans-serif">
  <text x="700" y="290" font-size="46" font-weight="800" fill="#f8fafc">Tools that guard</text>
  <text x="700" y="346" font-size="46" font-weight="800" fill="#fde68a">your store.</text>
  <text x="700" y="408" font-size="24" font-weight="600" fill="#c4b5fd">24/7 Shopify storefront monitoring &amp; more.</text>
  <text x="700" y="474" font-size="23" font-weight="700" letter-spacing="2" fill="#22d3ee">thenerdbrigade.com</text>
</svg>`;
const ogBadge = await sharp(badge).resize({ height: 470 }).png().toBuffer();
await sharp(Buffer.from(bg))
  .composite([{ input: ogBadge, left: 110, top: 80 }, { input: Buffer.from(textOverlay), left: 0, top: 0 }])
  .png()
  .toFile('public/og.png');

console.log('Logo assets generated: badge.png, badge-nav.png, favicon-32.png, apple-touch-icon.png, icon-512.png, og.png');
