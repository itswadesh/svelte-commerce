<script lang="ts">
	import type { Snippet } from 'svelte'
	import { Pause, Play } from '@lucide/svelte'

	/**
	 * A strip that moves sideways for ever: the content drawn twice, the second copy hidden from
	 * screen readers, and the pair moved by exactly one copy's width so the join never shows. It
	 * stops under the pointer and while something in it has focus, and has a button that stops it
	 * outright (WCAG 2.2.2). On a device set to reduce motion it stands still, one copy, wrapped.
	 */
	let {
		seconds,
		reverse = false,
		label,
		content
	}: {
		seconds: number
		reverse?: boolean
		/** What moves, for the button's name: "Pause the logos". */
		label: string
		/** Drawn twice. The argument says whether this is the hidden copy, which must not take focus. */
		content: Snippet<[boolean]>
	} = $props()

	// Until the button is pressed the pointer holds the strip still; a press then wins over the pointer.
	let choice = $state<'paused' | 'playing' | null>(null)
</script>

<div
	class="cmp-mq"
	class:cmp-mq--paused={choice === 'paused'}
	class:cmp-mq--playing={choice === 'playing'}
	class:cmp-mq--reverse={reverse}
	style:--mq-seconds="{seconds}s"
>
	<div class="cmp-mq__track">
		{#each [false, true] as copy (copy)}
			<div class="cmp-mq__group" aria-hidden={copy ? 'true' : undefined}>
				{@render content(copy)}
			</div>
		{/each}
	</div>
	<button
		type="button"
		class="cmp-mq__toggle"
		data-target="secondary"
		onclick={() => (choice = choice === 'paused' ? 'playing' : 'paused')}
		aria-label={choice === 'paused' ? `Play the ${label}` : `Pause the ${label}`}
	>
		{#if choice === 'paused'}<Play aria-hidden="true" />{:else}<Pause aria-hidden="true" />{/if}
	</button>
</div>

<style>
	.cmp-mq {
		display: flex;
		align-items: center;
		min-width: 0;
	}

	.cmp-mq__track {
		display: flex;
		flex: 1;
		min-width: 0;
		overflow: hidden;
	}

	.cmp-mq__group {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: space-around;
		min-width: 100%;
		animation: cmp-mq var(--mq-seconds, 40s) linear infinite;
	}

	.cmp-mq--reverse .cmp-mq__group {
		animation-direction: reverse;
	}

	.cmp-mq--paused .cmp-mq__group,
	.cmp-mq:focus-within:not(.cmp-mq--playing) .cmp-mq__group {
		animation-play-state: paused;
	}

	@media (hover: hover) {
		.cmp-mq:not(.cmp-mq--playing):hover .cmp-mq__group {
			animation-play-state: paused;
		}
	}

	@keyframes cmp-mq {
		to {
			transform: translateX(-100%);
		}
	}

	.cmp-mq__toggle {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		margin-inline: 8px 12px;
		border-radius: 999px;
		color: inherit;
		opacity: 0.7;
		transition:
			opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			transform var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-mq__toggle:hover {
		opacity: 1;
	}

	.cmp-mq__toggle:active {
		transform: scale(0.92);
	}

	.cmp-mq__toggle:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
		opacity: 1;
	}

	.cmp-mq__toggle :global(svg) {
		width: 16px;
		height: 16px;
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-mq__group {
			flex: auto;
			flex-wrap: wrap;
			justify-content: center;
			min-width: 0;
			animation: none;
		}
		.cmp-mq__group[aria-hidden],
		.cmp-mq__toggle {
			display: none;
		}
		.cmp-mq__toggle:active {
			transform: none;
		}
	}
</style>
