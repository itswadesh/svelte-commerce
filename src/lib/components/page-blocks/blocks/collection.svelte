<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { getCollectionState } from '$lib/core/stores/collection.svelte.js'

	const { block } = $props()

	const collectionState = getCollectionState()
	const collection = $derived(collectionState.getOneById(block.entityId))
</script>

<div class="w-full">
	{#if collectionState.loading}
		<Skeleton />
	{:else if collection}
		<LazyImg aspectRatio={block.metadata.aspectRatio} src={collection.img} />
		<p>
			{collection.name}
		</p>
	{/if}
</div>
