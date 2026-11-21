<script lang="ts">
	// Delivery or pickup from the shop (GoCommerce D271), shown only while the store offers pickup.
	// The choice is kept with the bag, so the quick-order page and the address step share it.
	import { getCartState } from '$lib/core/stores/index.js'
	import { cartService } from '$lib/core/services/index.js'
	import { toast } from '@misiki/kitcommerce-core'
	import { Store, Truck } from '@lucide/svelte'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { slide } from '$lib/motion'

	let { address = '' }: { address?: string } = $props()

	const cartState = getCartState()
	const pickup = $derived(!!(cartState?.cart as any)?.pickup)
	let saving = $state<boolean | null>(null)

	async function choose(next: boolean) {
		if (next === pickup || saving !== null || !cartState?.cart?.id) return
		saving = next
		try {
			cartState.cart = await cartService.updateCart2({ cartId: cartState.cart.id, pickup: next })
		} catch (e) {
			toast.error(e instanceof Error ? e.message : 'Could not save your choice. Please try again.')
		} finally {
			saving = null
		}
	}

	const options = [
		{ value: false, label: 'Delivery', hint: 'Delivered to your address', icon: Truck },
		{ value: true, label: 'Pickup from the shop', hint: 'Collect it yourself, no delivery charge', icon: Store }
	]
</script>

<fieldset class="rounded-lg border border-border bg-background p-4 sm:p-6">
	<legend class="sr-only">How do you want your order?</legend>
	<p class="mb-3 text-base font-bold text-foreground" style="font-family: var(--font-body);" aria-hidden="true">How do you want your order?</p>
	<div class="grid gap-2 sm:grid-cols-2">
		{#each options as option (option.label)}
			{@const checked = option.value === pickup}
			<label
				class="motion-press flex min-h-11 cursor-pointer items-start gap-3 rounded-radius border p-3 transition-colors duration-fast ease-standard hover:border-primary focus-within:ring-2 focus-within:ring-ring {checked
					? 'border-primary bg-primary/5'
					: 'border-border'}"
			>
				<input
					type="radio"
					name="fulfilment"
					class="mt-1 size-4 accent-[hsl(var(--primary))]"
					{checked}
					disabled={saving !== null}
					onchange={() => choose(option.value)}
				/>
				<option.icon class="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
				<span class="min-w-0 flex-1">
					<span class="block text-sm font-semibold text-foreground">{option.label}</span>
					<span class="block text-xs text-muted-foreground">{option.hint}</span>
				</span>
				{#if saving === option.value}<Spinner label="Saving your choice" />{/if}
			</label>
		{/each}
	</div>
	{#if pickup && address}
		<div transition:slide class="mt-3 rounded-radius bg-muted/50 p-3 text-sm">
			<p class="font-medium text-foreground">Collect from</p>
			<p class="mt-0.5 whitespace-pre-line text-muted-foreground">{address}</p>
		</div>
	{/if}
</fieldset>
