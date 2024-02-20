import { services } from '@misiki/litekart-utils'

const isServer = import.meta.env.SSR

export async function load({ params, parent, url }) {
	const { slug } = params
	const { sid, origin, storeId } = await parent()

	return {
		pid: slug,
		productReviews: services.ReviewService.fetchProductReviews({
			page: url?.searchParams.get('page') || 1,
			slug,
			origin,
			storeId,
			server: isServer,
			sid
		})
	}
}
