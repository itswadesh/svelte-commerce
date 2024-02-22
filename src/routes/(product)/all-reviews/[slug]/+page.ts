import { ReviewService } from '$lib/services'

const isServer = import.meta.env.SSR

export async function load({ params, parent, url }) {
	const { slug } = params
	const { sid, origin, storeId } = await parent()

	return {
		pid: slug,
		productReviews: ReviewService.fetchProductReviews({
			page: url?.searchParams.get('page') || 1,
			slug,
			origin,
			storeId,
			server: isServer,
			sid
		})
	}
}
