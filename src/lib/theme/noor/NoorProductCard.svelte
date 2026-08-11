<script lang="ts">
	import { toCssRatio } from '$lib/theme/aspect-ratio.js'
	import { page } from '$app/state'
	import { Heart, Loader2, ShoppingBag } from '@lucide/svelte'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'

	let { product, aspectRatio, hideCartControls = false, themeContent }: any = $props()

	// Store-editable microcopy; the literals are only the fallback when no content is passed.
	const labels = $derived(themeContent?.labels ?? {})

	const currencyCode = $derived(page?.data?.store?.currency?.code || '')
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)
	const title = $derived(
		product?.title || product?.name || labels.productFallbackTitle || 'Product'
	)
	// No stand-in product photo: a product without an image simply shows none.
	const image = $derived(product?.thumbnail || product?.image_url || product?.image || '')
	const discount = $derived(product?.mrp && product?.mrp > product?.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0)

	// The store's configured product image ratio, as a CSS value ('3:4' → '3 / 4'). The card
	// took the `aspectRatio` prop but then hardcoded 3/4 in its stylesheet, so a store set to
	// 1:1 or 16:9 still got 3:4 cards on noor only.
	const mediaRatio = $derived(toCssRatio(aspectRatio || page?.data?.store?.productImageAspectRatio, '3:4'))
</script>

<ProductCardRenderer {product} {aspectRatio}>
	{#snippet content({ toggleWishlist, isWishlisted, addToCart, loadingForCart, loadingForWishlist })}
		<article class="noor-card" data-testid="product-card-{product.id}" style="--noor-media-ratio: {mediaRatio};">
			<a class="noor-card-media" href="/products/{product.slug}" aria-label="View {title}">
				{#if image}
					<img src={image} alt={title} loading="lazy" />
				{/if}
				{#if discount > 0}
					<span class="noor-sale">-{discount}%</span>
				{/if}
				{#if wishlistPlugin?.active}
					<button
						type="button"
						class="noor-wish"
						class:is-active={isWishlisted}
						disabled={loadingForWishlist}
						aria-busy={loadingForWishlist}
						aria-label={isWishlisted
							? labels.removeFromWishlist || 'Remove from wishlist'
							: labels.addToWishlist || 'Add to wishlist'}
						onclick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							toggleWishlist()
						}}
					>
						<Heart class="h-4 w-4" />
					</button>
				{/if}
			</a>
			<a class="noor-card-body" href="/products/{product.slug}">
				<h3>{title}</h3>
				<p>
					{#if product?.price}
						{formatPrice(product.price, currencyCode)}
					{:else}
						{labels.priceOnRequest || 'Price on request'}
					{/if}
					{#if product?.mrp && product.mrp > product.price}
						<span>{formatPrice(product.mrp, currencyCode)}</span>
					{/if}
				</p>
			</a>
			{#if !hideCartControls}
				<!-- Disabled + spinner while the add is in flight; without it the button gave no
				     feedback and an impatient second tap added the item twice. -->
				<button
					class="noor-add"
					type="button"
					disabled={loadingForCart}
					aria-busy={loadingForCart}
					onclick={() => addToCart(product)}
				>
					{#if loadingForCart}
						<Loader2 class="noor-add-spin h-4 w-4" />
					{:else}
						<ShoppingBag class="h-4 w-4" />
					{/if}
					{labels.addToCart || 'Add to Cart'}
				</button>
			{/if}
		</article>
	{/snippet}
</ProductCardRenderer>

<style>
	.noor-card {
		position: relative;
		display: flex;
		flex-direction: column;
		background: #fff;
		color: #171717;
		font-family: var(--font-body);
	}

	.noor-card-media {
		position: relative;
		display: block;
		overflow: hidden;
		background: #f6f2ec;
	}

	.noor-card-media img {
		display: block;
		width: 100%;
		/* Driven by the store's productImageAspectRatio (see mediaRatio above); 3/4 is only
		   the fallback when the store has not configured one. */
		aspect-ratio: var(--noor-media-ratio, 3 / 4);
		object-fit: cover;
		object-position: top center;
		transition: transform 0.45s ease;
	}

	.noor-card:hover .noor-card-media img {
		transform: scale(1.035);
	}

	.noor-sale {
		position: absolute;
		left: 10px;
		top: 10px;
		background: #111;
		color: #fff;
		padding: 4px 8px;
		font-size: 10px;
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0.08em;
	}

	.noor-wish {
		position: absolute;
		right: 10px;
		top: 10px;
		display: grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border: 1px solid rgb(0 0 0 / 0.14);
		background: rgb(255 255 255 / 0.92);
		color: #111;
	}

	.noor-wish.is-active {
		background: #111;
		color: #fff;
	}

	.noor-wish.is-active :global(svg) {
		fill: currentColor;
	}

	.noor-wish:disabled {
		cursor: default;
		opacity: 0.6;
	}

	/* No opacity here — .noor-add's opacity is the hover-reveal animation. */
	.noor-add:disabled {
		cursor: default;
	}

	.noor-add :global(.noor-add-spin) {
		animation: noor-spin 0.7s linear infinite;
	}

	@keyframes noor-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.noor-card-body {
		display: block;
		padding: 13px 0 0;
		text-align: center;
		text-decoration: none;
	}

	.noor-card-body h3 {
		margin: 0;
		color: #171717;
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.04em;
		line-height: 1.45;
		text-transform: uppercase;
	}

	.noor-card-body p {
		margin: 6px 0 0;
		color: #111;
		font-size: 13px;
		font-weight: 500;
		line-height: 1.4;
	}

	.noor-card-body span {
		margin-left: 8px;
		color: #8a8a8a;
		text-decoration: line-through;
	}

	.noor-add {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		margin-top: 14px;
		border: 1px solid #111;
		background: #111;
		color: #fff;
		padding: 11px 12px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}

	.noor-add:hover {
		background: #fff;
		color: #111;
	}

	.noor-card:hover .noor-add,
	.noor-card:focus-within .noor-add {
		opacity: 1;
		transform: none;
	}

	@media (hover: none) {
		.noor-add {
			opacity: 1;
			transform: none;
		}
	}
</style>
