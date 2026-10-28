<script lang="ts">
	import ComposerButton from '../ComposerButton.svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import { safeHref, text, type ComposerSection } from '../helpers.js'

	/**
	 * The page's opening statement. Its heading is the page's h1 when it is the first hero
	 * (`isPageHeading`); any later hero is an h2, so the page keeps one h1.
	 */
	let { section, isPageHeading = false, priority = false }: { section: ComposerSection; isPageHeading?: boolean; priority?: boolean } = $props()

	const s = $derived(section.settings ?? {})
	const heading = $derived(text(s, 'heading'))
	const eyebrow = $derived(text(s, 'eyebrow'))
	const mobileImage = $derived(safeHref(s.mobile_image))
	// A phone-only picture still shows everywhere rather than leaving the hero bare on a computer.
	const image = $derived(safeHref(s.image) || mobileImage)
	const centered = $derived(text(s, 'align') === 'center')
	// What the picture shows, as the shop wrote it; the heading names it otherwise.
	const alt = $derived(text(s, 'image_alt') || heading)
</script>

{#if heading}
	<!-- Bold and bright (D140): the words on a block of the accent colour, the picture beside them
	     from the tablet up and under them on a phone, so a phone opens on the headline. -->
	<section class="cmp-hero" class:cmp-hero--media={!!image} class:cmp-hero--center={centered}>
		<div class="page-width cmp-hero__grid">
			<div class="cmp-hero__body">
				{#if eyebrow}<span class="cmp-hero__eyebrow">{eyebrow}</span>{/if}
				<svelte:element this={isPageHeading ? 'h1' : 'h2'} class="cmp-hero__title">{heading}</svelte:element>
				<Paragraphs value={s.body} class="cmp-hero__text" />
				<div class="cmp-hero__actions">
					<ComposerButton href={s.button_link} label={text(s, 'button_text')} variant="inverse" />
				</div>
			</div>
			{#if image}
				<div class="cmp-hero__media">
					<picture>
						{#if mobileImage && mobileImage !== image}
							<source media="(max-width: 767px)" srcset={mobileImage} />
						{/if}
						<img
							src={image}
							{alt}
							width="1200"
							height="900"
							loading={priority ? 'eager' : 'lazy'}
							fetchpriority={priority ? 'high' : 'auto'}
							decoding="async"
						/>
					</picture>
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	.cmp-hero__grid {
		display: grid;
		gap: 12px;
	}

	/* The colour block. Its words take the accent's own text colour, the pair the theme editor
	   checks for contrast, so a shop's colours restyle it without losing legibility. */
	.cmp-hero__body {
		display: grid;
		gap: 16px;
		align-content: center;
		min-width: 0;
		padding: clamp(28px, 6vw, 72px) clamp(22px, 5vw, 64px);
		border-radius: calc(var(--radius, 0.5rem) * 1.5);
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
	}

	.cmp-hero--center .cmp-hero__body {
		justify-items: center;
		text-align: center;
	}

	.cmp-hero__eyebrow {
		justify-self: start;
		padding: 6px 12px;
		border-radius: 999px;
		background: hsl(var(--primary-foreground));
		color: hsl(var(--primary));
		font-size: 0.8125rem;
		font-weight: 700;
		overflow-wrap: anywhere;
	}

	.cmp-hero--center .cmp-hero__eyebrow {
		justify-self: center;
	}

	.cmp-hero__title {
		margin: 0;
		max-width: 16ch;
		font-family: var(--font-heading, inherit);
		font-size: clamp(2.125rem, 6.4vw, 4.25rem);
		font-weight: 800;
		line-height: 1.02;
		letter-spacing: -0.025em;
		overflow-wrap: anywhere;
	}

	.cmp-hero__body :global(.cmp-hero__text) {
		max-width: 34rem;
		font-size: clamp(1rem, 1.6vw, 1.125rem);
		line-height: 1.6;
	}

	.cmp-hero__actions:empty {
		display: none;
	}

	.cmp-hero__actions {
		padding-top: 4px;
	}

	/* The box is fixed by aspect-ratio before the file arrives: no layout shift. */
	.cmp-hero__media {
		overflow: hidden;
		border-radius: calc(var(--radius, 0.5rem) * 1.5);
		aspect-ratio: 4 / 3;
		background: hsl(var(--muted));
	}

	.cmp-hero__media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (min-width: 768px) {
		.cmp-hero--media .cmp-hero__grid {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
			align-items: stretch;
			gap: 16px;
		}
		/* As tall as the block beside it: the picture fills the row rather than setting it. */
		.cmp-hero__media {
			position: relative;
			aspect-ratio: auto;
			min-height: 320px;
		}
		.cmp-hero__media img {
			position: absolute;
			inset: 0;
		}
	}
</style>
