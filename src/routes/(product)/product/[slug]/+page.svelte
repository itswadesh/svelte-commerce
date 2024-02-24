<script>
import { onMount } from 'svelte'
import { ProductDetails } from '$lib/theme-config'
import { WishlistService } from '$lib/services'
import { page } from '$app/stores'

export let data = {}
onMount(async () => {
	if (!data.product || !$page.data.me?.active) return
	try {
		const isWishlisted = await WishlistService.checkWishlist({
			pid: data.product?._id || data.product?.id,
			vid: data.product?._id || data.product?.id,
			origin,
			storeId: data.product.store
		})
		data.product.isWishlisted = isWishlisted
	} catch (e) {
		console.log('isWishlisted', e)
	}
})
</script>

<ProductDetails {data} />
