<script lang="ts">
	// Why the bag cannot be ordered yet (GoCommerce D271): the store has paused orders, or the bag is
	// under its minimum. Renders nothing while neither applies.
	import type { OrderBlock } from '$lib/order/rules'
	import { formatPrice } from '$lib/utils/price'
	import { CircleAlert } from '@lucide/svelte'
	import { slide } from '$lib/motion'

	let { block, currency = '', class: className = '' }: { block: OrderBlock; currency?: string; class?: string } = $props()
</script>

{#if block}
	<div
		role="status"
		transition:slide
		class="flex items-start gap-2 rounded-radius border border-warning/40 bg-warning/10 p-3 text-sm text-foreground {className}"
	>
		<CircleAlert class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
		{#if 'paused' in block}
			<div>
				<p class="font-semibold">Not taking orders right now</p>
				{#if block.paused}<p class="mt-0.5 text-muted-foreground">{block.paused}</p>{/if}
			</div>
		{:else}
			<p>
				The minimum order is <span class="font-semibold tabular-nums">{formatPrice(block.minimum, currency)}</span>. Add
				<span class="font-semibold tabular-nums">{formatPrice(block.short, currency)}</span> more to place it.
			</p>
		{/if}
	</div>
{/if}
