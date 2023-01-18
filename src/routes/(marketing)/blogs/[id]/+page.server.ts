import { fetchBlog, fetchLatestBlogs } from '$lib/services/BlogService'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
	const { id } = params

	const blog = await fetchBlog({id})

	const latestBlogs = await fetchLatestBlogs({})

	if (blog) {
		return { blog, latestBlogs }
	}

	throw error(404, 'Blog not found')
}
