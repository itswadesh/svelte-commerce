<script lang="ts">
	import { page } from '$app/state'
	import { Heart } from '@lucide/svelte'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'
	import { LlImage, LlPrice, LlRating, LlButton } from './ui/index.js'

	/**
	 * Limelight product card.
	 *
	 * Presentation only — all commerce behaviour (navigation, wishlist toggle,
	 * add-to-cart, quantity) is delegated to the shared ProductCardRenderer so
	 * this card stays in lock-step with the rest of the store's logic.
	 *
	 * Visual contract (from themes/limelight/DESIGN.md + the source demand grid):
	 * square blush imagery, centered regular-weight serif title in plum, quiet
	 * price, thin line wishlist icon, square "Add to Bag" outline button.
	 */
	let { product, aspectRatio, hideCartControls = false }: any = $props()

	const currencyCode = $derived(page?.data?.store?.currency?.code || '')
	const wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)

	const rating = $derived(
		typeof product?.rating === 'number'
			? product.rating
			: Array.isArray(product?.ratings)
				? product.ratings.length
				: 0
	)
</script>

<ProductCardRenderer {product} {aspectRatio}>
	{#snippet content({ toggleWishlist, isWishlisted, addToCart })}
		<article class="ll-card" data-testid="product-card-{product.id}">
			<a class="ll-card-media" href="/products/{product.slug}" aria-label="View {product.title || product.name}">
				<LlImage src={product.thumbnail || product?.image_url} alt={product.title || product.name} />

				{#if wishlistPlugin?.active}
					<button
						type="button"
						class="ll-card-wish"
						class:is-active={isWishlisted}
						aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
						onclick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							toggleWishlist()
						}}
					>
						<Heart class="ll-card-wish-icon" />
					</button>
				{/if}
			</a>

			<a class="ll-card-body" href="/products/{product.slug}">
				<h3 class="ll-card-title" title={product.title || product.name}>{product.title || product.name}</h3>
				{#if rating > 0}
					<div class="ll-card-rating"><LlRating value={rating} size={13} /></div>
				{/if}
				<div class="ll-card-price">
					<LlPrice price={product.price} mrp={product.mrp} {currencyCode} />
				</div>
			</a>

			{#if !hideCartControls}
				<div class="ll-card-actions">
					<LlButton variant="outline" full onclick={() => addToCart(product)}>Add to Bag</LlButton>
				</div>
			{/if}
		</article>
	{/snippet}
</ProductCardRenderer>

<style>
	.ll-card {
		position: relative;
		display: flex;
		flex-direction: column;
		background: #fff;
		color: var(--limelight-plum, #460032);
	}

	.ll-card-media {
		position: relative;
		display: block;
	}

	.ll-card-wish {
		position: absolute;
		top: 12px;
		right: 12px;
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		background: rgb(255 255 255 / 0.85);
		border: none;
		border-radius: 0;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.ll-card-wish:hover {
		background: #fff;
	}

	.ll-card-wish :global(.ll-card-wish-icon) {
		width: 17px;
		height: 17px;
		stroke-width: 1.4;
		color: var(--limelight-plum, #460032);
	}

	.ll-card-wish.is-active :global(.ll-card-wish-icon) {
		fill: var(--limelight-plum, #460032);
	}

	.ll-card-body {
		display: block;
		padding-top: 15px;
		text-align: center;
		text-decoration: none;
	}

	.ll-card-title {
		margin: 0;
		color: var(--limelight-plum, #460032);
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 400;
		line-height: 1.3;
		letter-spacing: 0.01em;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (max-width: 900px) {
		.ll-card-title {
			font-size: 12px;
		}
	}

	.ll-card-rating {
		margin-top: 8px;
		display: flex;
		justify-content: center;
	}

	.ll-card-price {
		margin-top: 8px;
	}

	.ll-card-actions {
		margin-top: 14px;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.25s ease,
			transform 0.25s ease;
	}

	.ll-card:hover .ll-card-actions,
	.ll-card:focus-within .ll-card-actions {
		opacity: 1;
		transform: translateY(0);
	}

	/* Touch devices can't hover — keep the action visible. */
	@media (hover: none) {
		.ll-card-actions {
			opacity: 1;
			transform: none;
		}
	}
</style>
