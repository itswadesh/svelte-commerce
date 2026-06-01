<script lang="ts">
	import ImageBlock from "./blocks/image-block.svelte"
	import RichTextBlock from "./blocks/rich-text-block.svelte"

	const { blocks } = $props()
	$inspect(blocks)
</script>

<section class="page-width grid grid-cols-10" style="grid-template-rows: repeat(10, 50px);">
	{#each blocks as block, idx (block.id)}
		<div
			class="border over border-black bg-red-100"
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
