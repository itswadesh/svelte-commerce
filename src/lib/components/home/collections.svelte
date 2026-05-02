<script lang="ts">
	import Product from '$lib/components/product-catalogue/product-card2.svelte'
	import { collectionService } from '$lib/core/services/index.js'
	import { Carousel, CarouselContent, CarouselItem } from '$lib/components/ui/carousel/index.js'
	import CarouselPrevious from '$lib/components/ui/carousel/carousel-previous.svelte'
	import CarouselNext from '$lib/components/ui/carousel/carousel-next.svelte'
	import { CollectionsRenderer } from '$lib/core/composables/index.js'
</script>

<!-- Collection -->
<CollectionsRenderer>
	{#snippet content({ displayProduct, collectionData })}
		{#if collectionData.length > 0}
			{#each collectionData as data, index}
				<div class="py-10 {index % 2 === 1 ? 'bg-muted/30' : ''}">
					<div class="container mx-auto px-4">
						<div class="mb-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
							<div class="text-left">
								<h2 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
									{data.name}
								</h2>
								<div class="mt-2 h-1 w-12 bg-primary"></div>
								<p class="mt-4 text-sm font-medium text-muted-foreground">
									Explore our handpicked selection of {data.name.toLowerCase()}
								</p>
							</div>

							<!-- <div class="hidden items-center gap-2 md:flex">
								<a
									href="/products"
									class="mr-4 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
								>
									View collection
								</a>
							</div> -->
						</div>

						<div class="relative">
							<Carousel
								opts={{
									align: 'start',
									loop: true
								}}
								class="w-full"
							>
								<CarouselContent class="-ml-1">
									{#each data?.collectionvalues as prod (prod?.id)}
										{#if prod?.products}
											<CarouselItem
												class="basis-full pl-1 mobiles:basis-[48%] sm:basis-[33%] md:basis-[25%] lg:basis-[20%] xl:basis-1/6"
											>
												<div class="h-full">
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
												</div>
											</CarouselItem>
										{/if}
									{/each}
								</CarouselContent>

								<div class="absolute -right-2 -top-20 hidden items-center gap-2 md:flex">
									<CarouselPrevious
										class="static h-10 w-10 translate-y-0 rounded-full border-muted bg-background shadow-sm hover:bg-primary hover:text-primary-foreground"
									/>
									<CarouselNext
										class="static h-10 w-10 translate-y-0 rounded-full border-muted bg-background shadow-sm hover:bg-primary hover:text-primary-foreground"
									/>
								</div>
							</Carousel>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	{/snippet}
</CollectionsRenderer>
