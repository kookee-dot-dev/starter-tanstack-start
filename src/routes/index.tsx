import type { JSX } from 'react';
import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import { getFaqJsonLd } from '@kookee/sdk';
import { BlogPostList } from '@kookee/react/blog';
import { ChangelogList } from '@kookee/react/changelog';
import { FaqList } from '@kookee/react/faq';
import { HelpCategoryGrid } from '@kookee/react/help';
import { renderLink } from '../components/link';
import { getHelpCategories, listBlogPosts, listChangelog, listFaq } from '../lib/kookee';
import { hrefs } from '../lib/paths';
import { siteFrom } from '../lib/seo';

const rootRoute = getRouteApi('__root__');

export const Route = createFileRoute('/')({
  loader: async () => {
    const [posts, changelog, categories, faq] = await Promise.all([
      listBlogPosts({ data: { page: 1 } }),
      listChangelog({ data: { page: 1 } }),
      getHelpCategories(),
      listFaq({ data: { category: 'home' } }),
    ]);
    return { posts: posts?.data.slice(0, 3) ?? [], changelog: changelog?.data.slice(0, 3) ?? [], categories, faq };
  },
  head: ({ matches, loaderData }) => {
    const site = siteFrom(matches);
    if (!site) return {};
    const faqJsonLd = loaderData ? getFaqJsonLd(loaderData.faq) : null;
    return {
      // The router escapes this descriptor; `head().scripts` would be injected as is. The meta type
      // has no `script:ld+json` key, hence the assertion.
      meta: faqJsonLd ? [{ 'script:ld+json': faqJsonLd } as JSX.IntrinsicElements['meta']] : [],
      links: [{ rel: 'canonical', href: `${site.siteUrl}/` }],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { project } = rootRoute.useLoaderData();
  const { posts, changelog, categories, faq } = Route.useLoaderData();

  return (
    <div className="site-container site-stack">
      <section className="site-hero">
        <h1>{project?.name}</h1>
        <p>News, product updates and answers, in one place.</p>
      </section>

      {posts.length > 0 && (
        <section className="site-section">
          <SectionHeading title="Latest posts" to="/blog" />
          <BlogPostList posts={posts} href={hrefs.blogPost} renderLink={renderLink} />
        </section>
      )}

      {changelog.length > 0 && (
        <section className="site-section">
          <SectionHeading title="Recent updates" to="/changelog" />
          <ChangelogList entries={changelog} href={hrefs.changelogEntry} renderLink={renderLink} />
        </section>
      )}

      {categories.length > 0 && (
        <section className="site-section">
          <SectionHeading title="Help center" to="/help" />
          <HelpCategoryGrid categories={categories} href={hrefs.helpCategory} renderLink={renderLink} />
        </section>
      )}

      {faq.length > 0 && (
        <section className="site-section">
          <SectionHeading title="Frequently asked questions" />
          <FaqList items={faq} />
        </section>
      )}
    </div>
  );
}

function SectionHeading({ title, to }: { title: string; to?: '/blog' | '/changelog' | '/help' }) {
  return (
    <div className="site-section-heading">
      <h2>{title}</h2>
      {to && <Link to={to}>View all</Link>}
    </div>
  );
}
