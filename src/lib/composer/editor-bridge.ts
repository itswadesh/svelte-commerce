/**
 * The storefront's half of the GoCommerce theme editor (D126): the panel frames this home page with
 * `?preview=<key>&editor=<panel origin>` and posts the draft as it is edited, so the page changes
 * before the draft is saved; a click on a section here selects it in the panel.
 *
 * The rules that keep this from being a way in, all enforced here and tested:
 * - the bridge exists only for a preview the engine accepted (a valid key), never on a shopper's page;
 * - a message is read only when it comes from the window that framed the page AND from the exact
 *   origin the page was opened for — anything else is ignored, not answered;
 * - a posted draft is data, drawn by the same trusted components as a published page, with links
 *   through `safeHref` like any other; a section type this build does not know is skipped.
 */
import type { ComposerSection } from './helpers.js'

/** Marks the panel's messages and ours, so neither side mistakes another script's for them. */
export const EDITOR_SOURCE = 'gocommerce-editor'
export const STOREFRONT_SOURCE = 'gocommerce-storefront'

/** The `invalidate` key the home page's load depends on: re-read after the panel saves. */
export const LAYOUT_DEPENDENCY = 'gocommerce:layout'

/**
 * The panel's origin from the `editor` query value, or null. Only a bare http(s) origin passes —
 * no path, no credentials — because it is written into a `frame-ancestors` header and compared
 * with `event.origin`, both of which want exactly an origin.
 */
export function editorOrigin(value: string | null | undefined): string | null {
	if (!value) return null
	let url: URL
	try {
		url = new URL(value)
	} catch {
		return null
	}
	if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
	if (url.username || url.password) return null
	if (value.replace(/\/$/, '') !== url.origin) return null
	return url.origin
}

/** A draft as the panel posts it: the document, every section, hidden ones included. */
export type DraftDocument = {
	theme?: string
	/** The draft's design tokens (D127), applied over the page as they are edited. */
	theme_settings?: Record<string, unknown> | null
	sections: { id: string; type: string; enabled?: boolean; settings?: Record<string, unknown> }[]
}

export type EditorMessage = { type: 'draft'; document: DraftDocument } | { type: 'saved' } | { type: 'select'; id: string | null }

/**
 * The panel's message, when event is one, or null. `parent` is the window that framed this page;
 * a message from any other window or origin is not the panel's, whatever it says.
 */
export function editorMessage(
	event: { origin: string; source: unknown; data: unknown },
	expectedOrigin: string | null,
	parent: unknown
): EditorMessage | null {
	if (!expectedOrigin || event.origin !== expectedOrigin) return null
	if (!parent || event.source !== parent) return null
	const data = event.data as Record<string, unknown> | null
	if (!data || typeof data !== 'object' || data.source !== EDITOR_SOURCE) return null
	switch (data.type) {
		case 'draft': {
			const doc = data.document as DraftDocument | undefined
			if (!doc || !Array.isArray(doc.sections)) return null
			return { type: 'draft', document: doc }
		}
		case 'saved':
			return { type: 'saved' }
		case 'select':
			return { type: 'select', id: typeof data.id === 'string' ? data.id : null }
	}
	return null
}

/**
 * The sections to draw for a posted draft: the shown ones, in the draft's order, with settings as
 * posted. A product grid's products cannot come from the panel — prices and stock are the
 * catalogue's — so each grid keeps the products the engine last resolved for the same section id,
 * and the page re-reads them once the panel says the draft is saved. A collection list keeps its
 * collections the same way.
 */
export function draftSections(draft: DraftDocument | null | undefined, resolved: ComposerSection[] | null | undefined): ComposerSection[] {
	const products = new Map((resolved ?? []).map((s) => [s.id, s.products]))
	const collections = new Map((resolved ?? []).map((s) => [s.id, s.collections]))
	const out: ComposerSection[] = []
	for (const s of draft?.sections ?? []) {
		if (!s || typeof s.id !== 'string' || typeof s.type !== 'string' || s.enabled === false) continue
		const settings = s.settings && typeof s.settings === 'object' && !Array.isArray(s.settings) ? s.settings : {}
		const section: ComposerSection = { id: s.id, type: s.type, settings }
		if (s.type === 'product-grid') section.products = products.get(s.id) ?? []
		if (s.type === 'collection-list') section.collections = collections.get(s.id) ?? []
		out.push(section)
	}
	return out
}

/** What the page posts to the panel: that it is listening, and which section was clicked. */
export function storefrontMessage(type: 'ready' | 'select', id?: string) {
	return type === 'select' ? { source: STOREFRONT_SOURCE, type, id } : { source: STOREFRONT_SOURCE, type }
}
