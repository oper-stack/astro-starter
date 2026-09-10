// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import site from './site.config.mjs';
import { collectSitemapExclusions, pageIsExcluded } from './scripts/lib/sitemap-exclusions.mjs';
import { buildContentLastmodMap } from './scripts/lib/content-lastmod.mjs';
import { rehypeDemoteH1 } from './scripts/rehype-demote-h1.mjs';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const SITE = site.url.replace(/\/$/, '');
const COLLECTIONS = Object.keys(site.collections);
const EXCLUDED = collectSitemapExclusions(ROOT, COLLECTIONS);
const LASTMOD = buildContentLastmodMap(ROOT, COLLECTIONS);

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: { plugins: [tailwindcss()] },
  // The layout renders the H1; a # heading in a body is demoted to H2. MDX inherits this processor.
  markdown: { processor: unified({ rehypePlugins: [rehypeDemoteH1] }) },
  integrations: [
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      entryLimit: 50000,
      filter: (page) => !pageIsExcluded(page, SITE, EXCLUDED),
      serialize(item) {
        // A real per-page date from frontmatter, or no lastmod at all. Stamping the build
        // date on every URL teaches crawlers to ignore the field.
        const date = LASTMOD.get(item.url.replace(SITE, ''));
        if (date) item.lastmod = date; else delete item.lastmod;
        if (item.url === `${SITE}/`) return { ...item, priority: 1.0, changefreq: 'daily' };
        return item;
      },
    }),
  ],
});
