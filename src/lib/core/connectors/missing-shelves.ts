/**
 * GoCommerce fills the home page's featured and trending shelves from the store's collections of
 * those names, and for a store without them it falls back to the newest products after a 404. The
 * browser logs each of those 404s as an error, on every visit to the home page of a store that
 * never made the two collections, which is most of them. In the browser, one look at the store's
 * collections now decides which shelves exist, and a missing one goes straight to the newest
 * products. The answer is the same; the failed requests are gone. The server keeps the old path:
 * its 404s reach no console.
 *
 * The calls come from @misiki/kitcommerce-core's HomepageModule as well as this repo, so the
 * service methods are wrapped once, where every caller reaches them (as guardPlainAdds does).
 */
const SHELVES = { listFeaturedProducts: 'featured', listTrendingProducts: 'trending' } as const

type Args = { page?: number; sort?: string; limit?: number }
type Products = Record<string, unknown> & { list?: (args: Args) => Promise<unknown> }
type Collections = { list?: (args: { page: number; limit: number }) => Promise<{ data?: { slug?: string }[] } | undefined> }

export function skipMissingShelves(products: Products | null | undefined, collections: Collections | null | undefined) {
	const list = products?.list?.bind(products)
	const listCollections = collections?.list?.bind(collections)
	if (!products || !list || !listCollections) return

	// Once per page load. Null when the list fails: then every shelf is asked for, as before.
	let known: Promise<Set<string> | null> | undefined
	const slugs = () =>
		(known ??= listCollections({ page: 1, limit: 100 })
			.then((res) => new Set((res?.data ?? []).map((c) => String(c?.slug ?? ''))))
			.catch(() => null))

	for (const [method, slug] of Object.entries(SHELVES)) {
		const shelf = products[method]
		if (typeof shelf !== 'function') continue
		products[method] = async (args: Args = {}) => {
			const have = await slugs()
			if (have && !have.has(slug)) return list({ page: args.page ?? 1, sort: args.sort, limit: args.limit })
			return shelf.call(products, args)
		}
	}
}
