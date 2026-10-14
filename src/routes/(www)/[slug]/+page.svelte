<script lang="ts">
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import { stripPageOnFilterNavigation } from '$lib/components/product-catalogue/strip-page-on-filter'
	import { scopeListingFilters } from '$lib/components/product-catalogue/scope-filters'
	import { page } from '$app/state'
	import ListingScehma from '$lib/components/product-catalogue/listing-scehma.svelte'

	setDesktopFilterState()
	setCategoryFilterState()
	stripPageOnFilterNavigation()
	scopeListingFilters()

	const data = $derived(page.data)

	// The slug load returns { products } with the category under products.categoryHierarchy
	// (there is no data.page here); the last entry is the current category.
	const category = $derived(data?.products?.categoryHierarchy?.at(-1))

	// Readable fallback derived from the URL slug (e.g. "engagement-rings" -> "Engagement Rings")
	const slugTitle = $derived(
		(page.params.slug || '')
			.split(/[-_]/)
			.filter(Boolean)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ')
	)

	// +page.ts 404s an unresolvable slug outright. What reaches here with no products is either a
	// real category that has none yet, or a real listing filtered down to nothing
	// (/pendant?price=999999). Both stay crawlable but unindexed: a thin "no results" page must not
	// compete with the category once it has stock.
	const empty = $derived(!data?.products?.data?.length)
</script>

<ListingScehma />
<SeoHeader
	metaTitle={category?.metaTitle || category?.name || slugTitle || 'Products'}
	metaDescription={category?.metaDescription}
	metaKeywords={category?.metaKeywords}
	image={category?.banner || data?.store?.logo || ''}
	noindex={empty}
/>

<ListingPage />
