<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { X, Heart } from 'lucide-svelte'
	import MyWishlistRenderer from '$lib/core/composables/my-wishlist-renderer.svelte'
</script>

<svelte:head>
	<title>My Wishlist</title>
</svelte:head>

<MyWishlistRenderer>
	{#snippet content({ loading, wishlistItems, moveToCart, removeFromWishlist })}
		<div class="mx-auto max-w-7xl px-4 py-8">
			<!-- <h1 class="mb-8 text-3xl font-bold">My Wishlist</h1> -->
			{#if loading}
				<p>Loading ...</p>
			{:else if wishlistItems.length === 0}
				<div class="flex flex-col items-center justify-center py-12">
					<Heart class="mb-4 h-16 w-16 text-gray-400" />
					<p class="text-lg text-gray-600">Your wishlist is empty</p>
					<a href="/products" class="mt-4">
						<Button variant="outline">Browse Products</Button>
					</a>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
					{#each wishlistItems as item}
						<div class="flex flex-col">
							<a href="/products/{item?.product?.slug}?variant_id={item.variantId}">
								<div class="relative">
									<button
										class="absolute right-2 top-2 z-10 text-gray-400 hover:text-gray-600"
										onclick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											removeFromWishlist(item?.productId, item?.variantId)
										}}
									>
										<X class="h-5 w-5" />
									</button>

									<div class="aspect-square w-full overflow-hidden">
										<img src={item?.product?.thumbnail} alt={item?.product?.title} class="h-full w-full object-contain" />
									</div>
								</div>

								<div class="mt-2">
									<p class="font-[Marcellus] text-sm font-normal">{item?.product?.title}</p>
									<div class="mt-1 flex items-center gap-2">
										<span class="font-[Montserrat] font-bold">${item?.product?.price.toFixed(2)}</span>
										<span class="font-[Montserrat] text-sm text-[#9B111E] line-through">${item?.product?.mrp.toFixed(2)}</span>
									</div>
								</div>

								<!-- Divider -->
								<div class="my-2 border-t border-black"></div>
								<div class="flex items-center justify-center font-[Montserrat]">
									<button
										class="text-xs font-semibold text-[#273B2D]"
										onclick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											moveToCart(item)
										}}
									>
										Move to Cart
									</button>
								</div>
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/snippet}
</MyWishlistRenderer>

