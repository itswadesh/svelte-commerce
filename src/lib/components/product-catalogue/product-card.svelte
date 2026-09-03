<script lang="ts">
	import { page } from '$app/state'
	import { Plus, Minus, Heart } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import Spinner from '$lib/components/common/spinner.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import EmptyImage from '$lib/core/components/image/empty-image.svelte'
	import { getCartState } from '$lib/core/stores/index.js'
	import type { CartLineItem } from '$lib/core/types/index.js'

	import { formatPrice } from '$lib/core/utils'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import LimeProductCard from '$lib/theme/lime/LimeProductCard.svelte'
	import NoorProductCard from '$lib/theme/noor/NoorProductCard.svelte'
	import DefaultProductCard from '$lib/theme/default/DefaultProductCard.svelte'

	const cartState = getCartState()

	let { product, aspectRatio, hideVariations = true, hideCartControls = true, priority = false }: any = $props()

	// Theme-specific product card. Guarded so the default store is unaffected;
	// only the lime theme swaps in its bespoke presentation (logic reused
	// via the same ProductCardRenderer inside the themed card).
	const activeTheme = $derived(page?.data?.theme?.name || 'default')

	const discount = product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0

	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)

	const displayName = $derived(product?.title || product?.name || '')

	// `product.price` is only the cheapest variant, so a product whose variants cost different
	// amounts advertised the low number as the price and then doubled on the product page.
	const variantPrices = $derived(
		(Array.isArray(product?.variants) ? product.variants : [])
			.map((variant: any) => Number(variant?.price))
			.filter((value: number) => Number.isFinite(value) && value > 0)
	)
	const minPrice = $derived(variantPrices.length ? Math.min(...variantPrices) : product?.price)
	const maxPrice = $derived(variantPrices.length ? Math.max(...variantPrices) : product?.price)
	const hasPriceRange = $derived(Number(maxPrice) > Number(minPrice))

	// Score and count are different numbers: the badge used to print the review count next to a
	// star whenever the backend sent reviews without a pre-computed score.
	const ratingList = $derived(Array.isArray(product?.ratings) ? product.ratings : [])
	const ratingScore = $derived.by(() => {
		const direct = Number(product?.rating ?? (Array.isArray(product?.ratings) ? undefined : product?.ratings))
		if (Number.isFinite(direct) && direct > 0) return Math.floor(direct * 10) / 10
		const scores = ratingList.map((entry: any) => Number(entry?.rating)).filter((value: number) => Number.isFinite(value) && value > 0)
		if (!scores.length) return 0
		return Math.floor((scores.reduce((acc: number, cur: number) => acc + cur, 0) / scores.length) * 10) / 10
	})
	const ratingCount = $derived(ratingList.length || Number(product?.ratingCount) || 0)

	const imageSrc = $derived(product.thumbnail || product?.image_url)

	// A 404 image left LazyImg pulsing forever below the fold and showed the browser's broken
	// glyph above it. Both events are caught in the capture phase (neither bubbles) so the card
	// can fall back to the same placeholder a product with no image gets.
	let imageFailed = $state(false)

	const categoryName = $derived.by(() => {
		const name = product?.category?.name || product?.categories?.[0]?.category?.name
		if (name?.toLowerCase() == 'uncategorized') return false
		return name
	})

	const tag = $derived.by(() => {
		const name = product?.material?.[0]
		return name
	})
</script>

