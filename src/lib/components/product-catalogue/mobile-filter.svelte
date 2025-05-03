<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer'
	import { GetColorName } from 'hex-color-to-color-name'
	import { ArrowDownNarrowWide, Filter, SearchIcon, X } from 'lucide-svelte'
	import { fly } from 'svelte/transition'
	import Button from '$lib/components/ui/button/button.svelte'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import Input from '$lib/components/ui/input/input.svelte'
	import { getDesktopFilterState } from '$lib/core/composables/use-desktop-filters.svelte'

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
							{filterModule.sortByData.find((item) => item.value === selectedSort)?.name}
						</span>
					{/if}
				</div>
			</Drawer.Trigger>
			<Drawer.Content class="rounded-t-xl">
				<Drawer.Header class="border-b border-gray-100 py-3 text-left">
					<Drawer.Title class="text-base font-semibold">Sort By</Drawer.Title>
				</Drawer.Header>

				<div class="space-y-3 px-4 py-3" in:fly={{ y: 0, duration: 200, delay: 0 }}>
					{#each filterModule.sortByData as item}
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
		<div class="flex items-center justify-between border-b border-t-input !p-2">
			<div class="flex w-full items-center justify-between gap-4">
				<div class="flex items-center justify-center gap-2">
					<button class="" onclick={() => (filterModule.showFilter = false)}>
						<X class="h-6 w-6" />
						<span class="sr-only">Close</span>
					</button>

					{#if filterModule.anyFilterApplied}
						<div class="h-4 w-px bg-gray-300"></div>
						<button class="flex items-center justify-center gap-1 text-xs text-gray-500" onclick={filterModule.clearFilters}> Clear Filters </button>
					{/if}
				</div>

				<h2 class="mr-5 text-sm font-semibold">Filters</h2>

				<Button variant="default" class="text-xs uppercase" onclick={filterModule.handleApply}>Apply</Button>
			</div>
		</div>

		<!-- Left Panel - Content -->
		<div class="flex flex-1 flex-col border-r">
			<div class="flex h-[100dvh]">
				<!-- Right Panel - Menu -->
				<div class="w-[35vw] bg-gray-50">
					{#each filterModule.menuItems as item}
						<button
							class="w-full border-l-4 {filterModule.selectedSection === item.id
								? 'border-black'
								: 'border-transparent'} flex justify-between px-4 py-3 text-left text-sm capitalize transition-colors hover:bg-gray-100"
							class:bg-white={filterModule.selectedSection === item.id}
							class:font-medium={filterModule.selectedSection === item.id}
							onclick={() => (filterModule.selectedSection = item.id)}
						>
							{filterModule.formatFilterName(item.label)}
							{#if filterModule.appliedFiltersCountByKey[item.id]}
								<span class="text-xs text-gray-500">
									{filterModule.appliedFiltersCountByKey[item.id]}
								</span>
							{/if}
						</button>
					{/each}
				</div>

				<!-- Dynamic Content Based on Selection -->
				<div class="w-full p-4">
					{#if filterModule.selectedSection === 'discount'}
						<div class="space-y-4">
							<div class="relative">
								<input
									type="text"
									placeholder="Search for discount..."
									class="w-full rounded-lg bg-gray-100 px-4 py-2"
									bind:value={filterModule.searchQuery}
								/>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
								>
									<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
								</svg>
							</div>

							<div class="space-y-2">
								{#each filterModule.discountOptions as option}
									<label class="flex items-center gap-2">
										<input type="radio" name="discount" value={option.value} bind:group={filterModule.selectedDiscount} />
										<span class="text-gray-700">
											{option.label}
											<!-- <span class="text-gray-400">({option.count})</span> -->
										</span>
									</label>
								{/each}
							</div>
						</div>
					{:else if filterModule.selectedSection === 'category'}
						<!-- Search -->
						<div class="relative mb-3">
							<input
								type="text"
								placeholder="Search for category..."
								class="w-full rounded-lg bg-gray-100 px-4 py-2"
								bind:value={filterModule.categorySearchQuery}
							/>
							<SearchIcon class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
						</div>
						{#if filterModule.filteredCategories?.length > 0}
							{#each filterModule.filteredCategories as category}
								{@const formattedCategoryName = filterModule.formatFilterOptionName(category.name)}
								<button
									class="flex flex-row gap-2 text-start"
									onclick={() => {
										filterModule.handleCategoryClick(category)
									}}
								>
									{#if category.thumbnail}
										<img src={category.thumbnail} alt={formattedCategoryName} class="h-8 w-8 rounded-lg object-cover" />
									{/if}
									<span class="flex-1 py-0.5 capitalize">{formattedCategoryName}</span>
								</button>
							{/each}
						{:else}
							<div class="flex h-full w-full">
								<p class="text-center text-sm text-gray-500">No categories found</p>
							</div>
						{/if}
					{:else if filterModule.selectedSection === 'price'}
						<!-- Price Filter -->
						<div class="w-full">
							<p class="my-2 text-sm font-semibold">Price</p>

							<div class="relative mr-5 mt-4">
								<!-- Range slider track -->
								<div class="absolute h-1 w-full rounded bg-gray-200">
									<div
										class="absolute h-1 bg-yellow-500"
										style="left: {(filterModule.minPrice / filterModule.maxPossiblePrice) * 100}%; right: {100 -
											(filterModule.maxPrice / filterModule.maxPossiblePrice) * 100}%"
									></div>
								</div>

								<!-- Range inputs -->
								<input
									type="range"
									bind:value={filterModule.minPrice}
									min={filterModule.minPossiblePrice}
									max={filterModule.maxPossiblePrice}
									onchange={filterModule.handleMinPriceChange}
									class="pointer-events-none absolute h-1 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-rose-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-rose-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-300"
								/>
								<input
									type="range"
									bind:value={filterModule.maxPrice}
									min={filterModule.minPossiblePrice}
									max={filterModule.maxPossiblePrice}
									onchange={filterModule.handleMaxPriceChange}
									class="pointer-events-none absolute h-1 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-rose-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-rose-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-300"
								/>
							</div>

							<!-- Price range display -->
							<div class="mt-9 text-sm text-gray-600">
								{filterModule.priceRange}
							</div>

							<!-- <Button
                variant="default"
                class="btn btn-primary mt-4 w-full"
                onclick={() => {
                  const url = new URL(page.url?.href);
                  if (maxPrice >= 0)
                    url.searchParams.set("priceTo", maxPrice.toString());
                  if (minPrice >= 0)
                    url.searchParams.set("priceFrom", minPrice.toString());
                  showFilter = false;
                  goto(url, { replaceState: true });
                }}
              >
                Apply
              </Button> -->
						</div>
					{:else if filterModule.selectedSection === 'tags'}
						<!-- Tags List -->
						{#if filterModule.tags.length > 0}
							<p class="my-2 text-sm font-semibold">Tags</p>
							<div class="flex max-h-[75vh] flex-col overflow-auto text-sm">
								{#each filterModule.tags as tag}
									<div class="flex flex-row items-center gap-2">
										<Checkbox
											id={`m-${tag.slug || tag.name}`}
											checked={filterModule.selectedTags?.find?.((t: any) => t?.name === tag?.name) ? true : false}
											onCheckedChange={(checked) => {
												filterModule.handleTagChange({ tag, checked })
											}}
										/>
										<label for={`m-${tag.slug || tag.name}`} class="flex-1 py-0.5 capitalize">{tag.name}</label>
									</div>
								{/each}
							</div>
							<!-- <Button
                variant="default"
                class="btn btn-primary mt-4 w-full"
                onclick={applyTags}>Apply</Button
              > -->
						{:else}
							<div class="flex h-full w-full">
								<p class="text-center text-sm text-gray-500">No tags found</p>
							</div>
						{/if}
					{:else if filterModule.processedFilters}
						{@const valuesToShow = filterModule.processedFilters[filterModule.selectedSection]}
						<p class="my-2 text-sm font-semibold capitalize">{filterModule.formatFilterName(filterModule.selectedSection)}</p>
						<div class="flex h-full w-full">
							<ul class="flex max-h-[75vh] w-full flex-col overflow-auto">
								{#each valuesToShow as value}
									<li class="flex items-center gap-2">
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
										<label for={`m-${value}`} class="capitalize">
											{#if value?.startsWith?.('#')}
												<div class="flex items-center gap-2">
													<div class="h-5 w-5 rounded-full" style="background-color: {value};"></div>
													{GetColorName(value)}
												</div>
											{:else}
												{value}
											{/if}
										</label>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

