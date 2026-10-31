<script lang="ts">
	import type { Snippet } from 'svelte'
	import { ArrowRight } from '@lucide/svelte'
	import { safeHref, text } from './helpers.js'

	let { settings, title }: { settings: Record<string, unknown> | undefined; title?: Snippet } = $props()

	const heading = $derived(text(settings, 'heading'))
	const eyebrow = $derived(text(settings, 'eyebrow'))
	const subtitle = $derived(text(settings, 'subtitle'))
	const viewAll = $derived(safeHref(settings?.view_all_link))
</script>

{#snippet headingLine()}
	{#if heading}
		{#if title}{@render title()}{:else}<h2 class="cmp-head__title">{heading}</h2>{/if}
	{/if}
{/snippet}

{#if heading || eyebrow || subtitle || viewAll}
	<header class="cmp-head">
		{#if eyebrow || subtitle}
			<div class="cmp-head__words">
				{#if eyebrow}<p class="cmp-head__eyebrow">{eyebrow}</p>{/if}
				{@render headingLine()}
				{#if subtitle}<p class="cmp-head__subtitle">{subtitle}</p>{/if}
			</div>
		{:else}
			{@render headingLine()}
		{/if}{#if viewAll}{' '}<a class="cmp-head__link" href={viewAll}>
				{text(settings, 'view_all_text') || 'View all'}{#if heading}<span class="sr-only">: {heading}</span>{/if}
				<ArrowRight class="cmp-head__icon" aria-hidden="true" />
			</a>{/if}
	</header>
{/if}
