<script lang="ts">
	import { text } from './utils.js'
	import type { SectionContext } from './types.js'

	/** Email capture band. Submission is wired by the store's newsletter plugin, not the theme. */
	let { ctx, options = {} }: { ctx: SectionContext; options?: Record<string, any> } = $props()

	const label = $derived(text(ctx, options.label))
	const title = $derived(text(ctx, options.title))
	const titleSuffix = $derived(text(ctx, options.titleSuffix))
	const body = $derived(text(ctx, options.text))
	const placeholder = $derived(text(ctx, options.placeholder))
	const cta = $derived(text(ctx, options.cta))
	const privacy = $derived(text(ctx, options.privacy))

	let email = $state('')
</script>

<section class="ts-newsletter {options.class ?? ''}">
	<div class="ts-newsletter-copy">
		{#if label}<p>{label}</p>{/if}
		{#if title}
			<h2>
				{title}{#if titleSuffix}&nbsp;<span>{titleSuffix}</span>{/if}
			</h2>
		{/if}
		{#if body}<p class="ts-newsletter-text">{body}</p>{/if}
	</div>

	<form onsubmit={(e) => e.preventDefault()}>
		<input type="email" bind:value={email} {placeholder} aria-label="Email address" />
		<button type="submit">{cta}</button>
	</form>

	{#if privacy}<small class="ts-newsletter-privacy">{privacy}</small>{/if}
</section>
