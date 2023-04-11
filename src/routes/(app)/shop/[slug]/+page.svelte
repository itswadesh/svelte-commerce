<script>
import { browser } from '$app/environment'
import { CategoryService } from '$lib/services'
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { toast } from '$lib/utils'
import CategoriesMobile from '$lib/home/CategoriesMobile.svelte'
import dayjs from 'dayjs'
import Hero from '$lib/home/Hero.svelte'
import HeroBanners from '$lib/home/HeroBanners.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import PickedBanners from '$lib/home/PickedBanners.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'

let today = dayjs(new Date()).toISOString()

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

let seoProps = {
	// addressCountry: 'India',
	// addressLocality: 'Semiliguda, Koraput',
	// addressRegion: 'Odisha',
	// alternateJsonHref: '',
	// alternateXml: { title: '', href: '' },
	brand: $page.data.store?.title,
	// breadcrumbs: '',
	caption: $page.data.store?.title,
	category: $page.data.store?.title,
	contentUrl: $page.data.store?.logo,
	createdAt: today,
	// depth: { unitCode: '', value: '' },
	email: `${$page?.data?.store?.email}`,
	// entityMeta: '',
	// facebookPage: '',
	// gtin: '',
	// height: '',
	id: $page?.url?.href,
	image: $page.data.store?.logo,
	logo: $page.data.store?.logo,
	ogSquareImage: { url: '', width: 56, height: 56 },
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 08:00-13:00'],
	// popularity: product.popularity,
	// postalCode: '764036',
	// price: product.price,
	// priceRange: `${product.price}-${product.mrp}`,
	// ratingCount: 1,
	// ratingValue: +product.ratings + 1,
	// sku: product.sku,
	// streetAddress: 'Padmajyoti Marg, Nandapur Road',
	timeToRead: 0,
	updatedAt: today,
	// weight: { unitCode: '', value: '' },
	// width: { unitCode: '', value: '' },
	// wlwmanifestXmlHref: '',
	metadescription: $page.data.store?.description,
	// article: false,
	canonical: `${$page?.url.href}`,
	datePublished: today,
	description: $page.data.store?.description,
	dnsPrefetch: `//cdn.jsdelivr.net`,
	// entityMeta: null,
	featuredImage: {
		url: $page.data.store?.logo,
		width: 675,
		height: 380,
		caption: $page.data.store?.title
	},
	keywords: $page.data.store?.keywords,
	lastUpdated: today,
	msapplicationTileImage: $page.data.store?.logo,
	ogImage: { url: $page.data.store?.logo, width: 128, height: 56 },
	ogImageSecureUrl: `${$page?.data?.store?.logo}`,
	ogImageType: 'image/jpeg',
	ogSiteName: `${$page.data.origin}/sitemap/sitemap.xml`,
	// productAvailability: `${product.stock}`,
	productBrand: $page.data.store?.title,
	productName: $page.data.store?.title,
	// productPriceAmount: `${product.price}`,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `/`,
	// timeToRead: 0,
	title: $page.data.store?.title,
	twitterImage: { url: $page.data.store?.logo }
}

let loading = false
let megamenu = []
let showChild = []
let showChild2 = []
let bgColors = [
	'bg-fuchsia-200',
	'bg-blue-200',
	'bg-green-200',
	'bg-stone-200',
	'bg-indigo-200',
	'bg-amber-200',
	'bg-lime-200',
	'bg-orange-200',
	'bg-teal-200',
	'bg-cyan-200',
	'bg-yellow-200',
	'bg-gray-200'
]

onMount(() => {
	getMegaMenu()
})

async function getMegaMenu() {
	loading = true

	if (browser) {
		try {
			const localMegamenu = localStorage.getItem('megamenu')

			if (!localMegamenu || localMegamenu === 'undefined') {
				megamenu = await CategoryService.fetchMegamenuData({
					origin: $page.data.origin,
					storeId: $page.data.store?.id
				})
			} else {
				megamenu = JSON.parse(localMegamenu)
			}

			megamenu = megamenu.filter((e) => {
				return e.name !== 'New Arrivals'
			})

			// console.log('megamenu', megamenu)
		} catch (e) {
			toast(e, 'error')
		} finally {
		}
	}

	loading = false
}

function toggle(mx) {
	if (showChild[mx] === true) {
		showChild[mx] = false
		toggle2(mx)
	} else {
		showChild[mx] = true
	}
}

function toggle2(cx) {
	if (showChild2[cx] === true) {
		showChild2[cx] = false
	} else {
		showChild2[cx] = true
	}
}
</script>

<SEO {...seoProps} />

