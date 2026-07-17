import { BlogService } from '$lib/core/services/index.js'
import { error } from '@sveltejs/kit'

// Server-render the post (SEO + social previews) and return a genuine 404 for
// unknown slugs instead of a soft "not found" state rendered client-side.
export const load = async ({ fetch, params }: any) => {
	const blogService = new BlogService(fetch)
	try {
		const blog = await blogService.getOne(params.slug)
		if (!blog || (blog as any)?.error) throw error(404, 'Blog post not found')
		return { blog }
	} catch (e) {
		throw error(404, 'Blog post not found')
	}
}
