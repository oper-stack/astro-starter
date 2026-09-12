import type { APIRoute } from 'astro';
import { SITE, SITE_URL } from '../lib/site';
import { listAll, isIndexable, urlFor, bodyToMarkdown } from '../lib/content';

/**
 * Markdown-версия каждой страницы: /guides/buying-costs/ отдаётся ещё и как
 * /guides/buying-costs.md
 *
 * Простым языком: то же самое, что человек читает на странице, но без меню, кнопок, картинок
 * и оформления. Программа, которая собирает ответ для ИИ, получает готовый текст вместо того,
 * чтобы выковыривать его из вёрстки и на этом ошибаться. Читателю ничего не меняется: он
 * по-прежнему открывает обычную страницу.
 *
 * Технически: файл собирается из того же тела записи, что рисует страницу, поэтому разойтись
 * они не могут. Страница, закрытая от индексации, копии не получает. В шапке идут заголовок,
 * описание, адрес оригинала и дата обновления: это то, по чему агент отличает свежее от
 * старого и ссылается на источник.
 */
export async function getStaticPaths() {
  const all = await listAll();
  return all.filter(({ entry }) => isIndexable(entry)).map(({ collection, entry }) => ({
    params: { path: urlFor(collection, entry).replace(/^\/|\/$/g, '') },
    props: { collection, entry },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { collection, entry } = props as any;
  const d = entry.data;
  const url = `${SITE_URL}${urlFor(collection, entry)}`;
  const lines: string[] = [
    `# ${d.title}`,
    '',
    `> ${d.description}`,
    '',
    `Source: ${url}  `,
    `Section: ${SITE.collections[collection].label}  `,
    `Updated: ${(d.updatedDate ?? d.pubDate).toISOString().slice(0, 10)}`,
    '',
    bodyToMarkdown(entry.body ?? ''),
    '',
  ];
  if (d.faq?.length) {
    lines.push('## FAQ', '');
    for (const f of d.faq) lines.push(`### ${f.question}`, '', f.answer, '');
  }
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
