# Working on this site with Claude Code

This is an Astro content site built on the OperStack starter. Read `.cursor/rules/01-site-passport.mdc`, `11-engineering-principles.mdc` and `12-definition-of-done.mdc` first; they apply to every task. The other rules in `.cursor/rules/` apply by topic and are short.

## Commands

```
npm run dev              # local server
npm run build            # static build into dist/
npm run gates            # the sixteen content gates (npx @operstack/gates)
npm run verify           # build, then gates with warnings treated as failures
npm run new guides "Title"   # scaffold a page from templates/guides.mdx
npm run indexnow         # submit the sitemap to IndexNow (needs INDEXNOW_KEY)
```

## Where things live

- `site.config.mjs`: every name, place, currency, contact and navigation entry. Components read it; never hard-code these.
- `src/content/<collection>/`: MDX pages. Schema in `src/content.config.ts`.
- `src/layouts/`: BaseLayout (head, schemas, header, footer), ArticleLayout (editorial pages), EntityLayout (data cards).
- `src/components/`: TldrBlock, FaqBlock, Callout, RelatedGuides, AuthorBox, ContactCta, ResponsiveImage, EntryList, Header, Footer, Breadcrumbs.
- `src/pages/`: routes; `llms.txt.ts`, `llms-full.txt.ts` and `robots.txt.ts` are generated endpoints.
- `scripts/`: page scaffolder, IndexNow, Google Indexing API, build helpers.
- `gates.config.json`: thresholds and allow-lists for the gates.

## Definition of done

`npm run build` and `npm run verify` exit 0. Report in three lines: what changed, deployed yes or no, which checks passed. Never commit, push, deploy or submit for indexing unless the owner said so in the current task.
