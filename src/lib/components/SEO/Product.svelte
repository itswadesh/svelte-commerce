<script>
export let alternateJsonHref
export let alternateXml = { title: '', href: '' }
export let canonical
export let dnsPrefetch
export let productAvailability
export let productBrand
export let productName
export let productPriceAmount
export let productPriceCurrency
export let wlwmanifestXmlHref
</script>

<svelte:head>
	<link rel="canonical" href="{canonical}" />

	<link rel="dns-prefetch" href="{dnsPrefetch}" />

	<link
		rel="alternate"
		type="application/rss+xml"
		title="{alternateXml.title}"
		href="{alternateXml.href}" />

	<link rel="alternate" type="application/json" href="{alternateJsonHref}" />

	<link rel="wlwmanifest" type="application/wlwmanifest+xml" href="{wlwmanifestXmlHref}" />

	<meta property="product:brand" content="{productBrand}" />

	<meta property="product:name" content="{productName}" />

	<meta property="product:price:amount" content="{productPriceAmount}" />

	<meta property="product:price:currency" content="{productPriceCurrency}" />

	<meta property="product:availability" content="{productAvailability}" />
</svelte:head>
