import { error, redirect } from '@sveltejs/kit'
import { ReviewService } from '$lib/services'

export async function load({ cookies, locals, url }) {
	const { store, origin, me, sid } = locals

	if (!me || !sid) {
		throw redirect(307, `${locals.store?.loginUrl}?ref=${url.pathname}${url.search}`)
	}
	try {
		const res = await ReviewService.fetchReviews({
			storeId: store?.id,
			sid,
			origin
		})

		if (res) {
			return res
		}
		throw error(404, 'Reviews not found')
	} catch (e) {
		if (e.status === 401 || e.status === 403) {
			throw redirect(307, locals.store?.loginUrl)
		}

		throw error(e.status, e.message)
	}
}
