<script lang="ts">
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { ProductDetails } from '$lib/theme-config'
import { ProductService, ReviewService, WishlistService } from '$lib/services'

export let data: any = {}

onMount(async () => {
	if (data.store.id != 'Medusa') {
		if (!data.product || !$page.data.me?.active) {
			try {
				const [moreProductDetails, productReviews] = await Promise.all([
					ProductService.fetchProduct2({
						id: data.product.slug,
						slug: data.product.slug,
						origin: $page.data.origin,
						sid: $page.data.sid,
						storeId: $page.data.storeId
					}),
					ReviewService.fetchProductReviews({
						page,
						slug: data.product.slug,
						origin: $page.data.origin,
						sid: $page.data.sid,
						storeId: $page.data.storeId
					})
				])

				data.product.isWishlisted = false
				data.moreProductDetails = moreProductDetails
				data.productReviews = productReviews
			} catch (e) {
				console.log('e', e)
			}
		} else {
			try {
				const [isWishlisted, moreProductDetails, productReviews] = await Promise.all([
					WishlistService.checkWishlist({
						pid: data.product?._id || data.product?.id,
						vid: data.product?._id || data.product?.id,
						origin: $page.data.origin,
						sid: $page.data.sid,
						storeId: $page.data.storeId
					}),
					ProductService.fetchProduct2({
						id: data.product.slug,
						slug: data.product.slug,
						origin: $page.data.origin,
						sid: $page.data.sid,
						storeId: $page.data.storeId
					}),
					ReviewService.fetchProductReviews({
						page,
						slug: data.product.slug,
						origin: $page.data.origin,
						sid: $page.data.sid,
						storeId: $page.data.storeId
					})
				])

				data.product.isWishlisted = isWishlisted
				data.moreProductDetails = moreProductDetails
				data.productReviews = productReviews
			} catch (e) {
				console.log('e', e)
			}
		}
	}
})
</script>

<ProductDetails {data} />
