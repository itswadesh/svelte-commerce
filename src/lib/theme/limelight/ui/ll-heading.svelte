<script lang="ts">
	import type { Snippet } from 'svelte'

	/**
	 * Limelight section heading — regular-weight serif in plum, with an
	 * optional subheading. Mirrors the source "Shop by Category" treatment:
	 * centered by default, 24px serif title, 16px body-tone subtitle.
	 */
	let {
		title,
		subtitle,
		align = 'center',
		as = 'h2',
		children
	}: {
		title?: string
		subtitle?: string
		align?: 'center' | 'start'
		as?: 'h1' | 'h2' | 'h3'
		children?: Snippet
	} = $props()
</script>

<div class="ll-heading" style="text-align: {align};">
	<svelte:element this={as} class="ll-heading-title">
		{#if children}{@render children()}{:else}{title}{/if}
	</svelte:element>
	{#if subtitle}
		<p class="ll-heading-sub">{subtitle}</p>
	{/if}
</div>

<style>
	.ll-heading-title {
		margin: 0;
		color: var(--limelight-plum, #460032);
		font-family: var(--font-heading);
		font-size: 24px;
		font-weight: 400;
		line-height: 1.3;
		letter-spacing: 0.01em;
	}

	.ll-heading-sub {
		margin: 10px 0 0;
		color: #000;
		font-family: var(--font-body);
		font-size: 16px;
		line-height: 1.3;
	}
</style>
