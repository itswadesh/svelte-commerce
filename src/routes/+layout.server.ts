import { error } from '@sveltejs/kit'
import { layoutServer } from '$lib/core/load-functions/index.js'
import { resolveStorefrontTheme } from '$lib/theme/index.js'
import { publishedCmsSlugs } from '$lib/components/common/cms-pages.js'
import { publishedThemeSettings } from '$lib/composer/theme-settings.js'
import { chromePreview, fetchChrome, withChromeMenus } from '$lib/composer/site-chrome.js'
import { services } from 'kitcommerce.config'

export async function load(event: any) {
	// No store maps to this domain (flagged in hooks). Render the app's 404 page instead of a 500.
	if (event.locals?.storeNotFound) {
		throw error(404, 'Store not found')
	}
	// A `litekart_store_id` cookie makes hooks skip the domain lookup, so a visitor holding one for a
	// store that is gone (or that never existed: the cookie predates its host being resolved) only
	// finds out here, when layoutServer loads the store by that id. Same 404 as the flag above, read
	// structurally for the same reason hooks does: connectors reject with plain `{ message }` objects.
	//
	// A preview of the header or footer (the theme editor's `preview_page`) is read from the request
	// itself rather than event.url, for the reason the theme settings key on the Host header: this
	// load would otherwise re-run on every query change. Read once, it lasts the editor frame's
	// whole visit, which is what a preview of every page's header wants.
	const host = event.request?.headers?.get('host') ?? ''
	const preview = event.request?.url ? chromePreview(new URL(event.request.url)) : null
	const [data, themeSettings, chrome] = await Promise.all([
		layoutServer(event).catch((e: unknown) => {
			const message = (e as { message?: string } | null | undefined)?.message || ''
			if (/not found|404/i.test(message)) throw error(404, 'Store not found')
			throw e
		}),
		// The store's colours, fonts and rounding from the theme editor, for every page. Keyed on the
		// Host header rather than event.url, which would make this load re-run on every query change.
		publishedThemeSettings(services as object, host),
		// The header and footer the shop set in the theme editor (GoCommerce D131), for every page.
		fetchChrome(services as object, host, preview)
	])
	// The editor's origin, when this is a preview of the header or footer the engine accepted: it
	// may frame the page, and only it, and its drafts redraw the part (ChromeEditorBridge).
	const chromeEditor = preview?.editor && chrome[preview.page]?.preview ? { origin: preview.editor, part: preview.page } : null
	if (chromeEditor) {
		try {
			event.setHeaders({ 'content-security-policy': `frame-ancestors ${chromeEditor.origin}` })
		} catch {
			// Already set by the page's own load.
		}
	}
	return {
		...data,
		// A preview's draft may name another menu than the published one, which the connector put in
		// the store; the published choice is already there.
		store: preview ? withChromeMenus(data?.store, chrome) : data?.store,
		chrome,
		chromeEditor,
		theme: resolveStorefrontTheme(data?.store),
		themeSettings,
		// Which CMS-backed policy pages this store actually publishes, so the footer never links one
		// that 404s — a page the store has only drafted included. Remembered per host for a minute,
		// and empty when the backend has no CMS.
		cmsPages: await publishedCmsSlugs(host)
	}
}
