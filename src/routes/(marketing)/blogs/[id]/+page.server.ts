import { fetchBlog, fetchLatestBlogs } from '$lib/services/BlogService'
import { error } from '@sveltejs/kit'

export async function load({ params, locals }) {
	const { id } = params

	const blog = await fetchBlog({ id })

	const latestBlogs = await fetchLatestBlogs({ storeId: locals.store?.id })

	if (blog) {
		return { blog, latestBlogs }
	}

	throw error(404, 'Blog not found')
}
