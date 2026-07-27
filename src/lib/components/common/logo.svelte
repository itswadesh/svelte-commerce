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
		class: className = ''
	}: { href?: string; variant?: 'default' | 'light'; class?: string } = $props()

	const store = $derived(page?.data?.store)
	const name = $derived(store?.name || 'Svelte Commerce')
</script>

<a {href} class="inline-flex items-center leading-none {className}" aria-label="{name} — home">
	{#if store?.logo}
		<img src={store.logo} alt={name} class="h-9 w-auto max-w-[200px] object-contain" />
	{:else}
		<span
			class="font-serif text-[1.5rem] font-bold tracking-[0.02em] {variant === 'light'
				? 'text-white'
				: 'text-foreground'}"
		>
			{name}
		</span>
	{/if}
</a>
