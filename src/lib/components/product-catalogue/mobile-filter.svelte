<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js'
	import * as Sheet from '$lib/components/ui/sheet/index.js'
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js'
	import { GetColorName } from 'hex-color-to-color-name'
	import { ArrowDownNarrowWide, ChevronRight, Filter, SearchIcon } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import Label from '$lib/components/ui/label/label.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { getDesktopFilterState } from '$lib/core/composables/index.js'
	import { sortOptions } from '$lib/config.js'
	import { page } from '$app/state'
	import { readAppliedFilters } from './scope-filters.js'

	// A plain prop, not a binding: listing-page.svelte derives the current sort from the URL and
	// owns the navigation, so this sheet can never drift out of step with the grid it sorts.
	let { selectedSort = 'popularity:desc', onSortChange = (value: string) => {} } = $props()

	const filterModule = getDesktopFilterState()

	// The search term is what the filters run against, not one of them, so it is not summarised on
	// the Filter button. It has its own removable chip above the grid.
	const barFilters = $derived(
		readAppliedFilters(page.url, Object.keys(page.data?.products?.facets || {}), page.data?.store?.currencySymbol ?? '').filter(
			(f) => f.key !== 'search'
		)
	)

	// Sorting is one decision, not four. The rows used to commit on their own change event and
	// dismiss the sheet, so the first ArrowDown both re-ordered the listing and closed the sheet,
	// and because no radio was ever marked checked a screen reader could not state the current
	// sort. Hold the choice here and commit it on Done.
	let pendingSort = $state<string | null>(null)

	// Null means "no choice made in this sheet yet", so the group always opens on the sort the
	// listing is actually using rather than on a stale local copy.
	const draftSort = $derived(pendingSort ?? selectedSort)

	$effect(() => {
		if (filterModule.showSortByDrawer) pendingSort = null
	})

	function applyPendingSort() {
		const next = draftSort
		filterModule.showSortByDrawer = false
		if (!next || next === selectedSort) return
		filterModule.selectedSort = next
		onSortChange(next)
	}

	// A backend that cannot filter by price reports no range at all (Vendure returns
	// `priceStat: { min: undefined, max: undefined }`), which rendered a dead slider with blank
	// Min/Max boxes. Drop the tab entirely in that case — the composable already does the same for
	// Tags when a store has none — and keep the slider maths off a zero-width range.
	const priceFilterSupported = $derived(
		Number.isFinite(filterModule.minPossiblePrice) &&
			Number.isFinite(filterModule.maxPossiblePrice) &&
			filterModule.maxPossiblePrice > filterModule.minPossiblePrice
	)

	const menuItems = $derived(priceFilterSupported ? filterModule.menuItems : filterModule.menuItems.filter((item: any) => item.id !== 'price'))

	// The dropped tab must not stay selected: `selectedSection` is seeded from the composable's own
	// list, which always includes price.
	$effect(() => {
		if (!priceFilterSupported && filterModule.selectedSection === 'price') {
			filterModule.selectedSection = menuItems[0]?.id ?? ''
		}
	})

	function formatCategoryName(input: string) {
		const x = filterModule.formatFilterOptionName(input)
		if (x.length > 27) return x.substring(0, 24) + '...'
		return x
	}

	// 44px of hit area over a 4px track, shared by both thumbs.
	const rangeInputClass =
		'pointer-events-none absolute top-1/2 h-11 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background'
</script>

<div
	class="ed-mf__bar fixed bottom-0 left-0 right-0 z-sticky grid h-14 w-full grid-cols-2 border-t bg-background pb-[env(safe-area-inset-bottom,0px)] shadow-z-2 md:hidden"
