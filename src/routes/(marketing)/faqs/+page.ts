import { gett } from '$lib/utils/server'

export async function load({ url, params, fetch, parent, cookies }) {
	const { store } = await parent()
	let loading = false,
		err,
		faqs,
		count

	try {
		loading = true
		const res = await gett(`faqs?store=${store?.id}`)
		faqs = res?.data
		count = res?.count
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
	// cookies.set('cache-control', 'public, max-age=200')

	return { loading, err, faqs, count }
}
