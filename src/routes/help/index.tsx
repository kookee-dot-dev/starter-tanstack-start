import { createFileRoute, getRouteApi, useRouter } from '@tanstack/react-router';
import { HelpCategoryGrid } from '@kookee/react/help';
import { HelpSearchBox } from '@kookee/react/help/client';
import { renderLink } from '../../components/link';
import { getHelpCategories } from '../../lib/kookee';
import { hrefs } from '../../lib/paths';
import { pageHead, siteFrom } from '../../lib/seo';

const rootRoute = getRouteApi('__root__');

export const Route = createFileRoute('/help/')({
  loader: () => getHelpCategories(),
  head: ({ matches }) => pageHead('Help center', '/help', siteFrom(matches)),
  component: HelpPage,
});

function HelpPage() {
  const router = useRouter();
  const { apiKey } = rootRoute.useLoaderData();
  const categories = Route.useLoaderData();

  return (
    <div className="site-container">
      <section className="site-help-hero">
        <h1 className="site-title">How can we help?</h1>
        <HelpSearchBox
          config={apiKey ? { apiKey } : null}
          href={hrefs.helpArticle}
          navigate={(href) => router.navigate({ href })}
        />
      </section>
      <HelpCategoryGrid categories={categories} href={hrefs.helpCategory} renderLink={renderLink} />
    </div>
  );
}
