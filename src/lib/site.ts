import config from '../../site.config.mjs';

export const SITE = config;
export const SITE_URL = config.url.replace(/\/$/, '');
export type CollectionKey = keyof typeof config.collections;
export const COLLECTION_KEYS = Object.keys(config.collections) as CollectionKey[];

/** Absolute URL with a trailing slash, the only form the site emits. */
export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const withSlash = p.includes('.') || p.endsWith('/') ? p : `${p}/`;
  return `${SITE_URL}${withSlash}`;
}

/** Title with the brand suffix only when the whole thing still fits a search result. */
export function pageTitle(title: string, limit = 60): string {
  const suffix = ` | ${config.shortName}`;
  if (title.includes(config.shortName)) return title;
  return title.length + suffix.length <= limit ? `${title}${suffix}` : title;
}
