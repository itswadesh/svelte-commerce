import { BlogService } from '$lib/core/services/index.js'

// Server-render the blog list so crawlers see real content instead of a
// client-side loading skeleton.
export const load = async ({ fetch, url }: any) => {
	const blogService = new BlogService(fetch)
	const page = Number(url.searchParams.get('page')) || 1
	const q = url.searchParams.get('q') || ''
	try {
		const blogs = await blogService.list({ page, q })
		return { blogs }
	} catch (e) {
		console.error('Error loading /blog:', e)
		return { blogs: { data: [] } }
	}
}
