// The product page's data is read here, on the server, rather than in a universal load. A
// universal load runs again in the browser before the page hydrates, and SvelteKit cannot replay
// the SSR responses there (the browser asks the /backend proxy, not the engine), so every request
// went out a second time and no tap on a size or Add to bag worked until they had all come back:
// 6–18 s on a phone (P1-11). In SSR each request also went out twice, because a universal fetch to
// the engine fails SvelteKit's CORS check and the connector asks again. Server data is serialised
// into the page and hydration reuses it; +page.ts adds only what needs the browser.
import { wwwProductsSlugLoad, wwwProductsSlugLoadServer } from '$lib/core/load-functions/index.js'
import { error, isHttpError, isRedirect } from '@sveltejs/kit'
import { services } from 'kitcommerce.config'
import { productFailureStatus, watchProductRequest } from '$lib/product/product-load'
import { allowEditorFrame, fetchTemplate, previewParams } from '$lib/composer/page-layout.js'
import { LAYOUT_DEPENDENCY } from '$lib/composer/editor-bridge.js'
import { loadSetup } from '$lib/customizer/service'
import { restockAlertsOn, storeOffers, takesCashOnDelivery } from '$lib/product/store-facts'

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
	// Untracked, so a size tap's ?variant_id= does not send the page back to the server.
	const { preview, editor } = event.untrack(() => previewParams('product', event.url, false))
	const reads = Promise.all([
		wwwProductsSlugLoad({ fetch: watch.fetch, params: event.params } as any),
		// The shop's product page template (GoCommerce D128), or null for the built-in page.
		fetchTemplate(services as object, 'product', preview),
		takesCashOnDelivery(services as object),
		restockAlertsOn(services as object),
		// Order-wide codes, in the first paint; +page.ts swaps in the bag's once it is known.
		storeOffers(services as object)
	])
	reads.catch(() => {})
	// The secure-catalogue gate waits on the layouts; the product requests above need not wait with it.
	// Its parent() is untracked: tracked, a size tap's ?variant_id= re-runs the root layouts, and with
	// them this whole load, on the server.
	await wwwProductsSlugLoadServer({ ...event, parent: () => event.untrack(() => event.parent()) })
	try {
		const [data, layout, cod, restockAlerts, offers] = await reads
		const editorOrigin = allowEditorFrame(event, layout, editor)
		if (!data?.product) return data
		const previewKey = layout?.preview ? preview : null
		// An engine older than the flag leaves designable undefined: only false skips the setup read.
		const customizer = data.product.designable === false ? null : await loadSetup(services as object, data.product.id)
		return { ...data, product: withStringVariantIds(data.product), layout, editorOrigin, previewKey, customizer, cod, restockAlerts, offers }
	} catch (e) {
		const reportedMissing = (isRedirect(e) && e.location === '/') || (isHttpError(e) && e.status === 404)
		if (reportedMissing) {
			if (productFailureStatus(watch.outcome()) === 404) error(404, 'Product not found')
			error(503, "We couldn't load this product")
		}
		throw e
	}
}
