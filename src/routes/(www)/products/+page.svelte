<script lang="ts">
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingPage from '$lib/components/product-catalogue/listing-page.svelte'
	import { page } from '$app/state'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'

	setDesktopFilterState()
	setCategoryFilterState()

	const data = $derived(page.data)
</script>

<SeoHeader
	metaTitle={data.page?.metaTitle ||
		(data.products?.categoryHierarchy?.length > 0
			? `${data.products.categoryHierarchy[data.products.categoryHierarchy.length - 1].name} — Shop Trendy Fashion Online | Arialshop`
			: "Women's Fashion Online — Stylish Dresses, Co-ord Sets & More | Arialshop")}
	metaDescription={data.page?.metaDescription ||
		"Explore Arialshop's exclusive collection of women's fashion. Shop the latest trendy dresses, elegant co-ord sets, and seasonal styles at the best prices. Enjoy free delivery on orders over ₹999, easy 7-day returns, and premium quality. Refresh your wardrobe with Arialshop today!"}
	metaKeywords={data.page?.metaKeywords ?? ''}
	image={data.page?.logo ?? ''}
/>

<ListingPage />
