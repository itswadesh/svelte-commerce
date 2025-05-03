<script lang="ts">
	import { page } from '$app/state'
	import Select from '$lib/components/form/select.svelte'
	import { goto } from '$app/navigation'
	import CollectionCard from '$lib/components/product-catalogue/product-card.svelte'
	import DesktopFilter from '$lib/components/product-catalogue/desktop-filter.svelte'
	import MobileFilter from '$lib/components/product-catalogue/mobile-filter.svelte'
	import { searchService } from '$lib/core/services'
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import Pagination from '$lib/components/common/pagination.svelte'
	import type { ProductSearchResult } from '$lib/core/types'

	let collections: ProductSearchResult = $state(searchService.emptyResult())
	let selectedSort = $state(page.url.searchParams.get('sort') || 'recommended')
	let loading = $state(false)

	$effect(() => {
		const search = page.url.searchParams.get('search')
		searchCollections(search || '')
	})

	const searchCollections = async (query: string) => {
		try {
			loading = true

			// For the collections page, we use a simple query search or grab data from the URL
			const result = await searchService.searchWithQuery(query)

			collections = result
		} catch (error) {
			console.error('Error searching collections:', error)
			collections = searchService.emptyResult()
		} finally {
			loading = false
		}
	}

	const selectSort = (value: string) => {
		goto(`/${page.params.slug || 'collections'}?sort=${value}`)
	}
</script>

<svelte:head>
	<title>{page.params.slug || 'Collections'}</title>
</svelte:head>

<div class="container mx-auto mt-2 flex h-full min-h-screen flex-row max-md:px-4 md:gap-2">
	{#if collections?.count >= 0}
		<div class="hidden border-r border-input md:block">
			<DesktopFilter
				priceStat={collections?.facets?.priceStat}
				categories={collections?.facets?.categories}
				tags={collections?.facets?.tags}
				allFilters={collections?.facets?.allFilters}
			/>
		</div>
	{/if}

	<div class="block md:hidden">
		<MobileFilter
			bind:selectedSort
			categories={collections?.facets?.categories}
			priceStat={collections?.facets?.priceStat}
			tags={collections?.facets?.tags}
			allFilters={collections?.facets?.allFilters}
			onSortChange={(value: string) => {
				selectedSort = value
				selectSort(value)
			}}
		/>
	</div>

	<div class="flex-1">
		<div class="flex flex-row items-center justify-between">
			<span class="capitalize">
				{#if page.params.slug || page.url.searchParams.get('search')}
					{page.params.slug || page.url.searchParams.get('search')} -
				{/if}
				<span class="font-bold">{collections?.count} Collections</span>
			</span>

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
		</div>

		{#if loading}
			<ul class="mt-2 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{#each { length: 8 } as _}
					<li class="w-full">
						<Skeleton class="size-full min-h-56" />
					</li>
				{/each}
			</ul>
		{:else}
			{#if !collections?.data?.length}
				<div class="flex h-96 items-center justify-center">
					<p class="text-sm text-muted-foreground">No collections found</p>
				</div>
			{:else}
				<div class="mt-4 grid grid-cols-2 gap-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
					{#each collections?.data as collection}
						<CollectionCard {collection} />
					{/each}
				</div>
			{/if}
			<div class="mt-20">
				<Pagination noOfPage={collections?.totalPages} />
			</div>
		{/if}
	</div>
</div>
