<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'

	const productState = useProductState()

	const currency = $derived(page.data?.store?.currency)
	const product = $derived(page.data?.product)
	const variant = $derived(productState.selectedVariant)

	const price = $derived(variant?.price || product?.price)
	const mrp = $derived(variant?.price ? variant?.mrp : product?.mrp)
	const discounted = $derived(Number(mrp) > 0 && Number(mrp) > Number(price))
	const discountPct = $derived(discounted ? Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100) : 0)

	// The note was printed for every store regardless of the tax flag already sitting in page data.
	// This store is configured tax-exclusive, so the shopper was told the listed price was final and
	// then charged tax at checkout. It now says so only when the store actually prices inclusive;
	// there is no "calculated at checkout" line, because no cart or checkout surface in this
	// codebase shows a tax row that would back the promise.
	const includesTax = $derived(currency?.includesTax === true)
</script>

<div class="edp-pricewrap flex flex-col">
	<div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
		<div class="edp-price text-lg font-semibold text-foreground sm:text-xl" data-testid="product-price">
			{formatPrice(price, currency?.code)}
		</div>

		{#if discounted}
			<div class="edp-mrp text-sm text-muted-foreground line-through">
				{formatPrice(mrp, currency?.code)}
			</div>
			<div class="edp-off text-sm font-semibold text-success">
				{discountPct}% off
			</div>
		{/if}

		{#if includesTax}
			<span class="edp-tax w-fit text-sm font-normal text-muted-foreground">Inclusive of all taxes</span>
		{/if}
	</div>
</div>

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-price) {
		font-family: var(--ed-body);
		/* Was a flat 1.6rem (25.6px) at every width, which made the price LARGER than the product
		   title on a phone. 20-22.4px keeps it second in the hierarchy, where it belongs. */
		font-size: clamp(1.25rem, 1.6vw, 1.4rem);
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-mrp) {
		font-size: 0.875rem;
		color: var(--ed-soft);
		text-decoration: line-through;
	}

	:global([data-theme='default'] .edp-off) {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: hsl(var(--success));
	}

	:global([data-theme='default'] .edp-tax) {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--ed-soft);
	}
</style>
