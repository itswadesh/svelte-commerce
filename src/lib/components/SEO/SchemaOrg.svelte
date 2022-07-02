<script>
import { WWW_URL } from '$lib/config'
import dayjs from 'dayjs'
import hash from 'hash-it'
export let article = false
export let author = null
export let breadcrumbs = []
export let datePublished = null
export let entity = null
export let lastUpdated = null
export let featuredImage = null
export let metadescription = ''
export let siteLanguage = null
export let siteTitle = ''
export let siteTitleAlt = ''
export let siteUrl = WWW_URL
export let title = ''
export let url = WWW_URL
export let facebookPage = null
export let githubPage = null
export let linkedinProfile = null
export let telegramUsername = null
export let twitterUsername = null
export let name = null
export let description = null
export let sku = null
export let price = 1
export let image = null
export let gtin = null
export let brand = 'Litekart'
export let ratingCount = 1
export let ratingValue = 5
export let createdAt = null
export let updatedAt = null
export let slug = null
export let id = null
export let popularity = 1000
export let entityMeta = null
const nextWeek = dayjs().add(7, 'day')

const entityHash = hash({ author }, { algorithm: 'md5' })

const schemaOrgEntity =
	entityMeta !== null
		? {
				'@type': ['Person', 'Organization'],
				'@id': `${siteUrl}/#/schema/person/${entityHash}`,
				name: author,
				image: {
					'@type': 'ImageObject',
					'@id': `${siteUrl}/#personlogo`,
					inLanguage: siteLanguage,
					url: entityMeta?.url,
					width: entityMeta?.faviconWidth,
					height: entityMeta?.faviconHeight,
					caption: author
				},
				logo: {
					'@id': `${siteUrl}/#personlogo`
				},
				sameAs: [
					`https://twitter.com/${twitterUsername}`,
					`https://github.com/${githubPage}`,
					`https://t.me/${telegramUsername}`,
					`https://linkedin.com/in/${linkedinProfile}`,
					facebookPage
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
		'@id': `${siteUrl}/#/schema/person/${entityHash}`
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
		'@id': `${siteUrl}/#/schema/person/${entityHash}`
	},
	description: metadescription,
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
			'@id': `${siteUrl}/#/schema/person/${entityHash}`
		},
		headline: title,
		datePublished,
		dateModified: lastUpdated,
		mainEntityOfPage: {
			'@id': `${url}#webpage`
		},
		publisher: {
			'@id': `${siteUrl}/#/schema/person/${entityHash}`
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
	'@id': `${siteUrl}/#/schema/person/${entityHash}`,
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
		`https://twitter.com/${twitterUsername}`,
		`https://github.com/${githubPage}`,
		`https://t.me/${telegramUsername}`,
		`https://linkedin.com/in/${linkedinProfile}`,
		facebookPage
	]
}
const schemaOrgProduct = {
	'@context': 'http://schema.org/',
	'@type': 'Product',
	name,
	description,
	sku,
	image,
	gtin,
	brand,
	aggregateRating: {
		'@type': 'AggregateRating',
		worstRating: 1,
		bestRating: 5,
		ratingCount,
		ratingValue
	},
	releaseDate: createdAt,
	dateModified: updatedAt,
	url: `${WWW_URL}/${slug}?id=${id}`,
	interactionStatistic: {
		'@type': 'InteractionCounter',
		interactionType: 'http://schema.org/DownloadAction',
		userInteractionCount: popularity + 1000
	},
	offers: {
		'@type': 'Offer',
		availability: 'http://schema.org/InStock',
		priceValidUntil: nextWeek.toISOString(),
		url: `${WWW_URL}/${slug}?id=${id}`,
		price: price < 1 ? '0.00' : price,
		priceCurrency: 'INR',
		seller: {
			'@type': 'Organization',
			name: 'Litekart',
			url: WWW_URL
		}
	}
}

const schemaOrgArray = [
	schemaOrgEntity,
	schemaOrgWebsite,
	schemaOrgImageObject,
	schemaOrgWebPage,
	schemaOrgBreadcrumbList,
	schemaOrgPublisher,
	schemaOrgProduct
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
