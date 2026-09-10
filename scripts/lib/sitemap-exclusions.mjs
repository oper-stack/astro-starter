import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Paths that must never appear in the sitemap: noindex or draft pages, thank-you pages, redirect sources. */
export function collectSitemapExclusions(root, collections) {
  const paths = new Set(['/thanks/', '/404/', '/privacy/']);
  for (const dir of collections) {
    const contentDir = join(root, 'src/content', dir);
    if (!existsSync(contentDir)) continue;
    for (const file of readdirSync(contentDir)) {
      if (!/\.mdx?$/.test(file)) continue;
      const src = readFileSync(join(contentDir, file), 'utf8');
      const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      if (/^(noindex|draft):\s*true\s*$/m.test(fm)) paths.add(`/${dir}/${file.replace(/\.mdx?$/, '')}/`);
    }
  }
  const vercelPath = join(root, 'vercel.json');
  if (existsSync(vercelPath)) {
    try {
      for (const rule of JSON.parse(readFileSync(vercelPath, 'utf8')).redirects ?? []) {
        if (!rule.source || /[:*()]/.test(rule.source)) continue;
        paths.add(rule.source.replace(/\{\/\}\?$/, '').replace(/\/?$/, '/'));
      }
    } catch { /* invalid json is reported by the gates, not here */ }
  }
  return [...paths].sort();
}

export function pageIsExcluded(pageUrl, site, excluded) {
  const path = (pageUrl.replace(site, '').replace(/\/$/, '') || '/') + '/';
  return excluded.includes(path === '//' ? '/' : path);
}
