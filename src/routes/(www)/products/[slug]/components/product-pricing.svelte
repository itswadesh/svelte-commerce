<script>
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/product'
	import { formatPrice } from '$lib/core/utils'

	const productState = useProductState()
</script>

<div class="flex flex-col gap-1">
	<div class="flex gap-2">
		<div class="text-xl font-bold">
			{formatPrice(productState.selectedVariant?.price || productState.data?.product?.price, page?.data?.store?.currency?.code)}
		</div>

		{#if productState.selectedVariant?.price}
			{#if productState.selectedVariant?.mrp && productState.selectedVariant?.mrp > productState.selectedVariant?.price}
				<div class="text-md text-gray-500 line-through">
					{formatPrice(productState.selectedVariant?.mrp, page?.data?.store?.currency?.code)}
				</div>
				<div class="text-md truncate font-medium text-[#00b852]">
					{Math.round(((productState.selectedVariant?.mrp - productState.selectedVariant?.price) / productState.selectedVariant?.mrp) * 100)}% OFF
				</div>
			{/if}
		{:else if productState.data?.product?.price}
			{#if productState.data?.product?.mrp && productState.data?.product?.mrp > productState.data?.product?.price}
				<div class="text-xl text-gray-500 line-through">
					{formatPrice(productState.data?.product?.price, page?.data?.store?.currency?.code)}
				</div>
				<div class="truncate text-xl font-medium text-[#00b852]">
					{Math.round(((productState.data?.product?.mrp - productState.data?.product?.price) / productState.data?.product?.mrp) * 100)}% OFF
				</div>
			{/if}
		{/if}
	</div>
	<span class="text-sm text-green-500">Inclusive of all taxes</span>
</div>

