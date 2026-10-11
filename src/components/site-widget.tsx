import { lazy, Suspense } from 'react';
import { ClientOnly } from '@tanstack/react-router';

// Loaded in the browser after hydration: rendered on the server, the lazy import hangs SSR in the dev worker.
const ChatWidget = lazy(() => import('./chat-widget'));

export function SiteWidget({ apiKey }: { apiKey: string }) {
  return (
    <ClientOnly>
      <Suspense fallback={null}>
        <ChatWidget apiKey={apiKey} />
      </Suspense>
    </ClientOnly>
  );
}
