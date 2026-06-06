/**
 * Dynamic sitemap.xml generator.
 * Lists every public page on the site with its last-modified date and
 * relative priority. Referenced by robots.txt and search engines.
 */
import type { APIRoute } from 'astro';
import { SITE } from '../consts';

const pages: Array<{
  loc: string;
  lastmod?: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}> = [
  { loc: '/', changefreq: 'monthly', priority: 1.0 },
  { loc: '/services', changefreq: 'monthly', priority: 0.8 },
  { loc: '/about', changefreq: 'monthly', priority: 0.7 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.9 },
  { loc: '/checklist', changefreq: 'monthly', priority: 0.9 },
  { loc: '/waitlist', changefreq: 'monthly', priority: 0.8 },
  { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
  { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${SITE.url}${p.loc}</loc>
    <lastmod>${p.lastmod ?? lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
