<script lang="ts">
	import { SECTIONS } from './sections/index.js'
	import type { SectionContext, ThemeLayout } from './sections/types.js'

	/**
	 * Renders a theme's homepage from its layout: an ordered list of section types with options,
	 * served by the API. The storefront supplies the section components and the live commerce
	 * data; the theme supplies the order, the settings and the stylesheet.
	 *
	 * An unknown section type is skipped rather than thrown, so a layout authored against a
	 * newer section library degrades to the sections this build knows instead of a blank page.
	 */
	let { layout, ctx }: { layout: ThemeLayout; ctx: SectionContext } = $props()

	const sections = $derived(
		(layout?.sections ?? []).filter((section) => {
			const known = !!SECTIONS[section.type]
			if (!known && typeof console !== 'undefined') {
				console.warn(`[theme] unknown section type "${section.type}" — skipped`)
			}
			return known
		})
	)
</script>

<div class="ts-home {layout?.rootClass ?? ''}">
	{#each sections as section, index (index)}
		{@const Section = SECTIONS[section.type]}
		<Section {ctx} options={section.options ?? {}} />
	{/each}
</div>
