<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { MyWishlistRenderer } from '$lib/core/composables/index.js'
	import { Heart, ArrowRight, LoaderCircle, Trash2, ShoppingBag } from '@lucide/svelte'
	import { fade, fly } from '$lib/motion'
	import { page } from '$app/state'
	import { toast } from '$lib/core/utils/index.js'
	import { formatPrice } from '$lib/utils/price'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { madeToDesign } from '$lib/product/designable'
	import * as Dialog from '$lib/components/ui/dialog'

	let showRemoveConfirmation = $state(false)
	let itemToRemove = $state<any>(null)

	function confirmRemove(item: any) {
		itemToRemove = item
		showRemoveConfirmation = true
	}
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
					<h1 class="page-heading">My wishlist</h1>
					<p class="mt-2 text-sm text-muted-foreground">Items you've saved for later.</p>
				</div>
				<!-- {#if wishlistItems.length > 0}
					<div class="hidden md:block">
						<span class="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-semibold text-muted-foreground">
							{wishlistItems.length}
							{wishlistItems.length === 1 ? 'Item' : 'Items'}
						</span>
					</div>
				{/if} -->
			</div>

			{#if loading}
				<div class="flex min-h-[400px] items-center justify-center">
					<LoaderCircle class="h-8 w-8 animate-spin text-primary" />
				</div>
			{:else if wishlistItems.length === 0}
				<div in:fade class="flex flex-col items-center justify-center py-20 text-center">
					<div class="relative mb-6">
						<div class="absolute inset-0 scale-150 animate-pulse rounded-full bg-muted"></div>
						<div class="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card">
							<Heart class="h-10 w-10 text-muted-foreground" />
						</div>
					</div>
					<h2 class="text-2xl font-bold text-foreground">Your wishlist is empty</h2>
					<p class="mt-2 max-w-xs text-muted-foreground">Save items you like to keep track of them and buy them later.</p>
					<div class="mt-8">
						<Button href="/products" class="h-12 px-8">
							Browse products
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-3 lg:gap-10">
					{#each wishlistItems as item, i}
						<div
							in:fly={{ y: 12, delay: Math.min(i, 5) * 40 }}
							class="group relative flex h-full w-full flex-col overflow-hidden bg-card transition-[transform,box-shadow] duration-fast"
						>
							<!-- Product Image -->
							<a
								href="/products/{item?.product?.slug}?variant_id={item.variantId}"
								class="relative block w-full overflow-hidden"
							>
								<LazyImg
									src={item?.product?.thumbnail ?? undefined}
									alt={item?.product?.title}
									class="w-full rounded-md object-cover transition-transform duration-emphasis"
									style="aspect-ratio: 4 / 5; border-radius: 8px;"
								/>
							</a>

							<!-- Product Info -->
							<div class="flex flex-1 flex-col pt-4">
								<a href="/products/{item?.product?.slug}?variant_id={item.variantId}" class="block overflow-hidden">
									<span class="block w-[95%] truncate text-sm font-medium text-foreground lg:text-sm" title={item?.product?.title}>
										{item?.product?.title}
									</span>
								</a>

								<div class="mt-1 flex items-center gap-2">
									<span class="text-base font-bold text-foreground">
										{formatPrice(item?.product?.price, page?.data?.store?.currency?.code)}
									</span>
									{#if item?.product?.mrp > item?.product?.price}
										<span class="text-xs text-muted-foreground line-through">
											{formatPrice(item?.product?.mrp, page?.data?.store?.currency?.code)}
										</span>
										<span class="hidden text-xs font-bold text-success md:block lg:text-sm">
											{Math.round(((item?.product?.mrp - item?.product?.price) / item?.product?.mrp) * 100)}% OFF
										</span>
									{/if}
								</div>

								<!-- Actions -->
								<div class="mt-auto pt-5 flex items-center gap-2">
									<Button
										variant="outline"
										size="icon"
										class="h-8 w-[20%] md:h-9"
										onclick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											confirmRemove(item)
										}}
										title="Remove from wishlist"
									>
										<Trash2 class="size-5" />
									</Button>

									{#if madeToDesign(item?.product)}
										<Button
											variant="default"
											class="h-8 w-[80%] md:h-9"
											href="/products/{item?.product?.slug}?variant_id={item.variantId}"
											aria-label="Design yours: {item?.product?.title}"
										>
											Design yours
										</Button>
									{:else}
										<Button
											variant="default"
											class="h-8 w-[80%] md:h-9"
											onclick={async (e) => {
												e.preventDefault()
												e.stopPropagation()
												await moveToCart(item)
												toast('Item added to cart', 'success')
											}}
										>
											Add to cart
										</Button>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<Dialog.Root bind:open={showRemoveConfirmation}>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Remove from Wishlist</Dialog.Title>
						<Dialog.Description>
							Are you sure you want to remove this item from your wishlist?
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
						<Button variant="outline" onclick={() => (showRemoveConfirmation = false)} class="flex-1 sm:flex-none"
							>Cancel</Button
						>
						<Button
							variant="destructive"
							onclick={async () => {
								if (itemToRemove) {
									await removeFromWishlist(itemToRemove.productId, itemToRemove.variantId)
									showRemoveConfirmation = false
									itemToRemove = null
								}
							}}
							class="flex-1 sm:flex-none">Remove</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{/snippet}
</MyWishlistRenderer>

