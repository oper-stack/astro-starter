import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/site';

export const GET: APIRoute = () =>
  new Response(['User-agent: *', 'Allow: /', 'Disallow: /thanks/', '', `Sitemap: ${SITE_URL}/sitemap-index.xml`, ''].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
