<script lang="ts">
import { CartService, CouponService, ProductService } from '$lib/services'
import { date, getCdnImageUrl } from '$lib/utils'
import { fireGTagEvent } from '$lib/utils/gTag'
import { fly } from 'svelte/transition'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import dotsLoading from '$lib/assets/dots-loading.gif'
import Error from '$lib/components/Error.svelte'
import noAddToCartAnimate from '$lib/assets/no/add-to-cart-animate.svg'
import Pricesummary from '$lib/components/Pricesummary.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'
import SEO from '$lib/components/SEO/index.svelte'
import Skeleton from '$lib/ui/Skeleton.svelte'
import Textbox from '$lib/ui/Textbox.svelte'

export let data

let seoProps = {
	title: `Cart`,
	description: `Cart`
}

let appliedCouponInfo = {}
let couponErr
let coupons
let loading = {}
let loadingApplyCoupon = false
let loadingCoupon = false
let loadingProducts = false
let loadingRemoveCoupon = false
let openApplyPromoCodeModal = false
let products = []
let selectedCouponCode = null
let selectedLoadingType = null

onMount(() => {
	getProducts()
	getCoupons()
	fireGTagEvent('view_cart', data.cart)
})

const addToCart = async ({ pid, qty, customizedImg, ix, loadingType }: any) => {
	if (loadingType) {
		selectedLoadingType = loadingType
	}
	loading[ix] = true
	await CartService.addToCartService({
		pid: pid,
		vid: pid,
		qty: qty,
		customizedImg: customizedImg || null,
		storeId: $page.data.store?.id,
		origin: $page.data.origin
	})

	await invalidateAll()

	loading[ix] = false
	selectedLoadingType = null
}

function handleCouponCode(couponCode: string) {
	selectedCouponCode = couponCode
	applyCouponCode(selectedCouponCode)
}

async function applyCouponCode(selectedCouponCode: string) {
	try {
		loadingApplyCoupon = true
		const resAC = await CartService.applyCouponService({
			code: selectedCouponCode,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})
		appliedCouponInfo = resAC
		await invalidateAll()
		openApplyPromoCodeModal = false
	} catch (e) {
		couponErr = e
	} finally {
		loadingApplyCoupon = false
	}
}

