import { getKookee, SITE_TYPES } from './kookee';

/** Fail closed: never let Workers Cache keep an empty document in place of the real one. */
export function unavailable(): Response {
  return new Response(null, { status: 503, headers: { 'Cache-Control': 'no-store' } });
}

/** The project and every published entry in its default locale, for the sitemap and llms.txt. */
export async function exportDefaultLocale() {
  const kookee = getKookee();
  if (!kookee) return { project: null, entries: [] };
  const [project, rows] = await Promise.all([kookee.project.get(), kookee.entries.export({ type: [...SITE_TYPES] })]);
  // The export holds every locale; this site has pages in the default one only.
  return { project, entries: rows.filter((row) => row.locale === project.defaultLocale) };
}
