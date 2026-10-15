import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { AnnouncementDetail, AnnouncementListItem } from '@kookee/sdk';
import { AnnouncementArticle, AnnouncementList, AnnouncementPill } from '@kookee/react/announcements';
import { useDismissedAnnouncements } from '@kookee/react/announcements/client';

/**
 * The newest announcement the visitor has not dismissed, as a pill under the header, and a dialog
 * that lists them all and opens one. Dismissals live in the visitor's browser, so the pill shows
 * after hydration, never in the cached page.
 */
export function Announcements({ announcements }: { announcements: AnnouncementDetail[] }) {
  // Typed as list items: the pill and the list hand those to `dismiss`.
  const { visible, dismiss } = useDismissedAnnouncements<AnnouncementListItem>({ announcements });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const selected = announcements.find((announcement) => announcement.id === selectedId);

  function back() {
    const index = visible.findIndex((announcement) => announcement.id === selectedId);
    flushSync(() => setSelectedId(null));
    // Focus goes back to the row that was opened, not to the page behind the dialog.
    listRef.current?.querySelectorAll<HTMLElement>('.kookee-announcement-item-title-button')[index]?.focus();
  }

  return (
    <>
      <div className="site-announcement">
        <AnnouncementPill announcement={visible[0]} onOpen={() => dialogRef.current?.showModal()} onDismiss={dismiss} />
      </div>
      <dialog
        ref={dialogRef}
        className="site-dialog"
        aria-labelledby={titleId}
        onClose={() => setSelectedId(null)}
        onClick={(event) => {
          // The panels fill the dialog, so a click on the dialog itself is a click on the backdrop.
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="site-dialog-header">
          <h2 id={titleId} className="site-dialog-title">
            Announcements
          </h2>
          <button
            type="button"
            className="site-dialog-close"
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
          >
            ×
          </button>
        </div>
        <div className="site-dialog-body">
          {selected ? (
            <>
              <button type="button" className="site-back" autoFocus onClick={back}>
                <span aria-hidden="true">←</span> Back
              </button>
              <AnnouncementArticle announcement={selected} headingLevel={3} />
            </>
          ) : (
            <AnnouncementList
              ref={listRef}
              announcements={visible}
              onSelect={(announcement) => setSelectedId(announcement.id)}
              onDismiss={dismiss}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
