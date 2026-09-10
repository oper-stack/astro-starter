import type { APIRoute } from 'astro';
import { SITE, SITE_URL, COLLECTION_KEYS } from '../lib/site';
import { listCollection, isIndexable, urlFor } from '../lib/content';

/**
 * llms.txt, generated from the corpus at build time so it can never drift from the site:
 * a noindex page is never listed, a deleted page disappears, a new page appears.
 */
export const GET: APIRoute = async () => {
  const lines: string[] = [`# ${SITE.name}`, '', `> ${SITE.agentSummary}`, '', `Site: ${SITE_URL}/  `, `Full text of every page: ${SITE_URL}/llms-full.txt`, ''];
  for (const key of COLLECTION_KEYS) {
    const entries = (await listCollection(key)).filter(isIndexable);
    if (!entries.length) continue;
    lines.push(`## ${SITE.collections[key].label}`, '');
    for (const e of entries) lines.push(`- [${e.data.title}](${SITE_URL}${urlFor(key, e)}): ${e.data.description}`);
    lines.push('');
  }
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
