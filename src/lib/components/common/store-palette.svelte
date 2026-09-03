<script lang="ts">
	import { page } from '$app/state'
	import { guardStorePalette } from './store-palette-guard.js'

	/**
	 * Applies the store's admin-set palette (store.cssVariables, edited on the admin Theme
	 * page) on the [data-theme] shell for the DEFAULT theme. The core ColorPalette component
	 * injects these at :root, but the per-theme app.css blocks (e.g. [data-theme='default'])
	 * define the same tokens on the shell and shadow it — inline styles on the shell win.
	 * Reskinned themes keep their baked palettes (reskin pipeline owns those).
	 */
	const activeTheme = $derived(page.data?.theme?.name ?? 'default')
	const vars = $derived(page.data?.store?.cssVariables ?? {})

	$effect(() => {
		const shell = document.querySelector('[data-theme]') as HTMLElement | null
		if (!shell) return
		const applied: string[] = []
		if (activeTheme === 'default') {
			// Guarded, and in exactly the same way as the SSR block in +layout.svelte — otherwise the
			// first paint and hydration would disagree about the palette.
			for (const [key, value] of Object.entries(guardStorePalette(vars as Record<string, unknown>))) {
				shell.style.setProperty(key, value)
				applied.push(key)
			}
		}
		return () => {
			for (const key of applied) shell.style.removeProperty(key)
		}
	})
</script>
