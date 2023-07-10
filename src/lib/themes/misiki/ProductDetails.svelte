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
import { DummyProductCard } from '$lib/components'
import { fireGTagEvent } from '$lib/utils/gTagB'
import { Footer } from '$lib/theme-config'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { ProductNav } from '$lib/components'
import { ProductsGrid } from '$lib/components'
import { SocialSharingButtons } from '$lib/components'
import AnimatedCartItem from '$lib/components/AnimatedCartItem.svelte'
import Breadcrumb from '$lib/components/Breadcrumb.svelte'
import CategoryPoolButtons from './CategoryPoolButtons.svelte'
import Checkbox from '$lib/ui/Checkbox.svelte'
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

const cookies = Cookie()
const isServer = import.meta.env.SSR

export let data
console.log('zzzzzzzzzzzzzzzzzz', data)
// console.log('$page', $page)

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
	metaDescription: data.product?.metaDescription,
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
	image: `${data.product?.img}`,
	'og:image': `${data.product?.img}`,
	ogImage: { url: data.product?.img, width: 128, height: 56 },
	ogImageSecureUrl: data.product?.img,
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
let isExpired = false
let isWishlisted = false
let loading = false
let loadingForWishlist = false
let product_image_dimension = $page.data.store.product_image_dimension || '3x4'
let productReviews = {}
let recentlyViewed = []
let screenWidth
let selectedImgIndex
let selectedLinkiedProducts = []
let selectedOptions = []
let selectedOptions1 = []
let selectedReviewType = 'product_review'
let shake = false
let showEditor = false
let showLongDescription = false
let showPhotosModal = false
let showSizeChart = false
let showStickyCartButton = true
let showUserInputForm = false
let today = dayjs().format('YYYY-MM-DD')
let viewPortCartPositionFromTop = 0
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

onMount(async () => {
	try {
		screenWidth = screen.width

		if ($page.data?.me) {
			try {
				isWishlisted = await WishlistService.checkWishlist({
					pid: data.product?._id,
					vid: data.product?._id,
					storeId: $page.data.store.id,
					origin: $page.data.origin
				})
			} catch (e) {
				toast(e, 'error')
			} finally {
			}
		}

		storeRecentlyViewedToLocatStorage()
	} catch (e) {}
})

