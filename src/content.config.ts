import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Legal content collection.
 * Markdown files in src/content/legal/ with frontmatter:
 *   title: string
 *   description: string
 *   updated: ISO date string (YYYY-MM-DD)
 *   noindex?: boolean (default false)
 */
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.string(),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { legal };
