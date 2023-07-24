<script lang="ts">
import { SELECTED_ENV, SERVICE_LIST } from '$lib/constants'
import { applyAction, enhance } from '$app/forms'
import { currency } from '$lib/utils'
import {
	Email,
	Facebook,
	LinkedIn,
	Pinterest,
	Telegram,
	Twitter,
	WhatsApp
} from 'svelte-share-buttons-component'
import { browser } from '$app/environment'
import { fireGTagEvent } from '$lib/utils/gTagB'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { PrimaryButton, ProductSkeleton, Skeleton, WhiteButton } from '$lib/ui'
import { ProductNav } from '$lib/components'
import { slide } from 'svelte/transition'
import productNonVeg from '$lib/assets/product/non-veg.png'
import ProductSliderBanner from './ProductSliderBanner.svelte'
import productVeg from '$lib/assets/product/veg.png'
import SEO from '$lib/components/SEO/index.svelte'
import SimilarProductsFromCategorySlug from './SimilarProductsFromCategorySlug.svelte'

export let data

onMount(() => {
	storeRecentlyViewedToLocatStorage()
})

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
let showdescription = false
let cartButtonText = 'Add to Bag'
let customizedImg
let selectedLinkiedProducts = []
let selectedOptions1 = []
let selectedSize
let recentlyViewed = []

if (data.product?.size?.name === 'One Size') {
	selectedSize = 'One Size'
}

function selectSize(s) {
	selectedSize = s.name
}

const storeRecentlyViewedToLocatStorage = async () => {
	const localRecentlyViewed = localStorage.getItem(`recently_viewed_${$page?.data?.store?.id}`)

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
			localStorage.setItem(
				`recently_viewed_${$page.data?.store?.id}`,
				JSON.stringify(recentlyViewed)
			)
		}
	}
}
</script>

{#if SELECTED_ENV !== SERVICE_LIST.MEDUSAJS}
	<SEO {...seoProps} />
{/if}

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
	<div class="md:container md:mx-auto max-w-6xl flex flex-col gap-10">
		<div class="grid items-start grid-cols-1 gap-5 sm:gap-10 lg:grid-cols-5">
			<div class="relative col-span-1 lg:col-span-3 flex flex-col gap-10">
				{#if !data.product?.isCustomized && data?.product?.images?.length}
					<ProductSliderBanner data="{data}" />
				{/if}

				{#await data.streamed?.moreProductDetails}
					<div class="mb-5">
						<Skeleton extraSmall />
					</div>
				{:then value}
					{#if value.description}
						<ul class="border-t border-b divide-y flex flex-col m-0 p-0 list-none">
							<li>
								<button
									type="button"
									class="py-10 w-full flex items-center gap-2 justify-between uppercase focus:outline-none"
									on:click="{() => (showdescription = !showdescription)}">
									<span> Description </span>

									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="w-5 h-5 transition duration-300
                                    {showdescription ? 'transform -rotate-45' : ''}">
										<path
											d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
										></path>
									</svg>
								</button>

								{#if showdescription}
									<div transition:slide="{{ duration: 300 }}" class="pb-10 max-w-none">
										{@html value.description}
									</div>
								{/if}
							</li>
						</ul>
					{/if}
				{:catch error}
					{error?.message}
				{/await}
			</div>

			<div
				class="lg:sticky lg:top-24 col-span-1 px-4 sm:px-10 md:px-0 lg:col-span-2 flex flex-col gap-5">
				{#if data.product?.name}
					<div class="flex justify-between gap-2">
						<h1 class="flex-1 sm:text-lg text-zinc-500 uppercase">
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

				<div class="flex flex-wrap leading-3 gap-2">
					<span class="text-lg text-secondary-500">
						{currency(data.product?.price, $page.data?.store?.currencySymbol)}
					</span>

					<span class="text-lg text-zinc-500">
						<strike>
							{currency(data.product?.mrp, $page.data?.store?.currencySymbol)}
						</strike>
					</span>
				</div>

				<hr />

				<!-- Size -->

				{#if data.product?.size}
					<div class="mb-5">
						<div class="mb-2 flex items-center gap-2 justify-between text-sm">
							<h6>Size:</h6>

							<button type="button" class="underline focus:outline-none">Size chart</button>
						</div>

						<div class="flex flex-wrap gap-2">
							<button
								type="button"
								class="overflow-hidden border py-1 px-3 text-sm font-medium uppercase transition duration-500 focus:outline-none
              				{data.product?.size?.name === selectedSize
									? 'border-primary-500 text-primary-500'
									: 'border-zinc-200 text-zinc-500 hover:border-primary-500 hover:text-primary-500'}"
								on:click="{() => selectSize(data.product?.size)}">
								{data.product?.size?.name}
							</button>
						</div>
					</div>
				{/if}

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

					<input type="hidden" name="options" value="{JSON.stringify(selectedOptions1)}" />

					<input type="hidden" name="customizedImg" value="{customizedImg}" />

					<WhiteButton type="submit" loadingringsize="sm" class="w-full text-sm uppercase">
						{cartButtonText}
					</WhiteButton>
				</form>

				<form
					action="/cart?/add"
					method="POST"
					use:enhance="{() => {
						return async ({ result }) => {
							result?.data?.qty < 0
								? fireGTagEvent('remove_from_cart', result?.data)
								: fireGTagEvent('add_to_cart', result?.data)
							goto(`/checkout/address`)
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

					<input type="hidden" name="options" value="{JSON.stringify(selectedOptions1)}" />

					<input type="hidden" name="customizedImg" value="{customizedImg}" />

					<PrimaryButton type="submit" loadingringsize="sm" class="w-full text-sm uppercase">
						Buy Now
					</PrimaryButton>
				</form>

				{#await data.streamed?.moreProductDetails}
					<div class="mb-5">
						<Skeleton extraSmall />
					</div>
				{:then value}
					{#if value.longDescription}
						<div class="mb-5 prose max-w-none">
							{@html value.longDescription}
						</div>
					{/if}
				{:catch error}
					{error?.message}
				{/await}

				<ul class="flex flex-wrap list-none m-0 p-0">
					<li class="p-2">
						<WhatsApp text="{data.product?.name || ''} {$page?.url?.href || ''}" />
					</li>

					<li class="p-2">
						<Telegram text="{data.product?.name || ''}" url="{$page?.url?.href || ''}" />
					</li>

					<li class="p-2">
						<Facebook quote="{data.product?.name || ''}" url="{$page?.url?.href || ''}" />
					</li>

					<li class="p-2">
						<Twitter
							class="share-button"
							text="{data.product?.name || ''}"
							url="{$page?.url?.href || ''}"
							hashtags="litekart"
							via="litekart"
							related="mobile cover,t-shirt,key chain " />
					</li>

					<li class="p-2">
						<Pinterest
							url="{$page?.url?.href || ''}"
							media="{data.product?.img || ''}"
							description="{data.product?.name || ''}" />
					</li>

					<li class="p-2">
						<LinkedIn url="{$page?.url?.href || ''}" />
					</li>

					<li class="p-2">
						<Email
							subject="Take a look at this {data.product?.name || ''}"
							body="{$page?.url?.href || ''}" />
					</li>
				</ul>
			</div>
		</div>

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

		<!-- Recently Viewed -->

		{#if recentlyViewed?.length}
			<div class="mb-5 sm:mb-10">
				<SimilarProductsFromCategorySlug title="Recently Viewed" data="{recentlyViewed}" />
			</div>
		{/if}
	</div>
</div>
