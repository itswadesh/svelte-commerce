import { BlogService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ params, locals }) {
	const { id } = params

	const blog = await BlogService.fetchBlog({ id, server: true })

	const latestBlogs = await BlogService.fetchLatestBlogs({ storeId: locals.store?.id, server: true })

	if (blog) {
		return { blog, latestBlogs }
	}

	throw error(404, 'Blog not found')
}
