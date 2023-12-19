<script lang="ts">
import { applyAction, enhance } from '$app/forms'
import { browser } from '$app/environment'
import { cartLoadingStore, cartStore, getCartFromStore, updateCartStore } from '$lib/store/cart.js'
import { CartService, CouponService, ProductService, WishlistService } from '$lib/services'
import { currency, date, logger, toast } from '$lib/utils'
import { Error, LazyImg, Pricesummary, ProductCard, TrustBaggeContainer } from '$lib/components'
import { fireGTagEvent } from '$lib/utils/gTagB'
import { fly, slide } from 'svelte/transition'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { PrimaryButton, Skeleton, Textbox, WhiteButton } from '$lib/ui'
import { selectedCartItemsStore } from 'lib/store/selected-cart-items'
import { storeStore } from '$lib/store/store.js'
import Cookie from 'cookie-universal'
import dotsLoading from '$lib/assets/dots-loading.gif'
import noAddToCartAnimate from '$lib/assets/no/add-to-cart-animate.svg'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'
import SEO from '$lib/components/SEO/index.svelte'

const cookies = Cookie()

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)

let seoProps = {
	title: `Cart`,
	description: `Cart`
}

let appliedCouponInfo = {}
let checkedAllCartItems = false
let couponErr
let coupons
let loading = []
let loadingApplyCoupon = false
let loadingCoupon = false
let loadingMoveUnavailableItemsToWishlist = false
let loadingProducts = false
let loadingRemoveCoupon = false
let loadingSelectedCoupon = []
let openApplyPromoCodeModal = false
let products = []
let selectedCouponCode = null
let selectedLoadingType = null

$: cart = {}
$: isCartLoading = true
$: checkedCartItems = []
let store

onMount(async () => {
	if (browser) {
		storeStore.subscribe((value) => (store = value))

		cartStore.subscribe((value) => {
			cart = value
		})

		if (!cart?.items) {
			cart = await getCartFromStore({
				origin: $page.data.origin,
				storeId: $page.data.storeId,
				cartId: $page.data.cartId,
				forceUpdate: true
			})
		}

		cartLoadingStore.subscribe((value) => {
			isCartLoading = value
		})

		selectedCartItemsStore.subscribe((value) => {
			checkedCartItems = value
		})
	}

	getProducts()
	getCoupons()
	fireGTagEvent('view_cart', cart)

	if (cart && cart?.items && cart?.items?.length) {
		let checkedCartItemsNew = cart?.items.map((item) => {
			if (item.selected_for_checkout) {
				return item.pid
			}
		})

		checkedCartItemsNew = Array.from(checkedCartItemsNew).filter((value) => value !== undefined)

		if (checkedCartItemsNew?.length) {
			checkedCartItems = checkedCartItemsNew
		} else {
			checkedAllCartItems = true
			handleCheckedAllCartItems()
		}
	}

	if (checkedCartItems?.length === cart?.items?.length) {
		checkedAllCartItems = true
	}
})

function handleCouponCode(couponCode: string, index: number) {
	selectedCouponCode = couponCode
	applyCouponCode(selectedCouponCode, index)
}

async function applyCouponCode(selectedCouponCode: string, index: number) {
	try {
		couponErr = null
		if (index !== null) {
			loadingSelectedCoupon[index] = true
		} else {
			loadingApplyCoupon = true
		}

		const resAC = await CartService.applyCouponService({
			cartId: $page.data.cartId,
			code: selectedCouponCode,
			origin: $page.data.origin,
			storeId: $page.data.storeId
		})

		appliedCouponInfo = resAC
		// await invalidateAll()
		await getCartFromStore({
			cartId: $page.data.cartId,
			origin: $page.data.origin,
			storeId: $page.data.storeId,
			forceUpdate: true
		})
		openApplyPromoCodeModal = false
	} catch (e) {
		couponErr = e
	} finally {
		if (index !== null) {
			loadingSelectedCoupon[index] = false
		} else {
			loadingApplyCoupon = false
		}
	}
}

async function removeCouponCode() {
	try {
		loadingRemoveCoupon = true

		await CartService.removeCouponService({
			cartId: $page.data.cartId,
			code: selectedCouponCode || cart?.discount?.code,
			origin: $page.data.origin,
			storeId: $page.data.storeId
		})

		selectedCouponCode = ''
		// await invalidateAll()
		await getCartFromStore({
			cartId: $page.data.cartId,
			origin: $page.data.origin,
			storeId: $page.data.storeId,
			forceUpdate: true
		})
	} catch (e) {
		couponErr = e
	} finally {
		loadingRemoveCoupon = false
	}
}

