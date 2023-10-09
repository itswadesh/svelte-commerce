<script>
// import { getMegamenuFromStore } from '$lib/store/megamenu-old'
import { browser } from '$app/environment'
import { CategoriesMobile, Hero, HeroBanners, PickedBanners } from '$lib/theme-config'
import { CategoryService } from '$lib/services'
import { Footer, MobileFooter } from '$lib/components'
import { navigateToProperPath, toast } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { Skeleton, Textbox } from '$lib/ui'
import dayjs from 'dayjs'
import Fuse from 'fuse.js'
import SEO from '$lib/components/SEO/index.svelte'

let today = dayjs(new Date()).toISOString()

export let data

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
	metaDescription: $page.data.store?.description,
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
	'bg-zinc-200'
]
let loading = false
let loadingForMegamenu = false
let megamenu = []
let megamenuResult = []
let searchCategoryValue = null
let showChild = []
let showChild2 = []
let showFooter = false

const options = {
	keys: ['name', 'children.name', 'children.children.name'], // Search name and children's names
	threshold: 0.4 // Require at least 40% match score
}

onMount(() => {
	getMegaMenu()
})

async function getMegaMenu() {
	loading = true

	if (browser) {
		try {
			// megamenu = await getMegamenuFromStore({
			// 	sid: null,
			// 	storeId: $page?.data?.store?.id,
			// 	isCors: $page?.data?.store?.isCors,
			// 	origin: $page.data.origin
			// })

			loadingForMegamenu = true

			const localMegamenu = localStorage.getItem('megamenu')

			if (!localMegamenu || localMegamenu === 'undefined') {
				megamenu = await CategoryService.fetchMegamenuData({
					origin: $page.data.origin,
					storeId: $page.data.store?.id,
					isCors: $page.data.store?.isCors
				})
			} else {
				megamenu = JSON.parse(localMegamenu)
			}

			if (megamenu?.length) {
				megamenu = megamenu.filter((e) => {
					return e.name !== 'New Arrivals'
				})
			}
			megamenuResult = megamenu
		} catch (e) {
			toast(e, 'error')
		} finally {
			loadingForMegamenu = false
		}
	}

	loading = false
}

function searchCategories() {
	const fuse = new Fuse(megamenu, options)

	megamenuResult = fuse.search(searchCategoryValue)

	megamenuResult = megamenuResult.map((m) => {
		return m.item
	})

	if (!megamenuResult.length) {
		megamenuResult = megamenu
	}
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
		<!-- Categories slider mobile -->

		{#await data then categories}
			{#if data?.categories?.length}
				<div class="mb-5 sm:mb-10 block sm:hidden">
					<CategoriesMobile loading="{data.isFetching}" categories="{data?.categories}" />
				</div>
			{/if}
		{/await}

		<!-- Main slider banner -->

		{#await data.banners}
			<div class="h-96 w-full bg-zinc-200 animate-pulse"></div>
		{:then banners}
			<Hero banners="{banners}" />
		{/await}

		<!-- Hero banners -->

		{#await data.heroBanners}
			<div class="mt-5 sm:mt-10 grid grid-cols-2 items-center gap-2 md:grid-cols-4">
				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>
			</div>
		{:then heroBanners}
			{#if data.heroBanners?.length}
				<div class="mt-5 sm:mt-10">
					<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
						BEST OF {$page.data.store?.websiteName} EXCLUSIVE
					</h2>

					<HeroBanners heroBanners="{data.heroBanners}" />
				</div>
			{/if}
		{/await}

		<!-- Picked banners -->

		{#await data.groupByBanner}
			<div class="mt-5 sm:mt-10 grid grid-cols-2 items-center gap-2 md:grid-cols-4">
				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-1 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>

				<div class="col-span-2 h-40 animate-pulse rounded bg-zinc-200 sm:h-60"></div>
			</div>
		{:then groupByBanner}
			{#if data.groupByBanner?.length}
				<div class="mt-5 sm:mt-10">
					<PickedBanners banners="{data.groupByBanner}" />
				</div>
			{/if}
		{/await}

		{#if loadingForMegamenu}
			<ul class="px-3 py-5 sm:p-10 flex flex-col gap-4 m-0 list-none">
				{#each { length: 5 } as _}
					<li>
						<Skeleton />
					</li>
				{/each}
			</ul>
		{:else if megamenuResult.length}
			<div class="mt-5 sm:mt-10">
				<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">Categories</h2>

				<div class="px-3 sm:px-10 mb-5 sm:mb-10">
					<div class="w-full max-w-md mx-auto">
						<Textbox
							type="text"
							bind:value="{searchCategoryValue}"
							placeholder="Search category..."
							on:input="{searchCategories}" />
					</div>
				</div>

				<!-- 1st level categories -->

				<ul class="flex flex-col divide-y-2 divide-white tracking-wider">
					{#each megamenuResult as m, mx}
						{#if m}
							<li>
								{#if m.children?.length}
									<div
										class="flex h-24 gap-4 px-6 w-full items-center justify-between focus:outline-none
										{bgColors[mx]}">
										<a
											href="{navigateToProperPath(m.link || m.slug)}"
											aria-label="Click to visit {m.name || '##'}"
											class="block text-xl font-bold uppercase">
											{m.name}
										</a>

										<button
											type="button"
											class="overflow-hidden rounded-full bg-transparent hover:bg-white/50 transition duration-300 p-2 focus:outline-none"
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
								{:else}
									<a
										href="{navigateToProperPath(m.link || m.slug)}"
										aria-label="Click to visit {m.name || '##'}"
										class="flex items-center h-24 w-full text-xl font-bold uppercase px-6
										{bgColors[mx]}">
										{m.name}
									</a>
								{/if}

								<!-- 2nd level categories -->

								{#if showChild[mx]}
									{#if m.children?.length}
										<ul class="flex flex-col divide-y">
											{#each m.children as c, cx}
												<li class="font-medium">
													{#if c.children?.length}
														<div
															class="flex w-full items-center justify-between gap-4 h-14 px-6 focus:outline-none">
															<a
																href="{navigateToProperPath(c.link || c.slug)}"
																aria-label="Click to visit {c.name || '##'}"
																class="block">
																{c.name}
															</a>

															<button
																type="button"
																class="overflow-hidden rounded-full bg-transparent hover:bg-zinc-200/50 transition duration-300 p-2 focus:outline-none"
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
															href="{navigateToProperPath(c.link || c.slug)}"
															aria-label="Click to visit {c.name || '##'}"
															class="flex items-center h-14 px-6">
															<h6>{c.name}</h6>
														</a>
													{/if}

													<!-- 3rd level categories -->

													{#if showChild2[cx]}
														{#if c.children?.length}
															<ul class="flex flex-col divide-y bg-zinc-100">
																{#each c.children as cc}
																	<li>
																		<a
																			href="{navigateToProperPath(cc.link || cc.slug)}"
																			aria-label="Click to visit {cc.name || '##'}"
																			class="flex items-center h-14 px-6 text-sm">
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

		<!-- Footer show hide toggle -->

		<button
			type="button"
			class="lg:hidden p-3 sm:px-10 w-full flex items-center justify-between gap-4 text-sm focus:outline-none"
			on:click="{() => (showFooter = !showFooter)}">
			<span>More about {$page.data.store?.websiteName || 'store'}</span>

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

		<div class="{showFooter ? 'block' : 'hidden'}">
			<Footer />
		</div>
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</div>
