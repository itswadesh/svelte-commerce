<script>
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'

	const productState = useProductState()
</script>

<div class="flex flex-col gap-2 py-2 sm:py-4">
	<div class="flex items-baseline gap-3">
		<div class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
			{formatPrice(productState.selectedVariant?.price || page.data?.product?.price, page?.data?.store?.currency?.code)}
		</div>

		{#if productState.selectedVariant?.price}
			{#if productState.selectedVariant?.mrp && productState.selectedVariant?.mrp > productState.selectedVariant?.price}
				<div class="text-lg text-gray-400 line-through decoration-gray-300">
					{formatPrice(productState.selectedVariant?.mrp, page?.data?.store?.currency?.code)}
				</div>
				<div class="text-sm font-bold uppercase tracking-widest text-orange-600">
					{Math.round(((productState.selectedVariant?.mrp - productState.selectedVariant?.price) / productState.selectedVariant?.mrp) * 100)}% OFF
				</div>
			{/if}
		{:else if page.data?.product?.price}
			{#if page.data?.product?.mrp && page.data?.product?.mrp > page.data?.product?.price}
				<div class="text-lg text-gray-400 line-through decoration-gray-300">
					{formatPrice(page.data?.product?.mrp, page?.data?.store?.currency?.code)}
				</div>
				<div class="text-sm font-bold uppercase tracking-widest text-orange-600">
					{Math.round(((page.data?.product?.mrp - page.data?.product?.price) / page.data?.product?.mrp) * 100)}% OFF
				</div>
			{/if}
		{/if}
	</div>
	<span class="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded w-fit">Inclusive of all taxes</span>
</div>

