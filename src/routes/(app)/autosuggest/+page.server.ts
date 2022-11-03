import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, locals }) {
	const { store } = await parent()
	const { slug } = params
	let categories = null

	try {
		categories = await gett(`categories?store=${locals.store.id}&featured=true`)

		if (!categories) throw error(404, 'categories not found')
		// cookies.set('cache-control', 'public, max-age=200')
	} catch (e) {
		// console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', e)
	} finally {
		return { categories }
	}
}
