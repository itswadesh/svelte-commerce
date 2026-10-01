import { wwwProductsSlugLoad } from '$lib/core/load-functions/index.js'
import { error, isHttpError, isRedirect } from '@sveltejs/kit'
import { productFailureStatus, watchProductRequest } from '$lib/product/product-load'

/**
 * Variant ids as strings, so selecting a variant works at all.
 *
 * The shared product composable resolves the current variant with
 * `variants.find((v) => v.id === variantId)`, where `variantId` comes from
 * `?variant_id=` and is therefore always a string. Backends that key variants numerically — this
 * one returns `id: 1` — never satisfy that strict comparison, so the lookup fell through to
 * `variants[0]` every single time. Three symptoms, one cause:
 *
 *   - tapping a size set the URL but left the heading, price, SKU and pressed pill on variant one;
 *   - the composable re-runs the same lookup after every navigation, so the selection visibly
 *     snapped back about a second after each tap;
 *   - a shared or bookmarked `?variant_id=` link opened on the wrong variant, and the variant added
 *     to the cart was not the one the page described.
 *
 * The comparison lives in `@misiki/kitcommerce-core`, which this repo does not own, so the ids are
 * normalised here instead — on the page payload the composable actually reads. Deliberately not
 * done in the connector: its own cart mapping matches `variants.find((v) => v.id === line.variant_id)`
 * against numeric ids from the cart API, and stringifying there would break that instead.
 *
 * Only `id` changes type. The cart service coerces with `Number(variantId)` before sending, so the
 * write path is unaffected.
 */
function withStringVariantIds<T>(product: T): T {
	const variants = (product as any)?.variants
	if (!Array.isArray(variants)) return product
	return {
		...(product as any),
		variants: variants.map((variant: any) => (variant?.id === undefined || variant?.id === null ? variant : { ...variant, id: String(variant.id) }))
	}
}

// The core load reports every failure as "not found": older versions 308-redirect to the homepage
// (a soft-404), newer ones throw a 404, whether the product is missing or the API never answered.
// Only the product request's own 404 means the product is gone; a dropped connection or a 5xx
// becomes a 503 the route's +error.svelte offers to retry. See $lib/product/product-load.ts.
export const load = async (event: any) => {
	const watch = watchProductRequest(event.fetch, event.params.slug)
	try {
		// Only what the core load reads (fetch, params). Passing the whole event would read
		// `event.url` and make this load re-run on every ?variant_id= change.
		const data = await wwwProductsSlugLoad({ fetch: watch.fetch, params: event.params } as any)
		return data?.product ? { ...data, product: withStringVariantIds(data.product) } : data
	} catch (e) {
		const reportedMissing = (isRedirect(e) && e.location === '/') || (isHttpError(e) && e.status === 404)
		if (reportedMissing) {
			if (productFailureStatus(watch.outcome()) === 404) error(404, 'Product not found')
			error(503, "We couldn't load this product")
		}
		throw e
	}
}
