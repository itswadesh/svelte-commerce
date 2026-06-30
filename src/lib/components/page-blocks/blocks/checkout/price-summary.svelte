<script lang="ts">
	import { page } from '$app/state'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { LockKeyhole } from '@lucide/svelte'
	import { getCartState } from '@misiki/kitcommerce-core/stores'

	const { block } = $props()

	const cartState = getCartState()
</script>

<div class="rounded-lg border border-border bg-background p-3 shadow-sm md:p-6">
	<div class="">
		<div class="mb-6 flex flex-col gap-1">
			<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: 'Montserrat', sans-serif;">Price Summary</h2>
			<div class="h-1 w-12 bg-primary"></div>
		</div>
		{#if false}
			<div class="flex items-center justify-center py-8">
				<LoadingDots />
			</div>
		{:else}
			<div class="space-y-4">
				<div class="space-y-3 border-b border-border pb-6">
					<div class="flex justify-between text-sm">
						<span class="font-medium text-gray-500">Subtotal</span>
						<span class="font-bold text-gray-900">{formatPrice(cartState.cart.subtotal, page?.data?.store?.currency?.code)}</span>
					</div>
					{#if cartState.cart.discountAmount > 0}
						<div class="flex justify-between text-sm">
							<span class="font-medium text-gray-500">Discount</span>
							<span class="font-bold uppercase tracking-tight text-orange-600"
								>- {formatPrice(cartState.cart.discountAmount, page?.data?.store?.currency?.code)}</span
							>
						</div>
					{/if}
					<div class="flex flex-col gap-1">
						<div class="flex justify-between text-sm">
							<span class="font-medium text-gray-500">Shipping</span>
							{#if !cartState.cart.shippingAddress}
								<span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400"> Address required </span>
							{:else if cartState.cart.shippingCharges}
								<span class="font-bold text-gray-900">{formatPrice(cartState.cart.shippingCharges, page?.data?.store?.currency?.code)}</span>
							{:else}
								<span class="rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-600 ring-1 ring-green-100"
									>FREE</span
								>
							{/if}
						</div>
					</div>
				</div>

				<div class="flex items-center justify-between pt-2">
					<span class="text-sm font-bold uppercase text-gray-900">Total</span>
					<span class="text-xl font-bold text-gray-900">{formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}</span>
				</div>

				<!-- {#if totalSavings > 0}
											<div class="flex justify-end pt-1">
												<p class="text-[10px] font-bold uppercase tracking-tight text-green-600">
													You saved {formatPrice(totalSavings, page?.data?.store?.currency?.code)} on this order
												</p>
											</div>
										{/if} -->

				<div class="mt-6 flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-gray-50/50 px-4 py-3">
					<LockKeyhole class="h-3.5 w-3.5 text-gray-400" />
					<p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure 256-bit encryption</p>
				</div>

				<!-- {#if !cartModule.noItemsChecked}
					<CheckoutButton onclick={cartModule.gotoCheckout} loading={cartModule.loadingForCheckout} />
				{:else}
					<div
						class="mt-4 rounded bg-yellow-50 p-3 text-center text-[10px] font-bold uppercase tracking-widest text-yellow-700 ring-1 ring-yellow-100"
					>
						Select items to proceed
					</div>
				{/if} -->
			</div>
		{/if}
	</div>
</div>
