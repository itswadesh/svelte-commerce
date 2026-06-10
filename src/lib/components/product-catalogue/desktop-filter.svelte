<script lang="ts">
	import { cn } from '$lib/core/utils'
	import { X } from '@lucide/svelte'
	import { fade, fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { browser } from '$app/environment'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import { GetColorName } from 'hex-color-to-color-name'
	import { getDesktopFilterState } from '$lib/core/composables/index.js'
	import { Button } from '$lib/components/ui/button'

	type FilterProps = {
		allFilters?: unknown
		categories?: unknown
		class?: string
		priceStat?: unknown
		tags?: unknown
	}

	let { class: className = '', allFilters, categories, priceStat, tags }: FilterProps = $props()

	const filterState = getDesktopFilterState()
	const categoryOption = (category: Record<string, string>) => ({
		name: category.name,
		slug: category.slug
	})
</script>

<div class="group sticky" style={`top: ${filterState.containerTop}px;`}>
	<div
		bind:this={filterState.container}
		class={cn(
			'intra-gap flex min-w-56 flex-col overflow-y-auto !pb-20 scrollbar-none scrollbar-track-transparent scrollbar-thumb-transparent  group-hover:scrollbar-track-inherit group-hover:scrollbar-thumb-inherit',
			className
		)}
		style={`height: ${browser ? window?.innerHeight - (filterState.containerTop || 0) : 'auto'}px`}
	>
		<div class="flex justify-between items-center">
			<p class="text-lg font-bold">Filters</p>

			{#if filterState.anyFilterApplied}
				<Button
					variant="link"
					size="sm"
					class="h-auto p-0"
					onclick={filterState.clearFilters}
				>
					<X class="h-3 w-3 mr-1" />
					Clear
				</Button>
			{/if}
		</div>

		<div class="w-full border-b border-gray-200"></div>

		<!-- Applied filters -->
		<!-- <div class="flex w-full max-w-56 flex-col flex-wrap intra-gap text-[11px] text-gray-600">
			{#if filterState.selectedTags.length > 0}
				<div class="flex flex-row flex-wrap items-center bg-gray-50 p-2 rounded">
					<span class="mr-1 font-bold uppercase tracking-tighter">Tags: </span>
					{#each filterState.selectedTags as tag, idx}
						<span class="whitespace-nowrap capitalize">{tag.name}</span>
						{#if idx < filterState.selectedTags.length - 1}
							<span class="mr-1">,</span>
						{/if}
					{/each}
				</div>
			{/if}

			{#each Object.keys(filterState.selectedGeneralFilters) as key, idx}
				<div class="flex flex-wrap bg-gray-50 p-2 rounded">
					<span class="mr-1 whitespace-nowrap font-bold tracking-tighter capitalize">{key?.includes?.('.') ? key?.split('.')[1] : key}:</span>
					{#each filterState.selectedGeneralFilters[key] as value, idx_i}
						<div class="flex flex-row flex-wrap items-center">
							<span class="whitespace-nowrap capitalize">{value}</span>
							{#if idx_i < filterState.selectedGeneralFilters[key].length - 1}
								<span class="mr-1">,</span>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>-->

		<!-- Category list -->
		{#if filterState.categories.length > 0}
			<!-- <div class="mt-4 pt-4 border-t border-gray-100"></div> -->
			{#if filterState.showCategorySearch}
				<div class="relative mx-auto w-[calc(100%-0.5rem)]" in:fly={{ x: 10, duration: 200, easing: quintOut }}>
					<!-- svelte-ignore a11y_autofocus -->
					<input
						bind:value={filterState.categorySearchQuery}
						type="text"
						placeholder="Search categories"
						class="w-full rounded-md border-0 py-2 pl-3 text-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
						onkeydown={filterState.handleCategorySearchKeyDown}
						autofocus
					/>
					<Button
						variant="ghost"
						size="icon"
						class="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
						onclick={() => filterState.toggleCategorySearch()}
					>
						<X class="h-4 w-4" />
						<span class="sr-only">Close search</span>
					</Button>
				</div>
			{:else}
				<div class="flex items-center justify-between">
					<p class="text-sm font-bold uppercase text-gray-900" in:fade={{ duration: 200, delay: 200 }}>Categories</p>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-full h-8 w-8"
						onclick={() => filterState.toggleCategorySearch()}
						aria-label="Toggle category search"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-4 w-4"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.3-4.3"></path>
						</svg>
						<span class="sr-only">Search</span>
					</Button>
				</div>
			{/if}

			<div class="flex flex-col text-sm">
				{#if !filterState.showMoreCategories}
					{@const categoriesToShow = filterState.filteredCategories.slice(0, 5)}
					{#each categoriesToShow as category}
						{@const formattedCategoryName = filterState.formatFilterOptionName(category.name)}
						<Button
							variant="ghost"
							class="group flex flex-row items-center justify-start gap-2 h-auto py-1 px-0 hover:bg-transparent"
							onclick={() => filterState.handleCategoryClick(categoryOption(category))}
						>
							{#if category.thumbnail}
								<img
									src={category.thumbnail}
									alt={formattedCategoryName}
									class="h-8 w-8 rounded object-cover transition-opacity group-hover:opacity-80"
								/>
							{/if}
							<span class="flex-1 py-0.5 capitalize text-gray-600 transition-colors group-hover:text-primary">{formattedCategoryName}</span>
						</Button>
					{/each}
					{#if filterState.filteredCategories.length > 5}
						<Button
							variant="link"
							size="sm"
							class="mt-1 h-auto p-0 justify-start"
							onclick={filterState.toggleShowMoreCategories}
						>
							+ {filterState.filteredCategories.length - 5} more
						</Button>
					{/if}
				{:else}
					{#each filterState.filteredCategories as category}
						{@const formattedCategoryName = filterState.formatFilterOptionName(category.name)}
						<Button
							variant="ghost"
							class="group flex flex-row items-center justify-start gap-3 h-auto py-1 px-0 hover:bg-transparent"
							onclick={() => filterState.handleCategoryClick(categoryOption(category))}
						>
							{#if category.thumbnail}
								<img
									src={category.thumbnail}
									alt={formattedCategoryName}
									class="h-8 w-8 rounded object-cover transition-opacity group-hover:opacity-80"
								/>
							{/if}
							<span class="flex-1 py-0.5 capitalize text-gray-600 transition-colors group-hover:text-primary">{formattedCategoryName}</span>
						</Button>
					{/each}
					<Button
						variant="link"
						size="sm"
						class="mt-1 h-auto p-0 justify-start"
						onclick={filterState.toggleShowMoreCategories}
					>
						Show less
					</Button>
				{/if}
			</div>
		{/if}

		<!-- Tags List -->
		{#if filterState.tags.length > 0}
			<div class="w-full border-b border-gray-200"></div>

			{#if filterState.showTagSearch}
				<div class="relative mx-auto w-[calc(100%-0.5rem)]" in:fly={{ x: 10, duration: 200, easing: quintOut }}>
					<!-- svelte-ignore a11y_autofocus -->
					<input
						bind:value={filterState.tagSearchQuery}
						type="text"
						placeholder="Search tags"
						class="w-full rounded-md border-0 py-2 pl-3 text-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
						onkeydown={filterState.handleTagSearchKeyDown}
						autofocus
					/>
					<Button
						variant="ghost"
						size="icon"
						class="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
						onclick={() => filterState.toggleTagSearch()}
					>
						<X class="h-4 w-4" />
						<span class="sr-only">Close search</span>
					</Button>
				</div>
			{:else}
				<div class="flex items-center justify-between">
					<p class="text-sm font-bold uppercase text-gray-900" in:fade={{ duration: 200, delay: 200 }}>Tags</p>
					<Button
						class="flex w-8 items-center justify-center rounded-full text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
						variant="ghost"
						size="icon"
						onclick={() => filterState.toggleTagSearch()}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-4 w-4"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.3-4.3"></path>
						</svg>
						<span class="sr-only">Search</span>
					</Button>
				</div>
			{/if}

			<div class="flex flex-col text-sm">
				{#if !filterState.showMoreTags}
					{@const tagsToShow = filterState.filteredTags.slice(0, 5)}
					{#each tagsToShow as tag}
						<div class="flex flex-row items-center gap-2">
							<Checkbox
								id={`tag-${tag.slug || tag.name}`}
								checked={filterState.selectedTags.find((t: any) => t.name === tag.name) ? true : false}
								onCheckedChange={(checked) => {
									filterState.handleTagChange({ tag, checked })
								}}
							/>
							<label
								for={`tag-${tag.slug || tag.name}`}
								class="flex-1 cursor-pointer py-1 capitalize text-gray-600 transition-colors hover:text-gray-900">{tag.name}</label
							>
						</div>
					{/each}
					{#if filterState.filteredTags.length > 5}
						<Button
							variant="link"
							size="sm"
							class="mt-1 h-auto p-0 justify-start"
							onclick={filterState.toggleShowMoreTags}
						>
							+ {filterState.filteredTags.length - 5} more
						</Button>
					{/if}
				{:else}
					{#each filterState.filteredTags as tag}
						<div class="flex flex-row items-center gap-2">
							<Checkbox
								id={`tag-${tag.slug || tag.name}`}
								checked={filterState.selectedTags.find((t: any) => t.name === tag.name) ? true : false}
								onCheckedChange={(checked) => {
									filterState.handleTagChange({ tag, checked })
								}}
							/>
							<label
								for={`tag-${tag.slug || tag.name}`}
								class="flex-1 cursor-pointer py-1 capitalize text-gray-600 transition-colors hover:text-gray-900">{tag.name}</label
							>
						</div>
					{/each}
					<Button
						variant="link"
						size="sm"
						class="mt-1 h-auto p-0 justify-start"
						onclick={filterState.toggleShowMoreTags}
					>
						Show less
					</Button>
				{/if}
			</div>

			<div class="w-full border-b border-gray-200"></div>
		{/if}

		<!-- Price Filter -->
		<p class="text-sm font-bold uppercase text-gray-900">Price Range</p>

		<div class="relative mr-5 mt-2">
			<!-- Range slider track -->
			<div class="absolute h-1 w-full rounded bg-gray-100">
				<div
					class="absolute h-1 bg-primary"
					style="left: {filterState.priceSliderLeftPercentage}%; right: {filterState.priceSliderRightPercentage}%"
				></div>
			</div>

			<!-- Range inputs -->
			<input
				type="range"
				bind:value={filterState.minPrice}
				aria-label="Choose minimum price"
				min={filterState.minPossiblePrice}
				max={filterState.maxPossiblePrice}
				onchange={filterState.handleMinPriceChange}
				class="pointer-events-none absolute h-1 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-300"
			/>
			<input
				type="range"
				bind:value={filterState.maxPrice}
				min={filterState.minPossiblePrice}
				aria-label="Choose maximum price"
				max={filterState.maxPossiblePrice}
				onchange={filterState.handleMaxPriceChange}
				class="pointer-events-none absolute h-1 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-300"
			/>
		</div>

		<!-- Price range display -->
		<div class="mt-3 text-xs font-bold text-gray-500">
			{filterState.priceRange}
		</div>

		<!-- Other generalized filters -->
		{#if filterState.processedFilters}
			{#each Object.keys(filterState.processedFilters) as key, idx}
				<div class="w-full border-b border-gray-200"></div>

				<div class="intra-gap flex flex-col">
					<p class="text-sm font-bold uppercase text-gray-900">
						{filterState.formatFilterName(key)}
					</p>

					<div class="flex flex-col space-y-1 text-sm">
						{#if !filterState.showMoreGeneralFilters[idx]}
							{@const valuesToShow = filterState.processedFilters[key].slice(0, 3)}
							{#each valuesToShow as value}
								<div class="flex flex-row items-center gap-2">
									<Checkbox
										id={`gen-${value}`}
										checked={filterState.selectedGeneralFilters[key]?.includes(value)}
										onCheckedChange={(checked) => {
											filterState.handleGeneralFiltersChange({ key, value, checked })
										}}
									/>
									<label for={`gen-${value}`} class="flex-1 cursor-pointer py-1 capitalize text-gray-600 transition-colors hover:text-gray-900">
										{#if value?.startsWith?.('#')}
											<div class="flex items-center gap-2">
												<div class="h-4 w-4 rounded-full border border-gray-200" style="background-color: {value};"></div>
												{GetColorName(value)}
											</div>
										{:else}
											{value}
										{/if}
									</label>
								</div>
							{/each}
							{#if filterState.processedFilters[key].length > 3}
								<Button
									variant="link"
									size="sm"
									class="mt-1 h-auto p-0 justify-start"
									onclick={() => {
										filterState.showMoreGeneralFilters[idx] = true
									}}
								>
									+ {filterState.processedFilters[key].length - 3} more
								</Button>
							{/if}
						{:else}
							{#each filterState.processedFilters[key] as value}
								<div class="flex flex-row items-center gap-2">
									<Checkbox
										id={`gen-${value}`}
										checked={filterState.selectedGeneralFilters[key]?.includes(value)}
										onCheckedChange={(checked) => {
											filterState.handleGeneralFiltersChange({ key, value, checked })
										}}
									/>
									<label for={`gen-${value}`} class="flex-1 cursor-pointer py-1 capitalize text-gray-600 transition-colors hover:text-gray-900">
										{#if value?.startsWith?.('#')}
											<div class="flex items-center gap-2">
												<div class="h-4 w-4 rounded-full border border-gray-200" style="background-color: {value};"></div>
												{GetColorName(value)}
											</div>
										{:else}
											{value}
										{/if}
									</label>
								</div>
							{/each}
							<Button
								variant="link"
								size="sm"
								class="mt-1 h-auto p-0 justify-start"
								onclick={() => {
									filterState.showMoreGeneralFilters[idx] = false
								}}
							>
								Show less
							</Button>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
