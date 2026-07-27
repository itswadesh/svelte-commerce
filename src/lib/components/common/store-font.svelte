<script lang="ts">
	import { page } from '$app/state'

	/**
	 * Applies the store's admin-set body font (store.themeFontFamily, edited on the admin
	 * Theme page) over the active theme's default. 'system' or unset = keep the theme's own
	 * typography. Headings (--font-heading) are intentionally left to the theme.
	 * Set on both :root and the [data-theme] shell so it beats the per-theme font blocks.
	 */
	const STACKS: Record<string, string> = {
		inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
		roboto: "'Roboto', ui-sans-serif, system-ui, sans-serif",
		poppins: "'Poppins', ui-sans-serif, system-ui, sans-serif"
	}
	const GOOGLE: Record<string, string> = {
		inter: 'Inter:wght@400;500;600;700',
		roboto: 'Roboto:wght@400;500;700',
		poppins: 'Poppins:wght@400;500;600;700'
	}

	const raw = $derived(String(page.data?.store?.themeFontFamily || '').trim())
	const stack = $derived.by(() => {
		if (!raw || raw.toLowerCase() === 'system') return ''
		const key = raw.toLowerCase()
		if (STACKS[key]) return STACKS[key]
		// Full stacks like "Georgia, serif" are stored verbatim — use as-is.
		return raw
	})
	const googleHref = $derived(
		GOOGLE[raw.toLowerCase()]
			? `https://fonts.googleapis.com/css2?family=${GOOGLE[raw.toLowerCase()]}&display=swap`
			: ''
	)

	$effect(() => {
		const targets = [document.documentElement, document.querySelector('[data-theme]')].filter(
			Boolean
		) as HTMLElement[]
		for (const el of targets) {
			if (stack) {
				el.style.setProperty('--font-body', stack)
				el.style.setProperty('--font-primary', stack)
			} else {
				el.style.removeProperty('--font-body')
				el.style.removeProperty('--font-primary')
			}
		}
	})
</script>

<svelte:head>
	{#if googleHref}
		<link rel="stylesheet" href={googleHref} />
	{/if}
</svelte:head>
