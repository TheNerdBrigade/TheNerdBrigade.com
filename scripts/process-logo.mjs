// Generates the site's logo asset set from the master badge illustration.
// Removes the baked-in dark navy/purple background so the emblem is transparent
// and blends with the site background.
// Run: node scripts/process-logo.mjs
import sharp from 'sharp';

const SRC = 'src/assets/brand/nerd-brigade-badge.png';
// Tight crop of the badge: removes side margins, the "A1: ..." caption, and the stray sparkle.
const CROP = { left: 824, top: 187, width: 1170, height: 1205 };
const INK = '#16121f';

// 1) Crop, then key out the background. The background is dark and blue-dominant
//    (B is the max channel, low brightness). Every artwork pixel is either bright
//    or red/green-dominant, so this predicate only erases the background.
const { data, info } = await sharp(SRC)
  .extract(CROP)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info; // channels === 4
for (let p = 0; p < width * height; p++) {
  const i = p * channels;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (b < 85 && b > r + 6 && b > g + 10) {
    data[i + 3] = 0; // transparent
  }
}
// Rebuild and trim the now-transparent border to a tight emblem.
const keyed = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
const emblem = await sharp(keyed).trim().png().toBuffer();

// 2) Web badge (hero / about) and small nav mark — transparent.
await sharp(emblem).resize({ width: 1000 }).png().toFile('public/badge.png');
await sharp(emblem).resize({ height: 72 }).png().toFile('public/badge-nav.png');

// 3) Favicons / app icons (square, flattened onto the ink background so iOS/tabs
//    don't render a transparent/black tile).
const icon = (size, out) =>
  sharp(emblem)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .flatten({ background: INK })
    .png()
    .toFile(out);
await icon(32, 'public/favicon-32.png');
await icon(180, 'public/apple-touch-icon.png');
await icon(512, 'public/icon-512.png');

// 4) Open Graph image: emblem (transparent) on the dark gradient + tagline/URL.
const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><radialGradient id="g" cx="28%" cy="0%" r="90%">
    <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#g)"/>
</svg>`;
const textOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" font-family="Arial, sans-serif">
  <text x="700" y="290" font-size="46" font-weight="800" fill="#f8fafc">Tools that guard</text>
  <text x="700" y="346" font-size="46" font-weight="800" fill="#fde68a">your store.</text>
  <text x="700" y="408" font-size="24" font-weight="600" fill="#c4b5fd">24/7 Shopify storefront monitoring &amp; more.</text>
  <text x="700" y="474" font-size="23" font-weight="700" letter-spacing="2" fill="#22d3ee">thenerdbrigade.com</text>
</svg>`;
const ogBadge = await sharp(emblem).resize({ height: 480 }).png().toBuffer();
await sharp(Buffer.from(bg))
  .composite([{ input: ogBadge, left: 120, top: 75 }, { input: Buffer.from(textOverlay), left: 0, top: 0 }])
  .png()
  .toFile('public/og.png');

console.log('Logo assets generated (transparent emblem): badge.png, badge-nav.png, favicon-32.png, apple-touch-icon.png, icon-512.png, og.png');
