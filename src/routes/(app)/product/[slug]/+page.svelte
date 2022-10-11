<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
.frosted-blur {
	backdrop-filter: blur(12px);
}
.shake-animation {
	animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	transform: translate3d(0, 0, 0);
	backface-visibility: hidden;
	border: 1px solid red;
}

@keyframes shake {
	10%,
	90% {
		transform: translate3d(-1px, 0, 0);
	}

	20%,
	80% {
		transform: translate3d(2px, 0, 0);
	}

	30%,
	50%,
	70% {
		transform: translate3d(-4px, 0, 0);
	}

	40%,
	60% {
		transform: translate3d(4px, 0, 0);
	}
}

@media only screen and (max-width: 768px) {
	.box-shadow {
		box-shadow: 0px -4px 10px rgba(50, 50, 50, 0.2);
	}
}
</style>

<script lang="ts">
import SEO from '$lib/components/SEO/index.svelte'
import { post, getAPI } from '$lib/util/api'
import { page } from '$app/stores'
import Cookie from 'cookie-universal'
import { date, currency, delay, toast } from '$lib/util'
import { fly, slide, fade } from 'svelte/transition'
import Breadcrumb from '$lib/components/Breadcrumb.svelte'
import AnimatedCartItem from '$lib/components/AnimatedCartItem.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import Checkbox from '$lib/ui/Checkbox.svelte'
import viewport from '$lib/actions/useViewPort'
import Textbox from '$lib/ui/Textbox.svelte'
import Textarea from '$lib/ui/Textarea.svelte'
import Radio from '$lib/ui/Radio.svelte'
import { createEventDispatcher, onMount } from 'svelte'
import { goto, invalidateAll } from '$app/navigation'
import DeliveryOptions from './_DeliveryOptions.svelte'
import WhiteButton from '$lib/ui/WhiteButton.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import SimilarProducts from '$lib/components/Product/SimilarProducts.svelte'
import FrequentlyBoughtProduct from './_FrequentlyBoughtProduct.svelte'
import { fireGTagEvent } from '$lib/util/gTag'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import { applyAction, enhance } from '$app/forms'

const dispatch = createEventDispatcher()

const cookies = Cookie()

export let data

// console.log('data = ', data)

let selectedImgCdn
let seoProps = {
	title: `Details of product ${data.product?.name}`,
	description: `Details of product ${data.product?.name}`
}
let wishlisted = false,
	productReview = {}
let loading = false
let bounceItemFromTop = false
let showEditor = false
let cartButtonText = 'Add to Bag'
let sizes = ['100x200', '200x400', '400x800']
let selectedSize
let moreOptions = [
	{ type: 'checkbox', title: 'Add Flexible Glass Screen Guard ₹29.00' },
	{ type: 'checkbox', title: 'Add Same Design Key Chain ₹29.00' },
	{ type: 'checkbox', title: 'Add Same Design Phone Grip ₹49.00' }
]
let showReviewsCount = 1
let isLastReview = false
let shake = false
let selectedOptions = {}
let showPhotosModal = false
let loadingForWishlist = false
let isWislisted = false
let customizedImg
let showUserInputForm = false
let y
let showStickyCartButton = true
let screenWidth

$: if (y > 500) {
	showUserInputForm = true
}

if (data.product?.size?.name === 'One Size') {
	selectedSize = 'One Size'
}

onMount(async () => {
	try {
		// console.log(' data.product?._id = ', data.product?._id)

		productReview = await getAPI(
			`reviews/product-reviews?pid=${data.product?._id}`,
			$page.data.origin
		)
		isWislisted = await getAPI(
			`wishlists/check?product=${data.product?._id}&variant=${data.product?._id}&store=${$page.data?.store?.id}`,
			$page.data.origin
		)

		// console.log('productReview', productReview)
		// console.log('isWislisted', isWislisted)
	} catch (e) {
		// toast(e, 'error')
	} finally {
	}
})

