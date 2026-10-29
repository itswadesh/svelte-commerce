<script lang="ts">
	import { ArrowRight } from '@lucide/svelte'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { gridColumnsClass, intSetting, safeHref, text, type ComposerSection } from '../helpers.js'

	/**
	 * A shelf of products the engine resolved live — prices and stock never live in the layout.
	 * A grid with nothing on sale renders nothing at all: an empty heading would promise products
	 * the shopper cannot find.
	 */
	let { section, aspectRatio = '4 / 5', priority = false }: { section: ComposerSection; aspectRatio?: string; priority?: boolean } = $props()

	// Two rows of a phone grid are on screen at first. Their pictures come with the page instead of
	// waiting for the script to wake them, which kept a phone's first product picture ~7 s late.
	const PRIORITY_CARDS = 4

	const s = $derived(section.settings ?? {})
	const heading = $derived(text(s, 'heading'))
	const viewAll = $derived(safeHref(s.view_all_link))
	const products = $derived((section.products ?? []).slice(0, intSetting(s.limit, 1, 24, 24)))
	const columns = $derived(gridColumnsClass(s.columns))
</script>

{#if products.length}
	<section class="cmp-band">
		<div class="page-width">
			{#if heading || viewAll}
				<header class="cmp-head">
					{#if heading}<h2 class="cmp-head__title">{heading}</h2>{/if}
					{#if viewAll}
						<a class="cmp-head__link" href={viewAll}>
							View all{#if heading}<span class="sr-only">: {heading}</span>{/if}
							<ArrowRight class="cmp-head__icon" aria-hidden="true" />
						</a>
					{/if}
				</header>
			{/if}
			<div class="product-grid grid gap-3 sm:gap-5 {columns}">
				{#each products as product, i (product.id || product.slug)}
					<ProductCard {product} {aspectRatio} priority={priority && i < PRIORITY_CARDS} />
				{/each}
			</div>
		</div>
	</section>
{/if}
