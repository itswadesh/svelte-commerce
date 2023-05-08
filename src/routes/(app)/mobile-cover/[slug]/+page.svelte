<script>
import { page } from '$app/stores'
import {Breadcrumb} from '$lib/components'
import landingPageMobileBox from '$lib/assets/landing-page-mobile-box.webp'
import SEO from '$lib/components/SEO/index.svelte'

export let data
// console.log('data = ', data)
// console.log('$page = ', $page)

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

let selectedBrandAllModels = []
let selectedBrandSlug = $page.params.slug

$: if (data.megamenu.length) {
	const mocv = data.megamenu.filter((obj) => obj.name === 'Mobile Cover')
	// console.log('mocv', mocv)
	// console.log('mocv[0].children', mocv[0].children)

	const selectedBrandObject = mocv[0].children.filter((obj) => obj.slug === selectedBrandSlug)
	// console.log('selectedBrandObject', selectedBrandObject)

	selectedBrandAllModels = selectedBrandObject[0].children
	// console.log('selectedBrandAllModels', selectedBrandAllModels)
}
</script>

<SEO {...seoProps} />

<div class="min-h-screen px-3 py-5 lg:p-10">
	<div class="md:container md:mx-auto">
		<div class="mb-5">
			<!-- Breadcrumb -->

			<Breadcrumb
				categoryPool="{[{ slug: 'mobile-cover', name: 'Mobile Cover' }]}"
				currentProductName="{data.category?.name}" />
		</div>

		<div class="bg-zinc-100 p-5 sm:p-10">
			<header class="mb-10">
				<h1 class="text-xl font-bold capitalize md:text-2xl">{data.category?.name} Back Covers</h1>

				<div class="w-32 h-0.5 bg-primary-500"></div>
			</header>

			<div class="mb-10 sm:mb-20 grid grid-cols-1 xl:grid-cols-4 gap-10">
				<div class="col-span-1 xl:col-span-3 bg-white p-5 sm:p-10">
					<a
						href="/mobile-cover"
						class="mb-5 ml-auto max-w-max flex items-center text-primary-500 underline hover:no-underline focus:outline-none">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5">
							<path
								fill-rule="evenodd"
								d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
								clip-rule="evenodd"></path>
						</svg>

						<span> Back </span>
					</a>

					{#if selectedBrandAllModels?.length}
						<ul class="grid grid-cols-2 sm:grid-cols-3 gap-5 p-0 m-0 list-none text-sm">
							{#each selectedBrandAllModels as b, bx}
								{#if b && bx < 10}
									<li class="col-span-1">
										<a href="/{b.slug}" class="block relative max-w-max">
											<span>{b.name}</span>

											{#if b.new}
												<div class="absolute -top-1 -right-8 text-red-500 text-xs font-semibold">
													NEW
												</div>
											{/if}
										</a>
									</li>
								{/if}
							{/each}
						</ul>
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
