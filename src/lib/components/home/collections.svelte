<script lang="ts">
	import Product from '$lib/components/product-catalogue/product-card.svelte'
	import { collectionService } from '$lib/core/services'
	import { Carousel, CarouselContent, CarouselItem } from '$lib/components/ui/carousel/index.js'
	import CarouselPrevious from '$lib/components/ui/carousel/carousel-previous.svelte'
	import CarouselNext from '$lib/components/ui/carousel/carousel-next.svelte'
	import CollectionsRenderer from '$lib/core/composables/collections-renderer.svelte'
</script>

<!-- Colleciton -->
<CollectionsRenderer>
	{#snippet content({ displayProduct, collectionData })}
		{#if collectionData.length > 0}
			{#each collectionData as data, index}
				<div class="flex flex-col items-center justify-center gap-5 p-3 py-5 sm:px-10 md:py-10">
					<h2 class="text-center text-2xl font-normal">
						{data.name}
					</h2>

					<hr class="w-20 border border-zinc-800" />
				</div>
				<Carousel
					opts={{
						align: 'start',
						loop: true
					}}
					class="p-0 laptopl:w-full"
				>
					<CarouselContent class="-ml-4">
						{#each data?.collectionvalues as prod (prod?.id)}
							{#if prod?.products}
								<CarouselItem class="basis-full pl-4 mobiles:basis-[40%] mobilem:basis-[42%] tablet:basis-[30%] laptopl:basis-1/4">
									<Product
										product={{
											id: prod?.products.id,
											slug: prod?.products.slug,
											thumbnail: prod?.products.thumbnail,
											price: prod?.products.price,
											mrp: prod?.products.mrp,
											title: prod?.products.title,
											vendor: prod?.products.vendor,
											tag: prod?.products.tag,
											variants: prod?.products.variants
										}}
										aspectRatio="square"
										{displayProduct}
									/>
								</CarouselItem>
							{/if}
						{/each}
					</CarouselContent>

					<div class="absolute left-2 top-1/3 z-30 hidden -translate-y-1/2 translate-x-10 transform laptop:flex">
						<CarouselPrevious class="rounded-full bg-white p-2 text-black shadow-md hover:bg-gray-100" />
					</div>

					<div class="absolute right-2 top-1/3 z-30 hidden -translate-x-10 -translate-y-1/2 transform laptop:flex">
						<CarouselNext class="rounded-full bg-white p-2 text-black shadow-md hover:bg-gray-100" />
					</div>
				</Carousel>
			{/each}
		{/if}
	{/snippet}
</CollectionsRenderer>
