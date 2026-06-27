<script lang="ts">
	import LayoutSection from './layout-section.svelte'

	let { layouts = [] }: { layouts?: any[] } = $props()
</script>

{#each layouts as layout (layout.id || layout.type)}
	<LayoutSection {layout} />
{/each}
