<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { MyWishlistRenderer } from '$lib/core/composables/index.js'
	import { X, Heart, ShoppingBag, ArrowRight, LoaderCircle } from '@lucide/svelte'
	import { fade, fly } from 'svelte/transition'
	import { page } from '$app/state'
	import { formatPrice } from '$lib/core/utils/index.js'
</script>

<svelte:head>
	<title>My Wishlist | Svelte Commerce</title>
</svelte:head>

<MyWishlistRenderer>
	{#snippet content({ loading, wishlistItems, moveToCart, removeFromWishlist })}
		<div class="mx-auto max-w-7xl px-4 py-8 md:py-12">
			<!-- Header -->
			<div class="mb-10 flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">My Wishlist</h1>
					<p class="mt-2 text-lg text-gray-500">Items you've saved for later.</p>
				</div>
				{#if wishlistItems.length > 0}
					<div class="hidden md:block">
						<span class="rounded-full border border-gray-200 bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-600">
							{wishlistItems.length}
							{wishlistItems.length === 1 ? 'Item' : 'Items'}
						</span>
					</div>
				{/if}
			</div>

			{#if loading}
				<div class="flex min-h-[400px] items-center justify-center">
					<LoaderCircle class="h-8 w-8 animate-spin text-primary" />
				</div>
			{:else if wishlistItems.length === 0}
				<div in:fade class="flex flex-col items-center justify-center py-20 text-center">
					<div class="relative mb-6">
						<div class="absolute inset-0 scale-150 animate-pulse rounded-full bg-gray-50"></div>
						<div class="relative flex h-24 w-24 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
							<Heart class="h-10 w-10 text-gray-300" />
						</div>
					</div>
					<h2 class="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
					<p class="mt-2 max-w-xs text-gray-500">Save items you like to keep track of them and buy them later.</p>
					<div class="mt-8">
						<Button href="/products" class="h-12 px-8 font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
							Browse Products
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-8 lg:grid-cols-4 xl:grid-cols-5">
					{#each wishlistItems as item, i}
						<div
							in:fly={{ y: 20, duration: 400, delay: i * 50 }}
							class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:border-gray-200"
						>
							<!-- Product Image -->
							<a href="/products/{item?.product?.slug}?variant_id={item.variantId}" class="relative block aspect-[3/4] overflow-hidden bg-gray-50">
								<img
									src={item?.product?.thumbnail}
									alt={item?.product?.title}
									class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>

								<!-- Remove Button -->
								<button
									class="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-400 shadow-sm backdrop-blur-md transition-all hover:bg-red-500 hover:text-white"
									onclick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										removeFromWishlist(item?.productId, item?.variantId)
									}}
								>
									<X class="h-4 w-4" />
								</button>
							</a>

							<!-- Product Info -->
							<div class="flex flex-1 flex-col p-5 text-center">
								<h3 class="line-clamp-1 text-xs font-bold uppercase tracking-wider text-gray-900">
									<a href="/products/{item?.product?.slug}?variant_id={item.variantId}" class="transition-colors hover:text-gray-400">
										{item?.product?.title}
									</a>
								</h3>

								<div class="mt-3 flex items-center justify-center gap-2">
									<span class="text-sm font-bold text-gray-900">
										{formatPrice(item?.product?.price, page?.data?.store?.currency?.code)}
									</span>
									{#if item?.product?.mrp > item?.product?.price}
										<span class="text-[10px] text-gray-300 line-through">
											{formatPrice(item?.product?.mrp, page?.data?.store?.currency?.code)}
										</span>
									{/if}
								</div>

								<!-- Move to Cart -->
								<div class="mt-6 border-t border-gray-50 pt-5">
									<button
										class="flex w-full items-center justify-center gap-2 rounded-full border border-gray-900 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-900 transition-all hover:bg-black hover:text-white active:scale-95"
										onclick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											moveToCart(item)
										}}
									>
										<ShoppingBag class="h-3.5 w-3.5" />
										Move to Cart
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/snippet}
</MyWishlistRenderer>

<style>
	:global(body) {
		background-color: #fafafa;
	}
</style>
