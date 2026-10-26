<script lang="ts">
	import { safeHref } from './helpers.js'

	/** A section's call to action: always a link, rendered only when it has both words and a place to go. */
	let { href, label, variant = 'primary' }: { href: unknown; label: string; variant?: 'primary' | 'outline' } = $props()

	const target = $derived(safeHref(href))
</script>

{#if target && label}
	<a class="cmp-btn cmp-btn--{variant}" href={target}>{label}</a>
{/if}

<style>
	.cmp-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		/* 44px on touch, 40px once the pointer is a mouse — the storefront's two control heights. */
		min-height: 44px;
		max-width: 100%;
		padding: 0 22px;
		border: 1px solid hsl(var(--primary));
		border-radius: var(--radius, 0.5rem);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-align: center;
		text-transform: uppercase;
		transition:
			transform var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-btn--primary {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
	}

	.cmp-btn--outline {
		background: transparent;
		border-color: hsl(var(--foreground));
		color: hsl(var(--foreground));
	}

	.cmp-btn:hover {
		transform: translateY(-2px);
		opacity: 0.9;
	}

	.cmp-btn:active {
		transform: translateY(0) scale(0.98);
		opacity: 0.8;
	}

	@media (hover: hover) and (pointer: fine) {
		.cmp-btn {
			min-height: 40px;
		}
	}

	/* No movement; the opacity change still answers the hover and the press. */
	@media (prefers-reduced-motion: reduce) {
		.cmp-btn:hover,
		.cmp-btn:active {
			transform: none;
		}
	}
</style>
