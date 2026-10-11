import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router';
import { BlogPostList } from '@kookee/react/blog';
import { ChangelogList } from '@kookee/react/changelog';
import { HelpCategoryGrid } from '@kookee/react/help';
import { renderLink } from '../components/link';
import { getHelpCategories, listBlogPosts, listChangelog } from '../lib/kookee';
import { hrefs } from '../lib/paths';
import { siteFrom } from '../lib/seo';

const rootRoute = getRouteApi('__root__');

export const Route = createFileRoute('/')({
  loader: async () => {
    const [posts, changelog, categories] = await Promise.all([
      listBlogPosts({ data: { page: 1 } }),
      listChangelog({ data: { page: 1 } }),
      getHelpCategories(),
    ]);
    return { posts: posts?.data.slice(0, 3) ?? [], changelog: changelog?.data.slice(0, 3) ?? [], categories };
  },
  head: ({ matches }) => {
    const site = siteFrom(matches);
    return site ? { links: [{ rel: 'canonical', href: `${site.siteUrl}/` }] } : {};
  },
  component: HomePage,
});

function HomePage() {
  const { project } = rootRoute.useLoaderData();
  const { posts, changelog, categories } = Route.useLoaderData();

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
    </div>
  );
}

function SectionHeading({ title, to }: { title: string; to: '/blog' | '/changelog' | '/help' }) {
  return (
    <div className="site-section-heading">
      <h2>{title}</h2>
      <Link to={to}>View all</Link>
    </div>
  );
}
