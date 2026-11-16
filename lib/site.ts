// Public origin used for canonical URLs, the sitemap, and social previews.
// Set SITE_URL to override. On Vercel the project's production domain is
// picked up automatically, so preview deployments also point at production.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')
).replace(/\/+$/, '');

export const SITE_NAME = 'Ritli';

export const SITE_TITLE = 'Ritli — Focus Timer & Task Planner for iPhone';

export const SITE_DESCRIPTION =
  'Ritli is a focus timer and task planner for iPhone. Run focus sessions with breaks, plan tasks by category, and see where your time goes. Join the beta on TestFlight.';

export const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Ritli — a little focus, a lot forward. Focus timer and task planner for iPhone.',
};
