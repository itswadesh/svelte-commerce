<script lang="ts">
import { onMount } from 'svelte'
import { ProductDetails } from '$lib/theme-config'
import { ProductService, ReviewService, WishlistService } from '$lib/services'
import { page } from '$app/stores'

export let data: any = {}
let moreProductDetails = {}
let productReviews = []

onMount(async () => {
	if (!data.product || !$page.data.me?.active) return
	try {
		const [isWishlisted, moreProductDetails, productReviews] = await Promise.all([
			WishlistService.checkWishlist({
				pid: data.product?._id || data.product?.id,
				vid: data.product?._id || data.product?.id,
				origin,
				storeId: data.product.store
			}),
			ProductService.fetchProduct2({
				id: data.product.slug,
				slug: data.product.slug,
				origin: $page.data.origin,
				storeId: data.product.store
			}),
			ReviewService.fetchProductReviews({
				origin,
				page,
				slug: data.product.slug,
				storeId: data.product.store
			})
		])
		data.product.isWishlisted = isWishlisted
		data.moreProductDetails = moreProductDetails
		data.productReviews = productReviews
	} catch (e) {
		console.log('isWishlisted', e)
	}
})
</script>

<ProductDetails {data} />
