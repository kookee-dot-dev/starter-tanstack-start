import { createFileRoute } from '@tanstack/react-router';
import { siteUrl } from '../lib/kookee';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: ({ request }) =>
        new Response(`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl(request)}/sitemap.xml\n`, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    },
  },
});
