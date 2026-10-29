<script lang="ts">
	import { page } from '$app/state'
	import { cartService } from '$lib/core/services'
	import { formatPrice } from '$lib/utils/price'
	import { fade } from '$lib/motion'
	import { freeDeliveryState, type FreeDelivery } from '$lib/product/upsells'
	import { Truck } from '@lucide/svelte'

	/**
	 * "Add ₹270 more for FREE delivery" (GoCommerce D133). The threshold is the store's own free
	 * delivery rate, read by the engine for the bag's country; with no such rate there is no bar.
	 * Re-asked whenever the subtotal moves.
	 */
	let { subtotal = 0, country = '' }: { subtotal?: number | null; country?: string } = $props()

	let answer = $state<FreeDelivery>(null)
	const currencyCode = $derived(page?.data?.store?.currency?.code)
	const bar = $derived(freeDeliveryState(answer))

	$effect(() => {
		void subtotal
		const where = country
		const svc = cartService as unknown as { getFreeShipping?: (q: { country?: string }) => Promise<FreeDelivery> }
		if (typeof svc.getFreeShipping !== 'function') return
		let live = true
		svc
			.getFreeShipping(where ? { country: where } : {})
			.then((f) => {
				if (live) answer = f ?? null
			})
			.catch(() => {
				if (live) answer = null
			})
		return () => {
			live = false
		}
	})
</script>

{#if bar}
	<div class="fdb mb-4 rounded-radius border border-border bg-background px-4 py-3" in:fade data-testid="free-delivery-bar" role="status">
		<p class="flex items-center gap-2 text-sm text-foreground">
			<Truck class="size-4 shrink-0 {bar.qualifies ? 'text-success' : 'text-muted-foreground'}" aria-hidden="true" />
			{#if bar.qualifies}
				<span><span class="font-semibold text-success">FREE delivery</span> on this order</span>
			{:else}
				<span>Add <span class="font-semibold">{formatPrice(bar.remaining, currencyCode)}</span> more for <span class="font-semibold">FREE delivery</span></span>
			{/if}
		</p>
		<div class="fdb-track mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
			<div class="fdb-fill h-full w-full origin-left rounded-full {bar.qualifies ? 'bg-success' : 'bg-primary-ink'}" style="transform: scaleX({bar.progress})"></div>
		</div>
	</div>
{/if}

<style>
	/* transform, not width: the bar fills without a layout per frame. */
	.fdb-fill {
		transition: transform var(--motion-emphasis, 300ms) cubic-bezier(0.22, 1, 0.36, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		.fdb-fill {
			transition: none;
		}
	}
</style>
