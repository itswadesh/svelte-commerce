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
// import UserForm from '$lib/components/Product/UserForm.svelte'
import { applyAction, enhance } from '$app/forms'
import { CartService, WishlistService } from '$lib/services'
import { currency, delay, toast } from '$lib/utils'
import { fireGTagEvent } from '$lib/utils/gTag'
import { getAPI } from '$lib/utils/api'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { provider } from '$lib/config'
import AnimatedCartItem from '$lib/components/AnimatedCartItem.svelte'
import Breadcrumb from '$lib/components/Breadcrumb.svelte'
import CategoryPoolButtons from './_CategoryPoolButtons.svelte'
import Checkbox from '$lib/ui/Checkbox.svelte'
import CheckboxOfMultiProducts from '$lib/ui/CheckboxOfMultiProducts.svelte'
import Cookie from 'cookie-universal'
import DeliveryOptions from './_DeliveryOptions.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import FrequentlyBoughtProduct from './_FrequentlyBoughtProduct.svelte'
import Gallery from '$lib/components/Product/Gallery.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductNav from '$lib/ProductNav.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'
import Radio from '$lib/ui/Radio.svelte'
import RadioColor from '$lib/ui/RadioColor.svelte'
import RadioSize from '$lib/ui/RadioSize.svelte'
import RatingsAndReviews from '$lib/components/Product/RatingsAndReviews.svelte'
import RecomendedProducts from '$lib/components/Product/RecomendedProducts.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import SimilarProductsFromCategorySlug from '$lib/components/Product/SimilarProductsFromCategorySlug.svelte'
import SocialSharingButtons from '$lib/components/SocialSharingButtons.svelte'
import Textarea from '$lib/ui/Textarea.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import viewport from '$lib/actions/useViewPort'
import WhiteButton from '$lib/ui/WhiteButton.svelte'

const cookies = Cookie()

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

let seoProps = {
	// addressCountry: 'India',
	// addressLocality: 'Semiliguda, Koraput',
	// addressRegion: 'Odisha',
	// alternateJsonHref: '',
	// alternateXml: { title: '', href: '' },
	brand: `${$page?.data?.store?.websiteName}`,
	breadcrumbs: data.product?.categoryPool,
	caption: `${$page?.data?.store?.websiteName}`,
	category: data.product?.category?.name,
	contentUrl: data.product?.img || $page?.data?.store?.logo,
	createdAt: `${data.product?.createdAt || '_'}`,
	// depth: { unitCode: '', value: '' },
	email: `${$page?.data?.store?.email}`,
	// entityMeta: '',
	// facebookPage: '',
	// gtin: '',
	// height: '',
	id: $page?.url?.href,
	image: `${data.product?.img}`,
	logo: $page?.data?.store?.logo,
	// ogSquareImage: { url: 'https://lrnr.in/favicon.ico', width: 56, height: 56 },
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00'],
	popularity: data.product?.popularity,
	// postalCode: '764036',
	price: data.product?.price,
	priceRange: `${data.product?.price}-${data.product?.mrp}`,
	ratingCount: 1,
	ratingValue: +data.product?.ratings + 1,
	sku: data.product?.sku,
	// streetAddress: 'Padmajyoti Marg, Nandapur Road',
	timeToRead: 0,
	updatedAt: `${data.product?.updatedAt || '_'}`,
	// weight: { unitCode: '', value: '' },
	// width: { unitCode: '', value: '' },
	// wlwmanifestXmlHref: '',
	metadescription: data.product?.metaDescription,
	// article: false,
	canonical: `${$page?.url.href}`,
	datePublished: `${data.product?.publishedAt || '_'}`,
	description: ` ${data.product?.description}`,
	dnsPrefetch: `//cdn.jsdelivr.net`,
	// entityMeta: null,
	featuredImage: {
		url: `${data.product?.img}`,
		width: 675,
		height: 380,
		caption: data.product?.name
	},
	keywords: data.product?.keywords,
	lastUpdated: `${data.product?.updatedAt || '_'}`,
	msapplicationTileImage: `${data.product?.img}`,
	ogImage: { url: $page?.data?.store?.logo, width: 128, height: 56 },
	ogImageSecureUrl: `${$page?.data?.store?.logo}`,
	ogImageType: 'image/jpeg',
	ogSiteName: `${$page.data.origin}/sitemap/sitemap.xml`,
	productAvailability: `${data.product?.stock}`,
	productBrand: `${data.product?.brandName || `${$page?.data?.store?.websiteName}`}`,
	productName: `${data.product?.name}`,
	productPriceAmount: `${data.product?.price}`,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `${data.product?.slug}`,
	// timeToRead: 0,
	title: `${data.product?.name}`,
	twitterImage: { url: `${data.product?.img}` }
}

