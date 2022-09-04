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
// import Cookie from 'cookie-universal'
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
import { goto, invalidate } from '$app/navigation'
import DeliveryOptions from './_DeliveryOptions.svelte'
import WhiteButton from '$lib/ui/WhiteButton.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import SimilarProducts from '$lib/components/Product/SimilarProducts.svelte'
import FrequentlyBoughtProduct from './_FrequentlyBoughtProduct.svelte'

const dispatch = createEventDispatcher()

// const cookies = Cookie()

export let data

// console.log('data = ', data)

let seoProps = {
	title: `Details of product ${data.product?.name}`,
	description: `Details of product ${data.product?.name}`
}

let wishlisted = false,
	productReview = {}

let loading = false
let bounceItemFromTop = false
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
let selectedImgCdn = data.product?.imagesCdn[0]

if (data.product?.size?.name === 'One Size') {
	selectedSize = 'One Size'
}

onMount(async () => {
	try {
		// console.log(' data.product?._id = ', data.product?._id)

		productReview = await getAPI(`reviews/product-reviews?pid=${data.product?._id}`)
		isWislisted = await getAPI(
			`wishlists/check?product=${data.product?._id}&variant=${data.product?._id}&store=${$page.data?.store?.id}`
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

async function addToBag(p) {
	loading = true
	cartButtonText = 'Adding...'

	try {
		await post('carts/add-to-cart', {
			pid: p._id,
			vid: p._id,
			qty: 1,
			options: p.options
		})

		// console.log('zzzzzzzzzzzzzzzzzz',);

		await invalidate($page.url.toString())
		cartButtonText = 'Go to cart'

		// const res = await getAPI('carts/my')

		// if (res) {
		// 	const cookieCart = {
		// 		items: res?.items,
		// 		qty: res?.qty,
		// 		tax: res?.tax,
		// 		subtotal: res?.subtotal,
		// 		total: res?.total,
		// 		currencySymbol: res?.currencySymbol,
		// 		discount: res?.discount,
		// 		selfTakeout: res?.selfTakeout,
		// 		shipping: res?.shipping,
		// 		unavailableItems: res?.unavailableItems,
		// 		formattedAmount: res?.formattedAmount
		// 	}
		// 	await cookies.set('cart', cookieCart, { path: '/' })
		// 	$page.data.cart = cookieCart
		// 	cartButtonText = 'Added To Cart'
		// 	bounceItemFromTop = true
		// }
	} catch (e) {
		cartButtonText = 'Error adding To Cart'
	} finally {
		loading = false
		await delay(5000)
		cartButtonText = 'Add to bag'
		bounceItemFromTop = false
	}
}

let y
let showStickyCartButton = true

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
		isWislisted = await post(`wishlists/toggle`, { product: id, variant: id })
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
</script>

<!-- <SEO {...seoProps} /> -->

<svelte:window bind:scrollY="{y}" />

<svelte:head>
	<title>{data.product?.name}</title>
</svelte:head>

<div
	class="container mx-auto mb-20 p-3 sm:mb-0 sm:py-5
	{showPhotosModal ? 'h-[90vh] overflow-hidden' : 'min-h-screen'}">
	<!-- Breadcrumb -->

	<div class="mb-5">
		<Breadcrumb
			data="{[
				{ label: 'Home', link: '/' },

				{ label: 'Products', link: '/search' },

				{ label: data.product?.name }
			]}" />
	</div>

	<div class="mb-5 grid grid-cols-1 items-start gap-5 sm:mb-10 sm:gap-10 lg:grid-cols-5">
		<!-- Images -->

		<div class="col-span-1 h-auto lg:col-span-3">
			<div class="flex w-full grid-cols-2 flex-row gap-2 overflow-x-scroll scrollbar-none md:grid">
				{#each data.product?.imagesCdn as imgCdn}
					<button
						type="button"
						class="h-60 w-52 flex-shrink-0 cursor-zoom-in overflow-hidden rounded md:h-full md:w-full md:flex-shrink"
						on:click="{() => (showPhotosModal = true)}">
						<LazyImg
							src="{imgCdn}"
							alt="{data.product?.name}"
							width="208"
							height="240"
							class="h-full w-full transform object-contain object-center transition duration-700 hover:scale-125" />
					</button>
				{/each}
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

			<div class="mb-2 flex items-center gap-4">
				<span class="text-xl sm:text-2xl"><b>{data.product?.formattedPrice}</b></span>

				<span class="text-lg text-gray-500 sm:text-xl">
					<strike>{data.product?.formattedMrp}</strike>
				</span>

				<span class="text-lg font-semibold text-primary-500 sm:text-xl">
					({data.product?.discount}% OFF)
				</span>
			</div>

			<p class="mb-5 text-sm font-semibold text-green-600">Inclusive of all taxes</p>

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
				<div class="sizeSelector mb-3 items-center gap-3 text-sm" class:shake-animation="{shake}">
					{#each data.product?.options as o}
						<div class="flex flex-col items-start sm:flex-row">
							<h6 class="mb-1 w-full flex-shrink-0 font-medium sm:mb-0 sm:w-52">
								{o.name}
							</h6>

							<!-- dropdown -->

							{#if o.inputType == 'dropdown'}
								<select
									bind:value="{selectedOptions[o.id]}"
									class="w-full max-w-xs flex-1 rounded-md border border-gray-300 py-1.5 text-sm font-light placeholder-gray-400 transition duration-300 hover:bg-white focus:outline-none"
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
											class="rouned-md mr-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 text-gray-500 hover:border-primary-500 hover:font-bold hover:text-primary-500 focus:outline-none focus:ring-0 focus:ring-offset-0
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
											class="mr-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 hover:font-bold focus:outline-none focus:ring-0 focus:ring-offset-0 first-letter:{selectedOptions[
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

			<div
				class="box-shadow itmes-center fixed inset-x-0 bottom-0 z-50 grid w-full max-w-sm grid-cols-5 gap-2 border-t bg-white p-2 uppercase md:static md:mb-5 md:grid-cols-1 md:border-t-0 md:bg-transparent md:p-0 lg:grid-cols-2">
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
							class="relative flex w-full transform items-center justify-center overflow-hidden rounded-md border border-primary-500 bg-primary-500 px-4 py-2 text-center text-sm font-semibold tracking-wider text-white shadow-md transition duration-700 hover:border-primary-700
								hover:bg-primary-700 focus:outline-none focus:ring-0 focus:ring-offset-0"
							href="/cart"
							sveltekit:prefetch>
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
						<PrimaryButton
							type="button"
							loading="{loading}"
							loadingringsize="sm"
							class="w-full text-sm"
							on:click="{() => addToBag(data.product)}">
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
					{/if}
				</div>
			</div>

			<!-- Product Details -->

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

				<p class="prose text-sm">
					{@html data.product?.description}
				</p>
			</div>

			<hr class="mb-5 w-full border-t border-gray-300" />

			<!-- Delivery Options -->

			<div class="mb-5">
				<h6 class="mb-5 flex items-center gap-2 font-semibold uppercase">
					<span> Delivery Options </span>

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

				{#if productReview?.summary?.avg > 0}
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

							{#if !isLastReview}
								<button
									type="button"
									class="text-sm font-semibold text-primary-500 transition duration-300 hover:text-primary-700 focus:outline-none"
									on:click="{() => handleShowReviewsCount(showReviewsCount)}">
									Show More
								</button>
							{:else}
								<button
									type="button"
									class="text-sm font-semibold text-primary-500 transition duration-300 hover:text-primary-700 focus:outline-none"
									on:click="{() => (showReviewsCount = 1)}">
									Show Less
								</button>
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
					class="group flex items-center gap-1 text-sm font-bold text-primary-500 hover:text-primary-700 focus:outline-none"
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
					class="lazy h-[40vh] w-full"
					data-src="https://www.youtube.com/embed/n95DT3K0Yac"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen>
				</iframe>
			</div>
		</div>
	</div>

	{#if data.relatedProducts?.length > 0}
		<hr class="mb-5 w-full sm:mb-10" />

		<div class="mb-5 sm:mb-10">
			<h2 class="mb-5 text-lg font-bold capitalize sm:text-xl md:text-2xl">
				Frequently bought together
			</h2>

			<div class="flex flex-wrap items-end gap-4 sm:gap-6">
				{#each data.relatedProducts as rp}
					<FrequentlyBoughtProduct product="{rp}" />
				{/each}
			</div>
		</div>
	{/if}

	<hr class="mb-5 w-full sm:mb-10" />

	<SimilarProducts similarProducts="{data.product?.relatedProducts}" />
</div>

{#if showPhotosModal}
	<div
		class="frosted-black overflow-hiddentext-gray-800 fixed inset-0 z-[60] flex h-screen w-screen items-center justify-center sm:p-10 lg:p-20"
		transition:fade>
		<button
			type="button"
			class="fixed top-2 right-2 transform cursor-pointer text-gray-200 transition duration-300 hover:scale-125 hover:text-white lg:top-5 lg:right-5"
			on:click="{() => (showPhotosModal = false)}">
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

		<div class="carousel bg-black md:hidden">
			{#each data.product?.imagesCdn as imgCdn, ix}
				<div id="{`slide${ix}`}" class="carousel-item h-auto w-full">
					{#if imgCdn}
						<img src="{imgCdn}" alt=" " class="h-auto w-full object-contain object-center" />
					{/if}
				</div>
			{/each}
		</div>

		<div
			class="container relative mx-auto hidden  h-full w-full flex-col items-center justify-between gap-4 overflow-hidden rounded-md bg-black md:flex lg:flex-row">
			{#if selectedImgCdn}
				<div
					class="flex h-full w-full flex-1 items-center justify-center overflow-hidden px-5 sm:px-10">
					<img
						src="{selectedImgCdn}"
						alt=" "
						width="1000"
						class="h-full w-full object-contain object-center" />
				</div>
			{/if}

			<div class=" w-full flex-shrink-0 bg-white py-5 lg:h-full lg:w-auto">
				<div class="mb-2 px-5">
					<h1 class="mb-1 font-bold sm:text-lg">Photos for {data.product?.name}</h1>

					<p class="text-sm">{data.product?.imagesCdn?.length} photos available</p>
				</div>

				<div
					class=" grid grid-cols-3 gap-2 overflow-y-auto overflow-x-hidden px-5 scrollbar-thin scrollbar-thumb-slate-300 lg:max-h-[70vh] lg:grid-cols-2">
					{#each data.product?.imagesCdn as imgCdn}
						{#if imgCdn}
							<button
								type="button"
								class="relative z-0 col-span-1 focus:outline-none"
								on:click="{() => (selectedImgCdn = imgCdn)}">
								<LazyImg
									src="{imgCdn}"
									alt=""
									height="240"
									class="h-40 w-full rounded-md object-cover object-center sm:h-60" />

								<div
									class="absolute inset-0 z-10 h-full w-full bg-white  
                                        {selectedImgCdn === imgCdn
										? 'bg-opacity-0'
										: 'bg-opacity-50'}">
								</div>
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

{#if bounceItemFromTop}
	<AnimatedCartItem img="{data.product?.imgCdn}" />
{/if}
