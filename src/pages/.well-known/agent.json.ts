import type { APIRoute } from 'astro';
import { SITE, SITE_URL, PREVIEW_NOINDEX } from '../../lib/site';

/**
 * The agent card at /.well-known/agent.json.
 *
 * Простым языком: это визитка сайта для программ, а не для людей. Когда ИИ-агент впервые
 * приходит на домен, ему негде спросить «что это за сайт и чем он может быть полезен»:
 * он может только скачать главную и догадываться. Карточка отвечает на этот вопрос одним
 * коротким файлом, и отвечает нашими словами, а не его догадкой.
 *
 * Технически: карточка собирается из site.config.mjs на сборке, поэтому не может разойтись
 * с сайтом. Стандарт ранний и ещё меняется, поэтому здесь только то, что читают все версии:
 * имя, описание, адрес, язык, издатель и указатели на llms.txt и карту сайта. Ничего, что
 * обещало бы вызываемый API: сайт его не предоставляет, и врать про это нельзя.
 */
export const GET: APIRoute = async () => {
  const card = {
    name: SITE.name,
    description: SITE.agentSummary,
    url: `${SITE_URL}/`,
    version: '1.0',
    provider: {
      organization: SITE.name,
      url: `${SITE_URL}/`,
      ...(SITE.contact?.email ? { email: SITE.contact.email } : {}),
    },
    defaultInputModes: ['text/plain'],
    defaultOutputModes: ['text/markdown', 'text/html'],
    documentation: `${SITE_URL}/llms.txt`,
    resources: {
      index: `${SITE_URL}/llms.txt`,
      fullText: `${SITE_URL}/llms-full.txt`,
      sitemap: `${SITE_URL}/sitemap-index.xml`,
      markdownRendition: `${SITE_URL}/{path}.md`,
    },
    language: SITE.language,
    // Демо- и превью-сборки закрыты от индексации, и карточка обязана говорить об этом сама:
    // иначе агент утащит в ответ выдуманный рынок как настоящий.
    ...(PREVIEW_NOINDEX ? { status: 'preview, not for indexing' } : {}),
  };
  return new Response(JSON.stringify(card, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
