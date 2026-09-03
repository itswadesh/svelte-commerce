import { error } from '@sveltejs/kit'
import { layoutServer } from '$lib/core/load-functions/index.js'
import { resolveStorefrontTheme } from '$lib/theme/index.js'
import { publishedCmsSlugs } from '$lib/components/common/cms-pages.js'

export async function load(event: any) {
	// No store maps to this domain (flagged in hooks). Render the app's 404 page instead of a 500.
	if (event.locals?.storeNotFound) {
		throw error(404, 'Store not found')
	}
	const data = await layoutServer(event)
	return {
		...data,
		theme: resolveStorefrontTheme(data?.store),
		// Which CMS-backed policy pages this store actually publishes, so the footer never links one
		// that 404s. Resolved once per server process, and empty when the backend has no CMS.
		cmsPages: await publishedCmsSlugs()
	}
}
