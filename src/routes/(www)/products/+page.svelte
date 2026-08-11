<script lang="ts">
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import { stripPageOnFilterNavigation } from '$lib/components/product-catalogue/strip-page-on-filter'
	import { page } from '$app/state'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import ListingScehma from '$lib/components/product-catalogue/listing-scehma.svelte'

	setDesktopFilterState()
	setCategoryFilterState()
	stripPageOnFilterNavigation()

	const data = $derived(page.data)

	// SeoHeader falls back to origin + pathname, which canonicalises /products?page=7 to /products
	// and gets every deep listing page dropped as a duplicate of page 1. Keep `page` (and only
	// `page` — facets and sort really do belong on page 1's canonical).
	const pageParam = $derived(page.url.searchParams.get('page'))
	const canonicalUrl = $derived(page.url.origin + page.url.pathname + (pageParam && pageParam !== '1' ? `?page=${pageParam}` : ''))
</script>

<ListingScehma />
<!-- These fallbacks used to name a different merchant ("Arialshop") and promise concrete terms —
     free delivery over ₹999, 7-day returns — that the deploying store may not offer. Every store
     cloned from this template published a competitor's brand and someone else's policy in its
     catalogue title and description. Derive them from the store instead. -->
<SeoHeader
	metaTitle={data.page?.metaTitle ||
		(data.products?.categoryHierarchy?.length > 0
			? `${data.products.categoryHierarchy[data.products.categoryHierarchy.length - 1].name} | ${data.store?.name ?? 'Shop'}`
			: `All products | ${data.store?.name ?? 'Shop'}`)}
	metaDescription={data.page?.metaDescription || data.store?.description || ''}
	metaKeywords={data.page?.metaKeywords ?? ''}
	image={data.page?.logo || data.store?.logo || ''}
	{canonicalUrl}
/>

<ListingPage />
