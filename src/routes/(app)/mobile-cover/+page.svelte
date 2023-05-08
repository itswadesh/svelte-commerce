<script>
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import CatelogNav from '$lib/CatelogNav.svelte'
import landingPageMobileBox from '$lib/assets/landing-page-mobile-box.webp'
import {Breadcrumb} from '$lib/components'
import SEO from '$lib/components/SEO/index.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'

export let data
// console.log('data = ', data)

let seoProps = {
	// addressCountry: 'India',
	// addressLocality: 'Semiliguda, Koraput',
	// addressRegion: 'Odisha',
	// alternateJsonHref: '',
	// alternateXml: { title: '', href: '' },
	brand: $page.data.store?.title,
	breadcrumbs: data.category?.children,
	caption: $page.data.store?.title,
	category: data.category?.name,
	contentUrl: $page.data.store?.logo,
	createdAt: `${data.category?.createdAt || '_'}`,
	// depth: { unitCode: '', value: '' },
	email: `${$page?.data?.store?.email}`,
	// entityMeta: '',
	// facebookPage: '',
	// gtin: '',
	// height: '',
	id: $page?.url?.href,
	image: `${data.category?.img}`,
	logo: $page.data.store?.logo,
	ogSquareImage: { url: '', width: 56, height: 56 },
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00'],
	// popularity: data.category?.popularity,
	// postalCode: '764036',
	// price: data.category?.price,
	// priceRange: `${data.category?.price}-${data.category?.mrp}`,
	// ratingCount: 1,
	// ratingValue: +data.category?.ratings + 1,
	// sku: data.category?.sku,
	// streetAddress: 'Padmajyoti Marg, Nandapur Road',
	timeToRead: 0,
	updatedAt: `${data.category?.updatedAt || '_'}`,
	// weight: { unitCode: '', value: '' },
	// width: { unitCode: '', value: '' },
	// wlwmanifestXmlHref: '',
	metadescription: data.category?.metaDescription,
	// article: false,
	canonical: `${$page?.url.href}`,
	datePublished: `${data.category?.publishedAt || '_'}`,
	description: ` ${data.category?.description}`,
	dnsPrefetch: `//cdn.jsdelivr.net`,
	// entityMeta: null,
	featuredImage: {
		url: `${data.category?.img}`,
		width: 675,
		height: 380,
		caption: data.category?.name
	},
	keywords: $page.data.store?.keywords,
	lastUpdated: `${data.category?.updatedAt || '_'}`,
	msapplicationTileImage: `${data.category?.img}`,
	ogImage: { url: $page.data.store?.logo, width: 128, height: 56 },
	ogImageSecureUrl: `${$page?.data?.store?.logo}`,
	ogImageType: 'image/jpeg',
	ogSiteName: `${$page.data.origin}/sitemap/sitemap.xml`,
	productAvailability: `${data.category?.stock}`,
	productBrand: `${data.category?.brandName || $page.data.store?.title}`,
	productName: `${data.category?.name}`,
	// productPriceAmount: `${data.category?.price}`,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `${data.category?.slug}`,
	// timeToRead: 0,
	title: `${data.category?.name || 'Buy online in - ' + $page.data.store?.websiteName}`,
	twitterImage: { url: `${data.category?.img}` }
}

let mobileBrands = []
let selectedBrandAllModels = []
let selectedBrandSlug = ''
let selectedModelSlug = ''
let searchUrl = ''
let searchDenied = false

$: if (data.megamenu.length) {
	const mocv = data.megamenu.filter((obj) => obj.name === 'Mobile Cover')
	// console.log('mocv', mocv)

	mobileBrands = mocv[0].children
	// console.log('mobileBrands', mobileBrands)
}

