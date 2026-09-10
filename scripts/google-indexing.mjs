#!/usr/bin/env node
/**
 * Google Indexing API: notify Google of new or updated URLs.
 *
 *   GOOGLE_INDEXING_KEY_FILE=./google-indexing-key.json node scripts/google-indexing.mjs URL URL ...
 *   node scripts/google-indexing.mjs --from-sitemap --limit 200
 *
 * Needs a service account with the Indexing API enabled, created in a Cloud project that
 * belongs to THIS site, and added as an owner of the property in Search Console. The daily
 * quota (200 by default) is per project, so never share one key between sites.
 * Requires: npm i -D google-auth-library
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = (await import(resolve(root, 'site.config.mjs'))).default;
const keyFile = resolve(root, process.env.GOOGLE_INDEXING_KEY_FILE || 'google-indexing-key.json');
if (!existsSync(keyFile)) { console.error(`service-account key not found at ${keyFile} (see .env.example)`); process.exit(2); }
let GoogleAuth;
try { ({ GoogleAuth } = await import('google-auth-library')); }
catch { console.error('install the client first: npm i -D google-auth-library'); process.exit(2); }

const args = process.argv.slice(2);
const limit = Number(args[args.indexOf('--limit') + 1]) || 200;
let urls = args.filter((a) => /^https?:\/\//.test(a));
if (args.includes('--from-sitemap')) {
  const p = resolve(root, 'dist/sitemap-0.xml');
  if (!existsSync(p)) { console.error('run the build first'); process.exit(2); }
  urls = [...readFileSync(p, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).slice(0, limit);
}
if (!urls.length) { console.error('no URLs given'); process.exit(2); }

const auth = new GoogleAuth({ keyFile, scopes: ['https://www.googleapis.com/auth/indexing'] });
const client = await auth.getClient();
let ok = 0;
for (const url of urls) {
  if (!url.startsWith(site.url.replace(/\/$/, ''))) { console.log(`skip (not this site): ${url}`); continue; }
  const res = await client.request({ url: 'https://indexing.googleapis.com/v3/urlNotifications:publish', method: 'POST', data: { url, type: 'URL_UPDATED' } }).catch((e) => ({ status: e.response?.status ?? 0, data: e.message }));
  if (res.status === 200) ok++;
  console.log(`${res.status} ${url}`);
}
console.log(`${ok}/${urls.length} accepted`);
