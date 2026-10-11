import { createFileRoute, getRouteApi, notFound } from '@tanstack/react-router';
import { Roadmap } from '@kookee/react/roadmap';
import { getRoadmap } from '../lib/kookee';
import { pageHead, siteFrom } from '../lib/seo';

const rootRoute = getRouteApi('__root__');

export const Route = createFileRoute('/roadmap')({
  loader: async ({ parentMatchPromise }) => {
    const root = await parentMatchPromise;
    if (!root.loaderData?.roadmap) throw notFound();
    return getRoadmap();
  },
  head: ({ matches }) => pageHead('Roadmap', '/roadmap', siteFrom(matches)),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { project } = rootRoute.useLoaderData();
  const roadmap = Route.useLoaderData();
  if (!roadmap) return null;

  return (
    <div className="site-container">
      <h1 className="site-title">Roadmap</h1>
      <p className="site-lead">
        What we are working on and what is under consideration.
        {project?.portalUrl && (
          <>
            {' '}
            Vote and share ideas on <a href={project.portalUrl}>our portal</a>.
          </>
        )}
      </p>
      <Roadmap columns={roadmap.columns} posts={roadmap.posts} />
    </div>
  );
}
