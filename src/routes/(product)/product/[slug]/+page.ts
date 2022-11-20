// import { getCache, setCache } from '$lib/server/redis'
import { PopularityService, ProductService, ReviewService, WishlistService } from '$lib/services'

const isServer = import.meta.env.SSR // get the SSR value

export async function load({ params, url, parent }) {
	const { slug } = params
	const { zip, sid, origin, store, me } = await parent()
	const isCors = store?.isCors
	const page = url.searchParams.get('page') || 1
	const storeId = store?.id

	const getProductDetails = async () => {
		// const p1 = `es/products/${slug}?store=${storeId}`
		// const cached = await getCache(p1)
		// if (cached) {
		// 	return cached
		// }

		const product = await ProductService.fetchProduct({
			isCors,
			origin,
			sid,
			slug,
			storeId
		})

		if (me) {
			const isWishlisted = await WishlistService.checkWishlist({
				pid: product?._id || product?.id,
				vid: product?._id || product?.id,
				isCors,
				origin,
				sid,
				storeId,
			})

			// console.log('isWishlisted', isWishlisted);

			product.isWishlisted = isWishlisted
		} else {
			product.isWishlisted = false
		}

		// Enabling cache-control will not refresh cart qty indicator
		// setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}` }) // This is to tell Cloudflare to store in its own cache
		// setCache(p1, product)


		const updatedPopularityRes = await PopularityService.updatePopulatiry({
			pid: product?._id || product?.id,
			isCors,
			origin,
			sid,
			storeId,
		})

		// console.log('updated popularity res', updatedPopularityRes);

		return product
	}

	const getMoreProductDetails = async () => {
		// const p2 = `es/products2/${slug}?store=${storeId}`
		// const cached = await getCache(p2)
		// if (cached) {
		// 	return cached
		// }
		const products2 = await ProductService.fetchProduct2({
			isCors,
			origin,
			server: isServer,
			slug,
			storeId
		})
		// setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}` }) // This is to tell Cloudflare to store in its own cache
		// setCache(p2, products2)
		return products2
	}

	const getProductReviews = async () => {
		// const r = `reviews/product-reviews?slug=${slug}&page=${page}&sort=-createdAt&store=${storeId}`
		// const cached = await getCache(r)
		// if (cached) {
		// 	return cached
		// }
		const reviews = await ReviewService.fetchProductReviews({
			isCors,
			origin,
			page,
			server: isServer,
			slug,
			storeId
		})
		// setHeaders({ 'cache-control': `max-age=${CACHE_DURATION}` }) // This is to tell Cloudflare to store in its own cache
		// setCache(r, reviews)
		return reviews
	}

	return {
		product: getProductDetails(),
		deliveryDetails: zip,
		streamed: {
			moreProductDetails: getMoreProductDetails(),
			productReviews: getProductReviews()
		}
	}
}
