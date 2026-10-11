import { Link } from '@tanstack/react-router';
import type { ChangelogEntryListItem, PublicProject } from '@kookee/sdk';
import { WhatsNew } from '@kookee/react/changelog/client';
import { hrefs } from '../lib/paths';
import { renderLink } from './link';

export function Header({
  project,
  changelog,
  roadmap,
}: {
  project: PublicProject;
  changelog: ChangelogEntryListItem[];
  roadmap: boolean;
}) {
  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link to="/" className="site-brand">
          {project.name}
        </Link>
        <nav aria-label="Main" className="site-nav">
          <Link to="/blog">Blog</Link>
          <Link to="/changelog">Changelog</Link>
          <Link to="/help">Help</Link>
          {roadmap && <Link to="/roadmap">Roadmap</Link>}
          {project.portalUrl && <a href={project.portalUrl}>Portal ↗</a>}
        </nav>
        <WhatsNew entries={changelog} href={hrefs.changelogEntry} allHref="/changelog" renderLink={renderLink} />
      </div>
    </header>
  );
}
