<script lang="ts">
	import { page } from '$app/state'
	import { slide } from 'svelte/transition'
	import { Home, Grid, Heart, ShoppingCart, Minus, Plus, Trash2, Store, ArrowLeft, Play } from 'lucide-svelte'
	import { getCartState } from '$lib/core/stores/cart.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { goto } from '$app/navigation'
	import { cn, formatPrice } from '$lib/core/utils'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'

	let { class: className = '' } = $props()

	const cartState = getCartState()
	let showCartModal = $state(false)

	const navItems = [
		{
			label: 'Home',
			icon: Home,
			href: '/'
		},
		{
			label: 'Explore',
			icon: Store,
			href: '/products'
		},
		{
			label: 'Wishlist',
			icon: Heart,
			href: '/my/wishlist'
		},
		// {
		// 	label: 'Categories',
		// 	icon: Grid,
		// 	href: '/categories'
		// },
		// {
		// 	label: 'Reels',
		// 	icon: Play,
		// 	href: '/reels'
		// },
		{
			label: 'Cart',
			icon: ShoppingCart,
			onClick: () => {
				showCartModal = true
			}
		}
	]

	function isActive(href: string) {
		return page.url.pathname === href
	}
</script>

<nav class={cn('fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white md:hidden', className)}>
	<div class="flex h-16 items-center justify-around px-4">
		{#each navItems as item}
			{#if item.href}
				<a
					href={item.href}
					class="flex flex-col items-center gap-1 text-xs"
					class:text-primary={isActive(item.href)}
					class:text-gray-500={!isActive(item.href)}
				>
					<item.icon size={24} />
					<span>{item.label}</span>
				</a>
			{:else}
				<button onclick={item.onClick} class="flex flex-col items-center gap-1 text-xs text-gray-500">
					<div class="relative">
						<item.icon size={24} />
						{#if cartState?.cart?.total && cartState.cart?.lineItems?.length > 0}
							<span class="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
								{cartState?.cart?.qty}
							</span>
						{/if}
					</div>
					<span>{item.label}</span>
				</button>
			{/if}
		{/each}

		{#if page?.data?.store?.plugins?.isReel?.active}
			<a
				href="/reels"
				class="flex flex-col items-center gap-1 text-xs"
				class:text-primary={isActive('/reels')}
				class:text-gray-500={!isActive('/reels')}
			>
				<Play size={24} />
				<span>Reels</span>
			</a>
		{/if}
	</div>
</nav>

{#if showCartModal}
	<div class="fixed inset-0 z-[1000001] bg-white" transition:slide={{ duration: 300 }}>
		<div class="flex h-full flex-col">
			<header class="flex items-center gap-4 border-b p-4">
				<button class="rounded-full p-2 hover:bg-gray-100" onclick={() => (showCartModal = false)}>
					<ArrowLeft size={24} />
				</button>
				<h1 class="text-lg font-medium">Your Cart</h1>
			</header>

			<div class="flex-1 overflow-auto p-4">
				{#if cartState?.cart?.lineItems?.length}
					<div class="space-y-4">
						{#each cartState.cart.lineItems as item, i}
							<div class="flex items-center gap-4 rounded-lg border p-4">
								<a href="/products/{item?.slug}" onclick={() => (showCartModal = false)}>
									<LazyImg src={item?.thumbnail} alt={item?.title} width={30} height={20} class="rounded-md object-cover" />
								</a>
								<div class="flex-1">
									<a href="/products/{item?.slug}" onclick={() => (showCartModal = false)}>
										<h3 class="font-medium">
											{item?.title}
										</h3>
									</a>
									<div class="mt-2 flex items-center justify-between">
										<div class="flex items-center gap-2">
											<button
												class="rounded-full p-1 hover:bg-gray-100"
												onclick={() =>
													cartState.update({
														qty: item.qty - 1,
														lineId: item.id,
														productId: item.productId,
														variantId: item.variantId
													})}
											>
												<Minus size={16} />
											</button>
											<span class="mx-2">
												{#if cartState.updatingItem[item.id]}
													<LoadingDots />
												{:else}
													{item.qty}
												{/if}
											</span>
											<button
												class="rounded-full p-1 hover:bg-gray-100"
												onclick={() =>
													cartState.update({
														qty: item.qty + 1,
														lineId: item.id,
														productId: item.productId,
														variantId: item.variantId
													})}
											>
												<Plus size={16} />
											</button>
										</div>
										<button
											class="text-red-500 hover:text-red-600"
											onclick={() =>
												cartState.update({
													qty: 0,
													lineId: item.id,
													productId: item.productId,
													variantId: item.variantId
												})}
										>
											<Trash2 size={20} />
										</button>
									</div>
								</div>
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
							class="w-full"
							onclick={() => {
								showCartModal = false
								goto('/checkout/cart')
							}}
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
