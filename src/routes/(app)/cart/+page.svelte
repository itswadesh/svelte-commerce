<script lang="ts">
import SEO from '$lib/components/SEO/index.svelte'
import { post, del, getAPI } from '$lib/util/api'
import { page } from '$app/stores'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { goto, invalidate, invalidateAll } from '$app/navigation'
import { currency, date } from '$lib/util'
import Pricesummary from '$lib/components/Pricesummary.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import Skeleton from '$lib/ui/Skeleton.svelte'
import { fly } from 'svelte/transition'
import ProductCard from '$lib/ProductCard.svelte'
import { onMount } from 'svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import Error from '$lib/components/Error.svelte'
import { fireGTagEvent } from '$lib/util/gTag'
import Cookie from 'cookie-universal'

const cookies = Cookie()

export let data

// $: ({ loadingCart, cart = {} } = data)

let seoProps = {
	title: `Cart`,
	description: `Cart`
}

let coupons
let products = []
let loading = {}
let openApplyPromoCodeModal = false
let loadingProducts = false
let loadingCoupon = false
let selectedCouponCode = ''
let loadingApplyCoupon = false
let appliedCouponInfo = {}
let loadingRemoveCoupon = false
let couponErr

onMount(() => {
	getProducts()
	getCoupons()
	fireGTagEvent('view_cart', data.cart)
})

// console.log('cart', cart)

const addToCart = async ({ pid, qty, customizedImg, ix }: any) => {
	loading[ix] = true
	const res = await post(
		'carts/add-to-cart',
		{
			pid: pid,
			qty: qty,
			customizedImg: customizedImg || null,
			store: $page.data.store?.id
		},
		$page.data.origin
	)

	// cart = res
	// $page.data.cart = res
	// await refreshCart()

	await invalidateAll()

	loading[ix] = false
}

function handleCouponCode(couponCode: string) {
	selectedCouponCode = couponCode
	applyCouponCode(selectedCouponCode)
}

async function applyCouponCode(selectedCouponCode: string) {
	try {
		loadingApplyCoupon = true
		const resAC = await post(
			'apply-coupon',
			{ code: selectedCouponCode, store: $page.data.store?.id },
			$page.data.origin
		)
		appliedCouponInfo = resAC
		// await invalidateAll()
		// await refreshCart()
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
		await del(`remove-coupon?store=${$page.data.store?.id}`, $page.data.origin)
		selectedCouponCode = ''
		// await invalidateAll()
		await refreshCart()
	} catch (e) {
		couponErr = e
	} finally {
		loadingRemoveCoupon = false
	}
}

async function getProducts() {
	try {
		loadingProducts = true
		const resP = await getAPI(`es/products?store=${$page.data?.store?.id}`, $page.data.origin)
		products = resP?.hits
	} catch (e) {
	} finally {
		loadingProducts = false
	}
}

async function getCoupons() {
	try {
		loadingCoupon = true
		const resC = await getAPI(`coupons?store=${$page.data?.store?.id}`, $page.data.origin)
		coupons = resC?.data

		// console.log('coupons = ', coupons)
	} catch (e) {
	} finally {
		loadingCoupon = false
	}
}

