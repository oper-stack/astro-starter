import type { APIRoute } from 'astro';
import { SITE_URL, PREVIEW_NOINDEX } from '../lib/site';

const lines = PREVIEW_NOINDEX
  ? ['User-agent: *', 'Disallow: /', '']
  : ['User-agent: *', 'Allow: /', 'Disallow: /thanks/', '', `Sitemap: ${SITE_URL}/sitemap-index.xml`, ''];

export const GET: APIRoute = () =>
  new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
