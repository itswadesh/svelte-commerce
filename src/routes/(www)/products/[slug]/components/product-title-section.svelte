<script lang="ts">
	import { Star, StarHalf, HeartIcon, LoaderCircle } from '@lucide/svelte'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button/index.js'
	import { useProductState } from '$lib/core/composables/index.js'

	const { product } = $props()
	const productState = useProductState()

	// Star rating comes from the actual ratings array (the same source the reviews
	// section renders) rather than a pre-baked product.rating scalar, so the stars
	// always match the visible reviews.
	const reviewCount = $derived(product?.ratings?.length ?? 0)
	const avgRating = $derived.by(() => {
		if (!product?.ratings?.length) return 0
		const total = product.ratings.reduce((acc: number, cur: any) => acc + (cur?.rating || 0), 0)
		return Math.floor((total / product.ratings.length) * 10) / 10
	})
	const reviewsEnabled = $derived(!!page?.data?.store?.plugins?.isProductReviewsAndRatings?.active)

	// The selected variant, as a line under the heading. "default" is the connector's placeholder
	// for a product with no real options, and a single-variant product has nothing to disambiguate,
	// so neither gets a line.
	const variantLabel = $derived.by(() => {
		if ((product?.variants?.length ?? 0) < 2) return ''
		const title = productState.selectedVariant?.title
		if (!title || title === 'default' || title === product?.title) return ''
		return title
	})
</script>

<div class="edp-titlewrap relative">
	{#if product?.categories}
		<p class="edp-cat text-sm font-semibold leading-[1] max-sm:hidden">{product?.categories?.[product?.categories.length - 1]?.category?.name}</p>
	{/if}

	<div class="flex items-center justify-between gap-4">
		<!-- The product's own name, never the variant's. `productState.title` returns the selected
		     variant's title whenever it is not "default", so this heading read "S / Black" on the
		     tee and "25" on the gift card. The server sent the right name and hydration replaced it
		     about 2.5s later, so the visible page contradicted the indexed one and a screen reader
		     announced a variant string as the page heading. The selection is shown below instead. -->
		<h1 class="edp-title text-md flex-1 font-medium leading-[1] tracking-tight text-foreground sm:text-xl" data-testid="product-title">
			{product.title}
		</h1>

		{#if productState.wishlistPluginEnabled}
			<Button variant="plain" class="h-9 w-9 p-0 sm:hidden" onclick={productState.handleWishlistClick} aria-label="Add to wishlist">
				{#if productState.wishlistLoading}
					<LoaderCircle class="h-6 w-6 animate-spin text-primary" />
				{:else}
					<HeartIcon
						class="h-6 w-6 {productState.wishlisted
							? 'scale-110 fill-destructive text-destructive'
							: 'text-foreground'} transition-transform duration-fast"
					/>
				{/if}
			</Button>
		{/if}
	</div>

	<!-- Which variant the rest of the buy box is describing. It moved out of the heading, so it has
	     to be stated somewhere: the price, SKU and availability below all belong to this one. Only
	     rendered when the product actually has variants worth distinguishing. -->
	{#if variantLabel}
		<p class="edp-variant mt-1 text-sm text-muted-foreground" aria-live="polite" data-testid="selected-variant">
			{variantLabel}
		</p>
	{/if}

	{#if product.subtitle}
		<div class="edp-subtitle mt-3 line-clamp-3 text-xs font-medium sm:text-sm">
			{@html productState.selectedVariant?.subtitle || product.subtitle}
		</div>
	{/if}

	{#if reviewCount > 0}
		<div class="intra-pt edp-reviewrow flex items-center gap-4">
			<div class="flex items-center gap-2">
				<div class="relative flex items-center">
					<div class="flex gap-0.5">
						{#each { length: 5 } as _}
							<Star class="h-4 w-4 fill-muted text-muted" />
						{/each}
					</div>
					<div class="absolute left-0 top-0 flex gap-0.5 overflow-hidden">
						{#each { length: 5 } as _, i}
							<Star class="h-4 w-4 {i < Math.floor(avgRating) ? 'fill-primary text-primary' : 'hidden'}" />
						{/each}
						{#if avgRating % 1 > 0}
							<StarHalf class="h-4 w-4 fill-primary text-primary" />
						{/if}
					</div>
				</div>
				<span class="text-xs font-bold text-foreground">{avgRating}</span>
				<span class="h-1 w-1 rounded-full bg-border-strong"></span>
				<span class="text-xs text-muted-foreground">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
				<Button variant="link" class="h-auto p-0 text-xs font-medium">View Reviews</Button>
			</div>
		</div>
	{:else if reviewsEnabled}
		<div class="intra-pt edp-reviewrow">
			<span class="edp-review-empty text-sm text-muted-foreground">Be the first to review</span>
		</div>
	{/if}
</div>

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-cat) {
		margin-bottom: 12px;
		font-family: var(--ed-body);
		font-size: 0.72rem;
		font-weight: 600;
		font-style: normal;
		letter-spacing: 0.18em;
		line-height: 1.2;
		text-transform: uppercase;
		color: var(--ed-soft);
	}

	:global([data-theme='default'] .edp-title) {
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: -0.01em;
		font-size: clamp(1.55rem, 2.6vw, 2.3rem);
		line-height: 1.12;
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-subtitle) {
		margin-top: 14px;
		color: var(--ed-soft);
		font-size: 0.92rem;
		line-height: 1.6;
	}

	:global([data-theme='default'] .edp-reviewrow) {
		margin-top: 16px;
	}

	:global([data-theme='default'] .edp-reviewrow .text-foreground) {
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-reviewrow .text-muted-foreground),
	:global([data-theme='default'] .edp-review-empty) {
		color: var(--ed-soft);
	}

	:global([data-theme='default'] .edp-reviewrow .bg-border-strong) {
		background: var(--ed-line-strong);
	}
</style>
