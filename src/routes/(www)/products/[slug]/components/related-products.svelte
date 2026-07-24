<script lang="ts">
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { useProductState } from '$lib/core/composables/index.js'

	const productState = useProductState()
</script>

{#if productState.isLoadingRelatedProducts || productState.productsOfSameCategory.length > 0}
	<div class="mx-2 mb-20 mt-4 edp-related">
		<header class="edp-related-head">
			<span class="edp-related-eyebrow">More to explore</span>
			<h2 class="my-4 text-center text-2xl font-bold edp-related-title">Related Products</h2>
		</header>

		{#if productState.isLoadingRelatedProducts}
			<div class="flex justify-center py-8">
				<div class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-1 sm:gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 edp-related-grid">
				{#each productState.productsOfSameCategory as { id, slug, thumbnail, price, mrp, title, vendor, variants }}
					<ProductCard
						product={{
							id,
							slug,
							thumbnail,
							price,
							mrp,
							title,
							vendor,
							variants
						}}
						aspectRatio="square"
					/>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Refined Editorial — default theme only. Card itself is already editorial;
	   this restyles the section heading and gutters only. */
	:global([data-theme='default'] .edp-related) {
		margin-top: clamp(48px, 8vw, 96px);
		padding-top: clamp(32px, 5vw, 56px);
		border-top: 1px solid var(--ed-line);
	}

	:global([data-theme='default'] .edp-related-head) {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-bottom: clamp(24px, 4vw, 44px);
	}

	:global([data-theme='default'] .edp-related-eyebrow) {
		font-family: var(--ed-body);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ed-soft);
	}

	:global([data-theme='default'] .edp-related-title) {
		margin: 10px 0 0;
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: -0.01em;
		font-size: clamp(1.8rem, 3.4vw, 2.8rem);
		line-height: 1.06;
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-related-grid) {
		gap: clamp(16px, 2vw, 28px);
	}
</style>
