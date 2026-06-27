<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { onDestroy, onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import { getCartState } from '$lib/core/stores/index.js'
	import { ArrowLeft, Compass, Grid, Heart, Home, Play, ShoppingBag } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { cn, formatPrice } from '$lib/core/utils'
	import CartItem from '$lib/components/cart/cart-item.svelte'

	let { class: className = '' } = $props()

	const cartState = getCartState()
	let showCartModal = $state(false)
	const modalHistoryKey = '__svelteCommerceBottomCart'
	let ownsHistoryEntry = false

	function handleBrowserBack() {
		if (!showCartModal || !ownsHistoryEntry) return
		ownsHistoryEntry = false
		showCartModal = false
	}

	onMount(() => {
		window.addEventListener('popstate', handleBrowserBack)
		return () => window.removeEventListener('popstate', handleBrowserBack)
	})

	$effect(() => {
		if (page.url.pathname) {
			showCartModal = false
		}
	})

	$effect(() => {
		if (typeof window === 'undefined') return

		if (showCartModal && !ownsHistoryEntry) {
			history.pushState({ ...history.state, [modalHistoryKey]: true }, '', window.location.href)
			ownsHistoryEntry = true
		} else if (!showCartModal && ownsHistoryEntry) {
			const isCurrentModalEntry = history.state?.[modalHistoryKey] === true
			ownsHistoryEntry = false
			if (isCurrentModalEntry) history.back()
		}
	})

	onDestroy(() => {
		if (typeof window !== 'undefined' && ownsHistoryEntry && history.state?.[modalHistoryKey] === true) {
			history.back()
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
			items.splice(4, 0, { label: 'Reels', icon: Play, href: '/reels' })
		}
		return items
	})

	function isActive(href: string) {
		return page.url.pathname === href
	}
</script>

<nav class={cn("pb-safe fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white font-['Montserrat',_sans-serif] md:hidden", className)}>
	<div class="flex h-16 items-center justify-around px-3">
		{#each navItems as item}
			{#if item.href}
				<a href={item.href} class="relative flex h-full flex-1 flex-col items-center justify-center transition-all duration-200">
					<div
						class="relative flex h-7 w-7 items-center justify-center transition-colors duration-200 {isActive(item.href)
							? 'text-primary'
							: 'text-gray-600'}"
					>
						<item.icon size={20} class="stroke-[1.6]" />
					</div>
					<span
						class="truncate text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 {isActive(item.href)
							? 'font-black text-black'
							: 'text-gray-600'}"
					>
						{item.label}
					</span>
					{#if isActive(item.href)}
						<span class="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary"></span>
					{/if}
				</a>
			{:else}
				<button onclick={item.onClick} class="flex h-full flex-1 flex-col items-center justify-center transition-all duration-200">
					<div class="relative flex h-7 w-7 items-center justify-center text-gray-600">
						<item.icon size={20} class="stroke-[1.6]" />
						{#if cartState?.cart?.total && cartState.cart?.lineItems?.length > 0}
							<span
								class="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-primary text-[8px] font-bold text-black"
							>
								{cartState?.cart?.qty}
							</span>
						{/if}
					</div>
					<span class="truncate text-[9px] font-bold uppercase tracking-wider text-gray-600">
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
							<div class="rounded-lg border border-gray-100 p-2 transition-all duration-300 hover:bg-gray-50">
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
							class="w-full rounded-md bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-black transition-colors duration-300 hover:bg-primary/90"
						>
							Proceed to Checkout
						</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<div class="h-16 md:hidden" />
