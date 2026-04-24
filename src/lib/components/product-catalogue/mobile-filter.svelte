<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer'
	import { GetColorName } from 'hex-color-to-color-name'
	import { ArrowDownNarrowWide, Filter, SearchIcon, X } from '@lucide/svelte'
	import { fly } from 'svelte/transition'
	import Button from '$lib/components/ui/button/button.svelte'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import Input from '$lib/components/ui/input/input.svelte'
	import { getDesktopFilterState } from '$lib/core/composables/index.js'
	import { sortOptions } from '$lib/config.js'

	let { selectedSort = $bindable(), onSortChange = (value: string) => {} } = $props()

	const filterModule = getDesktopFilterState()
</script>

<div class="fixed bottom-0 left-0 right-0 z-40 grid h-12 w-full grid-cols-2 border-t border-gray-200 bg-white shadow-md">
	<!-- Sort by -->
	<div class="flex items-center justify-center border-r border-gray-200">
		<Drawer.Root direction="bottom" bind:open={filterModule.showSortByDrawer}>
			<Drawer.Trigger class="flex h-full w-full items-center justify-center gap-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
				<ArrowDownNarrowWide class="h-4 w-4 text-gray-500" />
				<div class="flex flex-col items-start">
					<span class="font-semibold">Sort By</span>
					{#if selectedSort}
						<span class="text-xs text-gray-500">
							{sortOptions.find((item) => item.value === selectedSort)?.name}
						</span>
					{/if}
				</div>
			</Drawer.Trigger>
			<Drawer.Content class="rounded-t-xl">
				<Drawer.Header class="border-b border-gray-100 py-3 text-left">
					<Drawer.Title class="text-base font-semibold">Sort By</Drawer.Title>
				</Drawer.Header>

				<div class="space-y-3 px-4 py-3" in:fly={{ y: 0, duration: 200, delay: 0 }}>
					{#each sortOptions as item}
						<div class="flex items-center justify-between">
							<label
								for={item.value}
								class="w-full text-left text-sm {selectedSort === item.value ? 'font-medium text-primary' : 'font-normal text-gray-700'}"
							>
								{item.name}
							</label>

							<Input
								class="!h-4 !w-4 border-gray-300 text-primary focus:ring-primary"
								id={item.value}
								type="radio"
								name="sort"
								value={item.value}
								checked={filterModule.selectedSort === item.value}
								onchange={() => {
									filterModule.selectedSort = item.value
									onSortChange?.(item.value)
									filterModule.showSortByDrawer = false
								}}
							/>
						</div>
					{/each}
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</div>

	<!-- Filter -->
	<div class="flex flex-col items-center justify-center bg-white transition hover:bg-gray-50">
		<button
			class="flex h-full w-full items-center justify-center"
			onclick={() => {
				filterModule.showFilter = true
			}}
		>
			<Filter class="mx-2 max-h-4 min-h-4 min-w-4 max-w-4 text-gray-500" />

			<div class="flex max-w-[50%] flex-col items-start">
				<span class="text-sm font-semibold text-gray-700">Filter</span>
				<!-- Applied filter keys -->
				<div class="grid grid-cols-1">
					{#if filterModule.anyFilterApplied}
						<span class="truncate text-xs capitalize text-gray-500">
							{Object.keys(filterModule.appliedFiltersCountByKey)
								?.splice?.(0, 2)
								?.map((k) => (k?.includes('attributes') || k?.includes('option') ? k.split('.')?.[1] : k))
								?.join?.(', ') +
								(Object.keys(filterModule.appliedFiltersCountByKey)?.length > 2
									? ` +${Object.keys(filterModule.appliedFiltersCountByKey)?.length - 2}`
									: '')}
						</span>
					{/if}
				</div>
			</div>
		</button>
	</div>
</div>

<!-- Fullscreen mobile filters -->
<div
	class="fixed inset-0 z-[1000] h-screen w-screen {filterModule.showFilter
		? 'translate-x-0'
		: '-translate-x-full'} transform bg-white transition-transform"
>
	<div class="flex h-full flex-col">
	<div class="flex items-center justify-between border-b border-gray-100 !p-3">
		<div class="flex w-full items-center justify-between gap-4">
			<div class="flex items-center justify-center gap-3">
				<button class="p-1 hover:bg-gray-100 rounded-full transition-colors" onclick={() => (filterModule.showFilter = false)}>
					<X class="h-6 w-6 text-gray-900" />
					<span class="sr-only">Close</span>
				</button>

				{#if filterModule.anyFilterApplied}
					<div class="h-4 w-px bg-gray-200"></div>
					<button class="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline" onclick={filterModule.clearFilters}> Clear All </button>
				{/if}
			</div>

			<h2 class="text-xs font-bold uppercase tracking-widest text-gray-900">Filters</h2>

			<Button variant="default" class="h-9 px-6 text-[10px] font-bold uppercase tracking-widest bg-primary hover:bg-black" onclick={filterModule.handleApply}>Apply</Button>
		</div>
	</div>

	<!-- Left Panel - Content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<div class="flex h-full">
			<!-- Right Panel - Menu -->
			<div class="w-[35vw] bg-gray-50 overflow-y-auto">
				{#each filterModule.menuItems as item}
					<button
						class="w-full border-l-4 {filterModule.selectedSection === item.id
							? 'border-primary bg-white'
							: 'border-transparent'} flex justify-between px-4 py-4 text-left text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-gray-100"
						class:text-primary={filterModule.selectedSection === item.id}
						onclick={() => (filterModule.selectedSection = item.id)}
					>
						{filterModule.formatFilterName(item.label)}
						{#if filterModule.appliedFiltersCountByKey[item.id]}
							<span class="text-[10px] text-primary">
								({filterModule.appliedFiltersCountByKey[item.id]})
							</span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Dynamic Content Based on Selection -->
			<div class="flex-1 p-4 overflow-y-auto bg-white">
				{#if filterModule.selectedSection === 'discount'}
					<div class="space-y-6">
						<div class="relative">
							<input
								type="text"
								placeholder="Search discount..."
								class="w-full rounded-md border-0 bg-gray-100 py-2.5 pl-4 pr-10 text-sm ring-0 focus:ring-2 focus:ring-primary transition-all"
								bind:value={filterModule.searchQuery}
							/>
							<SearchIcon class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						</div>

						<div class="space-y-3">
							{#each filterModule.discountOptions as option}
								<label class="flex items-center gap-3 cursor-pointer group">
									<div class="relative flex items-center justify-center">
										<input type="radio" name="discount" value={option.value} bind:group={filterModule.selectedDiscount} class="peer h-5 w-5 appearance-none rounded-full border-2 border-gray-200 checked:border-primary transition-all" />
										<div class="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
									</div>
									<span class="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
										{option.label}
									</span>
								</label>
							{/each}
						</div>
					</div>
				{:else if filterModule.selectedSection === 'category'}
					<!-- Search -->
					<div class="relative mb-6">
						<input
							type="text"
							placeholder="Search category..."
							class="w-full rounded-md border-0 bg-gray-100 py-2.5 pl-4 pr-10 text-sm ring-0 focus:ring-2 focus:ring-primary transition-all"
							bind:value={filterModule.categorySearchQuery}
						/>
						<SearchIcon class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					</div>
					{#if filterModule.filteredCategories?.length > 0}
						<div class="space-y-4">
							{#each filterModule.filteredCategories as category}
								{@const formattedCategoryName = filterModule.formatFilterOptionName(category.name)}
								<button
									class="flex w-full flex-row items-center gap-3 text-start group"
									onclick={() => {
										filterModule.handleCategoryClick(category)
									}}
								>
									{#if category.thumbnail}
										<img src={category.thumbnail} alt={formattedCategoryName} class="h-10 w-10 rounded-md object-cover transition-opacity group-hover:opacity-80 shadow-sm" />
									{/if}
									<span class="flex-1 text-sm font-medium capitalize text-gray-700 group-hover:text-primary transition-colors">{formattedCategoryName}</span>
								</button>
							{/each}
						</div>
					{:else}
						<div class="flex h-40 items-center justify-center">
							<p class="text-sm font-medium text-gray-400">No categories found</p>
						</div>
					{/if}
				{:else if filterModule.selectedSection === 'price'}
					<!-- Price Filter -->
					<div class="w-full space-y-8">
						<p class="text-xs font-bold uppercase tracking-widest text-gray-900">Price Range</p>

						<div class="relative mr-5 mt-4 px-2">
							<!-- Range slider track -->
							<div class="absolute h-1 w-full rounded bg-gray-100">
								<div
									class="absolute h-1 bg-primary"
									style="left: {filterModule.priceSliderLeftPercentage}%; right: {filterModule.priceSliderRightPercentage}%"
								></div>
							</div>

							<!-- Range inputs -->
							<input
								type="range"
								bind:value={filterModule.minPrice}
								min={filterModule.minPossiblePrice}
								max={filterModule.maxPossiblePrice}
								onchange={filterModule.handleMinPriceChange}
								class="pointer-events-none absolute h-1 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white"
							/>
							<input
								type="range"
								bind:value={filterModule.maxPrice}
								min={filterModule.minPossiblePrice}
								max={filterModule.maxPossiblePrice}
								onchange={filterModule.handleMaxPriceChange}
								class="pointer-events-none absolute h-1 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white"
							/>
						</div>

						<div class="text-lg font-bold text-gray-900 pt-4">
							{filterModule.priceRange}
						</div>
					</div>
				{:else if filterModule.selectedSection === 'tags'}
					<!-- Tags List -->
					{#if filterModule.tags.length > 0}
						<div class="space-y-1">
							{#each filterModule.tags as tag}
								<div class="flex flex-row items-center gap-3 py-2 border-b border-gray-50 last:border-0">
									<Checkbox
										id={`m-${tag.slug || tag.name}`}
										checked={filterModule.selectedTags?.find?.((t: any) => t?.name === tag?.name) ? true : false}
										onCheckedChange={(checked) => {
											filterModule.handleTagChange({ tag, checked })
										}}
									/>
									<label for={`m-${tag.slug || tag.name}`} class="flex-1 text-sm font-medium capitalize text-gray-700">{tag.name}</label>
								</div>
							{/each}
						</div>
					{:else}
						<div class="flex h-40 items-center justify-center">
							<p class="text-sm font-medium text-gray-400">No tags found</p>
						</div>
					{/if}
				{:else if filterModule.processedFilters}
					{@const valuesToShow = filterModule.processedFilters[filterModule.selectedSection]}
					<div class="space-y-1">
						{#each valuesToShow as value}
							<div class="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
								<Checkbox
									id={`m-${value}`}
									checked={filterModule.selectedGeneralFilters[filterModule.selectedSection]?.includes(value)}
									onCheckedChange={(checked) =>
										filterModule.handleGeneralFiltersChange({
											key: filterModule.selectedSection,
											value,
											checked
										})}
								/>
								<label for={`m-${value}`} class="text-sm font-medium capitalize text-gray-700">
									{#if value?.startsWith?.('#')}
										<div class="flex items-center gap-2">
											<div class="h-5 w-5 rounded-full border border-gray-100 shadow-sm" style="background-color: {value};"></div>
											{GetColorName(value)}
										</div>
									{:else}
										{value}
									{/if}
								</label>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
	</div></div>

