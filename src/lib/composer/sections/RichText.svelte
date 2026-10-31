<script lang="ts">
	import Paragraphs from '../Paragraphs.svelte'
	import { paragraphs, text, type ComposerSection } from '../helpers.js'

	/** A heading and paragraphs of plain text. Never HTML: a sanitizer for that is its own work. */
	let { section }: { section: ComposerSection } = $props()

	const s = $derived(section.settings ?? {})
	const heading = $derived(text(s, 'heading'))
	const eyebrow = $derived(text(s, 'eyebrow'))
	// Centred unless the merchant chose left: the engine's default for this section.
	const centered = $derived(text(s, 'align') !== 'left')
	const hasBody = $derived(paragraphs(s.body).length > 0)
</script>

{#if heading || eyebrow || hasBody}
	<section class="cmp-band">
		<div class="page-width">
			<div class="cmp-rich" class:cmp-rich--center={centered}>
				{#if eyebrow}<p class="cmp-head__eyebrow">{eyebrow}</p>{/if}{#if heading}<h2 class="cmp-head__title">{heading}</h2>{/if}
				<Paragraphs value={s.body} class="cmp-copy" />
			</div>
		</div>
	</section>
{/if}

<style>
	.cmp-rich {
		display: grid;
		gap: 14px;
		max-width: 46rem;
	}

	.cmp-rich--center {
		margin-inline: auto;
		text-align: center;
	}
</style>
