<script lang="ts">
	import { page } from '$app/state'
	import { untrack } from 'svelte'
	import { browser } from '$app/environment'
	import { invalidate } from '$app/navigation'
	import { rememberPreview } from '$lib/composer/page-layout.js'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import PageComposer from '$lib/composer/PageComposer.svelte'
	import { LAYOUT_DEPENDENCY } from '$lib/composer/editor-bridge.js'
	import type { ComposerLayout } from '$lib/composer/helpers.js'

	// This file was 0 bytes: the loader fetched the collection and the route answered 200 with an
	// empty document. Render what wwwCollectionsSlugLoad already returns ({ collection, allratings }).
	const collection = $derived(page.data?.collection)
	const products = $derived((collection?.collectionvalues || []).map((value: any) => value?.products).filter(Boolean))
	// The shop's collection page template (GoCommerce D128): its sections around this page's heading
	// and grid. Null draws the page exactly as before.
	const template = $derived((page.data?.layout as ComposerLayout | null | undefined) ?? null)
	// A preview opened here keeps its key for the tab, so the next collection opened is drawn in the
	// draft too (see rememberPreview).
	if (browser) {
		untrack(() => page.data?.previewKey && rememberPreview('collection', page.data.previewKey, page.data.editorOrigin ?? null))
	}
	const [aspectWidth, aspectHeight] = $derived(page.data?.store?.productImageAspectRatio?.split(':') || ['1', '1'])
</script>

<!-- An empty collection is a thin page; it stays out of the index until it has products. -->
<SeoHeader
	metaTitle={collection?.title || collection?.name || 'Collection'}
	metaDescription={collection?.subTitle || collection?.description}
	image={collection?.img || collection?.images?.[0]}
	noindex={!products.length}
/>

<!-- A template's draft seen through a preview key is for the merchant, never for a search engine. -->
<svelte:head>
	{#if template?.preview}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>

{#if template}
	<PageComposer
		layout={template}
		page="collection"
		parts={{ 'main-collection': core }}
		aspectRatio="{aspectWidth} / {aspectHeight}"
		editorOrigin={page.data?.editorOrigin ?? null}
		onsaved={() => invalidate(LAYOUT_DEPENDENCY)}
	/>
{:else}
	{@render core()}
{/if}

<!-- The page's core: its heading and grid. Alone it fills the screen as it always has; among a
     template's sections it is as tall as its products. -->
{#snippet core()}
<div class="container mx-auto mt-2 max-md:px-4" class:min-h-screen={!template}>
	<div class="mb-6 flex flex-col items-start gap-2">
		<h1 class="text-2xl font-bold">{collection?.title || collection?.name}</h1>
		{#if collection?.subTitle}
			<p class="text-sm text-muted-foreground">{collection.subTitle}</p>
		{/if}
		<span class="text-sm text-muted-foreground">{products.length} {products.length === 1 ? 'Product' : 'Products'}</span>
	</div>

	{#if collection?.description}
		<p class="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">{collection.description}</p>
	{/if}

	{#if !products.length}
		<div class="flex h-96 items-center justify-center">
			<p class="text-sm text-muted-foreground">No products in this collection yet.</p>
		</div>
	{:else}
		<ul class="product-grid grid grid-cols-2 gap-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
			{#each products as product, i}
				<li>
					<ProductCard {product} priority={i < 4} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
{/snippet}
