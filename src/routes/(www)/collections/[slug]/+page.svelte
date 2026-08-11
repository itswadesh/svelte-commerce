<script lang="ts">
	import { page } from '$app/state'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'

	// This file was 0 bytes: the loader fetched the collection and the route answered 200 with an
	// empty document. Render what wwwCollectionsSlugLoad already returns ({ collection, allratings }).
	const collection = $derived(page.data?.collection)
	const products = $derived((collection?.collectionvalues || []).map((value: any) => value?.products).filter(Boolean))
</script>

<SeoHeader
	metaTitle={collection?.title || collection?.name || 'Collection'}
	metaDescription={collection?.subTitle || collection?.description}
	image={collection?.img || collection?.images?.[0]}
/>

<div class="container mx-auto mt-2 min-h-screen max-md:px-4">
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
		<ul class="grid grid-cols-2 gap-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
			{#each products as product, i}
				<li>
					<ProductCard {product} priority={i < 4} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
