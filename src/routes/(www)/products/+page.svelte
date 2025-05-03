<script lang="ts">
	import { page } from '$app/state'
	import Select from '$lib/components/form/select.svelte'
	import { goto } from '$app/navigation'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import DesktopFilter from '$lib/components/product-catalogue/desktop-filter.svelte'
	import MobileFilter from '$lib/components/product-catalogue/mobile-filter.svelte'
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import Pagination from '$lib/components/common/pagination.svelte'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'
	import type { PageData } from '$lib/core/types'
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'

	let { data } = $props<{ data: PageData }>()
	let selectedSort = $state(page.url.searchParams.get('sort') || 'popularity:desc')
	let loading = $state(false)

	const selectSort = (value: string) => {
		const url = new URL(window.location.href)
		url.searchParams.set('sort', value)
		goto(url, { replaceState: true })
	}
</script>

<SeoHeader
	metaTitle="Products Listing"
	metaDescription={data.page?.metaDescription ?? ''}
	metaKeywords={data.page?.metaKeywords ?? ''}
	image={data.page?.logo ?? ''}
/>

<div class="mb-3 mt-2 hidden lg:container lg:mx-auto lg:block">
	<Breadcrumb categoryHierarchy={data?.products?.categoryHierarchy} />
</div>

<div class="flex h-full min-h-screen flex-row pt-4 md:gap-3 md:px-4">
		{#if Object.keys(data.products.facets || {}).length}
			<div class="hidden border-r border-input md:block">
				<DesktopFilter />
			</div>
		{/if}

		<div class="block md:hidden">
			<MobileFilter
				bind:selectedSort
				onSortChange={(value: string) => {
					selectedSort = value
					selectSort(value)
				}}
			/>
		</div>

	<div class="flex-1">
		<div class="flex flex-row items-center justify-end">
			<!-- <span class="capitalize mx-2 justify-center flex text-center">
        {#if page.params.slug || page.url.searchParams.get("search")}
          {page.params.slug || page.url.searchParams.get("search")} -
        {/if}
        <span class="font-bold">{data?.products?.count} Products</span>
      </span> -->

			<div class="hidden flex-row items-center gap-2 md:flex">
				<span class="text-sm font-normal text-gray-400">Sort by:</span>
				<Select
					class="!mb-0"
					id="sort-by"
					value={selectedSort}
					data={[
						{ value: 'popularity:desc', name: 'Recommended' },
						{ value: 'updatedAt:desc', name: "What's New" },
						{ value: 'price:asc', name: 'Price: Low to High' },
						{ value: 'price:desc', name: 'Price: High to Low' }
						// { value: "asc", name: "Name: A-Z" },
						// { value: "desc", name: "Name: Z-A" },
						// { value: "discount", name: "Discount: High to Low" },
						// { value: "rating", name: "Rating: High to Low" },
					]}
					optionSelected={(value: string) => selectSort(value)}
				/>
			</div>
		</div>

		{#if loading}
			<ul class="mt-4 grid w-full grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{#each { length: 8 } as _}
					<li class="w-full">
						<Skeleton class="size-full min-h-56 bg-gray-100" />
					</li>
				{/each}
			</ul>
		{:else}
			{#if !data.products.data.length}
				<div class="flex h-96 items-center justify-center">
					<p class="text-sm text-muted-foreground">No products found</p>
				</div>
			{:else}
				<div class="hidden flex-col sm:flex">
					<span class="text-lg font-bold text-gray-800">
						{data.products.count > 999 ? '1000+' : data.products.count} Products
					</span>
				</div>
				<div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 2xl:grid-cols-12 auto-rows-auto">
					{#each data.products.data as product}
						<ProductCard {product} />
					{/each}
				</div>
			{/if}
			<div class="mt-20">
				<Pagination noOfPage={data.products.totalPages} />
			</div>
		{/if}
	</div>
</div>
