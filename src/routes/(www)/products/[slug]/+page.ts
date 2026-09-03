import { wwwProductsSlugLoad } from '$lib/core/load-functions/index.js'
import { error, isRedirect } from '@sveltejs/kit'

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

// The core load 308-redirects to the homepage when a product isn't found. That is a
// soft-404: crawlers index the homepage under dead product URLs and shoppers get no
// explanation. Convert exactly that not-found redirect into a genuine HTTP 404 (the
// route's +error.svelte renders the recovery page); any other redirect or failure
// passes through untouched.
export const load = async (event: any) => {
	try {
		const data = await wwwProductsSlugLoad(event)
		return data?.product ? { ...data, product: withStringVariantIds(data.product) } : data
	} catch (e) {
		if (isRedirect(e) && e.location === '/') {
			error(404, 'Product not found')
		}
		throw e
	}
}
