<style>
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
import { applyAction, enhance } from '$app/forms'
import { browser } from '$app/environment'
import { CartService, WishlistService } from '$lib/services'
import { cubicOut } from 'svelte/easing'
import { currency, getIdFromYoutubeVideo, toast } from '$lib/utils'
import { fade } from 'svelte/transition'
import { fireGTagEvent } from '$lib/utils/gTagB'
import {
	DummyProductCard,
	Error,
	Footer,
	ProductNav,
	ProductsGrid,
	SocialSharingButtons
} from '$lib/components'
import { GropuCheckbox } from '$lib/ui'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { slide } from 'svelte/transition'
import AnimatedCartItem from '$lib/components/AnimatedCartItem.svelte'
import Breadcrumb from '$lib/components/Breadcrumb.svelte'
import CategoryPoolButtons from './CategoryPoolButtons.svelte'
import CheckboxOfMultiProducts from '$lib/ui/CheckboxOfMultiProducts.svelte'
import Cookie from 'cookie-universal'
import dayjs from 'dayjs'
import DeliveryOptions from './DeliveryOptions.svelte'
import FrequentlyBoughtProduct from './FrequentlyBoughtProduct.svelte'
import Gallery from '$lib/components/Product/Gallery.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductAttributes from './ProductAttributes.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import ProductSkeleton from '$lib/ui/ProductSkeleton.svelte'
import productVeg from '$lib/assets/product/veg.png'
import Radio from '$lib/ui/Radio.svelte'
import RadioColor from '$lib/ui/RadioColor.svelte'
import RadioSize from '$lib/ui/RadioSize.svelte'
import RatingsAndReviews from '$lib/components/Product/RatingsAndReviews.svelte'
import RecentlyViewedProductsSlider from '$lib/components/Product/RecentlyViewedProductsSlider.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import SimilarProductsFromCategorySlug from './SimilarProductsFromCategorySlug.svelte'
import Skeleton from '$lib/ui/Skeleton.svelte'
import Textarea from '$lib/ui/Textarea.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import viewport from '$lib/actions/useViewPort'
import WhiteButton from '$lib/ui/WhiteButton.svelte'
import { updateCartStore } from '$lib/store/cart'
import { storeStore } from '$lib/store/store'

const cookies = Cookie()
const isServer = import.meta.env.SSR

export let data

let currentVariantId = $page.url.searchParams?.get('variant') || ''
let currentVariantPrice = data.product?.price || 0

let seoProps = {
	brand: `${$page?.data?.store?.websiteName}`,
	breadcrumbs: data.product?.categoryPool,
	caption: `${$page?.data?.store?.websiteName}`,
	category: data.product?.category?.name,
	contentUrl: data.product?.img || $page?.data?.store?.logo,
	createdAt: `${data.product?.createdAt || '_'}`,
	email: `${$page?.data?.store?.email}`,
	id: $page?.url?.href,
	logo: $page?.data?.store?.logo,
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00'],
	popularity: data.product?.popularity,
	price: currentVariantPrice,
	priceRange: `${currentVariantPrice}-${data.product?.mrp}`,
	ratingCount: 1,
	ratingValue: +data.product?.ratings + 1,
	sku: data.product?.sku,
	timeToRead: 0,
	updatedAt: `${data.product?.updatedAt || '_'}`,
	metaDescription: data.product?.metaDescription,
	datePublished: `${data.product?.publishedAt || '_'}`,
	description: ` ${data.product?.description}`,
	dnsPrefetch: `//cdn.jsdelivr.net`,
	featuredImage: {
		url: `${data.product?.img}`,
		width: 675,
		height: 380,
		caption: data.product?.name
	},
	keywords: data.product?.keywords,
	lastUpdated: `${data.product?.updatedAt || '_'}`,
	msapplicationTileImage: `${data.product?.img}`,
	image: `${data.product?.img}`,
	'og:image': `${data.product?.img}`,
	ogImage: { url: data.product?.img, width: 128, height: 56 },
	ogImageSecureUrl: data.product?.img,
	ogImageType: 'image/jpeg',
	ogSiteName: `${$page.data.origin}/sitemap/sitemap.xml`,
	productAvailability: `${data.product?.stock}`,
	productBrand: `${data.product?.brandName || `${$page?.data?.store?.websiteName}`}`,
	productName: `${data.product?.name}`,
	productPriceAmount: `${currentVariantPrice}`,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `${data.product?.slug}`,
	title: `${data.product?.name}`,
	twitterImage: { url: `${data.product?.img}` }
}

let bounceItemFromTop = false
let cartButtonText = 'Add to Bag'
let customizedImg
let isExpired = false
let loading = false
let loadingForWishlist = false
let product_image_dimension = $page.data.$page?.data?.store?.product_image_dimension || '3x4'
let productReviews = {}
let recentlyViewed = []
let ribbonTags = []
let screenWidth
let selectedImgIndex
let selectedLinkiedProducts = []
let selectedOptions = []
let finalSelectedOptions = []
let selectedReviewType = 'product_review'
let shake = false
let showEditor = false
let showFooter = false
let showLongDescription = false
let showPhotosModal = false
let showSizeChart = false
let showStickyCartButton = true
let showUserInputForm = false
let today = dayjs().format('YYYY-MM-DD')
let viewPortCartPositionFromTop = 0
let wiggleVariants = false
let y = 0

$: if (y > 500) {
	showUserInputForm = true
}

if (data.product?.expiryDate) {
	// Create a Date object from the UTC string
	const date = new Date(data.product?.expiryDate)

	// Calculate the difference in milliseconds between the given date and now
	const diffMs = Date.now() - date.getTime()

	// Convert the difference in milliseconds to minutes
	const diffMinutes = Math.round(diffMs / (1000 * 60))

	if (diffMinutes > 0) {
		isExpired = true
	} else {
		isExpired = false
	}
}

if (data.product?.tags?.length) {
	ribbonTags = data.product?.tags.filter((tag) => {
		return tag.type === 'Ribbon'
	})

	// console.log('Ribbon tags =', ribbonTags)
}

onMount(async () => {
	try {
		screenWidth = screen.width
		storeRecentlyViewedToLocatStorage()
	} catch (e) {}
})

