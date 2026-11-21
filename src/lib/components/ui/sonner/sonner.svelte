<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner'

	let restProps: SonnerProps = $props()
</script>

<!--
	Mounted inside the `data-theme` wrapper in src/routes/+layout.svelte, so every class below
	resolves the active theme's tokens. `font-sans` is not decoration: svelte-sonner hard-codes a
	system font stack on the toaster container, and because it does so through `:where()` it takes
	one class to hand toasts back the theme's body font. `rounded-lg` is the `--radius`-derived
	step, so a square theme still gets square toasts instead of sonner's fixed 8px.
-->
<Sonner
	class="toaster group font-sans"
	toastOptions={{
		classes: {
			toast:
				'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:rounded-lg group-[.toaster]:shadow-lg',
			description: 'group-[.toast]:text-muted-foreground',
			actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md',
			cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md'
		}
	}}
	{...restProps}
/>
