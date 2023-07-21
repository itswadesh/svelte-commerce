<script lang="ts">
import { authorInfo, WWW_URL, entity, ogLanguage, siteLanguage, siteShortTitle } from '$lib/config'
import OpenGraph from './OpenGraph.svelte'
import Product from './Product.svelte'
import SchemaOrg from './SchemaOrg.svelte'
import Twitter from './Twitter.svelte'
import { page } from '$app/stores'
const {
	author,
	facebookAuthorPage,
	facebookPageName,
	githubPage,
	linkedinProfile,
	telegramUsername,
	twitterUsername
} = authorInfo

const defaultAlt = 'LRNR'

export let addressCountry = ''
export let addressLocality = ''
export let addressRegion = ''
export let alternateJsonHref = ''
export let alternateXml = { title: '', href: '' }
export let article = false
export let brand = 'LRNR'
export let breadcrumbs = []
export let canonical = ''
export let caption = ''
export let category = ''
export let contentUrl = ''
export let createdAt = null
export let datePublished = null
export let depth = { unitCode: '', value: '' }
export let description = ''
export let dnsPrefetch = ''
export let email = ''
export let entityMeta = null
export let facebookPage = null
export let featuredImage = {
	url: '',
	alt: defaultAlt,
	width: null,
	height: null,
	caption: 'Home page'
}
export let gtin = null
export let height = { unitCode: '', value: '' }
export let id = null
export let image = null
export let keywords = ''
export let lastUpdated = null
export let logo = ''
export let metaDescription = ''
export let msapplicationTileImage = ''
export let ogImage = { url: '', alt: defaultAlt, width: null, height: null }
export let ogImageSecureUrl = ''
export let ogImageType = ''
export let ogSiteName = ''
export let ogSquareImage = { url: '', alt: defaultAlt, width: null, height: null }
export let openingHours = ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00']
export let popularity = 1000
export let postalCode = ''
export let price = 1
export let priceRange = ''
export let productAvailability = ''
export let productBrand = ''
export let productName = null
export let productPriceAmount = null
export let productPriceCurrency = ''
export let ratingCount = 1
export let ratingValue = 5
export let sku = null
export let slug = ''
export let streetAddress = ''
export let timeToRead = 0
export let title = ''
export let twitterImage = { url: '', alt: defaultAlt }
export let updatedAt = null
export let weight = { unitCode: '', value: '' }
export let width = { unitCode: '', value: '' }
export let wlwmanifestXmlHref = ''

const url = `${WWW_URL}/${slug}`

let pageTitle
if (title) {
	pageTitle = `${title} - ${$page.data?.store?.websiteName}`
} else {
	pageTitle = `${$page.data?.store?.websiteName}`
}

const openGraphProps = {
	article,
	datePublished,
	lastUpdated,
	image: ogImage,
	squareImage: ogSquareImage,
	metaDescription,
	ogLanguage,
	pageTitle,
	siteTitle: $page.data?.store?.websiteName,
	url,
	...(article ? { datePublished, lastUpdated, facebookPageName, facebookAuthorPage } : {})
}
const schemaOrgProps = {
	article,
	author,
	breadcrumbs,
	datePublished,
	description,
	entity,
	entityMeta,
	facebookPageName,
	featuredImage,
	githubPage,
	lastUpdated,
	linkedinProfile,
	name: productName,
	siteLanguage,
	siteTitle: $page.data?.store?.websiteName,
	siteTitleAlt: siteShortTitle,
	siteUrl: WWW_URL,
	telegramUsername,
	title: pageTitle,
	twitterUsername,
	url,
	addressCountry,
	addressLocality,
	addressRegion,
	brand,
	caption,
	category,
	contentUrl,
	createdAt,
	depth,
	email,
	facebookPage,
	gtin,
	height,
	id,
	image,
	logo,
	metaDescription,
	openingHours,
	popularity,
	postalCode,
	price,
	priceRange,
	ratingCount,
	ratingValue,
	sku,
	slug,
	streetAddress,
	updatedAt,
	weight,
	width
}
const twitterProps = {
	title: pageTitle,
	description: metaDescription,
	article,
	author,
	twitterUsername,
	image: twitterImage,
	timeToRead
}
const productProps = {
	alternateJsonHref,
	alternateXml,
	canonical,
	dnsPrefetch,
	productAvailability,
	productBrand,
	productName,
	productPriceAmount,
	productPriceCurrency,
	wlwmanifestXmlHref
}
</script>

<svelte:head>
	<title>{pageTitle}</title>

	<meta name="description" content="{metaDescription}" />

	<meta name="keywords" content="{keywords}" />

	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

	<meta property="og:site_name" content="{ogSiteName}" />

	<meta property="og:image:secure_url" content="{ogImageSecureUrl}" />

	<meta property="og:image:type" content="{ogImageType}" />

	<meta name="msapplication-TileImage" content="{msapplicationTileImage}" />

	<!-- <html lang="{siteLanguage}"></html> -->
</svelte:head>

<Twitter {...twitterProps} />

<Product {...productProps} />

<OpenGraph {...openGraphProps} />

<SchemaOrg {...schemaOrgProps} />
