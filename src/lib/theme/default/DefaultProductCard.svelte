<script lang="ts">
	import { page } from '$app/state'
	import { Plus, Minus, Heart } from '@lucide/svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import EmptyImage from '$lib/core/components/image/empty-image.svelte'
	import { getCartState } from '$lib/core/stores/index.js'
	import type { CartLineItem } from '$lib/core/types/index.js'
	import { formatPrice } from '$lib/core/utils'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'

	const cartState = getCartState()

	let { product, aspectRatio, hideCartControls = true, priority = false }: any = $props()

	const discount = $derived(product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0)
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)
	const tag = $derived(product?.material?.[0])
</script>

<ProductCardRenderer {product} {aspectRatio}>
	{#snippet content({ toggleWishlist, isWishlisted, changeQuantity, addToCart })}
		<section
			data-testid="product-card-{product.id}"
			data-productid="product-card-{product.id}"
			class="dpc group"
		>
			<a
				data-testid="product-card-link"
				class="dpc__media-link"
				href="/products/{product.slug}?variant_id={product?.variants?.[0]?.id || ''}"
				aria-label="View details of {product.name}"
			>
				<figure title={product.name} data-testid="product-card-image-container" class="dpc__media" style="aspect-ratio: {aspectRatio || '1 / 1'};">
					{#if product.thumbnail || product?.image_url}
						<LazyImg
							src={product.thumbnail || product?.image_url}
							alt="{product.title || product.name} product image"
							sizes="(min-width: 1024px) 25vw, (min-width: 768px) 38vw, 50vw"
							class="dpc__img"
							{priority}
						/>
					{:else}
						<EmptyImage class="dpc__img" />
					{/if}

					{#if tag}
						<div class="dpc__tag">
							<span data-testid="product-card-tag">{tag}</span>
						</div>
					{/if}

					{#if product.rating || (Array.isArray(product.ratings) && product.ratings.length > 0)}
						<div data-testid="product-card-rating-container" class="dpc__rating">
							<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 12 12" aria-hidden="true">
								<path
									fill="#c9a227"
									d="M5.58 1.15a.5.5 0 0 1 .84 0l1.528 2.363a.5.5 0 0 0 .291.212l2.72.722a.5.5 0 0 1 .26.799L9.442 7.429a.5.5 0 0 0-.111.343l.153 2.81a.5.5 0 0 1-.68.493L6.18 10.063a.5.5 0 0 0-.36 0l-2.625 1.014a.5.5 0 0 1-.68-.494l.153-2.81a.5.5 0 0 0-.11-.343L.781 5.246a.5.5 0 0 1 .26-.799l2.719-.722a.5.5 0 0 0 .291-.212L5.58 1.149Z"
								></path>
							</svg>
							<span>{product.rating || (Array.isArray(product.ratings) ? product.ratings.length : product.ratings)}</span>
						</div>
					{/if}

					{#if wishlistPlugin?.active}
						<button
							type="button"
							class="dpc__wish"
							data-testid="wishlist-button"
							aria-label="Toggle wishlist"
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
					<span class="dpc__title" data-testid="product-title" title={product.title}>{product.title}</span>
				</a>

				<div class="dpc__price" data-testid="product-card-price-container">
					<span data-testid="product-card-selling-price" class="dpc__price-now">
						{formatPrice(product.price, page?.data?.store?.currency?.code)}
					</span>
					{#if product.mrp && product.mrp > product.price}
						<span class="dpc__price-mrp" data-testid="product-card-mrp">
							{formatPrice(product.mrp, page?.data?.store?.currency?.code)}
						</span>
						<span class="dpc__price-off" data-testid="product-card-discount">{discount}% off</span>
					{/if}
				</div>

				{#if !hideCartControls}
					<div class="dpc__cart">
						{#if cartState?.cart?.lineItems?.some((item: CartLineItem) => item.productId === product.id)}
							<div class="dpc__qty">
								<button type="button" disabled={!!cartState.isUpdatingCart} aria-label="Decrease quantity" onclick={() => changeQuantity(product, -1)}>
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
	.dpc__media > :global(.w-full) {
		height: 100%;
	}

	.dpc :global(.dpc__img) {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
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
	}

	.dpc__wish {
		position: absolute;
		right: 10px;
		top: 10px;
		z-index: 2;
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 0;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(4px);
		cursor: pointer;
		opacity: 0;
		transform: translateY(-4px);
		transition:
			opacity 0.3s ease,
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.2s ease;
	}

	.dpc:hover .dpc__wish,
	.dpc__wish:focus-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.dpc__wish:hover {
		background: #fff;
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
		gap: 8px;
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
		color: #2f7d4f;
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
		height: 44px;
		padding: 0 6px;
		border: 1px solid var(--ed-line-strong);
		border-radius: var(--ed-radius);
	}

	.dpc__qty button {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border: 0;
		background: transparent;
		color: var(--ed-ink);
		cursor: pointer;
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
		.dpc__wish {
			transition: none;
		}
	}
</style>
