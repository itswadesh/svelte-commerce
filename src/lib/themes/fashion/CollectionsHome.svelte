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
import { applyAction, enhance } from '$app/forms'
import { currency } from '$lib/utils'
import { fireGTagEvent } from '$lib/utils/gTagB'
import { fly } from 'svelte/transition'
import { goto } from '$app/navigation'
import { LazyImg } from '$lib/components'
import { onMount } from 'svelte'
import { PrimaryButton, WhiteButton } from '$lib/ui'
import { updateCartStore } from '$lib/store/cart'
import { browser } from '$app/environment'
import { storeStore } from '$lib/store/store'
import * as Carousel from '$lib/shad-components/ui/carousel/index'

export let data = {}

let bounceItemFromTop = false
let cartButtonText = 'Add to Bag'
let customizedImg
let selectedLinkiedProducts = []
let selectedOptions1 = []

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
})
</script>

<svelte:window bind:innerWidth />

{#await data?.streamed?.collections then collections}
	{#if collections?.count}
		<div class="divide-y border-b">
			{#each collections?.data as collection, cx}
				{#if collection?.block === 'block-1'}
					<div
						in:fly="{{ y: 20, duration: 700, delay: 100 * cx }}"
						class="px-3 py-10 sm:px-10 sm:py-20">
						<div class="container mx-auto max-w-screen-2xl flex flex-col gap-10 sm:gap-20">
							<a
								href="/search?collections={collection._id || collection.id}"
								class="text-center uppercase text-lg font-medium tracking-wider sm:text-xl">
								{collection.name || 'New'}
							</a>

							{#if collection?.products?.length}
								<Carousel.Root
									opts="{{
										align: 'start',
										loop: true
									}}">
									<Carousel.Content class="-ml-5">
										{#each collection?.products as product, ix}
											{#if product.img || product.images[0]}
												<Carousel.Item class="basis-auto">
													<div class="relative w-full">
														<div
															class="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 items-start sm:gap-10 md:gap-20">
															<!-- Banner section -->

															<a
																href="{product.link || `/product/${product.slug}`}"
																aria-label="Click to visit banner related products page"
																class="block col-span-1"
																data-sveltekit-preload-data>
																<LazyImg
																	src="{product.img || product.images[0]}"
																	alt="{product.name}"
																	height="533"
																	aspect_ratio="3:4"
																	class="object-contain object-bottom text-xs" />
															</a>

															<!-- Details section -->

															<div class="col-span-1 flex flex-col gap-5">
																<a
																	href="{product.link || `/product/${product.slug}`}"
																	aria-label="Click to visit banner related products page"
																	class="block text-xl"
																	data-sveltekit-preload-data>
																	{product.name}
																</a>

																<span class="text-xl text-zinc-500">
																	{currency(product.price, store?.currencySymbol)}
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
																					updateCartStore({ data: result.data })
																					setTimeout(() => {
																						bounceItemFromTop = false
																						cartButtonText = 'Add to Bag'
																					}, 3000)
																					cartButtonText = 'Go to Cart'
																					if (customizedImg) {
																						goto(`/checkout/address`)
																					}
																					// await applyAction(result)
																				}
																			}}">
																			<input
																				type="hidden"
																				name="pid"
																				value="{product?._id || product?.id || null}" />
																			<input
																				type="hidden"
																				name="vid"
																				value="{product?._id || product?.id || null}" />

																			<input
																				type="hidden"
																				name="linkedItems"
																				value="{JSON.stringify(selectedLinkiedProducts) || null}" />

																			<input type="hidden" name="qty" value="{1}" />

																			<input
																				type="hidden"
																				name="options"
																				value="{JSON.stringify(selectedOptions1) || null}" />

																			<input
																				type="hidden"
																				name="customizedImg"
																				value="{customizedImg || null}" />

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
																				updateCartStore({ data: result.data })
																				goto(`/checkout/address`)
																				await applyAction(result)
																			}
																		}}">
																		<input
																			type="hidden"
																			name="pid"
																			value="{product?._id || product?.id || null}" />
																		<input
																			type="hidden"
																			name="vid"
																			value="{product?._id || product?.id || null}" />

																		<input
																			type="hidden"
																			name="linkedItems"
																			value="{JSON.stringify(selectedLinkiedProducts) || null}" />

																		<input type="hidden" name="qty" value="{1}" />

																		<input
																			type="hidden"
																			name="options"
																			value="{JSON.stringify(selectedOptions1) || null}" />

																		<input
																			type="hidden"
																			name="customizedImg"
																			value="{customizedImg || null}" />

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
													</div>
												</Carousel.Item>
											{/if}
										{/each}
									</Carousel.Content>
									<Carousel.Previous />
									<Carousel.Next />
								</Carousel.Root>
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
{/await}
