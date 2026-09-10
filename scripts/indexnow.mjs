#!/usr/bin/env node
/**
 * Submit URLs to IndexNow (Bing, and every engine that shares the protocol).
 *
 *   INDEXNOW_KEY=... node scripts/indexnow.mjs            every indexable page from the build's sitemap
 *   INDEXNOW_KEY=... node scripts/indexnow.mjs URL URL     only these URLs
 *
 * The key must also be served at https://<host>/<key>.txt: put a file with the key as its
 * content in public/<key>.txt. Set INDEXNOW_ENDPOINT to https://www.bing.com/indexnow to
 * submit to Bing alone instead of the shared api.indexnow.org endpoint.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = (await import(resolve(root, 'site.config.mjs'))).default;
const key = process.env.INDEXNOW_KEY;
if (!key) { console.error('INDEXNOW_KEY is not set (see .env.example)'); process.exit(2); }
const host = new URL(site.url).host;
const explicit = process.argv.slice(2).filter((a) => /^https?:\/\//.test(a));

function urlsFromSitemaps() {
  const urls = new Set();
  const read = (file) => {
    const p = resolve(root, 'dist', file);
    if (!existsSync(p)) return;
    const xml = readFileSync(p, 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const u = m[1].trim();
      if (u.endsWith('.xml')) read(u.replace(site.url.replace(/\/$/, ''), '').replace(/^\//, '')); else urls.add(u);
    }
  };
  read('sitemap-index.xml');
  return [...urls];
}

const urlList = explicit.length ? explicit : urlsFromSitemaps();
if (!urlList.length) { console.error('no URLs: run the build first, or pass URLs explicitly'); process.exit(2); }
const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const res = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urlList.slice(0, 10000) }),
});
console.log(`${endpoint}: HTTP ${res.status} for ${urlList.length} URL(s)`);
if (res.status >= 400) { console.log(await res.text()); process.exit(1); }
