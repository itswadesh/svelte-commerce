/**
 * The product and collection page templates (GoCommerce ext/layouts, D128): one document per store
 * that every product page, or every collection page, is drawn in. Each holds its page's core once
 * — `main-product` (the gallery, title, price and buy box) or `main-collection` (the collection's
 * heading and grid) — at the place the merchant put it; the storefront draws its own core there,
 * and the merchant's sections above and below it.
 */
import type { ComposerLayout, ComposerSection } from './helpers.js'
import { editorOrigin } from './editor-bridge.js'

export type TemplatePage = 'product' | 'collection'

/** The section that stands for the page's own core, by page. */
export const TEMPLATE_CORE: Record<TemplatePage, string> = {
	product: 'main-product',
	collection: 'main-collection'
}

/**
 * The layout to draw a template page from, or null for the built-in page. A template without its
 * core is refused here as the engine refuses it on save: drawn, it would be a product page
 * without the product.
 */
export function templateLayout(layout: ComposerLayout | null | undefined, page: TemplatePage): ComposerLayout | null {
	if (!layout || !Array.isArray(layout.sections)) return null
	return layout.sections.some((s) => s?.type === TEMPLATE_CORE[page]) ? layout : null
}

/**
 * The sections a posted draft draws, unless it has lost the core: then the ones last published or
 * saved, so a malformed message can never take the product off its own page. A page without a core
 * (the home page) takes the draft as it is.
 */
export function withCore(draft: ComposerSection[], fallback: ComposerSection[], core: string | null): ComposerSection[] {
	if (!core || draft.some((s) => s.type === core)) return draft
	return fallback
}

type TemplateHook = {
	getProductLayout?: (args?: { preview?: string }) => Promise<ComposerLayout | null>
	getCollectionLayout?: (args?: { preview?: string }) => Promise<ComposerLayout | null>
}

/**
 * The published template, or a preview key's draft, through the connector's layoutService
 * (GoCommerce connector 0.9.0 and later). Null — the built-in page, exactly as before — for an
 * older connector or another backend, nothing published, the editor switched off, a bad key, and
 * any failure: a template is never worth an error page. Reached with Reflect.get for the reason
 * the home page's load gives.
 */
export async function fetchTemplate(services: object, page: TemplatePage, preview: string | null): Promise<ComposerLayout | null> {
	const layouts = Reflect.get(services, 'layoutService') as TemplateHook | undefined
	const fetchIt = page === 'product' ? layouts?.getProductLayout : layouts?.getCollectionLayout
	if (typeof fetchIt !== 'function') return null
	try {
		return templateLayout(await fetchIt.call(layouts, preview ? { preview } : {}), page)
	} catch {
		return null
	}
}

type TabStorage = { getItem(key: string): string | null; setItem(key: string, value: string): void }

const tabStorage = (): TabStorage | undefined => (typeof sessionStorage === 'undefined' ? undefined : sessionStorage)
const previewSlot = (page: TemplatePage) => `gocommerce:template-preview:${page}`

/**
 * Remembers, for this browser tab, the preview key a template page was opened with. The product
 * page rewrites its address to `?variant_id=…` as it opens, which drops the key and re-runs the
 * load, and the page would fall back to the published template mid-edit; the tab's own storage
 * is how the editor frame — or a preview tab moving from product to product — keeps showing the
 * draft. A shopper never has a key to remember, and an expired one is refused by the engine.
 */
export function rememberPreview(page: TemplatePage, key: string, editor: string | null, storage = tabStorage()) {
	try {
		storage?.setItem(previewSlot(page), JSON.stringify({ key, editor }))
	} catch {
		// A private window or blocked site data keeps nothing: the preview lasts this page only.
	}
}

/**
 * The preview key and editor origin a template page's load uses: the address's own, else — in the
 * browser only — the ones this tab remembered.
 */
export function previewParams(
	page: TemplatePage,
	url: URL,
	inBrowser: boolean,
	storage = tabStorage()
): { preview: string | null; editor: string | null } {
	const preview = url.searchParams.get('preview')
	if (preview) return { preview, editor: url.searchParams.get('editor') }
	if (inBrowser) {
		try {
			const kept = JSON.parse(storage?.getItem(previewSlot(page)) ?? 'null')
			if (kept && typeof kept.key === 'string' && kept.key) {
				return { preview: kept.key, editor: typeof kept.editor === 'string' ? kept.editor : null }
			}
		} catch {
			// Unreadable is the same as nothing kept.
		}
	}
	return { preview: null, editor: null }
}

/**
 * The theme editor's origin when this load is a preview the engine accepted (D126), with the
 * header that lets that origin, and only it, frame the page; null otherwise. `editor` without a
 * valid key does nothing.
 */
export function allowEditorFrame(
	event: { setHeaders: (headers: Record<string, string>) => void },
	layout: ComposerLayout | null,
	editor: string | null
): string | null {
	const origin = layout?.preview ? editorOrigin(editor) : null
	if (origin) {
		try {
			event.setHeaders({ 'content-security-policy': `frame-ancestors ${origin}` })
		} catch {
			// setHeaders refuses a header already set by another load, and is a no-op in the browser.
		}
	}
	return origin
}
