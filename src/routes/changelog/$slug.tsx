import { createFileRoute, getRouteApi, notFound } from '@tanstack/react-router';
import { ChangelogArticle } from '@kookee/react/changelog';
import { Reactions } from '@kookee/react/entry/client';
import { getChangelogEntry } from '../../lib/kookee';
import { getPath } from '../../lib/paths';
import { entryHead, siteFrom } from '../../lib/seo';

const rootRoute = getRouteApi('__root__');

export const Route = createFileRoute('/changelog/$slug')({
  loader: async ({ params }) => {
    const entry = await getChangelogEntry({ data: { slug: params.slug } });
    if (!entry || !getPath(entry)) throw notFound();
    return entry;
  },
  head: ({ loaderData, matches }) => entryHead(loaderData, siteFrom(matches)),
  component: ChangelogEntryPage,
});

function ChangelogEntryPage() {
  const { apiKey } = rootRoute.useLoaderData();
  const entry = Route.useLoaderData();

  return (
    <div className="site-container site-narrow">
      <article className="site-article">
        <ChangelogArticle entry={entry} showLink />
        <Reactions entryId={entry.id} reactions={entry.reactions} config={apiKey ? { apiKey } : null} />
      </article>
    </div>
  );
}
