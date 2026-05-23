<script lang="ts">
	import CartItem from '$lib/components/cart/cart-item.svelte'
	import { X, ShoppingBag } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'
	import { formatPrice } from '$lib/core/utils'
	import { getCartState } from '@misiki/kitcommerce-core/stores'
	import { cubicOut } from 'svelte/easing'
	import { page } from '$app/state'

	const cartState = getCartState()
	const storeData = $derived(page.data?.store)

	const { onClose, onContinueShopping, onRemoveCartItem } = $props()

	function slideFadeTopRight(node: Element, params: { delay?: number; duration?: number; easing?: any; transformOrigin?: any }) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '')

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || cubicOut,
			css: (t: number, u: number) =>
				`transform-origin: ${params.transformOrigin || 'top right'}; transform: ${existingTransform} scaleX(${t}); opacity: ${t};`
		}
	}
</script>

<div class="relative px-2" role="navigation">
	<button
		variant="ghost"
		size="icon"
		class="rounded-full flex"
		aria-label="Toggle Cart"
		onclick={() => {
			cartState.isOpen = !cartState.isOpen
		}}
	>
		<ShoppingBag class="h-5 w-5" />
		{#if cartState?.cart?.total && cartState.cart?.lineItems?.length > 0}
			<span
				class="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-1.5 py-1 text-xs font-bold leading-none"
			>
				{cartState.cart.qty}
			</span>
		{/if}
	</button>
	{#if cartState.isOpen}
		<!-- close cart backdrop -->
		<Button
			variant="ghost"
			class="fixed inset-0 z-50 h-svh w-full rounded-none bg-black/30 hover:bg-black/30"
			aria-label="Close cart"
			onclick={onClose}
		>
			<style>
				body {
					overflow: hidden;
				}
			</style>
			<span class="sr-only">Close cart</span>
		</Button>

		<div
			class="shadow-3xl ease-out-expo fixed right-0 top-0 z-[10000000] h-screen w-full overflow-y-auto bg-white transition-all duration-500 sm:w-[37.5%]"
			transition:slideFadeTopRight={{ duration: 500 }}
		>
			<div class="relative z-50 flex h-full flex-col justify-between bg-white p-4">
				<div class="sm:mx-3">
					<h2 class="mb-4 mt-4 text-xl font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">
						My Shopping Cart
					</h2>
					<Button
						variant="ghost"
						size="icon"
						class="absolute right-4 top-4 rounded-full"
						aria-label="close cart"
						onclick={onClose}
					>
						<X class="size-5" />
					</Button>

					{#each cartState.cart?.lineItems || [] as _, i}
						<div class="rounded-lg transition-all duration-300 hover:bg-gray-50">
							<CartItem bind:cartProduct={cartState.cart.lineItems[i]} removeItem={onRemoveCartItem} />
						</div>
					{/each}
				</div>

				<div
					class="sticky bottom-0 {cartState.cart?.lineItems?.length > 0
						? '-mx-4 border-t border-gray-100 bg-gray-50 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]'
						: ''} py-6 sm:px-4"
				>
					<div class="space-y-1">
						{#if cartState.cart?.lineItems?.length > 0}
							<div class="mx-4 flex items-center justify-between">
								<p class="text-xs font-bold uppercase tracking-widest text-gray-400 sm:text-sm">Total</p>
								<p class="text-base font-bold text-gray-900 sm:text-xl">
									{formatPrice(cartState?.cart?.total, storeData?.currencyCode)}
								</p>
							</div>
							<p class="mx-4 text-right text-[10px] font-bold uppercase tracking-tighter text-gray-400">MRP includes of all taxes</p>
						{:else}
							<div class="flex min-h-[80vh] flex-col items-center justify-center gap-3 bg-white">
								<div class="mb-6 rounded-full bg-gray-50 p-8 ring-1 ring-gray-100">
									<ShoppingBag class="h-12 w-12 text-gray-300" />
								</div>
								<span class="text-xl font-bold uppercase tracking-widest text-gray-900">Empty Cart!!</span>
								<span class="max-w-xs px-2 text-center text-xs font-medium leading-relaxed text-gray-500"
									>We didn't find any item inside cart, Go ahead, order some essentials from the menu</span
								>
								<Button
									disabled={!!cartState.isUpdatingCart}
									onclick={onContinueShopping}
									class="mt-8 rounded-full px-8"
								>
									Continue Shopping
								</Button>
							</div>
						{/if}
					</div>
					{#if cartState?.cart?.total >= 0 && cartState.cart?.lineItems?.length > 0}
						<div class="mx-4 mt-6 flex justify-between gap-3">
							<Button
								variant="outline"
								disabled={!!cartState.isUpdatingCart}
								onclick={onContinueShopping}
								class="w-[48%] py-6"
							>
								Continue
							</Button>
							<Button
								disabled={!!cartState.isUpdatingCart}
								onclick={(e) => {
									e.stopPropagation()
									if (cartState) {
										cartState.isOpen = false
									}
									goto('/checkout/cart')
								}}
								class="w-[48%] py-6"
							>
								Proceed
							</Button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
