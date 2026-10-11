/** `?page=2` → `{ page: 2 }`; anything that is not a page past the first → `{}`. */
export function validatePageSearch(search: Record<string, unknown>): { page?: number } {
  const page = Number(search.page);
  return Number.isInteger(page) && page > 1 ? { page } : {};
}

export function listHref(base: '/blog' | '/changelog') {
  return (page: number) => (page === 1 ? base : `${base}?page=${page}`);
}