const storeRecentlyViewedToLocatStorage = async () => {
	const localRecentlyViewed = localStorage.getItem(`recently_viewed_${$page.data.store.id}`)

	if (!!localRecentlyViewed && localRecentlyViewed !== 'undefined') {
		recentlyViewed = JSON.parse(localRecentlyViewed)
	}

	if (JSON.stringify(recentlyViewed).includes(data?.product?.name)) {
		return
	} else {
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
			localStorage.setItem(`recently_viewed_${$page.data.store.id}`, JSON.stringify(recentlyViewed))
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

function handleSelectedLinkiedProducts(e) {
	selectedLinkiedProducts = e.detail
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
			customizedData: customizedJson,
			storeId: $page.data.store?.id,
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
					storeId: $page.data.store?.id,
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
			cookies.set('cartQty', cookieCart.qty, { path: '/' })
			// cookies.set('cart', JSON.stringify(cookieCart), { path: '/' })
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
	const o1 = []
	for (const i in selectedOptions) {
		if (Array.isArray(selectedOptions[i])) o1.push({ option: i, values: o[i] })
		else o1.push({ option: i, values: [selectedOptions[i]] })
	}

	selectedOptions1 = o1
}

async function toggleWishlist(id) {
	if (!$page.data.me) {
		goto(`/auth/login?ref=/my/wishlist/add/${id}`)
	}

	try {
		loadingForWishlist = true
		isWishlisted = await WishlistService.toggleWishlistService({
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
</script>

<svelte:window bind:scrollY="{y}" />

<SEO {...seoProps} />

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

			<SocialSharingButtons
				productName="{data.product?.name}"
				productImage="{data.product?.img}"
				url="{$page?.url?.href}" />
		</div>

		<div class="mb-5 grid grid-cols-1 items-start gap-5 sm:mb-10 sm:gap-10 lg:grid-cols-5">
			<!-- Images -->

			<div class="col-span-1 h-auto lg:col-span-3">
				<div
					class="flex w-full grid-cols-2 flex-row gap-2 overflow-x-scroll scrollbar-none md:grid">
					{#if data?.product?.images?.length}
						{#each data.product?.images as img, index}
							<button
								type="button"
								class="cursor-zoom-in overflow-hidden rounded md:flex-shrink w-full h-auto flex items-center justify-center shrink-0"
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

			<div class="col-span-1 lg:col-span-2 px-3 sm:px-10 lg:px-0">
				<div class="mb-5 flex items-center justify-between gap-2">
					<!-- Brand -->

					{#if data.product?.brand?.name}
						<h2 class="mb-1 text-xl sm:text-2xl"><b>{data.product?.brand?.name}</b></h2>
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
						<h1 class="flex-1 sm:text-lg text-zinc-500">
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

				{#if $page?.data?.store?.isMultiVendor && data?.product?.vendor && data?.product?.vendor?.slug && data?.product?.vendor?.businessName}
					<div class="mb-5 text-sm text-zinc-500">
						By <a href="/store/{data?.product?.vendor?.slug}" class="underline hover:text-zinc-800"
							>{data?.product?.vendor?.businessName}
						</a>
					</div>
				{/if}

				<!-- prices mobile -->

				{#if $page.data.store?.isSecureCatalogue && !$page.data?.me}
					<div class="block sm:hidden mt-2">
						<a
							href="{$page.data?.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page?.url
								?.search}"
							class="block mb-5 hover:underline max-w-max font-bold">
							Login to view price
						</a>
					</div>
				{:else if data.product?.price > 0}
					<div class="block sm:hidden mt-2">
						<div class="mb-2 flex flex-wrap items-center gap-2">
							<span class="whitespace-nowrap">
								<b>{currency(data.product?.price, $page.data?.store?.currencySymbol)}</b>
							</span>

							{#if data.product?.mrp > data.product?.price}
								<span class="whitespace-nowrap text-zinc-400">
									<strike>{currency(data.product?.mrp, $page.data?.store?.currencySymbol)}</strike>
								</span>

								{#if data.product?.discount > 0}
									<span class="whitespace-nowrap font-semibold text-[#ff5a5a]">
										({data.product?.discount}% off)
									</span>
								{/if}
							{/if}
						</div>

						<p class="mb-2 text-sm font-semibold text-green-700">Inclusive of all taxes</p>
					</div>
				{/if}

				<!-- ratings -->

				{#if data?.product?.reviews?.productReviews?.summary?.ratings_avg?.value > 0}
					<button
						type="button"
						class="mt-2 flex max-w-max items-center divide-x divide-zinc-200 border border-zinc-200 py-1 text-sm focus:outline-none"
						on:click="{() => scrollTo('ratings_and_reviews')}">
						<div class="flex items-center gap-1 px-2 font-semibold">
							<span>
								{data?.product?.reviews?.productReviews?.summary?.ratings_avg?.value.toFixed(1)}
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

				<!-- Delivery Options Mobile -->

				{#if data.product?.deliveryDetails || $page.data.store?.isIndianPincodes}
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

						{#if data.product?.deliveryDetails}
							<p class="text-sm bg-yellow-300 px-2 py-1 max-w-max">
								{data.product?.deliveryDetails}
							</p>
						{:else if $page.data.store?.isIndianPincodes}
							<DeliveryOptions product="{data.product}" deliveryDetails="{data.deliveryDetails}" />
						{/if}
					</div>
				{/if}

				<!-- prices desktop -->

				{#if $page.data.store?.isSecureCatalogue && !$page.data?.me}
					<div class="hidden sm:block">
						<a
							href="{$page.data?.loginUrl || '/auth/login'}?ref={$page?.url?.pathname}{$page?.url
								?.search}"
							class="block mb-5 hover:underline max-w-max font-bold">
							Login to view price
						</a>
					</div>
				{:else if data.product?.price > 0}
					<div class="hidden sm:block">
						<div class="mb-2 flex flex-wrap items-center gap-4">
							<span class="whitespace-nowrap text-xl sm:text-2xl">
								<b>{currency(data.product?.price, $page.data?.store?.currencySymbol)}</b>
							</span>

							{#if data.product?.mrp > data.product?.price}
								<span class="whitespace-nowrap text-lg text-zinc-500 sm:text-xl">
									<strike>{currency(data.product?.mrp, $page.data?.store?.currencySymbol)}</strike>
								</span>

								{#if data.product?.discount > 0}
									<span class="whitespace-nowrap text-lg font-semibold text-amber-500 sm:text-xl">
										({data.product?.discount}% off)
									</span>
								{/if}
							{/if}
						</div>

						<p class="mb-2 text-sm font-semibold text-green-700">Inclusive of all taxes</p>
					</div>
				{/if}

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

					{#if value?.pg.colorGroup.length}
						<div class="mb-5">
							<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
								<span> Select Color </span>

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
							</h6>

							<ul class="flex flex-wrap gap-3">
								{#each value?.pg.colorGroup as cg}
									{#if cg?.color?.name && cg.img}
										<li>
											<a
												href="/product/{cg.slug}"
												class="relative border h-20 w-14 flex items-center justify-center p-1 group transition-all duration-500 focus:outline-none
												{cg?.color?.name === data.product?.color?.name ? 'border-primary-500' : 'hover:text-primary-500'}
												{cg.hasStock ? 'opacity-100' : 'gray-scale opacity-40'}">
												<LazyImg
													src="{cg.img}"
													alt="{cg.color.name}"
													height="160"
													width="120"
													aspect_ratio="3:4"
													class="transform group-hover:scale-95 object-contain object-center w-full h-auto text-xs" />

												<div
													class="hidden group-hover:block absolute z-20 max-w-max min-w-max -top-2 leading-3 py-0.5 px-2 rounded whitespace-nowrap bg-primary-500 text-white text-[0.65em] text-center">
													{cg?.color.name}
												</div>

												{#if cg.hasStock}
													<hr class="absolute z-10 w-24 transform rotate-[56deg] border-zinc-500" />
												{/if}
											</a>
										</li>
									{/if}
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Size -->

					{#if value?.pg.sizeGroup.length}
						<div class="mb-5">
							<div class="mb-2 flex flex-wrap items-center gap-2 justify-between">
								<h6 class="flex items-center gap-2 font-semibold uppercase">
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
											<a
												href="/product/{sg.slug}"
												class="flex flex-col items-center justify-center relative rounded border h-8 w-8 text-sm font-medium uppercase transition duration-500 focus:outline-none
												{sg?.size?.name === data.product?.size?.name
													? 'bg-primary-500 border-primary-500 text-white'
													: 'bg-transparent border-zinc-200 text-zinc-500 hover:border-primary-500 hover:text-primary-500'}
													{sg.hasStock ? 'opacity-100' : 'gray-scale opacity-40'}">
												<span>
													{sg?.size?.name || '_'}
												</span>

												{#if sg.stock < 5 && sg.stock > 0}
													<div
														class="absolute z-20 max-w-max min-w-max -bottom-2 leading-3 py-0.5 px-2 rounded whitespace-nowrap bg-[#ff5a5a] text-white text-[0.65em] text-center">
														{sg.stock} left
													</div>
												{/if}

												{#if sg.hasStock}
													<hr class="absolute z-10 w-10 transform rotate-45 border-zinc-500" />
												{/if}
											</a>
										</li>
									{/if}
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Group Products -->

					<!-- {#if value?.pg.groupProduct.length}
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

							<ul class="flex flex-wrap gap-3">
								{#each value?.pg.groupProduct as gp}
									<li>
										<a
											href="/product/{gp.slug}"
											class="flex flex-col gap-1 text-center w-14 text-xs leading-tight">
											<div
												class="flex h-16 w-14 items-center justify-center overflow-hidden rounded border border-zinc-200 transition duration-300 hover:border-primary-500 p-1 shadow-md">
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
												<span><b>{currency(gp.price, $page.data?.store?.currencySymbol)}</b></span>
											{/if}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if} -->
				{:catch error}
					{error?.message}
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

				{#await data.streamed?.moreProductDetails}
					<div class="mb-5">
						<Skeleton extraSmall />
					</div>
				{:then value}
					{#if value.options?.length > 0}
						<div
							class="sizeSelector mb-5 flex flex-col gap-3 text-sm"
							class:shake-animation="{shake}">
							{#each value.options as o}
								<div class="flex flex-col items-start sm:flex-row">
									<h6 class="mb-1 w-full shrink-0 font-medium sm:mb-0 sm:w-52">
										{o.name}
									</h6>

									<!-- dropdown -->
									{#if o.inputType == 'dropdown'}
										<select
											bind:value="{selectedOptions[o._id]}"
											class="w-full max-w-xs flex-1 rounded border border-zinc-200 py-1.5 text-sm font-light placeholder-zinc-400 transition duration-300 focus:outline-none hover:bg-white">
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
													<span class="text-zinc-500">{v.name}</span>
												</RadioSize>
											{/each}
										</div>

										<!-- color -->
									{:else if o.inputType == 'color'}
										<div class="flex flex-wrap gap-4">
											{#each o.values as v}
												<RadioColor value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
													<span class="text-zinc-500">{v.name}</span>
												</RadioColor>
											{/each}
										</div>
										<!-- radio -->
									{:else if o.inputType == 'radio'}
										<div class="flex flex-wrap gap-4">
											{#each o.values as v}
												<Radio value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
													<span class="text-zinc-500">{v.name}</span>
												</Radio>
											{/each}
										</div>

										<!-- checkbox -->
									{:else if o.inputType == 'checkbox'}
										<div class="flex flex-wrap gap-4">
											{#each o.values as v, i}
												<Checkbox value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
													<span class="text-zinc-500">{v.name}</span>
												</Checkbox>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				{:catch error}
					{error?.message}
				{/await}

				<!-- Product Details -->

				{#await data.streamed?.moreProductDetails}
					<div class="mb-5">
						<Skeleton extraSmall />
					</div>
				{:then value}
					{#if value.description}
						<div class="mb-5 prose text-sm max-w-none">
							{@html value.description}
						</div>
					{/if}
				{:catch error}
					{error?.message}
				{/await}

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

				{#if !data.product?.isCustomized}
					<div
						class="w-full hidden md:grid gap-2 items-center uppercase grid-cols-2 static max-w-sm mb-5">
						{#if $page.data.store?.isWishlist}
							<div class="col-span-1">
								<WhiteButton
									type="button"
									loadingringsize="sm"
									loading="{loadingForWishlist}"
									class="w-full text-sm"
									on:click="{() => toggleWishlist(data.product?._id)}">
									{#if isWishlisted}
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
						{/if}

						{#if data.product?.price > 0}
							<div class="col-span-1">
								{#if $page.data.store?.isSecureCatalogue && !$page.data?.me}
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
										<a class="block" href="/cart" data-sveltekit-preload-data>
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
											action="/cart?/add"
											method="POST"
											use:enhance="{() => {
												return async ({ result }) => {
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
						{/if}
					</div>
				{/if}

				<!-- Description -->

				{#await data.streamed?.moreProductDetails}
					<div class="mb-5">
						<Skeleton extraSmall />
					</div>
				{:then value}
					{#if value.longDescription}
						<div class="mb-5 flex flex-col gap-5">
							<hr class="w-full border-t border-zinc-200" />

							<div>
								<button
									type="button"
									class="w-full flex items-center gap-2 justify-between font-semibold uppercase focus:outline-none"
									on:click="{() => (showLongDescription = !showLongDescription)}">
									<span> Description </span>

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
									<div class="mt-2 prose text-sm max-w-none">
										{@html value.longDescription}
									</div>
								{/if}
							</div>

							<hr class="w-full border-t border-zinc-200" />
						</div>
					{/if}

					{#if value.attributes?.length}
						<ProductAttributes attributes="{value.attributes}" />
					{/if}
				{:catch error}
					{error?.message}
				{/await}

				<!-- Delivery Options Desktop -->

				{#if data.product?.deliveryDetails || $page.data.store?.isIndianPincodes}
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

						{#if data.product?.deliveryDetails}
							<p class="text-sm bg-yellow-300 px-2 py-1 max-w-max">
								{data.product?.deliveryDetails}
							</p>
						{:else if $page.data.store?.isIndianPincodes}
							<DeliveryOptions product="{data.product}" deliveryDetails="{data.deliveryDetails}" />
						{/if}
					</div>
				{/if}

				<!-- Ratings & Reviews -->

				{#if $page.data.store?.isProductReviewsAndRatings}
					{#await data.streamed?.productReviews}
						<ul class="my-5 p-0 flex flex-col gap-4">
							<li>
								<Skeleton extraSmall />
							</li>
						</ul>
					{:then productReviews}
						<div
							id="ratings_and_reviews"
							class="sticky top-14 sm:top-20 z-30 lg:static lg:z-0 mb-5 bg-white py-2">
							<div class="flex items-center flex-wrap gap-4">
								<button
									type="button"
									class="font-semibold border-b-4 focus:outline-none
								{selectedReviewType === 'product_review'
										? 'border-primary-500 text-primary-500'
										: 'border-zinc-200 text-zinc-500'}"
									on:click="{() => {
										;(selectedReviewType = 'product_review') && scrollTo('ratings_and_reviews')
									}}">
									Reviews
								</button>

								<button
									type="button"
									class="font-semibold border-b-4 focus:outline-none
								{selectedReviewType === 'brand_review'
										? 'border-primary-500 text-primary-500'
										: 'border-zinc-200 text-zinc-500'}"
									on:click="{() => {
										;(selectedReviewType = 'brand_review') && scrollTo('ratings_and_reviews')
									}}">
									Brand Reviews
								</button>
							</div>
						</div>

						<RatingsAndReviews
							type="{selectedReviewType}"
							product="{data?.product}"
							reviewsSummary="{selectedReviewType === 'product_review'
								? productReviews.reviewsSummary?.productReviews
								: productReviews.reviewsSummary?.brandReviews}"
							reviews="{productReviews}"
							class="mb-5" />
					{:catch error}
						{error?.message}
					{/await}
				{/if}

				<!-- Promo video -->

				{#if $page.data.store?.storePromoVideo?.active?.val && getIdFromYoutubeVideo($page.data.store?.storePromoVideo?.url?.val)}
					<iframe
						src="https://www.youtube.com/embed/{getIdFromYoutubeVideo(
							$page.data.store?.storePromoVideo?.url?.val
						)}"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						class="mb-5 w-full max-w-md h-auto aspect-video"
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

				{#if showStickyCartButton && !data.product?.isCustomized}
					<div
						class="w-full grid md:hidden grid-cols-5 gap-2 items-center uppercase fixed inset-x-0 bottom-0 z-40 h-16 border-t bg-white p-3 box-shadow">
						{#if $page.data.store?.isWishlist}
							<div class="col-span-2">
								<WhiteButton
									type="button"
									loadingringsize="sm"
									loading="{loadingForWishlist}"
									class="w-full text-sm"
									on:click="{() => toggleWishlist(data.product?._id)}">
									{#if isWishlisted}
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
						{/if}

						{#if data.product?.price > 0}
							<div class="{$page.data.store?.isWishlist ? ' col-span-3' : ' col-span-5'}">
								{#if $page.data.store?.isSecureCatalogue && !$page.data?.me}
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
										<a class="block" href="/cart" data-sveltekit-preload-data>
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
											action="/cart?/add"
											method="POST"
											use:enhance="{() => {
												return async ({ result }) => {
													result?.data?.qty < 0
														? fireGTagEvent('remove_from_cart', result?.data)
														: fireGTagEvent('add_to_cart', result?.data)
													cartButtonText = 'Added To Cart'
													bounceItemFromTop = true
													setTimeout(() => {
														bounceItemFromTop = false
													}, 3000)
													cartButtonText = 'Go to Cart'
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
						{/if}
					</div>
				{/if}

				{#if !data.product?.isCustomized}
					<div class="w-full grid md:hidden grid-cols-5 gap-2 items-center uppercase mb-5">
						{#if $page.data.store?.isWishlist}
							<div class="col-span-2">
								<WhiteButton
									type="button"
									loadingringsize="sm"
									loading="{loadingForWishlist}"
									class="w-full text-sm"
									on:click="{() => toggleWishlist(data.product?._id)}">
									{#if isWishlisted}
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
						{/if}

						{#if data.product?.price > 0}
							<div class="{$page.data.store?.isWishlist ? ' col-span-3' : ' col-span-5'}">
								{#if $page.data.store?.isSecureCatalogue && !$page.data?.me}
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
										<a class="block" href="/cart" data-sveltekit-preload-data>
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
											action="/cart?/add"
											method="POST"
											use:enhance="{() => {
												return async ({ result }) => {
													result?.data?.qty < 0
														? fireGTagEvent('remove_from_cart', result?.data)
														: fireGTagEvent('add_to_cart', result?.data)
													cartButtonText = 'Added To Cart'
													bounceItemFromTop = true
													setTimeout(() => {
														bounceItemFromTop = false
													}, 3000)
													cartButtonText = 'Go to Cart'
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
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<div class="px-3 sm:px-10 lg:px-0">
			<!-- Frequently bought together -->

			{#if data.product?.crossSells?.length}
				<hr class="mb-5 w-full sm:mb-10" />

				<div class="mb-5 sm:mb-10">
					<div class="sticky top-14 sm:top-20 z-30 lg:static lg:z-0 mb-3 bg-white py-2">
						<h2 class="font-bold capitalize sm:text-lg border-b-4 border-zinc-800 max-w-max">
							Frequently bought together
						</h2>
					</div>

					<div
						class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:gap-6">
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

			<!-- Recently viewed products -->

			{#if recentlyViewed?.length > 1}
				<hr class="mb-5 w-full sm:mb-10" />

				<RecentlyViewedProductsSlider title="Recently Viewed" products="{recentlyViewed}" />
			{/if}

			<!-- Similar products From category slug -->

			{#await data.streamed?.moreProductDetails}
				<ul class="mb-5 p-0 list-none flex flex-wrap gap-4">
					{#each { length: 7 } as _}
						<li>
							<ProductSkeleton />
						</li>
					{/each}
				</ul>
			{:then value}
				{#if value.moreFromCategory && value.moreFromCategory[0] && value.moreFromCategory[0].slug}
					<div class="mb-5 sm:mb-10">
						<SimilarProductsFromCategorySlug data="{value.moreFromCategory}" />
					</div>
				{/if}
			{:catch error}
				{error?.message}
			{/await}

			<!-- Recommended products -->

			{#if data.product?.relatedProducts?.length}
				<hr class="mb-5 w-full sm:mb-10" />

				<ProductsGrid title="Recommended Products" products="{data.product?.relatedProducts}" />
			{/if}

			<div class="block md:hidden">
				<Footer me="{data.me}" />
			</div>
		</div>
	</div>
</div>

<Gallery
	bind:selectedImgIndex="{selectedImgIndex}"
	bind:showPhotosModal="{showPhotosModal}"
	images="{data.product?.images}"
	title="{data.product?.businessName}" />

{#if bounceItemFromTop}
	<AnimatedCartItem img="{customizedImg || data.product?.img}" />
{/if}

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

<!-- <UserForm showUserInputForm="{showUserInputForm}" /> -->
