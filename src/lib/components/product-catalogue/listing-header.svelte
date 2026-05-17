<script lang="ts">
	import { page } from '$app/state'
	import Select from '$lib/components/form/select.svelte'
	import { sortOptions } from '$lib/config.js'
	import { selectSort } from '$lib/core/utils/index.js'

	const { selectedSort = $bindable() } = $props()

	const data = $derived(page.data)
</script>

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
	{#if data.products.data.length}
		<div class="flex items-center gap-2">
			<span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort by</span>
			<Select class="!mb-0" id="sort-by" value={selectedSort} data={sortOptions} optionSelected={(value: string) => selectSort(value)} />
		</div>
	{/if}

	<!-- Category Description -->
	{#if data?.products?.category?.description}
		<div class="mt-4" style="white-space: pre-line">
			{@html data?.products?.category?.description}
		</div>
	{/if}
</div>
