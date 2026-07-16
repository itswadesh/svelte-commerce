<script lang="ts">
	import { SeoHeader } from '$lib/core/components/index.js'
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import { page } from '$app/state'
	import ListingScehma from '$lib/components/product-catalogue/listing-scehma.svelte'

	setDesktopFilterState()
	setCategoryFilterState()
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
</script>

<ListingScehma />
<SeoHeader
	metaTitle={category?.metaTitle || category?.name || slugTitle || 'Products'}
	metaDescription={category?.metaDescription}
	metaKeywords={category?.metaKeywords}
	image={category?.banner}
/>

<ListingPage />
