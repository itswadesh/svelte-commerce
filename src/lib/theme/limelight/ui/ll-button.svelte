<script lang="ts">
	import type { Snippet } from 'svelte'
	import { Loader2 } from '@lucide/svelte'

	/**
	 * Limelight button — square (no radius), uppercase, thin outline.
	 * `filled` = plum background / white text; `outline` = plum text on white
	 * with a 1px current-color border, matching the source CTA buttons.
	 * Shows an inline spinner while `loading`, per the project's async-button rule.
	 */
	let {
		variant = 'filled',
		href,
		type = 'button',
		loading = false,
		disabled = false,
		full = false,
		onclick,
		children,
		...rest
	}: {
		variant?: 'filled' | 'outline'
		href?: string
		type?: 'button' | 'submit'
		loading?: boolean
		disabled?: boolean
		full?: boolean
		onclick?: (e: MouseEvent) => void
		children: Snippet
		[key: string]: any
	} = $props()
</script>

{#if href}
	<a
		{href}
		class="ll-btn ll-btn--{variant}"
		class:ll-btn--full={full}
		class:ll-btn--disabled={disabled || loading}
		aria-disabled={disabled || loading}
		{...rest}
	>
		{#if loading}<Loader2 class="ll-btn-spin" />{/if}
		{@render children()}
	</a>
{:else}
	<button
		{type}
		class="ll-btn ll-btn--{variant}"
		class:ll-btn--full={full}
		disabled={disabled || loading}
		{onclick}
		{...rest}
	>
		{#if loading}<Loader2 class="ll-btn-spin" />{/if}
		{@render children()}
	</button>
{/if}

<style>
	.ll-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-width: 118px;
		padding: 11px 22px;
		border: 1px solid var(--limelight-plum, #460032);
		border-radius: 0;
		font-family: var(--font-body);
		font-size: 12px;
		font-weight: 500;
		line-height: 16px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color 0.25s ease,
			color 0.25s ease;
	}

	.ll-btn--filled {
		background: var(--limelight-plum, #460032);
		color: #fff;
	}

	.ll-btn--filled:hover {
		background: var(--limelight-wine, #6f1648);
		border-color: var(--limelight-wine, #6f1648);
	}

	.ll-btn--outline {
		background: #fff;
		color: var(--limelight-plum, #460032);
	}

	.ll-btn--outline:hover {
		background: var(--limelight-plum, #460032);
		color: #fff;
	}

	.ll-btn--full {
		width: 100%;
	}

	.ll-btn:disabled,
	.ll-btn--disabled {
		opacity: 0.55;
		pointer-events: none;
	}

	.ll-btn :global(.ll-btn-spin) {
		width: 15px;
		height: 15px;
		animation: ll-spin 0.7s linear infinite;
	}

	@keyframes ll-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
