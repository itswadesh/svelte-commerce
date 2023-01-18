import { gett } from '$lib/utils/server'

export async function load({ url, params, fetch, parent, cookies }) {
	const { store } = await parent()
	let loading = false,
		err,
		blogs,
		count

	try {
		loading = true
		const res = await gett(`blogs?store=${store?.id}`)
		blogs = res?.data
		count = res?.count
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
	return { loading, err, blogs, count }
}
