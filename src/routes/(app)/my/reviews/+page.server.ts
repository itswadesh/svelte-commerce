import { error, redirect } from '@sveltejs/kit'
import { ReviewService } from '$lib/services'

export async function load({ cookies, locals }) {
	try {
		const res = await ReviewService.fetchReviews({
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})

		if (res) {
			return res
		}
		throw error(404, 'Reviews not found')
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, locals.store?.loginUrl)
		}
	}
}
