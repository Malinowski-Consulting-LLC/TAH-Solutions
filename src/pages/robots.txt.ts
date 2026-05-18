/**
 * Dynamic robots.txt generator.
 * Allows all crawlers, references sitemap and llms.txt.
 */
import type { APIRoute } from 'astro';
import { SITE } from '../consts';

export const GET: APIRoute = () => {
  const text = `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml

# LLM-friendly site info
# See https://llmstxt.org for the proposed standard
`;

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
