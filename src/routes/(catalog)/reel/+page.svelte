<script lang="ts">
import { page } from '$app/stores'
import {CatelogNav} from '$lib/components'
import dayjs from 'dayjs'
import SEO from '$lib/components/SEO/index.svelte'
import ReelSlider from './ReelSlider.svelte'

export let data

let today = dayjs(new Date()).toISOString()

let seoProps = {
	brand: $page.data.store?.title,
	caption: $page.data.store?.title,
	category: data.searchData,
	contentUrl: $page.data.store?.logo,
	createdAt: today,
	email: `${$page?.data?.store?.email}`,

	id: $page?.url?.href,
	image: $page.data.store?.logo,
	logo: $page.data.store?.logo,
	ogSquareImage: { url: '', width: 56, height: 56 },
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00'],
	timeToRead: 0,
	updatedAt: today,
	metaDescription: $page.data.store?.metaDescription,
	canonical: `${$page?.url.href}`,
	datePublished: today,
	description: $page.data.store?.description,
	dnsPrefetch: `//cdn.jsdelivr.net`,
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
	productBrand: data.searchData,
	productName: data.searchData,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `/`,
	title: data.searchData || 'Buy online',
	twitterImage: { url: $page.data.store?.logo }
}
</script>

<SEO {...seoProps} />

<div class="h-full min-h-screen max-w-sm justify-center text-center">
	<div class="">
		<ReelSlider products="{data.data}" />
	</div>
</div>
