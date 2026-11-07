<script lang="ts">
	import { ArrowRight } from '@lucide/svelte'
	import SectionHead from '../SectionHead.svelte'
	import { bentoSizes, bentoTiles, text, type ComposerSection } from '../helpers.js'

	/** Up to six tiles of different sizes fitted together; each tile with a link is one target. */
	let { section }: { section: ComposerSection } = $props()

	const heading = $derived(text(section.settings, 'heading'))
	const tiles = $derived(bentoTiles(section.settings?.items))
	const sizes = $derived(bentoSizes(tiles.length, text(section.settings, 'layout')))
</script>

{#if tiles.length}
	<section class="cmp-band">
		<div class="page-width">
			<SectionHead settings={section.settings} />
			<ul class="cmp-bento">
				{#each tiles as tile, i (i)}
					{@const size = sizes[i]}
					<li
						class="cmp-bento__tile cmp-bento__tile--{tile.tone} cmp-bento__tile--w{size.w} cmp-bento__tile--h{size.h}"
						class:cmp-bento__tile--wide-phone={size.widePhone}
						class:cmp-bento__tile--large={size.w >= 2 && size.h === 2}
						class:cmp-bento__tile--picture={!!tile.image}
						class:cmp-bento__tile--link={!!tile.link}
					>
						{#if tile.image}
							<img class="cmp-bento__img" src={tile.image} alt={tile.alt} width="800" height="800" loading="lazy" decoding="async" />
						{/if}
						<div class="cmp-bento__words">
							{#if tile.heading}
								<!-- An h3 only under a section heading; without one it would skip a level. -->
								<svelte:element this={heading ? 'h3' : 'p'} class="cmp-bento__title">
									{#if tile.link}<a class="cmp-bento__link" href={tile.link}>{tile.heading}</a>{:else}{tile.heading}{/if}
								</svelte:element>
							{/if}
							{#if tile.text}<p class="cmp-bento__text">{tile.text}</p>{/if}
							{#if tile.link && tile.linkText}
								{#if tile.heading}
									<!-- The heading is the link; this only says where it goes. -->
									<span class="cmp-bento__go">{tile.linkText}<ArrowRight aria-hidden="true" /></span>
								{:else}
									<a class="cmp-bento__link cmp-bento__go" href={tile.link}>{tile.linkText}<ArrowRight aria-hidden="true" /></a>
								{/if}
							{:else if tile.link && !tile.heading}
								<a class="cmp-bento__link" href={tile.link} aria-label={tile.alt || 'Open'}></a>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	.cmp-bento {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-auto-rows: minmax(168px, auto);
		gap: var(--grid-gap-x, 12px);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cmp-bento__tile {
		position: relative;
		isolation: isolate;
		display: flex;
		align-items: flex-end;
		min-width: 0;
		overflow: hidden;
		border-radius: calc(var(--radius, 0.5rem) * 1.5);
	}

	.cmp-bento__tile--wide-phone {
		grid-column: span 2;
		min-height: 220px;
	}

	.cmp-bento__tile--quiet {
		background: hsl(var(--muted));
		color: hsl(var(--foreground));
	}

	.cmp-bento__tile--accent {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
	}

	.cmp-bento__tile--dark {
		background: hsl(var(--foreground));
		color: hsl(var(--background));
	}

	/* A picture sets its own colours whatever the tile's tone: white words over a dark foot. */
	.cmp-bento__tile--picture {
		background: hsl(var(--muted));
		color: hsl(var(--on-photo, 0 0% 100%));
	}

	.cmp-bento__tile--picture::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(
			to top,
			hsl(var(--photo-shade, 0 0% 0%) / 0.72) 0%,
			hsl(var(--photo-shade, 0 0% 0%) / 0.28) 42%,
			hsl(var(--photo-shade, 0 0% 0%) / 0) 72%
		);
	}

	.cmp-bento__img {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--motion-emphasis, 300ms) var(--motion-ease, ease-out);
	}

	@media (hover: hover) and (pointer: fine) {
		.cmp-bento__tile--link:hover .cmp-bento__img {
			transform: scale(1.04);
		}
		.cmp-bento__tile--link:hover .cmp-bento__go :global(svg) {
			transform: translateX(4px);
		}
	}

	.cmp-bento__words {
		display: grid;
		gap: 4px;
		min-width: 0;
		padding: clamp(16px, 1.8vw, 24px);
	}

	.cmp-bento__title {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: var(--type-heading, 1.125rem);
		font-weight: var(--weight-heading, 700);
		line-height: var(--leading-heading, 1.3);
		overflow-wrap: break-word;
		min-width: 0;
	}

	.cmp-bento__tile--large .cmp-bento__title {
		font-size: var(--type-section-title, clamp(1.5rem, 3vw, 2.125rem));
		line-height: var(--leading-title, 1.15);
		letter-spacing: var(--tracking-title, -0.01em);
	}

	.cmp-bento__text {
		margin: 0;
		font-size: var(--type-ui, 0.875rem);
		line-height: var(--leading-ui, 1.4);
		overflow-wrap: break-word;
	}

	.cmp-bento__tile--large .cmp-bento__text {
		max-width: 30rem;
		font-size: var(--type-body, 1rem);
		line-height: var(--leading-body, 1.5);
	}

	.cmp-bento__go {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding-top: 8px;
		font-size: var(--type-ui, 0.875rem);
		font-weight: 600;
	}

	.cmp-bento__go :global(svg) {
		flex: none;
		width: 16px;
		height: 16px;
		transition: transform var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	/* The link's box covers the tile, so the whole tile is one target. */
	.cmp-bento__link::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}

	.cmp-bento__link:focus-visible {
		outline: none;
	}

	.cmp-bento__link:focus-visible::after {
		outline: 3px solid currentColor;
		outline-offset: -6px;
		border-radius: calc(var(--radius, 0.5rem) * 1.2);
	}

	@media (min-width: 768px) {
		.cmp-bento {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			grid-auto-rows: minmax(clamp(168px, 19vw, 264px), auto);
			grid-auto-flow: dense;
		}
		.cmp-bento__tile--wide-phone {
			min-height: 0;
		}
		.cmp-bento__tile--w1 {
			grid-column: span 1;
		}
		.cmp-bento__tile--w2 {
			grid-column: span 2;
		}
		.cmp-bento__tile--w3 {
			grid-column: span 3;
		}
		.cmp-bento__tile--w4 {
			grid-column: span 4;
		}
		.cmp-bento__tile--h2 {
			grid-row: span 2;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-bento__img,
		.cmp-bento__go :global(svg) {
			transition: none;
		}
		.cmp-bento__tile--link:hover .cmp-bento__img,
		.cmp-bento__tile--link:hover .cmp-bento__go :global(svg) {
			transform: none;
		}
	}
</style>
