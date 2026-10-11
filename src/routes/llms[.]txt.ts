import { createFileRoute } from '@tanstack/react-router';
import { buildLlmsTxt } from '@kookee/sdk';
import { siteUrl } from '../lib/kookee';
import { getPath } from '../lib/paths';
import { exportDefaultLocale, unavailable } from '../lib/server-routes';

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { project, entries } = await exportDefaultLocale();
          const text = buildLlmsTxt(entries, {
            baseUrl: siteUrl(request),
            getPath,
            siteName: project?.name ?? 'Kookee starter',
            description: 'Blog posts, changelog entries, help articles and pages.',
          });
          return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        } catch {
          return unavailable();
        }
      },
    },
  },
});
