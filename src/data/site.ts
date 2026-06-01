export const SITE = {
  name: 'The Nerd Brigade',
  tagline: 'An elite brigade of nerds, building tools that guard your store.',
  url: 'https://thenerdbrigade.com',
  contactEmail: 'TheNerd@thenerdbrigade.com',
  // TODO: replace with the live Monitor App Store listing URL once approved.
  monitorAppStoreUrl: 'https://apps.shopify.com/',
  // Fixed brand/founding year (used for "EST." and copyright). Bump if desired.
  year: 2026,
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
