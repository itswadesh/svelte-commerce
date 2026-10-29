<script lang="ts">
	import { page } from '$app/state'
	import { Plus, Minus, Heart, ImageOff } from '@lucide/svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import { getCartState } from '$lib/core/stores/index.js'
	import type { CartLineItem } from '$lib/core/types/index.js'
	import { formatPrice } from '$lib/utils/price'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import { toCssRatio } from '$lib/theme/aspect-ratio.js'
	import { themeOptions } from '$lib/composer/theme-options.js'
	import { productBadge } from '$lib/product/badge.js'

	const cartState = getCartState()

	let { product, aspectRatio, hideCartControls = true, priority = false }: any = $props()

	const currencyCode = $derived(page?.data?.store?.currency?.code)
	// What the card shows is the store's choice (its theme settings); unset, the defaults apply.
	const options = $derived(themeOptions(page?.data?.themeSettings))

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
	const vendor = $derived(options.card_vendor ? (product?.vendor?.businessName || product?.brand?.name || '').trim() : '')

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

	const discounted = $derived(options.card_discount && product.mrp && product.mrp > product.price)
	const discount = $derived(discounted ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0)
	const showWishlist = $derived(options.card_wishlist && page?.data?.store?.plugins?.isWishlist?.active)
	const showCart = $derived(options.card_add_to_cart || !hideCartControls)

	const badge = $derived(productBadge(product, options.card_badge))

	// Score and count are different numbers. The badge used to print `ratings.length` whenever the
	// backend sent reviews without a pre-computed score, so three one-star reviews read as a 3.
	// Averaging matches the product page (product-title-section.svelte).
	const ratingList = $derived(Array.isArray(product?.ratings) ? product.ratings : [])
	const ratingScore = $derived.by(() => {
		if (!options.card_rating) return 0
		const direct = Number(product?.rating ?? (Array.isArray(product?.ratings) ? undefined : product?.ratings))
		if (Number.isFinite(direct) && direct > 0) return Math.floor(direct * 10) / 10
		const scores = ratingList.map((entry: any) => Number(entry?.rating)).filter((value: number) => Number.isFinite(value) && value > 0)
		if (!scores.length) return 0
		return Math.floor((scores.reduce((acc: number, cur: number) => acc + cur, 0) / scores.length) * 10) / 10
	})
	const ratingCount = $derived(ratingList.length || Number(product?.ratingCount) || 0)

	const imageSrc = $derived(product.thumbnail || product?.image_url)
	const secondSrc = $derived.by(() => {
		if (!options.card_second_image) return ''
		const list = Array.isArray(product?.imageList) ? product.imageList : String(product?.images ?? '').split(',')
		return String(list.map((u: unknown) => String(u ?? '').trim()).find((u: string) => u && u !== imageSrc) ?? '')
	})
	// The second picture is fetched on the first mouse hover, not with the grid: a phone never
	// hovers, so it never pays for a picture it cannot see.
	let wantsSecond = $state(false)
	let secondLoaded = $state(false)

	// The image's own states. LazyImg keeps its pulsing placeholder up forever when a src 404s
	// and shows the browser's broken-image glyph for priority images, which is two different
	// broken presentations in one grid. Load and error are caught in the capture phase (neither
	// event bubbles) so the card can swap in the shared empty surface instead.
	let imageLoaded = $state(false)
	// Restarts the heart pop on each toggle; 0 means "not touched yet", so a page load does not pop.
	let popKey = $state(0)
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
			<a
				data-testid="product-card-link"
				class="dpc__media-link"
				href="/products/{product.slug}"
				aria-label="View details of {displayName}"
				onpointerenter={(e) => {
					if (secondSrc && e.pointerType === 'mouse') wantsSecond = true
				}}
			>
				<figure title={displayName} data-testid="product-card-image-container" class="dpc__media" style="aspect-ratio: var(--product-image-ratio, {mediaRatio});">
					{#if imageSrc && !imageFailed}
						<div
							class="dpc__frame"
							data-vt-product-media={product.slug}
							use:trackImage
							onloadcapture={() => (imageLoaded = true)}
							onerrorcapture={() => (imageFailed = true)}
						>
							<LazyImg
								src={imageSrc}
								alt="{displayName} product image"
								sizes="(min-width: 1280px) 14vw, (min-width: 1024px) 17vw, (min-width: 768px) 21vw, 46vw"
								class="dpc__img"
								{priority}
							/>
						</div>
						{#if wantsSecond}
							<div class="dpc__frame dpc__second" class:is-ready={secondLoaded} aria-hidden="true" onloadcapture={() => (secondLoaded = true)}>
								<LazyImg src={secondSrc} alt="" sizes="(min-width: 1280px) 14vw, (min-width: 1024px) 17vw, 21vw" class="dpc__img" />
							</div>
						{/if}
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

					{#if badge}
						<div class="dpc__tag">
							<span data-testid="product-card-tag">{badge}</span>
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
				</figure>
			</a>

			<div data-testid="product-card-info-wrapper" class="dpc__info">
				<!-- Name (with the brand above it when the store shows one) and the heart on one row,
				     under the picture rather than over it, so it is on screen on a phone too. -->
				<div class="dpc__head">
					<a href="/products/{product.slug}" class="dpc__title-link">
						{#if vendor}
							<span class="dpc__vendor" data-testid="product-card-vendor">{vendor}</span>
						{/if}
						<span class="dpc__title" class:has-vendor={!!vendor} class:is-two={options.card_title_lines === 'two'} data-testid="product-title" title={displayName}
							>{displayName}</span
						>
					</a>

					{#if showWishlist}
						<button
							type="button"
							class="dpc__wish"
							data-testid="wishlist-button"
							aria-pressed={!!isWishlisted}
							aria-label={isWishlisted ? `Remove ${displayName} from wishlist` : `Add ${displayName} to wishlist`}
							onclick={(e) => {
								e.stopPropagation()
								e.preventDefault()
								popKey++
								toggleWishlist()
							}}
						>
							{#key popKey}
								<Heart class="dpc__wish-icon {isWishlisted ? 'is-on' : ''} {popKey && isWishlisted ? 'motion-pop' : ''}" />
							{/key}
						</button>
					{/if}
				</div>

				<div class="dpc__price" data-testid="product-card-price-container">
					{#if hasPriceRange}
						<span class="dpc__price-from">From</span>
					{/if}
					<span data-testid="product-card-selling-price" class="dpc__price-now">
						{formatPrice(minPrice, currencyCode)}
					</span>
					{#if discounted}
						<span class="dpc__price-mrp" data-testid="product-card-mrp">
							{formatPrice(product.mrp, currencyCode)}
						</span>
						<span class="dpc__price-off" data-testid="product-card-discount">{discount}% off</span>
					{/if}
				</div>

				{#if showCart}
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
									Add to bag
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
	/* Picture, name, price and cart are four rows of the grid the cards sit in (subgrid), so a
	   row of cards shares one name height and its prices line up. Outside a grid the rows are
	   just auto. */
	.dpc {
		position: relative;
		display: grid;
		grid-row: span 4;
		grid-template-rows: subgrid;
		row-gap: 0;
		align-content: start;
		width: 100%;
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
		/* --product-image-*: the shop's own choice from its theme settings (theme-tokens.ts). */
		object-fit: var(--product-image-fit, contain);
		display: block;
	}

	/* The second picture lies over the first and fades in under the pointer once it has loaded. */
	.dpc__second {
		position: absolute;
		inset: 0;
		z-index: 1;
		opacity: 0;
		background: var(--ed-surface);
		transition: opacity var(--motion-emphasis) var(--motion-ease);
	}

	@media (hover: hover) and (pointer: fine) {
		.dpc__media-link:hover .dpc__second.is-ready {
			opacity: 1;
		}
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
	   mid tone, and a grid of mid-grey blocks where the photographs belong reads as broken images
	   rather than as "no photo yet". Matches the product page. */
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
		width: 22px;
		height: 22px;
		stroke-width: 1.25;
		color: hsl(var(--muted-foreground));
		opacity: 0.55;
	}

	.dpc__tag {
		position: absolute;
		left: 8px;
		top: 8px;
		right: 8px;
		z-index: 2;
		display: flex;
	}

	/* 11px: the one size UX_SYSTEM reserves for a badge. */
	.dpc__tag span {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 3px 6px;
		background: hsl(var(--card) / 0.92);
		color: var(--ed-ink);
		font-size: 0.6875rem;
		font-weight: 600;
		line-height: 1.2;
		border-radius: max(0px, calc(var(--radius) - 4px));
	}

	.dpc__rating {
		position: absolute;
		left: 8px;
		bottom: 8px;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 3px;
		padding: 3px 7px;
		background: hsl(var(--card) / 0.92);
		border-radius: 999px;
		font-size: var(--type-dense);
		font-weight: 600;
		line-height: 1.2;
		color: var(--ed-ink);
		font-variant-numeric: tabular-nums;
	}

	.dpc__rating svg {
		color: hsl(var(--warning));
	}

	.dpc__rating-count {
		font-weight: 500;
		color: var(--ed-soft);
	}

	.dpc__info {
		display: contents;
	}

	.dpc__head {
		display: flex;
		align-items: flex-start;
		gap: 4px;
		padding-top: 8px;
	}

	.dpc__title-link {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
		color: inherit;
	}

	.dpc__vendor {
		overflow: hidden;
		font-size: var(--type-ui);
		font-weight: 700;
		line-height: 1.35;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--ed-ink);
	}

	/* One line or two is the store's choice (card_title_lines). Under a brand line the name is
	   the supporting detail, so it steps back to the muted colour. */
	.dpc__title {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		font-size: var(--type-ui);
		font-weight: 500;
		line-height: 1.35;
		color: var(--ed-ink);
		text-underline-offset: 3px;
	}

	.dpc__title.is-two {
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.dpc__title.has-vendor {
		font-weight: 400;
		color: var(--ed-soft);
	}

	.dpc__title-link:hover .dpc__title {
		text-decoration: underline;
	}

	/* A 44px target on touch around a 20px heart; the negative margins keep it from making the name
	   row taller. A mouse gets a 32px box. */
	.dpc__wish {
		display: grid;
		flex: none;
		place-items: center;
		width: 44px;
		height: 44px;
		margin: -12px -12px -12px 0;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--ed-ink);
		cursor: pointer;
		transition:
			background var(--motion-fast) var(--motion-ease),
			transform var(--motion-fast) var(--motion-ease);
	}

	@media (hover: hover) and (pointer: fine) {
		.dpc__wish {
			width: 32px;
			height: 32px;
			margin: -6px -6px -6px 0;
		}

		.dpc__wish:hover {
			background: hsl(var(--muted));
		}
	}

	.dpc__wish:active {
		transform: scale(0.9);
	}

	.dpc :global(.dpc__wish-icon) {
		width: 20px;
		height: 20px;
		stroke-width: 1.6;
		transition: fill var(--motion-fast) var(--motion-ease);
	}

	.dpc :global(.dpc__wish-icon.is-on) {
		fill: hsl(var(--primary-ink));
		color: hsl(var(--primary-ink));
	}

	/* Price, was-price and saving on one line; it wraps only when a card is too narrow for all
	   three. The subgrid row keeps a grid row's prices level whichever wraps. */
	.dpc__price {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		align-content: flex-start;
		column-gap: 6px;
		row-gap: 0;
		margin-top: 2px;
		/* The price sizes itself against the card, not the viewport: the same card is ~160px wide in
		   two columns on a phone and ~150px in three on a tablet. The container is the price row, not
		   the card, because a container is layout-contained and the card could not be a subgrid. */
		container-type: inline-size;
		line-height: 1.35;
		font-variant-numeric: tabular-nums;
	}

	.dpc__price-from {
		font-size: var(--type-dense);
		font-weight: 500;
		color: var(--ed-soft);
	}

	.dpc__price-now {
		font-size: var(--type-body);
		font-weight: 700;
		color: var(--ed-ink);
	}

	.dpc__price-mrp {
		font-size: var(--type-dense);
		color: var(--ed-soft);
		text-decoration: line-through;
	}

	.dpc__price-off {
		font-size: var(--type-dense);
		font-weight: 700;
		white-space: nowrap;
		color: hsl(var(--sale));
	}

	/* Narrow cards step the price down a role so price and was-price keep to the first line. */
	@container (max-width: 172px) {
		.dpc__price-now {
			font-size: var(--type-ui);
		}
	}

	.dpc__cart {
		margin-top: 8px;
	}

	.dpc__add {
		width: 100%;
		height: 44px;
		border: 1px solid var(--ed-line-strong);
		border-radius: var(--ed-radius);
		background: transparent;
		color: var(--ed-ink);
		font-family: var(--ed-body);
		font-size: var(--type-label);
		font-weight: 600;
		cursor: pointer;
	}

	.dpc__add:hover:not(:disabled) {
		border-color: hsl(var(--primary));
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
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
		font-size: var(--type-ui);
		font-weight: 600;
	}

	/* Hover lifts the photograph a little; a press gives under the finger. Pointer-only for the zoom,
	   because a phone has no hover and a tap would leave it stuck. */
	.dpc__frame {
		transition: transform var(--motion-emphasis) var(--motion-ease);
	}
	.dpc__media {
		transition: transform var(--motion-fast) var(--motion-ease);
	}
	@media (hover: hover) and (pointer: fine) {
		.dpc:hover .dpc__frame {
			transform: scale(1.03);
		}
	}
	.dpc__media-link:active .dpc__media {
		transform: scale(0.98);
	}
	.dpc__add {
		transition:
			background var(--motion-fast) var(--motion-ease),
			border-color var(--motion-fast) var(--motion-ease),
			color var(--motion-fast) var(--motion-ease),
			transform var(--motion-fast) var(--motion-ease);
	}
	.dpc__add:active:not(:disabled),
	.dpc__qty button:active:not(:disabled) {
		transform: scale(0.97);
	}

	/* Still: no zoom, press or pop. The second picture and the colour changes still fade, so every
	   hover and tap still answers. */
	@media (prefers-reduced-motion: reduce) {
		.dpc :global(.dpc__skeleton) {
			animation: none;
		}
		.dpc__frame,
		.dpc__media,
		.dpc__wish,
		.dpc__add,
		.dpc__qty button {
			transform: none !important;
		}
	}
</style>
