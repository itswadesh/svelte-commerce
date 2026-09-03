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

	// Guarded on the resolved name, not on the array. `categories` is populated on this backend but
	// the leaf carries no `category.name`, so the eyebrow rendered as an empty paragraph that still
	// spent its 12px bottom margin — dead space at the very top of the buy box.
	const categoryName = $derived(product?.categories?.[product.categories.length - 1]?.category?.name || '')

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
	{#if categoryName}
		<p class="edp-cat text-xs font-semibold leading-tight max-sm:hidden">{categoryName}</p>
	{/if}

	<div class="flex items-center justify-between gap-4">
		<!-- The product's own name, never the variant's. `productState.title` returns the selected
		     variant's title whenever it is not "default", so this heading read "S / Black" on the
		     tee and "25" on the gift card. The server sent the right name and hydration replaced it
		     about 2.5s later, so the visible page contradicted the indexed one and a screen reader
		     announced a variant string as the page heading. The selection is shown below instead. -->
		<h1 class="edp-title flex-1 text-xl font-medium leading-tight tracking-tight text-foreground sm:text-2xl" data-testid="product-title">
			{product.title}
		</h1>

		{#if productState.wishlistPluginEnabled}
			<Button variant="plain" class="size-11 shrink-0 p-0 sm:hidden" onclick={productState.handleWishlistClick} aria-label="Add to wishlist">
				{#if productState.wishlistLoading}
					<LoaderCircle class="h-5 w-5 animate-spin text-primary" />
				{:else}
					<HeartIcon
						class="h-5 w-5 {productState.wishlisted
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
		<div class="edp-subtitle mt-2 line-clamp-3 text-sm font-normal">
			{@html productState.selectedVariant?.subtitle || product.subtitle}
		</div>
	{/if}

	{#if reviewCount > 0}
		<div class="edp-reviewrow mt-3 flex items-center gap-4">
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
		<div class="edp-reviewrow mt-3">
			<span class="edp-review-empty text-sm text-muted-foreground">Be the first to review</span>
		</div>
	{/if}
</div>

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-cat) {
		margin-bottom: 8px;
		font-family: var(--ed-body);
		/* 12px, not 11.2px: this is all-caps with 0.18em tracking, and the project floor for
		   supporting text is 12px. Shrinking it below the floor to look elegant is the thing the
		   10px spec labels were fixed for. */
		font-size: 0.75rem;
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
		/* Was clamp(1.55rem, 2.6vw, 2.3rem) — 24.8px on a phone and 36.8px at 1440, where a
		   37px serif name in a half-width column dwarfed the price and every control under it.
		   The floor is 1.5rem rather than 1.4rem: at 22.4px this h1 was only 2.4px larger than the
		   20px price beside it, and 5.6px SMALLER than the listing page's own "All Products" title
		   one tap earlier — a product name that shrinks when you open the product. 24px restores
		   both gaps. The ceiling stays one deliberate step under the 28-36px page-title ramp on the
		   homepage and listing, because this heading sits in a ~550px column, not the full rail. */
		font-size: clamp(1.5rem, 2vw, 1.875rem);
		line-height: 1.15;
		color: var(--ed-ink);
	}

	/* No margin here: the `mt-2` / `mt-3` utilities at the call sites own these two gaps, and a
	   scoped margin on top of them was the second competing scope. */
	:global([data-theme='default'] .edp-subtitle) {
		color: var(--ed-soft);
		font-size: 0.875rem;
		line-height: 1.55;
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
