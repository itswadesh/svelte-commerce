<script lang="ts">
	import ImageBlock from "./blocks/image-block.svelte"
	import RichTextBlock from "./blocks/rich-text-block.svelte"

	const { data } = $props()
</script>

<section class="page-width grid" style="grid-template-columns: repeat({data.columnCount}, 1fr); column-gap: {data.columnGap}px; row-gap: {data.rowGap}px;">
	{#each data.blocks as block, idx (block.id)}
		<div
			class="place-items-start border border-black"
			style="grid-column-start: {block.columnStart}; grid-column-end: {block.columnEnd}; grid-row-start: {block.rowStart}; grid-row-end: {block.rowEnd};"
		>

      {#if block.type == "RICH_TEXT"}
        <RichTextBlock {block} />
      {:else if block.type == "IMAGE"}
        <ImageBlock {block} />
      {/if}
    </div>
	{/each}
</section>
