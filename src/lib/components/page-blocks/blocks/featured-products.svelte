<script lang="ts">
	import { productService, type Product } from '$lib/core/services/index.js'
	import { onMount } from 'svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import { Button } from '$lib/components/ui/button'
	import { toast } from '@misiki/kitcommerce-core'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'

	type FeaturedProductsBlock = {
		metadata: {
			columnCount?: number
			redirectsTo?: string
			showCartControls?: boolean
			showHeader?: boolean
			showViewMore?: boolean
			subtitle?: string
			title?: string
			viewMoreText?: string
		}
	}

	const { block }: { block: FeaturedProductsBlock } = $props()

	let products = $state<Product[]>([])
	let loadingForProducts = $state(false)

	onMount(async () => {
		try {
			loadingForProducts = true
			const res = await productService.listFeaturedProducts({
				page: 1
			})
			products = (res?.data ?? []).flat() as Product[]
		} catch (e) {
			toast.error(e instanceof Error ? e.message : 'Failed to load products')
		} finally {
			loadingForProducts = false
		}
	})
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
				<Button href={block.metadata.redirectsTo || "/products"} class="group">
					{block.metadata.viewMoreText}
					<svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</Button>
			{/if}
		</div>
	{/if}

	<div class="intra-gap grid" style="grid-template-columns: repeat({block.metadata.columnCount || 5}, 1fr);">
		{#if loadingForProducts}
			{#each Array(12) as _}
				<div class="space-y-4">
					<Skeleton class="aspect-square w-full rounded-2xl" />
					<div class="space-y-2">
						<Skeleton class="h-4 w-3/4" />
						<Skeleton class="h-4 w-1/2" />
					</div>
				</div>
			{/each}
		{:else}
			{#each products as p}
				<ProductCard product={p} hideVariations={true} hideCartControls={!block.metadata.showCartControls} />
			{/each}
		{/if}
	</div>
</div>