function handleShowReviewsCount(showReviewsCount) {
	if (showReviewsCount >= productReview?.data?.count) {
		return (isLastReview = true)
	}
}

function selectSize(s) {
	selectedSize = s.name
}
// This is used only for customized product else cart?/add
async function addToBag(p, customizedImg, customizedJson) {
	const parsedJsonData = JSON.parse(customizedJson)
	if (p.isCustomized && parsedJsonData?.children[0].children.length < 3) {
		return toast('Please select the design.', 'error')
	}
	loading = true
	cartButtonText = 'Adding...'

	try {
		const cart = await post(
			'carts/add-to-cart',
			{
				pid: p._id,
				vid: p._id,
				qty: 1,
				options: p.options,
				customizedImg: customizedImg,
				customizedData: customizedJson
			},
			$page.data.origin
		)
		if (cart) {
			const cookieCart = {
				cartId: cart?.cart_id,
				items: cart?.items,
				qty: cart?.qty,
				tax: cart?.tax,
				subtotal: cart?.subtotal,
				total: cart?.total,
				currencySymbol: cart?.currencySymbol,
				discount: cart?.discount,
				selfTakeout: cart?.selfTakeout,
				shipping: cart?.shipping,
				unavailableItems: cart?.unavailableItems,
				formattedAmount: cart?.formattedAmount
			}
			cookies.set('cartId', cookieCart.cartId, { path: '/' })
			cookies.set('cartQty', cookieCart.qty, { path: '/' })
			// cookies.set('cart', JSON.stringify(cookieCart), { path: '/' })
			// cartButtonText = 'Added To Cart'
			bounceItemFromTop = true
		}

		await invalidateAll()

		cartButtonText = 'Go to cart'
		p.qty < 0 ? fireGTagEvent('remove_from_cart', cart) : fireGTagEvent('add_to_cart', cart)

		// const res = await getAPI('carts/my')

		// if (res) {

		if (customizedImg) {
			goto(`/checkout/address`)
		}
	} catch (e) {
		toast(e, 'error')
		cartButtonText = 'Error Add To Cart'
	} finally {
		loading = false
		await delay(5000)
		cartButtonText = 'Add to bag'
		bounceItemFromTop = false
	}
}

// let windowHeight
// let cartButtonPosition = 0
// onMount(() => {
// 	let elem = document.getElementById('cartButton')
// 	let rect = elem.getBoundingClientRect()
// 	const ActualCartButtonPosition = rect.y
// 	cartButtonPosition = ActualCartButtonPosition - windowHeight + 280
// })

function cartButtonEnterViewport() {
	if (y > 0) {
		showStickyCartButton = false
	} else {
		showStickyCartButton = true
	}
}

function cartButtonExitViewport() {
	if (y < 400) {
		showStickyCartButton = true
	} else {
		showStickyCartButton = false
	}
}

function alertToSelectMandatoryOptions() {
	// Raised by AddToCart Button at detail page
	toast('Please select a size', 'error')

	const el = document.getElementsByClassName('sizeSelector')[0]
	if (el) {
		el.scrollIntoView({ behavior: 'smooth' })
	}

	shake = true
	setTimeout(() => {
		shake = false
	}, 3000)
}

function optionChanged(o) {
	const o1 = []
	for (const i in o) {
		if (Array.isArray(o[i])) o1.push({ option: i, values: o[i] })
		else o1.push({ option: i, values: [o[i]] })
	}

	// console.log('oooooooooooooooooo', o)
	// console.log('dddddddddddddd', o1)

	this.selectedOptions = o1
	//   if (!this.selectedOptions) this.selectedOptions = []
	//   for (const i in o) {
	//     this.selectedOptions.push({ option: i, values: [o[i]] })
	//   }

	//   console.log('occccccccccccccccccccccc', this.selectedOptions)
	// },

	// dateChanged(o) {
	//   if (!this.selectedOptions) this.selectedOptions = []
	//   this.selectedOptions.push(o)

	//   console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', this.selectedOptions)
}