{#if activeTheme === 'lime'}
	<LimeProductCard {product} {aspectRatio} {hideCartControls} />
{:else if activeTheme === 'noor'}
	<NoorProductCard {product} {aspectRatio} {hideCartControls} />
{:else if activeTheme === 'default'}
	<DefaultProductCard {product} {aspectRatio} {hideCartControls} {priority} />
{:else}
	<ProductCardRenderer {product} {aspectRatio}>
		{#snippet content({ aspectHeight, toggleWishlist, isWishlisted, aspectWidth, handleCardClick, changeQuantity, addToCart })}
			<section
				data-testid="product-card-{product.id}"
				data-productid="product-card-{product.id}"
				class="product-card group relative flex w-full flex-col overflow-hidden bg-card transition-all duration-300"
			>
				<!-- Same href as the title link below. It used to carry
			     `?variant_id={first variant id or ''}`, so every product was linked from two
			     distinct URLs per card (and from a literal `?variant_id=` when it had no
			     variants). The PDP resolves the default variant itself. -->
				<a data-testid="product-card-link" class="w-full cursor-pointer" href="/products/{product.slug}" aria-label="View details of {displayName}">
					<figure title={displayName} data-testid="product-card-image-container" class="relative">
						{#if imageSrc && !imageFailed}
							<div onloadcapture={() => (imageFailed = false)} onerrorcapture={() => (imageFailed = true)}>
								<LazyImg
									src={imageSrc}
									alt="{displayName} product image"
									sizes="(min-width: 1024px) 25vw, (min-width: 768px) 38vw, 50vw"
									class="w-full rounded-md object-contain object-top transition-transform duration-500"
									{priority}
								/>
							</div>
						{:else}
							<EmptyImage class="w-full object-cover" />
						{/if}

						{#if ratingScore > 0}
							<div data-testid="product-card-rating-container" class="absolute bottom-[6px] left-1 z-10">
								<div class="flex items-center gap-1 rounded-3xl bg-card px-[6px] py-1 lg:px-[9px]">
									<div class="min-w-[12px]">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											fill="none"
											viewBox="0 0 12 12"
											class="text-warning"
											aria-hidden="true"
										>
											<path
												fill="currentColor"
												d="M5.58 1.15a.5.5 0 0 1 .84 0l1.528 2.363a.5.5 0 0 0 .291.212l2.72.722a.5.5 0 0 1 .26.799L9.442 7.429a.5.5 0 0 0-.111.343l.153 2.81a.5.5 0 0 1-.68.493L6.18 10.063a.5.5 0 0 0-.36 0l-2.625 1.014a.5.5 0 0 1-.68-.494l.153-2.81a.5.5 0 0 0-.11-.343L.781 5.246a.5.5 0 0 1 .26-.799l2.719-.722a.5.5 0 0 0 .291-.212L5.58 1.149Z"
											></path>
										</svg>
									</div>
									<span class="text-[10px] font-bold text-foreground lg:text-xs">
										{ratingScore.toFixed(1)}
									</span>
									{#if ratingCount > 0}
										<span class="text-[10px] text-muted-foreground lg:text-xs">({ratingCount})</span>
									{/if}
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
						{#if wishlistPlugin?.active}
							<div class="absolute right-1 top-1 z-10 md:right-2 md:top-2">
								<!-- 44px on touch, 36px under a fine pointer: the heart sits on top of the
								     full-card link, so a missed tap opened the product instead of saving it. -->
								<Button
									variant="ghost"
									size="icon"
									class="size-11 rounded-full bg-card/80 shadow-sm backdrop-blur-sm hover:bg-card md:size-9"
									data-testid="wishlist-button"
									onclick={(e) => {
										e.stopPropagation()
										e.preventDefault()
										toggleWishlist()
									}}
								>
									{#if isWishlisted}
										<Heart class="size-4 fill-primary stroke-primary" />
									{:else}
										<Heart class="size-4" />
									{/if}
									<span class="sr-only">{isWishlisted ? `Remove ${displayName} from wishlist` : `Add ${displayName} to wishlist`}</span>
								</Button>
							</div>
						{/if}
					</figure>
				</a>

				<div data-testid="product-card-info-wrapper" class="flex h-full flex-col justify-between pt-[7.5px] lg:pt-3">
					<a href="/products/{product.slug}" class="block flex-1 overflow-hidden">
						<span class="block w-[80%] text-xs text-muted-foreground lg:text-sm" data-testid="product-title" title={displayName}>
							{displayName}
						</span>
					</a>

					<div class="flex items-center gap-2" data-testid="product-card-price-container">
						{#if hasPriceRange}
							<span class="text-xs text-muted-foreground">From</span>
						{/if}
						<span data-testid="product-card-selling-price" class="text-sm font-semibold text-foreground">
							{formatPrice(minPrice, page?.data?.store?.currency?.code)}
						</span>
						{#if product.mrp && product.mrp > product.price}
							<span class="text-xs text-muted-foreground line-through" data-testid="product-card-mrp">
								{formatPrice(product.mrp, page?.data?.store?.currency?.code)}
							</span>
							<span class="hidden text-xs font-bold uppercase text-success md:block lg:text-sm" data-testid="product-card-discount">
								{discount}% OFF
							</span>
						{/if}
					</div>

					{#if !hideCartControls}
						<div class="mt-3">
							{#if cartState?.cart?.lineItems?.some((item: CartLineItem) => item.productId === product.id)}
								<div class="flex items-center justify-between rounded-md border border-border p-1">
									<Button
										class="size-11 md:size-9"
										disabled={!!cartState.isUpdatingCart}
										variant="ghost"
										size="icon"
										aria-label="Decrease quantity"
										onclick={() => changeQuantity(product, -1)}
									>
										<Minus class="h-4 w-4" />
									</Button>
									<div class="flex-1 text-center text-sm font-bold">
										{#if cartState.isUpdatingCart}
											<Spinner label="Updating quantity" />
										{:else}
											{cartState.cart?.lineItems?.find((item: CartLineItem) => item.productId === product.id)?.qty}
										{/if}
									</div>
									<Button
										class="size-11 md:size-9"
										disabled={!!cartState.isUpdatingCart}
										variant="ghost"
										size="icon"
										aria-label="Increase quantity"
										onclick={() => changeQuantity(product, 1)}
									>
										<Plus class="h-4 w-4" />
									</Button>
								</div>
							{:else}
								<Button disabled={!!cartState?.isUpdatingCart} variant="default" class="w-full py-5" onclick={() => addToCart(product)}>
									{#if cartState?.isUpdatingCart}
										<Spinner label="Adding to bag" />
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
{/if}
