<script lang="ts">
	import SectionHeading from './section-heading.svelte'
	import { resolveTiles } from './utils.js'
	import type { SectionContext } from './types.js'

	/**
	 * A grid of picture tiles — category bands, seasonal edits, campaign pairs, lookbook
	 * galleries. All of those were separate hand-written blocks in every theme; the differences
	 * were the tile source, the column count and where the caption sits, so they are options.
	 *
	 * caption: 'overlay' (label over the image) | 'below' (figcaption) | 'none'
	 */
	let { ctx, options = {} }: { ctx: SectionContext; options?: Record<string, any> } = $props()

	const tiles = $derived(resolveTiles(ctx, options))
	const caption = $derived(options.caption ?? 'overlay')
	const hasHeading = $derived(!!(options.heading && Object.keys(options.heading).length))
</script>

{#if tiles.length}
	<section class="ts-tile-grid {options.class ?? ''}">
		{#if hasHeading}
			<SectionHeading {ctx} options={options.heading} />
		{/if}

		<!-- Without a heading or an explicit grid class the section itself is the grid, which is
		     how most themes style these bands. -->
		{#if hasHeading || options.gridClass}
			<div class="ts-tiles {options.gridClass ?? ''}">
				{#each tiles as tile, index (tile.href ?? index)}
					{@render tileMarkup(tile)}
				{/each}
			</div>
		{:else}
			{#each tiles as tile, index (tile.href ?? index)}
				{@render tileMarkup(tile)}
			{/each}
		{/if}
	</section>
{/if}

{#snippet tileMarkup(tile: { image: string; imageAlt?: string; title?: string; href?: string })}
	{#if tile.href}
		<a class="ts-tile {options.tileClass ?? ''}" href={tile.href}>
			<img src={tile.image} alt={tile.imageAlt || tile.title || ''} />
			{#if caption === 'overlay' && tile.title}
				<span>{tile.title}</span>
			{/if}
			{#if caption === 'below' && tile.title}
				<!-- <span>, not <figcaption>: there is no <figure> ancestor in the linked branch, and a
				     parentless figcaption maps to nothing. The un-linked branch below keeps its figure. -->
				<span>{tile.title}</span>
			{/if}
		</a>
	{:else}
		<figure class="ts-tile {options.tileClass ?? ''}">
			<img src={tile.image} alt={tile.imageAlt || tile.title || ''} />
			{#if caption !== 'none' && tile.title}
				<figcaption>{tile.title}</figcaption>
			{/if}
		</figure>
	{/if}
{/snippet}
