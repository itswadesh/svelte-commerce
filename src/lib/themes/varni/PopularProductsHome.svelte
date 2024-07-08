<script>
import { ProductCard } from '$lib/components'
import * as Carousel from '$lib/shad-components/ui/carousel/index'

export let data

$: innerWidth = 0
let responsivePadding

$: if (innerWidth <= 1280) {
	responsivePadding = 24
} else {
	responsivePadding = 80
}
</script>

<svelte:window bind:innerWidth />

<!-- Popular products -->

{#await data.streamed.home then home}
	{#if home?.popular?.length > 0}
		{#if home?.popular?.length > 0}
			<div class="mb-5 sm:mb-10 px-3 xl:px-10">
				<div class="w-full xl:mx-auto xl:max-w-6xl">
					<div class="mb-5 py-3 border-b-2 flex items-center justify-between gap-5">
						<h1 class="text-xl font-bold tracking-wider uppercase">Popular</h1>

						<a
							href="/search?q="
							target="_blank"
							rel="noopener noreferrer"
							class="block max-w-max hover:underline text-sm">
							View All
						</a>
					</div>

					<Carousel.Root
						opts="{{
							align: 'start',
							loop: true
						}}">
						<Carousel.Content class="-ml-5">
							{#each home?.popular as p, ix}
								{#if p}
									<Carousel.Item class="basis-auto">
										<div class="relative w-full">
											<div class="flex justify-center">
												<ProductCard product="{p}" />
											</div>
										</div>
									</Carousel.Item>
								{/if}
							{/each}
						</Carousel.Content>
						<Carousel.Previous />
						<Carousel.Next />
					</Carousel.Root>
					<!-- <svelte:component
						this="{Splide}"
						options="{{
							type: 'loop',
							rewind: true,
							perPage: 5,
							perMove: 5,
							keyboard: true,
							arrows: true,
							width: innerWidth - responsivePadding,
							breakpoints: {
								1024: {
									perPage: 4,
									perMove: 4,
									keyboard: false,
									arrows: false
								},
								768: {
									perPage: 3,
									perMove: 3,
									keyboard: false,
									arrows: false
								},
								640: {
									perPage: 2,
									perMove: 2,
									gap: '0em',
									keyboard: false,
									arrows: false
								}
							}
						}}">
					</svelte:component> -->
				</div>
			</div>
		{/if}
	{/if}
{/await}
