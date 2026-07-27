<script lang="ts">
	import { page } from '$app/state'

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
			for (const [key, value] of Object.entries(vars)) {
				if (typeof value !== 'string' || !value) continue
				// Same shadcn-raw transform the core ColorPalette uses: "hsl(24, 100%, 50%)" → "24 100% 50%"
				shell.style.setProperty(key, value.replaceAll(',', '').replace('hsl(', '').replace(')', ''))
				applied.push(key)
			}
		}
		return () => {
			for (const key of applied) shell.style.removeProperty(key)
		}
	})
</script>