let bounceItemFromTop = false
let cartButtonText = 'Add to Bag'
let customizedImg
let isWislisted = false
let loading = false
let loadingForWishlist = false
let screenWidth
let selectedImgIndex
let selectedLinkiedProducts = []
let selectedOptions = []
let selectedOptions1 = []
let selectedReviewType = 'product_review'
let selectedSize
let shake = false
let showEditor = false
let showPhotosModal = false
let showStickyCartButton = true
let showUserInputForm = false
let y

$: if (y > 500) {
	showUserInputForm = true
}

if (data.product?.size?.name === 'One Size') {
	selectedSize = 'One Size'
}

onMount(async () => {
	screenWidth = screen.width

	try {
		isWislisted = await WishlistService.checkhWishlist({
			pid: data.product?._id,
			vid: data.product?._id,
			storeId: $page.data?.store?.id,
			origin: $page.data.origin
		})

		// console.log('isWislisted', isWislisted)
	} catch (e) {
		// toast(e, 'error')
	} finally {
	}
})

function selectSize(s) {
	selectedSize = s.name
}

function handleSelectedLinkiedProducts(e) {
	selectedLinkiedProducts = e.detail
	// console.log('selectedLinkiedProducts', selectedLinkiedProducts)
}

// This is used only for customized product else cart?/add
async function addToBag(p, customizedImg, customizedJson) {
	try {
		loading = true
		cartButtonText = 'Adding...'

		let cart = await CartService.addToCartService({
			pid: p._id,
			vid: p._id,
			qty: 1,
			options: selectedOptions,
			customizedImg: customizedImg,
			customizedData: customizedJson,
			store: $page.data.store?.id,
			origin: $page.data.origin,
			server: false,
			cookies
		})
		if (selectedLinkiedProducts?.length) {
			for (const i of selectedLinkiedProducts) {
				cart = await CartService.addToCartService({
					pid: i,
					vid: i,
					qty: 1,
					store: $page.data.store?.id,
					origin: $page.data.origin,
					server: false,
					cookies
				})
			}
		}
		// console.log('selectedLinkiedProducts inside add to cart function =', selectedLinkiedProducts)
		const response = await fetch('/server/cart')
		cart = await response.json()
		// console.error('Cart called after add to cart', cart.cart_id, cart.qty)
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
				savings: cart?.savings,
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
		await delay(3000)
		bounceItemFromTop = false
		cartButtonText = 'Add to bag'
	}
}

// let windowHeight
// let cartButtonPosition = 0
// onMount(() => {
//  let elem = document.getElementById('cartButton')
//  let rect = elem.getBoundingClientRect()
//  const ActualCartButtonPosition = rect.y
//  cartButtonPosition = ActualCartButtonPosition - windowHeight + 280
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

