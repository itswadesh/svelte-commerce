import { fetchBlogs } from '$lib/services/BlogService'

export async function load({ url, params, fetch, locals, cookies }) {
	let err, blogs, count

	try {
		const res = await fetchBlogs({ storeId: locals.store?.id, server: true })
		blogs = res?.data
		count = res?.count
	} catch (e) {
		err = e
	} finally {
	}
	return { err, blogs, count }
}
