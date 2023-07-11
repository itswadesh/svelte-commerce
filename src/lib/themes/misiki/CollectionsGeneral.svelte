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
	<div class="flex flex-wrap w-[98vw] items-start justify-start gap-3 overflow-x-auto">
		{#each { length: 8 } as _}
			<div class="w-52 h-60 animate-pulse rounded bg-zinc-200"></div>
		{/each}
	</div>
{:then collections}
	{#if collections.data?.length > 0}
		{#each collections.data as collection}
			<div class="mb-5 sm:mb-10">
				<h2
					class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
					{collection.name}
				</h2>

				{#if collection}
					<div class="hidden px-10 items-start justify-start gap-3 sm:flex w-[99vw]">
						<svelte:component
							this="{Splide}"
							options="{{
								autoWidth: true,
								gap: '24px',
								height: '100%',
								width: '100%',
								pagination: false,
								perMove: 1
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
									<li class="max-w-[210px]">
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
