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
import { applyAction, enhance } from '$app/forms'
import { currency } from '$lib/utils'
import { fireGTagEvent } from '$lib/utils/gTag'
import { invalidateAll } from '$app/navigation'
import { LazyImg, DummyProductCard } from '$lib/components'
import { page } from '$app/stores'
import { post } from '$lib/utils/api'
import { PrimaryButton, BlackButton, WhiteButton } from '$lib/ui'
import { WishlistService } from '$lib/services'
import AnimatedCartItem from '$lib/components/AnimatedCartItem.svelte'
import noEmptyWishlist from '$lib/assets/no/empty-wishlist.svg'
import WishlistSkeleton from './_WishlistSkeleton.svelte'
import { updateCartStore } from '$lib/store/cart'

export let wishlistedProducts,
	loadingProduct = []

let bounceItemFromTop = false

async function removeFromWishlist(id, wx) {
	try {
		loadingProduct[wx] = true
		await WishlistService.toggleWishlistService({
			pid: id,
			vid: id,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})
		await invalidateAll()
		await getWishlistedProducts()
	} catch (e) {
	} finally {
		loadingProduct[wx] = false
	}
}

async function getWishlistedProducts() {
	try {
		wishlistedProducts = WishlistService.fetchWishlist({
			origin: $page?.data?.origin,
			storeId: $page?.data?.store?.id
		})
		await invalidateAll()
	} catch (e) {
	} finally {
	}
}
</script>

<div class="w-full">
	{#if wishlistedProducts?.isFetching}
		<div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
			{#each Array(10) as p, ix}
				<WishlistSkeleton />
			{/each}
		</div>
	{/if}

	{#if wishlistedProducts?.length}
		<div>
			<header class="mb-5 flex flex-wrap items-start justify-between gap-4">
				<h1>
					Wishlist {#if wishlistedProducts.length}({wishlistedProducts.length}){/if}
				</h1>

				<!--  Back button -->

				<div class="flex flex-wrap items-center gap-2">
					<a href="/my" class="block">
						<WhiteButton hideLoading class="group text-xs">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-5 w-5 transform transition duration-300 group-hover:-translate-x-2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"
								></path>
							</svg>

							<div class="flex flex-col gap-0.5 text-left">
								<span class="hidden text-xs font-normal text-zinc-500 sm:block"> Prev </span>

								<span>Dashboard</span>
							</div>
						</WhiteButton>
					</a>
				</div>
			</header>

			<div class="grid w-full grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-between lg:mb-20">
				{#each wishlistedProducts as w, wx}
					{#if w.product}
						<form
							action="/cart?/add"
							method="POST"
							use:enhance="{() => {
								return async ({ result }) => {
									updateCartStore({ data: result.data })
									result.data.qty < 0
										? fireGTagEvent('remove_from_cart', result.data)
										: fireGTagEvent('add_to_cart', result.data)
									bounceItemFromTop = true
									setTimeout(() => {
										bounceItemFromTop = false
									}, 3000)
									await removeFromWishlist(w.product?._id, wx)
									// await invalidateAll()
									await applyAction(result)
								}
							}}"
							class="cols-span-1 relative flex flex-col justify-between border overflow-hidden">
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

							<a href="/product/{w.product?.slug}" aria-label="Click to view the product details">
								<div
									class="w-full items-center overflow-hidden rounded-lg bg-white p-4 sm:w-48 flex flex-col gap-4">
									<div class="h-auto w-full">
										<LazyImg
											src="{w.product?.img}"
											alt="{w.name}"
											width="192"
											class="h-full w-full object-contain object-bottom text-xs" />
									</div>

									<div class="flex flex-col gap-2 items-center justify-center text-center">
										{#if $page.data?.store?.isFnb && w.product?.vendor?.businessName}
											<h5>
												{w.product?.vendor?.businessName}
											</h5>
										{:else if !$page.data?.store?.isFnb && w.product && w.product?.brand}
											<h5>
												{w.product?.brand.name}
											</h5>
										{/if}

										<div class="flex items-start justify-center">
											<p class="flex-1 line-clamp-2">
												{w.product?.name}
											</p>

											{#if $page?.data?.store?.isFnb && w.product?.foodType}
												<div>
													{#if w.product?.foodType === 'veg'}
														<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
													{:else if w.product?.foodType === 'nonveg'}
														<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
													{/if}
												</div>
											{/if}
										</div>

										<div
											class="flex flex-wrap items-baseline justify-center gap-1.5 text-xs leading-3">
											<span class="text-base font-bold whitespace-nowrap leading-3">
												{currency(w.product?.price, $page.data?.store?.currencySymbol)}
											</span>

											{#if w.product?.mrp > w.product?.price}
												<span class="whitespace-nowrap text-zinc-500 line-through">
													{currency(w.product?.mrp, $page.data?.store?.currencySymbol)}
												</span>

												{#if Math.floor(((w.product?.mrp - w.product?.price) / w.product?.mrp) * 100) > 0}
													<span class="whitespace-nowrap text-secondary-500">
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

							<input type="hidden" name="pid" value="{w.product?._id || null}" />

							<input type="hidden" name="vid" value="{w.product?._id || null}" />

							<input type="hidden" name="qty" value="{1}" />

							<input
								type="hidden"
								name="options"
								value="{JSON.stringify(w.product?.options) || null}" />

							<input type="hidden" name="customizedImg" value="{null}" />

							<button
								type="submit"
								class="w-full border-t p-2 font-semibold uppercase tracking-wide text-primary-500 transition duration-300 focus:outline-none hover:bg-primary-50">
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
					{:else}
						<div class="cols-span-1 sm:w-48 p-4 text-center bg-zinc-200 text-sm text-zinc-500">
							It has no product, please delete from backend
						</div>
					{/if}
				{/each}

				{#each { length: 8 } as _}
					<div class="hidden sm:block">
						<DummyProductCard />
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex h-[70vh] flex-col items-center justify-center text-center">
			<img src="{noEmptyWishlist}" alt="empty wishlist" class="mb-5 h-60 object-contain" />

			<h2 class="mb-2">Empty Wishlist!!</h2>

			<p class="mb-5">There's no wishlisted product found, start adding items.</p>

			<a href="/" aria-label="Click to visit home" data-sveltekit-preload-data>
				<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
			</a>
		</div>
	{/if}
</div>
