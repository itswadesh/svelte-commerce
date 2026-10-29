<script lang="ts">
	import { ArrowRight } from '@lucide/svelte'
	import { safeHref, text, type ComposerSection } from '../helpers.js'

	/** A one-line notice, wherever the merchant placed it in the page. */
	let { section }: { section: ComposerSection } = $props()

	const message = $derived(text(section.settings, 'text'))
	const href = $derived(safeHref(section.settings?.link))
</script>

{#if message}
	<div class="cmp-announce bg-primary text-primary-foreground">
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
	.cmp-announce__row {
		display: flex;
		justify-content: center;
		padding-block: 10px;
		font-size: var(--text-caption);
		font-weight: 500;
		line-height: 1.4;
		letter-spacing: 0.02em;
		text-align: center;
	}

	.cmp-announce__text {
		margin: 0;
		overflow-wrap: anywhere;
	}

	.cmp-announce__link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		/* A full-height touch target, though the bar itself stays slim. */
		min-height: 44px;
		margin-block: -10px;
		color: inherit;
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 3px;
		overflow-wrap: anywhere;
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
