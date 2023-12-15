<script>
import { fly } from 'svelte/transition'
import { LazyImg, ProductCard } from '$lib/components'
import { onMount } from 'svelte'
import { SplideSlide } from '@splidejs/svelte-splide'

export let collections = []
// console.log('collections', collections)

let Splide
$: innerWidth = 0
let responsiveWidth = 0
$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 17
}

onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
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
						<svelte:component
							this="{Splide}"
							options="{{
								// autoplay: true,
								autoWidth: true,
								gap: '12px',
								lazyLoad: true,
								padding: '40px',
								pagination: false,
								perMove: 1,
								// type: 'loop',
								width: responsiveWidth || '100%'
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
				</li>
			{/if}
		{/each}
	</ul>
{/if}
