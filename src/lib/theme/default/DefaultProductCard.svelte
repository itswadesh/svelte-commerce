<script lang="ts">
	import { page } from '$app/state'
	import { Plus, Minus, Heart, ImageOff } from '@lucide/svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import { getCartState } from '$lib/core/stores/index.js'
	import type { CartLineItem } from '$lib/core/types/index.js'
	import { formatPrice } from '$lib/core/utils'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import { toCssRatio } from '$lib/theme/aspect-ratio.js'

	const cartState = getCartState()

	let { product, aspectRatio, hideCartControls = true, priority = false }: any = $props()

	const currencyCode = $derived(page?.data?.store?.currency?.code)

	// The store's productImageAspectRatio is the fallback, not a hard-coded square. Only the
	// homepage passed an explicit ratio, so the SAME three products rendered 2:3 portrait there
	// and 1:1 square on /products, /collections/[slug] and the PDP recommendations — one catalogue,
	// two shapes. LimeProductCard and NoorProductCard already resolve the store setting this way;
	// this card was the only one in the family that dropped it.
	const mediaRatio = $derived(toCssRatio(aspectRatio || page?.data?.store?.productImageAspectRatio, '1:1'))

	// One resolved display name for the visible text, the tooltip, the alt text and the link
	// label. A connector that normalises the product onto `name` used to leave the card with an
	// image and a price and no title at all.
	const displayName = $derived(product?.title || product?.name || '')

	// Variant-aware price. `product.price` is only the cheapest variant, so a product whose
	// variants cost different amounts (a gift card at 25 or 50) advertised the low number as if
	// it were the price and doubled on the product page. Min and max come from the variants the
	// listing already carries; with no usable variant prices this falls back to the flat price.
	const variantPrices = $derived(
		(Array.isArray(product?.variants) ? product.variants : [])
			.map((variant: any) => Number(variant?.price))
			.filter((value: number) => Number.isFinite(value) && value > 0)
	)
	const minPrice = $derived(variantPrices.length ? Math.min(...variantPrices) : product?.price)
	const maxPrice = $derived(variantPrices.length ? Math.max(...variantPrices) : product?.price)
	const hasPriceRange = $derived(Number(maxPrice) > Number(minPrice))

	const discount = $derived(product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0)
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)
	const tag = $derived(product?.material?.[0])

	// Score and count are different numbers. The badge used to print `ratings.length` whenever the
	// backend sent reviews without a pre-computed score, so three one-star reviews read as a 3.
	// Averaging matches the product page (product-title-section.svelte).
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

	// The image's own states. LazyImg keeps its pulsing placeholder up forever when a src 404s
	// and shows the browser's broken-image glyph for priority images, which is two different
	// broken presentations in one grid. Load and error are caught in the capture phase (neither
	// event bubbles) so the card can swap in the shared empty surface instead.
	let imageLoaded = $state(false)
	let imageFailed = $state(false)

	// An image that finished before hydration fires neither event, so its final state is read
	// once from the element. `decode()` answers for both outcomes without guessing at
	// naturalWidth, which is 0 for perfectly good SVGs.
	function trackImage(node: HTMLElement) {
		const sync = () => {
			const img = node.querySelector('img')
			if (!img?.complete) return
			img
				.decode()
				.then(() => {
					imageLoaded = true
				})
				.catch(() => {
					imageFailed = true
				})
		}

		sync()
		const observer = new MutationObserver(sync)
		observer.observe(node, { childList: true, subtree: true })

		return {
			destroy: () => observer.disconnect()
		}
	}
</script>

