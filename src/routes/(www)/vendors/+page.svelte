<script lang="ts">
	import { page } from '$app/state'
	import Select from '$lib/components/form/select.svelte'
	import { goto } from '$app/navigation'
	import VendorCard from '$lib/components/vendor/vendor-card.svelte'
	import DesktopFilter from '$lib/components/product-catalogue/desktop-filter.svelte'
	import MobileFilter from '$lib/components/product-catalogue/mobile-filter.svelte'
	import Pagination from '$lib/components/common/pagination.svelte'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'
	import type { PageProps } from './$types'

	setDesktopFilterState()
	setCategoryFilterState()

	// The list comes from `+page.ts` (vendorService.list). This used to ignore its own loader and
	// call `searchService.searchWithQuery` from an $effect instead — a PRODUCT search, so the page
	// listed products under vendor headings, and because $effect never runs on the server the SSR
	// document was empty. Reading load data fixes both.
	const { data }: PageProps = $props()
	const vendors = $derived(data?.vendors)

	let selectedSort = $state(page.url.searchParams.get('sort') || 'recommended')

	const selectSort = (value: string) => {
		goto(`/vendors?sort=${value}`)
	}
</script>

<!-- This route has no `slug` param; the old `page.params.slug` was always undefined. -->
<SeoHeader metaTitle="Vendors" />

<div class="container mx-auto mt-2 flex h-full min-h-screen flex-row max-md:px-4 md:gap-2">
	<!-- Same defect commit 96422246 fixed on /collections. DesktopFilterState derives its facets
	     from `page.data.products.facets`, not from any prop passed here; this route loads vendors
	     and never products, so `filterState.tags` was undefined and `.length` threw during SSR,
	     500ing the page. The old guard never gated anything either — the component initialises
	     with searchService.emptyResult(), whose `count` is 0, and `0 >= 0` is true. Guard on the
	     source the state actually reads. -->
	{#if page.data?.products?.facets}
		<div class="hidden border-r border-input md:block">
			<DesktopFilter />
		</div>

		<div class="block md:hidden">
			<MobileFilter
				bind:selectedSort
				onSortChange={(value: string) => {
					selectedSort = value
					selectSort(value)
				}}
			/>
		</div>
	{/if}

	<div class="flex-1">
		<div class="mb-4 flex flex-col items-start gap-2">
			<h1 class="text-2xl font-bold capitalize">
				{page.url.searchParams.get('search') || 'All Vendors'}
			</h1>
			<span class="text-sm text-gray-400">{vendors?.count} Vendors found</span>
		</div>

		<div class="hidden flex-row items-center gap-2 md:flex">
			<span class="text-sm font-normal text-gray-400">Sort by:</span>
			<Select
				class="!mb-0"
				id="sort-by"
				value={selectedSort}
				data={[
					{ value: 'recommended', name: 'Recommended' },
					{ value: 'updatedAt', name: "What's New" },
					{ value: 'price-low-to-high', name: 'Price: Low to High' },
					{ value: 'price-high-to-low', name: 'Price: High to Low' },
					{ value: 'asc', name: 'Name: A-Z' },
					{ value: 'desc', name: 'Name: Z-A' },
					{ value: 'discount', name: 'Discount: High to Low' },
					{ value: 'rating', name: 'Rating: High to Low' }
				]}
				optionSelected={(value: string) => selectSort(value)}
			/>
		</div>

		{#if !vendors?.data?.length}
			<div class="flex h-96 items-center justify-center">
				<p class="text-sm text-muted-foreground">No vendors found</p>
			</div>
		{:else}
			<div class="mt-4 grid grid-cols-2 gap-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
				{#each vendors.data as vendor, i (vendor.id)}
					<VendorCard {vendor} priority={i < 4} />
				{/each}
			</div>
			{#if vendors?.totalPages > 1}
				<div class="mt-20">
					<Pagination noOfPage={vendors.totalPages} />
				</div>
			{/if}
		{/if}
	</div>
</div>
