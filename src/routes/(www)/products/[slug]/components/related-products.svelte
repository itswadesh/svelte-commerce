<script lang="ts">
	import { page } from '$app/state'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { toCssRatio } from '$lib/theme/aspect-ratio.js'
	import { productService } from '$lib/core/services'

	// The shop's own heading from its product page template (GoCommerce D128); empty keeps this one.
	let { heading = '' }: { heading?: string } = $props()

	const productState = useProductState()

	// Same ratio the cards below resolve to, so the skeleton reserves the height the products will
	// actually occupy. This grid used to force `aspectRatio="square"` on the card while the
	// homepage grid honoured the store's 2:3 setting — one catalogue, two card shapes.
	const mediaRatio = $derived(toCssRatio(page?.data?.store?.productImageAspectRatio, '1:1'))

	// Same-category matches alone left a shop that never filled in categories with no related
	// products on any product page. The connector answers the category first, then the
	// product's collections, then the newest products. null while that is on its way.
	let related = $state<any[] | null>(null)
	const productId = $derived(page.data?.product?.id)
	const productSlug = $derived(page.data?.product?.slug as string | undefined)
	$effect(() => {
		const slug = productSlug
		if (!slug) return
		let live = true
		related = null
		productService
			.listRelatedProducts({ product: slug, limit: 12 } as any)
			.then((res: any) => {
				if (live) related = res?.data ?? []
			})
			.catch((error: unknown) => {
				console.error('Error loading related products:', error)
				if (live) related = []
			})
		return () => {
			live = false
		}
	})
	const loading = $derived(related === null)
	// The category list still stands in when the connector answers nothing at all.
	const products = $derived(
		(related?.length ? related : productState.productsOfSameCategory).filter((x: any) => x.id !== productId)
	)
</script>

{#if loading || products.length > 0}
	<div class="edp-related mb-12" data-testid="related-products">
		<header class="edp-related-head">
			<span class="edp-related-eyebrow">More to explore</span>
			<h2 class="edp-related-title text-center text-lg font-semibold sm:text-xl">{heading || 'Related products'}</h2>
		</header>

		{#if loading}
			<!-- Skeleton cards in the real grid, not a centred spinner: the rail keeps its height,
			     so nothing below it jumps when the products arrive. The spinner this replaces was
			     also invisible — `border-primary` is not a class this project defines, so it
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
				{#each products as { id, slug, thumbnail, price, mrp, title, vendor, variants }}
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
	/* The page's section gap on both sides of the rule, as between the home page's sections. Was
	   margin-top clamp(48px, 8vw, 96px) + padding-top clamp(32px, 5vw, 56px) — up to 152px of empty
	   page between the buy box and this heading. */
	:global([data-theme='default'] .edp-related) {
		margin-top: var(--space-section);
		margin-bottom: 0;
		padding-top: var(--space-section);
		border-top: 1px solid var(--ed-line);
	}

	/* On the rail's left edge, like the reviews heading above it and every shelf heading on the
	   home page; centred, it was the one heading on the page that did not start where the text does. */
	:global([data-theme='default'] .edp-related-head) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: var(--space-head);
	}

	:global([data-theme='default'] .edp-related-eyebrow) {
		font-family: var(--ed-body);
		/* 12px floor for supporting text; 11.2px all-caps at 0.2em tracking sits under it. */
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--ed-soft);
	}

	/* The section-title step, the same as the home page's "New in": "Related products" is the same
	   thing — a heading introducing a grid of product cards — so it gets the same size and weight.
	   Was clamp(1.8rem, 3.4vw, 2.8rem), then 22-28px at weight 500 beside the home page's 700. */
	:global([data-theme='default'] .edp-related-title) {
		margin: 4px 0 0;
		text-align: start;
		font-family: var(--ed-display);
		font-weight: var(--weight-heading);
		letter-spacing: var(--tracking-title);
		font-size: var(--type-section-title);
		line-height: var(--leading-title);
		color: var(--ed-ink);
	}

	/* The shared product-grid gap — see .product-grid in app.css. */
	:global([data-theme='default'] .edp-related-grid) {
		column-gap: var(--grid-gap-x);
		row-gap: var(--grid-gap-y);
	}
</style>