>
	<!-- Sort by -->
	<div class="flex items-center justify-center border-r">
		<!-- `manageHistory={false}`: the shared Drawer wrapper otherwise pushes a duplicate history
		     entry on open and pops it with `history.back()` on close, and Done both closes the sheet
		     and navigates — so the pop landed on top of the sort navigation and the listing came back
		     unsorted. Sorting is now its own history entry, which is what Back should undo.
		     Spread, not a plain attribute: drawer.svelte accepts the prop but types itself as the
		     bare vaul `Props`, so naming it directly is a type error in a file that is not ours. -->
		<Drawer.Root direction="bottom" {...{ manageHistory: false }} bind:open={filterModule.showSortByDrawer}>
			<Drawer.Trigger class="flex h-full w-full items-center justify-center gap-2 px-2 text-sm text-foreground transition-colors hover:bg-muted">
				<ArrowDownNarrowWide class="h-4 w-4 shrink-0 text-muted-foreground" />
				<div class="flex min-w-0 flex-col items-start">
					<span class="font-semibold">Sort by</span>
					{#if selectedSort}
						<span class="max-w-[14ch] truncate text-xs text-muted-foreground">
							{sortOptions.find((item) => item.value === selectedSort)?.name}
						</span>
					{/if}
				</div>
			</Drawer.Trigger>

			<Drawer.Content class="rounded-t-xl">
				<Drawer.Header class="border-b py-3 text-left">
					<Drawer.Title class="text-base font-semibold">Sort by</Drawer.Title>
				</Drawer.Header>

				<!-- The radio-group primitive rather than four loose inputs: it ships roving focus, so
				     every option is reachable, and a checked state, so the current sort is announced. -->
				<RadioGroup.Root value={draftSort} onValueChange={(value: string) => (pendingSort = value)} class="gap-0 px-4" aria-label="Sort products by">
					{#each sortOptions as item}
						<div class="flex items-center justify-between gap-3 border-b last:border-b-0">
							<Label
								for={`sort-${item.value}`}
								class="flex min-h-11 flex-1 cursor-pointer items-center text-sm {draftSort === item.value
									? 'font-medium text-primary'
									: 'font-normal text-foreground'}"
							>
								{item.name}
							</Label>
							<RadioGroup.Item value={item.value} id={`sort-${item.value}`} class="size-5 shrink-0" />
						</div>
					{/each}
				</RadioGroup.Root>

				<div class="p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
					<Button class="ed-mf__apply h-11 w-full" onclick={applyPendingSort}>Done</Button>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</div>

	<!-- Filter. The trigger belongs to the sheet, so focus comes back here when the panel closes. -->
	<Sheet.Root bind:open={filterModule.showFilter} manageHistory={false}>
		<Sheet.Trigger class="flex h-full w-full items-center justify-center gap-2 px-2 text-sm text-foreground transition-colors hover:bg-muted">
			<Filter class="h-4 w-4 shrink-0 text-muted-foreground" />

			<div class="flex min-w-0 flex-col items-start">
				<span class="font-semibold">Filter</span>
				<!-- What is actually narrowing the results, read from the URL. The composable's own
				     applied-filter map counts `search`, `sort` and `page` as facets, so a plain search
				     result advertised "Search" as a filter the shopper had supposedly applied, and a
				     sorted listing claimed a filter that did not exist. -->
				{#if barFilters.length}
					<span class="max-w-[14ch] truncate text-xs capitalize text-muted-foreground">
						{barFilters
							.slice(0, 2)
							.map((f) => f.label)
							.join(', ') + (barFilters.length > 2 ? ` +${barFilters.length - 2}` : '')}
					</span>
				{/if}
			</div>
		</Sheet.Trigger>

		<!-- A real dialog. The panel used to be a permanently mounted `fixed` div merely translated
		     off screen, so opening it left focus on the button underneath, Tab walked out into the
		     product grid the shopper could not see, Escape did nothing and no dialog boundary was
		     announced. The sheet primitive supplies focus trapping, Escape, scroll lock and focus
		     restore to the trigger. -->
		<Sheet.Content side="left" class="ed-mf__panel flex w-full max-w-none flex-col gap-0 p-0 sm:max-w-none">
			<Sheet.Header class="ed-mf__phead shrink-0 space-y-0 border-b px-4 py-4 pr-14 text-left">
				<Sheet.Title class="ed-mf__ptitle text-xs font-bold uppercase tracking-widest">Filters</Sheet.Title>
				<Sheet.Description class="sr-only">Narrow the product list by category, price and product attributes.</Sheet.Description>
			</Sheet.Header>

			<div class="flex min-h-0 flex-1">
				<!-- Section tabs -->
				<div class="ed-mf__menu w-[35vw] shrink-0 overflow-y-auto border-r">
					{#each menuItems as item}
						<Button
							variant="ghost"
							class="ed-mf__tab h-auto min-h-11 w-full justify-between gap-1 rounded-none px-4 py-3 {filterModule.selectedSection === item.id
								? 'bg-background text-primary hover:bg-background'
								: 'text-muted-foreground'}"
							aria-current={filterModule.selectedSection === item.id ? 'true' : undefined}
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

				<!-- Dynamic content, based on the selected section -->
				<div class="ed-mf__content min-w-0 flex-1 overflow-y-auto bg-background p-4">
					{#if filterModule.selectedSection === 'discount'}
						<div class="space-y-5">
							<div class="relative">
								<input
									type="text"
									placeholder="Search discount..."
									aria-label="Search discounts"
									class="ed-mf__search h-11 w-full rounded-md border border-input bg-background py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none"
									bind:value={filterModule.searchQuery}
								/>
								<SearchIcon class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							</div>

							<div class="space-y-1">
								{#each filterModule.discountOptions as option}
									<label class="group flex min-h-11 cursor-pointer items-center gap-3">
										<span class="relative flex items-center justify-center">
											<input
												type="radio"
												name="discount"
												value={option.value}
												bind:group={filterModule.selectedDiscount}
												class="peer h-5 w-5 appearance-none rounded-full border-2 border-input transition-colors checked:border-primary"
											/>
											<span class="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100"></span>
										</span>
										<span class="ed-mf__opt text-sm font-medium text-foreground transition-colors group-hover:text-primary">
											{option.label}
										</span>
									</label>
								{/each}
							</div>
						</div>
					{:else if filterModule.selectedSection === 'category'}
						<div class="relative mb-4">
							<input
								type="text"
								placeholder="Search category..."
								aria-label="Search categories"
								class="ed-mf__search h-11 w-full rounded-md border border-input bg-background py-2.5 pl-3 pr-10 text-sm focus:border-primary focus:outline-none"
								bind:value={filterModule.categorySearchQuery}
							/>
							<SearchIcon class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						</div>
						{#if filterModule.filteredCategories?.length > 0}
							<!-- One full-width row per category. The Button base is `inline-flex justify-center
							     whitespace-nowrap`, which centred each name, shrank the row to the text and
							     truncated anything long — in a narrow drawer panel that reads as a ragged list
							     with ~26px tap targets. These rows are left-aligned, wrap, and are touch-sized. -->
							<div class="-mx-1 divide-y divide-border">
								{#each filterModule.filteredCategories as category}
									{@const formattedCategoryName = filterModule.formatFilterOptionName(category.name)}
									<Button
										variant="ghost"
										title={formattedCategoryName}
										class="group h-auto min-h-11 w-full justify-start gap-3 whitespace-normal rounded-none px-1 py-3 text-left font-normal hover:bg-transparent"
										onclick={() => filterModule.handleCategoryClick({ slug: category.slug, name: category.name })}
									>
										{#if category.thumbnail}
											<img
												src={category.thumbnail}
												alt={formattedCategoryName}
												class="size-9 shrink-0 rounded object-cover transition-opacity group-hover:opacity-80"
											/>
										{/if}
										<span class="ed-mf__opt min-w-0 flex-1 text-sm capitalize text-foreground transition-colors group-hover:text-primary"
											>{formatCategoryName(category.name)}</span
										>
										<ChevronRight class="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
									</Button>
								{/each}
							</div>
						{:else}
							<div class="flex h-40 items-center justify-center">
								<p class="text-sm font-medium text-muted-foreground">No categories found</p>
							</div>
						{/if}
					{:else if filterModule.selectedSection === 'price'}
						<div class="w-full">
							<p class="ed-mf__label text-xs font-bold uppercase tracking-widest text-foreground">Price range</p>

							<!-- h-5: every child of this wrapper is absolutely positioned, so it used to be a zero-height
							      box. Its own top margin then collapsed straight through with the price block's, which put
							      the Min/Max captions on the same line as the track and left the 20px thumbs sitting on top
							      of the words. Giving the wrapper the thumb's own height stops the collapse, so the margin
							      below it is real space again. The 44px input hit area still overhangs it. -->
							<div class="ed-mf__slider relative mr-5 mt-3 h-5 px-2">
								<div class="ed-mf__track absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-muted">
									<div
										class="ed-mf__fill absolute h-1 bg-primary"
										style="left: {filterModule.priceSliderLeftPercentage}%; right: {filterModule.priceSliderRightPercentage}%"
									></div>
								</div>

								<!-- One accessible name each. Two unnamed sliders sharing a track are
								     indistinguishable to a screen reader, and the desktop panel has carried
								     these labels all along. -->
								<input
									type="range"
									bind:value={filterModule.minPrice}
									aria-label="Choose minimum price"
									min={filterModule.minPossiblePrice}
									max={filterModule.maxPossiblePrice}
									onchange={filterModule.handleMinPriceChange}
									class={rangeInputClass}
								/>
								<input
									type="range"
									bind:value={filterModule.maxPrice}
									aria-label="Choose maximum price"
									min={filterModule.minPossiblePrice}
									max={filterModule.maxPossiblePrice}
									onchange={filterModule.handleMaxPriceChange}
									class={rangeInputClass}
								/>
							</div>

							<!-- The same editable bounds the desktop panel already ships. Dragging two
							     overlapping thumbs is not a way to set an exact budget on a phone. -->
							<div class="ed-mf__prices mt-3 grid grid-cols-2 gap-3">
								<Textbox
									type="number"
									class="h-11"
									label="Min ({page.data?.store?.currency?.symbol ?? ''})"
									onchange={filterModule.handleMinPriceChange}
									bind:value={filterModule.minPrice}
								/>
								<Textbox
									type="number"
									class="h-11"
									label="Max ({page.data?.store?.currency?.symbol ?? ''})"
									onchange={filterModule.handleMaxPriceChange}
									bind:value={filterModule.maxPrice}
								/>
							</div>

							<p class="ed-mf__priceval text-base font-semibold text-foreground" aria-live="polite">
								{filterModule.priceRange}
							</p>
						</div>
					{:else if filterModule.selectedSection === 'tags'}
						{#if filterModule.tags.length > 0}
							<div class="divide-y divide-border">
								{#each filterModule.tags as tag}
									<div class="flex min-h-11 flex-row items-center gap-3 py-1">
										<Checkbox
											id={`m-tags-${tag.slug || tag.name}`}
											checked={filterModule.selectedTags?.find?.((t: any) => t?.name === tag?.name) ? true : false}
											onCheckedChange={(checked) => {
												filterModule.handleTagChange({ tag, checked })
											}}
										/>
										<label
											for={`m-tags-${tag.slug || tag.name}`}
											class="ed-mf__opt flex min-h-11 flex-1 cursor-pointer items-center text-sm font-medium capitalize text-foreground"
											>{tag.name}</label
										>
									</div>
								{/each}
							</div>
						{:else}
							<div class="flex h-40 items-center justify-center">
								<p class="text-sm font-medium text-muted-foreground">No tags found</p>
							</div>
						{/if}
					{:else if filterModule.processedFilters}
						{@const valuesToShow = filterModule.processedFilters[filterModule.selectedSection]}
						<div class="divide-y divide-border">
							{#each valuesToShow as value}
								<!-- The id carries the group key. Built from the value alone, the same value under
								     two facets (Black under colour and under trim colour) emitted duplicate ids,
								     so tapping one label ticked the other group's box. -->
								<div class="flex min-h-11 items-center gap-3 py-1">
									<Checkbox
										id={`m-${filterModule.selectedSection}-${value}`}
										checked={filterModule.selectedGeneralFilters[filterModule.selectedSection]?.includes(value)}
										onCheckedChange={(checked) =>
											filterModule.handleGeneralFiltersChange({
												key: filterModule.selectedSection,
												value,
												checked
											})}
									/>
									<label
										for={`m-${filterModule.selectedSection}-${value}`}
										class="ed-mf__opt flex min-h-11 flex-1 cursor-pointer items-center text-sm font-medium capitalize text-foreground"
									>
										{#if value?.startsWith?.('#')}
											<span class="flex items-center gap-2">
												<span class="h-5 w-5 rounded-full border shadow-xs" style="background-color: {value};"></span>
												{GetColorName(value)}
											</span>
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

			<!-- Both decisions at the mobile target size, and Apply where a thumb already rests
			     rather than tucked into the header beside the close control. -->
			<div class="flex shrink-0 items-center gap-3 border-t bg-background px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
				{#if filterModule.anyFilterApplied}
					<Button variant="outline" class="h-11 flex-1" onclick={filterModule.clearFilters}>Clear all</Button>
				{/if}
				<Button class="ed-mf__apply h-11 flex-[2] text-xs font-bold uppercase tracking-widest" onclick={filterModule.handleApply}>Apply</Button>
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>

<style>
	/* ---- Refined Editorial · mobile filter chrome (default theme only) ----
	   The bar, the sort drawer and the filter sheet are all portalled to <body>, which is outside
	   the shell's [data-theme] wrapper but inside <html>'s copy of it — so every rule below is
	   written fully global and gated on [data-theme='default']. Other themes are untouched. */

	/* The bar is `fixed` and 56px tall, so it covers the last 56px of the listing on every theme.
	   The default theme paid for that with padding on .ed-plp, but the base .ed-plp rule is
	   `display: contents` (no box, no padding), so wine/organic/lime/noor got their last card row
	   and the footer's first line covered. Charge it to the PLP row instead — that one is a real
	   box on every theme — and only while the bar is on screen (<md). */
	@media (max-width: 767px) {
		:global(.ed-plp__row) {
			padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
		}
	}

	/* Fixed bottom Sort / Filter bar */
	:global([data-theme='default'] .ed-mf__bar) {
		border-top: 1px solid var(--ed-line);
		background: var(--ed-surface);
		box-shadow: 0 -1px 12px rgba(27, 26, 23, 0.06);
		font-family: var(--ed-body);
		color: var(--ed-ink);
	}

	/* Full-height filter sheet */
	:global([data-theme='default'] .ed-mf__panel) {
		font-family: var(--ed-body);
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .ed-mf__phead) {
		border-bottom: 1px solid var(--ed-line);
		background: var(--ed-surface);
	}

	:global([data-theme='default'] .ed-mf__ptitle) {
		font-family: var(--ed-body);
		letter-spacing: 0.18em;
		color: var(--ed-ink);
	}

	/* Apply / Done — editorial primary fill */
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

	/* Section tab rail — warm tint, no coloured left stripe (that would ban a >1px accent
	   border). Active = surface + primary text. */
	:global([data-theme='default'] .ed-mf__menu) {
		background: var(--ed-canvas);
		border-right: 1px solid var(--ed-line);
	}

	:global([data-theme='default'] .ed-mf__tab) {
		color: var(--ed-soft);
		font-family: var(--ed-body);
	}

	:global([data-theme='default'] .ed-mf__tab span) {
		letter-spacing: 0.14em;
	}

	:global([data-theme='default'] .ed-mf__content) {
		background: var(--ed-surface);
	}

	/* Search-within inputs */
	:global([data-theme='default'] .ed-mf__search) {
		background: var(--ed-surface);
		border: 1px solid var(--ed-line-strong);
		border-radius: var(--ed-radius);
		color: var(--ed-ink);
		font-family: var(--ed-body);
	}

	:global([data-theme='default'] .ed-mf__search:focus) {
		border-color: hsl(var(--primary));
	}

	/* Labels + options */
	:global([data-theme='default'] .ed-mf__label) {
		font-family: var(--ed-body);
		letter-spacing: 0.18em;
		color: var(--ed-soft);
	}

	:global([data-theme='default'] .ed-mf__opt) {
		color: var(--ed-ink);
		font-family: var(--ed-body);
	}

	:global([data-theme='default'] .ed-mf__priceval) {
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
	:global([data-theme='default'] .ed-mf__track) {
		height: 3px;
		background: var(--ed-line);
	}

	:global([data-theme='default'] .ed-mf__fill) {
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

	/* Editable price bound inputs + labels, matching the desktop panel */
	:global([data-theme='default'] .ed-mf__prices input) {
		border: 1px solid var(--ed-line-strong);
		border-radius: var(--ed-radius);
		background: var(--ed-surface);
		color: var(--ed-ink);
		font-family: var(--ed-body);
	}

	:global([data-theme='default'] .ed-mf__prices input:focus) {
		border-color: hsl(var(--primary));
	}

	:global([data-theme='default'] .ed-mf__prices label) {
		font-family: var(--ed-body);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--ed-soft);
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .ed-mf__apply) {
			transition: none;
		}
	}
</style>
