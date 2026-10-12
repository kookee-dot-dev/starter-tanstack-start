import { createFileRoute, getRouteApi, notFound } from '@tanstack/react-router';
import { KookeeProvider, useStatus } from '@kookee/react';
import { StatusHeadline, StatusOverview } from '@kookee/react/status';
import { renderLink } from '../../components/link';
import { LoadError } from '../../components/not-found';
import { pageHead, siteFrom } from '../../lib/seo';

const rootRoute = getRouteApi('__root__');

// The page is cached with the others; the status itself is read in the browser, so it is current
// on every visit and costs no metered reads of the root loader.
export const Route = createFileRoute('/status/')({
  loader: async ({ parentMatchPromise }) => {
    const root = await parentMatchPromise;
    if (!root.loaderData?.status) throw notFound();
  },
  head: ({ matches }) => pageHead('Status', '/status', siteFrom(matches)),
  component: StatusPage,
});

function StatusPage() {
  const { apiKey } = rootRoute.useLoaderData();
  if (!apiKey) return null;

  return (
    <div className="site-container site-narrow">
      <KookeeProvider config={{ apiKey }}>
        <LiveStatus />
      </KookeeProvider>
    </div>
  );
}

function LiveStatus() {
  // Refreshed every minute while the tab is visible: a status page is read during an incident.
  const { data: status, error } = useStatus({ refreshSeconds: 60 });

  if (!status) return error ? <LoadError /> : <p className="site-lead">Loading the status…</p>;

  return (
    <>
      <StatusHeadline status={status} className="site-status-headline" />
      <p className="site-lead">Incidents, maintenance and the uptime of the last 90 days.</p>
      <StatusOverview
        status={status}
        incidentHref="/status/incidents/{id}"
        renderLink={renderLink}
        timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      />
    </>
  );
}
