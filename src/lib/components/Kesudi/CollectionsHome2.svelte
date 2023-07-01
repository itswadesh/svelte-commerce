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
import { LazyImg } from '$lib/components'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { SplideSlide } from '@splidejs/svelte-splide'
import { PrimaryButton, WhiteButton } from '$lib/ui'
import { applyAction, enhance } from '$app/forms'
import { fireGTagEvent } from '$lib/utils/gTagB'
import { goto, invalidateAll } from '$app/navigation'

export let data = {}
// console.log('zzzzzzzzzzzzzzzzzz', data)

let bounceItemFromTop = false
let cartButtonText = 'Add to Bag'
let customizedImg
let selectedLinkiedProducts = []
let selectedOptions1 = []
let Splide

$: innerWidth = 0
let responsiveWidth = 0

$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 80
} else {
	responsiveWidth = innerWidth - 24
}

onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

<svelte:window bind:innerWidth="{innerWidth}" />

{#await data.streamed.collections then collections}
	{#if collections?.count}
		{#each collections.data as collection}
			<div class="p-3 py-5 sm:px-10 md:py-10 text-center uppercase flex flex-col gap-2">
				<p class="text-sm tracking-widest">Shop</p>

				{#if collection.name}
					<h2 class="text-xl font-medium tracking-wider sm:text-2xl md:text-2xl">
						{collection.name}
					</h2>
				{/if}
			</div>

			{#if collection?.products?.length}
				<div class="px-3 py-10 sm:px-10">
					<div class="container mx-auto max-w-6xl">
						<svelte:component
							this="{Splide}"
							options="{{
								rewind: true,
								lazyLoad: true,
								perPage: 1,
								perMove: 1,
								pagination: false,
								width: responsiveWidth || '100%'
							}}">
							{#each collection?.products as product, ix}
								{#if product.img}
									<SplideSlide>
										<div
											class="grid grid-cols-1 sm:grid-cols-5 gap-5 items-center sm:gap-10 md:gap-20">
											<!-- Banner section -->

											<a
												href="{product.link || `/product/${product.slug}`}"
												aria-label="Click to visit banner related products page"
												class="hidden sm:block col-span-1 sm:col-span-2"
												data-sveltekit-preload-data>
												<LazyImg
													src="{product.img}"
													alt="{product.name}"
													width="400"
													height="533"
													aspect_ratio="3:4"
													class="object-cover object-bottom text-xs" />
											</a>

											<!-- Details section -->

											<div class="col-span-1 sm:col-span-3 flex justify-center sm:justify-start">
												<div class="flex flex-col items-center text-center gap-5 max-w-[250px]">
													<LazyImg
														src="{product.img}"
														alt="{product.name}"
														width="400"
														height="533"
														aspect_ratio="3:4"
														class="object-cover object-bottom text-xs" />

													<div>
														<a
															href="{product.link || `/product/${product.slug}`}"
															aria-label="Click to visit banner related products page"
															class="block"
															data-sveltekit-preload-data>
															{product.name}
														</a>

														<p class="text-zinc-500">
															{currency(product.price, $page.data?.store?.currencySymbol)}
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
					</div>
				</div>
			{/if}
		{/each}
	{/if}
{/await}
