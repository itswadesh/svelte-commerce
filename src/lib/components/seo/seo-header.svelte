<script lang="ts">
	import { page } from '$app/state'
	import { cleanSchemaText, mediaUrl } from './schema.js'

	// The app's own head tags. The vendored SeoHeader they replace always said og:type "website",
	// shipped an empty keywords tag, passed site-relative pictures through (which no social network
	// or chat app can fetch) and had no robots, locale or price tags, so product links shared on
	// WhatsApp or Facebook showed a bare card. Every page renders this one, so a fix here is a fix
	// everywhere.
	type Props = {
		metaTitle?: string
		metaDescription?: string
		metaKeywords?: string
		image?: string
		imageAlt?: string
		canonicalUrl?: string
		noindex?: boolean
		/** og:type. A product page also passes its price, which Facebook and Pinterest show. */
		type?: 'website' | 'product' | 'article'
		price?: number | string | null
		currency?: string
		/** A schema.org availability URL, as stockAvailabilityUrl returns. */
		availability?: string
	}
	const {
		metaTitle = '',
		metaDescription = '',
		metaKeywords = '',
		image = '',
		imageAlt = '',
		canonicalUrl = '',
		noindex = false,
		type = 'website',
		price = null,
		currency = '',
		availability = ''
	}: Props = $props()

	const store = $derived(page.data?.store)
	const storeName = $derived(store?.name || 'Litekart')

	// CMS-authored titles arrive with stray wrapping quotes.
	const stripQuotes = (value: unknown) =>
		String(value ?? '')
			.trim()
			.replace(/^["']+|["']+$/g, '')
			.trim()
	const title = $derived(stripQuotes(metaTitle) || storeName)

	// A page with no description of its own (a category without SEO fields) falls back to the
	// store's, cleaned of the markup it is stored with, then to the store's name. Never a made-up
	// promise such as free delivery.
	const description = $derived(metaDescription || cleanSchemaText(store?.description) || storeName)

	// The default canonical is origin + pathname, which folds /products?page=7 into /products and
	// gets every deep listing page dropped as a duplicate of page 1. A paginated page keeps its own
	// `?page=N`; sort, filter and tracking parameters are still dropped. An explicit one still wins.
	const pageNumber = $derived(Math.floor(Number(page.url.searchParams.get('page'))) || 1)
	const canonical = $derived(canonicalUrl || page.url.origin + page.url.pathname + (pageNumber > 1 ? `?page=${pageNumber}` : ''))

	// A page without a picture of its own shares the store's logo rather than a bare grey card.
	const imageUrl = $derived(mediaUrl(page.url.origin, image || store?.logo))

	// og:locale is language_TERRITORY ("en_IN"), from the store's language and country when both are known.
	const locale = $derived.by(() => {
		const language = String(store?.language || '').trim()
		if (/^[a-z]{2}[-_][A-Z]{2}$/.test(language)) return language.replace('-', '_')
		const country = String(store?.businessCountry || '')
			.trim()
			.toUpperCase()
		return /^[a-z]{2}$/.test(language) && /^[A-Z]{2}$/.test(country) ? `${language}_${country}` : ''
	})

	const OG_AVAILABILITY: Record<string, string> = {
		'https://schema.org/InStock': 'in stock',
		'https://schema.org/OutOfStock': 'out of stock',
		'https://schema.org/BackOrder': 'available for order',
		'https://schema.org/PreOrder': 'preorder'
	}
	const hasPrice = $derived(type === 'product' && price !== null && price !== '' && Number.isFinite(Number(price)) && !!currency)
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if metaKeywords}
		<meta name="keywords" content={metaKeywords} />
	{/if}
	<link rel="alternate" hreflang="en" href={canonical} />
	<link rel="alternate" hreflang="x-default" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<link rel="canonical" href={canonical} />
		<!-- Only permissions, never "index": a page that adds its own noindex must not be contradicted. -->
		<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	{/if}

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content={storeName} />
	<meta property="og:type" content={type} />
	{#if locale}
		<meta property="og:locale" content={locale} />
	{/if}
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta property="og:image:alt" content={imageAlt || title} />
	{/if}
	{#if hasPrice}
		<meta property="product:price:amount" content={String(Number(price))} />
		<meta property="product:price:currency" content={currency} />
		{#if OG_AVAILABILITY[availability]}
			<meta property="product:availability" content={OG_AVAILABILITY[availability]} />
		{/if}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if imageUrl}
		<meta name="twitter:image" content={imageUrl} />
		<meta name="twitter:image:alt" content={imageAlt || title} />
	{/if}
</svelte:head>
