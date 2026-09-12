# OperStack Astro Starter

An Astro starter for content sites that have to rank, be cited by answer engines and convert. It comes with five content collections, an answer-first article layout, data cards for entities, an honest sitemap, a generated `llms.txt`, IndexNow and Google Indexing scripts, twelve Cursor rules, an agent card with a markdown rendition of every page, and the sixteen [OperStack gates](https://www.npmjs.com/package/@operstack/gates) wired in.

Live demo: [demo.oper-stack.com](https://demo.oper-stack.com) (the fictional Isla Verde site, built from this repository with `PREVIEW_NOINDEX=1`).

It ships with a complete fictional demo market, **Isla Verde**: six buyer guides, four district profiles, two comparisons, four project data cards and two news items, every one of which passes all sixteen gates. Replace the market and keep the machinery.

## Quick start

```
git clone https://github.com/oper-stack/astro-starter my-site
cd my-site
npm install
npm run dev
```

Then:

1. Edit `site.config.mjs`. Every name, place, currency, contact detail, navigation entry and the agent summary live there. Nothing else needs to change for the site to become yours.
2. Edit `gates.config.json`: the currency sign to reject, the place names, the sources a figure may cite, the word minimums.
3. Delete the Isla Verde content in `src/content/` and scaffold your own: `npm run new guides "Your first title"`.
4. `npm run verify` before every deploy. It builds and runs the gates with warnings treated as failures.

## What is inside

```
site.config.mjs          the single source of truth for names, places, currency, nav, contact, CTA
gates.config.json        thresholds and allow-lists for the sixteen gates
src/content/             guides, areas, comparisons, projects (data cards), news
src/content.config.ts    the two schemas: articleSchema and entitySchema
src/layouts/             BaseLayout (head, schemas), ArticleLayout, EntityLayout
src/components/          TldrBlock, FaqBlock, Callout, RelatedGuides, AuthorBox, ContactCta,
                         ResponsiveImage, EntryList, Header, Footer, Breadcrumbs
src/pages/               routes per collection, home, about, contact, thanks, privacy, 404,
                         llms.txt, llms-full.txt, robots.txt, .well-known/agent.json and a .md
                         rendition of every page (all generated from the corpus)
src/lib/                 site, content (listing, related, reading time), schema (JSON-LD), images
scripts/                 new-page (scaffold), indexnow, google-indexing, build helpers
templates/               one MDX skeleton per collection, used by npm run new
.cursor/rules/           twelve rules for Cursor; CLAUDE.md and AGENTS.md for other agents
```

## The content model

| Collection | Schema | Layout | Job |
|---|---|---|---|
| guides | article | ArticleLayout | answer one buying question end to end |
| areas | article | ArticleLayout | what a place costs and who belongs there |
| comparisons | article | ArticleLayout | two options, verdict first |
| projects | entity | EntityLayout | facts about one building from named sources |
| news | article | ArticleLayout | one change, its date, its effect |

Add a collection by registering it in three places: `src/content.config.ts`, `site.config.mjs` (`collections` and `nav`), and a pair of routes in `src/pages/<name>/` copied from an existing collection. The sitemap, `llms.txt` and the gates follow the config.

Frontmatter fields every page uses: `title`, `description`, `pubDate`, `updatedDate`, `author`, `tags`, `heroImage`, `heroAlt`, `faq` (list of question and answer), `relatedSlugs`, `noindex`, `draft`, `route`. Entity cards add `name`, `developer`, `district`, `status`, `completionYear`, `unitsTotal`, `priceFrom`, `currency`, `sources`.

## What the layout does for you

- Title suffix only when the whole title still fits 60 characters. Canonical with a trailing slash. `noindex` pages keep `follow`.
- Organization and WebSite schema from the config on every page; Breadcrumb, Article and FAQPage schema on articles; Place schema on entity cards. FAQ schema is emitted once, by the layout, never by the component.
- `llms.txt` lists every indexable page by collection with its description; `llms-full.txt` carries the full text. Both are endpoints, rebuilt on every build, so gate 14 can never find drift.
- The sitemap carries a real `lastmod` from frontmatter or none at all, and excludes `noindex`, `draft`, the thank-you page and every redirect source in `vercel.json`.
- Light and dark themes from one token set in `src/styles/global.css`. Change `--accent` and `--paper` and the site follows.
- Mobile: 44 px targets, a menu that closes on Escape and traps scroll, tables that scroll inside their container, reduced motion respected.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | local server with hot reload |
| `npm run build` | static build into `dist/` |
| `npm run gates` | run the sixteen gates on the source and the build |
| `npm run verify` | build, then gates with `--fail-on warn` |
| `npm run new <collection> "<title>"` | scaffold a page from `templates/<collection>.mdx` |
| `npm run indexnow` | submit the built sitemap's URLs to IndexNow (needs `INDEXNOW_KEY`) |
| `npm run index:google URL ...` | notify the Google Indexing API (needs a service-account key for this site's own project) |

## Deploy

The build is static. Any host that serves a folder works.

- **Vercel:** import the repo, framework preset Astro. `vercel.json` already sets `trailingSlash: true` and holds the redirects the gates read.
- **Netlify:** build command `npm run build`, publish directory `dist`. Move redirects to `_redirects` if you prefer, and point `redirectsFile` in `gates.config.json` at a JSON export of them.
- **Cloudflare Pages:** build command `npm run build`, output `dist`.

Set `site.url` in `site.config.mjs` to the production origin before the first deploy; the canonical, the sitemap and `llms.txt` use it.

## The gates in CI

```yaml
- run: npm ci
- run: npm run build
- run: npx @operstack/gates --fail-on warn
```

Run the build first so gate 08 checks the real HTML and gate 14 reads the generated `dist/llms.txt`.

## Working with Cursor or Claude Code

The rules in `.cursor/rules/` are written for this starter and carry `{{PLACEHOLDERS}}` in the site passport; fill them in when you edit `site.config.mjs`. `CLAUDE.md` gives Claude Code the same map. The rules tell the model what the gates will reject, so the model stops producing it.

## The demo market

Isla Verde does not exist. Every district, project, developer, price, fee, rule and statistic on the demo pages was invented so the template could show what a complete, gate-passing corpus looks like. Do not reuse any figure from it on a real site.

## License

MIT. Built by OperStack.

## Preview and demo deploys

Two build-time variables keep a staging or demo copy out of search engines without touching the config:

- `SITE_URL=https://demo.example.com` overrides `url` in `site.config.mjs`, so canonicals, the sitemap and schema point at the preview host.
- `PREVIEW_NOINDEX=1` marks every page `noindex` and drops the canonical tags. robots.txt stays open on purpose: link previews (Slack, LinkedIn, Upwork) still read the page and its social image, and crawlers see the noindex instead of a wall.

The public demo of this starter runs with both set. Production builds set neither.

## Social preview image

Every page points `og:image` at `public/og-default.png` (1200 by 630). The shipped file is the Isla Verde demo card: replace it with your own before launch, or set `ogImage` per page in the layouts.
