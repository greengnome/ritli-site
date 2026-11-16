// Writes robots.txt and sitemap.xml into the static export. Vinext's export
// mode only copies static metadata files, and these need the deploy-time
// origin from lib/site.ts, so they are generated after the build.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const { SITE_URL } = await import('../lib/site.ts');

const OUT_DIR = join(import.meta.dirname, '..', 'dist', 'client');

const PAGES = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

await mkdir(OUT_DIR, { recursive: true });
await writeFile(join(OUT_DIR, 'sitemap.xml'), sitemap);
await writeFile(join(OUT_DIR, 'robots.txt'), robots);
console.log(`Wrote robots.txt and sitemap.xml for ${SITE_URL}`);
