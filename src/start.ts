import { createMiddleware, createStart } from '@tanstack/react-start';
import { env } from 'cloudflare:workers';

/**
 * Tells Workers Cache how long to keep each GET response: pages, server functions and the server
 * routes. Cloudflare strips the header before the browser sees it.
 */
const kookeeCache = createMiddleware({ type: 'request' }).server(async ({ request, next }) => {
  const result = await next();
  if (request.method !== 'GET') return result;

  const { status } = result.response;
  const value =
    status === 200
      ? `max-age=${Number(env.KOOKEE_REVALIDATE_SECONDS) || 21600}, stale-while-revalidate=86400`
      : status === 404
        ? // A repeated request for a missing page reaches the API at most every five minutes.
          'max-age=300'
        : // Anything else, errors included, is never cached; Workers Cache would keep a 200 for 2 hours by default.
          'no-store';

  const response = new Response(result.response.body, result.response);
  response.headers.set('Cloudflare-CDN-Cache-Control', value);
  return response;
});

export const startInstance = createStart(() => ({ requestMiddleware: [kookeeCache] }));
