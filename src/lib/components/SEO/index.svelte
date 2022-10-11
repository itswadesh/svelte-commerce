<script>
import {
	authorInfo,
	entity,
	ogLanguage,
	siteLanguage,
	siteShortTitle,
	siteTitle
} from '$lib/config'
import OpenGraph from './OpenGraph.svelte'
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

export let article = false
export let breadcrumbs = []
export let entityMeta = null
export let lastUpdated = null
export let datePublished = null
export let description = ''
export let slug = ''
export let timeToRead = 0
export let title = ''
export let keywords = ''

const defaultAlt = ''
export let featuredImage = {
	url: '',
	alt: defaultAlt,
	width: 672,
	height: 448,
	caption: 'Home page'
}
export let ogImage = {
	url: '',
	alt: defaultAlt
}
export let ogSquareImage = {
	url: '',
	alt: defaultAlt
}
export let twitterImage = {
	url: '',
	alt: defaultAlt
}
const url = `${$page.data.origin}/${slug}`
const pageTitle = `${title} ${siteTitle}`
const openGraphProps = {
	article,
	datePublished,
	lastUpdated,
	image: ogImage,
	squareImage: ogSquareImage,
	description,
	ogLanguage,
	pageTitle,
	siteTitle,
	url,
	...(article ? { datePublished, lastUpdated, facebookPageName, facebookAuthorPage } : {})
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
	description,
	siteLanguage,
	siteTitle,
	siteTitleAlt: siteShortTitle,
	siteUrl: $page.data.origin,
	title: pageTitle,
	url,
	facebookPageName,
	githubPage,
	linkedinProfile,
	telegramUsername,
	twitterUsername
}
const twitterProps = {
	article,
	author,
	twitterUsername,
	image: twitterImage,
	timeToRead
}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content="{description}" />
	<meta name="keywords" content="{keywords}" />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
	<html lang="{siteLanguage}"></html>
</svelte:head>
<Twitter {...twitterProps} />
<OpenGraph {...openGraphProps} />
<SchemaOrg {...schemaOrgProps} />
