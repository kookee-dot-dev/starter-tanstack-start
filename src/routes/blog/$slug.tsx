import { createFileRoute, getRouteApi, notFound } from '@tanstack/react-router';
import { BlogPost } from '@kookee/react/blog';
import { extractHeadings } from '@kookee/react/entry';
import { Reactions, TrackedTableOfContents } from '@kookee/react/entry/client';
import { renderLink } from '../../components/link';
import { getBlogPost } from '../../lib/kookee';
import { getPath } from '../../lib/paths';
import { entryHead, siteFrom } from '../../lib/seo';

const rootRoute = getRouteApi('__root__');

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: { slug: params.slug } });
    if (!post || !getPath(post)) throw notFound();
    return { post, headings: extractHeadings(post.contentHtml) };
  },
  head: ({ loaderData, matches }) => entryHead(loaderData?.post, siteFrom(matches)),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { apiKey } = rootRoute.useLoaderData();
  const { post, headings } = Route.useLoaderData();

  return (
    <div className="site-container site-article-layout">
      <article className="site-article">
        <BlogPost post={post} renderLink={renderLink} />
        <Reactions entryId={post.id} reactions={post.reactions} config={apiKey ? { apiKey } : null} />
      </article>
      <aside className="site-aside">
        <TrackedTableOfContents headings={headings} offset={88} resetKey={post.id} />
      </aside>
    </div>
  );
}
