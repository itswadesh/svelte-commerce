<script lang="ts">
	import { page } from '$app/state'
	import { Heart, ShoppingBag } from '@lucide/svelte'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import { formatPrice } from '$lib/core/utils'

	let { product, aspectRatio, hideCartControls = false }: any = $props()

	const currencyCode = $derived(page?.data?.store?.currency?.code || '')
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)
	const title = $derived(product?.title || product?.name || 'Product')
	const image = $derived(product?.thumbnail || product?.image_url || product?.image || '/noor/product-mk19.jpg')
	const discount = $derived(product?.mrp && product?.mrp > product?.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0)
</script>

<ProductCardRenderer {product} {aspectRatio}>
	{#snippet content({ toggleWishlist, isWishlisted, addToCart })}
		<article class="noor-card" data-testid="product-card-{product.id}">
			<a class="noor-card-media" href="/products/{product.slug}" aria-label="View {title}">
				<img src={image} alt={title} loading="lazy" />
				{#if discount > 0}
					<span class="noor-sale">-{discount}%</span>
				{/if}
				{#if wishlistPlugin?.active}
					<button
						type="button"
						class="noor-wish"
						class:is-active={isWishlisted}
						aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
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
						Price on request
					{/if}
					{#if product?.mrp && product.mrp > product.price}
						<span>{formatPrice(product.mrp, currencyCode)}</span>
					{/if}
				</p>
			</a>
			{#if !hideCartControls}
				<button class="noor-add" type="button" onclick={() => addToCart(product)}>
					<ShoppingBag class="h-4 w-4" />
					Add to Cart
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
		aspect-ratio: 3 / 4;
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
