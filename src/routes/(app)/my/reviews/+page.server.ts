import { error, redirect } from '@sveltejs/kit'
import { ReviewService } from '$lib/services'

export async function load({ cookies, locals, url }) {
	const { store, storeId, origin, me, sid } = locals

	if (!me || !sid) {
		throw redirect(307, `/auth/login?ref=${url.pathname}${url.search}`)
	}
	try {
		const res = await ReviewService.fetchReviews({
			storeId,
			sid,
			origin
		})

		if (res) {
			return res
		}
		throw error(404, 'Reviews not found')
	} catch (e) {
		throw redirect(307, '/auth/login')
	}
}
