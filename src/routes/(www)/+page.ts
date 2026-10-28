import { wwwLoad } from '$lib/core/load-functions/index.js'
import { categoryService, productService } from '$lib/core/services/index.js'
import { services } from 'kitcommerce.config'
import type { ComposerLayout } from '$lib/composer/helpers.js'
import { LAYOUT_DEPENDENCY } from '$lib/composer/editor-bridge.js'
import { allowEditorFrame } from '$lib/composer/page-layout.js'
import type { PageLoad } from './$types'

// The home page the merchant composed in the panel (GoCommerce's ext/layouts), when the connector
// can fetch one. Reached through a cast like every other connector-specific hook: other connectors,
// and GoCommerce connectors older than 0.6.0, have no layoutService, and a bare named import of it
// would fail the whole module.
type LayoutHook = { layoutService?: { getHomeLayout(args?: { preview?: string }): Promise<ComposerLayout | null> } }

/**
 * The composed layout, or null for the built-in home page. A GoCommerce home page never published
 * comes back as the engine's starting page (D140), so null covers the plugin being off, a bad or
 * expired preview key, a backend that answers 404 for an unpublished page, and a connector without
 * the service — and any failure too: the built-in page is always a better answer than an error page.
 */
async function homeLayout(preview: string | null): Promise<ComposerLayout | null> {
	// Reflect.get, not `services.layoutService`: Rollup turns a property read on an imported
	// namespace into a named import, which a connector without the service fails at load — the
	// very version skew this guard is for. Passing the namespace whole keeps it an object.
	const layouts = Reflect.get(services as object, 'layoutService') as LayoutHook['layoutService']
	if (!layouts?.getHomeLayout) return null
	try {
		const layout = await layouts.getHomeLayout(preview ? { preview } : {})
		// A preview keeps even an empty page: the theme editor is showing the draft, and a page with
		// every section hidden is a draft too, not the built-in page.
		return layout?.sections?.length || (preview && layout?.preview) ? layout : null
	} catch {
		return null
	}
}

// HomepageModule fetches the featured products in a `$effect` and the featured categories in an
// `onMount` — neither runs on the server. The homepage is the highest-authority page on the site
// and the entry point for every crawl, and it was server-rendering no product links, no category
// links and an empty ItemList: a crawler that does not execute JS saw an empty storefront.
// Fetching them here puts them in the SSR HTML. The module keeps owning the load-more accumulator
// and everything else it does on the client.
//
// Failures degrade to an empty list rather than taking the homepage down with them — the page
// already renders empty/loading states for both, and the theme sections around them are static.
export const load: PageLoad = async (event) => {
	const base = await wwwLoad(event)
	// The theme editor re-reads the draft after each save: its product grids are resolved here.
	event.depends(LAYOUT_DEPENDENCY)

	const [featuredProducts, featuredCategories, layout] = await Promise.all([
		productService
			.listFeaturedProducts({ page: 1, sort: '-createdAt' })
			.then((r: { data?: unknown[] } | undefined) => r?.data ?? [])
			.catch(() => []),
		categoryService
			.fetchFeaturedCategories({ limit: 18 })
			.then((r: { data?: unknown[] } | undefined) => r?.data ?? [])
			.catch(() => []),
		homeLayout(event.url.searchParams.get('preview'))
	])

	// The panel's theme editor frames this page with ?editor=<its origin> (D126). Only a preview the
	// engine accepted turns that on: the page may then be framed by that one origin, and listens to
	// it. Without a valid key the parameter does nothing.
	const editor = allowEditorFrame(event, layout, event.url.searchParams.get('editor'))

	return { ...base, featuredProducts, featuredCategories, layout, editorOrigin: editor }
}
