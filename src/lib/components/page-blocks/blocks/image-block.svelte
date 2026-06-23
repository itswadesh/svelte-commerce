<script lang="ts">
	const { block } = $props()
	const [aspectWidth, aspectHeight] = $derived(block.metadata.aspectRatio?.split(':') || ['1', '1'])
</script>

<button
  onclick={() => {
    if (block.metadata.redirectOnClick)
      window.location.href = block.metadata.redirectTo
  }}
	style="aspect-ratio: {aspectWidth}/{aspectHeight}; {block.metadata.maxWidth ? `max-width: ${block.metadata.maxWidth}px;` : ``} {block.metadata
		.maxHeight
		? ` max-height: ${block.metadata.maxHeight}px;`
		: ``}"
	class="{block.metadata.redirectOnClick ? 'cursor-pointer' : 'cursor-default'} flex h-full items-center justify-center"
>
	<img src={block.metadata.url} class="h-full object-contain" alt="" />
</button>
