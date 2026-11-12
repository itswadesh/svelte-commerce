import { error } from '@sveltejs/kit'
import { PageService } from '$lib/core/services'
import { CMS_PAGE_SLUGS } from '$lib/components/common/cms-pages'

/**
 * The server load for a legal route: its CMS page under the first of its names that has content
 * (CMS_PAGE_SLUGS), so /refund-policy shows a store's `returns` page. A miss is `{ page: {} }`,
 * which requireCmsPage below turns into the 404, as the shared loaders it replaces did.
 */
export function cmsPageLoader(path: string) {
	return async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
		const pageService = new PageService(fetch)
		for (const slug of CMS_PAGE_SLUGS[path] ?? []) {
			try {
				const page: any = await pageService.getOne(slug)
				if (page?.content || page?.layouts?.length) return { page }
			} catch {
				// Not under this name; try the next.
			}
		}
		return { page: {} }
	}
}

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
