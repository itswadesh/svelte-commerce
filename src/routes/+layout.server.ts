import { error } from '@sveltejs/kit'
import { layoutServer } from '$lib/core/load-functions/index.js'
import { resolveStorefrontTheme } from '$lib/theme/index.js'
import { publishedCmsSlugs } from '$lib/components/common/cms-pages.js'

export async function load(event: any) {
	// No store maps to this domain (flagged in hooks). Render the app's 404 page instead of a 500.
	if (event.locals?.storeNotFound) {
		throw error(404, 'Store not found')
	}
	// A `litekart_store_id` cookie makes hooks skip the domain lookup, so a visitor holding one for a
	// store that is gone (or that never existed: the cookie predates its host being resolved) only
	// finds out here, when layoutServer loads the store by that id. Same 404 as the flag above, read
	// structurally for the same reason hooks does: connectors reject with plain `{ message }` objects.
	const data = await layoutServer(event).catch((e: unknown) => {
		const message = (e as { message?: string } | null | undefined)?.message || ''
		if (/not found|404/i.test(message)) throw error(404, 'Store not found')
		throw e
	})
	return {
		...data,
		theme: resolveStorefrontTheme(data?.store),
		// Which CMS-backed policy pages this store actually publishes, so the footer never links one
		// that 404s. Resolved once per server process, and empty when the backend has no CMS.
		cmsPages: await publishedCmsSlugs()
	}
}
