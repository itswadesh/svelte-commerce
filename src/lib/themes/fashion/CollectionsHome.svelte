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
import { goto } from '$app/navigation'

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
			{#if collection.block === 'block-1'}
				{#if collection.name}
					<h2
						class="p-3 py-5 sm:px-10 md:py-10 text-center uppercase text-xl font-medium tracking-wider sm:text-2xl md:text-2xl">
						{collection.name}
					</h2>
				{/if}

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
												class="grid grid-cols-1 sm:grid-cols-5 gap-5 items-start sm:gap-10 md:gap-20">
												<!-- Banner section -->

												<a
													href="{product.link || `/product/${product.slug}`}"
													aria-label="Click to visit banner related products page"
													class="block col-span-1 sm:col-span-2"
													data-sveltekit-preload-data>
													<LazyImg
														src="{product.img}"
														alt="{product.name}"
														height="533"
														aspect_ratio="3:4"
														class="object-contain object-bottom text-xs" />
												</a>

												<!-- Details section -->

												<div class="col-span-1 sm:col-span-3 flex flex-col gap-5">
													<a
														href="{product.link || `/product/${product.slug}`}"
														aria-label="Click to visit banner related products page"
														class="block text-xl"
														data-sveltekit-preload-data>
														{product.name}
													</a>

													<span class="text-xl text-zinc-500">
														{currency(product.price, $page.data?.store?.currencySymbol)}
													</span>

													<hr />

													{#if product?.active && product?.hasStock}
														{#if cartButtonText === 'Go to Cart'}
															<a class="block" href="/cart" data-sveltekit-preload-data>
																<PrimaryButton
																	type="button"
																	hideLoading
																	class="w-full text-sm"
																	blackBackground>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		class="h-5 w-5 shrink-0"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke="currentColor"
																		stroke-width="2">
																		<path
																			stroke-linecap="round"
																			stroke-linejoin="round"
																			d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z">
																		</path>
																	</svg>

																	<span>
																		{cartButtonText}
																	</span>
																</PrimaryButton>
															</a>
														{:else}
															<form
																action="/cart?/add"
																method="POST"
																use:enhance="{() => {
																	return async ({ result }) => {
																		result?.data?.qty < 0
																			? fireGTagEvent('remove_from_cart', result?.data)
																			: fireGTagEvent('add_to_cart', result?.data)
																		cartButtonText = 'Added To Cart'
																		bounceItemFromTop = true
																		setTimeout(() => {
																			bounceItemFromTop = false
																			cartButtonText = 'Add to Bag'
																		}, 3000)
																		cartButtonText = 'Go to Cart'
																		if (customizedImg) {
																			goto(`/checkout/address`)
																		}
																		await applyAction(result)
																	}
																}}">
																<input
																	type="hidden"
																	name="pid"
																	value="{product?._id || product?.id}" />
																<input
																	type="hidden"
																	name="vid"
																	value="{product?._id || product?.id}" />

																<input
																	type="hidden"
																	name="linkedItems"
																	value="{JSON.stringify(selectedLinkiedProducts)}" />

																<input type="hidden" name="qty" value="{1}" />

																<input
																	type="hidden"
																	name="options"
																	value="{JSON.stringify(selectedOptions1)}" />

																<input type="hidden" name="customizedImg" value="{customizedImg}" />

																<WhiteButton
																	type="submit"
																	loadingringsize="sm"
																	class="w-full text-sm uppercase">
																	<span>
																		{cartButtonText}
																	</span>
																</WhiteButton>
															</form>
														{/if}

														<form
															action="/cart?/add"
															method="POST"
															use:enhance="{() => {
																return async ({ result }) => {
																	result?.data?.qty < 0
																		? fireGTagEvent('remove_from_cart', result?.data)
																		: fireGTagEvent('add_to_cart', result?.data)
																	goto(`/checkout/address`)
																	await applyAction(result)
																}
															}}">
															<input
																type="hidden"
																name="pid"
																value="{product?._id || product?.id}" />
															<input
																type="hidden"
																name="vid"
																value="{product?._id || product?.id}" />

															<input
																type="hidden"
																name="linkedItems"
																value="{JSON.stringify(selectedLinkiedProducts)}" />

															<input type="hidden" name="qty" value="{1}" />

															<input
																type="hidden"
																name="options"
																value="{JSON.stringify(selectedOptions1)}" />

															<input type="hidden" name="customizedImg" value="{customizedImg}" />

															<PrimaryButton
																type="submit"
																loadingringsize="sm"
																class="w-full text-sm uppercase">
																<span> Bye it Now </span>
															</PrimaryButton>
														</form>
													{:else}
														<PrimaryButton
															type="button"
															hideLoading
															class="w-full text-sm"
															disabled>
															Item Unavailable
														</PrimaryButton>
													{/if}

													<a
														href="{product.link || `/product/${product.slug}`}"
														aria-label="Click to visit banner related products page"
														class="block text-sm link-underline link-underline-gray max-w-max"
														data-sveltekit-preload-data>
														View product details
													</a>
												</div>
											</div>
										</SplideSlide>
									{/if}
								{/each}
							</svelte:component>
						</div>
					</div>
				{/if}
			{/if}
		{/each}
	{/if}
{/await}