$: {
	const o1 = []
	for (const i in selectedOptions) {
		if (Array.isArray(selectedOptions[i])) o1.push({ option: i, values: o[i] })
		else o1.push({ option: i, values: [selectedOptions[i]] })
	}

	// console.log('oooooooooooooooooo', o)
	// console.log('dddddddddddddd', o1)

	//   if (!this.selectedOptions) this.selectedOptions = []
	//   for (const i in o) {
	//     this.selectedOptions.push({ option: i, values: [o[i]] })
	//   }

	//   console.log('occccccccccccccccccccccc', this.selectedOptions)
	// },

	// dateChanged(o) {
	//   if (!this.selectedOptions) this.selectedOptions = []
	//   this.selectedOptions.push(o)
	selectedOptions1 = o1
}

async function toggleWishlist(id) {
	if (!$page.data.me) {
		goto(`/auth/login?ref=/my/wishlist/add/${id}`)
	}

	try {
		loadingForWishlist = true
		isWislisted = await CartService.toggleWishlistService({
			pid: id,
			vid: id,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})
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

function handleGallery(index) {
	selectedImgIndex = index
	showPhotosModal = true
}

function handleMobileCanvas() {
	if (screenWidth < 640 && showEditor === false) {
		showEditor = true
	}
}
</script>

<SEO {...seoProps} />

<svelte:window bind:scrollY="{y}" />

<svelte:head>
	<title>{data.product?.name}</title>
</svelte:head>

<ProductNav
	cart="{$page?.data?.cart}"
	me="{$page?.data?.me}"
	productName="{data.product?.name}"
	url="{$page?.url?.href}"
	store="{$page?.data?.store}" />

<div class="min-h-screen lg:p-10">
	<div class="md:container md:mx-auto">
		<div class="mb-5 hidden lg:flex items-center justify-between gap-2">
			<!-- Breadcrumb -->

			<Breadcrumb
				categoryPool="{data.product?.categoryPool}"
				currentProductName="{data.product?.name}" />

			<!-- Social share button -->

			<SocialSharingButtons productName="{data.product?.name}" url="{$page?.url?.href}" />
		</div>

		<div class="mb-5 grid grid-cols-1 items-start gap-5 sm:mb-10 sm:gap-10 lg:grid-cols-5">
			<!-- Images -->

			<div class="col-span-1 h-auto lg:col-span-3">
				{#if !data.product?.isCustomized}
					<div
						class="flex w-full grid-cols-2 flex-row gap-2 overflow-x-scroll scrollbar-none md:grid">
						{#if data?.product?.images?.length}
							{#each data.product?.images as img, index}
								<button
									type="button"
									class="cursor-zoom-in overflow-hidden rounded md:flex-shrink w-full h-auto flex items-center justify-center shrink-0"
									on:click="{() => handleGallery(index)}">
									<LazyImg
										src="{img}"
										alt="{data.product?.name}"
										class="object-contain object-top w-full h-auto first-line:text-xs" />
								</button>
							{/each}
						{/if}
					</div>
				{/if}
			</div>

			<div class="col-span-1 lg:col-span-2 px-3 sm:px-10 lg:px-0">
				<!-- Brand -->

				{#if data.product?.brand?.name}
					<h2 class="mb-1 text-xl sm:text-2xl"><b>{data.product?.brand?.name}</b></h2>
				{/if}

				<!-- Name -->

				{#if data.product?.name}
					<div class="flex justify-between gap-2">
						<h1 class="flex-1 sm:text-lg text-gray-500">
							{data.product?.name}
						</h1>

						{#if $page?.data?.store?.isFnb && data.product.foodType}
							<div>
								{#if data.product.foodType === 'veg'}
									<img src="{productVeg}" alt="veg" class="h-5 w-5" />
								{:else if data.product.foodType === 'nonveg' || data.product.foodType === 'E'}
									<img src="{productNonVeg}" alt="non veg" class="h-5 w-5" />
								{/if}
							</div>
						{/if}
					</div>
				{/if}

				<!-- prices mobile -->

				<div class="mt-2 block sm:hidden">
					<div class="mb-2 flex flex-wrap items-center gap-2">
						<span class="whitespace-nowrap">
							<b>{currency(data.product?.price)}</b>
						</span>

						{#if data.product?.mrp > data.product?.price}
							<span class="whitespace-nowrap text-gray-400">
								<strike>{currency(data.product?.mrp)}</strike>
							</span>

							{#if data.product?.discount > 0}
								<span class="whitespace-nowrap font-semibold text-[#ff5a5a]">
									({data.product?.discount}% off)
								</span>
							{/if}
						{/if}
					</div>

					<p class="text-sm font-semibold text-green-700">Inclusive of all taxes</p>
				</div>

				<!-- ratings -->

				{#if data?.product?.reviews?.summary?.ratings_avg?.value > 0}
					<button
						type="button"
						class="mt-2 flex max-w-max items-center divide-x-2 divide-gray-300 border border-gray-300 py-1 text-sm focus:outline-none"
						on:click="{() => scrollTo('ratings-and-reviews')}">
						<div class="flex items-center gap-1 px-2 font-semibold">
							<span> {data?.product?.reviews?.summary?.ratings_avg?.value.toFixed(1)} </span>

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

						{#if data?.product?.reviews?.reviews?.length}
							<span class="px-2 text-gray-500">
								{data?.product?.reviews?.reviews?.length} Reviews
							</span>
						{/if}
					</button>
				{/if}

				<hr class="my-5 w-full border-t border-gray-300 block sm:hidden lg:block" />

				<!-- Delivery Options Mobile -->

				<div class="mb-5 sm:hidden block">
					<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
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

					<DeliveryOptions product="{data.product}" deliveryDetails="{data.deliveryDetails}" />
				</div>

				<!-- prices desktop -->

				<div class="hidden sm:block">
					<div class="mb-2 flex flex-wrap items-center gap-4">
						<span class="whitespace-nowrap text-xl sm:text-2xl">
							<b>{currency(data.product?.price)}</b>
						</span>

						{#if data.product?.mrp > data.product?.price}
							<span class="whitespace-nowrap text-lg text-gray-500 sm:text-xl">
								<strike>{currency(data.product?.mrp)}</strike>
							</span>

							{#if data.product?.discount > 0}
								<span class="whitespace-nowrap text-lg font-semibold text-amber-500 sm:text-xl">
									({data.product?.discount}% off)
								</span>
							{/if}
						{/if}
					</div>

					<p class="mb-5 text-sm font-semibold text-green-700">Inclusive of all taxes</p>
				</div>

				<!-- New and Tags -->

				{#if data.product?.tags?.length || data.product?.new}
					<div class="mb-5 flex flex-wrap gap-1">
						{#if data.product?.new}
							<div class="bg-red-500 py-1 px-2 text-xs font-semibold uppercase text-white">New</div>
						{/if}

						{#if data.product?.tags?.length}
							{#each data.product?.tags as tag}
								{#if tag?.name && tag?.type === 'Ribbon'}
									<div
										class="py-1 px-2 text-xs font-semibold uppercase text-white"
										style="background-color: {tag.colorCode};">
										{tag.name}
									</div>
								{/if}
							{/each}
						{/if}
					</div>
				{/if}

				<!-- Size -->

				{#if data.product?.size}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
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

				<!-- Group Products -->

				{#if data.product?.groupProduct?.length}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
							<span> Similar Products </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-5 w-5">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
								></path>
							</svg>
						</h6>

						<ul class="flex flex-wrap gap-2">
							{#each data.product?.groupProduct as gp}
								<li>
									<a
										href="/product/{gp.slug}"
										class="flex flex-col gap-1 text-center w-14 text-xs leading-tight">
										<div
											class="flex h-16 w-14 items-center justify-center overflow-hidden rounded-md border border-gray-300 transition duration-300 hover:border-primary-500 p-1 shadow-md">
											<LazyImg
												src="{gp.img}"
												alt="{gp.img}"
												height="56"
												class="h-14 w-auto object-contain object-center" />
										</div>

										{#if gp.tags?.length}
											{#each gp.tags as tag}
												<span>
													{#if tag.type === 'Style'}
														{tag.name}
													{/if}
												</span>
											{/each}
										{/if}

										{#if gp.price}
											<span><b>{currency(gp.price)}</b></span>
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- select options  -->

				{#if data.product?.options?.length > 0}
					<div
						class="sizeSelector mb-5 flex flex-col gap-3 text-sm"
						class:shake-animation="{shake}">
						{#each data.product?.options as o}
							<div class="flex flex-col items-start sm:flex-row">
								<h6 class="mb-1 w-full shrink-0 font-medium sm:mb-0 sm:w-52">
									{o.name}
								</h6>

								<!-- dropdown -->
								{#if o.inputType == 'dropdown'}
									<select
										bind:value="{selectedOptions[o._id]}"
										class="w-full max-w-xs flex-1 rounded-md border border-gray-300 py-1.5 text-sm font-light placeholder-gray-400 transition duration-300 focus:outline-none hover:bg-white">
										{#each o.values as i}
											<option value="{i._id}">
												{i.name}
											</option>
										{/each}
									</select>

									<!-- textbox -->
								{:else if o.inputType == 'textbox'}
									<Textbox bind:value="{selectedOptions[o._id]}" type="text" />

									<!-- date -->
								{:else if o.inputType == 'date'}
									<Textbox id="start" bind:value="{selectedOptions[o._id]}" type="date" />

									<!-- daterange -->
									<!-- {:else if o.inputType == 'daterange'}
                                    <span>Date range picker is not found</span> -->

									<!-- <date-picker
                                    bind:value="{selectedOptions[o.id]}"
                                    class="max-w-xs flex-1"
                                    type="date"
                                    :disabled-date="disabledBeforeTodayAndAfterAWeek"
                                    range
                                    @change="$emit('optionChanged', selectedOptions)"></date-picker> -->

									<!-- textarea -->
								{:else if o.inputType == 'textarea'}
									<Textarea bind:value="{selectedOptions[o._id]}" />

									<!-- size -->
								{:else if o.inputType == 'size'}
									<div class="flex flex-wrap">
										{#each o.values as v}
											<RadioSize value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
												<span class="text-gray-500">{v.name}</span>
											</RadioSize>
										{/each}
									</div>

									<!-- color -->
								{:else if o.inputType == 'color'}
									<div class="flex flex-wrap gap-4">
										{#each o.values as v}
											<RadioColor value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
												<span class="text-gray-500">{v.name}</span>
											</RadioColor>
										{/each}
									</div>
									<!-- radio -->
								{:else if o.inputType == 'radio'}
									<div class="flex flex-wrap gap-4">
										{#each o.values as v}
											<Radio value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
												<span class="text-gray-500">{v.name}</span>
											</Radio>
										{/each}
									</div>

									<!-- checkbox -->
								{:else if o.inputType == 'checkbox'}
									<div class="flex flex-wrap gap-4">
										{#each o.values as v, i}
											<Checkbox value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
												<span class="text-gray-500">{v.name}</span>
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
						class="fixed inset-x-0 bottom-0 z-10 h-16 md:h-auto flex items-center border-t bg-white p-2 md:static md:mb-5  md:border-t-0 md:bg-transparent md:p-0 md:max-w-sm box-shadow">
						<div class="w-full grid grid-cols-5 gap-2 itmes-center uppercase md:grid-cols-2">
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
											class="h-5 w-5 shrink-0 text-red-500"
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
											class="h-5 w-5 shrink-0"
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
								{#if data.product?.active && data.product?.hasStock}
									{#if cartButtonText === 'Go to cart'}
										<a
											class="relative flex w-full transform items-center justify-center overflow-hidden rounded-md border border-primary-500 bg-primary-500 px-3 py-2 text-center text-sm font-semibold tracking-wider text-white shadow-md transition duration-700 focus:outline-none focus:ring-0 focus:ring-offset-0 hover:border-primary-700 hover:bg-primary-700"
											href="/cart"
											data-sveltekit-preload-data>
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
												loading="{loading}"
												loadingringsize="sm"
												class="w-full text-sm">
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
										</form>
									{/if}
								{:else}
									<PrimaryButton type="button" hideLoading class="w-full text-sm" disabled>
										Item Unavailable
									</PrimaryButton>
								{/if}
							</div>
						</div>
					</div>
				{/if}

				<!-- Product Details -->

				{#if data.product?.description}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
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

						<div class="prose text-sm  max-w-none">
							{@html data.product?.description}
						</div>
					</div>
				{/if}

				<!-- Linked Products -->

				{#if data.product?.linkedProducts?.length}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
							<span> Linked Products </span>

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
									d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
								></path>
							</svg>
						</h6>

						<div class="flex flex-col gap-4">
							<CheckboxOfMultiProducts
								items="{data.product?.linkedProducts}"
								selectedItems="{selectedLinkiedProducts || []}"
								on:change="{handleSelectedLinkiedProducts}" />
						</div>
					</div>
				{/if}

				<!-- Description -->

				{#if data.product?.longDescription}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
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

						<div class="prose text-sm max-w-none">
							{@html data.product?.longDescription}
						</div>
					</div>
				{/if}

				<hr class="mb-5 w-full border-t border-gray-300 hidden sm:block" />

				<!-- Delivery Options Desktop -->

				<div class="mb-5 hidden sm:block">
					<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
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

					<DeliveryOptions product="{data.product}" deliveryDetails="{data.deliveryDetails}" />
				</div>

				<hr class="mb-5 w-full border-t border-gray-300" />

				<!-- Ratings & Reviews -->

				<div class="mb-5 flex items-center flex-wrap gap-4">
					<button
						type="button"
						class="font-semibold border-b-4 focus:outline-none 
                        {selectedReviewType === 'product_review'
							? 'border-primary-500 text-primary-500'
							: 'border-gray-200 text-gray-500'}"
						on:click="{() => (selectedReviewType = 'product_review')}">
						Product Review
					</button>

					<button
						type="button"
						class="font-semibold border-b-4 focus:outline-none 
                        {selectedReviewType === 'brand_review'
							? 'border-primary-500 text-primary-500'
							: 'border-gray-200 text-gray-500'}"
						on:click="{() => (selectedReviewType = 'brand_review')}">
						Brand Review
					</button>
				</div>

				<RatingsAndReviews
					product="{data?.product}"
					reviews="{selectedReviewType === 'product_review'
						? data?.product?.reviews?.productReviews
						: data?.product?.reviews?.brandReviews}"
					class="mb-5" />
			</div>
		</div>

		<div class="px-3 sm:px-10 lg:px-0">
			<!-- Frequently bought together -->

			{#if data.product?.crossSells?.length}
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

			<!-- Category pool buttons -->

			<div class="mb-5 sm:mb-10">
				<CategoryPoolButtons categoryPool="{data.product?.categoryPool}" />
			</div>

			<!-- Similar products From category slug -->

			{#if data.product?.category?.slug}
				<div class="mb-5 sm:mb-10">
					<SimilarProductsFromCategorySlug data="{data.product?.moreFromCategory}" />
				</div>
			{/if}

			<!-- Recomended products -->

			{#if data.product?.relatedProducts?.length}
				<hr class="mb-5 w-full sm:mb-10" />

				<RecomendedProducts products="{data.product?.relatedProducts}" />
			{/if}
		</div>
	</div>
</div>

<Gallery
	bind:selectedImgIndex="{selectedImgIndex}"
	bind:showPhotosModal="{showPhotosModal}"
	product="{data.product}" />

{#if bounceItemFromTop}
	<AnimatedCartItem img="{customizedImg || data.product?.img}" />
{/if}

<!-- <UserForm showUserInputForm="{showUserInputForm}" /> -->