async function refreshCart() {
	try {
		const res = await getAPI(`carts/refresh-cart?store=${$page.data.store?.id}`, $page.data.origin)
		if (res) {
			const cookieCart = {
				cartId: res?.cart_id,
				items: res?.items,
				qty: +res?.qty,
				tax: +res?.tax,
				subtotal: +res?.subtotal,
				total: +res?.total,
				currencySymbol: res?.currencySymbol,
				discount: res?.discount,
				selfTakeout: res?.selfTakeout,
				shipping: res?.shipping,
				unavailableItems: res?.unavailableItems,
				formattedAmount: res?.formattedAmount
			}
			// const str = cookie.serialize('cart', JSON.stringify(cookieCart), { path: '/' })

			cookies.set('cartId', cookieCart.cartId, { path: '/' })
			cookies.set('cartQty', cookieCart.qty, { path: '/' })

			// data.cart = cookieCart
		}
	} catch (e) {
	} finally {
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

						<!-- Cart end  -->

						<!-- Enter pincode for delivery start  -->

						<!-- <div class="relative mt-2 sm:mt-0">
						<div
							on:click="{toggle}"
							class="flex items-center px-2 sm:px-4 py-2 cursor-pointer hover:bg-gray-100">
							<span> Enter pincode for delivery</span>
							{#if !show}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5 mt-1 ml-2 text-gray-800 transition duration-300"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clip-rule="evenodd"></path>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5 mt-1 ml-2 text-gray-800  transform rotate-180 transition duration-300"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clip-rule="evenodd"></path>
								</svg>
							{/if}
						</div>

						{#if show}
							<div
								class="absolute z-10 left-0 md:right-0 flex flex-col p-4 md:p-6 mt-2 bg-white border rounded-lg shadow-xl w-72 md:w-96">
								<p class="text-sm">Enter a pincode / Zip</p>
								<div class="mt-2">
									<Textbox label="Pincode / Zip" />
									<button
										on:click="{toggle}"
										class="w-full py-3 mt-3 font-bold tracking-wide text-white bg-gray-800 rounded-lg bg-opacity-80 hover:bg-opacity-100"
										>CHECK</button>
								</div>
							</div>
						{/if}
						
					</div> -->

						<!-- Enter pincode for delivery end  -->
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
													class="flex-shrink-0 ">
													<LazyImg
														src="{item.isCustomizeditem ? item.customizedImg : item.img}"
														alt=""
														width="128"
														class="w-16 cursor-pointer rounded-md object-contain sm:w-32" />
												</a>

												<div class="w-full flex-1">
													<div class="flex mb-2 justify-between">
														<a
															href="/product/{item?.slug}"
															aria-label="Click to route product details"
															class="flex-1 cursor-pointer text-base font-medium text-gray-600 hover:underline sm:text-lg">
															{item?.name}
														</a>

														{#if $page?.data?.store?.isFnb && item.foodType}
															<div>
																{#if item.foodType === 'veg'}
																	<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
																{:else if item.foodType === 'nonveg'}
																	<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
																{/if}
															</div>
														{/if}
													</div>

													<div class="mb-2 flex flex-wrap items-center gap-2 text-sm sm:text-base">
														<span class="text-lg font-bold sm:text-xl whitespace-nowrap">
															{item?.formattedItemAmount?.price}
														</span>

														{#if item?.mrp > item?.price}
															<span class="font-light text-gray-400 line-through whitespace-nowrap">
																{item?.formattedItemAmount?.mrp}
															</span>

															{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
																<span class="text-green-500 whitespace-nowrap">
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
											class="flex-shrink-0 ">
											{#if item.isCustomized}
												<LazyImg
													src="{item.customizedImg}"
													alt=""
													width="128"
													class="w-16 cursor-pointer rounded-md object-contain sm:w-32" />
											{:else}
												<LazyImg
													src="{item.img}"
													alt=""
													width="128"
													class="w-16 cursor-pointer rounded-md object-contain sm:w-32" />
											{/if}
										</a>

										<div class="w-full flex-1">
											<div class="flex mb-2 justify-between">
												<a
													href="/product/{item?.slug}"
													aria-label="Click to route product details"
													class="flex-1 cursor-pointer text-base font-medium text-gray-600 hover:underline sm:text-lg">
													{item?.name}
												</a>

												{#if $page?.data?.store?.isFnb && item.foodType}
													<div>
														{#if item.foodType === 'veg'}
															<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
														{:else if item.foodType === 'nonveg'}
															<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
														{/if}
													</div>
												{/if}
											</div>

											<!-- <h5 class="text-gray-600">{item.product?.vendor_name}</h5> -->

											<!-- <div class="my-2 flex items-center">
											<h5 class="text-sm">One size</h5>
											<div class="mx-3 h-1 w-1 rounded-full bg-gray-200"></div>
											<span class="text-red-500">{item?.product} left</span>
										</div> -->

											<div class="mb-2 flex flex-wrap items-center gap-2 text-sm sm:text-base">
												<span class="text-lg font-bold sm:text-xl">
													{item?.formattedItemAmount?.price}
												</span>

												{#if item?.mrp > item?.price}
													<span class="font-light text-gray-400 line-through">
														{item?.formattedItemAmount?.mrp}
													</span>

													{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
														<span class="text-green-500">
															({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
														</span>
													{/if}
												{/if}
											</div>

											<div class="flex items-center justify-between">
												<div class="flex items-center justify-center">
													<button
														disabled="{loading[ix]}"
														on:click="{() =>
															addToCart({
																pid: item.pid,
																qty: -1,
																customizedImg: item.customizedImg,
																ix: ix
															})}"
														type="button"
														class="flex h-6 w-6 transform items-center justify-center rounded-full  bg-gray-200 shadow transition  duration-300 focus:outline-none hover:bg-gray-300 hover:opacity-80 active:scale-95 sm:h-8 sm:w-8">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-4 w-4 text-gray-600"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M20 12H4"></path>
														</svg>
													</button>

													<div
														class="mx-2 flex h-6 w-6 items-center justify-center text-xs font-bold sm:h-8  sm:w-8  ">
														{#if loading[ix]}
															<img
																src="/dots-loading.gif"
																alt="loading"
																class="h-auto w-5 object-contain object-center" />
														{:else}
															<span>{item?.qty}</span>
														{/if}
													</div>

													<button
														disabled="{loading[ix]}"
														on:click="{() =>
															addToCart({
																pid: item.pid,
																qty: +1,
																customizedImg: item.customizedImg,
																ix: ix
															})}"
														type="button"
														class="flex h-6 w-6 transform items-center justify-center rounded-full  bg-gray-200 shadow transition  duration-300 focus:outline-none hover:bg-gray-300 hover:opacity-80 active:scale-95 sm:h-8 sm:w-8">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-4 w-4 text-gray-600"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
														</svg>
													</button>
												</div>

												<button
													on:click="{() =>
														addToCart({
															pid: item.pid,
															qty: -999999,
															customizedImg: item.customizedImg,
															ix: ix
														})}"
													class="flex h-6 w-6 transform items-center justify-center rounded-full bg-gray-200 shadow transition  duration-300 focus:outline-none hover:bg-gray-300 hover:opacity-80 active:scale-95 sm:h-8 sm:w-8">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-4 w-4 text-gray-600"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor">
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
														></path>
													</svg>
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

				<div class="w-full lg:w-80 lg:flex-shrink-0 lg:flex-grow-0">
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
									<h1 class="text-lg font-bold">Apply Promo Code</h1>

									<button
										type="button"
										class="transform cursor-pointer text-gray-500 transition duration-300 focus:outline-none hover:scale-125 hover:text-gray-800"
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
											class="flex-shrink-0 text-sm uppercase">
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
												<li
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
												</li>
											{/each}
										</ul>
									{:else}
										<div class="text-center text-sm text-gray-500">
											Opps! You have a bad luck. <br /> There's no coupon is available now
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
					<h1
						class="my-5 font-serif text-xl font-medium tracking-wider sm:my-10 sm:text-2xl md:text-3xl xl:text-4xl">
						You May Like
					</h1>

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
					<img
						src="/no/add-to-cart-animate.svg"
						alt="empty listing"
						class="mb-5 h-60 object-contain" />
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
