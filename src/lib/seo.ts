import { getEntrySeo, type BaseEntry } from '@kookee/sdk';
import { getPath } from './paths';

type Site = { siteUrl: string; project: { name: string } | null };

/** The `head()` of an entry's page: title, description, canonical URL, Open Graph and JSON-LD. */
export function entryHead(entry: BaseEntry | null | undefined, site: Site | undefined) {
  if (!entry || !site?.project) return {};
  const siteName = site.project.name;
  const seo = getEntrySeo(entry, { baseUrl: site.siteUrl, getPath, siteName });
  // A meta title is written whole, so it skips the "· Site name" suffix.
  const title = entry.metaTitle || `${entry.title} · ${siteName}`;
  return {
    meta: [
      { title },
      { name: 'description', content: seo.description },
      { property: 'og:type', content: seo.type },
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:site_name', content: siteName },
      ...(seo.canonical ? [{ property: 'og:url', content: seo.canonical }] : []),
      ...(seo.image ? [{ property: 'og:image', content: seo.image }] : []),
      { name: 'twitter:card', content: seo.image ? 'summary_large_image' : 'summary' },
      // The router escapes this descriptor; `head().scripts` would be injected as is.
      ...(seo.jsonLd ? [{ 'script:ld+json': seo.jsonLd }] : []),
    ],
    links: seo.canonical ? [{ rel: 'canonical', href: seo.canonical }] : [],
  };
}

/** The `head()` of a list or index page. */
export function pageHead(title: string, path: string, site: Site | undefined) {
  if (!site?.project) return {};
  return {
    meta: [{ title: `${title} · ${site.project.name}` }],
    links: [{ rel: 'canonical', href: `${site.siteUrl}${path}` }],
  };
}

/** The root loader's site data, read from a child route's `head()` matches. */
export function siteFrom(matches: ReadonlyArray<{ routeId: string; loaderData?: unknown }>): Site | undefined {
  return matches.find((match) => match.routeId === '__root__')?.loaderData as Site | undefined;
}
