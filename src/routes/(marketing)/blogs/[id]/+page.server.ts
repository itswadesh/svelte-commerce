import { gett } from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
	const { id } = params

	const blog = await gett(`blogs/${id}`)

	const latestBlogs = await gett(`blogs?sort=-updatedAt&limit=10`)

	if (blog) {
		return { blog, latestBlogs }
	}

	throw error(404, 'Blog not found')
}
