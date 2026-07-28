<script lang="ts">
	import SectionHeading from './section-heading.svelte'
	import { text } from './utils.js'
	import type { SectionContext } from './types.js'

	/**
	 * A grid of real catalogue products with the theme's own product card, plus the empty state
	 * for a store that has none yet. Never invents products to fill the grid.
	 */
	let { ctx, options = {} }: { ctx: SectionContext; options?: Record<string, any> } = $props()

	const products = $derived(ctx.featuredProducts?.slice(0, options.limit ?? 8) ?? [])
	const emptyTitle = $derived(text(ctx, options.empty?.title))
	const emptyText = $derived(text(ctx, options.empty?.text))
	const Card = $derived(ctx.ProductCard)
</script>

<!-- Some themes repeat the product grid further down the page; those instances are only
     meaningful when there is a catalogue, hence `requireProducts`. -->
{#if products.length || !options.requireProducts}
	<section class="ts-product-grid {options.class ?? ''}">
		{#if options.heading}
			<SectionHeading {ctx} options={options.heading} />
		{/if}

		{#if products.length && Card}
			<div class="ts-products {options.gridClass ?? ''}">
				{#each products as product (product.id ?? product.slug)}
					<Card
						{product}
						themeContent={ctx.content}
						aspectRatio={options.aspectRatio ?? `${ctx.aspectWidth}:${ctx.aspectHeight}`}
					/>
				{/each}
			</div>
		{:else if emptyTitle || emptyText}
			<div class="ts-empty {options.emptyClass ?? ''}">
				{#if emptyTitle}<h3>{emptyTitle}</h3>{/if}
				{#if emptyText}<p>{emptyText}</p>{/if}
			</div>
		{/if}
	</section>
{/if}
