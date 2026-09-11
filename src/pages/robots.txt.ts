import type { APIRoute } from 'astro';
import { SITE_URL, PREVIEW_NOINDEX } from '../lib/site';

// Preview builds stay crawlable in robots.txt: the noindex meta on every page keeps them out of
// search results, while link unfurlers (Slack, LinkedIn, Upwork) can still read the page and its
// social image. A blanket Disallow would hide the noindex from crawlers and block the previews.
const lines = PREVIEW_NOINDEX
  ? ['# preview build: every page carries noindex', 'User-agent: *', 'Allow: /', '']
  : ['User-agent: *', 'Allow: /', 'Disallow: /thanks/', '', `Sitemap: ${SITE_URL}/sitemap-index.xml`, ''];

export const GET: APIRoute = () =>
  new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
