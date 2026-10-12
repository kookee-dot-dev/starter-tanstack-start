import { createFileRoute, getRouteApi, Link, notFound } from '@tanstack/react-router';
import { KookeeApiError } from '@kookee/sdk';
import { KookeeProvider, useStatusIncident } from '@kookee/react';
import { StatusIncidentArticle } from '@kookee/react/status';
import { LoadError, NotFound } from '../../../components/not-found';
import { pageHead, siteFrom } from '../../../lib/seo';

const rootRoute = getRouteApi('__root__');

/** An incident id is a UUID; anything else is a 404 without a request. */
const INCIDENT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute('/status/incidents/$id')({
  loader: async ({ parentMatchPromise, params }) => {
    const root = await parentMatchPromise;
    if (!root.loaderData?.status || !INCIDENT_ID_PATTERN.test(params.id)) throw notFound();
  },
  head: ({ matches, params }) => pageHead('Status', `/status/incidents/${params.id}`, siteFrom(matches)),
  component: StatusIncidentPage,
});

function StatusIncidentPage() {
  const { apiKey } = rootRoute.useLoaderData();
  const { id } = Route.useParams();
  if (!apiKey) return null;

  return (
    <div className="site-container site-narrow">
      <Link to="/status" className="site-back">
        ← Status
      </Link>
      <KookeeProvider config={{ apiKey }}>
        <LiveIncident id={id} />
      </KookeeProvider>
    </div>
  );
}

function LiveIncident({ id }: { id: string }) {
  const { data: incident, error } = useStatusIncident(id, { refreshSeconds: 60 });

  if (error instanceof KookeeApiError && error.status === 404) return <NotFound />;
  if (!incident) return error ? <LoadError /> : <p className="site-lead">Loading the incident…</p>;

  return <StatusIncidentArticle incident={incident} timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone} />;
}
