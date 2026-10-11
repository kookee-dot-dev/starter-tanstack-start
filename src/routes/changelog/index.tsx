import { createFileRoute, notFound } from '@tanstack/react-router';
import { ChangelogList } from '@kookee/react/changelog';
import { Pagination } from '@kookee/react/entry';
import { renderLink } from '../../components/link';
import { listChangelog } from '../../lib/kookee';
import { hrefs } from '../../lib/paths';
import { listHref, validatePageSearch } from '../../lib/search';
import { pageHead, siteFrom } from '../../lib/seo';

export const Route = createFileRoute('/changelog/')({
  validateSearch: validatePageSearch,
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ deps }) => {
    const entries = await listChangelog({ data: { page: deps.page } });
    if (entries && deps.page > 1 && deps.page > entries.totalPages) throw notFound();
    return entries;
  },
  head: ({ matches, match }) => {
    const page = match.search.page;
    return pageHead(page ? `Changelog, page ${page}` : 'Changelog', page ? `/changelog?page=${page}` : '/changelog', siteFrom(matches));
  },
  component: ChangelogPage,
});

function ChangelogPage() {
  const entries = Route.useLoaderData();
  const { page = 1 } = Route.useSearch();
  if (!entries) return null;

  return (
    <div className="site-container site-narrow">
      <h1 className="site-title">Changelog</h1>
      <ChangelogList entries={entries.data} href={hrefs.changelogEntry} renderLink={renderLink} />
      <Pagination
        page={page}
        totalPages={entries.totalPages}
        href={listHref('/changelog')}
        renderLink={renderLink}
        className="site-pagination"
      />
    </div>
  );
}
