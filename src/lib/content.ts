import { getCollection, type CollectionEntry } from 'astro:content';
import { COLLECTION_KEYS, type CollectionKey } from './site';

export type AnyEntry = CollectionEntry<CollectionKey>;

export function urlFor(collection: string, entry: { id: string; data: { route?: string } }): string {
  return entry.data.route ?? `/${collection}/${entry.id}/`;
}

export function isPublic(entry: AnyEntry): boolean {
  return !entry.data.draft;
}

export function isIndexable(entry: AnyEntry): boolean {
  return !entry.data.draft && !entry.data.noindex;
}

/** Every public entry of one collection, newest first. */
export async function listCollection(collection: CollectionKey): Promise<AnyEntry[]> {
  const entries = (await getCollection(collection)) as AnyEntry[];
  return entries.filter(isPublic).sort((a, b) => {
    const byIndexable = Number(!isIndexable(a)) - Number(!isIndexable(b));
    if (byIndexable !== 0) return byIndexable;
    return (b.data.updatedDate ?? b.data.pubDate).valueOf() - (a.data.updatedDate ?? a.data.pubDate).valueOf();
  });
}

export async function listAll(): Promise<{ collection: CollectionKey; entry: AnyEntry }[]> {
  const out: { collection: CollectionKey; entry: AnyEntry }[] = [];
  for (const collection of COLLECTION_KEYS) {
    for (const entry of await listCollection(collection)) out.push({ collection, entry });
  }
  return out;
}

export interface RelatedLink { title: string; href: string; description?: string }

/** Curated relatedSlugs first, then pages sharing the most tags, up to `limit`. Never noindex pages, never itself. */
export function relatedFor(
  current: { id: string; collection: string; tags: string[]; relatedSlugs: string[] },
  all: { collection: CollectionKey; entry: AnyEntry }[],
  limit = 5,
): RelatedLink[] {
  const pool = all.filter(({ entry }) => isIndexable(entry) && entry.id !== current.id);
  const link = ({ collection, entry }: { collection: CollectionKey; entry: AnyEntry }): RelatedLink => ({
    title: entry.data.title, href: urlFor(collection, entry), description: entry.data.description,
  });
  const curated = current.relatedSlugs
    .map((slug) => pool.find(({ entry }) => entry.id === slug))
    .filter((x): x is { collection: CollectionKey; entry: AnyEntry } => Boolean(x))
    .map(link);
  const seen = new Set(curated.map((l) => l.href));
  const scored = pool
    .map((item) => ({ item, score: item.entry.data.tags.filter((t: string) => current.tags.includes(t)).length + (item.collection === current.collection ? 0.5 : 0) }))
    .filter(({ item, score }) => score > 0 && !seen.has(urlFor(item.collection, item.entry)))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => link(item));
  return [...curated, ...scored].slice(0, limit);
}

export function readingTime(body: string): number {
  const words = (body.replace(/^import\s.+$/gm, ' ').replace(/<[^>]+>/g, ' ').match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
  return Math.max(1, Math.round(words / 220));
}

/** Markdown body reduced to plain text for llms-full.txt and the .md renditions. */
export function bodyToMarkdown(body: string): string {
  return body
    .replace(/^import\s.+$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/<TldrBlock[^>]*>([\s\S]*?)<\/TldrBlock>/g, '**In short:** $1')
    .replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g, '')
    .replace(/<([A-Z][A-Za-z0-9]*)[^>]*>([\s\S]*?)<\/\1>/g, '$2')
    .replace(/<\/?[a-z][^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
