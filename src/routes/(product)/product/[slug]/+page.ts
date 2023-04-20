import { ProductService, ReviewService } from '$lib/services'

const isServer = import.meta.env.SSR // get the SSR value

export async function load({ params, url, parent }) {
	const { slug } = params
	const { zip, sid, origin, store } = await parent()
	const storeId = store?.id
	const page = url.searchParams.get('page') || 1
	return {
		product: ProductService.fetchProduct({
			origin,
			server: isServer,
			sid,
			slug,
			storeId
		}),

		deliveryDetails: zip,

		streamed: {
			moreProductDetails: ProductService.fetchProduct2({
				origin,
				server: isServer,
				slug,
				storeId
			}),

			productReviews: ReviewService.fetchProductReviews({
				page,
				server: isServer,
				slug,
				storeId
			})
		}
	}
}
