import { browser } from '$app/environment'
import { wwwCollectionsSlugLoad } from '$lib/core/load-functions/index.js'
import { services } from 'kitcommerce.config'
import { allowEditorFrame, fetchTemplate, previewParams } from '$lib/composer/page-layout.js'
import { LAYOUT_DEPENDENCY } from '$lib/composer/editor-bridge.js'

// The collection, and the shop's collection page template (GoCommerce D128) to draw it in: null —
// none published, the editor off, an older connector — draws the page exactly as before.
export const load = async (event: any) => {
	// The theme editor re-reads the draft after each save: the template's product grids are resolved
	// here.
	event.depends(LAYOUT_DEPENDENCY)
	// A preview tab keeps its key from one collection to the next (previewParams).
	const { preview, editor } = previewParams('collection', event.url, browser)
	const [data, layout] = await Promise.all([wwwCollectionsSlugLoad(event), fetchTemplate(services as object, 'collection', preview)])
	const editorOrigin = allowEditorFrame(event, layout, editor)
	return { ...data, layout, editorOrigin, previewKey: layout?.preview ? preview : null }
}
