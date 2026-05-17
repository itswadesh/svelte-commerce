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
	import { selectSort } from '$lib/core/utils'
	import { sortOptions } from '$lib/config'
	import { setCategoryFilterState, setDesktopFilterState } from '$lib/core/composables/index.js'

	setDesktopFilterState()
	setCategoryFilterState()
	let { data } = $props<{ data: PageData }>()
	let selectedSort = $state(page.url.searchParams.get('sort') || 'popularity:desc')
	let loading = $state(false)
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
		<div class="hidden items-center justify-between lg:flex">
			<div class="intra-gap flex items-center">
				<h1 class="page-heading">
					{#if page.url.searchParams.get('search')}
						Search Results: "{page.url.searchParams.get('search')}"
					{:else if data.products?.categoryHierarchy?.length > 0}
						{data.products.categoryHierarchy[data.products.categoryHierarchy.length - 1].name}
					{:else}
						All Products
					{/if}
				</h1>

				<div class="flex flex-col">
					<span class="text-sm tracking-widest text-gray-900 dark:text-gray-200">
						{data.products.count > 999 ? '1000+' : data.products.count} Products
					</span>
				</div>
			</div>
			{#if !loading && data.products.data.length}
				<div class="flex items-center gap-2">
					<span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort by</span>
					<Select class="!mb-0" id="sort-by" value={selectedSort} data={sortOptions} optionSelected={(value: string) => selectSort(value)} />
				</div>
			{/if}
		</div>

		<!-- {#if !loading && data.products.data.length}
			<div class="mb-6 hidden flex-row items-center justify-between border-b border-gray-100 pb-4 lg:flex">
				<div class="flex flex-col">
					<span class="text-sm font-bold text-gray-600 dark:text-gray-200 uppercase tracking-widest">
						{data.products.count > 999 ? '1000+' : data.products.count} Products
					</span>
				</div>

				<div class="flex items-center gap-2">
					<span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort by</span>
					<Select class="!mb-0" id="sort-by" value={selectedSort} data={sortOptions} optionSelected={(value: string) => selectSort(value)} />
				</div>
			</div>
		{/if} -->

		{#if loading}
			<ul class="intra-gap grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
				{#each { length: 12 } as _}
					<li class="w-full">
						<Skeleton class="aspect-square w-full rounded-lg bg-gray-100" />
					</li>
				{/each}
			</ul>
		{:else}
			{#if !data.products.data.length}
				<div class="intra-gap flex h-96 flex-col items-center justify-center">
					<p class="text-md uppercase text-gray-500">No products found</p>
					<a href="/products" class="text-sm font-bold uppercase tracking-widest text-primary underline underline-offset-4">Clear all filters</a>
				</div>
			{:else}
				<div class="intra-gap grid auto-rows-auto grid-cols-2 lg:grid-cols-3">
					{#each data.products.data as product}
						<ProductCard {product} />
					{/each}
				</div>
			{/if}
			<div class="">
				<Pagination noOfPage={data.products.totalPages} />
			</div>
		{/if}
	</div>
</div>
