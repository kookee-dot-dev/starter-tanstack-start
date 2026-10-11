import { createFileRoute, notFound } from '@tanstack/react-router';
import { HelpArticleList, HelpBreadcrumbs, HelpCategoryHeader, HelpCategoryNav } from '@kookee/react/help';
import { renderLink } from '../../../components/link';
import { getHelpCategories, listHelpArticles } from '../../../lib/kookee';
import { hrefs } from '../../../lib/paths';
import { siteFrom } from '../../../lib/seo';

export const Route = createFileRoute('/help/$category/')({
  loader: async ({ params }) => {
    const [categories, articles] = await Promise.all([
      getHelpCategories(),
      listHelpArticles({ data: { category: params.category } }),
    ]);
    const category = categories.find((item) => item.slug === params.category);
    if (!category) throw notFound();
    return { categories, category, articles };
  },
  head: ({ loaderData, matches }) => {
    const site = siteFrom(matches);
    if (!loaderData || !site?.project) return {};
    const { category } = loaderData;
    return {
      meta: [
        { title: `${category.name} · ${site.project.name}` },
        ...(category.description ? [{ name: 'description', content: category.description }] : []),
      ],
      links: [{ rel: 'canonical', href: `${site.siteUrl}/help/${category.slug}` }],
    };
  },
  component: HelpCategoryPage,
});

function HelpCategoryPage() {
  const { categories, category, articles } = Route.useLoaderData();

  return (
    <div className="site-container site-article-layout">
      <div className="site-article">
        <HelpBreadcrumbs homeHref="/help" category={category} categoryHref={hrefs.helpCategory} renderLink={renderLink} />
        <HelpCategoryHeader category={category} />
        <HelpArticleList articles={articles} href={hrefs.helpArticle} renderLink={renderLink} />
      </div>
      <aside className="site-aside">
        <HelpCategoryNav
          categories={categories}
          activeCategorySlug={category.slug}
          href={hrefs.helpCategory}
          renderLink={renderLink}
          showCounts
        />
      </aside>
    </div>
  );
}
