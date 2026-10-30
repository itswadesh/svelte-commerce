<script lang="ts">
	import { ArrowRight } from '@lucide/svelte'
	import { safeHref, text, type ComposerSection } from '../helpers.js'

	/** A one-line notice, wherever the merchant placed it in the page. */
	let { section }: { section: ComposerSection } = $props()

	const message = $derived(text(section.settings, 'text'))
	const href = $derived(safeHref(section.settings?.link))
</script>

{#if message}
	<div class="cmp-announce bg-primary text-primary-foreground" data-target="secondary">
		<div class="page-width cmp-announce__row">
			{#if href}
				<a class="cmp-announce__link" {href}>
					<span>{message}</span>
					<ArrowRight class="cmp-announce__icon" aria-hidden="true" />
				</a>
			{:else}
				<p class="cmp-announce__text">{message}</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* One 30px line, as the strip above the header: long text ends in an ellipsis rather than
	   wrapping the bar taller, and the link keeps the bar's full height as its target. */
	.cmp-announce__row {
		display: flex;
		justify-content: center;
		height: 1.875rem;
		font-size: var(--type-dense, 0.8125rem);
		font-weight: 500;
		line-height: 1.875rem;
		letter-spacing: 0.02em;
		text-align: center;
		white-space: nowrap;
	}

	.cmp-announce__text,
	.cmp-announce__link span {
		margin: 0;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.cmp-announce__link {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
		color: inherit;
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 3px;
		transition:
			opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			text-decoration-color var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-announce__link:hover {
		text-decoration-color: currentColor;
	}

	.cmp-announce__link:active {
		opacity: 0.75;
	}

	.cmp-announce__link :global(.cmp-announce__icon) {
		flex: none;
		width: 14px;
		height: 14px;
		transition: transform var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-announce__link:hover :global(.cmp-announce__icon) {
		transform: translateX(3px);
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-announce__link:hover :global(.cmp-announce__icon) {
			transform: none;
		}
	}
</style>
