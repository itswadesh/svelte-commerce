<script lang="ts">
	import { themeImage } from '../placeholder.js'
	import { get, text } from './utils.js'
	import type { SectionContext } from './types.js'

	/** A full-width image band: hero, mid-page editorial, campaign. */
	let { ctx, options = {} }: { ctx: SectionContext; options?: Record<string, any> } = $props()

	const src = $derived(themeImage(get(ctx.content, options.image), options.seed ?? options.image))
	const alt = $derived(text(ctx, options.alt))
	const ariaLabel = $derived(text(ctx, undefined, options.ariaLabel))
</script>

<section class="ts-banner {options.class ?? ''}" aria-label={ariaLabel || undefined}>
	{#if options.href}
		<a href={options.href}><img {src} {alt} /></a>
	{:else}
		<img {src} {alt} />
	{/if}
</section>