const storeRecentlyViewedToLocatStorage = async () => {
	const localRecentlyViewed = localStorage.getItem(`recently_viewed_${$page.data.storeId}`)

	if (!!localRecentlyViewed && localRecentlyViewed !== 'undefined') {
		recentlyViewed = JSON.parse(localRecentlyViewed)
	}

	if (JSON.stringify(recentlyViewed).includes(data?.product?.name)) {
		return
	} else if (data?.product?.img && data?.product?.name && data?.product?.price) {
		const prod = {
			brandName: data?.product?.brand?.name,
			discount: data?.product?.discount,
			hasStock: data?.product?.hasStock,
			img: data?.product?.img,
			mrp: data?.product?.mrp,
			name: data?.product?.name,
			price: data?.product?.price,
			slug: data?.product?.slug
		}

		if (recentlyViewed?.length > 10) {
			recentlyViewed.shift()
		}

		const resvw = [...recentlyViewed]
		resvw.push(prod)
		recentlyViewed = resvw

		if (browser) {
			localStorage.setItem(`recently_viewed_${$page.data.storeId}`, JSON.stringify(recentlyViewed))
		}
	}
}

function slideFade(node, params) {
	const existingTransform = getComputedStyle(node).transform.replace('none', '')

	return {
		delay: params.delay || 0,
		duration: params.duration || 400,
		easing: params.easing || cubicOut,
		css: (t, u) =>
			`transform-origin: ${
				params.transformOrigin || 'top right'
			}; transform: ${existingTransform} scaleX(${t}); opacity: ${t};`
	}
}

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
			pid: p.id,
			vid: p.id,
			qty: 1,
			options: selectedOptions,
			customizedImg: customizedImg,
			storeId: $page.data.storeId,
			customizedData: customizedJson,
			origin: $page.data.origin,
			server: isServer,
			cookies
		})
		if (selectedLinkiedProducts?.length) {
			for (const i of selectedLinkiedProducts) {
				cart = await CartService.addToCartService({
					pid: i,
					vid: i,
					qty: 1,
					storeId: $page.data.storeId,
					origin: $page.data.origin,
					server: isServer,
					cookies
				})
			}
		}

		const response = await fetch('/server/cart')
		cart = await response.json()

		if (cart) {
			const cookieCart = {
				cartId: cart?.cart_id,
				// items: cart?.items,
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
			// cartButtonText = 'Added To Cart'
			bounceItemFromTop = true
		}

		cartButtonText = 'Go to Cart'
		p.qty < 0 ? fireGTagEvent('remove_from_cart', cart) : fireGTagEvent('add_to_cart', cart)

		await invalidateAll()

		// const res = await getAPI('carts/my')
	} catch (e) {
		// toast(e, 'error')
		cartButtonText = 'Error Add To Cart'
	} finally {
		loading = false
		// await delay(1000)
		cartButtonText = 'Add to Bag'
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

async function cartButtonEnterViewport() {
	await getCartViewPortLocation()

	if (y > 0) {
		showStickyCartButton = false
	} else {
		showStickyCartButton = true
	}
}

async function cartButtonExitViewport() {
	await getCartViewPortLocation()

	if (y < viewPortCartPositionFromTop) {
		showStickyCartButton = true
	} else {
		showStickyCartButton = false
	}
}

const getCartViewPortLocation = () => {
	const cartViewPort = document.getElementById('cart_viewport')
	viewPortCartPositionFromTop = cartViewPort.offsetTop
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
	// console.log('selected options', selectedOptions)

	const newOptions = []

	for (const i in selectedOptions) {
		if (Array.isArray(selectedOptions[i]))
			newOptions.push({ option: i, values: selectedOptions[i] })
		else newOptions.push({ option: i, values: [selectedOptions[i]] || selectedOptions[i] })
	}

	// console.log('newOptions', newOptions)

	finalSelectedOptions = newOptions.filter((item) => {
		// console.log('typeof item.values', typeof item.values)

		if (item.values?.length) {
			if (item.values[0]) {
				return item
			}
		} else if (typeof item.values !== 'object') {
			return item
		}
	})

	// console.log('Final selected options', finalSelectedOptions)
}

function scrollTo(elementId) {
	let element
	if (elementId.detail) {
		element = document.getElementById(elementId.detail)
	} else {
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

async function updateVariant(variant) {
	$page.url.searchParams.set('variant', variant.id)
	currentVariantPrice = variant.prices[0]?.amount || currentVariantPrice
	await goto($page.url.toString())
	await invalidateAll()
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
	<div class="md:container md:mx-auto flex flex-col gap-5">
		<div class="hidden lg:flex items-center justify-between gap-2">
			<!-- Breadcrumb -->

			<Breadcrumb
				categoryPool="{data.product?.categoryPool}"
				currentProductName="{data.product?.name}" />

			<!-- Social share button -->

			<SocialSharingButtons
				productName="{data.product?.name}"
				productImage="{data.product?.img}"
				url="{$page?.url?.href}" />
		</div>

		<div class="mb-5 grid grid-cols-1 items-start gap-5 sm:mb-10 sm:gap-10 lg:grid-cols-5">
			<!-- Banner section -->

			<div class="col-span-1 h-auto lg:col-span-3">
				<div
					class="flex w-full grid-cols-2 flex-row gap-2 overflow-x-scroll scrollbar-none md:grid">
					{#if data?.product?.images?.length}
						{#each data.product?.images as img, index}
							<button
								type="button"
								class="cursor-zoom-in overflow-hidden rounded md:flex-shrink w-full h-auto min-h-[512px] sm:min-h-[300px] flex items-center justify-center shrink-0"
								on:click="{() => handleGallery(index)}">
								{#if product_image_dimension === '1x1'}
									<LazyImg
										src="{img}"
										alt="{data.product?.name} catelog {index}"
										height="512"
										width="512"
										aspect_ratio="1:1"
										class="object-cover object-center w-full h-auto first-line:text-xs" />
								{:else}
									<LazyImg
										src="{img}"
										alt="{data.product?.name}"
										height="512"
										class="object-contain object-top w-full h-auto first-line:text-xs" />
								{/if}
							</button>
						{/each}
					{:else}
						<div
							class="w-full h-[512px] bg-zinc-100 flex flex-col items-center justify-center p-5 text-zinc-500 text-xs text-center">
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
				</div>
			</div>

			<!-- Informatin section -->

			<div class="col-span-1 lg:col-span-2 px-3 sm:px-10 lg:px-0 flex flex-col gap-5">
				<div>
					<div class="mb-2 flex flex-wrap items-center justify-between gap-2">
						<!-- Brand -->

						{#if data.product?.brand?.name}
							<h3>{data.product?.brand?.name}</h3>
						{/if}

						<!-- Social share button -->

						<div class="block lg:hidden ml-auto">
							<SocialSharingButtons
								productName="{data.product?.name}"
								productImage="{data.product?.img}"
								url="{$page?.url?.href}" />
						</div>
					</div>

					<!-- Name veg/non veg icon -->

					{#if data.product?.name}
						<div class="flex justify-between gap-2">
							<span class="flex-1 sm:text-lg text-zinc-500">
								{data.product?.name}
							</span>

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

					{#if $page?.data?.store?.isMultiVendor && data?.product?.vendor && data?.product?.vendor?.slug && (data?.product?.vendor?.businessName || data?.product?.vendor?.name)}
						<p>
							By

							<a
								href="/store/{data?.product?.vendor?.slug}"
								class="capitalize font-semibold underline hover:text-zinc-800">
								{data?.product?.vendor?.businessName || data?.product?.vendor?.name}
							</a>
						</p>
					{/if}
				</div>

				<!-- prices mobile -->

				<hr class="block sm:hidden w-full" />

				<div class="block sm:hidden">
					{#if $page?.data?.store?.isSecureCatalogue && !$page.data?.me}
						<a
							href="{$page.data?.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page?.url
								?.search}"
							class="block hover:underline max-w-max font-bold text-sm">
							Login to view price
						</a>
					{:else}
						<div class="mb-2 flex flex-wrap items-baseline gap-2 text-sm">
							<span class="text-xl font-bold whitespace-nowrap">
								{currency(currentVariantPrice, $page?.data?.store?.currencySymbol)}
							</span>

							{#if data.product?.mrp > currentVariantPrice}
								<span class="whitespace-nowrap text-zinc-500">
									<strike>
										{currency(data.product?.mrp, $page?.data?.store?.currencySymbol)}
									</strike>
								</span>

								{#if data.product?.discount > 0}
									<span class="whitespace-nowrap text-secondary-500">
										({data.product?.discount}% off)
									</span>
								{/if}
							{/if}
						</div>

						{#await data.streamed?.moreProductDetails then value}
							<h6 class="text-brand-500">
								{#if value?.igst}
									Inclusive {currency(value?.igst, $page?.data?.store?.currencySymbol)} GST
								{:else}
									Inclusive of all taxes
								{/if}
							</h6>
						{/await}
					{/if}
				</div>

				<!-- ratings -->

				{#if $page?.data?.store?.isProductReviewsAndRatings}
					{#await data.streamed?.productReviews then productReviews}
						{#if productReviews?.reviewsSummary?.productReviews?.summary?.ratings_avg?.value}
							<button
								type="button"
								class="flex max-w-max items-center divide-x divide-zinc-200 border border-zinc-200 py-1 text-sm focus:outline-none"
								on:click="{() => scrollTo('ratings_and_reviews')}">
								<div class="flex items-center gap-1 px-2 font-semibold">
									<span>
										{productReviews?.reviewsSummary?.productReviews?.summary?.ratings_avg?.value.toFixed(
											1
										)}
									</span>

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

								<span class="px-2 text-zinc-500">
									{productReviews?.product?.count || 'No'} Reviews
								</span>
							</button>
						{/if}
					{:catch error}
						<Error err="{error}" />
					{/await}
				{/if}

				<hr />

				<!-- Delivery Options Mobile -->

				{#if data.product?.handling_time_when_stock || data.product?.handling_time_when_nis || $page?.data?.store?.isIndianPincodes}
					<div class="sm:hidden block">
						<div class="mb-2 flex items-center gap-2 uppercase">
							<h5>Delivery Options</h5>

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
						</div>

						<div class="flex flex-col gap-5">
							{#if data.product?.hasStock && data.product?.handling_time_when_stock}
								<span class="text-sm bg-yellow-300 px-2 py-1 max-w-max">
									{data.product?.handling_time_when_stock}
								</span>
							{:else if !data.product?.hasStock && data.product?.handling_time_when_nis}
								<span class="text-sm bg-yellow-300 px-2 py-1 max-w-max">
									{data.product?.handling_time_when_nis}
								</span>
							{/if}

							{#if $page?.data?.store?.isIndianPincodes}
								<DeliveryOptions
									product="{data.product}"
									deliveryDetails="{data.deliveryDetails}" />
							{/if}
						</div>
					</div>
				{/if}

				<!-- prices desktop -->

				<div class="hidden sm:block">
					{#if $page?.data?.store?.isSecureCatalogue && !$page.data?.me}
						<a
							href="{$page?.data?.store?.otpLogin ? '/auth/otp-login' : '/auth/login'}?ref={$page
								?.url?.pathname}{$page?.url?.search}"
							class="block hover:underline max-w-max font-bold">
							Login to view price
						</a>
					{:else}
						<div class="mb-2 flex flex-wrap items-baseline gap-2">
							<span class="text-2xl font-bold whitespace-nowrap">
								{currency(currentVariantPrice, $page?.data?.store?.currencySymbol)}
							</span>

							{#if data.product?.mrp > currentVariantPrice}
								<span class="whitespace-nowrap text-zinc-500">
									<strike>
										{currency(data.product?.mrp, $page?.data?.store?.currencySymbol)}
									</strike>
								</span>

								{#if data.product?.discount > 0}
									<span class="whitespace-nowrap text-secondary-500">
										({data.product?.discount}% off)
									</span>
								{/if}
							{/if}
						</div>

						{#await data.streamed?.moreProductDetails then value}
							<h6 class="text-brand-500">
								{#if value?.igst}
									Inclusive {currency(value?.igst, $page?.data?.store?.currencySymbol)} GST
								{:else}
									Inclusive of all taxes
								{/if}
							</h6>
						{/await}
					{/if}
				</div>

				<!-- New and Tags -->

				{#if ribbonTags?.length || data.product?.new}
					<div class="flex flex-wrap gap-1 text-xs font-semibold uppercase text-white">
						{#if data.product?.new}
							<div class="bg-accent-500 py-1 px-2">New</div>
						{/if}

						{#if ribbonTags?.length}
							{#each ribbonTags as tag}
								{#if tag?.name}
									<div class="py-1 px-2" style="background-color: {tag.colorCode || '#27272A'};">
										{tag.name}
									</div>
								{/if}
							{/each}
						{/if}
					</div>
				{/if}

				{#await data.streamed?.moreProductDetails}
					<ul class="mb-5 p-0 list-none flex flex-wrap gap-4">
						{#each { length: 3 } as _}
							<li class="flex flex-wrap gap-1 w-14 animate-pulse">
								<div class="rounded bg-zinc-200 h-14 w-full"></div>

								<div class="rounded-full h-3 w-full bg-zinc-200"></div>
							</li>
						{/each}
					</ul>
				{:then value}
					<!-- Color -->

					{#if value?.pg?.colorGroup?.length}
						<div>
							<div class="mb-2 flex items-center gap-2 uppercase">
								<h5>Select Color</h5>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1"
									stroke="currentColor"
									class="w-5 h-5">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
									></path>
								</svg>
							</div>

							<ul class="flex flex-wrap gap-3">
								{#each value?.pg.colorGroup as cg}
									{#if cg?.color?.name && cg.img}
										<li>
											{#if cg.hasStock}
												<a
													href="/product/{cg.slug}"
													class="relative border h-20 w-14 flex items-center justify-center p-1 group transition duration-300 focus:outline-none
													{cg?.color?.name === data.product?.color?.name
														? 'border-primary-500'
														: 'border-zinc-300 hover:border-primary-500'}">
													<LazyImg
														src="{cg.img}"
														alt="{cg.color.name}"
														height="160"
														width="120"
														aspect_ratio="3:4"
														class="transform group-hover:scale-95 object-contain object-center w-full h-auto text-xs" />

													<div
														class="hidden group-hover:block absolute z-20 max-w-max min-w-max -top-2 leading-3 py-1 px-2 rounded whitespace-nowrap bg-primary-500 text-white text-[0.65em] text-center">
														{cg?.color.name}
													</div>
												</a>
											{:else}
												<a
													href="/product/{cg.slug}"
													class="relative border grayscale h-20 w-14 flex items-center justify-center p-1 group transition duration-300 focus:outline-none
													{cg?.color?.name === data.product?.color?.name
														? 'border-primary-500'
														: 'border-zinc-300 hover:border-primary-500'}">
													<LazyImg
														src="{cg.img}"
														alt="{cg.color.name}"
														height="160"
														width="120"
														aspect_ratio="3:4"
														class="transform group-hover:scale-95 object-contain object-center w-full h-auto text-xs" />

													<div
														class="hidden group-hover:block absolute z-20 max-w-max min-w-max -top-2 leading-3 py-1 px-2 rounded whitespace-nowrap bg-primary-500 text-white text-[0.65em] text-center">
														{cg?.color.name}
													</div>

													<hr class="absolute z-10 w-24 transform rotate-[56deg] border-zinc-300" />
												</a>
											{/if}
										</li>
									{/if}
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Size -->

					{#if value?.pg?.sizeGroup?.length}
						<div>
							<div class="mb-2 flex flex-wrap items-center gap-2 justify-between">
								<div class="flex items-center gap-2 uppercase">
									<h5>Select Size</h5>

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
								</div>

								{#if data.product.sizechart}
									<button
										type="button"
										class="text-right text-sm text-secondary-500 underline focus:outline-none"
										on:click="{() => (showSizeChart = !showSizeChart)}">
										Size Chart
									</button>
								{/if}
							</div>

							<ul class="flex flex-wrap gap-3">
								{#each value?.pg.sizeGroup as sg}
									{#if sg?.size?.name}
										<li>
											{#if sg.hasStock}
												<a
													href="/product/{sg.slug}"
													class="reltive flex flex-col items-center justify-center text-center border rounded py-2 px-4 text-sm font-medium uppercase group transition duration-300 focus:outline-none
													{sg?.size?.name === data.product?.size?.name
														? 'bg-primary-500 border-primary-500 text-white'
														: 'bg-transparent border-zinc-300 hover:border-primary-500'}">
													<span class="w-full truncate">
														{sg?.size?.name}
													</span>

													{#if sg.stock < 5 && sg.stock > 0}
														<div
															class="absolute z-20 max-w-max min-w-max -bottom-2 leading-3 py-0.5 px-2 rounded whitespace-nowrap bg-[#ff5a5a] text-white text-[0.65em] text-center">
															{sg.stock} left
														</div>
													{/if}
												</a>
											{:else}
												<a
													href="/product/{sg.slug}"
													class="flex flex-col items-center justify-center text-center border text-zinc-200 rounded py-2 px-4 text-sm font-medium uppercase group transition duration-300 focus:outline-none
													{sg?.size?.name === data.product?.size?.name ? 'border-primary-500' : 'hover:border-primary-500'}">
													<span class="w-full truncate">
														{sg?.size?.name}
													</span>
												</a>
											{/if}
										</li>
									{/if}
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Group Products -->

					{#if value?.pg?.materialGroup?.length}
						<div>
							<div class="mb-2 flex items-center gap-2 uppercase">
								<h5>Group Products</h5>

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
							</div>

							<ul class="flex flex-wrap gap-3">
								{#each value?.pg?.materialGroup as mgp}
									<li>
										<a
											href="/product/{mgp.slug}"
											class="flex flex-col items-center justify-center gap-1 text-center w-14 text-xs">
											<div
												class="flex h-16 w-14 items-center justify-center overflow-hidden rounded border transition duration-300 p-1 shadow-md
												{$page.url.pathname === mgp.slug
													? 'border-primary-500'
													: 'border-zinc-200 hover:border-primary-500'}">
												<LazyImg
													src="{mgp.img}"
													alt="{mgp.img}"
													height="56"
													class="h-14 w-auto object-contain object-center" />
											</div>

											<span class="text-zinc-500 leading-3 line-clamp-2">
												{mgp.material.name}
											</span>

											{#if mgp.material.price}
												<span
													><b>{currency(mgp.material.price, $page?.data?.store?.currencySymbol)}</b
													></span>
											{/if}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Variant Products -->

					{#if value?.variants?.length}
						<div id="variants_list">
							<div class="mb-2 flex items-center gap-2 uppercase">
								<h5>Product Variations</h5>

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
							</div>

							<ul class="flex flex-wrap gap-3" class:wiggle="{wiggleVariants}">
								{#each value?.variants as v}
									<li>
										<button
											type="button"
											class="reltive flex flex-col items-center justify-center text-center border rounded py-2 px-4 text-sm font-medium uppercase group transition duration-300 focus:outline-none
											{v?.id === currentVariantId
												? 'bg-primary-500 border-primary-500 text-white'
												: 'bg-transparent border-zinc-300 hover:border-primary-500'}"
											on:click="{() => updateVariant(v)}">
											<span class="w-full truncate">
												{v?.title}
											</span>
										</button>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{:catch error}
					<Error err="{error}" />
				{/await}

				<!-- {#if moreOptions?.length > 0}
					<div class="mb-5 flex flex-col gap-2">
						{#each moreOptions as option}
							<label for="{option.title}" class="flex items-center gap-2 text-sm font-medium">
								{#if option.type === 'checkbox'}
									<input
										type="checkbox"
										name="{option.title}"
										id="{option.title}"
										class="h-4 w-4" />
								{/if}

								<span>
									{option.title}
								</span>
							</label>
						{/each}
					</div>
				{/if} -->

				<!-- select options  -->

				{#if data.product?.options?.length}
					<div
						class="sizeSelector mb-5 flex flex-col gap-3 text-sm"
						class:shake-animation="{shake}">
						{#each data.product.options as o}
							<div class="flex flex-col items-start sm:flex-row">
								<h6 class="mb-1 w-full shrink-0 font-medium sm:mb-0 sm:w-52">
									{o.name}
								</h6>

								<div class="flex-1">
									<!-- dropdown -->
									{#if o.inputType == 'dropdown'}
										<select
											bind:value="{selectedOptions[o._id]}"
											class="w-full rounded border border-zinc-200 p-2 text-sm placeholder-zinc-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-transparent hover:bg-zinc-50">
											<option value="{undefined}" selected disabled>Select a Option</option>
											{#each o.values as i}
												<option value="{i._id}">
													{i.name}
												</option>
											{/each}
										</select>

										<!-- textbox -->
									{:else if o.inputType == 'textbox'}
										<Textbox type="text" bind:value="{selectedOptions[o._id]}" />

										<!-- date -->
									{:else if o.inputType == 'date'}
										<Textbox type="date" bind:value="{selectedOptions[o._id]}" />

										<!-- daterange -->
										<!-- {:else if o.inputType == 'daterange'}
										<div class="flex flex-col gap-2">
											{#each o.values as v}
												<div class="flex items-center gap-2">
													<p class="w-20">
														{v.name}
													</p>

													-

													<div class="w-full">
														<Textbox
															type="date"
															placeholder="{v.name}"
															bind:value="{selectedOptions[v._id]}" />
													</div>
												</div>
											{/each}
										</div> -->

										<!-- textarea -->
									{:else if o.inputType == 'textarea'}
										<Textarea bind:value="{selectedOptions[o._id]}" />

										<!-- size -->
									{:else if o.inputType == 'size'}
										<div class="flex flex-wrap gap-2">
											{#each o.values as v}
												<RadioSize value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
													{v.name}
												</RadioSize>
											{/each}
										</div>

										<!-- color -->
									{:else if o.inputType == 'color'}
										<div class="flex flex-wrap gap-2">
											{#each o.values as v}
												<RadioColor
													value="{v._id}"
													backgroundColor="{v.name}"
													bind:modelValue="{selectedOptions[o._id]}">
													{v.name}
												</RadioColor>
											{/each}
										</div>

										<!-- radio -->
									{:else if o.inputType == 'radio'}
										<div class="flex flex-wrap gap-x-4 gap-y-2">
											{#each o.values as v}
												<Radio value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
													{v.name}
												</Radio>
											{/each}
										</div>

										<!-- checkbox -->
									{:else if o.inputType == 'checkbox'}
										<div class="flex flex-wrap gap-x-4 gap-y-2">
											<GropuCheckbox
												items="{o.values}"
												bind:selectedItems="{selectedOptions[o._id]}" />
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Product details (short description) -->

				{#await data.streamed?.moreProductDetails}
					<Skeleton extraSmall />
				{:then value}
					{#if value.description}
						<div>
							<div class="mb-2 flex items-center gap-2 uppercase">
								<h5>Product Details</h5>

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
							</div>

							<div class="prose max-w-none text-sm text-zinc-500">
								{@html value.description}
							</div>
						</div>
					{/if}
				{:catch error}
					<Error err="{error}" />
				{/await}

				<!-- Linked Products -->

				{#if data?.product?.linkedProducts?.length && data?.product?.linkedProducts[0] && (data?.product?.linkedProducts[0]._id || data?.product?.linkedProducts[0].id)}
					<div>
						<div class="mb-2 flex items-center gap-2 uppercase">
							<h5>Linked Products</h5>

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
						</div>

						<CheckboxOfMultiProducts
							items="{data.product?.linkedProducts}"
							selectedItems="{selectedLinkiedProducts || []}"
							on:change="{handleSelectedLinkiedProducts}" />
					</div>
				{/if}

				{#if $page?.data?.store?.allowBackOrder || data.product?.allow_back_order}
					<form
						id="create_back_order"
						in:fade="{{ duration: 300 }}"
						action="/cart?/createBackOrder"
						method="POST"
						enctype="multipart/form-data"
						use:enhance="{() => {
							return async ({ result }) => {
								// console.log('result of add to cart', result)

								toast('Your back order is created successfully', 'success')

								await invalidateAll()
								await applyAction(result)
							}
						}}">
						<input type="hidden" name="pid" value="{data?.product?._id || null}" />

						<input type="hidden" name="qty" value="{1}" />

						<button
							type="submit"
							title="It will create a order, and the order will be shipped when vendor will get stock"
							class="max-w-max text-sm text-secondary-500 font-semibold hover:underline focus:outline-none">
							Create Back Order
						</button>
					</form>
				{/if}

				<!-- Specifications -->

				{#if data.product?.specifications?.length}
					<div>
						<div class="mb-2 flex items-center gap-2 uppercase">
							<h5>Specifications</h5>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1"
								stroke="currentColor"
								class="shrink-0 w-5 h-5">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
								></path>
							</svg>
						</div>

						<ul class="m-0 p-0 list-none flex flex-col gap-1">
							{#each data.product?.specifications as s}
								<li class="flex items-center gap-3 p-3 border">
									<h6 class="w-24 sm:w-44 font-medium">
										{s.name || '_'}
									</h6>

									:

									<p class="flex-1">
										{s.value || '_'}
									</p>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#await data.streamed?.moreProductDetails then value}
					{#if !data.product?.isCustomized}
						<div
							class="w-full hidden md:grid gap-2 items-center uppercase grid-cols-2 static max-w-sm">
							{#if $page?.data?.store?.isWishlist}
								<div class="col-span-1">
									<form
										id="toggle_wishlist_1"
										action="/my/wishlist?/toggleWishlist"
										method="POST"
										enctype="multipart/form-data"
										use:enhance="{() => {
											return async ({ result }) => {
												// console.log('wishlist toggle result', result)

												if (result?.type === 'redirect') {
													goto(result?.location)
												} else if (result?.data) {
													data.product.isWishlisted = result?.data
												} else if (result?.error) {
													toast(result?.error?.message, 'error')
												}

												await invalidateAll()
												await applyAction(result)
											}
										}}">
										<input
											type="hidden"
											name="pid"
											value="{data?.product?._id || data?.product?.id || null}" />

										<input
											type="hidden"
											name="vid"
											value="{data?.product?._id || data?.product?.id || null}" />

										<WhiteButton
											type="submit"
											loadingringsize="sm"
											loading="{loadingForWishlist}"
											class="w-full text-sm">
											<!-- on:click="{() => toggleWishlist(data.product?._id)}" -->
											{#if data?.product?.isWishlisted}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-5 w-5 shrink-0 text-accent-500"
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
									</form>
								</div>
							{/if}

							{#if currentVariantPrice > 0}
								<div class="col-span-1">
									{#if $page?.data?.store?.isSecureCatalogue && !$page.data?.me}
										<a
											href="{$page.data?.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page
												?.url?.search}"
											class="block">
											<WhiteButton
												type="button"
												loadingringsize="sm"
												hideLoading
												class="w-full text-sm">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="w-5 h-5">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
													></path>
												</svg>

												<span> Login </span>
											</WhiteButton>
										</a>
									{:else if isExpired}
										<PrimaryButton type="button" hideLoading class="w-full text-sm" disabled>
											Item Expired
										</PrimaryButton>
									{:else if data.product?.active && data.product?.hasStock}
										{#if cartButtonText === 'Go to Cart'}
											<a
												in:fade="{{ duration: 300 }}"
												class="block"
												href="/cart"
												data-sveltekit-preload-data>
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
												id="add_to_cart_1"
												in:fade="{{ duration: 300 }}"
												action="/cart?/add"
												method="POST" 
												enctype="multipart/form-data"
												use:enhance="{() => {
													return async ({ result }) => {
														// console.log('result of add to cart', result)
														if (result?.data === 'choose variant') {
															scrollTo('variants_list')
															toast('Please choose a variant', 'warning')
															wiggleVariants = true

															setTimeout(() => {
																wiggleVariants = false
															}, 820)
															return
														}
														updateCartStore({ data: result.data })
														result?.data?.qty < 0
															? fireGTagEvent('remove_from_cart', result?.data)
															: fireGTagEvent('add_to_cart', result?.data)
														// console.log(result?.data)
														cartButtonText = 'Added To Cart'
														bounceItemFromTop = true
														setTimeout(() => {
															bounceItemFromTop = false
															cartButtonText = 'Add to Bag'
														}, 3000)
														cartButtonText = 'Go to Cart'
														if (customizedImg) {
															goto(`/checkout/address`)
														}
														await applyAction(result)
													}
												}}">
												<input type="hidden" name="pid" value="{data?.product?._id || null}" />

												<input type="hidden" name="vid" value="{data?.product?._id || null}" />

												<input
													type="hidden"
													name="variantsLength"
													value="{value?.variants?.length || null}" />

												<input
													type="hidden"
													name="currentVariantId"
													value="{currentVariantId || null}" />

												<input
													type="hidden"
													name="linkedItems"
													value="{JSON.stringify(selectedLinkiedProducts) || null}" />

												<input type="hidden" name="qty" value="{1}" />

												<input
													type="hidden"
													name="options"
													value="{JSON.stringify(finalSelectedOptions) || null}" />

												<input type="hidden" name="customizedImg" value="{customizedImg || null}" />

												<PrimaryButton
													type="submit"
													{loading}
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
							{/if}
						</div>
					{/if}
				{:catch error}
					<Error err="{error}" />
				{/await}

				<!-- Long Description -->

				{#await data.streamed?.moreProductDetails}
					<Skeleton extraSmall />
				{:then value}
					{#if value.longDescription}
						<div class="flex flex-col border-t border-b">
							<button
								type="button"
								class="py-5 w-full flex items-center gap-2 justify-between focus:outline-none"
								on:click="{() => (showLongDescription = !showLongDescription)}">
								<h5 class="uppercase">Description</h5>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-5 h-5 transition duration-300
									{showLongDescription ? 'transform -rotate-45' : ''}">
									<path
										d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
									></path>
								</svg>
							</button>

							{#if showLongDescription}
								<div transition:slide="{{ duration: 300 }}" class="pb-5 prose max-w-none">
									{@html value.longDescription}
								</div>
							{/if}
						</div>
					{/if}
				{:catch error}
					{error?.message}
				{/await}

				<!-- Delivery Options Desktop -->

				{#if data.product?.handling_time_when_stock || data.product?.handling_time_when_nis || $page?.data?.store?.isIndianPincodes}
					<div class="hidden sm:block">
						<div class="mb-2 flex items-center gap-2 uppercase">
							<h5>Delivery Options</h5>

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
						</div>

						<div class="flex flex-col gap-5">
							{#if data.product?.hasStock && data.product?.handling_time_when_stock}
								<span class="text-sm bg-yellow-300 px-2 py-1 max-w-max">
									{data.product?.handling_time_when_stock}
								</span>
							{:else if !data.product?.hasStock && data.product?.handling_time_when_nis}
								<span class="text-sm bg-yellow-300 px-2 py-1 max-w-max">
									{data.product?.handling_time_when_nis}
								</span>
							{/if}

							{#if $page?.data?.store?.isIndianPincodes}
								<DeliveryOptions
									product="{data.product}"
									deliveryDetails="{data.deliveryDetails}" />
							{/if}
						</div>
					</div>
				{/if}

				<!-- Ratings & Reviews -->

				{#if $page?.data?.store?.isProductReviewsAndRatings}
					{#await data.streamed?.productReviews}
						<ul class="m-0 p-0 flex flex-col gap-5">
							{#each { length: 3 } as _}
								<li>
									<Skeleton extraSmall />
								</li>
							{/each}
						</ul>
					{:then productReviews}
						<div
							id="ratings_and_reviews"
							class="sticky top-14 sm:top-20 z-30 lg:static lg:z-0 bg-white lg:bg-transparent">
							<div class="flex items-center flex-wrap gap-5">
								<button
									type="button"
									class="mb-2 lg:mb-0 uppercase border-b-4 focus:outline-none
										{selectedReviewType === 'product_review'
										? 'border-primary-500 text-primary-500'
										: 'border-zinc-200 text-zinc-500'}"
									on:click="{() => {
										;(selectedReviewType = 'product_review') && scrollTo('ratings_and_reviews')
									}}">
									<h5>Product Review</h5>
								</button>

								<button
									type="button"
									class="mb-2 lg:mb-0 uppercase border-b-4 focus:outline-none
										{selectedReviewType === 'brand_review'
										? 'border-primary-500 text-primary-500'
										: 'border-zinc-200 text-zinc-500'}"
									on:click="{() => {
										;(selectedReviewType = 'brand_review') && scrollTo('ratings_and_reviews')
									}}">
									<h5>Brand Review</h5>
								</button>
							</div>
						</div>

						<RatingsAndReviews
							type="{selectedReviewType}"
							product="{data?.product}"
							reviewsSummary="{selectedReviewType === 'product_review'
								? productReviews.reviewsSummary?.productReviews
								: productReviews.reviewsSummary?.brandReviews}"
							reviews="{productReviews}" />
					{:catch error}
						<Error err="{error}" />
					{/await}
				{/if}

				<!-- Promo video -->

				{#if $page?.data?.store?.storePromoVideo?.active?.val && getIdFromYoutubeVideo($page?.data?.store?.storePromoVideo?.url?.val)}
					<iframe
						src="https://www.youtube.com/embed/{getIdFromYoutubeVideo(
							$page?.data?.store?.storePromoVideo?.url?.val
						)}"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						class="w-full max-w-md h-auto aspect-video"
						allowfullscreen>
					</iframe>
				{/if}

				<!-- Add to Cart -->

				<!-- Cart viewport -->

				<div
					id="cart_viewport"
					use:viewport
					on:enterViewport="{cartButtonEnterViewport}"
					on:exitViewport="{cartButtonExitViewport}">
				</div>

				{#await data.streamed?.moreProductDetails then value}
					{#if showStickyCartButton && !data.product?.isCustomized}
						<div
							class="w-full grid md:hidden grid-cols-5 gap-2 items-center uppercase fixed inset-x-0 bottom-0 z-40 h-16 border-t bg-white p-3 box-shadow">
							{#if $page?.data?.store?.isWishlist}
								<div class="col-span-2">
									<form
										id="toggle_wishlist_2"
										action="/my/wishlist?/toggleWishlist"
										method="POST"
										enctype="multipart/form-data"
										use:enhance="{() => {
											return async ({ result }) => {
												// console.log('wishlist toggle result', result)

												if (result?.type === 'redirect') {
													goto(result?.location)
												} else if (result?.data) {
													data.product.isWishlisted = result?.data
												} else if (result?.error) {
													toast(result?.error?.message, 'error')
												}

												await invalidateAll()
												await applyAction(result)
											}
										}}">
										<input
											type="hidden"
											name="pid"
											value="{data?.product?._id || data?.product?.id || null}" />

										<input
											type="hidden"
											name="vid"
											value="{data?.product?._id || data?.product?.id || null}" />

										<WhiteButton
											type="submit"
											loadingringsize="sm"
											loading="{loadingForWishlist}"
											class="w-full text-sm">
											<!-- on:click="{() => toggleWishlist(data.product?._id)}" -->
											{#if data?.product?.isWishlisted}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-5 w-5 shrink-0 text-accent-500"
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
									</form>
								</div>
							{/if}

							{#if currentVariantPrice > 0}
								<div class="{$page?.data?.store?.isWishlist ? ' col-span-3' : ' col-span-5'}">
									{#if $page?.data?.store?.isSecureCatalogue && !$page.data?.me}
										<a
											href="{$page.data?.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page
												?.url?.search}"
											class="block">
											<WhiteButton
												type="button"
												loadingringsize="sm"
												hideLoading
												class="w-full text-sm">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="w-5 h-5">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
													></path>
												</svg>

												<span> Login </span>
											</WhiteButton>
										</a>
									{:else if isExpired}
										<PrimaryButton type="button" hideLoading class="w-full text-sm" disabled>
											Item Expired
										</PrimaryButton>
									{:else if data.product?.active && data.product?.hasStock}
										{#if cartButtonText === 'Go to Cart'}
											<a
												in:fade="{{ duration: 300 }}"
												class="block"
												href="/cart"
												data-sveltekit-preload-data>
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
												id="add_to_cart_2"
												in:fade="{{ duration: 300 }}"
												action="/cart?/add"
												method="POST"
												enctype="multipart/form-data"
												use:enhance="{() => {
													return async ({ result }) => {
														// console.log('result of add to cart', result)
														if (result?.data === 'choose variant') {
															scrollTo('variants_list')
															toast('Please choose a variant', 'warning')
															wiggleVariants = true

															setTimeout(() => {
																wiggleVariants = false
															}, 820)
															return
														}
														updateCartStore({ data: result.data })
														result?.data?.qty < 0
															? fireGTagEvent('remove_from_cart', result?.data)
															: fireGTagEvent('add_to_cart', result?.data)
														cartButtonText = 'Added To Cart'
														bounceItemFromTop = true
														setTimeout(() => {
															bounceItemFromTop = false
															cartButtonText = 'Add to Bag'
														}, 3000)
														cartButtonText = 'Go to Cart'
														if (customizedImg) {
															goto(`/checkout/address`)
														}
														await applyAction(result)
													}
												}}">
												<input type="hidden" name="pid" value="{data?.product?._id || null}" />

												<input type="hidden" name="vid" value="{data?.product?._id || null}" />

												<input
													type="hidden"
													name="variantsLength"
													value="{value?.variants?.length || null}" />

												<input
													type="hidden"
													name="currentVariantId"
													value="{currentVariantId || null}" />

												<input
													type="hidden"
													name="linkedItems"
													value="{JSON.stringify(selectedLinkiedProducts) || null}" />

												<input type="hidden" name="qty" value="{1}" />

												<input
													type="hidden"
													name="options"
													value="{JSON.stringify(finalSelectedOptions) || null}" />

												<input type="hidden" name="customizedImg" value="{customizedImg || null}" />

												<PrimaryButton
													type="submit"
													{loading}
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
							{/if}
						</div>
					{/if}

					{#if !data.product?.isCustomized}
						<div class="w-full grid md:hidden grid-cols-5 gap-2 items-center uppercase">
							{#if $page?.data?.store?.isWishlist}
								<div class="col-span-2">
									<form
										id="toggle_wishlist_3"
										action="/my/wishlist?/toggleWishlist"
										method="POST"
										enctype="multipart/form-data"
										use:enhance="{() => {
											return async ({ result }) => {
												// console.log('wishlist toggle result', result)

												if (result?.type === 'redirect') {
													goto(result?.location)
												} else if (result?.data) {
													data.product.isWishlisted = result?.data
												} else if (result?.error) {
													toast(result?.error?.message, 'error')
												}

												await invalidateAll()
												await applyAction(result)
											}
										}}">
										<input
											type="hidden"
											name="pid"
											value="{data?.product?._id || data?.product?.id || null}" />

										<input
											type="hidden"
											name="vid"
											value="{data?.product?._id || data?.product?.id || null}" />

										<WhiteButton
											type="submit"
											loadingringsize="sm"
											loading="{loadingForWishlist}"
											class="w-full text-sm">
											<!-- on:click="{() => toggleWishlist(data.product?._id)}" -->
											{#if data?.product?.isWishlisted}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-5 w-5 shrink-0 text-accent-500"
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
									</form>
								</div>
							{/if}

							{#if currentVariantPrice > 0}
								<div class="{$page?.data?.store?.isWishlist ? ' col-span-3' : ' col-span-5'}">
									{#if $page?.data?.store?.isSecureCatalogue && !$page.data?.me}
										<a
											href="{$page.data?.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page
												?.url?.search}"
											class="block">
											<WhiteButton
												type="button"
												loadingringsize="sm"
												hideLoading
												class="w-full text-sm">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="w-5 h-5">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
													></path>
												</svg>

												<span> Login </span>
											</WhiteButton>
										</a>
									{:else if isExpired}
										<PrimaryButton type="button" hideLoading class="w-full text-sm" disabled>
											Item Expired
										</PrimaryButton>
									{:else if data.product?.active && data.product?.hasStock}
										{#if cartButtonText === 'Go to Cart'}
											<a
												in:fade="{{ duration: 300 }}"
												class="block"
												href="/cart"
												data-sveltekit-preload-data>
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
												id="add_to_cart_3"
												in:fade="{{ duration: 300 }}"
												action="/cart?/add"
												method="POST"
												enctype="multipart/form-data"
												use:enhance="{() => {
													return async ({ result }) => {
														// console.log('result of add to cart', result)
														if (result?.data === 'choose variant') {
															scrollTo('variants_list')
															toast('Please choose a variant', 'warning')
															wiggleVariants = true

															setTimeout(() => {
																wiggleVariants = false
															}, 820)
															return
														}
														updateCartStore({ data: result.data })
														result?.data?.qty < 0
															? fireGTagEvent('remove_from_cart', result?.data)
															: fireGTagEvent('add_to_cart', result?.data)
														cartButtonText = 'Added To Cart'
														bounceItemFromTop = true
														setTimeout(() => {
															bounceItemFromTop = false
															cartButtonText = 'Add to Bag'
														}, 3000)
														cartButtonText = 'Go to Cart'
														if (customizedImg) {
															goto(`/checkout/address`)
														}
														await applyAction(result)
													}
												}}">
												<input type="hidden" name="pid" value="{data?.product?._id || null}" />

												<input type="hidden" name="vid" value="{data?.product?._id || null}" />

												<input
													type="hidden"
													name="variantsLength"
													value="{value?.variants?.length || null}" />

												<input
													type="hidden"
													name="currentVariantId"
													value="{currentVariantId || null}" />

												<input
													type="hidden"
													name="linkedItems"
													value="{JSON.stringify(selectedLinkiedProducts) || null}" />

												<input type="hidden" name="qty" value="{1}" />

												<input
													type="hidden"
													name="options"
													value="{JSON.stringify(finalSelectedOptions) || null}" />

												<input type="hidden" name="customizedImg" value="{customizedImg || null}" />

												<PrimaryButton
													type="submit"
													{loading}
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
							{/if}
						</div>
					{/if}
				{:catch error}
					<Error err="{error}" />
				{/await}
			</div>
		</div>

		<div class="px-3 sm:px-10 lg:px-0 flex flex-col gap-5 sm:gap-10">
			<!-- Frequently bought together -->

			{#if data.product?.crossSells?.length}
				<hr />

				<div class="sticky top-14 sm:top-20 z-30 lg:static lg:z-0 bg-white lg:bg-transparent">
					<h5 class="capitalize border-b-4 border-zinc-800 max-w-max">
						Frequently bought together
					</h5>
				</div>

				<div
					class="grid w-full grid-cols-2 items-start gap-2 sm:gap-5 sm:flex sm:flex-wrap sm:justify-between lg:gap-6">
					{#each data.product?.crossSells as csp}
						<FrequentlyBoughtProduct product="{csp}" />
					{/each}

					{#each { length: 7 } as _}
						<div class="hidden sm:block">
							<DummyProductCard />
						</div>
					{/each}
				</div>
			{/if}

			<!-- Recently viewed products -->

			{#if recentlyViewed?.length > 1}
				<hr />

				<RecentlyViewedProductsSlider title="Recently Viewed" products="{recentlyViewed}" />
			{/if}

			<!-- Category pool buttons -->

			<CategoryPoolButtons categoryPool="{data.product?.categoryPool}" />

			<!-- Similar products From category slug -->

			{#await data.streamed?.moreProductDetails}
				<ul class="m-0 p-0 list-none flex flex-wrap gap-5">
					{#each { length: 7 } as _}
						<li>
							<ProductSkeleton />
						</li>
					{/each}
				</ul>
			{:then value}
				{#if value.moreFromCategory && value.moreFromCategory[0] && value.moreFromCategory[0].slug}
					<SimilarProductsFromCategorySlug data="{value.moreFromCategory}" />
				{/if}
			{:catch error}
				<Error err="{error}" />
			{/await}

			<!-- Recommended products -->

			{#if data.product?.relatedProducts?.length}
				<hr />

				<ProductsGrid title="Recommended Products" products="{data.product?.relatedProducts}" />
			{/if}
		</div>

		<!-- Footer mobile show hide toggle -->

		<div class="block lg:hidden">
			<button
				type="button"
				class="p-3 sm:px-10 w-full flex items-center justify-between gap-4 text-sm focus:outline-none"
				on:click="{() => (showFooter = !showFooter)}">
				<span>More about {$page?.data?.store?.websiteName || 'store'}</span>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5 transition duration-300
				{showFooter ? 'transform rotate-180' : ''}">
					<path
						fill-rule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						clip-rule="evenodd"></path>
				</svg>
			</button>

			{#if showFooter}
				<div transition:slide="{{ duration: 300 }}">
					<Footer />
				</div>
			{/if}
		</div>
	</div>
</div>

<Gallery
	bind:selectedImgIndex
	bind:showPhotosModal
	images="{data.product?.images}"
	title="{data.product?.businessName}" />

{#if bounceItemFromTop}
	<AnimatedCartItem img="{customizedImg || data.product?.img}" />
{/if}

<!-- <UserForm showUserInputForm="{showUserInputForm}" /> -->

{#if showSizeChart}
	<div class="fixed inset-0 h-screen w-screen z-50 flex justify-end">
		<button
			type="button"
			class="absolute inset-0 cursor-default focus:outline-none"
			on:click="{() => (showSizeChart = false)}">
		</button>

		<div
			transition:slideFade="{{ duration: 500 }}"
			class="absolute inset-y-0 right-0 z-[60] h-full w-full sm:w-96 bg-white p-5 sm:p-10 flex flex-col items-end justify-end"
			style="box-shadow: -4px 0px 10px rgba(50, 50, 50, 0.2);">
			<button
				type="button"
				class="text-zinc-500 hover:text-zinc-800 transition duration-300 transform scale-125 focus:outline-none"
				on:click="{() => (showSizeChart = false)}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>

			<div class="h-full w-full flex items-center justify-center">
				<img
					src="{data.product.sizechart}"
					alt="{data.product?.name} size chart"
					class="object-contain object-center w-full h-auto first-line:text-xs" />
			</div>
		</div>
	</div>
{/if}
