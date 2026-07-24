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
</script>

<div class="relative edp-titlewrap">

		{#if product?.categories}
		<p class="max-sm:hidden text-sm font-semibold leading-[1] edp-cat">{product?.categories?.[product?.categories.length-1]?.category?.name}</p>
		{/if}


	<div class="flex items-center justify-between gap-4">
		<h1 class="text-md flex-1 font-medium tracking-tight text-gray-900 dark:text-white sm:text-xl leading-[1] edp-title">
			{productState.title || product.title}
		</h1>

		{#if productState.wishlistPluginEnabled}
			<Button
				variant="plain"
				class="h-9 w-9 p-0 sm:hidden"
				onclick={productState.handleWishlistClick}
				aria-label="Add to wishlist"
			>
				{#if productState.wishlistLoading}
					<LoaderCircle class="h-6 w-6 animate-spin text-primary" />
				{:else}
					<HeartIcon
						class="h-6 w-6 {productState.wishlisted
							? 'scale-110 fill-red-500 text-red-500'
							: 'text-gray-900'} transition-transform duration-300"
					/>
				{/if}
			</Button>
		{/if}
	</div>

	{#if product.subtitle}
		<div class="mt-3 line-clamp-3 text-xs font-medium sm:text-sm edp-subtitle">
			{@html productState.selectedVariant?.subtitle || product.subtitle}
		</div>
	{/if}

		{#if reviewCount > 0}
	<div class="intra-pt flex items-center gap-4 edp-reviewrow">
			<div class="flex items-center gap-2">
				<div class="relative flex items-center">
					<div class="flex gap-0.5">
						{#each { length: 5 } as _}
							<Star class="h-4 w-4 fill-gray-100 text-gray-100" />
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
				<span class="text-xs font-bold text-gray-900 dark:text-gray-100">{avgRating}</span>
				<span class="h-1 w-1 rounded-full bg-gray-300"></span>
				<span class="text-xs text-gray-500">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
				<Button variant="link" class="h-auto p-0 text-xs font-medium">View Reviews</Button>
			</div>
	</div>
		{:else if reviewsEnabled}
	<div class="intra-pt edp-reviewrow">
		<span class="text-sm text-gray-400 edp-review-empty">Be the first to review</span>
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

	:global([data-theme='default'] .edp-reviewrow .text-gray-900) {
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-reviewrow .text-gray-500),
	:global([data-theme='default'] .edp-review-empty) {
		color: var(--ed-soft);
	}

	:global([data-theme='default'] .edp-reviewrow .bg-gray-300) {
		background: var(--ed-line-strong);
	}
</style>
