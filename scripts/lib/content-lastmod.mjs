import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Map of "/collection/slug/" to "YYYY-MM-DD" from each page's own updatedDate or pubDate. */
export function buildContentLastmodMap(root, collections) {
  const map = new Map();
  for (const dir of collections) {
    const contentDir = join(root, 'src/content', dir);
    if (!existsSync(contentDir)) continue;
    for (const file of readdirSync(contentDir)) {
      if (!/\.mdx?$/.test(file)) continue;
      const raw = readFileSync(join(contentDir, file), 'utf8');
      const date = /^updatedDate:\s*["']?(\d{4}-\d{2}-\d{2})/m.exec(raw)?.[1] || /^pubDate:\s*["']?(\d{4}-\d{2}-\d{2})/m.exec(raw)?.[1];
      if (date) map.set(`/${dir}/${file.replace(/\.mdx?$/, '')}/`, date);
    }
  }
  return map;
}
