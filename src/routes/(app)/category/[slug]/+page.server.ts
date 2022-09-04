import { getAPI } from '$lib/util/api'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, setHeaders }) {
	const { store } = await parent()
	try {
		const { slug } = params
		const category = await getAPI(`categories/${slug}`)
		if (category) {
			setHeaders({
				'cache-control': 'public, max-age=300'
			})
			return { category }
		}
	} catch (e) {
		throw error(400, e?.message)
	}

	throw error(404, 'Category not found')
}
