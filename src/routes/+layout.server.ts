import { error } from '@sveltejs/kit'
import { layoutServer } from '$lib/core/load-functions/index.js'
import { resolveStorefrontTheme } from '$lib/theme/index.js'

export async function load(event: any) {
	// No store maps to this domain (flagged in hooks). Render the app's 404 page instead of a 500.
	if (event.locals?.storeNotFound) {
		throw error(404, 'Store not found')
	}
	const data = await layoutServer(event)
	return {
		...data,
		theme: resolveStorefrontTheme(data?.store)
	}
}
