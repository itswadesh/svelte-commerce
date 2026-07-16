<script>
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'

	const productState = useProductState()
</script>

<!-- Fleet rule (no-discount-on-card-pdp): show the selling price ONLY —
     no MRP strikethrough, no "% OFF"/savings copy on the PDP. -->
<div class="intra-gap flex flex-col">
	<div class="gap-1 flex flex-wrap items-baseline lg:flex-nowrap">
		<div class="text-xl font-semibold  text-gray-900 dark:text-white">
			{formatPrice(productState.selectedVariant?.price || page.data?.product?.price, page?.data?.store?.currency?.code)}
		</div>

		<span class="w-fit text-sm font-medium text-900 ml-1">Inclusive of all taxes</span>
	</div>

</div>