function handleSelectedBrand(e) {
	const selectedBrandSlug = e.target.value
	// console.log('selectedBrandSlug', selectedBrandSlug)

	selectedBrandAllModels = []

	const selectedBrandObject = mobileBrands.filter((obj) => obj.slug === selectedBrandSlug)
	// console.log('selectedBrandObject', selectedBrandObject)

	selectedBrandAllModels = selectedBrandObject[0].children
	// console.log('selectedBrandAllModels', selectedBrandAllModels)
}

function handleOptionChange(e) {
	selectedModelSlug = e.target.value
}

function searchSubmit() {
	if (selectedBrandSlug && selectedModelSlug) {
		const url = `/${selectedModelSlug}`

		goto(url)
	} else {
		searchDenied = true

		setTimeout(() => {
			searchDenied = false
		}, 820)
	}
}
</script>

<SEO {...seoProps} />

<div class="min-h-screen px-3 py-5 lg:p-10">
	<div class="md:container md:mx-auto">
		<div class="mb-5">
			<!-- Breadcrumb -->

			<Breadcrumb currentProductName="Mobile Cover" />
		</div>

		<div class="bg-zinc-100 p-5 sm:p-10">
			<header class="mb-10">
				<h1 class="text-xl font-bold capitalize md:text-2xl">Mobile Covers And Cases</h1>

				<div class="w-32 h-0.5 bg-primary-500"></div>
			</header>

			<div class="mb-10 sm:mb-20 grid grid-cols-1 xl:grid-cols-4 gap-10">
				<div class="col-span-1 xl:col-span-3 bg-white p-5 sm:p-10">
					<div class="mb-5 grid grid-cols-4 gap-2">
						<div class="col-span-4 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
							<div class="col-span-1">
								<select
									class="w-full rounded border border-zinc-200 p-2 focus:border-primary-500 focus:outline-none"
									disabled="{mobileBrands?.length < 1}"
									bind:value="{selectedBrandSlug}"
									on:change="{handleSelectedBrand}">
									<option value="" selected disabled>Select Brand</option>
									{#if mobileBrands?.length}
										{#each mobileBrands as m}
											{#if m}
												<option value="{m.slug}">{m.name}</option>
											{/if}
										{/each}
									{/if}
								</select>
							</div>

							<div class="col-span-1">
								<select
									class="w-full rounded border border-zinc-200 p-2 focus:border-primary-500 focus:outline-none"
									disabled="{selectedBrandAllModels?.length < 1}"
									bind:value="{selectedModelSlug}"
									on:change="{handleOptionChange}">
									<option value="" selected disabled>Select Model</option>
									{#if selectedBrandAllModels?.length}
										{#each selectedBrandAllModels as model}
											<option value="{model.slug}">{model.name}</option>
										{/each}
									{/if}
								</select>
							</div>
						</div>

						<div class="col-span-3 sm:col-span-2 lg:col-span-1" class:wiggle="{searchDenied}">
							<PrimaryButton
								type="button"
								class="w-full max-w-xs"
								hideLoading
								disabled="{!selectedModelSlug}"
								on:click="{searchSubmit}">
								Search
							</PrimaryButton>

							<a href="/contact-us" class="mt-1 block text-xs text-primary-500">
								Model not listed here? Tell us.
							</a>
						</div>
					</div>

					{#if mobileBrands?.length}
						<div class="text-sm">
							<h3 class="uppercase text-zinc-400 tracking-widest font-semibold mb-5">Popular</h3>

							<ul class="grid grid-cols-1 sm:grid-cols-3 gap-5 p-0 m-0 list-none">
								{#each mobileBrands as m, mx}
									<li class="col-span-1">
										<a href="/mobile-cover/{m.slug}">
											{m.name}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>

				<div class="col-span-1">
					<img
						src="{landingPageMobileBox}"
						alt="mobile box"
						class="h-72 w-auto object-contain object-top" />
				</div>
			</div>

			{#if data.category?.description && data.category?.description?.length > 11}
				<div class="prose prose-sm max-w-none text-justify">
					{@html data.category?.description}
				</div>
			{/if}
		</div>
	</div>
</div>
