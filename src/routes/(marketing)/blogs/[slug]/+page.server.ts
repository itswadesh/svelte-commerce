import { error } from '@sveltejs/kit'
import { services } from '@misiki/litekart-utils'

export async function load({ params, locals }) {
	const { slug } = params

	try {
		const [blog, latestBlogs] = await Promise.all([
			services.BlogService.fetchBlog({ slug, storeId: locals.storeId }),
			services.BlogService.fetchLatestBlogs({ storeId: locals.storeId })
		])

		if (blog) {
			return { blog, latestBlogs }
		}
	} catch (e) {
		error(404, 'Blog not found')
	} finally {
	}
}
