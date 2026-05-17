<script lang="ts">
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import { page } from '$app/state'

	setDesktopFilterState()
	setCategoryFilterState()
	const data = $derived(page.data)
</script>

<SeoHeader
	metaTitle={(data?.page?.categories && data?.page?.categories[0]?.metaTitle) ||
		(data?.page?.categories && data?.page?.categories[0]?.name) ||
		'Products'}
	metaDescription={data?.page?.categories && data?.page?.categories[0]?.metaDescription}
	metaKeywords={data?.page?.categories && data?.page?.categories[0]?.metaKeywords}
	image={data?.page?.categories && data?.page?.categories[0]?.banner}
/>

<ListingPage />
