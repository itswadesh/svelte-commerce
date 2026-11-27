import { browser } from '$app/environment'
import { services } from 'kitcommerce.config'
import { allowEditorFrame, fetchTemplate, previewParams } from '$lib/composer/page-layout.js'
import { LAYOUT_DEPENDENCY } from '$lib/composer/editor-bridge.js'
import { storeOffers } from '$lib/product/store-facts'

// The page's data comes from +page.server.ts. This adds the two things only the browser knows, and
// awaits neither unless it must, so hydration never waits on the network (P1-11).
export const load = async (event: any) => {
	event.depends(LAYOUT_DEPENDENCY)
	const data = event.data
	if (!browser || !data?.product) return data
	// The bag's own offers ("add ₹200 more for…"); the server could only list the order-wide ones.
	const bagOffers = storeOffers(services as object)
	// Inside the theme editor's frame a draft kept in tab storage outlives the ?preview= link the
	// frame opened with, and only the browser can read it.
	const { preview, editor } = event.untrack(() => previewParams('product', event.url, true))
	const fromLink = event.untrack(() => event.url.searchParams.has('preview'))
	if (!preview || fromLink) return { ...data, bagOffers }
	const layout = await fetchTemplate(services as object, 'product', preview)
	return { ...data, bagOffers, layout, previewKey: layout?.preview ? preview : null, editorOrigin: allowEditorFrame(event, layout, editor) }
}
