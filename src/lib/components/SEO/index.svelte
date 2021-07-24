<script>
import { authorInfo, WWW_URL } from './../../../../config'
import OpenGraph from './OpenGraph.svelte'
import SchemaOrg from './SchemaOrg.svelte'
import Twitter from './Twitter.svelte'

const {
	author,
	entity,
	facebookAuthorPage,
	facebookPage,
	ogLanguage,
	siteLanguage,
	siteShortTitle,
	siteTitle,
	githubPage,
	linkedinProfile,
	telegramUsername,
	twitterUsername,
} = authorInfo

export let article = false
export let breadcrumbs = []
export let entityMeta = null
export let lastUpdated
export let datePublished
export let metadescription
export let slug
export let timeToRead = 0
export let title

const defaultAlt = ''

export let featuredImage = {
	url: '',
	alt: defaultAlt,
	width: 672,
	height: 448,
	caption: 'Home page',
}
export let ogImage = {
	url: '',
	alt: defaultAlt,
}
export let ogSquareImage = {
	url: '',
	alt: defaultAlt,
}
export let twitterImage = {
	url: '',
	alt: defaultAlt,
}
const url = `${WWW_URL}/${slug}`
const pageTitle = `${title} ${siteTitle}`
const openGraphProps = {
	article,
	datePublished,
	lastUpdated,
	image: ogImage,
	squareImage: ogSquareImage,
	metadescription,
	ogLanguage,
	pageTitle,
	siteTitle,
	url,
	...(article ? { datePublished, lastUpdated, facebookPage, facebookAuthorPage } : {}),
}
const schemaOrgProps = {
	article,
	author,
	breadcrumbs,
	datePublished,
	entity,
	lastUpdated,
	entityMeta,
	featuredImage,
	metadescription,
	siteLanguage,
	siteTitle,
	siteTitleAlt: siteShortTitle,
	siteUrl: WWW_URL,
	title: pageTitle,
	url,
	facebookPage,
	githubPage,
	linkedinProfile,
	telegramUsername,
	twitterUsername,
}
const twitterProps = {
	article,
	author,
	twitterUsername,
	image: twitterImage,
	timeToRead,
}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content="{metadescription}" />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
	<html lang="{siteLanguage}"></html>
</svelte:head>
<Twitter {...twitterProps} />
<OpenGraph {...openGraphProps} />
<SchemaOrg {...schemaOrgProps} />
