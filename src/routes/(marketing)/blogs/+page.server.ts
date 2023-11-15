import { BlogService } from '$lib/services'

export async function load({ url, params, fetch, locals, cookies }) {
	let err, blogs, count

	try {
		const res = await BlogService.fetchBlogs({ storeId: locals.storeId, server: true })
		blogs = res?.data
		count = res?.count
	} catch (e) {
		err = e
	} finally {
	}
	return { err, blogs, count }
}
