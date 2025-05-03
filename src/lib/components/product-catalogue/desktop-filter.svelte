<script lang="ts">
	import { cn } from '$lib/core/utils'
	import { X } from 'lucide-svelte'
	import { fade, fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { browser } from '$app/environment'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import { GetColorName } from 'hex-color-to-color-name'
	import { getDesktopFilterState } from '$lib/core/composables/use-desktop-filters.svelte'

	type FilterProps = {
		class?: string
	}

	let { class: className = '' }: FilterProps = $props()

	const filterState = getDesktopFilterState()
</script>

<div class="group sticky" style={`top: ${filterState.containerTop}px;`}>
	<div
		bind:this={filterState.container}
		class={cn(
			'min-w-56 overflow-y-auto !pb-20 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent  group-hover:scrollbar-track-inherit group-hover:scrollbar-thumb-inherit',
			className
		)}
		style={`height: ${browser ? window?.innerHeight - (filterState.containerTop || 0) : 'auto'}px`}
	>
		<div class="mb-2 flex items-center justify-between pr-2">
			<p class="text-lg font-semibold">Filters</p>

			{#if filterState.anyFilterApplied}
				<button class="flex items-center justify-center gap-1 text-xs text-gray-500" onclick={filterState.clearFilters}>
					<X class="h-4 w-4" />
					Clear Filters
				</button>
			{/if}
		</div>

		<!-- Applied filters -->
		<div class="flex w-full max-w-56 flex-col flex-wrap gap-1 text-xs text-gray-500">
			{#if filterState.selectedTags.length > 0}
				<div class="flex flex-row flex-wrap items-center">
					<span class="mr-1 font-bold">Tags: </span>
					{#each filterState.selectedTags as tag, idx}
						<span class="whitespace-nowrap capitalize">{tag.name}</span>
						{#if idx < filterState.selectedTags.length - 1}
							<span class="mr-1">,</span>
						{/if}
					{/each}
				</div>
			{/if}

			<!-- {#if selectedTags?.length > 0 && Object.keys(selectedGeneralFilters).length > 0}
      <span class="size-1 rounded-full bg-gray-400"></span>
    {/if} -->

			{#each Object.keys(filterState.selectedGeneralFilters) as key, idx}
				<div class="flex flex-wrap">
					<span class="mr-1 whitespace-nowrap font-bold capitalize">{key?.includes?.('.') ? key?.split('.')[1] : key}:</span>
					{#each filterState.selectedGeneralFilters[key] as value, idx_i}
						<div class="flex flex-row flex-wrap items-center">
							<span class="whitespace-nowrap capitalize">{value}</span>
							{#if idx_i < filterState.selectedGeneralFilters[key].length - 1}
								<span class="mr-1">,</span>
							{/if}
						</div>
					{/each}
					{#if idx < Object.keys(filterState.selectedGeneralFilters).length - 1}
						<span class="mr-1">,</span>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Category list -->
		{#if filterState.categories.length > 0}
			<hr class="my-3" />
			{#if filterState.showCategorySearch}
				<div class="relative mx-auto w-[calc(100%-0.5rem)]" in:fly={{ x: 10, duration: 200, easing: quintOut }}>
					<input
						bind:value={filterState.categorySearchQuery}
						type="text"
						placeholder="Search categories"
						class="w-full rounded-md border-0 py-2 pl-3 pr-7 text-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
						onkeydown={filterState.handleCategorySearchKeyDown}
						autofocus
					/>
					<button
						class="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
						onclick={() => filterState.toggleCategorySearch()}
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
							<path d="M18 6 6 18"></path>
							<path d="m6 6 12 12"></path>
						</svg>
						<span class="sr-only">Close search</span>
					</button>
				</div>
			{:else}
				<div class="flex items-center justify-between">
					<p class="text-sm font-semibold" in:fade={{ duration: 200, delay: 200 }}>Categories</p>
					<button
						class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
						onclick={() => filterState.toggleCategorySearch()}
						aria-label="Toggle category search"
						in:fade={{ duration: 500 }}
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
					</button>
				</div>
			{/if}

			<div class="mt-2 flex flex-col text-sm">
				{#if !filterState.showMoreCategories}
					{@const categoriesToShow = filterState.filteredCategories.slice(0, 5)}
					{#each categoriesToShow as category}
						{@const formattedCategoryName = filterState.formatFilterOptionName(category.name)}
						<button class="flex flex-row gap-2 text-start" onclick={() => filterState.handleCategoryClick(category)}>
							{#if category.thumbnail}
								<img src={category.thumbnail} alt={formattedCategoryName} class="mb-1 h-8 w-8 rounded-lg object-cover" />
							{/if}
							<span class="flex-1 py-0.5 capitalize">{formattedCategoryName}</span>
						</button>
					{/each}
					{#if filterState.filteredCategories.length > 5}
						<button class="mt-1 text-left text-sm text-green-500 hover:underline" onclick={filterState.toggleShowMoreCategories}>
							+ {filterState.filteredCategories.length - 5} more
						</button>
					{/if}
				{:else}
					{#each filterState.filteredCategories as category}
						{@const formattedCategoryName = filterState.formatFilterOptionName(category.name)}
						<button class="flex flex-row gap-2 text-start" onclick={() => filterState.handleCategoryClick(category)}>
							{#if category.thumbnail}
								<img src={category.thumbnail} alt={formattedCategoryName} class="mb-1 h-8 w-8 rounded-lg object-cover" />
							{/if}
							<span class="flex-1 py-0.5 capitalize">{formattedCategoryName}</span>
						</button>
					{/each}
					<button class="mt-1 text-left text-sm text-green-500 hover:underline" onclick={filterState.toggleShowMoreCategories}> Show less </button>
				{/if}
			</div>
		{/if}

		<!-- Tags List -->
		{#if filterState.tags.length > 0}
			<hr class="my-3" />
			{#if filterState.showTagSearch}
				<div class="relative mx-auto w-[calc(100%-0.5rem)]" in:fly={{ x: 10, duration: 200, easing: quintOut }}>
					<input
						bind:value={filterState.tagSearchQuery}
						type="text"
						placeholder="Search tags"
						class="w-full rounded-md border-0 py-2 pl-3 pr-7 text-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
						onkeydown={filterState.handleTagSearchKeyDown}
						autofocus
					/>
					<button
						class="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
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
							<path d="M18 6 6 18"></path>
							<path d="m6 6 12 12"></path>
						</svg>
						<span class="sr-only">Close search</span>
					</button>
				</div>
			{:else}
				<div class="flex items-center justify-between">
					<p class="text-sm font-semibold" in:fade={{ duration: 200, delay: 200 }}>Tags</p>
					<button
						class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700"
						onclick={() => filterState.toggleTagSearch()}
						in:fade={{ duration: 500 }}
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
					</button>
				</div>
			{/if}

			<div class="mt-2 flex flex-col text-sm">
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
							<label for={`tag-${tag.slug || tag.name}`} class="flex-1 cursor-pointer py-0.5 capitalize">{tag.name}</label>
						</div>
					{/each}
					{#if filterState.filteredTags.length > 5}
						<button class="mt-1 text-left text-sm text-green-500 hover:underline" onclick={filterState.toggleShowMoreTags}>
							+ {filterState.filteredTags.length - 5} more
						</button>
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
							<label for={`tag-${tag.slug || tag.name}`} class="flex-1 cursor-pointer py-0.5 capitalize">{tag.name}</label>
						</div>
					{/each}
					<button class="mt-1 text-left text-sm text-green-500 hover:underline" onclick={filterState.toggleShowMoreTags}> Show less </button>
				{/if}
			</div>
		{/if}

		<hr class="my-3" />
		<!-- Price Filter -->
		<p class="my-2 text-sm font-semibold">Price</p>

		<div class="relative mr-5 mt-4">
			<!-- Range slider track -->
			<div class="absolute h-1 w-full rounded bg-gray-200">
				<div
					class="absolute h-1 bg-yellow-500"
					style="left: {(filterState.minPrice / filterState.maxPossiblePrice) * 100}%; right: {100 -
						(filterState.maxPrice / filterState.maxPossiblePrice) * 100}%"
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
				class="pointer-events-none absolute h-1 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-rose-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-rose-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-300"
			/>
			<input
				type="range"
				bind:value={filterState.maxPrice}
				min={filterState.minPossiblePrice}
				aria-label="Choose maximum price"
				max={filterState.maxPossiblePrice}
				onchange={filterState.handleMaxPriceChange}
				class="pointer-events-none absolute h-1 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-rose-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-rose-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-300"
			/>
		</div>

		<!-- Price range display -->
		<div class="mt-9 text-sm text-gray-600">
			{filterState.priceRange}
		</div>

		<!-- Other generalized filters -->
		{#if filterState.processedFilters}
			{#each Object.keys(filterState.processedFilters) as key, idx}
				<hr class="my-3" />
				<div class="mt-4">
					<p class="my-2 text-sm font-semibold capitalize">
						{filterState.formatFilterName(key)}
					</p>

					<div class="flex flex-col text-sm">
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
									<label for={`gen-${value}`} class="flex-1 cursor-pointer py-0.5 capitalize">
										{#if value?.startsWith?.('#')}
											<div class="flex items-center gap-2">
												<div class="h-5 w-5 rounded-full" style="background-color: {value};"></div>
												{GetColorName(value)}
											</div>
										{:else}
											{value}
										{/if}
									</label>
								</div>
							{/each}
							{#if filterState.processedFilters[key].length > 3}
								<button
									class="mt-1 text-left text-sm text-green-500 hover:underline"
									onclick={() => {
										filterState.showMoreGeneralFilters[idx] = true
									}}
								>
									+ {filterState.processedFilters[key].length - 3} more
								</button>
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
									<label for={`gen-${value}`} class="flex-1 cursor-pointer py-0.5 capitalize">
										{#if value?.startsWith?.('#')}
											<div class="flex items-center gap-2">
												<div class="h-5 w-5 rounded-full" style="background-color: {value};"></div>
												{GetColorName(value)}
											</div>
										{:else}
											{value}
										{/if}
									</label>
								</div>
							{/each}
							<button
								class="mt-1 text-left text-sm text-green-500 hover:underline"
								onclick={() => {
									filterState.showMoreGeneralFilters[idx] = false
								}}
							>
								Show less
							</button>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

