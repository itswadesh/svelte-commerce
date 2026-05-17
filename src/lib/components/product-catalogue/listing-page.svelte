<script lang="ts">
	import { page } from '$app/state'
	import DesktopFilter from '$lib/components/product-catalogue/desktop-filter.svelte'
	import MobileFilter from '$lib/components/product-catalogue/mobile-filter.svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'
	import { selectSort } from '$lib/core/utils/index.js'
	import ListingGrid from '$lib/components/product-catalogue/listing-grid.svelte'
	import ListingHeader from './listing-header.svelte'

	const data = $derived(page.data)
	let selectedSort = $state(page.url.searchParams.get('sort') ?? 'popularity:desc')
</script>

<div class="page-width hidden lg:block">
	<Breadcrumb categoryHierarchy={data?.products?.categoryHierarchy} />
</div>

<div class="page-width inter-gap flex h-full min-h-screen flex-row">
	{#if Object.keys(data.products.facets || {}).length}
		<div class="hidden border-input md:block">
			<DesktopFilter />
		</div>
	{/if}

	<MobileFilter
		bind:selectedSort
		onSortChange={(value: string) => {
			selectedSort = value
			selectSort(value)
		}}
	/>

	<div class="inter-gap flex flex-1 flex-col">
    <ListingHeader bind:selectedSort />
		<ListingGrid />
	</div>
</div>
