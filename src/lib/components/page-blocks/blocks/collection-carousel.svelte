<script lang="ts">
	import Product from '$lib/components/product-catalogue/product-card.svelte'
	import { Carousel, CarouselContent, CarouselItem } from '$lib/components/ui/carousel/index.js'
	import CarouselPrevious from '$lib/components/ui/carousel/carousel-previous.svelte'
	import CarouselNext from '$lib/components/ui/carousel/carousel-next.svelte'
	import { getCollectionState } from '$lib/core/stores/collection.svelte.js'
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'

	const { block } = $props()

	const collectionState = getCollectionState()
	const collection = $derived(collectionState.getOneById(block.entityId))

	const flexBasis = $derived.by(() => {
		const x = 1 / (block.metadata.viewCount || 6)
		return x * 100
	})
</script>

<div class="w-full">
	{#if !collection || collectionState.loading}
		<Skeleton />
	{:else}
		<div class="mx-auto w-full">
			{#if block.metadata.showHeader}
				<div class="mb-6 text-center md:text-left">
					{#if collection.name}
						<h2 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{collection.name}</h2>
						<div class="mx-auto mt-2 h-1 w-12 bg-primary md:mx-0"></div>
					{/if}
					{#if collection.subTitle}
						<p class="mt-4 text-sm font-medium text-muted-foreground">{collection.subTitle}</p>
					{/if}
				</div>
			{/if}

			<div class="relative">
				<Carousel
					opts={{
						align: 'start',
						loop: true
					}}
					class="w-full"
				>
					<CarouselContent class="-ml-1">
						{#each collection?.collectionvalues as prod (prod?.id)}
							{#if prod?.products}
								<CarouselItem class="pl-1" style="flex-basis: {flexBasis}%;">
									<div class="h-full">
										<Product hideCartControls={!block.metadata.showCartControls} product={prod.products} />
									</div>
								</CarouselItem>
							{/if}
						{/each}
					</CarouselContent>

					<div class="absolute -right-2 -top-20 hidden items-center gap-2 md:flex">
						<CarouselPrevious class="static translate-y-0" />
						<CarouselNext class="static translate-y-0" />
					</div>
				</Carousel>
			</div>
		</div>
	{/if}
</div>
