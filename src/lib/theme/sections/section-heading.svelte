<script lang="ts">
	import { text } from './utils.js'
	import type { SectionContext } from './types.js'

	/**
	 * The heading block every section shares: eyebrow, title (optionally split so a theme can
	 * accent the second half), supporting copy and a "view all" link. Which of those appear is
	 * decided entirely by the theme's section options.
	 */
	let { ctx, options = {} }: { ctx: SectionContext; options?: Record<string, any> } = $props()

	const label = $derived(text(ctx, options.label))
	const title = $derived(text(ctx, options.title))
	const titleSuffix = $derived(text(ctx, options.titleSuffix))
	const body = $derived(text(ctx, options.text))
	const cta = $derived(text(ctx, options.cta))
</script>

{#if label || title || body || cta}
	<div class="ts-heading {options.class ?? ''}">
		{#if label}
			<span class="ts-heading-label {options.labelClass ?? ''}">{label}</span>
		{/if}
		{#if title}
			<h2>
				{title}{#if titleSuffix}&nbsp;<span>{titleSuffix}</span>{/if}
			</h2>
		{/if}
		{#if body}
			<p>{body}</p>
		{/if}
		{#if cta}
			<a href={options.ctaHref ?? '/products'}>{cta}</a>
		{/if}
	</div>
{/if}
