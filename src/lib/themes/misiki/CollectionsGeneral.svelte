<script>
import { fly } from 'svelte/transition'
import { ProductCard } from '$lib/components'
import * as Carousel from '$lib/shad-components/ui/carousel/index'

export let collections = []

$: innerWidth = 0
let responsiveWidth = 0
$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 17
}
</script>

<svelte:window bind:innerWidth />

{#if collections.length}
	<ul class="mb-5 sm:mb-10 p-0 list-none flex flex-col gap-5 sm:gap-10">
		{#each collections as collection, cx}
			{#if collection && collection.products?.length}
				<li in:fly="{{ y: 20, duration: 700, delay: 100 * cx }}">
					<h2 class="p-3 py-5 text-center uppercase sm:px-10 md:py-10">
						{collection.name}
					</h2>

					<div class="hidden sm:block">
						<Carousel.Root
							opts="{{
								align: 'start',
								loop: true
							}}">
							<Carousel.Content class="-ml-5">
								{#each collection.products as p}
									{#if p}
										<Carousel.Item class="basis-auto">
											<div class="relative w-full">
												<ProductCard product="{p}" />
											</div>
										</Carousel.Item>
									{/if}
								{/each}
							</Carousel.Content>
							<Carousel.Previous />
							<Carousel.Next />
						</Carousel.Root>
					</div>

					<div
						class="flex w-[98vw] items-start justify-start gap-3 overflow-x-auto sm:hidden scrollbar-none">
						<ul class="flex w-full list-none items-start gap-2">
							{#each collection.products as p, px}
								{#if p}
									<li class="w-[210px] shrink-0">
										<ProductCard product="{p}" />
									</li>
								{/if}
							{/each}
						</ul>
					</div>
				</li>
			{/if}
		{/each}
	</ul>
{/if}
