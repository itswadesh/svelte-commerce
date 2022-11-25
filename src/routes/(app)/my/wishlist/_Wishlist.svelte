<style>
@media (max-width: 768px) {
	.height {
		height: 55%;
	}
}

@media (min-width: 768px) {
	.height {
		height: 60%;
	}
}
</style>

<script>
import { invalidateAll } from '$app/navigation'
import { getAPI, post } from '$lib/util/api'
import { page } from '$app/stores'
import BlackButton from '$lib/ui/BlackButton.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import WishlistSkeleton from './_WishlistSkeleton.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import { applyAction, enhance } from '$app/forms'
import { fireGTagEvent } from '$lib/util/gTag'
import AnimatedCartItem from '$lib/components/AnimatedCartItem.svelte'

export let wishlistedProducts,
	loadingProduct = []

let bounceItemFromTop = false

async function removeFromWishlist(id, wx) {
	try {
		loadingProduct[wx] = true
		await post(
			'wishlists/toggle',
			{
				product: id,
				variant: id,
				store: $page.data.store?.id
			},
			$page.data.origin
		)
		await invalidateAll()
		await getWishlistedProducts()
	} catch (e) {
	} finally {
		loadingProduct[wx] = false
	}
}

async function getWishlistedProducts() {
	try {
		wishlistedProducts = getAPI(`wishlists/my?store=${$page.data?.store?.id}`, $page.data.origin)

		await invalidateAll()
	} catch (e) {
	} finally {
	}
}
</script>

<div class="w-full text-gray-800">
	{#if wishlistedProducts?.isFetching}
		<div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
			{#each Array(10) as p, ix}
				<WishlistSkeleton />
			{/each}
		</div>
	{/if}

	<div>
		{#if wishlistedProducts?.count === 0}
			<div class="flex h-[70vh] flex-col items-center justify-center text-center">
				<img src="/no/empty-wishlist.svg" alt="empty wishlist" class="mb-5 h-60 object-contain" />

				<!-- <span class="mb-3 text-xl font-medium md:text-3xl"> Empty Wishlist !!</span> -->

				<span class="mb-5 text-sm"> You have no items in your Wishlist. Start adding</span>

				<a href="/" aria-label="Click to route home" data-sveltekit-prefetch>
					<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
				</a>
			</div>
		{:else}
			<div class="relative">
				<div>
					<h1 class="mb-5 font-serif text-2xl font-medium md:text-3xl lg:text-4xl">
						My Wishlist ({wishlistedProducts?.count || 0})
					</h1>
					{#if wishlistedProducts?.data?.length}
						<div
							class="grid w-full grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:justify-between lg:mb-20">
							{#each wishlistedProducts.data as w, wx}
								{#if w.product}
									<form
										action="/cart?/add"
										method="POST"
										use:enhance="{() => {
											return async ({ result }) => {
												result.data.qty < 0
													? fireGTagEvent('remove_from_cart', result.data)
													: fireGTagEvent('add_to_cart', result.data)
												bounceItemFromTop = true
												setTimeout(() => {
													bounceItemFromTop = false
												}, 3000)
												removeFromWishlist(w.product?._id, wx)
												invalidateAll()
												await applyAction(result)
											}
										}}"
										class="cols-span-1 relative border flex flex-col justify-between">
										<BlackButton
											type="button"
											class="absolute top-2 right-2 z-10"
											on:click="{() => removeFromWishlist(w.product?._id, wx)}">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M6 18L18 6M6 6l12 12"></path>
											</svg>
										</BlackButton>

										<a
											href="/product/{w.product?.slug}"
											aria-label="Click to view the product details">
											<div
												class="w-full sm:w-48 items-center overflow-hidden rounded-lg bg-white p-4">
												<div class="h-auto w-full">
													<LazyImg
														src="{w.product?.img}"
														alt="{w.name}"
														width="192"
														class="h-full w-full object-contain object-bottom text-xs" />
												</div>

												<div class="mx-auto p-2 text-center text-sm sm:p-4">
													{#if $page.data?.store?.isFnb && w.product?.vendor?.businessName}
														<h4 class="mb-2 font-semibold">
															{w.product?.vendor?.businessName}
														</h4>
													{:else if !$page.data?.store?.isFnb && w.product && w.product?.brand}
														<h4 class="mb-2 font-semibold">
															{w.product?.brand.name}
														</h4>
													{/if}

													<div class="mb-2 flex items-start justify-center">
														<h6 class="flex-1 truncate font-medium">
															{w.product?.name}
														</h6>

														{#if $page?.data?.store?.isFnb && w.product.foodType}
															<div>
																{#if w.product.foodType === 'veg'}
																	<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
																{:else if w.product.foodType === 'nonveg'}
																	<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
																{/if}
															</div>
														{/if}
													</div>

													<div
														class="flex flex-wrap items-center justify-center overflow-hidden overflow-ellipsis gap-2 text-xs">
														<span class="text-base font-bold whitespace-nowrap"
															>{w.product?.formattedPrice}</span>

														{#if w.product?.formattedMrp > w.product?.formattedPrice}
															<strike class="text-gray-500 whitespace-nowrap">
																{w.product?.formattedMrp}
															</strike>

															{#if Math.floor(((w.product?.mrp - w.product?.price) / w.product?.mrp) * 100) > 0}
																<span class="text-primary-500 whitespace-nowrap">
																	({Math.floor(
																		((w.product?.mrp - w.product?.price) / w.product?.mrp) * 100
																	)}% off)
																</span>
															{/if}
														{/if}
													</div>
												</div>
											</div>
										</a>

										<input type="hidden" name="pid" value="{w.product?._id}" />

										<input type="hidden" name="vid" value="{w.product?._id}" />

										<input type="hidden" name="qty" value="{1}" />

										<input
											type="hidden"
											name="options"
											value="{JSON.stringify(w.product?.options)}" />

										<input type="hidden" name="customizedImg" value="{'undefined'}" />
										<button
											type="submit"
											class="w-full p-2 text-primary-500 focus:outline-none border-t font-semibold uppercase tracking-wide hover:bg-primary-50 transition duration-300">
											Move To Bag
										</button>

										{#if loadingProduct[wx]}
											<div
												class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
												<svg
													class="mx-auto h-5 w-5 animate-spin text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24">
													<circle
														class="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														stroke-width="4"></circle>
													<path
														class="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
													</path>
												</svg>
											</div>
										{/if}
									</form>

									{#if bounceItemFromTop}
										<AnimatedCartItem img="{w.product?.img}" />
									{/if}
								{/if}
							{/each}

							{#each { length: 8 } as _}
								<div class="hidden sm:block">
									<DummyProductCard />
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- if there is no items in cart -->
			</div>
		{/if}
	</div>
</div>
