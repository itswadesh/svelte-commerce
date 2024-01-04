<script lang="ts">
import { page } from '$app/stores'
import dayjs from 'dayjs'
import hash from 'hash-it'

export let addressCountry = ''
export let addressLocality = ''
export let addressRegion = ''
export let article = false
export let author = null
export let brand = 'LRNR'
export let breadcrumbs = []
export let caption = ''
export let category = ''
export let contentUrl = ''
export let createdAt = null
export let datePublished = null
export let depth = { unitCode: '', value: '' }
export let description = null
export let email = ''
export let entity = null
export let entityMeta = null
export let facebookPage = null
export let featuredImage = null
export let githubPage = null
export let gtin = null
export let height = { unitCode: '', value: '' }
export let id = null
export let image = null
export let lastUpdated = null
export let linkedinProfile = null
export let logo = ''
export let metaDescription = ''
export let name = null
export let openingHours = ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00']
export let popularity = 1000
export let postalCode = ''
export let price = 1
export let priceRange = ''
export let ratingCount = 1
export let ratingValue = 5
export let siteLanguage = null
export let siteTitle = ''
export let siteTitleAlt = ''
export let siteUrl = $page.data.origin
export let sku = null
export let slug = null
export let streetAddress = ''
export let telegramUsername = null
export let title = ''
export let twitterUsername = null
export let updatedAt = null
export let url = $page.data.origin
export let weight = { unitCode: '', value: '' }
export let width = { unitCode: '', value: '' }

const nextWeek = dayjs().add(7, 'day')

const entityHash = hash({ author }, { algorithm: 'md5' })

const schemaOrgEntity =
	entityMeta !== null
		? {
				'@type': ['Store', 'Organization'],
				'@id': `${$page?.data?.store?.domain}/${entityHash}`,
				name: `${$page?.data?.store?.websiteName}`,
				url: siteUrl,
				email,
				address: {
					'@type': 'PostalAddress',
					streetAddress,
					addressLocality,
					addressRegion,
					postalCode,
					addressCountry
				},
				image: {
					'@type': 'ImageObject',
					'@id': `${siteUrl}/#logo`,
					inLanguage: siteLanguage,
					url: entityMeta?.url,
					width: entityMeta?.faviconWidth,
					height: entityMeta?.faviconHeight,
					caption: author
				},
				logo: {
					'@type': 'ImageObject',
					'@id': `${siteUrl}/#logo`,
					url: logo,
					contentUrl,
					caption,
					inLanguage: siteLanguage,
					width: '200',
					height: '83'
				},
				priceRange,
				openingHours,
				location: {
					'@id': location
				},
				sameAs: [
					`${$page.data.store?.socialSharingButtons?.twitter?.val}`,
					`${$page.data.store?.socialSharingButtons?.facebook?.val}`,
					`${$page.data.store?.socialSharingButtons?.instagram?.val}`,
					`${$page.data.store?.socialSharingButtons?.linkedin?.val}`,
					`${$page.data.store?.socialSharingButtons?.youtube?.val}`
				]
			}
		: null

const schemaOrgWebsite = {
	'@type': 'WebSite',
	'@id': `${siteUrl}/#website`,
	url: siteUrl,
	name: siteTitle,
	description: siteTitleAlt,
	publisher: {
		'@id': `${$page?.url?.href}/${entityHash}`
	},
	potentialAction: [
		{
			'@type': 'SearchAction',
			target: `${siteUrl}/?s={search_term_string}`,
			'query-input': 'required name=search_term_string'
		}
	],
	inLanguage: siteLanguage
}

const schemaOrgImageObject = {
	'@type': 'ImageObject',
	'@id': `${url}#primaryimage`,
	inLanguage: siteLanguage,
	url: featuredImage?.url,
	contentUrl: featuredImage?.url,
	width: featuredImage?.width,
	height: featuredImage?.height,
	caption: featuredImage?.caption
}

const schemaOrgBreadcrumbList = {
	'@type': 'BreadcrumbList',
	'@id': `${url}#breadcrumb`,
	itemListElement: breadcrumbs.map((element, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		item: {
			'@type': 'WebPage',
			'@id': `${siteUrl}/${element.slug}`,
			url: `${siteUrl}/${element.slug}`,
			name: element.name
		}
	}))
}

const schemaOrgWebPage = {
	'@type': 'WebPage',
	'@id': `${url}#webpage`,
	url,
	name: title,
	isPartOf: {
		'@id': `${siteUrl}/#website`
	},
	primaryImageOfPage: {
		'@id': `${url}#primaryimage`
	},
	datePublished,
	dateModified: lastUpdated,
	author: {
		'@id': `${$page?.url?.href}/${entityHash}`
	},
	description: metaDescription,
	breadcrumb: {
		'@id': `${url}#breadcrumb`
	},
	inLanguage: siteLanguage,
	potentialAction: [
		{
			'@type': 'ReadAction',
			target: [url]
		}
	]
}

