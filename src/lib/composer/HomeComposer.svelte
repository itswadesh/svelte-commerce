<script lang="ts">
	import { invalidate } from '$app/navigation'
	import PageComposer from './PageComposer.svelte'
	import { LAYOUT_DEPENDENCY } from './editor-bridge.js'
	import type { ComposerLayout } from './helpers.js'

	/** The home page the merchant composed in the panel: every part of it a section. See PageComposer. */
	let {
		layout,
		brandName = '',
		aspectRatio = '4 / 5',
		editorOrigin = null
	}: { layout: ComposerLayout; brandName?: string; aspectRatio?: string; editorOrigin?: string | null } = $props()
</script>

<!-- The saved draft's product grids, resolved by the engine, once the panel says it saved. -->
<PageComposer {layout} page="home" {brandName} {aspectRatio} {editorOrigin} onsaved={() => invalidate(LAYOUT_DEPENDENCY)} />
