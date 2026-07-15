<script lang="ts">
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import { page } from '$app/state'
	import { SeoHeader } from '$lib/core/components/index.js'
	import ListingScehma from '$lib/components/product-catalogue/listing-scehma.svelte'

	setDesktopFilterState()
	setCategoryFilterState()

	const data = $derived(page.data)
</script>

<ListingScehma />
<SeoHeader
	metaTitle={data.page?.metaTitle ||
		(data.products?.categoryHierarchy?.length > 0
			? `${data.products.categoryHierarchy[data.products.categoryHierarchy.length - 1].name} — Fine Diamond & Gold Jewellery${data.store?.name ? ` | ${data.store.name}` : ''}`
			: `Fine Diamond & Gold Jewellery — Rings, Earrings, Necklaces & Bridal${data.store?.name ? ` | ${data.store.name}` : ''}`)}
	metaDescription={data.page?.metaDescription ||
		'Explore our curated collection of fine diamond and gold jewellery — rings, earrings, necklaces, bracelets and bridal sets. Certified quality, free delivery, and easy returns.'}
	metaKeywords={data.page?.metaKeywords ?? ''}
	image={data.page?.logo ?? ''}
/>

<ListingPage />
