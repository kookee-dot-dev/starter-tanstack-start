import { createFileRoute, notFound } from '@tanstack/react-router';
import { BlogPostList } from '@kookee/react/blog';
import { Pagination } from '@kookee/react/entry';
import { renderLink } from '../../components/link';
import { listBlogPosts } from '../../lib/kookee';
import { hrefs } from '../../lib/paths';
import { listHref, validatePageSearch } from '../../lib/search';
import { pageHead, siteFrom } from '../../lib/seo';

export const Route = createFileRoute('/blog/')({
  validateSearch: validatePageSearch,
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ deps }) => {
    const posts = await listBlogPosts({ data: { page: deps.page } });
    if (posts && deps.page > 1 && deps.page > posts.totalPages) throw notFound();
    return posts;
  },
  head: ({ matches, match }) => {
    const page = match.search.page;
    return pageHead(page ? `Blog, page ${page}` : 'Blog', page ? `/blog?page=${page}` : '/blog', siteFrom(matches));
  },
  component: BlogPage,
});

function BlogPage() {
  const posts = Route.useLoaderData();
  const { page = 1 } = Route.useSearch();
  if (!posts) return null;

  return (
    <div className="site-container">
      <h1 className="site-title">Blog</h1>
      <BlogPostList posts={posts.data} href={hrefs.blogPost} renderLink={renderLink} />
      <Pagination
        page={page}
        totalPages={posts.totalPages}
        href={listHref('/blog')}
        renderLink={renderLink}
        className="site-pagination"
      />
    </div>
  );
}
