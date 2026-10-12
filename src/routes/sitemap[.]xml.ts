import { createFileRoute } from '@tanstack/react-router';
import { buildSitemap } from '@kookee/sdk';
import { getKookee, roadmapEnabled, siteUrl, statusEnabled } from '../lib/kookee';
import { getPath } from '../lib/paths';
import { exportDefaultLocale, unavailable } from '../lib/server-routes';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const [{ entries }, categories] = await Promise.all([
            exportDefaultLocale(),
            getKookee()?.help.categories() ?? [],
          ]);
          const xml = buildSitemap(entries, {
            baseUrl: siteUrl(request),
            getPath,
            extraUrls: [
              '/',
              '/blog',
              '/changelog',
              '/help',
              ...(roadmapEnabled() ? ['/roadmap'] : []),
              ...(statusEnabled() ? ['/status'] : []),
              ...categories.map((category) => `/help/${category.slug}`),
            ],
          });
          return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
        } catch {
          return unavailable();
        }
      },
    },
  },
});
