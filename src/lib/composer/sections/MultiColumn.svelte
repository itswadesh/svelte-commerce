<script lang="ts">
	import { ArrowRight } from '@lucide/svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import SectionHead from '../SectionHead.svelte'
	import { columnItems, columnLook, columnsClass, text, type ColumnLook, type ComposerSection } from '../helpers.js'

	const GAP: Record<ColumnLook, string> = {
		columns: 'gap-6 md:gap-8',
		tiles: 'gap-3 md:gap-4',
		captioned: 'gap-x-[var(--grid-gap-x,12px)] gap-y-[var(--grid-gap-y,16px)]'
	}

	/**
	 * Up to six columns, each a picture, a heading, text and a link; stacked on a phone. Columns
	 * with no paragraphs are tiles (D140): chunky rounded cards, two across on a phone, each card
	 * one link named by its heading.
	 */
	let { section }: { section: ComposerSection } = $props()

	const heading = $derived(text(section.settings, 'heading'))
	const columns = $derived(columnItems(section.settings?.items))
	const look = $derived(columnLook(section.settings, columns))
	const tiles = $derived(look === 'tiles')
	const grid = $derived(columnsClass(columns.length, look))
</script>

{#if columns.length}
	<section class="cmp-band">
		<div class="page-width">
			<SectionHead settings={section.settings} />
			<ul class="cmp-mc grid {GAP[look]} {grid}" class:cmp-mc--tiles={tiles} class:cmp-mc--captioned={look === 'captioned'}>
				{#each columns as column, i (i)}
					<li class="cmp-mc__col">
						{#if column.image || look === 'captioned'}
							<div class="cmp-mc__media">
								{#if column.image}
									<img src={column.image} alt="" width="800" height="600" loading="lazy" decoding="async" />
								{/if}
							</div>
						{/if}
						{#if look === 'captioned'}
							{@const name = column.heading || column.linkText}
							{#if name}
								<svelte:element this={heading ? 'h3' : 'p'} class="cmp-mc__title">
									{#if column.link}
										<a class="cmp-mc__tile-link" href={column.link}>{name}</a>
									{:else}
										{name}
									{/if}
								</svelte:element>
							{/if}
							<Paragraphs value={column.text} class="cmp-copy" />
						{:else if tiles && column.link}
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
		font-size: var(--type-heading, 1.125rem);
		font-weight: 600;
		line-height: var(--leading-heading, 1.3);
		overflow-wrap: anywhere;
	}

	/* Headings are 700 on the default theme (UX_SYSTEM type scale). */
	:global([data-theme='default']) .cmp-mc__title {
		font-weight: var(--weight-heading);
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
		font-size: var(--type-heading, clamp(0.9375rem, 2.2vw, 1.25rem));
		font-weight: var(--weight-heading, 700);
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
		outline: 3px solid hsl(var(--primary-ink));
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

	.cmp-mc--captioned .cmp-mc__col {
		position: relative;
		gap: 12px;
		transition: opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-mc--captioned .cmp-mc__media {
		aspect-ratio: 1 / 1;
	}

	.cmp-mc--captioned .cmp-mc__media img {
		transition:
			transform var(--motion-emphasis, 300ms) var(--motion-ease, ease-out),
			opacity var(--motion-emphasis, 300ms) var(--motion-ease, ease-out);
	}

	.cmp-mc--captioned .cmp-mc__title {
		margin: 0;
		font-family: inherit;
		font-size: var(--type-ui, 0.875rem);
		font-weight: 500;
		line-height: 1.43;
	}

	.cmp-mc--captioned .cmp-mc__tile-link::after {
		border-radius: var(--radius, 0.5rem);
	}

	.cmp-mc--captioned .cmp-mc__tile-link:focus-visible {
		box-shadow: none;
	}

	.cmp-mc--captioned .cmp-mc__col:has(.cmp-mc__tile-link):hover .cmp-mc__media img {
		transform: scale(1.04);
	}

	.cmp-mc--captioned .cmp-mc__col:hover .cmp-mc__tile-link {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.cmp-mc--captioned .cmp-mc__col:has(.cmp-mc__tile-link):active {
		opacity: 0.75;
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-mc--captioned .cmp-mc__col:has(.cmp-mc__tile-link):hover .cmp-mc__media img {
			transform: none;
			opacity: 0.85;
		}
	}
</style>
