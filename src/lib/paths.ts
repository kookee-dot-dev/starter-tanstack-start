import type { GetPath } from '@kookee/sdk';

/** A Kookee page with one of these slugs would be shadowed by the site's own route. */
const RESERVED_PAGE_SLUGS = new Set(['blog', 'changelog', 'help', 'roadmap', 'status']);

/** Where each entry lives on this site, or `null` when it has no page here. */
export const getPath: GetPath = (entry) => {
  if (!entry.slug) return null;
  switch (entry.type) {
    case 'blog':
      return `/blog/${entry.slug}`;
    case 'changelog':
      return `/changelog/${entry.slug}`;
    case 'help_article':
      return entry.category ? `/help/${entry.category.slug}/${entry.slug}` : null;
    case 'page':
      return RESERVED_PAGE_SLUGS.has(entry.slug) ? null : `/${entry.slug}`;
    default:
      return null;
  }
};

/** The same paths as `href` templates, for the components that run in the browser. */
export const hrefs = {
  blogPost: '/blog/{slug}',
  changelogEntry: '/changelog/{slug}',
  helpCategory: '/help/{categorySlug}',
  helpArticle: '/help/{categorySlug}/{slug}',
};
