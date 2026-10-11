import { Link } from '@tanstack/react-router';
import type { GenericEntryListItem, PublicProject } from '@kookee/sdk';
import { getPath } from '../lib/paths';

export function Footer({ project, pages }: { project: PublicProject; pages: GenericEntryListItem[] }) {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer-inner">
        <nav aria-label="Pages" className="site-footer-links">
          {pages.map((page) => {
            const path = getPath(page);
            return path ? (
              <Link key={page.id} to={path}>
                {page.title}
              </Link>
            ) : null;
          })}
          <a href="/blog/rss.xml">Blog RSS</a>
          <a href="/changelog/rss.xml">Changelog RSS</a>
        </nav>
        <p>
          © {project.name}. Content from <a href="https://kookee.dev">Kookee</a>.
        </p>
      </div>
    </footer>
  );
}
