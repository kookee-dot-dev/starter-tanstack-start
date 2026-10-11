import { createFileRoute } from '@tanstack/react-router';
import { buildFeed } from '@kookee/sdk';
import { getKookee, siteUrl } from '../../lib/kookee';
import { getPath } from '../../lib/paths';
import { unavailable } from '../../lib/server-routes';

export const Route = createFileRoute('/blog/rss.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const kookee = getKookee();
          const [project, posts] = kookee
            ? await Promise.all([kookee.project.get(), kookee.blog.list({ limit: 50 })])
            : [null, null];
          const name = project?.name ?? 'Kookee starter';
          const xml = buildFeed(posts?.data ?? [], {
            baseUrl: siteUrl(request),
            getPath,
            title: `${name} blog`,
            description: `The latest posts from ${name}.`,
            feedPath: '/blog/rss.xml',
          });
          return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
        } catch {
          return unavailable();
        }
      },
    },
  },
});
