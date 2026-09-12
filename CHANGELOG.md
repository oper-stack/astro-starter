# Changelog

## 0.2.0 (2026-09-11)

- Agent surface: `/.well-known/agent.json` and a markdown rendition of every indexable page
  (`/guides/slug.md`), both generated from the corpus so they cannot drift from the site. Each
  page's `<head>` links its own rendition. Gate 16 now passes on the demo: 16 of 16.

## 0.1.0 (2026-09-10)

First release.

- Five collections (guides, areas, comparisons, projects, news) with two schemas.
- BaseLayout with title-fit rule, canonical, Organization and WebSite schema; ArticleLayout with Breadcrumb, Article and FAQPage schema; EntityLayout for data cards with Place schema and a sources list.
- Generated `llms.txt`, `llms-full.txt` and `robots.txt`; sitemap with honest `lastmod` and exclusions for noindex, draft and redirect sources.
- Components: TldrBlock, FaqBlock, Callout, RelatedGuides, AuthorBox, ContactCta, ResponsiveImage, EntryList, Header, Footer, Breadcrumbs.
- Scripts: page scaffolder with per-collection templates, IndexNow, Google Indexing API, build helpers.
- Twelve Cursor rules, CLAUDE.md and AGENTS.md.
- Fictional demo market Isla Verde: 18 pages that pass all fifteen OperStack gates.
