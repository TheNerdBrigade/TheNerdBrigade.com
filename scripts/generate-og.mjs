import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="75%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#16121f"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(600,250)" text-anchor="middle" font-family="Arial, sans-serif">
    <rect x="-66" y="-150" width="132" height="132" rx="26" fill="#7c3aed"/>
    <text x="0" y="-60" text-anchor="middle" font-family="monospace" font-size="74" font-weight="700" fill="#fde68a">NB</text>
    <text x="0" y="60" font-size="96" font-weight="800" fill="#f8fafc">NERD <tspan fill="#fde68a">BRIGADE</tspan></text>
    <text x="0" y="130" font-size="38" font-weight="600" fill="#c4b5fd">Tools that guard your store.</text>
    <text x="0" y="250" font-size="28" font-weight="700" letter-spacing="2" fill="#22d3ee">thenerdbrigade.com</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('Wrote public/og.png');
