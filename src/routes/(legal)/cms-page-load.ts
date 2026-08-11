import { error } from '@sveltejs/kit'

/**
 * The five CMS-backed legal routes share one shape: a one-line `+page.server.ts` re-exporting a
 * core loader that swallows a missing record and returns `{ page: {} }`, and a component that
 * renders `page.content` plus `page.layouts`. Without a guard, a store that never authored the
 * page publishes a bare heading as a 200 — thin content Google treats as a soft 404.
 *
 * The `return data` is load-bearing, not decoration: a universal load's return value REPLACES the
 * server load's data for its node rather than merging with it, so a guard that returns nothing
 * blanks `data` on SSR and the component throws on `data.page.layouts`.
 */
export function requireCmsPage<T extends { page?: { content?: string; layouts?: unknown[] } }>(data: T): T {
	if (!data?.page?.content && !data?.page?.layouts?.length) error(404, 'Page not found')
	return data
}
