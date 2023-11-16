import { BlogService } from '$lib/services'

export async function load({ locals }) {
	let err, blogs, count

	try {
		const res = await BlogService.fetchBlogs({ storeId: locals.storeId })
		blogs = res
	} catch (e) {
		err = e
	} finally {
	}
	return { err, blogs, count }
}
