import { BlogService } from '$lib/services'

export async function load({ parent }) {
	const { storeId, origin } = await parent()
	let err, blogs, count

	try {
		const res = await BlogService.fetchBlogs({ storeId, origin })
		blogs = res
	} catch (e) {
		err = e
	} finally {
	}
	return { err, blogs, count }
}