async function getProducts() {
	try {
		loadingProducts = true

		const resP = await ProductService.fetchProducts({
			origin: $page?.data?.origin,
			isCors: $page?.data?.store?.isCors,
			storeId: $page?.data?.storeId
		})
		products = resP?.hits
	} catch (e) {
	} finally {
		loadingProducts = false
	}
}

async function getCoupons() {
	try {
		loadingCoupon = true
		const resC = await CouponService.fetchCoupons({
			origin: $page?.data?.origin,
			isCors: $page?.data?.store?.isCors,
			storeId: $page?.data?.storeId
		})
		coupons = resC?.data
	} catch (e) {
	} finally {
		loadingCoupon = false
	}
}

function chnageJsonInLocalStore({ json, pid, slug }) {
	localStorage.setItem(pid, json)
	goto('/product/' + slug)
}

function handleCheckedAllCartItems() {
	if (cart && cart?.items && cart?.items?.length) {
		if (checkedAllCartItems) {
			checkedCartItems = []

			cart?.items.forEach((item, ix) => {
				updateCheckedCartItems(item.pid)
			})
		} else {
			checkedCartItems = []
		}
	}
}

function updateCheckedCartItems(pid) {
	let ci = [...checkedCartItems]

	if (ci.includes(pid)) {
		ci = ci.filter((i) => i !== pid)
	} else {
		ci.push(pid)
	}

	checkedCartItems = ci

	if (checkedCartItems?.length === cart?.items?.length) {
		checkedAllCartItems = true
	}
}

