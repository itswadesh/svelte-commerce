import { wishlistService } from '$lib/core/services'

/**
 * Checks if there are any pending wishlist actions in local storage and executes them if the user is logged in.
 *
 * @param userId User ID of the logged-in user
 * @returns
 */
export const checkPendingWishlistActions = async (userId: string) => {
	const pendingProductId = localStorage.getItem('pendingWishlistProductId')
	const pendingVariantId = localStorage.getItem('pendingWishlistVariantId')

	if (pendingProductId && pendingVariantId && userId) {
		const res = await wishlistService.toggleWishlist({
			productId: pendingProductId,
			variantId: pendingVariantId
		})

		// Clear the pending items
		localStorage.removeItem('pendingWishlistProductId')
		localStorage.removeItem('pendingWishlistVariantId')

		if (res?.id) return res?.active
	}
}

/**
 * This function stores the product and variant details to the pending wishlist in local storage.
 *
 * @param productId Product ID to be added to the wishlist
 * @param variantId Variant ID to be added to the wishlist
 */
export const addPendingWishlistAction = ({ productId, variantId }: { productId: string; variantId: string }) => {
	localStorage.setItem('pendingWishlistProductId', productId)
	localStorage.setItem('pendingWishlistVariantId', variantId)
}

