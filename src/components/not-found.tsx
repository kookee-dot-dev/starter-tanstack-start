import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <div className="site-container site-empty">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist, or it was moved.</p>
      <Link to="/">Go to the home page</Link>
    </div>
  );
}

export function LoadError() {
  return (
    <div className="site-container site-empty">
      <h1>Something went wrong</h1>
      <p>The content could not be loaded. Try again in a moment.</p>
    </div>
  );
}
