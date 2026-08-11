<script lang="ts">
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import { stripPageOnFilterNavigation } from '$lib/components/product-catalogue/strip-page-on-filter'
	import { page } from '$app/state'
	import ListingScehma from '$lib/components/product-catalogue/listing-scehma.svelte'

	setDesktopFilterState()
	setCategoryFilterState()
	stripPageOnFilterNavigation()

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

	// +page.ts now 404s an unresolvable slug outright, so this only catches the narrowed case it
	// deliberately lets through: a real listing filtered down to nothing (/pendant?price=999999).
	// Those must stay crawlable-but-unindexed rather than becoming thin duplicates of the category.
	const unresolved = $derived(!category && !data?.products?.data?.length)

	// SeoHeader otherwise falls back to origin + pathname, canonicalising /pendant?page=3 to
	// /pendant and getting every deep listing page dropped as a duplicate of page 1.
	const pageParam = $derived(page.url.searchParams.get('page'))
	const canonicalUrl = $derived(page.url.origin + page.url.pathname + (pageParam && pageParam !== '1' ? `?page=${pageParam}` : ''))
</script>

<ListingScehma />
<SeoHeader
	metaTitle={category?.metaTitle || category?.name || slugTitle || 'Products'}
	metaDescription={category?.metaDescription}
	metaKeywords={category?.metaKeywords}
	image={category?.banner || data?.store?.logo || ''}
	{canonicalUrl}
	noindex={unresolved}
/>

<ListingPage />
