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
import WishlistSkeleton from './_WishlistSkeleton.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { getAPI, post } from '$lib/util/api'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { page } from '$app/stores'
import BlackButton from '$lib/ui/BlackButton.svelte'
import { gett } from '$lib/utils'

export let wishlistedProducts,
	loadingProduct = []

async function toggleWishlist(id, wx) {
	try {
		loadingProduct[wx] = true
		await post('wishlists/toggle', {
			product: id,
			variant: id
		})
		await getWishlistedProducts()
	} catch (e) {
	} finally {
		loadingProduct[wx] = false
	}
}

async function getWishlistedProducts() {
	try {
		wishlistedProducts = gett(`wishlists/my?store=${$page.data?.store?.id}`)
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
				<LazyImg
					src="/no/empty-wishlist.svg"
					alt="empty wishlist"
					height="240"
					class="mb-5 h-60 object-contain" />

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

					<div
						class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
						{#each wishlistedProducts.data as w, wx}
							{#if w.product}
								<div class="cols-span-1 relative border">
									<BlackButton
										type="button"
										class="absolute top-2 right-2 z-10"
										on:click="{() => toggleWishlist(w.product?._id, wx)}">
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
											class="w-full  max-w-xs items-center overflow-hidden rounded-lg bg-white p-4">
											<div>
												<LazyImg
													src="{w.product?.imgCdn}"
													alt="mobile"
													height="224"
													class="h-48 w-full object-contain object-center sm:h-56" />
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
													{#if $page.data?.store?.isFnb}
														<div class="ms-2">
															{#if w.product?.foodType === 'V'}
																<LazyImg
																	src="{`/product/veg.png`}"
																	alt="veg"
																	width="20"
																	height="20"
																	class="h-5 w-5" />
															{:else if w.product?.foodType === 'N' || w.product?.foodType === 'E'}
																<LazyImg
																	src="{`/product/non-veg.png`}"
																	alt="non veg"
																	width="20"
																	height="20"
																	class="h-5 w-5" />
															{:else}
																<LazyImg
																	src="{`/product/other.png`}"
																	alt="other"
																	width="20"
																	height="20"
																	class="h-5 w-5" />
															{/if}
														</div>
													{/if}
												</div>

												<div
													class="flex flex-wrap items-center justify-center overflow-hidden overflow-ellipsis whitespace-nowrap">
													<div class="mr-2">
														<b>{w.product?.formattedPrice}</b>
													</div>

													{#if w.product?.formattedMrp > w.product?.formattedPrice}
														<strike class="mr-2 text-gray-500">
															{w.product?.formattedMrp}
														</strike>
													{/if}

													{#if ((w.product?.formattedMrp - w.product?.formattedPrice) / w.product?.formattedMrp) * 100 > 0}
														<div class="text-primary-500">
															({((w.product?.formattedMrp - w.product?.formattedPrice) /
																w.product?.formattedMrp) *
																100}%)
														</div>
													{/if}
												</div>
											</div>
										</div>
									</a>

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
								</div>
							{/if}
						{/each}
					</div>
				</div>

				<!-- if there is no items in cart -->
			</div>
		{/if}
	</div>
</div>