<ProductCardRenderer {product} {aspectRatio}>
	{#snippet content({ toggleWishlist, isWishlisted, changeQuantity, addToCart })}
		<section data-testid="product-card-{product.id}" data-productid="product-card-{product.id}" class="dpc group">
			<!-- Same URL as the title link below. This used to append `?variant_id=`, often empty, so
			     one product had two crawlable URLs and the image and title on a single card pointed
			     at different ones. -->
			<a data-testid="product-card-link" class="dpc__media-link" href="/products/{product.slug}" aria-label="View details of {displayName}">
				<figure title={displayName} data-testid="product-card-image-container" class="dpc__media" style="aspect-ratio: {mediaRatio};">
					{#if imageSrc && !imageFailed}
						<div class="dpc__frame" use:trackImage onloadcapture={() => (imageLoaded = true)} onerrorcapture={() => (imageFailed = true)}>
							<LazyImg
								src={imageSrc}
								alt="{displayName} product image"
								sizes="(min-width: 1024px) 25vw, (min-width: 768px) 38vw, 50vw"
								class="dpc__img"
								{priority}
							/>
						</div>
						{#if !imageLoaded}
							<!-- Covers LazyImg's own hard-coded grey pulse, and covers the gap a priority
							     image leaves while it downloads, at the reserved size. -->
							<Skeleton class="dpc__skeleton" />
						{/if}
					{:else}
						<div class="dpc__empty" data-testid="product-card-empty-image">
							<ImageOff class="dpc__empty-icon" aria-hidden="true" />
						</div>
					{/if}

					{#if tag}
						<div class="dpc__tag">
							<span data-testid="product-card-tag">{tag}</span>
						</div>
					{/if}

					{#if ratingScore > 0}
						<div data-testid="product-card-rating-container" class="dpc__rating">
							<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 12 12" aria-hidden="true">
								<path
									fill="currentColor"
									d="M5.58 1.15a.5.5 0 0 1 .84 0l1.528 2.363a.5.5 0 0 0 .291.212l2.72.722a.5.5 0 0 1 .26.799L9.442 7.429a.5.5 0 0 0-.111.343l.153 2.81a.5.5 0 0 1-.68.493L6.18 10.063a.5.5 0 0 0-.36 0l-2.625 1.014a.5.5 0 0 1-.68-.494l.153-2.81a.5.5 0 0 0-.11-.343L.781 5.246a.5.5 0 0 1 .26-.799l2.719-.722a.5.5 0 0 0 .291-.212L5.58 1.149Z"
								></path>
							</svg>
							<span class="dpc__rating-score">{ratingScore.toFixed(1)}</span>
							{#if ratingCount > 0}
								<span class="dpc__rating-count">({ratingCount})</span>
							{/if}
						</div>
					{/if}

					{#if wishlistPlugin?.active}
						<button
							type="button"
							class="dpc__wish"
							data-testid="wishlist-button"
							aria-label={isWishlisted ? `Remove ${displayName} from wishlist` : `Add ${displayName} to wishlist`}
							onclick={(e) => {
								e.stopPropagation()
								e.preventDefault()
								toggleWishlist()
							}}
						>
							{#if isWishlisted}
								<Heart class="dpc__wish-icon is-on" />
							{:else}
								<Heart class="dpc__wish-icon" />
							{/if}
						</button>
					{/if}
				</figure>
			</a>

			<div data-testid="product-card-info-wrapper" class="dpc__info">
				<a href="/products/{product.slug}" class="dpc__title-link">
					<span class="dpc__title" data-testid="product-title" title={displayName}>{displayName}</span>
				</a>

				<div class="dpc__price" data-testid="product-card-price-container">
					{#if hasPriceRange}
						<span class="dpc__price-from">From</span>
					{/if}
					<span data-testid="product-card-selling-price" class="dpc__price-now">
						{formatPrice(minPrice, currencyCode)}
					</span>
					{#if product.mrp && product.mrp > product.price}
						<span class="dpc__price-mrp" data-testid="product-card-mrp">
							{formatPrice(product.mrp, currencyCode)}
						</span>
						<span class="dpc__price-off" data-testid="product-card-discount">{discount}% off</span>
					{/if}
				</div>

				{#if !hideCartControls}
					<div class="dpc__cart">
						{#if cartState?.cart?.lineItems?.some((item: CartLineItem) => item.productId === product.id)}
							<div class="dpc__qty">
								<button
									type="button"
									disabled={!!cartState.isUpdatingCart}
									aria-label="Decrease quantity"
									onclick={() => changeQuantity(product, -1)}
								>
									<Minus class="dpc__qty-icon" />
								</button>
								<span class="dpc__qty-val">
									{#if cartState.isUpdatingCart}
										<LoadingDots />
									{:else}
										{cartState.cart?.lineItems?.find((item: CartLineItem) => item.productId === product.id)?.qty}
									{/if}
								</span>
								<button type="button" disabled={!!cartState.isUpdatingCart} aria-label="Increase quantity" onclick={() => changeQuantity(product, 1)}>
									<Plus class="dpc__qty-icon" />
								</button>
							</div>
						{:else}
							<button type="button" class="dpc__add" disabled={!!cartState?.isUpdatingCart} onclick={() => addToCart(product)}>
								{#if cartState?.isUpdatingCart}
									<LoadingDots />
								{:else}
									Quick Add
								{/if}
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	{/snippet}
</ProductCardRenderer>

<style>
	.dpc {
		position: relative;
		display: flex;
		width: 100%;
		flex-direction: column;
		font-family: var(--ed-body);
		color: var(--ed-ink);
	}

	.dpc__media-link {
		display: block;
		cursor: pointer;
	}

	.dpc__media {
		position: relative;
		margin: 0;
		overflow: hidden;
		border-radius: var(--ed-radius);
		background: var(--ed-surface);
	}

	/* LazyImg wraps the <img> in its own aspect-ratio box (the store's image ratio). Force that
	   wrapper (its `.w-full` root — not the absolute tag/rating overlays) to fill this fixed 1:1
	   container so every card's image area is the exact same height. */
	.dpc__frame,
	.dpc__frame > :global(.w-full) {
		height: 100%;
	}

	.dpc :global(.dpc__img) {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}

	/* LazyImg's own placeholder is a hard-coded grey pulse that never stops when a src 404s, and
	   priority images skip it altogether. The card owns the loading and error surfaces instead —
	   the package component is not edited, its placeholder is simply not used here. */
	.dpc__frame :global(.animate-pulse) {
		display: none;
	}

	/* Loading and empty share one ground, so a card that is waiting and a card that has nothing
	   to show read as the same reserved frame instead of two different faults. */
	.dpc :global(.dpc__skeleton) {
		position: absolute;
		inset: 0;
		z-index: 1;
		border-radius: 0;
	}

	/* The card surface with a hairline, not the muted fill. A merchant palette can set --muted to a
	   mid tone — this store ships 240 10% 70% — and a grid of mid-grey blocks where the photographs
	   belong reads as broken images rather than as "no photo yet". Matches the product page. */
	.dpc :global(.dpc__skeleton),
	.dpc__empty {
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
	}

	.dpc__empty {
		display: grid;
		height: 100%;
		width: 100%;
		place-items: center;
	}

	.dpc :global(.dpc__empty-icon) {
		width: 28px;
		height: 28px;
		stroke-width: 1.25;
		color: hsl(var(--muted-foreground));
		opacity: 0.55;
	}

	.dpc__tag {
		position: absolute;
		left: 10px;
		top: 10px;
		z-index: 2;
	}

	.dpc__tag span {
		display: inline-block;
		padding: 4px 9px;
		background: var(--ed-surface);
		color: var(--ed-ink);
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		border-radius: 2px;
	}

	.dpc__rating {
		position: absolute;
		left: 10px;
		bottom: 10px;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 3px 8px;
		background: var(--ed-surface);
		border-radius: 999px;
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--ed-ink);
	}

	.dpc__rating svg {
		color: hsl(var(--warning));
	}

	.dpc__rating-count {
		font-weight: 500;
		color: var(--ed-soft);
	}

	.dpc__wish {
		position: absolute;
		right: 6px;
		top: 6px;
		z-index: 2;
		display: grid;
		place-items: center;
		/* Touch first: a 44px box with the same 16px heart inside it, so the visual weight is
		   unchanged and the target is not a 34px square sitting on top of the card link. */
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 999px;
		background: hsl(var(--card) / 0.85);
		backdrop-filter: blur(4px);
		cursor: pointer;
		transform: translateY(0);
		transition:
			opacity 0.3s ease,
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.2s ease;
	}

	/* Reveal-on-hover is for pointers only. A phone has no hover, so the heart was never on
	   screen for the majority audience and saving a product meant opening it first. */
	@media (hover: hover) and (pointer: fine) {
		.dpc__wish {
			right: 10px;
			top: 10px;
			width: 36px;
			height: 36px;
			opacity: 0;
			transform: translateY(-4px);
		}

		.dpc:hover .dpc__wish,
		.dpc__wish:focus-visible {
			opacity: 1;
			transform: translateY(0);
		}

		.dpc__wish:hover {
			background: hsl(var(--card));
		}
	}

	.dpc :global(.dpc__wish-icon) {
		width: 16px;
		height: 16px;
		stroke-width: 1.6;
		color: var(--ed-ink);
	}

	.dpc :global(.dpc__wish-icon.is-on) {
		fill: hsl(var(--primary));
		color: hsl(var(--primary));
	}

	.dpc__info {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-top: 12px;
	}

	.dpc__title-link {
		display: block;
		color: inherit;
	}

	.dpc__title {
		display: block;
		font-size: 0.9rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--ed-ink);
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		transition: color 0.2s ease;
	}

	.dpc:hover .dpc__title {
		color: hsl(var(--primary));
	}

	.dpc__price {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 6px;
	}

	.dpc__price-from {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--ed-soft);
	}

	.dpc__price-now {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ed-ink);
	}

	.dpc__price-mrp {
		font-size: 0.8rem;
		color: var(--ed-soft);
		text-decoration: line-through;
	}

	.dpc__price-off {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: hsl(var(--success));
	}

	.dpc__cart {
		margin-top: 10px;
	}

	.dpc__add {
		width: 100%;
		height: 44px;
		border: 1px solid var(--ed-ink);
		border-radius: var(--ed-radius);
		background: transparent;
		color: var(--ed-ink);
		font-family: var(--ed-body);
		font-size: 0.74rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			background 0.25s ease,
			color 0.25s ease;
	}

	.dpc__add:hover:not(:disabled) {
		background: var(--ed-ink);
		color: var(--ed-canvas);
	}

	.dpc__add:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.dpc__qty {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 48px;
		border: 1px solid var(--ed-line-strong);
		border-radius: var(--ed-radius);
	}

	/* 44px on touch, the desktop 36px box under a fine pointer. */
	.dpc__qty button {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: var(--ed-radius);
		background: transparent;
		color: var(--ed-ink);
		cursor: pointer;
	}

	@media (hover: hover) and (pointer: fine) {
		.dpc__qty {
			height: 40px;
			padding: 0 4px;
		}

		.dpc__qty button {
			width: 36px;
			height: 36px;
		}
	}

	.dpc__qty button:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.dpc :global(.dpc__qty-icon) {
		width: 15px;
		height: 15px;
	}

	.dpc__qty-val {
		flex: 1;
		text-align: center;
		font-size: 0.85rem;
		font-weight: 600;
	}

	@media (prefers-reduced-motion: reduce) {
		.dpc :global(.dpc__img),
		.dpc :global(.dpc__skeleton),
		.dpc__wish {
			transition: none;
			animation: none;
		}
	}
</style>
