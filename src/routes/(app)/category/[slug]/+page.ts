import { CategoryService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ params, url, parent }) {
	try {
		const { storeId, origin, sid } = await parent()

		const { slug } = params
		const id = url.searchParams.get('id')
		const category = await CategoryService.fetchCategory({
			storeId,
			sid,
			id: slug || id,
			origin
		})
		if (category) {
			return { category }
		}
	} catch (e) {
		throw error(400, e?.message)
	}

	throw error(404, 'Category not found')
}
