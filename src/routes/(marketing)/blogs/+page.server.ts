import { BlogService } from '$lib/services'

export async function load({ cookies, fetch, locals, params, parent, url }) {
	const { me, origin, sid, store, storeId } = locals

	const currentPage = +url.searchParams.get('page') || 1
	const query = url.searchParams
	let blogs = {}
	let err = null

	try {
		blogs = await BlogService.fetchBlogs({
			origin,
			query: query.toString(),
			storeId
		})
	} catch (e) {
		err = e
	} finally {
	}

	return { err, blogs, currentPage }
}
