<script lang="ts">
import { applyAction, enhance } from '$app/forms'
import { currency, toast } from '$lib/utils'
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
import { cubicOut } from 'svelte/easing'
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
import Error from '$lib/components/Error.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)

onMount(() => {
	storeRecentlyViewedToLocatStorage()
})

let currentVariantId = $page.url.searchParams?.get('variant') || ''
let currentVariantPrice = data.product?.price || 0

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
	price: currentVariantId,
	priceRange: `${currentVariantId}-${data.product?.mrp}`,
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
	productPriceAmount: `${currentVariantId}`,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `${data.product?.slug}`,
	// timeToRead: 0,
	title: `${data.product?.name}`,
	twitterImage: { url: `${data.product?.img}` }
}

let bounceItemFromTop = false
let cartButtonText = 'Add to Bag'
let customizedImg
let recentlyViewed = []
let selectedLinkiedProducts = []
let selectedOptions1 = []
let selectedSize
let showdescription = false
let showSizeChart = false
let wiggleVariants = false

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

async function updateVariant(variant) {
	$page.url.searchParams.set('variant', variant.id)
	currentVariantPrice = variant.prices[0]?.amount || currentVariantPrice
	await goto($page.url.toString())
	await invalidateAll()
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
</script>

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
						{currency(currentVariantId, $page.data?.store?.currencySymbol)}
					</span>

					<span class="text-lg text-zinc-500">
						<strike>
							{currency(data.product?.mrp, $page.data?.store?.currencySymbol)}
						</strike>
					</span>
				</div>

				<hr />

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
								<h6>Size:</h6>

								{#if data.product.sizechart}
									<button
										type="button"
										class="text-right text-sm underline focus:outline-none"
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
													class="reltive flex flex-col items-center justify-center text-center border py-2 px-4 text-xs uppercase group transition duration-300 focus:outline-none
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
													class="flex flex-col items-center justify-center text-center border text-zinc-200 py-2 px-4 text-xs uppercase group transition duration-300 focus:outline-none
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
													><b>{currency(mgp.material.price, $page.data?.store?.currencySymbol)}</b
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
								<h5>Variant Products</h5>

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

				{#await data.streamed?.moreProductDetails}
					<div class="mb-5">
						<Skeleton extraSmall />
					</div>
				{:then value}
					<form
						id="add_to_cart_1"
						action="/cart?/add"
						method="POST"
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

						<input type="hidden" name="variantsLength" value="{value?.variants?.length}" />

						<input type="hidden" name="currentVariantId" value="{currentVariantId}" />

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
						id="add_to_cart_2"
						action="/cart?/add"
						method="POST"
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
								result?.data?.qty < 0
									? fireGTagEvent('remove_from_cart', result?.data)
									: fireGTagEvent('add_to_cart', result?.data)
								goto(`/checkout/address`)
								await applyAction(result)
							}
						}}">
						<input type="hidden" name="pid" value="{data?.product?._id}" />

						<input type="hidden" name="vid" value="{data?.product?._id}" />

						<input type="hidden" name="variantsLength" value="{value?.variants?.length}" />

						<input type="hidden" name="currentVariantId" value="{currentVariantId}" />

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
