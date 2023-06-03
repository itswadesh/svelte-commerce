import { ProductService, ReviewService } from '$lib/services'
import { redirect } from '@sveltejs/kit'

const isServer = import.meta.env.SSR // get the SSR value

export async function load({ params, url, parent }) {
	const { slug } = params
	const { zip, sid, origin, store, me } = await parent()
	if (store?.isSecureCatalogue && !me) {
		throw redirect(307, `/auth/login?ref=${url?.pathname}`)
	}
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
				origin,
				page,
				server: isServer,
				slug,
				storeId
			})
		}
	}
}