async function removeCouponCode() {
	try {
		loadingRemoveCoupon = true
		await CartService.removeCouponService({
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})
		selectedCouponCode = ''
		await invalidateAll()
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
			storeId: $page?.data?.store?.id
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
			storeId: $page?.data?.store?.id
		})
		coupons = resC?.data
	} catch (e) {
	} finally {
		loadingCoupon = false
	}
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen w-full p-3 sm:p-10">
	<div class="container mx-auto max-w-6xl">
		{#if data.loadingCart}
			<div class="flex flex-col gap-5">
				{#each { length: 5 } as _}
					<Skeleton />
				{/each}
			</div>
		{:else if data.cart?.qty > 0}
			<div class="flex flex-col gap-10 lg:flex-row lg:justify-center xl:gap-20">
				<div class="w-full flex-1">
					<div class="items-center justify-between pb-3 sm:flex">
						<!-- Cart start  -->

						<div class="mr-4 flex items-baseline">
							<h1
								class="font-serif text-xl font-medium tracking-wider sm:text-2xl md:text-3xl xl:text-4xl">
								Cart
							</h1>

							<div class="mx-3 h-1 w-1 rounded-full bg-gray-500"></div>

							<h4 class="tracking-tighter text-gray-500 sm:text-xl">
								{data.cart?.qty || ''}

								{#if data.cart?.qty > 1}
									Items
								{:else}
									Item
								{/if}
							</h4>
						</div>
					</div>

					<div class="border-t pt-5">
						{#if data.cart?.unavailableItems?.length > 0}
							<div>
								<div class="cursor-default border-b opacity-50">
									<div class="flex gap-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-8 w-8 text-red-500"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clip-rule="evenodd"></path>
										</svg>

										<div class="flex-1">
											<h6 class="text-lg font-semibold">Out of Stock</h6>

											<p>Please remove from bag, items will be added to wishlist</p>
										</div>
									</div>

									<div class="flex flex-col divide-y">
										{#each data.cart?.unavailableItems as item}
											<div class="flex w-full items-start gap-4 py-5">
												<a
													href="{item?.slug}"
													aria-label="Click to route product details"
													class="shrink-0 ">
													<img
														src="{getCdnImageUrl(
															item.isCustomizeditem ? item.customizedImg : item.img
														)}?tr=w-auto,h-256,cm-pad_resize&sharpen=true"
														alt=""
														width="128"
														class="w-16 cursor-pointer rounded-md object-contain sm:w-32" />
												</a>

												<div class="w-full flex-1">
													<div class="mb-2 flex justify-between">
														<a
															href="/product/{item?.slug}"
															aria-label="Click to route product details"
															class="cart-item flex-1 cursor-pointer text-base font-medium text-gray-600 hover:underline sm:text-lg">
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

													<div class="mb-2 flex flex-wrap items-center gap-2 text-sm sm:text-base">
														<span class="whitespace-nowrap text-lg font-bold sm:text-xl">
															{item?.formattedItemAmount?.price}
														</span>

														{#if item?.mrp > item?.price}
															<span class="whitespace-nowrap text-gray-600 line-through">
																{item?.formattedItemAmount?.mrp}
															</span>

															{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
																<span class="whitespace-nowrap text-green-600">
																	({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
																</span>
															{/if}
														{/if}
													</div>
												</div>
											</div>
										{/each}
									</div>
								</div>

								<PrimaryButton class="w-full">Move to Wishlist</PrimaryButton>
							</div>
						{/if}

						{#if data.cart?.items}
							<div class="flex flex-col divide-y">
								{#each data.cart?.items as item, ix}
									<!-- Product detail start -->

									<div class="flex w-full items-start gap-4 py-5">
										<a
											href="/product/{item?.slug}"
											aria-label="Click to route product details"
											class="shrink-0 ">
											{#if item.isCustomized}
												<img
													src="{getCdnImageUrl(
														item.customizedImg
													)}?tr=w-auto,h-256,cm-pad_resize&sharpen=true"
													alt=""
													width="128"
													class="w-16 cursor-pointer rounded-md object-contain sm:w-32" />
											{:else}
												<img
													src="{getCdnImageUrl(
														item.img
													)}?tr=w-auto,h-256,cm-pad_resize&sharpen=true"
													alt=""
													width="128"
													class="w-16 cursor-pointer rounded-md object-contain sm:w-32" />
											{/if}
										</a>

										<div class="w-full flex-1">
											<div class="mb-2 flex justify-between">
												<a
													href="/product/{item?.slug}"
													aria-label="Click to route product details"
													class="flex-1 cursor-pointer text-base font-medium text-gray-600 hover:underline sm:text-lg">
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

											<div class="mb-2 flex flex-wrap items-center gap-2 text-sm sm:text-base">
												<span class="text-lg font-bold sm:text-xl">
													{item?.formattedItemAmount?.price}
												</span>

												{#if item?.mrp > item?.price}
													<span class="whitespace-nowrap text-gray-600 line-through">
														{item?.formattedItemAmount?.mrp}
													</span>

													{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
														<span class="text-green-600">
															({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
														</span>
													{/if}
												{/if}
											</div>

											{#if item?.usedOptions?.length}
												<div class="mb-2 flex flex-col gap-2 text-sm">
													{#each item?.usedOptions as option}
														{#if option?.val?.length && option?.val !== undefined && option?.val != ''}
															<div class="flex flex-wrap gap-2">
																<h6>{option.name}:</h6>
																{#each option.val as v}
																	{#if v}
																		<div class="font-bold">
																			{v}
																		</div>
																	{/if}
																{/each}
															</div>
														{/if}
													{/each}
												</div>
											{/if}

											<div class="mt-4 flex items-center justify-between">
												<div class="flex items-center justify-center">
													<!-- Minus icon -->

													<button
														type="button"
														disabled="{loading[ix]}"
														on:click="{() =>
															addToCart({
																pid: item.pid,
																qty: -1,
																customizedImg: item.customizedImg,
																ix: ix
															})}"
														class="flex h-6 w-6 transform items-center justify-center rounded-full bg-gray-200 transition duration-300 focus:outline-none sm:h-8 sm:w-8 
														{loading[ix]
															? 'cursor-not-allowed opacity-80'
															: 'cursor-pointer hover:opacity-80 active:scale-95'}">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="w-4 h-4 text-gray-500">
															<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"
															></path>
														</svg>
													</button>

													<!-- Quantity indicator -->

													<div
														class="mx-2 flex h-6 w-6 items-center justify-center text-xs font-bold sm:h-8  sm:w-8  ">
														{#if loading[ix]}
															<img
																src="{dotsLoading}"
																alt="loading"
																class="h-auto w-5 object-contain object-center" />
														{:else}
															<span>{item?.qty}</span>
														{/if}
													</div>

													<!-- Puls icon -->

													<button
														type="button"
														disabled="{loading[ix]}"
														on:click="{() =>
															addToCart({
																pid: item.pid,
																qty: +1,
																customizedImg: item.customizedImg,
																ix: ix
															})}"
														class="flex h-6 w-6 transform items-center justify-center rounded-full bg-gray-200 transition duration-300 focus:outline-none sm:h-8 sm:w-8 
														{loading[ix]
															? 'cursor-not-allowed opacity-80'
															: 'cursor-pointer hover:opacity-80 active:scale-95'}">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="w-4 h-4 text-gray-500">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M12 4.5v15m7.5-7.5h-15"></path>
														</svg>
													</button>
												</div>

												<!-- Delete icon -->

												<button
													type="button"
													disabled="{loading[ix]}"
													on:click="{() =>
														addToCart({
															pid: item.pid,
															qty: -9999999,
															customizedImg: item.customizedImg,
															ix: ix,
															loadingType: 'delete'
														})}"
													class="flex h-6 w-6 transform items-center justify-center rounded-full bg-gray-200 transition duration-300 focus:outline-none sm:h-8 sm:w-8 
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
															class="w-4 h-4 text-gray-500">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															></path>
														</svg>
													{/if}
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<div>
						<!-- <Weprovides /> -->
					</div>
				</div>

				<div class="w-full lg:w-80 lg:shrink-0 lg:grow-0">
					<!-- Promo code section -->

					{#if data.cart?.discount?.amount > 0}
						<div class="mt-3 flex w-full items-center justify-between text-sm">
							<h5 class="flex-1 truncate text-left font-semibold">
								Applied Coupon "{data.cart?.discount?.code}"
							</h5>

							<button
								type="button"
								class="w-16 font-bold text-primary-500 focus:outline-none hover:text-primary-700"
								on:click="{removeCouponCode}">
								{#if loadingRemoveCoupon}
									<span class="text-center text-gray-500"> ... </span>
								{:else}
									<span class="text-right hover:underline"> Remove </span>
								{/if}
							</button>
						</div>
					{:else}
						<button
							type="button"
							class="mt-3 flex w-full items-center justify-between focus:outline-none hover:text-primary-500"
							class:text-primary-500="{openApplyPromoCodeModal}"
							on:click="{() => (openApplyPromoCodeModal = true)}">
							<h5 class="text-sm font-semibold">Apply Promo Code</h5>

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

					<Pricesummary
						cart="{data.cart}"
						nextpage="/checkout/address"
						text="Select Address"
						showNextIcon />
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
									class="flex items-center justify-between gap-5 border-b border-gray-300 p-4 sm:gap-10">
									<h2 class="text-lg font-bold">Apply Promo Code</h2>

									<button
										type="button"
										class="transform cursor-pointer text-gray-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-gray-700"
										on:click="{() => (openApplyPromoCodeModal = false)}">
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
										on:submit|preventDefault="{() => applyCouponCode(selectedCouponCode)}"
										class="flex items-center justify-between gap-2">
										<Textbox
											placeholder="Write your coupon code here..."
											class="w-full"
											bind:value="{selectedCouponCode}" />

										<PrimaryButton
											type="submit"
											loading="{loadingApplyCoupon}"
											loadingringsize="sm"
											disabled="{!selectedCouponCode}"
											class="shrink-0 text-sm uppercase">
											Check
										</PrimaryButton>
									</form>

									<Error err="{couponErr}" />

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
											{#each coupons as coupon}
												<button
													title="Click to apply the coupon"
													on:click="{() => handleCouponCode(coupon.code)}"
													class="group cursor-pointer py-5 tracking-wide">
													<div class="mb-2 flex items-center gap-3">
														<div
															class="max-w-max rounded border border-dashed py-1 px-4 font-semibold
															{data.cart?.discount?.code === coupon.code
																? 'border-blue-500 text-blue-500'
																: 'group-hover:border-blue-500 group-hover:text-blue-500'}">
															{coupon.code}
														</div>

														{#if data.cart?.discount?.code === coupon.code}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 text-green-500"
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
										<div class="p-5 text-center text-sm text-gray-500">
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
					<h2
						class="my-5 font-serif text-xl font-medium tracking-wider sm:my-10 sm:text-2xl md:text-3xl xl:text-4xl">
						You May Like
					</h2>

					<div
						class="grid w-full grid-cols-2 items-end sm:flex sm:flex-wrap sm:justify-between sm:gap-10">
						{#each products as p, px}
							{#if p && px < 10}
								<ProductCard product="{p}" />
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{:else}
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