async function toggleWishlist(id) {
	if (!$page.data.me) {
		goto('/auth/otp-login')
	}
	try {
		loadingForWishlist = true
		isWislisted = await post(`wishlists/toggle`, { product: id, variant: id }, $page.data.origin)
	} catch (e) {
	} finally {
		loadingForWishlist = false
	}
}

function scrollTo(elementId) {
	let element
	if (elementId.detail) {
		// console.log('elementId = ', elementId.detail)

		element = document.getElementById(elementId.detail)
	} else {
		// console.log('elementId = ', elementId)

		element = document.getElementById(elementId)
	}
	window.scroll({
		behavior: 'smooth',
		left: 0,
		top: element.offsetTop - 100
	})
}

function handleGallery(img) {
	selectedImgCdn = img
	showPhotosModal = true
}

function handleMobileCanvas() {
	if (screenWidth < 640 && showEditor === false) {
		showEditor = true
	}
}
</script>

<!-- <SEO {...seoProps} /> -->

<svelte:window bind:scrollY="{y}" />

<svelte:head>
	<title>{data.product?.name}</title>
</svelte:head>

<div class="mb-20 min-h-screen p-3 sm:mb-0 sm:p-10">
	<div class="container mx-auto">
		<!-- Breadcrumb -->

		<div class="mb-5">
			<Breadcrumb
				categoryPool="{data.product?.categoryPool}"
				currentProductName="{data.product?.name}" />
		</div>

		<div class="mb-5 grid grid-cols-1 items-start gap-5 sm:mb-10 sm:gap-10 lg:grid-cols-5">
			<!-- Images -->

			<div class="col-span-1 h-auto lg:col-span-3">
				<div
					class="flex w-full grid-cols-2 flex-row gap-2 overflow-x-scroll scrollbar-none md:grid">
					{#if data?.product?.imagesCdn?.length}
						{#each data.product?.imagesCdn as imgCdn}
							<button
								type="button"
								class="w-full flex-shrink-0 cursor-zoom-in overflow-hidden rounded md:h-full md:w-full md:flex-shrink"
								on:click="{() => handleGallery(imgCdn)}">
								<LazyImg
									src="{imgCdn}"
									alt="{data.product?.name}"
									width="416"
									height="600"
									class="h-full w-full transform object-contain object-center transition duration-700" />
							</button>
						{/each}
					{/if}
				</div>
			</div>

			<div class="col-span-1 lg:col-span-2">
				<!-- Brand -->

				{#if data.product?.brand?.name}
					<h1 class="mb-1 text-xl sm:text-2xl"><b>{data.product?.brand?.name}</b></h1>
				{/if}

				<!-- Name -->

				{#if data.product?.name}
					<p class="mb-2 text-lg text-gray-500">
						{data.product?.name}
					</p>
				{/if}

				<!-- ratings -->

				{#if productReview?.summary?.avg > 0}
					<button
						type="button"
						class="mb-5 flex max-w-max items-center divide-x-2 divide-gray-300 border border-gray-300 py-1 text-sm focus:outline-none"
						on:click="{() => scrollTo('ratings-and-reviews')}">
						<div class="flex items-center gap-1 px-2 font-semibold">
							<span> {productReview?.summary?.avg} </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 text-primary-500"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
								</path>
							</svg>
						</div>

						<span class="px-2 text-gray-500"> {productReview?.summary?.count} Ratings </span>
					</button>
				{/if}

				<hr class="mb-5 w-full border-t border-gray-300" />

				<!-- prices -->

				<div class="mb-2 flex flex-wrap items-center gap-4">
					<span class="text-xl sm:text-2xl whitespace-nowrap"
						><b>{data.product?.formattedPrice}</b></span>

					{#if data.product?.mrp > data.product?.price}
						<span class="text-lg text-gray-500 sm:text-xl whitespace-nowrap">
							<strike>{data.product?.formattedMrp}</strike>
						</span>

						{#if Math.floor(((data.product?.mrp - data.product?.price) / data.product?.mrp) * 100) > 0}
							<span class="text-lg font-semibold text-primary-500 sm:text-xl whitespace-nowrap">
								({Math.floor(
									((data.product?.mrp - data.product?.price) / data.product?.mrp) * 100
								)}% off)
							</span>
						{/if}
					{/if}
				</div>

				<p class="mb-5 text-sm font-semibold text-green-600">Inclusive of all taxes</p>

				<!-- New and Tags -->

				{#if data.product?.tags?.length || data.product?.new}
					<div class="mb-5 flex flex-wrap gap-1">
						{#if data.product?.new}
							<div class="bg-red-500 py-1 px-2 text-xs font-semibold uppercase text-white">New</div>
						{/if}

						{#if data.product?.tags?.length}
							{#each data.product?.tags as tag}
								<div
									class="py-1 px-2 text-xs font-semibold uppercase text-white"
									style="background-color: {tag.colorCode};">
									{tag.name}
								</div>
							{/each}
						{/if}
					</div>
				{/if}

				<!-- Size -->

				{#if data.product?.size}
					<div class="mb-5">
						<h6 class="mb-5 flex items-center gap-2 font-semibold uppercase">
							<span> Select Size </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
								></path>
							</svg>
						</h6>

						<div class="flex flex-wrap gap-2">
							<button
								type="button"
								class="overflow-hidden rounded border py-1 px-3 text-sm font-medium uppercase transition duration-500 focus:outline-none
              				{data.product?.size?.name === selectedSize
									? 'bg-primary-500 border-primary-500 text-white'
									: 'bg-transparent border-gray-300 text-gray-500 hover:border-primary-500 hover:text-primary-500'}"
								on:click="{() => selectSize(data.product?.size)}">
								{data.product?.size?.name}
							</button>
						</div>
					</div>
				{/if}

				<!-- {#if moreOptions?.length > 0}
				<div class="mb-5 flex flex-col gap-2">
					{#each moreOptions as option}
						<label for="{option.title}" class="flex items-center gap-2 text-sm font-medium">
							{#if option.type === 'checkbox'}
								<input type="checkbox" name="{option.title}" id="{option.title}" class="h-4 w-4" />
							{/if}

							<span>
								{option.title}
							</span>
						</label>
					{/each}
				</div>
			{/if} -->

				<!-- select options  -->

				{#if data.product?.options?.length > 0}
					<div class="sizeSelector mb-5 items-center gap-3 text-sm" class:shake-animation="{shake}">
						{#each data.product?.options as o}
							<div class="flex flex-col items-start sm:flex-row">
								<h6 class="mb-1 w-full flex-shrink-0 font-medium sm:mb-0 sm:w-52">
									{o.name}
								</h6>

								<!-- dropdown -->

								{#if o.inputType == 'dropdown'}
									<select
										bind:value="{selectedOptions[o.id]}"
										class="w-full max-w-xs flex-1 rounded-md border border-gray-300 py-1.5 text-sm font-light placeholder-gray-400 transition duration-300 focus:outline-none hover:bg-white"
										on:change="{() => optionChanged(selectedOptions)}">
										{#each o.values as i}
											<option value="{i.id}">
												{i.name}
											</option>
										{/each}
									</select>

									<!-- textbox -->
								{:else if o.inputType == 'textbox'}
									<Textbox
										bind:value="{selectedOptions[o.id]}"
										type="text"
										on:change="{() => optionChanged(selectedOptions)}" />

									<!-- date -->
								{:else if o.inputType == 'date'}
									<Textbox
										id="start"
										bind:value="{selectedOptions[o.id]}"
										type="date"
										on:change="{() => optionChanged(selectedOptions)}" />

									<!-- daterange -->
								{:else if o.inputType == 'daterange'}
									<span>Date range picker is not found</span>

									<!-- <date-picker
									bind:value="{selectedOptions[o.id]}"
									class="max-w-xs flex-1"
									type="date"
									:disabled-date="disabledBeforeTodayAndAfterAWeek"
									range
									@change="$emit('optionChanged', selectedOptions)"></date-picker> -->

									<!-- textarea -->
								{:else if o.inputType == 'textarea'}
									<Textarea
										bind:value="{selectedOptions[o.id]}"
										on:change="{() => optionChanged(selectedOptions)}" />

									<!-- size -->
								{:else if o.inputType == 'size'}
									<div class="flex flex-wrap">
										{#each o.values as i}
											<label
												class="rouned-md mr-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 text-gray-500 focus:outline-none focus:ring-0 focus:ring-offset-0 hover:border-primary-500 hover:font-bold hover:text-primary-500
											{selectedOptions[o.id] == i.id
													? ` border-primary-500 bg-primary-500 text-white`
													: `bg-gray-100 border-gray-400`}">
												<div class="text-xs uppercase sm:text-sm">
													{i.name}
												</div>

												<input
													bind:value="{selectedOptions[o.id]}"
													type="radio"
													class="hidden"
													on:change="{() => optionChanged(selectedOptions)}" />
											</label>
										{/each}
									</div>

									<!-- color -->
								{:else if o.inputType == 'color'}
									<div class="flex flex-wrap">
										{#each o.values as i}
											<label
												class="mr-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 focus:outline-none focus:ring-0 focus:ring-offset-0 hover:font-bold first-letter:{selectedOptions[
													o.id
												] == i.id
													? `border-primary-500 text-white`
													: `border-gray-300 text-black`}"
												style="{selectedOptions[o.id] == i.id ? `background-color:${i.name}` : ``}">
												<div class="text-xs">{i.name}</div>

												<input
													bind:value="{selectedOptions[o.id]}"
													type="radio"
													class="hidden"
													on:change="{() => optionChanged(selectedOptions)}" />
											</label>
										{/each}
									</div>

									<!-- radio -->
								{:else if o.inputType == 'radio'}
									<div class="flex flex-wrap gap-2">
										{#each o.values as v}
											<Radio
												id="{v.id}"
												bind:value="{selectedOptions[o.id]}"
												on:change="{() => dispatch('optionChanged', selectedOptions)}">
												<span class="text-gray-500">{v.name}</span>
											</Radio>
										{/each}
									</div>

									<!-- checkbox -->
								{:else if o.inputType == 'checkbox'}
									<div class="flex flex-wrap gap-2">
										{#each o.values as v, i}
											<Checkbox name="{v.id}" bind:selectedItems="{selectedOptions[o.id]}">
												{v.name}
											</Checkbox>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				<!-- Add to Cart -->

				<div
					use:viewport
					on:enterViewport="{cartButtonEnterViewport}"
					on:exitViewport="{cartButtonExitViewport}">
				</div>

				{#if !data.product?.isCustomized}
					<div
						class="box-shadow itmes-center fixed inset-x-0 bottom-0 z-50 grid w-full grid-cols-5 gap-2 border-t bg-white p-2 uppercase md:static md:mb-5 md:grid-cols-2 md:border-t-0 md:bg-transparent md:p-0 lg:max-w-sm">
						<div class="col-span-2 md:col-span-1">
							<WhiteButton
								type="button"
								loadingringsize="sm"
								loading="{loadingForWishlist}"
								class="w-full text-sm"
								on:click="{() => toggleWishlist(data.product?._id)}">
								{#if isWislisted}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 text-red-500"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
											clip-rule="evenodd"></path>
									</svg>

									<span>Wishlisted</span>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 flex-shrink-0"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										></path>
									</svg>

									<span>Wishlist</span>
								{/if}
							</WhiteButton>
						</div>

						<div class="col-span-3 md:col-span-1">
							{#if cartButtonText === 'Go to cart'}
								<a
									class="relative flex w-full transform items-center justify-center overflow-hidden rounded-md border border-primary-500 bg-primary-500 px-4 py-2 text-center text-sm font-semibold tracking-wider text-white shadow-md transition duration-700 focus:outline-none
								focus:ring-0 focus:ring-offset-0 hover:border-primary-700 hover:bg-primary-700"
									href="/cart"
									data-sveltekit-prefetch>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 flex-shrink-0"
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

									<span class="ml-2">
										{cartButtonText}
									</span>
								</a>
							{:else}
								<form
									action="/cart?/add"
									method="POST"
									use:enhance="{() => {
										return async ({ result }) => {
											result.data.qty < 0
												? fireGTagEvent('remove_from_cart', result.data)
												: fireGTagEvent('add_to_cart', result.data)

											// cartButtonText = 'Added To Cart'
											bounceItemFromTop = true
											setTimeout(() => {
												bounceItemFromTop = false
											}, 3000)
											// cartButtonText = 'Go to cart'
											if (customizedImg) {
												goto(`/checkout/address`)
											}
											invalidateAll()

											await applyAction(result)
										}
									}}">
									<input type="hidden" name="pid" value="{data?.product?._id}" />
									<input type="hidden" name="vid" value="{data?.product?._id}" />
									<input type="hidden" name="qty" value="{1}" />
									<input
										type="hidden"
										name="options"
										value="{JSON.stringify(data?.product?.options)}" />
									<input type="hidden" name="customizedImg" value="{customizedImg}" />
									<PrimaryButton
										type="submit"
										loading="{loading}"
										loadingringsize="sm"
										class="w-full text-sm">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 flex-shrink-0"
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
								</form>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Product Details -->

				{#if data.product?.description}
					<div class="mb-5">
						<h6 class="mb-5 flex items-center gap-2 font-semibold uppercase">
							<span> Product Details </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
								></path>
							</svg>
						</h6>

						<div class="prose text-sm overflow-hidden">
							{@html data.product?.description}
						</div>
					</div>
				{/if}

				<!-- Description -->

				{#if data.product?.longDescription}
					<div class="mb-5">
						<h6 class="mb-5 flex items-center gap-2 font-semibold uppercase">
							<span> Description </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1"
								stroke="currentColor"
								class="h-5 w-5">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
								></path>
							</svg>
						</h6>

						<div class="prose text-sm overflow-hidden">
							{@html data.product?.longDescription}
						</div>
					</div>
				{/if}

				<hr class="mb-5 w-full border-t border-gray-300" />

				<!-- Delivery Options -->

				<div class="mb-5">
					<h6 class="mb-5 flex items-center gap-2 font-semibold uppercase">
						<span> Delivery Options </span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1"
							stroke="currentColor"
							class="h-5 w-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
							></path>
						</svg>
					</h6>

					<DeliveryOptions product="{data.product}" />
				</div>

				<hr class="mb-5 w-full border-t border-gray-300" />

				<!-- Ratings & Reviews -->

				<div id="ratings-and-reviews" class="mb-5">
					<h6 class="mb-5 flex items-center gap-2 font-semibold uppercase">
						<span> Ratings </span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="1">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
							></path>
						</svg>
					</h6>

					{#if productReview?.summary?.avg > 0 && productReview?.ratings?.length}
						<div class="mb-5">
							<div class="tems-center flex">
								<div
									class="flex max-w-max flex-col items-center justify-center border-r border-gray-300 px-4 text-center">
									<h1 class="mb-2 flex items-end gap-2">
										<span class="text-4xl sm:text-5xl"> {productReview?.summary?.avg} </span>

										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-6 w-6 text-primary-500"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
											></path>
										</svg>
									</h1>

									<p class="text-sm">{productReview?.summary?.count} Verified Buyers</p>
								</div>

								<div class="flex w-full max-w-xs flex-1 flex-col-reverse px-4">
									{#each productReview?.ratings as r}
										<div class="mb-2 flex items-center justify-center gap-2 text-xs leading-3">
											<div class="flex w-8 items-center gap-1">
												<span class="font-bold">{r._id}</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-4 w-4 text-gray-300"
													viewBox="0 0 20 20"
													fill="currentColor">
													<path
														d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
													></path>
												</svg>
											</div>

											<div class="relative h-1 w-full rounded-full bg-gray-300">
												<div
													class="absolute inset-y-0 left-0 rounded-full bg-green-500"
													style="width: {r.percent}%">
												</div>
											</div>

											<span class="w-8 text-right text-gray-500">
												{r.count}
											</span>
										</div>
									{/each}
								</div>
							</div>
						</div>

						<hr class="mb-5 w-full border-t border-gray-300" />

						{#if productReview?.data?.count > 0}
							<div class="mb-5">
								<h2 class="mb-5 font-semibold">Customer Reviews ({productReview?.data?.count})</h2>

								{#each productReview?.data?.data as review, rx}
									{#if rx + 1 <= showReviewsCount}
										<div class="mb-5 flex items-start gap-4">
											<div
												class="flex max-w-max items-center gap-0.5 rounded bg-primary-500 px-1.5 py-0.5 text-xs font-semibold text-white">
												<span>
													{review.rating}
												</span>

												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-3 w-3"
													viewBox="0 0 20 20"
													fill="currentColor">
													<path
														d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
													></path>
												</svg>
											</div>

											<div class="flex-1 text-sm">
												<p class="mb-2 first-letter:uppercase">
													{review.message}
												</p>

												<div class="flex items-center gap-2 text-gray-500">
													{#if review.user?.fullName}
														<span>{review.user?.fullName}</span>

														<span class="h-4 border-l border-gray-300"></span>
													{/if}

													<span>{date(review.createdAt)}</span>
												</div>
											</div>
										</div>
									{/if}
								{/each}

								{#if productReview?.data?.data?.length > showReviewsCount}
									{#if !isLastReview}
										<button
											type="button"
											class="text-sm font-semibold text-primary-500 transition duration-300 focus:outline-none hover:text-primary-700"
											on:click="{() => handleShowReviewsCount(showReviewsCount)}">
											Show More
										</button>
									{:else}
										<button
											type="button"
											class="text-sm font-semibold text-primary-500 transition duration-300 focus:outline-none hover:text-primary-700"
											on:click="{() => (showReviewsCount = 1)}">
											Show Less
										</button>
									{/if}
								{/if}
							</div>
						{/if}
					{:else}
						<div class="mb-5 text-sm">
							No reviews yet, be the first one to review the data.product?.
						</div>
					{/if}

					<button
						type="button"
						class="group flex items-center gap-1 text-sm font-bold text-primary-500 focus:outline-none hover:text-primary-700"
						on:click="{() =>
							goto(
								`/my/reviews/create?product=${data.product?._id}&ref=/product/${data.product?.slug}`
							)}">
						<span>Add Your Review</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 transform transition duration-500 group-hover:translate-x-2"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"></path>
						</svg>
					</button>
				</div>

				<hr class="mb-5 w-full" />

				<!-- YouTube video player -->

				<div class="mb-5">
					<iframe
						class="h-[40vh] w-full"
						data-src="https://www.youtube.com/embed/IZrF9BEFQC4"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen>
					</iframe>
				</div>
			</div>
		</div>

		{#if data.product?.crossSells?.length > 0}
			<hr class="mb-5 w-full sm:mb-10" />

			<div class="mb-5 sm:mb-10">
				<h2 class="mb-5 text-lg font-bold capitalize sm:text-xl md:text-2xl">
					Frequently bought together
				</h2>

				<div
					class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:mb-20 lg:gap-6">
					{#each data.product?.crossSells as csp}
						<FrequentlyBoughtProduct product="{csp}" />
					{/each}

					{#each { length: 7 } as _}
						<div class="hidden sm:block">
							<DummyProductCard />
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if data.relatedProducts?.data?.length}
			<hr class="mb-5 w-full sm:mb-10" />

			<SimilarProducts similarProducts="{data.relatedProducts?.data}" />
		{/if}
	</div>
</div>

{#if bounceItemFromTop}
	<AnimatedCartItem img="{data.product?.imgCdn}" />
{/if}
