// Public origin used for canonical URLs, the sitemap, and social previews.
// Set SITE_URL to override. On Vercel the project's production domain is
// picked up automatically, so preview deployments also point at production.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')
).replace(/\/+$/, '');

export const SITE_NAME = 'Ritli';

export const SITE_TITLE = 'Ritli: a calm focus timer for iPhone';

export const SITE_DESCRIPTION =
  'Pick one thing and give it 25 minutes. Ritli is a focus timer for iPhone with tasks, real breaks, a Lock Screen timer and clear weekly stats. Download it on the App Store.';

export const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Ritli: pick one thing, give it 25 minutes. A calm focus timer for iPhone.',
};
