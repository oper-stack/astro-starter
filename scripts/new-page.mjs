#!/usr/bin/env node
/**
 * Scaffold a page from a template with the frontmatter filled in.
 *
 *   node scripts/new-page.mjs guides "Buying land on Isla Verde as a foreigner"
 *   node scripts/new-page.mjs projects "Marina Towers" --district "Playa Norte"
 *
 * Templates live in templates/<collection>.mdx. {{TITLE}}, {{SLUG}}, {{DATE}}, {{AUTHOR}} and
 * {{MARKET}} are replaced; every other {{PLACEHOLDER}} is left for the writer and will fail
 * gate 04 until it is written, which is the point.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = (await import(resolve(root, 'site.config.mjs'))).default;
const [collection, title, ...rest] = process.argv.slice(2);
if (!collection || !title) { console.error('usage: node scripts/new-page.mjs <collection> "<title>" [--district X]'); process.exit(2); }
if (!site.collections[collection]) { console.error(`unknown collection "${collection}"; known: ${Object.keys(site.collections).join(', ')}`); process.exit(2); }
const opt = (k) => { const i = rest.indexOf(k); return i === -1 ? '' : rest[i + 1] ?? ''; };
const slug = title.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
const tpl = resolve(root, 'templates', `${collection}.mdx`);
if (!existsSync(tpl)) { console.error(`no template at templates/${collection}.mdx`); process.exit(2); }
const out = resolve(root, 'src/content', collection, `${slug}.mdx`);
if (existsSync(out)) { console.error(`exists: ${out}`); process.exit(1); }
const text = readFileSync(tpl, 'utf8')
  .replace(/\{\{TITLE\}\}/g, title)
  .replace(/\{\{SLUG\}\}/g, slug)
  .replace(/\{\{DATE\}\}/g, new Date().toISOString().slice(0, 10))
  .replace(/\{\{AUTHOR\}\}/g, site.editorial.author)
  .replace(/\{\{MARKET\}\}/g, site.market.name)
  .replace(/\{\{CURRENCY\}\}/g, site.market.currency)
  .replace(/\{\{DISTRICT\}\}/g, opt('--district'));
writeFileSync(out, text);
console.log(`created src/content/${collection}/${slug}.mdx`);
console.log('next: write every {{...}} placeholder, then run: npx @operstack/gates --only 1,2,3,4,7');
