import type { Product, Variant } from '$lib/core/types'

/**
 * This function stores the product and variant details to the recently viewed list in local storage.
 * @note Check if executed in the browser environment, since localStorage is not available in SSR.
 *
 * @param product Product object
 * @param variant Variant object
 * @returns Nothing
 */
export const storeProductToRecentlyViewed = async ({ product, variant }: { product: Product; variant: Variant }) => {
	const localRecentlyViewed = localStorage.getItem(`recently_viewed`)

	let recentlyViewed: any[] = []
	if (!!localRecentlyViewed && localRecentlyViewed !== 'undefined') {
		recentlyViewed = JSON.parse(localRecentlyViewed)
	}

	if (recentlyViewed.find((x: Record<string, any>) => x?.id === product?.id)) {
		return
	} else if (product?.thumbnail && product?.title && variant?.price) {
		const prod = {
			...product,
			hasStock: variant?.stock > 0 || product?.stock > 0,
			variants: [{ ...variant }]
		}

		if (recentlyViewed?.length > 10) {
			recentlyViewed.shift()
		}

		const resvw = [...recentlyViewed]
		resvw.push(prod)
		recentlyViewed = resvw

		localStorage.setItem(`recently_viewed`, JSON.stringify(recentlyViewed))
	}
}
