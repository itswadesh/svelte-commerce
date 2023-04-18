import { error } from '@sveltejs/kit'
import { ReviewService } from '$lib/services'
import type { Error, ProductReview } from '$lib/types'

export async function load({ params, parent, url, cookies, locals, request }) {
	const { slug } = params
	const brandId = url.searchParams.get('brandIc')
	let productReviews: ProductReview = {}

	try {
		productReviews = await ReviewService.fetchProductReviews({
			page: url?.searchParams.get('page') || 1,
			slug: slug,
			storeId: locals.store?.id,
			server: true,
			sid: cookies.get('connect.sid')
		})

		if (!productReviews) throw error(404, 'Product not found')

		// cookies.set('cache-control', 'public, max-age=200')

		return { productReviews, pid: slug }
	} catch (e) {
		throw error(e.status, e.message || 'Not found')
	}
}
