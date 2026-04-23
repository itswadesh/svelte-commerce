<script lang="ts">
	import { page } from '$app/state'
	let { 
		metaTitle = '', 
		metaDescription = '', 
		metaKeywords = '', 
		image = '',
		canonicalUrl = '',
		noindex = false
	} = $props()

	const finalCanonicalUrl = $derived(canonicalUrl || page.url.origin + page.url.pathname)

	const storeName = page.data?.store?.name || 'Litekart'
	const finalTitle = metaTitle || `${storeName} | Premium E-commerce Shopping`
	const finalDescription = metaDescription || page.data?.store?.description || `Discover the best deals on women's fashion at ${storeName}. Shop dresses, co-ord sets, and more with up to 70% off. Free delivery available.`
</script>

<svelte:head>
	<title>{finalTitle}</title>
	<meta name="description" content={finalDescription} />
	<meta name="keywords" content={metaKeywords} />
	<link rel="alternate" hreflang="en" href={finalCanonicalUrl} />
	<link rel="alternate" hreflang="x-default" href={finalCanonicalUrl} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<link rel="canonical" href={finalCanonicalUrl} />
	{/if}
	
	<meta property="og:title" content={finalTitle} />
	<meta property="og:description" content={finalDescription} />
	<meta property="og:image" content={image} />
	<meta property="og:type" content="website" />
	
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={finalTitle} />
	<meta name="twitter:description" content={finalDescription} />
	<meta name="twitter:image" content={image} />
</svelte:head>
