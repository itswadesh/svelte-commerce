<script lang="ts">
	import BannerBlock from './blocks/banner-block.svelte'
	import CollectionCarousel from './blocks/collection-carousel.svelte'
	import CollectionGrid from './blocks/collection-grid.svelte'
	import Collection from './blocks/collection.svelte'
	import FeaturedCategories from './blocks/featured-categories.svelte'
	import FeaturedProducts from './blocks/featured-products.svelte'
	import ImageBlock from './blocks/image-block.svelte'
	import RichTextBlock from './blocks/rich-text-block.svelte'
	import ProductAddToCartBlock from './blocks/product-add-to-cart-block.svelte'
	import ProductDescriptionBlock from './blocks/product-description-block.svelte'
	import ProductGalleryBlock from './blocks/product-gallery-block.svelte'
	import ProductMetaBlock from './blocks/product-meta-block.svelte'
	import ProductPincodeBlock from './blocks/product-pincode-block.svelte'
	import ProductPricingBlock from './blocks/product-pricing-block.svelte'
	import ProductRatingBlock from './blocks/product-rating-block.svelte'
	import ProductRelatedBlock from './blocks/product-related-block.svelte'
	import ProductReviewsBlock from './blocks/product-reviews-block.svelte'
	import ProductSpecificationsBlock from './blocks/product-specifications-block.svelte'
	import ProductStoreCheckBlock from './blocks/product-store-check-block.svelte'
	import ProductTagsBlock from './blocks/product-tags-block.svelte'
	import ProductTitleBlock from './blocks/product-title-block.svelte'
	import ProductVariationsBlock from './blocks/product-variations-block.svelte'
	import ProductBreadcrumbBlock from './blocks/product-breadcrumb-block.svelte'
	import { getBlockWrapperStyle, getContainerStyle, getInnerSurfaceStyle, sortBlocks } from './block-utils'
	import { browser } from '$app/environment'

	let {
		block,
		rowUnitPx = 0,
		layoutFitContent = false,
		rowGap = 0,
		isFlexParent = false,
	}: {
		block: any
		rowUnitPx?: number
		layoutFitContent?: boolean
		rowGap?: number
		isFlexParent?: boolean
	} = $props()

	const isProductBlock = $derived(block?.type?.startsWith?.('PRODUCT_') ?? false)
	const fitContent = $derived(block?.metadata?.fitContent === true || isProductBlock || layoutFitContent)
	const effectiveMetadata = $derived({ ...block?.metadata, fitContent })

	const containerChildren = $derived(sortBlocks(block?.metadata?.children || []))
	const isContainerFlex = $derived(block.type === 'CONTAINER' && block.metadata?.containerType === 'flex')
</script>

<div
	class="block-node"
	style={getBlockWrapperStyle({ ...block, metadata: effectiveMetadata }, fitContent ? rowGap : 0, isFlexParent)}
	data-block-type={block.type}
>
	<div
		class="block-surface"
		class:fit-content={fitContent}
		style={getInnerSurfaceStyle(effectiveMetadata)}
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
		{:else if block.type == 'CONTAINER'}
			<div
				class="container-block"
				class:fit-content={fitContent}
				style={getContainerStyle(effectiveMetadata, rowUnitPx)}
			>
				{#each containerChildren as child (child.id)}
					{#if child.type && child.type !== 'EMPTY'}
						<svelte:self block={child} {rowUnitPx} {layoutFitContent} {rowGap} isFlexParent={isContainerFlex} />
					{/if}
				{/each}
			</div>
		{:else if block.type == 'PRODUCT_GALLERY'}
			<ProductGalleryBlock {block} />
		{:else if block.type == 'PRODUCT_TITLE'}
			<ProductTitleBlock {block} />
		{:else if block.type == 'PRODUCT_PRICING'}
			<ProductPricingBlock {block} />
		{:else if block.type == 'PRODUCT_RATING'}
			<ProductRatingBlock {block} />
		{:else if block.type == 'PRODUCT_VARIATIONS'}
			<ProductVariationsBlock {block} />
		{:else if block.type == 'PRODUCT_ADD_TO_CART'}
			<ProductAddToCartBlock {block} />
		{:else if block.type == 'PRODUCT_DESCRIPTION'}
			<ProductDescriptionBlock {block} />
		{:else if block.type == 'PRODUCT_SPECIFICATIONS'}
			<ProductSpecificationsBlock {block} />
		{:else if block.type == 'PRODUCT_TAGS'}
			<ProductTagsBlock {block} />
		{:else if block.type == 'PRODUCT_META'}
			<ProductMetaBlock {block} />
		{:else if block.type == 'PRODUCT_PINCODE'}
			<ProductPincodeBlock {block} />
		{:else if block.type == 'PRODUCT_STORE_CHECK'}
			<ProductStoreCheckBlock {block} />
		{:else if block.type == 'PRODUCT_RELATED'}
			<ProductRelatedBlock {block} />
		{:else if block.type == 'PRODUCT_REVIEWS'}
			<ProductReviewsBlock {block} />
		{:else if block.type == 'PRODUCT_BREADCRUMB'}
			<ProductBreadcrumbBlock {block} />
		{/if}
	</div>
</div>

<style>
	.block-node {
		min-width: 0;
		min-height: 0;
	}

	/* 
	  Pure CSS Empty Block Detection:
	  If .block-surface has no elements or only empty container tags, we apply
	  display:none to the .block-node to remove it from the grid layout and gaps.
	*/
	.block-node:has(.block-surface:empty),
	.block-node:has(.block-surface > div:empty),
	.block-node:has(.block-surface > *:only-child:empty) {
		display: none !important;
	}

	.block-surface {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		min-width: 0;
		min-height: 0;
	}

	.block-surface.fit-content {
		width: auto;
		height: auto;
		min-height: 0;
	}

	.container-block {
		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
	}

	.container-block.fit-content {
		width: auto;
		height: auto;
	}
</style>
