import { Link, useRouter } from '@tanstack/react-router';
import type { RenderLink, RenderLinkProps } from '@kookee/react/entry';

const LOCAL_ORIGIN = 'http://app.invalid';

/** The `@kookee/react` recipe: router links that keep their query and hash, and plain links elsewhere. */
function RouterLink({ href, ...props }: RenderLinkProps) {
  const router = useRouter();
  const url = new URL(href, `${LOCAL_ORIGIN}${router.latestLocation.href}`);
  if (url.origin !== LOCAL_ORIGIN) return <a href={href} {...props} />;
  return (
    <Link
      {...props}
      to={url.pathname}
      search={router.options.parseSearch(url.search)}
      hash={url.hash.slice(1) || undefined}
      activeOptions={{ exact: true }}
    />
  );
}

export const renderLink: RenderLink = (props) => <RouterLink {...props} />;
