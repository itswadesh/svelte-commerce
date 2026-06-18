<script lang="ts">
	import BannerBlock from './blocks/banner-block.svelte'
	import CollectionCarousel from './blocks/collection-carousel.svelte'
	import CollectionGrid from './blocks/collection-grid.svelte'
	import Collection from './blocks/collection.svelte'
	import FeaturedCategories from './blocks/featured-categories.svelte'
	import FeaturedProducts from './blocks/featured-products.svelte'
	import ImageBlock from './blocks/image-block.svelte'
	import RichTextBlock from './blocks/rich-text-block.svelte'

	const { layouts } = $props()
	$inspect(layouts)
</script>

{#each layouts as layout, idx (idx)}
	<section
		class="{layout.metadata.isFullScreen ? 'px-3' : 'page-width'} grid {layout.type}"
		style="grid-template-columns: repeat({layout.columnCount}, 1fr); column-gap: {layout.columnGap}px; row-gap: {layout.rowGap}px;"
	>
		{#each layout.blocks as block, idx (block.id)}
			{@const verticalAlign = block.metadata?.verticalAlign || 'stretch'}
			{@const horizontalAlign = block.metadata?.horizontalAlign || 'stretch'}
			<div
				class="{horizontalAlign === 'stretch' ? '' : 'w-fit'} {verticalAlign === 'stretch' ? '' : 'h-fit'}"
				style="grid-column-start: {block.columnStart}; grid-column-end: {block.columnEnd}; grid-row-start: {block.rowStart}; grid-row-end: {block.rowEnd}; justify-self: {horizontalAlign}; align-self: {verticalAlign}; {block
					.metadata.maxHeightUnit && block.metadata.maxHeight
					? `height: ${block.metadata.maxHeight}${block.metadata.maxHeightUnit};`
					: ''}"
			>
				{#if block.type == 'RICH_TEXT'}
					<RichTextBlock {block} />
				{:else if block.type == 'IMAGE'}
					<ImageBlock {block} />
				{:else if block.type == 'BANNER'}
					<BannerBlock {block} />
				{:else if block.type == 'COLLECTION'}
					<Collection {block} />
				{:else if block.type == 'FEATURED_CATEGORIES'}
					<FeaturedCategories {block} />
				{:else if block.type == 'FEATURED_PRODUCTS'}
					<FeaturedProducts {block} />
				{:else if block.type == 'COLLECTION_CAROUSEL'}
					<CollectionCarousel {block} />
				{:else if block.type == 'COLLECTION_GRID'}
					<CollectionGrid {block} />
				{/if}
			</div>
		{/each}
	</section>
{/each}

<style>
	.LAPTOP,
	.MOBILE,
	.TABLET,
	.DESKTOP {
		display: none;
	}

	@media screen and (min-width: 0px) and (max-width: 600px) {
		.MOBILE {
			display: grid;
		}
	}
	@media screen and (min-width: 601px) and (max-width: 1024px) {
		.TABLET {
			display: grid;
		}
	}
	@media screen and (min-width: 1025px) and (max-width: 1920px) {
		.LAPTOP {
			display: grid;
		}
	}
	@media screen and (min-width: 1921px) {
		.DESKTOP {
			display: grid;
		}
	}
</style>
