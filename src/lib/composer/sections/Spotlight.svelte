<script lang="ts">
	import ComposerButton from '../ComposerButton.svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import { choice, safeHref, text, type ComposerSection } from '../helpers.js'

	/**
	 * A large picture with the words on it. Its heading is the page's h1 when it opens the page
	 * (`isPageHeading`), as a hero's is. Without a picture it is a block of the text colour, so the
	 * words still read.
	 */
	let { section, isPageHeading = false, priority = false }: { section: ComposerSection; isPageHeading?: boolean; priority?: boolean } = $props()

	const s = $derived(section.settings ?? {})
	const heading = $derived(text(s, 'heading'))
	const eyebrow = $derived(text(s, 'eyebrow'))
	const mobileImage = $derived(safeHref(s.mobile_image))
	const image = $derived(safeHref(s.image) || mobileImage)
	const alt = $derived(text(s, 'image_alt') || heading)
	const inset = $derived(text(s, 'frame') === 'inset')
	const position = $derived(choice(s.position, ['bottom-left', 'center', 'bottom-right'], 'bottom-left'))
	const height = $derived(choice(s.height, ['medium', 'tall', 'screen'], 'tall'))
	const shade = $derived(choice(s.shade, ['light', 'medium', 'strong'], 'medium'))
</script>

{#if image || heading}
	<section
		class="cmp-spot cmp-spot--{position} cmp-spot--{height} cmp-spot--shade-{shade}"
		class:cmp-spot--full={!inset}
		class:cmp-spot--inset={inset}
		class:cmp-spot--bare={!image}
	>
		<div class:page-width={inset}>
			<div class="cmp-spot__frame">
				{#if image}
					<picture>
						{#if mobileImage && mobileImage !== image}
							<source media="(max-width: 767px)" srcset={mobileImage} />
						{/if}
						<img
							class="cmp-spot__img"
							src={image}
							{alt}
							width="1600"
							height="900"
							loading={priority ? 'eager' : 'lazy'}
							fetchpriority={priority ? 'high' : 'auto'}
							decoding="async"
						/>
					</picture>
				{/if}
				<div class="cmp-spot__content" class:page-width={!inset}>
					<div class="cmp-spot__words">
						{#if eyebrow}<span class="cmp-eyebrow-ink">{eyebrow}</span>{/if}
						{#if heading}
							<svelte:element this={isPageHeading ? 'h1' : 'h2'} class="cmp-spot__title">{heading}</svelte:element>
						{/if}
						<Paragraphs value={s.body} class="cmp-spot__text" />
						<div class="cmp-spot__actions">
							<ComposerButton href={s.button_link} label={text(s, 'button_text')} />{' '}<ComposerButton
								href={s.secondary_button_link}
								label={text(s, 'secondary_button_text')}
								variant="outline"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	/* White over a photograph, whatever the theme's colours; the shade is what keeps it legible, so
	   the shop chooses how much of it a bright picture needs. */
	.cmp-spot {
		--spot-ink: var(--on-photo, 0 0% 100%);
		--spot-shade: 0.42;
	}

	.cmp-spot--shade-light {
		--spot-shade: 0.24;
	}

	.cmp-spot--shade-strong {
		--spot-shade: 0.62;
	}

	.cmp-spot--bare {
		--spot-ink: var(--background);
	}

	.cmp-spot__frame {
		position: relative;
		isolation: isolate;
		/* Grid, not flex: a flex item stretched to fill would overrule .page-width on the edge-to-edge
		   look and put the words against the screen's edge. */
		display: grid;
		overflow: hidden;
		background: hsl(var(--foreground));
		color: hsl(var(--spot-ink));
		/* The outline button draws in the text colour: here that is the ink over the picture. */
		--foreground: var(--spot-ink);
	}

	.cmp-spot--inset .cmp-spot__frame {
		border-radius: calc(var(--radius, 0.5rem) * 2);
	}

	/* The heights hold before the picture arrives, so nothing below it shifts. */
	.cmp-spot--medium .cmp-spot__frame {
		min-height: clamp(340px, 40vw, 520px);
	}

	.cmp-spot--tall .cmp-spot__frame {
		min-height: clamp(440px, 54vw, 720px);
	}

	.cmp-spot--screen .cmp-spot__frame {
		min-height: min(88svh, 960px);
	}

	.cmp-spot__img {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cmp-spot:not(.cmp-spot--bare) .cmp-spot__frame::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(
			to top,
			hsl(var(--photo-shade, 0 0% 0%) / calc(var(--spot-shade) + 0.3)) 0%,
			hsl(var(--photo-shade, 0 0% 0%) / var(--spot-shade)) 38%,
			hsl(var(--photo-shade, 0 0% 0%) / calc(var(--spot-shade) * 0.2)) 70%,
			hsl(var(--photo-shade, 0 0% 0%) / 0) 100%
		);
	}

	/* On a phone the words take up most of the picture, so the shade reaches further up it. */
	@media (max-width: 767.98px) {
		.cmp-spot:not(.cmp-spot--bare) .cmp-spot__frame::after {
			background: linear-gradient(
				to top,
				hsl(var(--photo-shade, 0 0% 0%) / calc(var(--spot-shade) + 0.34)) 0%,
				hsl(var(--photo-shade, 0 0% 0%) / calc(var(--spot-shade) + 0.1)) 55%,
				hsl(var(--photo-shade, 0 0% 0%) / 0) 95%
			);
		}
	}

	.cmp-spot--center:not(.cmp-spot--bare) .cmp-spot__frame::after {
		background: hsl(var(--photo-shade, 0 0% 0%) / calc(var(--spot-shade) + 0.08));
	}

	.cmp-spot__content {
		display: flex;
		min-width: 0;
		align-items: flex-end;
		padding-block: clamp(24px, 4vw, 56px);
	}

	.cmp-spot--inset .cmp-spot__content {
		padding-inline: clamp(20px, 4vw, 56px);
	}

	.cmp-spot--center .cmp-spot__content {
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.cmp-spot--bottom-right .cmp-spot__content {
		justify-content: flex-end;
	}

	.cmp-spot__words {
		display: grid;
		gap: 12px;
		justify-items: start;
		min-width: 0;
		max-width: 44rem;
	}

	.cmp-spot--center .cmp-spot__words {
		justify-items: center;
	}

	.cmp-spot__title {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: var(--type-display, clamp(2.125rem, 6.4vw, 4.25rem));
		font-weight: 800;
		line-height: var(--leading-display, 1.02);
		text-wrap: balance;
		letter-spacing: var(--tracking-display, -0.025em);
		overflow-wrap: break-word;
		min-width: 0;
	}

	.cmp-spot__words :global(.cmp-spot__text) {
		max-width: 34rem;
		font-size: var(--type-heading, clamp(1rem, 1.6vw, 1.125rem));
		line-height: var(--leading-body, 1.6);
	}

	.cmp-spot__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		padding-top: 4px;
	}

	.cmp-spot--center .cmp-spot__actions {
		justify-content: center;
	}

	.cmp-spot__actions :global(.cmp-btn:focus-visible) {
		outline: 3px solid hsl(var(--spot-ink));
		outline-offset: 3px;
	}
</style>
