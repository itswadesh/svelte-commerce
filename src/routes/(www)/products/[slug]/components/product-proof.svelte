<script lang="ts">
	import { page } from '$app/state'
	import { Flame, Gift } from '@lucide/svelte'
	import { fade } from '$lib/motion'
	import { soldLabel } from '$lib/product/conversion'

	/**
	 * Under the price (GoCommerce D134): how many have sold, and the shop's free gift note.
	 *
	 * The count is the engine's: units on real orders, rounded down, present only when the shop
	 * shows counts and the product has passed its threshold. Nothing is estimated here, and no
	 * count draws nothing. The gift note is the shop's own words, drawn as text.
	 */
	const product = $derived(page.data?.product)
	const sold = $derived(soldLabel(product?.soldAtLeast))
	const gift = $derived(typeof product?.freeGift === 'string' ? product.freeGift.trim() : '')
</script>

{#if sold || gift}
	<div class="flex flex-wrap items-center gap-2" data-testid="product-proof" in:fade>
		{#if sold}
			<span class="pp-sold inline-flex items-center gap-1 text-sm font-medium text-foreground" data-testid="sold-count">
				<Flame class="size-4 text-destructive" aria-hidden="true" />
				{sold}
			</span>
		{/if}
		{#if gift}
			<span
				class="pp-gift inline-flex max-w-full items-center gap-1.5 rounded-radius border border-success/40 bg-success/10 px-2 py-1 text-xs font-semibold text-success"
				data-testid="free-gift"
			>
				<Gift class="size-3.5 shrink-0" aria-hidden="true" />
				<span class="min-w-0 break-words">{gift}</span>
			</span>
		{/if}
	</div>
{/if}
