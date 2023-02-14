import { fetchCategory } from '$lib/services/CategoryService'
import { error } from '@sveltejs/kit'

export async function load({ params, url, locals, cookies }) {
	try {
		const { slug } = params
		const id = url.searchParams.get('id')
		const category = await fetchCategory({ storeId: locals.store?.id, slug, id, server: true })
		if (category) {
			return { category }
		}
	} catch (e) {
		throw error(400, e?.message)
	}

	throw error(404, 'Category not found')
}
