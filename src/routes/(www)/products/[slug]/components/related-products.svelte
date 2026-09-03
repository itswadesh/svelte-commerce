<script lang="ts">
	import { page } from '$app/state'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { toCssRatio } from '$lib/theme/aspect-ratio.js'

	const productState = useProductState()

	// Same ratio the cards below resolve to, so the skeleton reserves the height the products will
	// actually occupy. This grid used to force `aspectRatio="square"` on the card while the
	// homepage grid honoured the store's 2:3 setting — one catalogue, two card shapes.
	const mediaRatio = $derived(toCssRatio(page?.data?.store?.productImageAspectRatio, '1:1'))
</script>

{#if productState.isLoadingRelatedProducts || productState.productsOfSameCategory.length > 0}
	<div class="edp-related mb-12" data-testid="related-products">
		<header class="edp-related-head">
			<span class="edp-related-eyebrow">More to explore</span>
			<h2 class="edp-related-title text-center text-lg font-semibold sm:text-xl">Related Products</h2>
		</header>

		{#if productState.isLoadingRelatedProducts}
			<!-- Skeleton cards in the real grid, not a centred spinner: the rail keeps its height,
			     so nothing below it jumps when the products arrive. The spinner this replaces was
			     also invisible — `border-primary-500` is not a class this project defines, so it
			     rendered as a transparent ring. -->
			<div class="edp-related-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" aria-hidden="true">
				{#each { length: 6 } as _}
					<div class="flex flex-col gap-2">
						<Skeleton class="w-full" style="aspect-ratio: {mediaRatio};" />
						<Skeleton class="h-4 w-3/4" />
						<Skeleton class="h-4 w-1/3" />
					</div>
				{/each}
			</div>
		{:else}
			<div class="edp-related-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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
					/>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* One gap declaration for the rail; the default theme narrows it below. */
	.edp-related-grid {
		gap: 12px;
	}

	/* Refined Editorial — default theme only. Card itself is already editorial;
	   this restyles the section heading and gutters only. */
	/* Was margin-top clamp(48px, 8vw, 96px) + padding-top clamp(32px, 5vw, 56px) — up to 152px
	   of empty page between the buy box and this heading, on top of the parent column gap. */
	:global([data-theme='default'] .edp-related) {
		margin-top: clamp(32px, 5vw, 56px);
		padding-top: clamp(20px, 3vw, 32px);
		border-top: 1px solid var(--ed-line);
	}

	:global([data-theme='default'] .edp-related-head) {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-bottom: clamp(16px, 2.5vw, 24px);
	}

	:global([data-theme='default'] .edp-related-eyebrow) {
		font-family: var(--ed-body);
		/* 12px floor for supporting text; 11.2px all-caps at 0.2em tracking sits under it. */
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ed-soft);
	}

	/* Was clamp(1.8rem, 3.4vw, 2.8rem) — a 44.8px section heading at 1440, well past the 32px
	   ceiling and larger than the product's own h1. The clamp below is the storefront's section-
	   title step, identical to .ed-head__title / .ed-banner__title / .ed-news__title on the
	   homepage: 22px on a phone, 28px on a desktop. "Related Products" and "Featured pieces" are
	   the same thing — a serif heading introducing a grid of product cards — so they get the same
	   size instead of 20/25.6 here and 22/28 there. */
	:global([data-theme='default'] .edp-related-title) {
		margin: 6px 0 0;
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: -0.01em;
		font-size: clamp(1.375rem, 2.4vw, 1.75rem);
		line-height: 1.15;
		color: var(--ed-ink);
	}

	/* The shared product-grid rhythm — see .ed-products (homepage) and .ed-grid (listing). */
	:global([data-theme='default'] .edp-related-grid) {
		gap: clamp(14px, 1.6vw, 22px);
	}
</style>
