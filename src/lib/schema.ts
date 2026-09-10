import { SITE, SITE_URL, absoluteUrl } from './site';

const orgId = `${SITE_URL}/#organization`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': SITE.organization.type,
    '@id': orgId,
    name: SITE.name,
    url: `${SITE_URL}/`,
    description: SITE.description,
    email: SITE.contact.email || undefined,
    telephone: SITE.contact.phone || undefined,
    foundingDate: SITE.organization.foundingDate || undefined,
    sameAs: SITE.organization.sameAs.length ? SITE.organization.sameAs : undefined,
    address: SITE.organization.address
      ? { '@type': 'PostalAddress', addressLocality: SITE.organization.address.locality, addressRegion: SITE.organization.address.region, addressCountry: SITE.organization.address.country }
      : undefined,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE.name,
    url: `${SITE_URL}/`,
    publisher: { '@id': orgId },
    inLanguage: SITE.language,
    hasPart: SITE.nav.map((item, i) => ({ '@type': 'SiteNavigationElement', position: i + 1, name: item.label, url: absoluteUrl(item.href) })),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
  };
}

export function articleSchema(a: { title: string; description: string; url: string; pubDate: Date; updatedDate?: Date; heroImage?: string; author?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: a.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.url },
    datePublished: a.pubDate.toISOString(),
    dateModified: (a.updatedDate ?? a.pubDate).toISOString(),
    inLanguage: SITE.language,
    author: { '@type': 'Organization', name: a.author || SITE.editorial.author, url: `${SITE_URL}/about/` },
    publisher: { '@id': orgId },
    image: a.heroImage ? { '@type': 'ImageObject', url: a.heroImage.startsWith('http') ? a.heroImage : absoluteUrl(a.heroImage) } : undefined,
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.article-headline', '.article-intro'] },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
}
