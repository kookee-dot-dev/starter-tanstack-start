import { createServerFn, createServerOnlyFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { env } from 'cloudflare:workers';
import { Kookee, KookeeApiError } from '@kookee/sdk';
import { getPath } from './paths';

/**
 * Every Kookee read runs on the Worker, in a GET server function. Route loaders call them, so a
 * client-side navigation goes through the Worker and Workers Cache too, never from the browser to
 * the API.
 */

export const PAGE_SIZE = 12;

/** Kookee's slug format. Anything else is a 404 without a request, which stops bot probes. */
const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const SITE_TYPES = ['blog', 'changelog', 'help_article', 'page'] as const;
export type SiteType = (typeof SITE_TYPES)[number];

// The Worker's vars and secrets. Server-only, so the browser build never imports `cloudflare:workers`.
const getEnv = createServerOnlyFn(() => env);

/** The client, or `null` while the `KOOKEE_API_KEY` secret is not set. */
export function getKookee(): Kookee | null {
  const apiKey = getEnv().KOOKEE_API_KEY;
  return apiKey ? new Kookee({ apiKey, timeoutMs: 10_000, getPath }) : null;
}

/** `SITE_URL`, else the origin the request came in on. */
export function siteUrl(request: Request): string {
  return (getEnv().SITE_URL || new URL(request.url).origin).replace(/\/+$/, '');
}

export function roadmapEnabled(): boolean {
  return getEnv().KOOKEE_ROADMAP !== 'false';
}

export function statusEnabled(): boolean {
  return getEnv().KOOKEE_STATUS === 'true';
}

async function orNull<T>(read: Promise<T>): Promise<T | null> {
  try {
    return await read;
  } catch (error) {
    if (error instanceof KookeeApiError && error.status === 404) return null;
    throw error;
  }
}

const slugInput = (input: { slug: string }) => input;
const pageInput = (input: { page: number }) => input;

/** What every page needs: the project, the header's changelog entries, the footer's pages. */
export const getSite = createServerFn({ method: 'GET' }).handler(async () => {
  const kookee = getKookee();
  const base = { siteUrl: siteUrl(getRequest()), roadmap: roadmapEnabled(), status: statusEnabled() };
  if (!kookee) return { ...base, project: null, apiKey: null, changelog: [], pages: [] };
  const [project, changelog, pages] = await Promise.all([
    kookee.project.get(),
    kookee.changelog.list({ limit: PAGE_SIZE }),
    kookee.entries.list({ type: 'page', limit: 20 }),
  ]);
  // Public by design: reactions, the helpful vote, help search and the widget send it from the browser.
  return { ...base, project, apiKey: getEnv().KOOKEE_API_KEY, changelog: changelog.data, pages: pages.data };
});

/** The header's announcements, newest first, each with its body, so the dialog opens one without a request. */
export const getAnnouncements = createServerFn({ method: 'GET' }).handler(async () => {
  const kookee = getKookee();
  if (!kookee) return [];
  const list = await kookee.announcements.list({ limit: 10 });
  const details = await Promise.all(list.data.map((item) => orNull(kookee.announcements.getById(item.id))));
  return details.filter((detail) => detail !== null);
});

export const listBlogPosts = createServerFn({ method: 'GET' })
  .validator(pageInput)
  .handler(async ({ data }) => (await getKookee()?.blog.list({ page: data.page, limit: PAGE_SIZE })) ?? null);

export const listChangelog = createServerFn({ method: 'GET' })
  .validator(pageInput)
  .handler(async ({ data }) => (await getKookee()?.changelog.list({ page: data.page, limit: PAGE_SIZE })) ?? null);

export const getBlogPost = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data }) => {
    const kookee = getKookee();
    return kookee && SLUG_PATTERN.test(data.slug) ? orNull(kookee.blog.getBySlug(data.slug)) : null;
  });

export const getChangelogEntry = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data }) => {
    const kookee = getKookee();
    return kookee && SLUG_PATTERN.test(data.slug) ? orNull(kookee.changelog.getBySlug(data.slug)) : null;
  });

export const getHelpArticle = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data }) => {
    const kookee = getKookee();
    return kookee && SLUG_PATTERN.test(data.slug) ? orNull(kookee.help.getBySlug(data.slug)) : null;
  });

export const getPage = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data }) => {
    const kookee = getKookee();
    return kookee && SLUG_PATTERN.test(data.slug) ? orNull(kookee.pages.getBySlug(data.slug)) : null;
  });

export const getHelpCategories = createServerFn({ method: 'GET' }).handler(
  async () => (await getKookee()?.help.categories()) ?? [],
);

export const listHelpArticles = createServerFn({ method: 'GET' })
  .validator((input: { category: string }) => input)
  .handler(async ({ data }) => {
    const kookee = getKookee();
    if (!kookee || !SLUG_PATTERN.test(data.category)) return [];
    return (await kookee.help.list({ category: data.category, limit: 100 })).data;
  });

export const getRoadmap = createServerFn({ method: 'GET' }).handler(async () => {
  const kookee = getKookee();
  if (!kookee) return null;
  const [columns, posts] = await Promise.all([
    kookee.feedback.getColumns(),
    kookee.feedback.list({ sort: 'top', limit: 100, columnType: 'open' }),
  ]);
  // Only open posts are read, so closed columns (Done, Declined) would render empty.
  return { columns: columns.filter((column) => column.type === 'open'), posts: posts.data };
});
