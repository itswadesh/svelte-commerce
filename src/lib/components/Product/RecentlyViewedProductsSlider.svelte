<script lang="ts">
import { currency } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { SplideSlide } from '@splidejs/svelte-splide'
import LazyImg from '../Image/LazyImg.svelte'
import { browser } from '$app/environment'
// import { storeStore } from '$lib/store/store'

export let products = []
export let title = ''

$: innerWidth = 0
let responsiveWidth = 0

$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 97
} else {
	responsiveWidth = innerWidth - 25
}

let Splide

$: store = $page.data?.store

onMount(async () => {
	// if (browser) {
	// 	storeStore.subscribe((value) => (store = value))
	// }
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

<svelte:window bind:innerWidth />

{#if products}
	<div class="mb-5 sm:mb-10">
		<div class="mb-3 bg-white py-2">
			<h2 class="font-bold capitalize sm:text-lg max-w-max">
				{title}
			</h2>
		</div>

		<svelte:component
			this="{Splide}"
			options="{{
				arrows: products.length > 7 ? true : false,
				autoWidth: true,
				gap: '6px',
				pagination: false,
				perMove: 1,
				width: responsiveWidth || '100%'
			}}">
			{#each products as p, px}
				<SplideSlide>
					{#if p.slug && p.img && p.price && px + 1 != products?.length}
						<a
							href="/product/{p.slug}"
							aria-label="Click to view the product details"
							data-sveltekit-preload-data
							class="flex flex-col items-center w-48 shrink-0">
							{#if p.new || p.tags?.length}
								<div class="absolute top-1 left-1 flex flex-col gap-0.5">
									{#if p.new}
										<div
											class="text-rem max-w-max bg-red-500 py-0.5 px-1.5 text-xs font-semibold uppercase text-white">
											New
										</div>
									{/if}

									{#if p.tags?.length}
										{#each p.tags as tag}
											{#if tag?.name && tag?.type === 'Ribbon'}
												<div
													class="text-rem max-w-max py-0.5 px-1.5 text-xs font-semibold uppercase text-white"
													style="background-color: {tag.colorCode};">
													{tag.name}
												</div>
											{/if}
										{/each}
									{/if}
								</div>
							{/if}

							<LazyImg
								src="{p.img}"
								alt="{p.name}"
								height="192"
								aspect_ratio="1:1"
								class="h-48 w-48 object-contain object-bottom" />

							<div
								class="p-2 flex flex-wrap items-baseline justify-start leading-4 text-xs gap-1.5">
								<span class="font-bold text-sm whitespace-nowrap">
									{currency(p.price, store?.currencySymbol)}
								</span>

								{#if p.mrp > p.price}
									<span class="text-zinc-500 line-through whitespace-nowrap">
										{currency(p.mrp, store?.currencySymbol)}
									</span>

									{#if Math.floor(((p.mrp - p.price) / p.mrp) * 100) > 0}
										<span class="text-orange-500 sm:text-zinc-800 whitespace-nowrap">
											({Math.floor(((p.mrp - p.price) / p.mrp) * 100)}% off)
										</span>
									{/if}
								{/if}
							</div>
						</a>
					{/if}
				</SplideSlide>
			{/each}
		</svelte:component>
	</div>
{/if}
