import { wwwProductsSlugLoad } from '$lib/core/load-functions/index.js'
import { error, isHttpError, isRedirect } from '@sveltejs/kit'
import { services } from 'kitcommerce.config'
import { productFailureStatus, watchProductRequest } from '$lib/product/product-load'
import { browser } from '$app/environment'
import { allowEditorFrame, fetchTemplate, previewParams } from '$lib/composer/page-layout.js'
import { LAYOUT_DEPENDENCY } from '$lib/composer/editor-bridge.js'
import { loadSetup } from '$lib/customizer/service'

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
	// The theme editor re-reads the draft after each save: the template's product grids are resolved
	// here.
	event.depends(LAYOUT_DEPENDENCY)
	const { preview, editor } = event.untrack(() => previewParams('product', event.url, browser))
	try {
		const [data, layout] = await Promise.all([
			wwwProductsSlugLoad({ fetch: watch.fetch, params: event.params } as any),
			// The shop's product page template (GoCommerce D128), or null for the built-in page.
			fetchTemplate(services as object, 'product', preview)
		])
		const editorOrigin = allowEditorFrame(event, layout, editor)
		if (!data?.product) return data
		const previewKey = layout?.preview ? preview : null
		const customizer = await loadSetup(services as object, data.product.id)
		return { ...data, product: withStringVariantIds(data.product), layout, editorOrigin, previewKey, customizer }
	} catch (e) {
		const reportedMissing = (isRedirect(e) && e.location === '/') || (isHttpError(e) && e.status === 404)
		if (reportedMissing) {
			if (productFailureStatus(watch.outcome()) === 404) error(404, 'Product not found')
			error(503, "We couldn't load this product")
		}
		throw e
	}
}
