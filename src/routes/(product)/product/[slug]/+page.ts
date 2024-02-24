// import { getCache, setCache } from '$lib/server/redis'
import { ProductService, ReviewService, WishlistService } from '$lib/services'
import { error } from '@sveltejs/kit'

export async function load({ params, url, parent }) {
	const { slug } = params
	const { zip, sid, origin, store, storeId, me } = await parent()
	const page = url.searchParams.get('page') || 1

	const getProductDetails = async () => {
		try {
			const product = await ProductService.fetchProduct({
				origin,
				sid,
				slug,
				id: slug,
				storeId
			})
			if (!product) {
				error(404, { message: 'Product Not found' })
			}
			return product
		} catch (e) {
			console.log(e)
			error(404, { message: 'Product Not found' })
		}
		// Enabling cache-control will not refresh cart qty indicator
		// setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}` }) // This is to tell Cloudflare to store in its own cache
		// setCache(p1, product)

		// Removed on 11-Oct-2023 as it was slow down the navigation
		// const updatedPopularityRes = await PopularityService.updatePopulatiry({
		// 	pid: product?._id || product?.id,
		// 	origin,
		// 	sid,
		// 	storeId,
		// })
	}

	const products2 = ProductService.fetchProduct2({
		id: slug,
		slug,
		origin,
		storeId
	})

	const reviews = ReviewService.fetchProductReviews({
		origin,
		page,
		slug,
		storeId
	})

	return {
		product: await getProductDetails(),
		deliveryDetails: zip,
		streamed: {
			moreProductDetails: products2,
			productReviews: reviews
		}
	}
}