let schemaOrgArticle = null
if (article) {
	schemaOrgArticle = {
		'@type': 'Article',
		'@id': `${url}#article`,
		isPartOf: {
			'@id': `${url}#webpage`
		},
		author: {
			'@id': `${$page?.url?.href}/${entityHash}`
		},
		headline: title,
		datePublished,
		dateModified: lastUpdated,
		mainEntityOfPage: {
			'@id': `${url}#webpage`
		},
		publisher: {
			'@id': `${$page?.url?.href}/${entityHash}`
		},
		image: {
			'@id': `${url}#primaryimage`
		},
		articleSection: ['blog'],
		inLanguage: siteLanguage
	}
}

const schemaOrgPublisher = {
	'@type': ['Person', 'Organization'],
	'@id': `${$page?.url?.href}/${entityHash}`,
	name: entity,
	image: {
		'@type': 'ImageObject',
		'@id': `${siteUrl}/#personlogo`,
		inLanguage: siteLanguage,
		url: `${siteUrl}/assets/logo.png`,
		contentUrl: `${siteUrl}/assets/logo.png`,
		width: 512,
		height: 512,
		caption: entity
	},
	logo: {
		'@id': `${siteUrl}/#personlogo`
	},
	sameAs: [
		`${$page.data.store?.socialSharingButtons?.twitter?.val}`,
		`${$page.data.store?.socialSharingButtons?.facebook?.val}`,
		`${$page.data.store?.socialSharingButtons?.instagram?.val}`,
		`${$page.data.store?.socialSharingButtons?.linkedin?.val}`,
		`${$page.data.store?.socialSharingButtons?.youtube?.val}`
	]
}
const schemaOrgProduct = {
	'@context': 'http://schema.org/',
	'@type': 'Product',
	'@id': `${siteUrl}/#product`,
	image: { '@id': `${featuredImage?.url}` },
	name,
	description,
	sku,
	gtin,
	brand,
	category,
	mainEntityOfPage: {
		'@id': `${url}#webpage`
	},
	weight: { '@type': 'QuantitativeValue', unitCode: weight.unitCode, value: weight.value },
	height: { '@type': 'QuantitativeValue', unitCode: height.unitCode, value: height.value },
	width: { '@type': 'QuantitativeValue', unitCode: width.unitCode, value: width.value },
	depth: { '@type': 'QuantitativeValue', unitCode: depth.unitCode, value: depth.value },
	aggregateRating: {
		'@type': 'AggregateRating',
		worstRating: 1,
		bestRating: 5,
		ratingCount,
		ratingValue
	},
	releaseDate: createdAt,
	dateModified: updatedAt,
	url: `${$page.data.origin}/product/${slug}`,
	interactionStatistic: {
		'@type': 'InteractionCounter',
		interactionType: 'http://schema.org/DownloadAction',
		userInteractionCount: popularity + 1000
	},
	offers: {
		'@type': 'Offer',
		availability: 'http://schema.org/InStock',
		priceValidUntil: nextWeek.toISOString(),
		url: `${$page.data.origin}/product/${slug}`,
		price: price < 1 ? '0.00' : price,
		priceCurrency: 'USD',
		itemCondition: 'NewCondition',
		seller: {
			'@type': 'Organization',
			'@id': `${siteUrl}`,
			name: $page?.data?.store?.websiteName,
			url: $page.data.origin,
			logo
		}
	}
}

const schemaItemPage = {
	'@type': 'ItemPage',
	'@id': `${$page?.url?.href}/#webpage`,
	url: `${$page.data.origin}/product/${slug}`,
	name: name,
	datePublished: datePublished,
	dateModified: lastUpdated,
	isPartOf: {
		'@id': `${siteUrl}/#website`
	},
	primaryImageOfPage: {
		'@id': `${url}#primaryimage`
	},
	inLanguage: siteLanguage
}

const schemaOrgArray = [
	schemaOrgEntity,
	schemaOrgWebsite,
	schemaOrgImageObject,
	schemaOrgWebPage,
	schemaOrgBreadcrumbList,
	schemaOrgPublisher,
	schemaOrgProduct,
	schemaItemPage
]
const schemaOrgObject = {
	'@context': 'https://schema.org',
	'@graph': schemaOrgArray
}
let jsonLdString = JSON.stringify(schemaOrgObject)
let jsonLdScript = `
		<script type="application/ld+json">
			${jsonLdString}
		${'<'}/script>
	`
</script>

<svelte:head>
	{@html jsonLdScript}
</svelte:head>
