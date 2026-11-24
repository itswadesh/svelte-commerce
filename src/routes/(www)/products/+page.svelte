<script lang="ts">
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import { stripPageOnFilterNavigation } from '$lib/components/product-catalogue/strip-page-on-filter'
	import { scopeListingFilters } from '$lib/components/product-catalogue/scope-filters'
	import { page } from '$app/state'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import ListingScehma from '$lib/components/product-catalogue/listing-scehma.svelte'
	import { browser } from '$app/environment'
	import { mainCategoryFromCookies } from '$lib/components/common/main-category'

	setDesktopFilterState()
	setCategoryFilterState()
	stripPageOnFilterNavigation()
	scopeListingFilters()

	const data = $derived(page.data)

	// A search sends the shopper back to the main category they last browsed, read fresh from the
	// cookie on every search so a new term from this page keeps pointing at the same one. None
	// visited this session: no button, rather than an invented destination.
	const back = $derived.by(() => {
		if (!page.url.searchParams.get('search')) return null
		return browser ? mainCategoryFromCookies(document.cookie) : (data.mainCategory ?? null)
	})
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
/>

<ListingPage {back} />
