<script lang="ts">
	import { page } from '$app/state'
	import { Plus, Minus, Heart } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import EmptyImage from '$lib/core/components/image/empty-image.svelte'
	import { getCartState } from '$lib/core/stores/index.js'

	import { formatPrice } from '$lib/core/utils'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'

	const cartState = getCartState()

	let { product, aspectRatio, hideVariations = true, hideCartControls = true }: any = $props()

	const discount = product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0

	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)

	const categoryName = $derived.by(() => {
		const name = product?.categories?.[0]?.category?.name
		if (name?.toLowerCase() == 'uncategorized') return false
		return name
	})

	const tag = $derived.by(() => {
		const name = product?.material?.[0]
		return name
	})
</script>

<ProductCardRenderer {product} {aspectRatio}>
	{#snippet content({ aspectHeight, toggleWishlist, isWishlisted, aspectWidth, handleCardClick, changeQuantity, addToCart })}
		<section
			data-testid="product-card-{product.id}"
			data-productid="product-card-{product.id}"
			class="product-card group relative flex w-full flex-col overflow-hidden bg-white transition-all duration-300 dark:bg-gray-800"
		>
			<a
				data-testid="product-card-link"
				class="w-full cursor-pointer"
				href="/products/{product.slug}?variant_id={product?.variants?.[0]?.id || ''}"
				aria-label="View details of {product.name}"
			>
				<figure title={product.name} data-testid="product-card-image-container" class="relative">
					{#if product.thumbnail || product?.image_url}
						<LazyImg
							src={product.thumbnail || product?.image_url}
							alt="{product.title || product.name} product image"
							class="w-full rounded-md object-top object-contain transition-transform duration-500"
						/>
					{:else}
						<EmptyImage class="w-full object-cover" style="aspect-ratio: 3 / 4; border-radius: 8px;" />
					{/if}

					{#if product.rating || (Array.isArray(product.ratings) && product.ratings.length > 0)}
						<div data-testid="product-card-rating-container" class="absolute bottom-[6px] left-1 z-10">
							<div class="flex items-center gap-1 rounded-3xl bg-white px-[6px] py-1 lg:px-[9px]">
								<div class="min-w-[12px]">
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
										<path
											fill="#FFD232"
											d="M5.58 1.15a.5.5 0 0 1 .84 0l1.528 2.363a.5.5 0 0 0 .291.212l2.72.722a.5.5 0 0 1 .26.799L9.442 7.429a.5.5 0 0 0-.111.343l.153 2.81a.5.5 0 0 1-.68.493L6.18 10.063a.5.5 0 0 0-.36 0l-2.625 1.014a.5.5 0 0 1-.68-.494l.153-2.81a.5.5 0 0 0-.11-.343L.781 5.246a.5.5 0 0 1 .26-.799l2.719-.722a.5.5 0 0 0 .291-.212L5.58 1.149Z"
										></path>
									</svg>
								</div>
								<span class="text-[10px] font-bold text-gray-900 lg:text-xs">
									{product.rating || (Array.isArray(product.ratings) ? product.ratings.length : product.ratings)}
								</span>
							</div>
						</div>
					{/if}

					{#if tag}
						<div class="absolute left-2 top-2 z-10">
							<div class="rounded-md bg-black/60 px-2 backdrop-blur-sm">
								<span class="text-xs font-bold uppercase tracking-wider text-white">
									{tag}
								</span>
							</div>
						</div>
					{/if}
				</figure>
			</a>

			<div data-testid="product-card-info-wrapper" class="flex flex-col pt-[7.5px] lg:pt-3">
				<div class="flex items-center justify-between">
					<span class="truncate text-xs font-bold capitalize text-gray-500 lg:text-sm" data-testid="product-brand">
						{categoryName || page.data?.store?.name}
					</span>
					{#if wishlistPlugin?.active}
						<Button
							variant="ghost"
							size="icon"
							class="h-auto w-auto p-1"
							data-testid="wishlist-button"
							onclick={(e) => {
								e.stopPropagation()
								e.preventDefault()
								toggleWishlist()
							}}
						>
							{#if isWishlisted}
								<Heart class="size-4 fill-red-500 stroke-red-500" />
							{:else}
								<Heart class="size-4" />
							{/if}
							<span class="sr-only">Toggle wishlist</span>
						</Button>
					{/if}
				</div>

				<a href="/products/{product.slug}" class="block overflow-hidden">
					<span class="block w-[80%] truncate text-xs text-gray-600 lg:text-sm" data-testid="product-title" title={product.title}>
						{product.title}
					</span>
				</a>

				<div class="flex items-center gap-2" data-testid="product-card-price-container">
					<span data-testid="product-card-selling-price" class="text-sm font-semibold text-gray-900">
						{formatPrice(product.price, page?.data?.store?.currency?.code)}
					</span>
					{#if product.mrp && product.mrp > product.price}
						<span class="text-xs text-gray-600 line-through" data-testid="product-card-mrp">
							{formatPrice(product.mrp, page?.data?.store?.currency?.code)}
						</span>
						<span class="hidden text-xs font-bold uppercase text-green-700 md:block lg:text-sm" data-testid="product-card-discount">
							{discount}% OFF
						</span>
					{/if}
				</div>

				{#if !hideCartControls}
					<div class="mt-3">
						{#if cartState.cart?.lineItems?.some((item) => item.productId === product.id)}
							<div class="flex items-center justify-between rounded-md border border-gray-200 p-1">
								<Button disabled={!!cartState.isUpdatingCart} variant="ghost" size="icon" onclick={() => changeQuantity(product, -1)}>
									<Minus class="h-4 w-4" />
								</Button>
								<div class="flex-1 text-center text-sm font-bold">
									{#if cartState.isUpdatingCart}
										<LoadingDots />
									{:else}
										{cartState.cart?.lineItems?.find((item) => item.productId === product.id)?.qty}
									{/if}
								</div>
								<Button disabled={!!cartState.isUpdatingCart} variant="ghost" size="icon" onclick={() => changeQuantity(product, 1)}>
									<Plus class="h-4 w-4" />
								</Button>
							</div>
						{:else}
							<Button disabled={!!cartState.isUpdatingCart} variant="default" class="w-full py-5" onclick={() => addToCart(product)}>
								{#if cartState.isUpdatingCart}
									<LoadingDots />
								{:else}
									Quick Add
								{/if}
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	{/snippet}
</ProductCardRenderer>

<!-- <div
      class="absolute right-1 top-1 z-20 ml-2 flex max-h-[60px] justify-between space-y-2 opacity-100 transition-opacity duration-300 group-hover:opacity-100 mobilel:right-2 mobilel:top-2 laptop:opacity-0"
    >
      <Button
				variant="outline"
				size="icon"
				class="z-20 rounded-full border border-gray-300 bg-white p-2 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
				onclick={() => displayProduct(product)}
				aria-label="Quick view {product.name}"
			>
				<Eye aria-hidden="true" />
			</Button>
      <Button
				variant="outline"
				size="icon"
				class="rounded-full border border-gray-300 bg-white p-2 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
				onclick={() => {
					/* Add like logic here */
					handleToggleWishlist(product.id, product.variants[0].id)
				}}
				aria-label="Add {product.name} to wishlist"
			>
				<Heart aria-hidden="true" />
			</Button>
    </div> -->
