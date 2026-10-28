<script lang="ts">
	import { ArrowRight } from '@lucide/svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import { columnItems, columnsClass, paragraphs, text, type ComposerSection } from '../helpers.js'

	/**
	 * Up to four columns, each a picture, a heading, text and a link; stacked on a phone. Columns
	 * with no paragraphs are tiles (D140): chunky rounded cards, two across on a phone, each card
	 * one link named by its heading.
	 */
	let { section }: { section: ComposerSection } = $props()

	const heading = $derived(text(section.settings, 'heading'))
	const columns = $derived(columnItems(section.settings?.items))
	// Tiles only when every column is a named link with no paragraphs: a published section of
	// pictures or text columns keeps its columns.
	const tiles = $derived(columns.every((c) => !paragraphs(c.text).length && c.link && (c.heading || c.linkText)))
	const grid = $derived(columnsClass(columns.length, tiles))
</script>

{#if columns.length}
	<section class="cmp-band">
		<div class="page-width">
			{#if heading}
				<header class="cmp-head"><h2 class="cmp-head__title">{heading}</h2></header>
			{/if}
			<ul class="cmp-mc grid {tiles ? 'gap-3 md:gap-4' : 'gap-6 md:gap-8'} {grid}" class:cmp-mc--tiles={tiles}>
				{#each columns as column, i (i)}
					<li class="cmp-mc__col">
						{#if column.image}
							<div class="cmp-mc__media">
								<img src={column.image} alt="" width="800" height="600" loading="lazy" decoding="async" />
							</div>
						{/if}
						{#if tiles && column.link}
							<!-- The heading is the link and its box covers the card, so the whole tile is one target. -->
							<svelte:element this={heading ? 'h3' : 'p'} class="cmp-mc__title">
								<a class="cmp-mc__tile-link" href={column.link}>
									{column.heading || column.linkText}
								</a>
							</svelte:element>
							<ArrowRight class="cmp-mc__arrow" aria-hidden="true" />
						{:else}
							{#if column.heading}
								<!-- An h3 only under a section heading; without one it would skip a level. -->
								<svelte:element this={heading ? 'h3' : 'p'} class="cmp-mc__title">{column.heading}</svelte:element>
							{/if}
							<Paragraphs value={column.text} class="cmp-copy" />
							{#if column.link && column.linkText}
								<a class="cmp-head__link cmp-mc__link" href={column.link}>
									{column.linkText}
									<ArrowRight class="cmp-head__icon" aria-hidden="true" />
								</a>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	.cmp-mc {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cmp-mc__col {
		display: grid;
		align-content: start;
		gap: 10px;
		min-width: 0;
	}

	.cmp-mc__media {
		overflow: hidden;
		border-radius: var(--radius, 0.5rem);
		aspect-ratio: 4 / 3;
		background: hsl(var(--muted));
	}

	.cmp-mc__media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cmp-mc__title {
		margin: 4px 0 0;
		font-family: var(--font-heading, inherit);
		font-size: 1.125rem;
		font-weight: 600;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}

	.cmp-mc__link {
		justify-self: start;
	}

	/* Tiles: a block of the quiet colour, the picture inset in it, the heading bold under it. */
	.cmp-mc--tiles .cmp-mc__col {
		position: relative;
		/* Heading over the arrow, not beside it: a phone's half-width tile keeps whole words. */
		grid-template-columns: minmax(0, 1fr);
		align-content: space-between;
		gap: 8px;
		padding: 10px 10px 14px;
		border-radius: calc(var(--radius, 0.5rem) * 1.5);
		background: hsl(var(--muted));
		transition: transform var(--motion-fast, 200ms) var(--motion-ease, ease-out);
	}

	.cmp-mc--tiles .cmp-mc__media {
		aspect-ratio: 1 / 1;
		background: hsl(var(--background));
	}

	/* A word breaks only when it cannot fit at all, never mid-word to save a line. */
	.cmp-mc--tiles .cmp-mc__title {
		margin: 0;
		padding-left: 4px;
		font-size: clamp(0.9375rem, 2.2vw, 1.25rem);
		font-weight: 700;
		overflow-wrap: break-word;
		hyphens: auto;
	}

	/* A tile with no picture yet is still a block worth pressing, not a strip. */
	.cmp-mc--tiles .cmp-mc__col:not(:has(.cmp-mc__media)) {
		min-height: clamp(72px, 9vw, 112px);
		padding-inline: 12px;
	}

	.cmp-mc__tile-link {
		color: hsl(var(--foreground));
		outline: none;
	}

	/* The ring is drawn by the box that covers the tile, so it rings the whole card. */
	.cmp-mc__tile-link:focus-visible::after {
		outline: 3px solid hsl(var(--primary));
		outline-offset: 3px;
	}

	.cmp-mc__tile-link::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}

	.cmp-mc--tiles :global(.cmp-mc__arrow) {
		width: 20px;
		height: 20px;
		justify-self: end;
		margin-right: 4px;
		color: hsl(var(--foreground));
		transition: transform var(--motion-fast, 200ms) var(--motion-ease, ease-out);
	}

	.cmp-mc--tiles .cmp-mc__col:hover {
		transform: translateY(-4px);
	}

	.cmp-mc--tiles .cmp-mc__col:hover .cmp-mc__tile-link {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.cmp-mc--tiles .cmp-mc__col:hover :global(.cmp-mc__arrow) {
		transform: translateX(4px);
	}

	.cmp-mc--tiles .cmp-mc__col:active {
		transform: scale(0.98);
	}

	/* No movement; the focus ring still answers the keyboard. */
	@media (prefers-reduced-motion: reduce) {
		.cmp-mc--tiles .cmp-mc__col:hover,
		.cmp-mc--tiles .cmp-mc__col:active,
		.cmp-mc--tiles .cmp-mc__col:hover :global(.cmp-mc__arrow) {
			transform: none;
		}
	}
</style>
