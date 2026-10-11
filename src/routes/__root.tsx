/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router';
import kookeeCss from '@kookee/react/content.css?url';
import codeCss from '@kookee/sdk/styles/content.css?url';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Setup } from '../components/setup';
import { SiteWidget } from '../components/site-widget';
import { getSite } from '../lib/kookee';
import siteCss from '../styles/site.css?url';

export const Route = createRootRoute({
  loader: () => getSite(),
  // The project, header and footer are read once per visit, not on every navigation.
  shouldReload: false,
  head: ({ loaderData }) => {
    const name = loaderData?.project?.name ?? 'Kookee starter';
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: name },
      ],
      links: [
        { rel: 'stylesheet', href: kookeeCss },
        { rel: 'stylesheet', href: codeCss },
        { rel: 'stylesheet', href: siteCss },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'alternate', type: 'application/rss+xml', href: '/blog/rss.xml', title: `${name} blog` },
        { rel: 'alternate', type: 'application/rss+xml', href: '/changelog/rss.xml', title: `${name} changelog` },
      ],
    };
  },
  shellComponent: RootDocument,
  component: RootLayout,
});

function RootDocument({ children }: { children: ReactNode }) {
  const lang = useRouterState({
    select: (state) => {
      const data = state.matches[0]?.loaderData as Awaited<ReturnType<typeof getSite>> | undefined;
      return data?.project?.defaultLocale ?? 'en';
    },
  });

  return (
    <html lang={lang} className="kookee-auto">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootLayout() {
  const site = Route.useLoaderData();

  if (!site.project || !site.apiKey) {
    return (
      <main className="site-main">
        <Setup />
      </main>
    );
  }

  return (
    <>
      <Header project={site.project} changelog={site.changelog} roadmap={site.roadmap} />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer project={site.project} pages={site.pages} />
      {site.project.widgetConfigured && <SiteWidget apiKey={site.apiKey} />}
    </>
  );
}
