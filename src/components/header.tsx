import { Link } from '@tanstack/react-router';
import type { AnnouncementDetail, ChangelogEntryListItem, PublicProject } from '@kookee/sdk';
import { WhatsNew } from '@kookee/react/changelog/client';
import { hrefs } from '../lib/paths';
import { Announcements } from './announcements';
import { renderLink } from './link';

export function Header({
  project,
  changelog,
  announcements,
  roadmap,
  status,
}: {
  project: PublicProject;
  changelog: ChangelogEntryListItem[];
  announcements: AnnouncementDetail[];
  roadmap: boolean;
  status: boolean;
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
          {status && <Link to="/status">Status</Link>}
          {project.portalUrl && <a href={project.portalUrl}>Portal ↗</a>}
        </nav>
        <WhatsNew entries={changelog} href={hrefs.changelogEntry} allHref="/changelog" renderLink={renderLink} />
      </div>
      {announcements.length > 0 && <Announcements announcements={announcements} />}
    </header>
  );
}
