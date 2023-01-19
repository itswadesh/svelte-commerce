import { fetchFaqs } from '$lib/services/FaqService'

export async function load({ locals }) {
	let loading = false,
		err,
		faqs,
		count

	try {
		loading = true
		const res = await fetchFaqs({ store: locals.store.id })
		faqs = res?.data
		count = res?.count
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
	return { loading, err, faqs, count }
}