function updateCheckedCartItemsInGroup() {
	if (!checkedCartItems?.length) {
		checkedAllCartItems = false
	}

	if (checkedCartItems?.length === cart?.items?.length) {
		checkedAllCartItems = true
	}
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen w-full px-3 py-5 sm:p-10">
	<div class="container mx-auto max-w-6xl">
		{#if data.loadingCart}
			<div class="flex flex-col gap-5">
				{#each { length: 5 } as _}
					<Skeleton />
				{/each}
			</div>
		{:else if cart?.qty > 0}
			<div class="mb-14 lg:mb-0 flex flex-col gap-10 lg:flex-row lg:justify-center xl:gap-20">
				<div class="w-full flex-1">
					<div class="items-center justify-between h-10 sm:h-14 sm:flex">
						<!-- Cart start  -->

						<div class="mr-4 flex items-baseline">
							<h1>Cart</h1>

							<div class="mx-3 h-1 w-1 rounded-full bg-zinc-500"></div>

							<p>
								{cart?.qty || ''}

								{#if cart?.qty > 1}
									Items
								{:else}
									Item
								{/if}
							</p>
						</div>
					</div>

					<hr />

					<div>
						{#if cart?.unavailableItems?.length}
							<div>
								<div class="mt-5 cursor-default border-b opacity-50">
									<div class="flex gap-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-8 w-8 text-accent-500"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clip-rule="evenodd"></path>
										</svg>

										<div class="flex-1">
											<h6>Out of Stock</h6>

											<p>Please remove from bag, items will be added to wishlist</p>
										</div>
									</div>

									<div class="flex flex-col divide-y">
										{#each cart?.unavailableItems as item (item._id)}
											<div class="flex w-full items-start gap-4 py-5">
												<a
													href="/product/{item?.slug}"
													aria-label="Click to visit product details"
													class="block shrink-0 overflow-hidden">
													{#if item.customizedImg || item.img}
														<LazyImg
															src="{item.isCustomized ? item.customizedImg : item.img}"
															alt=" "
															width="384"
															height="512"
															aspect_ratio="3:4"
															class="object-contain object-top h-28 w-20 text-xs" />
													{:else}
														<div
															class="h-32 sm:h-40 w-20 bg-zinc-100 flex flex-col items-center justify-center p-5 text-zinc-500 text-xs text-center">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																stroke-width="1.5"
																stroke="currentColor"
																class="w-6 h-6">
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
																></path>
															</svg>

															<span>No image available</span>
														</div>
													{/if}
												</a>

												<div class="w-full flex-1">
													<div class="mb-1 flex justify-between">
														<a
															href="/product/{item?.slug}"
															aria-label="Click to visit product details"
															class="cart-item flex-1 cursor-pointer text-zinc-500 hover:underline">
															{item?.name}
														</a>

														{#if $page?.data?.store?.isFnb && item.foodType}
															<div>
																{#if item.foodType === 'veg'}
																	<img src="{productVeg}" alt="veg" class="h-5 w-5" />
																{:else if item.foodType === 'nonveg'}
																	<img src="{productNonVeg}" alt="non veg" class="h-5 w-5" />
																{/if}
															</div>
														{/if}
													</div>

													<div class="mb-1 flex flex-wrap items-center gap-2 text-sm sm:text-base">
														<h5 class="whitespace-nowrap">
															{item?.formattedItemAmount?.price}
														</h5>

														{#if item?.mrp > item?.price}
															<h5 class="whitespace-nowrap text-zinc-500 line-through">
																{item?.formattedItemAmount?.mrp}
															</h5>

															{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
																<h5 class="whitespace-nowrap text-secondary-500">
																	({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
																</h5>
															{/if}
														{/if}
													</div>

													{#if item?.size?.name}
														<p class="flex items-center gap-2">
															<span>Size : </span>

															<span>
																{item?.size?.name}
															</span>
														</p>
													{/if}
												</div>
											</div>
										{/each}
									</div>
								</div>

								<form
									action="/cart?/handleUnavailableItems"
									method="POST"
									use:enhance="{() => {
										loadingMoveUnavailableItemsToWishlist = true
										return async ({ result }) => {
											// console.log('result of unabailable items', result)
											await invalidateAll()
											await applyAction(result)
											loadingMoveUnavailableItemsToWishlist = false
										}
									}}">
									<WhiteButton
										type="submit"
										loading="{loadingMoveUnavailableItemsToWishlist}"
										class="w-full">Move to Wishlist</WhiteButton>
								</form>
							</div>
						{/if}

						{#if cart?.qty}
							<div class="flex flex-col divide-y">
								<div class="py-5 px-2">
									<label class="flex tmes-center gap-2 font-semibold uppercase">
										<input
											type="checkbox"
											class="mt-0.5 h-4 w-4"
											bind:checked="{checkedAllCartItems}"
											on:change="{handleCheckedAllCartItems}" />

										<div class="flex flex-wrap items-center gap-1">
											<span> {checkedCartItems?.length}/{cart.items?.length} items selected </span>

											<span class="text-xs font-normal capitalize">
												(Selected items will go for checkout)
											</span>
										</div>
									</label>
								</div>

								{#each cart?.items as item, ix (item._id)}
									<!-- PID can not be a key because in case of customized items it will repeat-->
									<!-- Product detail start -->
									<div
										in:slide="{{ duration: 300 }}"
										out:fly="{{ x: -800, duration: 300 }}"
										class="flex w-full items-start gap-4 py-5">
										<div class="relative block shrink-0 overflow-hidden">
											<input
												type="checkbox"
												id="{item.pid}"
												value="{item.pid}"
												class="absolute top-2 left-2 z-10 h-4 w-4 rounded"
												bind:group="{checkedCartItems}"
												on:change="{updateCheckedCartItemsInGroup}" />

											{#if item.customizedImg || item.img}
												<a href="/product/{item?.slug}" aria-label="Click to visit product details">
													<LazyImg
														src="{item.isCustomized ? item.customizedImg : item.img}"
														alt=" "
														width="80"
														height="192"
														aspect_ratio="3:4"
														class="object-contain object-top h-28 w-20 text-xs" />
												</a>
											{:else}
												<a href="/product/{item?.slug}" aria-label="Click to visit product details">
													<div
														class="h-32 sm:h-40 w-20 bg-zinc-100 flex flex-col items-center justify-center p-5 text-zinc-500 text-xs text-center">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="w-6 h-6">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
															></path>
														</svg>

														<span>No image available</span>
													</div>
												</a>
											{/if}
										</div>

										<div class="w-full flex-1">
											<div class="mb-1 flex justify-between">
												<a
													href="/product/{item?.slug}"
													aria-label="Click to visit product details"
													class="flex-1 cursor-pointer text-zinc-500 hover:underline">
													{item?.name}
												</a>

												{#if $page?.data?.store?.isFnb && item.foodType}
													<div>
														{#if item.foodType === 'veg'}
															<img src="{productVeg}" alt="veg" class="h-5 w-5" />
														{:else if item.foodType === 'nonveg'}
															<img src="{productNonVeg}" alt="non veg" class="h-5 w-5" />
														{/if}
													</div>
												{/if}
											</div>

											{#if item.isCustomized}
												<button
													type="button"
													class="mb-1 text-sm text-zinc-500 italic hover:underline focus:outline-none"
													on:click="{() =>
														chnageJsonInLocalStore({
															json: item.customizedData,
															pid: item.pid,
															slug: item.slug
														})}">
													Click here to re-edit
												</button>
											{/if}

											<div class="mb-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
												<span class="text-sm sm:text-base font-bold whitespace-nowrap">
													{item?.formattedItemAmount?.price}
												</span>

												{#if item?.mrp > item?.price}
													<span class="whitespace-nowrap text-zinc-500 line-through">
														{item?.formattedItemAmount?.mrp}
													</span>

													{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
														<span class="whitespace-nowrap text-secondary-500">
															({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
														</span>
													{/if}
												{/if}
											</div>

											{#if item?.usedOptions?.length}
												<div class="mb-1 flex flex-col gap-1 text-sm">
													{#each item?.usedOptions as option}
														{#if option?.val?.length && option?.val !== undefined && option?.val != ''}
															<div class="flex flex-wrap gap-x-2">
																<p>{option.name} :</p>

																<ul class="flex flex-wrap items-center gap-x-2 gap-y-1">
																	{#each option.val as v, valIndex}
																		{#if v}
																			<li>
																				<b>
																					{v}
																				</b>

																				{#if valIndex < option.val?.length - 1}
																					,
																				{/if}
																			</li>
																		{/if}
																	{/each}
																</ul>
															</div>
														{/if}
													{/each}
												</div>
											{/if}

											{#if item?.size?.name}
												<p class="flex items-center gap-2">
													<span>Size : </span>

													<span>
														{item?.size?.name}
													</span>
												</p>
											{/if}

											<div class="mt-2 flex items-center justify-between">
												<div class="flex items-center justify-center">
													<!-- Minus icon -->

													<form
														action="/cart?/add"
														method="POST"
														use:enhance="{() => {
															loading[ix] = true
															return async ({ result }) => {
																fireGTagEvent('remove_from_cart', item)
																updateCartStore({ data: result?.data })
																if (item.qty === 1) {
																	updateCheckedCartItems(item.pid)
																}
																// await invalidateAll()
																await applyAction(result)
																loading[ix] = false
															}
														}}">
														<input type="hidden" name="pid" value="{item.pid || null}" />
														<input type="hidden" name="vid" value="{item.vid || null}" />
														<input type="hidden" name="qty" value="{-1}" />
														<input
															type="hidden"
															name="customizedImg"
															value="{item.customizedImg || null}" />
														<input
															type="hidden"
															name="options"
															value="{JSON.stringify(item.options) || null}" />

														<button
															type="submit"
															disabled="{loading[ix]}"
															class="flex transform items-center justify-center rounded-full bg-zinc-200 transition duration-300 focus:outline-none h-6 w-6
															{loading[ix]
																? 'cursor-not-allowed opacity-80'
																: 'cursor-pointer hover:opacity-80 active:scale-95'}">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																stroke-width="1.5"
																stroke="currentColor"
																class="w-4 h-4 text-zinc-500">
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M19.5 12h-15"></path>
															</svg>
														</button>
													</form>

													<!-- Quantity indicator -->

													<div
														class="mx-2 flex h-6 w-6 items-center justify-center text-xs font-bold">
														{#if selectedLoadingType !== 'delete' && loading[ix]}
															<img
																src="{dotsLoading}"
																alt="loading"
																class="h-auto w-4 object-contain object-center" />
														{:else}
															<span>{item?.qty}</span>
														{/if}
													</div>

													<!-- Puls icon -->

													<form
														action="/cart?/add"
														method="POST"
														use:enhance="{() => {
															loading[ix] = true
															return async ({ result }) => {
																fireGTagEvent('add_to_cart', result?.data)
																updateCartStore({ data: result?.data })
																// await invalidateAll()
																await applyAction(result)
																loading[ix] = false
															}
														}}">
														<input type="hidden" name="pid" value="{item.pid || null}" />
														<input type="hidden" name="vid" value="{item.vid || null}" />
														<input type="hidden" name="qty" value="{+1}" />
														<input
															type="hidden"
															name="customizedImg"
															value="{item.customizedImg || null}" />
														<input
															type="hidden"
															name="options"
															value="{JSON.stringify(item.options) || null}" />

														<button
															type="submit"
															disabled="{loading[ix]}"
															class="flex transform items-center justify-center rounded-full bg-zinc-200 transition duration-300 focus:outline-none h-6 w-6
															{loading[ix]
																? 'cursor-not-allowed opacity-80'
																: 'cursor-pointer hover:opacity-80 active:scale-95'}">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																stroke-width="1.5"
																stroke="currentColor"
																class="w-4 h-4 text-zinc-500">
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M12 4.5v15m7.5-7.5h-15"></path>
															</svg>
														</button>
													</form>
												</div>

												<!-- Delete icon -->

												<form
													action="/cart?/add"
													method="POST"
													use:enhance="{() => {
														selectedLoadingType = 'delete'
														loading[ix] = true
														return async ({ result }) => {
															fireGTagEvent('remove_from_cart', item)
															updateCartStore({ data: result.data })
															updateCheckedCartItems(item.pid)
															// await invalidateAll()
															await applyAction(result)
															selectedLoadingType = null
															loading[ix] = false
														}
													}}">
													<input type="hidden" name="pid" value="{item.pid || null}" />
													<input type="hidden" name="vid" value="{item.vid || null}" />
													<input type="hidden" name="qty" value="{-9999999}" />
													<input
														type="hidden"
														name="customizedImg"
														value="{item.customizedImg || null}" />
													<input
														type="hidden"
														name="options"
														value="{JSON.stringify(item.options) || null}" />

													<button
														type="submit"
														disabled="{loading[ix]}"
														class="flex transform items-center justify-center rounded-full bg-zinc-200 transition duration-300 focus:outline-none h-6 w-6
														{loading[ix]
															? 'cursor-not-allowed opacity-80'
															: 'cursor-pointer hover:opacity-80 active:scale-95'}">
														{#if selectedLoadingType === 'delete' && loading[ix]}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-4 w-4 animate-spin"
																viewBox="0 0 24 24"
																stroke-width="1.5"
																stroke="currentColor"
																fill="none"
																stroke-linecap="round"
																stroke-linejoin="round">
																<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
																<path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95"></path>
																<path d="M3.69 8.56a9 9 0 0 0 -.69 3.44"></path>
																<path d="M3.69 15.44a9 9 0 0 0 1.95 2.92"></path>
																<path d="M8.56 20.31a9 9 0 0 0 3.44 .69"></path>
																<path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95"></path>
																<path d="M20.31 15.44a9 9 0 0 0 .69 -3.44"></path>
																<path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92"></path>
																<path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69"></path>
															</svg>
														{:else}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																stroke-width="1.5"
																stroke="currentColor"
																class="w-4 h-4 text-zinc-500">
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
																></path>
															</svg>
														{/if}
													</button>
												</form>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div class="w-full lg:w-96 lg:shrink-0 lg:grow-0">
					<!-- Promo code section -->

					{#if store?.isDiscountCoupons}
						<div class="h-10 sm:h-14 flex items-center">
							{#if cart?.discount?.amount > 0}
								<div class="flex w-full items-center justify-between text-sm">
									<h5 class="flex-1 truncate text-left">
										Applied Coupon "{cart?.discount?.code}"
									</h5>

									<button
										type="button"
										class="w-16 font-bold text-primary-500 focus:outline-none hover:text-primary-700"
										on:click="{removeCouponCode}">
										{#if loadingRemoveCoupon}
											<span class="text-center text-zinc-500"> ... </span>
										{:else}
											<span class="text-right hover:underline"> Remove </span>
										{/if}
									</button>
								</div>
							{:else}
								<button
									type="button"
									class="flex w-full items-center justify-between focus:outline-none hover:text-primary-500"
									class:text-primary-500="{openApplyPromoCodeModal}"
									on:click="{() => (openApplyPromoCodeModal = true)}">
									<h5>Apply Promo Code</h5>

									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"></path>
									</svg>
								</button>
							{/if}
						</div>
					{:else}
						<h2 class="mb-5">Cart Summary</h2>
					{/if}

					<hr class="mb-5" />

					<Pricesummary
						{checkedCartItems}
						nextpage="/checkout/address"
						text="Select Address"
						showNextIcon />

					<TrustBaggeContainer class="mt-5" />
				</div>
			</div>

			{#if openApplyPromoCodeModal}
				<div class="fixed inset-0 z-[100] h-screen w-full">
					<div
						transition:fly="{{ x: 400, duration: 500 }}"
						class="absolute inset-y-0 right-0 z-[101] max-w-max border-l bg-white"
						style="box-shadow: -2px 0px 20px 0px #D3D3D3;">
						<div class="h-full w-full overflow-y-auto">
							<div class="relative w-full sm:w-[25rem]">
								<div
									class="flex items-center justify-between gap-5 border-b border-zinc-200 p-4 sm:gap-10">
									<h5>Apply Promo Code</h5>

									<button
										type="button"
										class="transform cursor-pointer text-zinc-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-zinc-800"
										on:click="{() => {
											openApplyPromoCodeModal = false
											couponErr = null
										}}">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clip-rule="evenodd"></path>
										</svg>
									</button>
								</div>

								<div class="flex flex-col p-5">
									<form
										on:submit|preventDefault="{() => applyCouponCode(selectedCouponCode, null)}"
										class="flex items-center justify-between gap-2">
										<div class="flex-1">
											<Textbox
												placeholder="Write your coupon code here..."
												class="w-full"
												bind:value="{selectedCouponCode}" />
										</div>

										<PrimaryButton
											type="submit"
											loading="{loadingApplyCoupon}"
											loadingringsize="sm"
											disabled="{!selectedCouponCode}"
											class="shrink-0 text-sm uppercase">
											Check
										</PrimaryButton>
									</form>

									<Error err="{couponErr}" class="mt-5" />

									{#if loadingCoupon}
										<div class="mt-5 flex flex-col gap-5">
											<Skeleton small />

											<Skeleton small />

											<Skeleton small />

											<Skeleton small />

											<Skeleton small />
										</div>
									{:else if coupons?.length > 0}
										<ul class="flex flex-col divide-y">
											{#each coupons as coupon, index}
												<button
													title="Click to apply the coupon"
													on:click="{() => handleCouponCode(coupon.code, index)}"
													class="group text-left py-5">
													<div class="mb-2 flex items-center gap-3">
														<div
															class="max-w-max relative rounded border border-zinc-500 border-dashed py-1 px-4 font-semibold tracking-wide
															{cart?.discount?.code === coupon.code
																? 'border-blue-500 text-blue-500'
																: 'group-hover:border-blue-500 group-hover:text-blue-500'}">
															{coupon.code}

															{#if loadingSelectedCoupon[index]}
																<div
																	class="absolute inset-0 flex cursor-not-allowed items-center justify-center bg-black bg-opacity-70">
																	<svg
																		class="mx-auto animate-spin text-white h-4 w-4"
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
																			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																		></path>
																	</svg>
																</div>
															{/if}
														</div>

														{#if cart?.discount?.code === coupon.code}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-brand-500"
																viewBox="0 0 20 20"
																fill="currentColor">
																<path
																	fill-rule="evenodd"
																	d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																	clip-rule="evenodd"></path>
															</svg>
														{/if}
													</div>

													{#if coupon.description || coupon.validTo}
														<div class="flex flex-col gap-1 text-xs">
															{#if coupon.description}
																<span class="first-letter:uppercase">{coupon.description}</span>
															{/if}

															{#if coupon.validTo}
																<span><b>Expires on : {date(coupon.validTo)}</b></span>
															{/if}
														</div>
													{/if}
												</button>
											{/each}
										</ul>
									{:else}
										<div class="p-5 text-center text-sm text-zinc-500">
											Opps! No coupon available right now<br /> Try again later.
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>

					<button
						type="button"
						class="absolute inset-0 h-full w-full cursor-default bg-black bg-opacity-0 focus:outline-none"
						on:click="{() => (openApplyPromoCodeModal = false)}">
					</button>
				</div>
			{/if}

			{#if products?.length > 0}
				<div class="w-full">
					<h2 class="my-5 sm:my-10">You May Like</h2>

					<div
						class="grid w-full grid-cols-2 items-end sm:flex sm:flex-wrap sm:justify-between sm:gap-10">
						{#each products as p, px (p.id)}
							{#if p && px < 10}
								<ProductCard product="{p}" />
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{:else if !isCartLoading}
			<div class="flex h-[70vh] flex-col items-center justify-center text-center">
				<div>
					<img src="{noAddToCartAnimate}" alt="empty listing" class="mb-5 h-60 object-contain" />
				</div>

				<span class="mb-3 text-xl font-medium md:text-3xl">Empty Cart!!</span>

				<span class="mb-5 text-xs">
					We didn't find any item inside cart, Go ahead, order some essentials from the menu
				</span>

				<PrimaryButton class="w-40 py-2 text-sm" on:click="{() => goto(`/`)}">
					BROWSE ITEMS
				</PrimaryButton>
			</div>
		{/if}
	</div>
</section>
