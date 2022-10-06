import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, locals, cookies }) {
	const { store } = locals
	try {
		const { slug } = params
		const category = await gett(`categories/${slug}`)
		if (category) {
			// cookies.set('cache-control', 'public, max-age=200')

			return { category }
		}
	} catch (e) {
		throw error(400, e?.message)
	}

	throw error(404, 'Category not found')
}
