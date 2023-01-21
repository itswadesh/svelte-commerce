import { fetchReviews } from '$lib/services/ReviewService'
import { error, redirect } from '@sveltejs/kit'

export async function load({ cookies, locals }) {
	try {
		const reviews = await fetchReviews({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('sid')
		})
		if (reviews) {
			return { reviews: reviews.data }
		}
		throw error(404, 'Reviews not found')
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, locals.store?.loginUrl)
		}
	}
}
