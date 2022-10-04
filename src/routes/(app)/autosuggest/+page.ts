import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, cookies }) {
	const { store } = await parent()
	const { slug } = params
	let categories = null

	try {
		categories = await gett(`categories?featured=true`)

		if (!categories) throw error(404, 'categories not found')
		// cookies.set('cache-control', 'public, max-age=200')
	} catch (e) {
	} finally {
		return { categories }
	}
}
