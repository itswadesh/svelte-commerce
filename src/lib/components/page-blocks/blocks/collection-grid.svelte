<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { getCollectionState } from '$lib/core/stores/collection.svelte.js'

	const { block } = $props()
	const [aspectWidth, aspectHeight] = $derived(block.metadata.aspectRatio?.split(':') || ['1', '1'])
	const collectionState = getCollectionState()
</script>

<div class="w-full py-8">
	{#if block.metadata.showHeader}
		<div class="mb-6 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
			<div class="text-center md:text-left">
				{#if block.metadata.title}
					<h2 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{block.metadata.title}</h2>
					<div class="mx-auto mt-2 h-1 w-12 bg-primary md:mx-0"></div>
				{/if}
				{#if block.metadata.subtitle}
					<p class="mt-4 text-sm font-medium text-muted-foreground">{block.metadata.subtitle}</p>
				{/if}
			</div>
			{#if block.metadata.showViewMore}
				<Button href={block.metadata.redirectsTo || '/products'} class="group">
					{block.metadata.viewMoreText}
					<svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</Button>
			{/if}
		</div>
	{/if}

	<div
		class="intra-gap grid"
		style="grid-template-columns: repeat({block.metadata.columnCount || 5}, 1fr); row-gap: {block.metadata.gridRowGap ?? 8}px; column-gap: {block
			.metadata.gridColumnGap ?? 8}px;"
	>
		{#each block.metadata.collectionIds || [] as id}
			{@const collection = collectionState.getOneById(id)}
			{#if collectionState.loading}
				<Skeleton />
			{:else}
				<div
					style="aspect-ratio: {aspectWidth}/{aspectHeight}; {block.metadata.maxWidth ? `max-width: ${block.metadata.maxWidth}px;` : ``}"
					class="flex items-center justify-center"
				>
					<img src={collection?.img} class="h-full object-contain" alt="" />
				</div>
			{/if}
		{/each}
	</div>
</div>
