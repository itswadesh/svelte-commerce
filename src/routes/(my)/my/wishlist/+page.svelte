<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { MyWishlistRenderer } from '$lib/core/composables/index.js'
	import { Heart, ArrowRight, LoaderCircle, Trash2, ShoppingBag } from '@lucide/svelte'
	import { fade, fly } from 'svelte/transition'
	import { page } from '$app/state'
	import { formatPrice } from '$lib/core/utils/index.js'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
</script>

<svelte:head>
	<title>My Wishlist | Svelte Commerce</title>
</svelte:head>

<MyWishlistRenderer>
	{#snippet content({ loading, wishlistItems, moveToCart, removeFromWishlist })}
		<div class="mx-auto max-w-7xl px-0 md:py-8 md:py-12">
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
				<div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
					{#each wishlistItems as item, i}
						<div
							in:fly={{ y: 20, duration: 400, delay: i * 50 }}
							class="group relative flex w-full flex-col overflow-hidden bg-white transition-all duration-300 dark:bg-gray-800"
						>
							<!-- Product Image -->
							<a
								href="/products/{item?.product?.slug}?variant_id={item.variantId}"
								class="relative block w-full overflow-hidden"
							>
								<LazyImg
									src={item?.product?.thumbnail}
									alt={item?.product?.title}
									class="w-full rounded-md object-cover transition-transform duration-500 group-hover:scale-110"
									style="aspect-ratio: 3 / 4; border-radius: 8px;"
								/>
							</a>

							<!-- Product Info -->
							<div class="flex flex-col pt-[7.5px] lg:pt-3">
								<div class="flex items-center justify-between">
									<span class="truncate text-xs font-bold capitalize text-gray-500 lg:text-sm">
										{item?.product?.brand?.name || page.data?.store?.name}
									</span>
									<button
										class="text-gray-400 transition-colors hover:text-red-500"
										onclick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											removeFromWishlist(item?.productId, item?.variantId)
										}}
										title="Remove from wishlist"
									>
										<Trash2 class="size-4" />
									</button>
								</div>

								<a href="/products/{item?.product?.slug}?variant_id={item.variantId}" class="block overflow-hidden">
									<span class="block w-[90%] truncate text-xs text-gray-600 lg:text-sm" title={item?.product?.title}>
										{item?.product?.title}
									</span>
								</a>

								<div class="flex items-center gap-2">
									<span class="text-sm font-semibold text-gray-900">
										{formatPrice(item?.product?.price, page?.data?.store?.currency?.code)}
									</span>
									{#if item?.product?.mrp > item?.product?.price}
										<span class="text-xs text-gray-400 line-through">
											{formatPrice(item?.product?.mrp, page?.data?.store?.currency?.code)}
										</span>
										<span class="hidden text-xs font-bold uppercase text-green-600 md:block lg:text-sm">
											{Math.round(((item?.product?.mrp - item?.product?.price) / item?.product?.mrp) * 100)}% OFF
										</span>
									{/if}
								</div>

								<!-- Actions -->
								<div class="mt-3">
									<Button
										variant="default"
										class="w-full py-5 text-[10px] font-bold uppercase tracking-widest text-white bg-primary"
										onclick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											moveToCart(item)
										}}
									>
										<ShoppingBag class=" h-4 w-4" />
										Add to Cart
									</Button>
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
