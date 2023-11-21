import { BlogService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ params, parent }) {
	const { id } = params
	const { storeId, origin } = await parent()

	const blog = await BlogService.fetchBlog({ id, storeId, origin })

	if (blog) {
		return {
			blog,
			streamed: {
				latestBlogs: BlogService.fetchLatestBlogs({ storeId, origin })
			}
		}
	}

	throw error(404, 'Blog not found')
}
