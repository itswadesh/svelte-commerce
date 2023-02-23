import { fetchFaqs } from '$lib/services/FaqService'

export async function load({ request, locals, parent, cookies }) {
	let loading = false,
		err,
		faqs,
		count

	try {
		loading = true
		const res = await fetchFaqs({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})
		faqs = res?.data
		count = res?.count
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
	return { loading, err, faqs, count }
}
