<script lang="ts">
	import ComposerButton from '../ComposerButton.svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import { safeHref, text, type ComposerSection } from '../helpers.js'

	/** A picture beside words: the picture on top on a phone, on the chosen side from the tablet up. */
	let { section }: { section: ComposerSection } = $props()

	const s = $derived(section.settings ?? {})
	const heading = $derived(text(s, 'heading'))
	const eyebrow = $derived(text(s, 'eyebrow'))
	const image = $derived(safeHref(s.image))
	const imageRight = $derived(text(s, 'image_side') === 'right')
	const hasWords = $derived(!!(heading || eyebrow || text(s, 'body')))
	// What the picture shows, as the shop wrote it; the heading names it otherwise.
	const alt = $derived(text(s, 'image_alt') || heading || eyebrow)
</script>

{#if image || hasWords}
	<section class="cmp-band">
		<!-- Bold and bright (D140): the picture and words together on one rounded block of the quiet colour. -->
		<div class="page-width">
			<div class="cmp-iwt" class:cmp-iwt--split={image && hasWords} class:cmp-iwt--right={imageRight}>
				{#if image}
					<div class="cmp-iwt__media">
						<img src={image} {alt} width="1000" height="800" loading="lazy" decoding="async" />
					</div>
				{/if}
				{#if hasWords}
					<div class="cmp-iwt__body">
						{#if eyebrow}<span class="cmp-eyebrow">{eyebrow}</span>{/if}
						{#if heading}<h2 class="cmp-head__title">{heading}</h2>{/if}
						<Paragraphs value={s.body} class="cmp-copy" />
						<div class="cmp-iwt__actions">
							<ComposerButton href={s.button_link} label={text(s, 'button_text')} variant="outline" />
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>
{/if}

<style>
	.cmp-iwt {
		display: grid;
		gap: 20px;
		padding: clamp(12px, 2vw, 20px);
		border-radius: calc(var(--radius, 0.5rem) * 1.5);
		background: hsl(var(--muted));
	}

	.cmp-iwt__media {
		overflow: hidden;
		border-radius: var(--radius, 0.5rem);
		aspect-ratio: 5 / 4;
		background: hsl(var(--background));
	}

	.cmp-iwt__media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cmp-iwt__body {
		display: grid;
		gap: 12px;
		align-content: center;
		max-width: 34rem;
		padding: clamp(8px, 3vw, 40px);
	}

	/* The page's quiet grey would be faint on the quiet block: words here take the text colour. */
	.cmp-iwt__body :global(.cmp-copy),
	.cmp-iwt__body :global(.cmp-eyebrow) {
		color: hsl(var(--foreground));
	}

	.cmp-iwt__actions {
		padding-top: 6px;
	}

	.cmp-iwt__actions:empty {
		display: none;
	}

	@media (min-width: 768px) {
		.cmp-iwt--split {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			align-items: center;
			gap: clamp(24px, 4vw, 64px);
		}
		.cmp-iwt--split.cmp-iwt--right .cmp-iwt__media {
			order: 2;
		}
	}
</style>
