import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, locals, parent, cookies }) {
	let categories = null

	try {
		categories = await gett(`categories?featured=true&store=${locals.store.id}`)

		if (!categories) throw error(404, 'categories not found')
		// cookies.set('cache-control', 'public, max-age=200')
		return { categories }
	} catch (e) {
		return { categories: [] }
	}
}
