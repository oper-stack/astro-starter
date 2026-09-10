/**
 * The single source of truth for everything that names the site.
 * Layouts, schemas, the sitemap, llms.txt, the indexing scripts and the Cursor
 * rules all read from here. Change this file, not the components.
 *
 * Every value below describes the demo market, Isla Verde. It is fictional:
 * every place, project, price and figure was invented for the template.
 */
export default {
  name: 'Isla Verde Property',
  shortName: 'Isla Verde',
  /** SITE_URL at build time overrides this (preview and demo deploys). */
  url: globalThis.process?.env?.SITE_URL || 'https://isla-verde.example',
  language: 'en',
  locale: 'en_US',
  tagline: 'Buyer guides for condos and land on Isla Verde',
  description:
    'Independent buyer guides for Isla Verde: what condos and land cost by district, the fees at completion, the title checks that matter, and the projects on the island with their documents on file.',

  market: {
    name: 'Isla Verde',
    country: 'Isla Verde',
    countryCode: 'IV',
    currency: 'CRC',
    /** Places gate 09 uses to compare anchor text with the link target. */
    places: ['Playa Norte', 'Playa Sur', 'Puerto Viejo', 'Cerro Alto'],
    /** Sources a figure may cite (gate 15). Lower case, matched inside the paragraph. */
    allowedSources: ['isla verde statistics office', 'central bank of isla verde', 'isla verde land registry'],
  },

  contact: {
    email: 'hello@isla-verde.example',
    /** Leave empty to hide the WhatsApp button. Full wa.me link. */
    whatsapp: '',
    phone: '',
    /** Where the contact form posts. Empty means the form falls back to a mailto link. */
    formAction: '',
  },

  organization: {
    /** schema.org type of the publisher: Organization, RealEstateAgent, LocalBusiness, NewsMediaOrganization. */
    type: 'Organization',
    foundingDate: '2026',
    /** Other profiles of the same entity: social pages, Wikidata, Crunchbase. */
    sameAs: [],
    address: { locality: 'Puerto Viejo', region: 'Isla Verde', country: 'IV' },
  },

  editorial: {
    author: 'Isla Verde Editorial',
    authorRole: 'Independent market desk',
    authorBio:
      'A small desk that reads registry filings, developer price lists and association accounts so that buyers on Isla Verde do not have to. No listings, no commission.',
  },

  nav: [
    { label: 'Guides', href: '/guides/' },
    { label: 'Districts', href: '/areas/' },
    { label: 'Compare', href: '/comparisons/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'News', href: '/news/' },
    { label: 'About', href: '/about/' },
  ],
  footerNav: [
    { label: 'Contact', href: '/contact/' },
    { label: 'Privacy', href: '/privacy/' },
  ],

  /** One entry per content collection. The key is the folder under src/content. */
  collections: {
    guides: { label: 'Buyer guides', description: 'How buying works on Isla Verde, step by step, with the numbers.' },
    areas: { label: 'Districts', description: 'What each district costs, who lives there and what to check.' },
    comparisons: { label: 'Comparisons', description: 'Two options side by side, with a verdict.' },
    projects: { label: 'Projects', description: 'Data cards for the buildings on the island, facts only.' },
    news: { label: 'News', description: 'Rule changes and registry updates that move prices or fees.' },
  },

  /** The one call to action every article ends with. */
  cta: {
    title: 'Ask before you pay a deposit',
    text: 'Send the listing or the project name. We reply with the registry status, the documents to request and the questions to ask, within one working day.',
    button: 'Ask the desk',
    href: '/contact/',
  },

  analytics: {
    /** GA4 measurement id, e.g. G-XXXXXXX. Empty disables the tag. */
    ga4: '',
  },

  /** Text answer engines read first in llms.txt. Say what the site is and what it is not. */
  agentSummary:
    'Isla Verde Property publishes independent buyer guides, district profiles and project data cards for the fictional island market of Isla Verde. It sells nothing and lists nothing. Figures carry their source in the same paragraph.',
};
