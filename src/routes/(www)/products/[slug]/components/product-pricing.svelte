<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'

	const productState = useProductState()
</script>

<div class="intra-gap flex flex-col edp-pricewrap">
	<div class="gap-1 flex flex-wrap items-baseline lg:flex-nowrap">
		<div class="text-xl font-semibold  text-gray-900 dark:text-white edp-price">
			{formatPrice(productState.selectedVariant?.price || page.data?.product?.price, page?.data?.store?.currency?.code)}
		</div>

		{#if productState.selectedVariant?.price}
			{#if productState.selectedVariant?.mrp && productState.selectedVariant?.mrp > productState.selectedVariant?.price}
				<div class="text-sm line-through edp-mrp">
					{formatPrice(productState.selectedVariant?.mrp, page?.data?.store?.currency?.code)}
				</div>
				<div class="text-lg  px-2 text-success edp-off">
					{Math.round(((productState.selectedVariant?.mrp - productState.selectedVariant?.price) / productState.selectedVariant?.mrp) * 100)}% OFF
				</div>
			{/if}
		{:else if page.data?.product?.price}
			{#if page.data?.product?.mrp && page.data?.product?.mrp > page.data?.product?.price}
					<div class="text-sm line-through edp-mrp">
					{formatPrice(page.data?.product?.mrp, page?.data?.store?.currency?.code)}
				</div>
				<div class="text-lg  px-2 text-success edp-off">
					{Math.round(((page.data?.product?.mrp - page.data?.product?.price) / page.data?.product?.mrp) * 100)}% Off
				</div>
			{/if}
		{/if}
			<span class="w-fit text-sm font-medium text-900 ml-1 edp-tax">Inclusive of all taxes</span>
	</div>

</div>

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-price) {
		font-family: var(--ed-body);
		font-size: 1.6rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-mrp) {
		font-size: 0.9rem;
		color: var(--ed-soft);
		text-decoration: line-through;
	}

	:global([data-theme='default'] .edp-off) {
		padding: 0;
		margin-left: 4px;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #2f7d4f;
	}

	:global([data-theme='default'] .edp-tax) {
		margin-left: 8px;
		font-size: 0.76rem;
		font-weight: 400;
		color: var(--ed-soft);
	}
</style>
