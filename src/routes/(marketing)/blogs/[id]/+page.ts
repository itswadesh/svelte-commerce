import { BlogService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ params, parent }) {
	const { id } = params
	const { storeId, origin } = await parent()
	const blog = await BlogService.fetchBlog({ id, storeId, origin })

	const latestBlogs = await BlogService.fetchLatestBlogs({ storeId, origin })

	if (blog) {
		return { blog, latestBlogs }
	}

	throw error(404, 'Blog not found')
}
