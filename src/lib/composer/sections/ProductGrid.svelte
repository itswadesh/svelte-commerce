<script lang="ts">
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import SectionHead from '../SectionHead.svelte'
	import { gridColumnsClass, intSetting, text, type ComposerSection } from '../helpers.js'

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
	const products = $derived((section.products ?? []).slice(0, intSetting(s.limit, 1, 24, 24)))
	const columns = $derived(gridColumnsClass(s.columns) + (text(s, 'mobile_layout') === 'row' ? ' cmp-grid--row' : ''))
</script>

{#if products.length}
	<section class="cmp-band">
		<div class="page-width">
			<SectionHead settings={s} />
			<div class="product-grid grid gap-3 sm:gap-5 {columns}">
				{#each products as product, i (product.id || product.slug)}
					<ProductCard {product} {aspectRatio} priority={priority && i < PRIORITY_CARDS} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	/* Global, not scoped: a scoped rule stamps Svelte's class on every product grid's element,
	   changing the markup of grids without the row. overflow-x: auto clips the block axis too;
	   the 4px block padding keeps a card's focus ring unclipped. */
	@media (max-width: 767.98px) {
		:global(.product-grid.cmp-grid--row) {
			grid-template-columns: none;
			grid-auto-flow: column;
			grid-auto-columns: min(165px, 42vw);
			overflow-x: auto;
			overscroll-behavior-x: contain;
			scroll-snap-type: x mandatory;
			scroll-padding-inline: var(--container-gutter, 16px);
			margin: -4px calc(-1 * var(--container-gutter, 16px));
			padding: 4px var(--container-gutter, 16px);
			scrollbar-width: none;
		}
		:global(.cmp-grid--row::-webkit-scrollbar) {
			display: none;
		}
		:global(.cmp-grid--row > *) {
			scroll-snap-align: start;
		}
	}

	@media (max-width: 767.98px) and (prefers-reduced-motion: no-preference) {
		:global(.cmp-grid--row) {
			scroll-behavior: smooth;
		}
	}
</style>
