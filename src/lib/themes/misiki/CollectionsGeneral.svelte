<script>
import { LazyImg, ProductCard } from '$lib/components'
import { onMount } from 'svelte'
import { SplideSlide } from '@splidejs/svelte-splide'

export let data = {}

let Carousel, Splide

onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

{#await data.streamed.collections}
	<div class="flex w-[98vw] items-start justify-start gap-3 overflow-x-auto">
		<div class="w-60 h-60 animate-pulse rounded bg-zinc-200">
			{#each { length: 10 } as _}
				<div class="w-52 h-60 animate-pulse rounded bg-zinc-200"></div>
			{/each}
		</div>
	</div>
{:then collections}
	{#if collections.data?.length > 0}
		{#each collections.data as collection}
			<div class="mb-5 sm:mb-10">
				<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
					{collection.name}
				</h2>

				{#if collection}
					<div class="hidden px-10 sm:block w-[99vw]">
						<svelte:component
							this="{Splide}"
							options="{{
								gap: '24px',
								lazyLoad: true,
								pagination: false,
								perMove: 1,
								perPage: 7,
								rewind: true,
								breakpoints: {
									1693: {
										arrows: collection.products?.length <= 6 ? false : true,
										perPage: 6
									},
									1459: {
										arrows: collection.products?.length <= 5 ? false : true,
										perPage: 5
									},
									1225: {
										arrows: collection.products?.length <= 4 ? false : true,
										perPage: 4
									},
									955: {
										arrows: collection.products?.length <= 3 ? false : true,
										perPage: 3
									},
									733: {
										arrows: collection.products?.length <= 2 ? false : true,
										perPage: 2
									}
								}
							}}">
							{#each collection.products as p}
								{#if p}
									<SplideSlide>
										<ProductCard product="{p}" />
									</SplideSlide>
								{/if}
							{/each}
						</svelte:component>
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
				{/if}
			</div>
		{/each}
	{/if}
{/await}
