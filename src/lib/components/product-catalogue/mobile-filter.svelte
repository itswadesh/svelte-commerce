<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js'
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

	function formatCategoryName(input: string) {
		const x = filterModule.formatFilterOptionName(input)
		if (x.length > 27) return x.substring(0, 24) + '...'
		return x
	}
</script>

<div class="ed-mf__bar fixed bottom-0 left-0 right-0 z-40 grid h-12 w-full grid-cols-2 border-t border-gray-200 bg-white shadow-md md:hidden">
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
		<Button
			variant="ghost"
			class="flex h-full w-full items-center justify-center rounded-none p-0 hover:bg-transparent"
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
		</Button>
	</div>
</div>

<!-- Fullscreen mobile filters -->
<div
	class="ed-mf__panel fixed inset-0 z-[1000] h-screen w-screen {filterModule.showFilter
		? 'translate-x-0'
		: '-translate-x-full'} transform bg-white transition-transform"
>
	<div class="flex h-full flex-col">
		<div class="ed-mf__phead flex items-center justify-between border-b border-gray-100 !p-3">
			<div class="flex w-full items-center justify-between gap-4">
				<div class="flex items-center justify-center gap-3">
					<Button variant="ghost" size="icon" class="rounded-full" onclick={() => (filterModule.showFilter = false)}>
						<X class="h-6 w-6 text-gray-900" />
						<span class="sr-only">Close</span>
					</Button>

					{#if filterModule.anyFilterApplied}
						<div class="h-4 w-px bg-gray-200"></div>
						<Button variant="link" size="sm" class="ed-mf__clear h-auto p-0" onclick={filterModule.clearFilters}>Clear All</Button>
					{/if}
				</div>

				<h2 class="ed-mf__ptitle text-xs font-bold uppercase tracking-widest text-gray-900">Filters</h2>

				<Button
					variant="default"
					class="ed-mf__apply h-9 bg-primary px-6 text-[10px] font-bold uppercase tracking-widest hover:bg-black"
					onclick={filterModule.handleApply}>Apply</Button
				>
			</div>
		</div>

		<!-- Left Panel - Content -->
		<div class="flex flex-1 flex-col overflow-hidden">
			<div class="flex h-full">
				<!-- Right Panel - Menu -->
				<div class="ed-mf__menu w-[35vw] overflow-y-auto bg-gray-50">
					{#each filterModule.menuItems as item}
						<Button
							variant="ghost"
							class="ed-mf__tab h-auto w-full justify-between rounded-none border-l-4 px-4 py-4 {filterModule.selectedSection === item.id
								? 'border-primary bg-white text-primary hover:bg-white'
								: 'border-transparent text-gray-500 hover:bg-gray-100'}"
							onclick={() => (filterModule.selectedSection = item.id)}
						>
							<span class="text-left text-[11px] font-bold uppercase tracking-widest">
								{filterModule.formatFilterName(item.label)}
							</span>
							{#if filterModule.appliedFiltersCountByKey[item.id]}
								<span class="text-[10px] text-primary">
									({filterModule.appliedFiltersCountByKey[item.id]})
								</span>
							{/if}
						</Button>
					{/each}
				</div>

				<!-- Dynamic Content Based on Selection -->
				<div class="ed-mf__content flex-1 overflow-y-auto bg-white p-4">
					{#if filterModule.selectedSection === 'discount'}
						<div class="space-y-6">
							<div class="relative">
								<input
									type="text"
									placeholder="Search discount..."
									class="ed-mf__search w-full rounded-md border-0 bg-gray-100 py-2.5 pl-4 pr-10 text-sm ring-0 transition-all focus:ring-2 focus:ring-primary"
									bind:value={filterModule.searchQuery}
								/>
								<SearchIcon class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							</div>

							<div class="space-y-3">
								{#each filterModule.discountOptions as option}
									<label class="group flex cursor-pointer items-center gap-3">
										<div class="relative flex items-center justify-center">
											<input
												type="radio"
												name="discount"
												value={option.value}
												bind:group={filterModule.selectedDiscount}
												class="peer h-5 w-5 appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-primary"
											/>
											<div class="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100"></div>
										</div>
										<span class="ed-mf__opt text-sm font-medium text-gray-700 transition-colors group-hover:text-primary">
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
								class="w-full rounded-md border-0 bg-gray-100 py-2.5 pl-4 pr-10 text-sm ring-0 transition-all focus:ring-2 focus:ring-primary"
								bind:value={filterModule.categorySearchQuery}
							/>
							<SearchIcon class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						</div>
						{#if filterModule.filteredCategories?.length > 0}
							<div class="space-y-4">
								{#each filterModule.filteredCategories as category}
									{@const formattedCategoryName = filterModule.formatFilterOptionName(category.name)}
									<Button
										variant="link"
										title={formattedCategoryName}
										class="group h-auto gap-2 overflow-hidden text-ellipsis whitespace-nowrap px-0 py-1 text-start hover:bg-transparent"
										onclick={() => filterModule.handleCategoryClick({ slug: category.slug, name: category.name })}
									>
										{#if category.thumbnail}
											<img
												src={category.thumbnail}
												alt={formattedCategoryName}
												class="h-8 w-8 rounded object-cover transition-opacity group-hover:opacity-80"
											/>
										{/if}
										<span class="flex-1 py-0.5 capitalize text-gray-600 transition-colors group-hover:text-primary"
											>{formatCategoryName(category.name)}</span
										>
									</Button>
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
							<p class="ed-mf__label text-xs font-bold uppercase tracking-widest text-gray-900">Price Range</p>

							<div class="ed-mf__slider relative mr-5 mt-4 px-2">
								<!-- Range slider track -->
								<div class="ed-mf__track absolute h-1 w-full rounded bg-gray-100">
									<div
										class="ed-mf__fill absolute h-1 bg-primary"
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

							<div class="ed-mf__priceval pt-4 text-lg font-bold text-gray-900">
								{filterModule.priceRange}
							</div>
						</div>
					{:else if filterModule.selectedSection === 'tags'}
						<!-- Tags List -->
						{#if filterModule.tags.length > 0}
							<div class="space-y-1">
								{#each filterModule.tags as tag}
									<div class="flex flex-row items-center gap-3 border-b border-gray-50 py-2 last:border-0">
										<Checkbox
											id={`m-${tag.slug || tag.name}`}
											checked={filterModule.selectedTags?.find?.((t: any) => t?.name === tag?.name) ? true : false}
											onCheckedChange={(checked) => {
												filterModule.handleTagChange({ tag, checked })
											}}
										/>
										<label for={`m-${tag.slug || tag.name}`} class="ed-mf__opt flex-1 text-sm font-medium capitalize text-gray-700">{tag.name}</label>
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
								<div class="flex items-center gap-3 border-b border-gray-50 py-2 last:border-0">
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
									<label for={`m-${value}`} class="ed-mf__opt text-sm font-medium capitalize text-gray-700">
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
	</div>
</div>

<style>
	/* ---- Refined Editorial · mobile filter chrome (default theme only) ----
	   The Sort drawer is portalled to <body> (outside [data-theme]) and keeps its
	   original clean styling. Everything below is gated to [data-theme='default'];
	   other themes are untouched. */

	/* Fixed bottom Sort / Filter bar */
	:global([data-theme='default']) .ed-mf__bar {
		border-top: 1px solid var(--ed-line);
		background: var(--ed-surface);
		box-shadow: 0 -1px 12px rgba(27, 26, 23, 0.06);
		font-family: var(--ed-body);
		color: var(--ed-ink);
	}

	/* Fullscreen filter panel */
	:global([data-theme='default']) .ed-mf__panel {
		background: var(--ed-canvas);
		font-family: var(--ed-body);
		color: var(--ed-ink);
	}

	:global([data-theme='default']) .ed-mf__phead {
		border-bottom: 1px solid var(--ed-line);
		background: var(--ed-surface);
	}

	:global([data-theme='default']) .ed-mf__ptitle {
		font-family: var(--ed-body);
		letter-spacing: 0.18em;
		color: var(--ed-ink);
	}

	/* Apply button — editorial primary fill */
	:global([data-theme='default'] .ed-mf__apply) {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		border-radius: var(--ed-radius);
		letter-spacing: 0.12em;
	}

	:global([data-theme='default'] .ed-mf__apply:hover) {
		background: var(--ed-ink);
		color: var(--ed-canvas);
	}

	:global([data-theme='default'] .ed-mf__clear) {
		color: var(--ed-soft);
		font-family: var(--ed-body);
	}

	:global([data-theme='default'] .ed-mf__clear:hover) {
		color: hsl(var(--primary));
	}

	/* Section tab list — warm tint, no coloured left stripe (bans a >1px accent
	   border). Active = white surface + primary text; the 4px border stays
	   transparent so alignment is preserved but no stripe shows. */
	:global([data-theme='default']) .ed-mf__menu {
		background: #efeae1;
		border-right: 1px solid var(--ed-line);
	}

	:global([data-theme='default'] .ed-mf__tab) {
		border-left-color: transparent !important;
		color: var(--ed-soft);
		font-family: var(--ed-body);
	}

	:global([data-theme='default'] .ed-mf__tab span) {
		letter-spacing: 0.14em;
	}

	:global([data-theme='default'] .ed-mf__content) {
		background: var(--ed-surface);
	}

	/* Search inputs */
	:global([data-theme='default']) .ed-mf__search {
		background: var(--ed-canvas);
		border: 1px solid var(--ed-line-strong);
		border-radius: var(--ed-radius);
		color: var(--ed-ink);
		font-family: var(--ed-body);
	}

	:global([data-theme='default']) .ed-mf__search:focus {
		outline: none;
		border-color: hsl(var(--primary));
		box-shadow: none;
	}

	/* Labels + options */
	:global([data-theme='default']) .ed-mf__label {
		font-family: var(--ed-body);
		letter-spacing: 0.18em;
		color: var(--ed-soft);
	}

	:global([data-theme='default']) .ed-mf__opt {
		color: var(--ed-ink);
		font-family: var(--ed-body);
	}

	:global([data-theme='default']) .ed-mf__priceval {
		font-family: var(--ed-display);
		font-weight: 500;
		color: var(--ed-ink);
	}

	/* Editorial checkboxes inside the panel */
	:global([data-theme='default'] .ed-mf__content [role='checkbox']) {
		border-color: var(--ed-line-strong);
		border-radius: 3px;
		box-shadow: none;
	}

	/* Price range slider */
	:global([data-theme='default']) .ed-mf__track {
		height: 3px;
		background: var(--ed-line);
	}

	:global([data-theme='default']) .ed-mf__fill {
		height: 3px;
		background: hsl(var(--primary));
	}

	:global([data-theme='default'] .ed-mf__slider input[type='range']::-webkit-slider-thumb) {
		border: 1px solid hsl(var(--primary));
		background: var(--ed-surface);
		box-shadow: 0 1px 4px rgba(27, 26, 23, 0.22);
	}

	:global([data-theme='default'] .ed-mf__slider input[type='range']::-moz-range-thumb) {
		border: 1px solid hsl(var(--primary));
		background: var(--ed-surface);
		box-shadow: 0 1px 4px rgba(27, 26, 23, 0.22);
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .ed-mf__apply) {
			transition: none;
		}
	}
</style>
