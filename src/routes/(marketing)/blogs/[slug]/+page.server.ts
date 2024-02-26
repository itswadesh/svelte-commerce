import { error } from '@sveltejs/kit'
import { BlogService } from '$lib/services'

export async function load({ params, locals }) {
	const { slug } = params

	try {
		const [blog, latestBlogs] = await Promise.all([
			BlogService.fetchBlog({ slug, storeId: locals.storeId }),
			BlogService.fetchLatestBlogs({ storeId: locals.storeId })
		])

		if (blog) {
			return { blog, latestBlogs }
		}
	} catch (e) {
		error(404, 'Blog not found')
	} finally {
	}
}
