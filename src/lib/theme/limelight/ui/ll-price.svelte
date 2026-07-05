<script lang="ts">
	import { formatPrice } from '$lib/core/utils'

	/**
	 * Limelight price primitive.
	 * Plum selling price with an optional struck-through MRP, matching the
	 * quiet, un-bold luxury treatment of the source product listings.
	 */
	let {
		price,
		mrp,
		currencyCode = '',
		align = 'center',
		size = 'md'
	}: {
		price: number
		mrp?: number
		currencyCode?: string
		align?: 'center' | 'start'
		size?: 'sm' | 'md' | 'lg'
	} = $props()

	const hasDiscount = $derived(!!mrp && !!price && mrp > price)
</script>

<div class="ll-price ll-price--{size}" style="justify-content: {align === 'center' ? 'center' : 'flex-start'};">
	<span class="ll-price-now">{formatPrice(price, currencyCode)}</span>
	{#if hasDiscount}
		<span class="ll-price-was">{formatPrice(mrp as number, currencyCode)}</span>
	{/if}
</div>

<style>
	.ll-price {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.ll-price-now {
		color: var(--limelight-plum, #460032);
		font-family: var(--font-body);
		font-weight: 500;
		letter-spacing: 0.02em;
	}

	.ll-price-was {
		color: #8a8a8a;
		text-decoration: line-through;
		font-size: 0.85em;
	}

	.ll-price--sm .ll-price-now {
		font-size: 13px;
	}
	.ll-price--md .ll-price-now {
		font-size: 15px;
	}
	.ll-price--lg .ll-price-now {
		font-size: 22px;
	}
</style>
