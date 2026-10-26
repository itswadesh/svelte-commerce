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
</script>

{#if heading}
	<section class="cmp-hero" class:cmp-hero--media={!!image} class:cmp-hero--center={centered}>
		<div class="page-width cmp-hero__grid">
			<div class="cmp-hero__body">
				{#if eyebrow}<span class="cmp-eyebrow">{eyebrow}</span>{/if}
				<svelte:element this={isPageHeading ? 'h1' : 'h2'} class="cmp-hero__title">{heading}</svelte:element>
				<Paragraphs value={s.body} class="cmp-hero__text" />
				<div class="cmp-hero__actions">
					<ComposerButton href={s.button_link} label={text(s, 'button_text')} />
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
							alt={heading}
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
	.cmp-hero {
		background: var(--ed-canvas, hsl(var(--muted)));
		color: hsl(var(--foreground));
	}

	.cmp-hero__grid {
		display: grid;
		gap: 24px;
		padding-block: clamp(28px, 4vw, 56px);
	}

	.cmp-hero__body {
		display: grid;
		gap: 14px;
		align-content: center;
		max-width: 36rem;
	}

	.cmp-hero--center .cmp-hero__body {
		justify-items: center;
		margin-inline: auto;
		text-align: center;
	}

	.cmp-hero__title {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: clamp(1.75rem, 4.6vw, 3.25rem);
		font-weight: 500;
		line-height: 1.08;
		letter-spacing: -0.01em;
		overflow-wrap: anywhere;
	}

	.cmp-hero__body :global(.cmp-hero__text) {
		color: hsl(var(--muted-foreground));
		font-size: 1rem;
		line-height: 1.6;
	}

	.cmp-hero__actions:empty {
		display: none;
	}

	.cmp-hero__actions {
		padding-top: 6px;
	}

	/* The picture comes first on a phone, so the page opens on it, and sits beside the words from
	   the tablet up. Its box is fixed by aspect-ratio before the file arrives: no layout shift. */
	.cmp-hero__media {
		order: -1;
		overflow: hidden;
		border-radius: var(--radius, 0.5rem);
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
			grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
			align-items: center;
			gap: clamp(24px, 3.5vw, 48px);
		}
		.cmp-hero__media {
			order: 0;
			aspect-ratio: 5 / 4;
		}
	}
</style>
