import { fetchCategory } from '$lib/services/CategoryService'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, locals, cookies }) {
	try {
		const { slug } = params
		const category = await fetchCategory({id:slug,server:true})
		if (category) {
			return { category }
		}
	} catch (e) {
		throw error(400, e?.message)
	}

	throw error(404, 'Category not found')
}
