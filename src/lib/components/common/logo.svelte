<script lang="ts">
	import { page } from '$app/state'

	/**
	 * Store brand mark: the uploaded store logo when present, otherwise the store name as a
	 * text wordmark — the same fallback the header uses. `variant="light"` renders white
	 * text for dark backgrounds (the editorial footer recolors .text-white to ink itself).
	 */
	let {
		href = '/',
		variant = 'default',
		class: className = '',
		loading = 'eager'
	}: { href?: string; variant?: 'default' | 'light'; class?: string; loading?: 'eager' | 'lazy' } = $props()

	const store = $derived(page?.data?.store)
	const name = $derived(store?.name || 'Svelte Commerce')
</script>

<a {href} class="inline-flex min-h-11 min-w-11 items-center leading-none md:min-h-9 md:min-w-0 {className}" aria-label="{name} — home">
	{#if store?.logo}
		<!-- width/height hold a 4:1 box until the image arrives; `w-auto` then takes its real shape. -->
		<img src={store.logo} alt={name} width="144" height="36" {loading} decoding="async" class="h-9 w-auto max-w-[200px] object-contain" />
	{:else}
		<span class="font-serif text-[1.5rem] font-bold tracking-[0.02em] {variant === 'light' ? 'text-white' : 'text-foreground'}">
			{name}
		</span>
	{/if}
</a>
