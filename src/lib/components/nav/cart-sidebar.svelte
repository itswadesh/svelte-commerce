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
		class="flex rounded-full"
		aria-label="Toggle Cart"
		onclick={() => {
			cartState.isOpen = !cartState.isOpen
		}}
	>
		<ShoppingBag class="h-5 w-5" />
		{#if cartState?.cart?.total && cartState.cart?.lineItems?.length > 0}
			<span
				class="absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-1.5 py-1 text-xs font-bold leading-none text-white"
			>
				{cartState.cart.qty}
			</span>
		{/if}
	</button>
	{#if cartState.isOpen}
		<!-- close cart backdrop -->
		<button
			class="fixed inset-0 z-50 h-svh w-full overflow-hidden bg-black bg-opacity-30 transition-opacity duration-300 scrollbar-none"
			aria-label="Close cart"
			onclick={onClose}
		>
			<style>
				body {
					overflow: hidden;
				}
			</style>
			<span class="sr-only">Close cart</span>
		</button>

		<div
			class="shadow-3xl ease-out-expo fixed right-0 top-0 z-[10000000] h-screen w-full overflow-y-auto bg-white transition-all duration-500 sm:w-[37.5%]"
			transition:slideFadeTopRight={{ duration: 500 }}
		>
			<div class="relative z-50 flex h-full flex-col justify-between bg-white p-4">
				<div class="sm:mx-3">
					<h2 class="mb-4 mt-4 text-xl font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">
						My Shopping Cart
					</h2>
					<button
						class="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-75"
						aria-label="close cart"
						onclick={onClose}
					>
						<X class="size-5" />
					</button>

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
								<button
									disabled={!!cartState.isUpdatingCart}
									onclick={onContinueShopping}
									class="mt-8 rounded-full bg-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-black active:scale-95"
								>
									Continue Shopping
								</button>
							</div>
						{/if}
					</div>
					{#if cartState?.cart?.total >= 0 && cartState.cart?.lineItems?.length > 0}
						<div class="mx-4 mt-6 flex justify-between gap-3">
							<Button
								variant="secondary"
								disabled={!!cartState.isUpdatingCart}
								onclick={onContinueShopping}
								class="w-[48%] py-6 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
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
								class="w-[48%] bg-primary py-6 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-black active:scale-95"
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
