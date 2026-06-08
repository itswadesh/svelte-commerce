<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import { getCollectionState } from '$lib/core/stores/collection.svelte.js'

	const { block } = $props()

	const collectionState = getCollectionState()
	const collection = $derived(collectionState.getOneById(block.entityId))

	const [aspectWidth, aspectHeight] = $derived(block.metadata.aspectRatio?.split(':') || ['1', '1'])
</script>

{#if collectionState.loading}
	<Skeleton />
{:else if collection}
	<div
		style="aspect-ratio: {aspectWidth}/{aspectHeight}; {block.metadata.maxWidth ? `max-width: ${block.metadata.maxWidth}px;` : ``} {block.metadata
			.maxHeight
			? ` max-height: ${block.metadata.maxHeight}px;`
			: ``}"
		class="flex h-full items-center justify-center"
	>
		<img src={collection.img} class="h-full object-contain" alt="" />
	</div>
{/if}
