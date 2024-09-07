<script lang="ts">
	import { page } from '$app/state'
	let { 
		metaTitle = '', 
		metaDescription = '', 
		metaKeywords = '', 
		image = '',
		canonicalUrl = page.url.href,
		noindex = false
	} = $props()

	const storeName = page.data?.store?.name || 'Litekart'
	const finalTitle = metaTitle || `${storeName} | Premium E-commerce Shopping`
	const finalDescription = metaDescription || page.data?.store?.description || `Shop the latest products at ${storeName}.`
</script>

<svelte:head>
	<title>{finalTitle}</title>
	<meta name="description" content={finalDescription} />
	<meta name="keywords" content={metaKeywords} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{:else}
		<link rel="canonical" href={canonicalUrl} />
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
