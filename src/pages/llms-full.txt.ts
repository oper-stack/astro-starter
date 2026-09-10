import type { APIRoute } from 'astro';
import { SITE, SITE_URL, COLLECTION_KEYS } from '../lib/site';
import { listCollection, isIndexable, urlFor, bodyToMarkdown } from '../lib/content';

/** Every indexable page as plain markdown in one file, for agents that read once and retrieve later. */
export const GET: APIRoute = async () => {
  const parts: string[] = [`# ${SITE.name}: full text`, '', SITE.agentSummary, ''];
  for (const key of COLLECTION_KEYS) {
    for (const e of (await listCollection(key)).filter(isIndexable)) {
      const d = e.data;
      parts.push('---', '', `# ${d.title}`, '', `> ${d.description}`, '', `Source: ${SITE_URL}${urlFor(key, e)}  `, `Section: ${SITE.collections[key].label}  `, `Updated: ${(d.updatedDate ?? d.pubDate).toISOString().slice(0, 10)}`, '', bodyToMarkdown(e.body ?? ''), '');
      if (d.faq?.length) { parts.push('## FAQ', ''); for (const f of d.faq) parts.push(`### ${f.question}`, '', f.answer, ''); }
    }
  }
  return new Response(parts.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
