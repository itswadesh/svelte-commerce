<script lang="ts">
	import { page } from '$app/state'
	import Select from '$lib/components/form/select.svelte'
	import { goto } from '$app/navigation'
	import VendorCard from '$lib/components/product-catalogue/product-card.svelte'
	import DesktopFilter from '$lib/components/product-catalogue/desktop-filter.svelte'
	import MobileFilter from '$lib/components/product-catalogue/mobile-filter.svelte'
	import { searchService } from '$lib/core/services'
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import Pagination from '$lib/components/common/pagination.svelte'
	import type { ProductSearchResult } from '$lib/core/types'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'
	import { searchService } from '$lib/core/services'

	let vendors: ProductSearchResult = $state(searchService.emptyResult())
	let selectedSort = $state(page.url.searchParams.get('sort') || 'recommended')
	let loading = $state(false)

	$effect(() => {
		const search = page.url.searchParams.get('search')
		searchVendors(search || '')
	})

	const searchVendors = async (query: string) => {
		try {
			loading = true

			// For the vendors page, we use a simple query search
			const result = await searchService.searchWithQuery(query)

			vendors = result
		} catch (error) {
			console.error('Error searching vendors:', error)
			vendors = searchService.emptyResult()
		} finally {
			loading = false
		}
	}

	const selectSort = (value: string) => {
		goto(`/${page.params.slug || 'vendors'}?sort=${value}`)
	}
</script>

<SeoHeader metaTitle={page.params.slug || 'Vendors'} />



<div class="container mx-auto mt-2 flex h-full min-h-screen flex-row max-md:px-4 md:gap-2">
	{#if vendors?.count >= 0}
		<div class="hidden border-r border-input md:block">
			<DesktopFilter
				priceStat={vendors?.facets?.priceStat}
				categories={vendors?.facets?.categories}
				tags={vendors?.facets?.tags}
				allFilters={vendors?.facets?.allFilters}
			/>
		</div>
	{/if}

	<div class="block md:hidden">
		<MobileFilter
			bind:selectedSort
			categories={vendors?.facets?.categories}
			priceStat={vendors?.facets?.priceStat}
			tags={vendors?.facets?.tags}
			allFilters={vendors?.facets?.allFilters}
			onSortChange={(value: string) => {
				selectedSort = value
				selectSort(value)
			}}
		/>
	</div>

	<div class="flex-1">
			<div class="mb-4 flex flex-col items-start gap-2">
				<h1 class="text-2xl font-bold capitalize">
					{page.params.slug || page.url.searchParams.get('search') || 'All Vendors'}
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

		{#if loading}
			<ul class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{#each { length: 8 } as _}
					<li class="w-full">
						<Skeleton class="size-full min-h-56" />
					</li>
				{/each}
			</ul>
		{:else}
			{#if !vendors?.data?.length}
				<div class="flex h-96 items-center justify-center">
					<p class="text-sm text-muted-foreground">No vendors found</p>
				</div>
			{:else}
				<div class="mt-4 grid grid-cols-2 gap-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
					{#each vendors?.data as vendor}
						<VendorCard {vendor} />
					{/each}
				</div>
			{/if}
			<div class="mt-20">
				<Pagination noOfPage={vendors?.totalPages} />
			</div>
		{/if}
	</div>
</div>
