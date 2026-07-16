/**
 * Strip the supplier's brand out of API-supplied catalogue copy.
 *
 * The whole fleet shares ONE storefront API account, and the products in that
 * catalogue were written by the supplier: their brand is baked into each product's
 * `description`, `metaTitle` and `metaDescription`, and it surfaces as a tag facet
 * on the PLP. So a shopper on this storefront reads
 *
 *     "Say yes in unforgettable style with JewelWeSells 0.5 Carat …"
 *
 * and the PDP's <title> ends in "| JewelWeSell".
 *
 * This CANNOT be fixed in the backend by renaming the account: the same catalogue
 * feeds ~18 differently-branded storefronts, so any single value stored there is
 * wrong for at least 17 of them. It has to be rewritten per-storefront, at the
 * boundary where the data enters — exactly like `store.name` / `store.logo` are
 * already overridden in `+layout.server.ts`.
 *
 * Scope note: this rewrites *presentation copy only*. It never touches ids, slugs,
 * SKUs, prices, or image URLs — a product whose SKU legitimately contains a brand
 * token keeps it, because only string VALUES are rewritten and the supplier tokens
 * below never legitimately appear in an identifier.
 */

/** Supplier account names seen on the shared catalogue. Longest first — order matters.
 *  'BorisAndTwins' is the camel-cased variant the API returns as `product.vendor.businessName`
 *  (seen in the homepage products feed on 2026-07-16); exact-case only, so CDN/url slugs
 *  in lowercase are never touched. */
const SUPPLIER_BRANDS = ['BorisAndTwins', 'JewelWeSells', 'JewelWeSell', 'Boris & Twins', 'Boris&Twins']

/**
 * This storefront's brand, for use inside a load function.
 *
 * `parent()` is the natural source (the root layout already resolves the theme), but
 * it is not reliably populated in every load, and a missing brand silently disables
 * the rewrite — which is exactly how the supplier's name survived in the SSR payload
 * while the rendered page looked clean. So fall back to resolving the theme from the
 * environment, which is what the root layout does anyway.
 */
export async function themeBrandName(
	parent: () => Promise<unknown>
): Promise<string | undefined> {
	const { getThemeHomepageContent } = await import('./homepage-content.js')
	const { resolveStorefrontTheme } = await import('./index.js')

	let name: string | undefined
	try {
		name = ((await parent()) as { theme?: { name?: string } })?.theme?.name
	} catch {
		name = undefined
	}
	if (!name) name = resolveStorefrontTheme(undefined)?.name

	return name ? getThemeHomepageContent(name)?.brandName : undefined
}

/** Keys whose values are identifiers/URLs, never shopper-facing prose. Left untouched. */
const OPAQUE_KEYS = new Set([
	'id',
	'_id',
	'productId',
	'variantId',
	'storeId',
	'slug',
	'sku',
	'thumbnail',
	'image',
	'image_url',
	'images',
	'img',
	'url',
	'link',
	'href'
])

/**
 * Rewrite the supplier brand out of a JSON body — used by `handleFetch` in
 * hooks.server.ts, which is the only place that can reach SvelteKit's inlined
 * `data-sveltekit-fetched` blocks (the raw upstream API responses it caches in the HTML
 * so the client can reuse them on hydration; no load's return value can touch those).
 *
 * It rewrites the body while it is still JSON, and that is load-bearing. Doing the same
 * sweep over the finished HTML — which is what this used to do — corrupts the page: the
 * hydration payload is JavaScript, not JSON, and serialises the facet map with UNQUOTED
 * keys (`JewelWeSell:402`). Replacing the token there yields `Website-44:402`, which is
 * a syntax error ("Unexpected token '-'"), the hydration script dies, the client app
 * never mounts, and the product grid silently renders empty. In JSON every key is
 * quoted, so the same replacement stays valid.
 */
export function stripSupplierBrandFromJson(body: string, brand: string | undefined | null): string {
	if (!brand) return body
	return rewrite(body, brand)
}

function rewrite(text: string, brand: string): string {
	let out = text
	for (const supplier of SUPPLIER_BRANDS) {
		if (!out.includes(supplier)) continue
		// "JewelWeSells 0.5 Carat …" is possessive in the supplier's own copy, so it
		// has to become "Website-44's 0.5 Carat …" rather than "Website-44 0.5 Carat".
		const possessive = /s$/.test(supplier) && !/ss$/.test(supplier)
		out = out.split(supplier).join(possessive ? `${brand}'s` : brand)
	}
	return out
}

/**
 * Deep-rewrite every shopper-facing string in an API payload, IN PLACE.
 *
 * In-place is not a micro-optimisation, it is the whole point. Rebuilding the payload
 * into fresh plain objects (`{...}` / `.map()`) silently drops prototypes, getters and
 * any non-enumerable state — and the catalogue payload carries exactly that. Doing so
 * emptied the PLP: the page still rendered "402 Products", its filters and 21 pages of
 * pagination, but the product grid came back with nothing in it, because the list is
 * not a plain own-property. Mutating the objects that are already there keeps every
 * such structure intact.
 *
 * A WeakSet guards against a cycle turning into a hang.
 */
export function stripSupplierBrand<T>(value: T, brand: string | undefined | null): T {
	if (!brand) return value
	if (typeof value === 'string') return rewrite(value, brand) as unknown as T
	scrub(value, brand, new WeakSet())
	return value
}

function scrub(value: unknown, brand: string, seen: WeakSet<object>): void {
	if (value === null || typeof value !== 'object') return
	if (seen.has(value)) return
	seen.add(value)

	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			const v = value[i]
			if (typeof v === 'string') value[i] = rewrite(v, brand)
			else scrub(v, brand, seen)
		}
		return
	}

	const target = value as Record<string, unknown>
	for (const key of Object.keys(target)) {
		if (OPAQUE_KEYS.has(key)) continue

		const v = target[key]
		if (typeof v === 'string') {
			const next = rewrite(v, brand)
			if (next !== v) target[key] = next
		} else {
			scrub(v, brand, seen)
		}

		// Keys are rewritten too. The PLP's facet aggregation is a count map keyed BY the
		// tag — {"Halo": 400, "JewelWeSell": 402} — so the supplier's name is a KEY there,
		// not a value, and a value-only pass leaves the filter list still showing it.
		const nextKey = rewrite(key, brand)
		if (nextKey !== key) {
			target[nextKey] = target[key]
			delete target[key]
		}
	}
}
