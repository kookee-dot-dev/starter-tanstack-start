import { createFileRoute, notFound } from '@tanstack/react-router';
import { EntryContent } from '@kookee/react/entry';
import { getPage } from '../lib/kookee';
import { getPath } from '../lib/paths';
import { entryHead, siteFrom } from '../lib/seo';

export const Route = createFileRoute('/$slug')({
  loader: async ({ params }) => {
    const page = await getPage({ data: { slug: params.slug } });
    if (!page || !getPath(page)) throw notFound();
    return page;
  },
  head: ({ loaderData, matches }) => entryHead(loaderData, siteFrom(matches)),
  component: KookeePage,
});

function KookeePage() {
  const page = Route.useLoaderData();

  return (
    <div className="site-container site-narrow">
      <article className="site-article">
        <h1 className="site-title">{page.title}</h1>
        <EntryContent entry={page} className="kookee-typography" />
      </article>
    </div>
  );
}
