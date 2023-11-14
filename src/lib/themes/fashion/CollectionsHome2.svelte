<style>
.link-underline {
	border-bottom-width: 0;
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(249 250 251), rgb(249 250 251));
	background-size: 0 1px;
	background-position: 0 100%;
	background-size: 100% 1px;
	background-repeat: no-repeat;
	transition: background-size 0.5s ease-in-out;
}

.link-underline-gray {
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(107 114 128), rgb(107 114 128));
}

.link-underline:hover {
	background-size: 0% 1px;
	background-position: 0 100%;
}
</style>

<script>
import { currency } from '$lib/utils'
import { fly } from 'svelte/transition'
import { LazyImg } from '$lib/components'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { PrimaryButton } from '$lib/ui'
import { SplideSlide } from '@splidejs/svelte-splide'
import { browser } from '$app/environment'
import { storeStore } from '$lib/store/store'

export let data = {}

let Splide

$: innerWidth = 0
let responsiveWidth = 0

$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 80
} else {
	responsiveWidth = innerWidth - 24
}
let store = {}
onMount(async () => {
	if (browser) {
		storeStore.subscribe((value) => (store = value))
	}
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

<svelte:window bind:innerWidth="{innerWidth}" />

{#await data?.streamed?.collections then collections}
	{#if collections?.count > 0}
		<div class="divide-y border-b">
			{#each collections?.data as collection, cx}
				{#if collection.block === 'block-2'}
					<div
						in:fly="{{ y: 20, duration: 700, delay: 100 * cx }}"
						class="px-3 py-10 sm:px-10 sm:py-20">
						<div class="container mx-auto max-w-screen-2xl flex flex-col gap-10 sm:gap-20">
							<a
								href="/search?collections={collection._id || collection.id}"
								class="text-center uppercase flex flex-col gap-5">
								<p class="text-xs tracking-widest">Shop</p>

								<h2 class="text-center uppercase text-lg font-medium tracking-wider sm:text-xl">
									{collection.name || 'New'}
								</h2>
							</a>

							{#if collection?.products?.length}
								<svelte:component
									this="{Splide}"
									options="{{
										arrows: true,
										lazyLoad: true,
										pagination: false,
										perMove: 1,
										perPage: 1,
										rewind: true,
										width: responsiveWidth || '100%',
										breakpoints: {
											1536: {
												arrows: false
											}
										}
									}}">
									{#each collection?.products as product, ix}
										{#if product.img || product.images[0]}
											<SplideSlide>
												<div
													class="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 md:gap-20 items-center">
													<!-- Banner section -->

													<a
														href="{product.link || `/product/${product.slug}`}"
														aria-label="Click to visit banner related products page"
														class="hidden sm:block col-span-1"
														data-sveltekit-preload-data>
														<LazyImg
															src="{product.img || product.images[0]}"
															alt="{product.name}"
															height="533"
															aspect_ratio="3:4"
															class="object-contain object-bottom text-xs" />
													</a>

													<!-- Details section -->

													<div class="col-span-1 flex justify-center sm:justify-start">
														<div
															class="flex flex-col items-center text-center gap-5 w-full sm:max-w-[250px]">
															<LazyImg
																src="{product.img || product.images[0]}"
																alt="{product.name}"
																height="533"
																aspect_ratio="3:4"
																class="object-contain object-bottom text-xs" />

															<div>
																<a
																	href="{product.link || `/product/${product.slug}`}"
																	aria-label="Click to visit banner related products page"
																	class="block"
																	data-sveltekit-preload-data>
																	{product.name}
																</a>

																<p class="text-zinc-500">
																	{currency(product.price, store?.currencySymbol)}
																</p>
															</div>

															<PrimaryButton
																type="button"
																hideLoading
																class="w-full text-sm uppercase"
																roundedNone
																blackBackground>
																View This Product
															</PrimaryButton>
														</div>
													</div>
												</div>
											</SplideSlide>
										{/if}
									{/each}
								</svelte:component>
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
{/await}
