import { createFileRoute, getRouteApi, notFound } from '@tanstack/react-router';
import { extractHeadings } from '@kookee/react/entry';
import { TrackedTableOfContents } from '@kookee/react/entry/client';
import { HelpArticle, HelpArticleNav, HelpBreadcrumbs } from '@kookee/react/help';
import { HelpfulVote } from '@kookee/react/help/client';
import { renderLink } from '../../../components/link';
import { getHelpArticle, listHelpArticles } from '../../../lib/kookee';
import { hrefs } from '../../../lib/paths';
import { entryHead, siteFrom } from '../../../lib/seo';

const rootRoute = getRouteApi('__root__');

export const Route = createFileRoute('/help/$category/$slug')({
  loader: async ({ params }) => {
    const [article, siblings] = await Promise.all([
      getHelpArticle({ data: { slug: params.slug } }),
      listHelpArticles({ data: { category: params.category } }),
    ]);
    // An article lives under its own category only; one without a category has no page.
    if (!article?.category || article.category.slug !== params.category) throw notFound();
    return { article, category: article.category, siblings, headings: extractHeadings(article.contentHtml) };
  },
  head: ({ loaderData, matches }) => entryHead(loaderData?.article, siteFrom(matches)),
  component: HelpArticlePage,
});

function HelpArticlePage() {
  const { apiKey } = rootRoute.useLoaderData();
  const { article, category, siblings, headings } = Route.useLoaderData();

  return (
    <div className="site-container site-article-layout">
      <article className="site-article">
        <HelpBreadcrumbs
          homeHref="/help"
          category={category}
          categoryHref={hrefs.helpCategory}
          article={article}
          renderLink={renderLink}
        />
        <HelpArticle article={article} />
        <HelpfulVote entryId={article.id} reactions={article.reactions} config={apiKey ? { apiKey } : null} />
      </article>
      <aside className="site-aside">
        <TrackedTableOfContents headings={headings} offset={88} resetKey={article.id} />
        <HelpArticleNav
          articles={siblings}
          activeSlug={article.slug ?? undefined}
          href={hrefs.helpArticle}
          title={category.name}
          renderLink={renderLink}
        />
      </aside>
    </div>
  );
}
