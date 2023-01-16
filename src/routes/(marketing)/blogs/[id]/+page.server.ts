import { gett } from '$lib/utils'
import { error } from '@sveltejs/kit'

export async function load({ params, parent, setHeaders }) {
	const { store } = await parent()
	const { id } = params

	const blog = await gett(`blogs/${id}`)

	const latestBlogs = await gett(`blogs?sort=-updatedAt&limit=10`)

	if (blog) {
		// setHeaders({
		// 	'cache-control': 'public, max-age=300'
		// })

		return { blog, latestBlogs }
	}

	throw error(404, 'Blog not found')
}
