<script lang="ts">
	import { Button } from '$lib/components/ui/form/index.js'
	import { ChevronDown } from '@lucide/svelte'
	import type { PaymentModule } from '@misiki/kitcommerce-core/composables'
	import { getCartState } from '@misiki/kitcommerce-core/stores'
	import { getContext } from 'svelte'

	const { block } = $props()

	const paymentModule: InstanceType<typeof PaymentModule> = getContext('checkout-payment-module')
	const cartState = getCartState()
	let showAddress = $state(block.metadata.expandedByDefault || false)
</script>

{#if cartState?.cart?.shippingAddress}
	<div class="overflow-hidden rounded-lg border border-border bg-white text-left shadow-sm">
		<Button variant="plain" class="flex h-auto w-full items-center justify-between px-6 py-4" onclick={() => (showAddress = !showAddress)}>
			<div class="flex flex-col items-start">
				<span class="text-sm font-bold text-muted">Delivering Order to</span>
				<span class="text-sm font-bold uppercase tracking-tight text-gray-900">
					{cartState.cart.shippingAddress.firstName}
					{cartState.cart.shippingAddress.lastName}
				</span>
			</div>
			<ChevronDown class="h-5 w-5 text-gray-400 transition-transform duration-300 {showAddress ? 'rotate-180' : ''}" />
		</Button>

		{#if showAddress}
			<div class="border-t border-gray-50 bg-gray-50/30 px-6 py-2">
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1">
						<p class="text-sm leading-relaxed text-gray-600">
							{cartState.cart.shippingAddress?.address_1},<br />
							{cartState.cart.shippingAddress.locality ? cartState.cart.shippingAddress.locality + ',' : ''}
							{cartState.cart.shippingAddress.city}, {cartState.cart.shippingAddress.state} - {cartState.cart.shippingAddress.zip}<br />
							{cartState.cart.shippingAddress.country}
						</p>
						{#if cartState.cart.shippingAddress?.address_2}
							<p class="text-xs leading-relaxed text-gray-600">{cartState.cart.shippingAddress?.address_2}</p>
						{/if}
					</div>
					<Button variant="outline" size="sm" class="h-7 px-3" onclick={paymentModule.handleAddressChange}>Change</Button>
				</div>
				{#if cartState.cart.phone}
					<p class="mt-2 text-xs font-bold text-gray-900">
						Phone: {cartState.cart.phone}
					</p>
				{/if}
			</div>
		{/if}
	</div>
{/if}