<div class="bg-opacity-25 bg-center bg-repeat">
	<div class="mb-14 sm:mb-0">
		<!-- CATEGORIES SLIDER MOBILE -->

		{#await data then categories}
			{#if data?.categories?.length}
				<div class="mb-5 sm:mb-10 block sm:hidden">
					<CategoriesMobile loading="{data.isFetching}" categories="{data?.categories}" />
				</div>
			{/if}
		{/await}

		<Hero banners="{data.banners}" />

		<!-- HERO BANNERS -->

		{#await data.heroBanners}
			<div class="mt-5 sm:mt-10 grid grid-cols-2 items-center gap-2 md:grid-cols-4">
				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>
			</div>
		{:then heroBanners}
			{#if data.heroBanners?.length}
				<div class="mt-5 sm:mt-10">
					<h2
						class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
						BEST OF {$page.data.store?.websiteName} EXCLUSIVE
					</h2>

					<HeroBanners heroBanners="{data.heroBanners}" />
				</div>
			{/if}
		{/await}

		<!-- PICKED BANNERS -->

		{#await data.groupByBanner}
			<div class="mt-5 sm:mt-10 grid grid-cols-2 items-center gap-2 md:grid-cols-4">
				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>
			</div>
		{:then groupByBanner}
			{#if data.groupByBanner?.length}
				<div class="mt-5 sm:mt-10">
					<PickedBanners banners="{data.groupByBanner}" />
				</div>
			{/if}
		{/await}

		{#if megamenu.length}
			<div class="mt-5 sm:mt-10">
				<h2
					class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
					Categories
				</h2>

				<!-- 1st level categories -->

				<ul class="flex flex-col divide-y-2 divide-white tracking-wider text-center">
					{#each megamenu as m, mx}
						{#if m}
							<li>
								{#if m.children?.length}
									<button
										type="button"
										class="flex h-24 w-full items-end justify-between focus:outline-none 
											{bgColors[mx]}">
										<div class="flex h-full w-full flex-1 items-center justify-center gap-4 px-6">
											<a
												href="/{m.link || m.slug}"
												aria-label="Click to route {m.name || '##'}"
												class="block text-xl font-bold uppercase">
												{m.name}
											</a>

											<button
												type="button"
												class="overflow-hidden rounded-full bg-transparent
													hover:bg-white/50 transition duration-300 p-2 focus:outline-none"
												on:click="{() => toggle(mx)}">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-6 w-6 shrink-0 transition duration-300
														{showChild[mx] ? 'transform -rotate-180' : ''}"
													viewBox="0 0 20 20"
													fill="currentColor">
													<path
														fill-rule="evenodd"
														d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
														clip-rule="evenodd"></path>
												</svg>
											</button>
										</div>
									</button>
								{:else}
									<a
										href="/{m.link || m.slug}"
										aria-label="Click to route {m.name || '##'}"
										class="flex items-center justify-center h-24 w-full {bgColors[mx]}">
										<h1 class="flex-1 text-xl font-bold uppercase px-6">
											{m.name}
										</h1>
									</a>
								{/if}

								<!-- 2nd level categories -->

								{#if showChild[mx]}
									{#if m.children?.length}
										<ul class="flex flex-col divide-y">
											{#each m.children as c, cx}
												<li>
													{#if c.children?.length}
														<div
															class="flex w-full items-center justify-center gap-4 py-3 px-8 text-left font-medium focus:outline-none">
															<a
																href="/{c.link || c.slug}"
																aria-label="Click to route {c.name || '##'}"
																class="block">
																{c.name}
															</a>

															<button
																type="button"
																class="overflow-hidden rounded-full bg-transparent hover:bg-gray-200/50 transition duration-300 p-2 focus:outline-none"
																on:click="{() => toggle2(cx)}">
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	class="h-6 w-6 shrink-0 transition duration-300 {showChild2[cx]
																		? 'transform -rotate-180'
																		: ''}"
																	viewBox="0 0 20 20"
																	fill="currentColor">
																	<path
																		fill-rule="evenodd"
																		d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
																		clip-rule="evenodd"></path>
																</svg>
															</button>
														</div>
													{:else}
														<a
															href="/{c.link || c.slug}"
															aria-label="Click to route {c.name || '##'}"
															class="py-3 px-8 font-medium">
															<h6>{c.name}</h6>
														</a>
													{/if}

													<!-- 3rd level categories -->

													{#if showChild2[cx]}
														{#if c.children?.length}
															<ul class="flex flex-col divide-y bg-gray-100">
																{#each c.children as cc}
																	<li>
																		<a
																			href="/{cc.link || cc.slug}"
																			aria-label="Click to route {cc.name || '##'}"
																			class="block py-3 px-8 font-medium">
																			{cc.name}
																		</a>
																	</li>
																{/each}
															</ul>
														{/if}
													{/if}
												</li>
											{/each}
										</ul>
									{/if}
								{/if}
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		{/if}

		{#if data.html}
			<div class="my-5 sm:my-10 px-3 sm:px-10 prose max-w-none">
				{@html data.html}
			</div>
		{/if}
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</div>
