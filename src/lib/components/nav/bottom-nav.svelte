<script lang="ts">
	import { page } from '$app/state'
	import { slide } from 'svelte/transition'
	import { getCartState } from '$lib/core/stores/index.js'
	import { Home, Grid, Heart, ShoppingCart, Minus, Plus, Trash2, Store, ArrowLeft, Play, ShoppingBag, Compass } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { goto } from '$app/navigation'
	import { cn, formatPrice } from '$lib/core/utils'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import CartItem from '$lib/components/cart/cart-item.svelte'

	let { class: className = '' } = $props()

	const cartState = getCartState()
	let showCartModal = $state(false)

	$effect(() => {
		if (page.url.pathname) {
			showCartModal = false
		}
	})

	const navItems = $derived.by(() => {
		const items = [
			{
				label: 'Home',
				icon: Home,
				href: '/'
			},
			{
				label: 'Explore',
				icon: Compass,
				href: '/products'
			},
			{
				label: 'Wishlist',
				icon: Heart,
				href: '/my/wishlist'
			},
			{
				label: 'Categories',
				icon: Grid,
				href: '/categories'
			},
			{
				label: 'Cart',
				icon: ShoppingBag,
				onClick: () => {
					showCartModal = true
				}
			}
		]
		if (page?.data?.store?.plugins?.isReel?.active) {
			// Insert Reels before Cart
			items.splice(4, 0, { label: 'Reels', icon: Play, href: '/reels' })
		}
		return items
	})

	function isActive(href: string) {
		return page.url.pathname === href
	}
</script>
 
<nav class={cn('fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white font-[\'Montserrat\',_sans-serif] md:hidden pb-safe', className)}>
	<div class="flex h-16 items-center justify-around px-3">
		{#each navItems as item}
			{#if item.href}
				<a
					href={item.href}
					class="relative flex flex-1 flex-col items-center justify-center h-full transition-all duration-200"
				>
					<div class="relative flex h-7 w-7 items-center justify-center transition-colors duration-200 {isActive(item.href) ? 'text-primary' : 'text-gray-600'}">
						<item.icon size={20} class="stroke-[1.6]" />
					</div>
					<span class="text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 truncate {isActive(item.href) ? 'text-black font-black' : 'text-gray-600'}">
						{item.label}
					</span>
					{#if isActive(item.href)}
						<span class="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary"></span>
					{/if}
				</a>
			{:else}
				<button
					onclick={item.onClick}
					class="flex flex-1 flex-col items-center justify-center h-full transition-all duration-200"
				>
					<div class="relative flex h-7 w-7 items-center justify-center text-gray-600">
						<item.icon size={20} class="stroke-[1.6]" />
						{#if cartState?.cart?.total && cartState.cart?.lineItems?.length > 0}
							<span class="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-black font-bold border border-white">
								{cartState?.cart?.qty}
							</span>
						{/if}
					</div>
					<span class="text-[9px] font-bold uppercase tracking-wider text-gray-600 truncate">
						{item.label}
					</span>
				</button>
			{/if}
		{/each}
	</div>
</nav>

{#if showCartModal}
	<div class="fixed inset-0 z-[1000001] bg-white" transition:slide={{ duration: 300 }}>
		<div class="flex h-full flex-col">
			<header class="flex items-center gap-4 border-b p-4">
				<Button variant="ghost" size="icon" class="rounded-full" onclick={() => (showCartModal = false)}>
					<ArrowLeft size={24} />
				</Button>
				<h2 class="text-lg font-medium">Your Cart</h2>
			</header>

			<div class="flex-1 overflow-auto p-4">
				{#if cartState?.cart?.lineItems?.length}
					<div class="space-y-4">
						{#each cartState.cart.lineItems || [] as _, i}
							<div class="rounded-lg transition-all duration-300 hover:bg-gray-50 border border-gray-100 p-2">
								<CartItem bind:cartProduct={cartState.cart.lineItems[i]} removeItem={() => {}} />
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex h-full flex-col items-center justify-center">
						<p class="mb-4 text-gray-500">Your cart is empty</p>
						<Button
							onclick={() => {
								showCartModal = false
								goto('/products')
							}}
						>
							Continue Shopping
						</Button>
					</div>
				{/if}
			</div>

			{#if cartState?.cart?.lineItems?.length}
				<div class="border-t bg-white p-4">
					<div class="space-y-4">
						<div class="flex justify-between text-sm">
							<span>Subtotal</span>
							<span>{formatPrice(cartState.cart.subtotal, cartState.cart.currencyCode)}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span>Shipping</span>
							<span>Calculated at checkout</span>
						</div>
						<Separator />
						<div class="flex justify-between font-medium">
							<span>Total</span>
							<span>{formatPrice(cartState.cart.total, cartState.cart.currencyCode)}</span>
						</div>
            <Button
              onclick={() => {
								showCartModal = false
								goto('/checkout/cart')
							}}
							size="lg"
							class="w-full bg-primary text-black font-bold uppercase tracking-widest text-xs py-4 px-8 rounded-md hover:bg-primary/90 transition-colors duration-300"
						>
							Proceed to Checkout
						</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
<!-- Add padding to bottom of page to account for nav on mobile only -->
<div class="h-16 md:hidden" />
