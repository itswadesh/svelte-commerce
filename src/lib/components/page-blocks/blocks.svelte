<script lang="ts">
	import ImageBlock from './blocks/image-block.svelte'
	import RichTextBlock from './blocks/rich-text-block.svelte'

	const { layouts } = $props()

	let pageWidth = $state(0)

	const activeLayout = $derived.by(() => {
    if (!pageWidth) return null

    for (const layout of layouts) {
      if (layout.minScreenWidth <= pageWidth && pageWidth <= layout.maxScreenWidth)
        return layout
    }
		return null
	})
  $inspect(pageWidth)
	$inspect(activeLayout)
</script>

<svelte:window bind:innerWidth={pageWidth} />

{#if activeLayout}
	<section
		class="page-width grid"
		style="grid-template-columns: repeat({activeLayout.columnCount}, 1fr); column-gap: {activeLayout.columnGap}px; row-gap: {activeLayout.rowGap}px;"
	>
		{#each activeLayout.blocks as block, idx (block.id)}
			<div
				class="place-items-start border-black"
				style="grid-column-start: {block.columnStart}; grid-column-end: {block.columnEnd}; grid-row-start: {block.rowStart}; grid-row-end: {block.rowEnd};"
			>
				{#if block.type == 'RICH_TEXT'}
					<RichTextBlock {block} />
				{:else if block.type == 'IMAGE'}
					<ImageBlock {block} />
				{/if}
			</div>
		{/each}
	</section>
{/if}
