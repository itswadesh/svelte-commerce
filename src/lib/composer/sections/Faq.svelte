<script lang="ts">
	import { ChevronDown } from '@lucide/svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import { faqItems, text, type ComposerSection } from '../helpers.js'

	/**
	 * Questions and answers, each a native disclosure: the browser gives it its keyboard handling,
	 * its expanded state for screen readers and find-in-page, with no script. The answer is plain
	 * text; a blank line starts a paragraph.
	 */
	let { section }: { section: ComposerSection } = $props()

	const heading = $derived(text(section.settings, 'heading'))
	const items = $derived(faqItems(section.settings?.items))
</script>

{#if items.length}
	<section class="cmp-band">
		<div class="page-width cmp-faq">
			{#if heading}
				<header class="cmp-head"><h2 class="cmp-head__title">{heading}</h2></header>
			{/if}
			<div class="cmp-faq__list">
				{#each items as item, i (i)}
					<details class="cmp-faq__item">
						<summary class="cmp-faq__q">
							<span>{item.question}</span>
							<ChevronDown class="cmp-faq__icon" aria-hidden="true" />
						</summary>
						<div class="cmp-faq__a">
							<Paragraphs value={item.answer} class="cmp-copy" />
						</div>
					</details>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.cmp-faq {
		max-width: 52rem;
	}

	.cmp-faq__list {
		border-top: 1px solid hsl(var(--border));
	}

	.cmp-faq__item {
		border-bottom: 1px solid hsl(var(--border));
	}

	.cmp-faq__q {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		min-height: 56px;
		padding: 12px 0;
		font-weight: 600;
		line-height: 1.35;
		list-style: none;
		cursor: pointer;
		overflow-wrap: anywhere;
		transition: opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-faq__q::-webkit-details-marker {
		display: none;
	}

	.cmp-faq__q:hover {
		opacity: 0.8;
	}

	.cmp-faq__q :global(.cmp-faq__icon) {
		flex: 0 0 auto;
		width: 18px;
		height: 18px;
		transition: transform 200ms var(--motion-ease, ease-out);
	}

	.cmp-faq__item[open] .cmp-faq__q :global(.cmp-faq__icon) {
		transform: rotate(180deg);
	}

	.cmp-faq__a {
		padding: 0 0 16px;
	}

	.cmp-faq__item[open] .cmp-faq__a {
		animation: cmp-faq-open 200ms var(--motion-ease, ease-out);
	}

	@keyframes cmp-faq-open {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-faq__q :global(.cmp-faq__icon) {
			transition: none;
		}
		.cmp-faq__item[open] .cmp-faq__a {
			animation: none;
		}
	}
</style>
