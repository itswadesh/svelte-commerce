<script lang="ts">
	import { getCartState } from "@misiki/kitcommerce-core/stores"
  import { formatPrice } from "@misiki/kitcommerce-core/utils";
  import { page } from "$app/state";
	import { tweened } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'
	import { Tag } from "@lucide/svelte"

	const { block } = $props()

  const cartState = getCartState()

	const totalSavings = $derived(
		(cartState.cart?.lineItems || []).reduce((acc, item) => acc + Math.max(0, (item.mrp || item.price) - item.price) * item.qty, 0) +
			(cartState.cart?.discountAmount || 0)
	)

	const animatedSavings = tweened(0, {
		duration: 1000,
		easing: cubicOut
	})

	$effect(() => {
		animatedSavings.set(totalSavings)
	})
</script>

{#if totalSavings > 0}
	<div class="flex items-center justify-between rounded-radius border border-success/40 bg-success/5 px-4 py-3">
		<div class="flex items-center gap-2">
			<Tag class="size-3.5 text-success" />
			<span class="text-sm font-medium text-success"
				>You saved <span class="font-bold">{formatPrice($animatedSavings, page?.data?.store?.currency?.code)}</span> on this order.</span
			>
		</div>
	</div>
{/if}
