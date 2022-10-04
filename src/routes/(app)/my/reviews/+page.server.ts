import { getAPI } from '$lib/util/api'
import { gett } from '$lib/utils'
import { error, redirect } from '@sveltejs/kit'

export async function load({ request }) {
	try {
		const reviews = await gett(`reviews/my`, request.headers.get('cookie'))
		if (reviews) {
			return { reviews: reviews.data }
		}
		throw error(404, 'Reviews not found')
	} catch (e) {
		if (e.status === 401) {
			throw redirect(307, '/auth/otp-login')
		}
	}
}
