<script>
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'

	const productState = useProductState()
</script>

<div class="intra-gap flex flex-col">
	<div class="gap-1 flex flex-wrap items-baseline lg:flex-nowrap">
		<div class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
			{formatPrice(productState.selectedVariant?.price || page.data?.product?.price, page?.data?.store?.currency?.code)}
		</div>

		{#if productState.selectedVariant?.price}
			{#if productState.selectedVariant?.mrp && productState.selectedVariant?.mrp > productState.selectedVariant?.price}
				<div class="text-sm text-muted font-semibold line-through decoration-muted">
					{formatPrice(productState.selectedVariant?.mrp, page?.data?.store?.currency?.code)}
				</div>
				<div class="text-lg tracking-tight font-semibold px-2 text-success">
					{Math.round(((productState.selectedVariant?.mrp - productState.selectedVariant?.price) / productState.selectedVariant?.mrp) * 100)}% OFF
				</div>
			{/if}
		{:else if page.data?.product?.price}
			{#if page.data?.product?.mrp && page.data?.product?.mrp > page.data?.product?.price}
					<div class="text-sm text-muted font-semibold line-through decoration-muted">
					{formatPrice(page.data?.product?.mrp, page?.data?.store?.currency?.code)}
				</div>
				<div class="text-lg tracking-tight font-semibold px-2 text-success">
					{Math.round(((page.data?.product?.mrp - page.data?.product?.price) / page.data?.product?.mrp) * 100)}% Off
				</div>
			{/if}
		{/if}
			<span class="w-fit text-sm font-medium text-900">Inclusive of all taxes</span>
	</div>

</div>
