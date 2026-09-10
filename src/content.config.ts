import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faq = z.array(z.object({ question: z.string(), answer: z.string() })).default([]);

/** Editorial pages: guides, districts, comparisons, news. */
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  faq,
  relatedSlugs: z.array(z.string()).default([]),
  noindex: z.boolean().default(false),
  draft: z.boolean().default(false),
  /** Override the URL derived from the collection and the file name. */
  route: z.string().optional(),
});

/** Entity cards: a building, a developer, a product. Facts from named sources, no editorial claims. */
const entitySchema = articleSchema.extend({
  name: z.string(),
  developer: z.string().optional(),
  district: z.string().optional(),
  status: z.enum(['off-plan', 'under-construction', 'completed']).optional(),
  completionYear: z.number().optional(),
  unitsTotal: z.number().optional(),
  priceFrom: z.number().optional(),
  currency: z.string().optional(),
  /** Where each fact came from and when it was read. */
  sources: z.array(z.object({ url: z.string(), date: z.coerce.date(), label: z.string().optional() })).default([]),
});

const article = (dir: string) => defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}` }), schema: articleSchema });

export const collections = {
  guides: article('guides'),
  areas: article('areas'),
  comparisons: article('comparisons'),
  news: article('news'),
  projects: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }), schema: entitySchema }),
};
