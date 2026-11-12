<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js'
	import * as Sheet from '$lib/components/ui/sheet/index.js'
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js'
	import { GetColorName } from 'hex-color-to-color-name'
	import { ArrowDownNarrowWide, Check, ChevronRight, Filter, SearchIcon } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import Label from '$lib/components/ui/label/label.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { getDesktopFilterState } from '$lib/core/composables/index.js'
	import { cn } from '$lib/core/utils/index.js'
	import { sortOptions } from '$lib/config.js'
	import { page } from '$app/state'
	import { categoryIndent, categoryParent, facetKeys, hasFacetValues, readAppliedFilters } from './scope-filters.js'
	import { formatPrice } from '$lib/utils/price'

	// A plain prop, not a binding: listing-page.svelte derives the current sort from the URL and
	// owns the navigation, so this sheet can never drift out of step with the grid it sorts.
	// `fixed`: the sticky Sort | Filter bar along the bottom (the store's list_mobile_bar). Off, the
	// same two controls sit in the page above the grid.
	let { selectedSort = 'popularity:desc', onSortChange = (value: string) => {}, fixed = true } = $props()

	// The sheet also opens from the quick filter chips and the desktop Filters button, so focus goes
	// back to whichever control opened it, not only to this bar's own trigger.
	let opener: HTMLElement | null = null

	const filterModule = getDesktopFilterState()

	// The search term is what the filters run against, not one of them, so it is not summarised on
	// the Filter button. It has its own removable chip above the grid.
	const currency = $derived(page.data?.store?.currency?.code)
	const barFilters = $derived(
		readAppliedFilters(page.url, facetKeys(page.data?.products?.facets), (amount) => formatPrice(amount, currency)).filter(
			(f) => f.key !== 'search'
		)
	)
	// An applied filter keeps the sheet reachable even when its group came back empty.
	const showFilter = $derived(hasFacetValues(page.data?.products?.facets) || barFilters.length > 0)

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
	class="ed-mf__bar grid h-14 w-full {showFilter ? 'grid-cols-2' : 'grid-cols-1'} {fixed
		? 'fixed bottom-0 left-0 right-0 z-sticky border-t pb-[env(safe-area-inset-bottom,0px)] shadow-z-2'
		: 'is-inline rounded-md border'} bg-background md:hidden"
>
	<!-- Sort by -->
	<div class="flex items-center justify-center" class:border-r={showFilter}>
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
					<span class="font-semibold">Sort</span>
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
	{#if showFilter}
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
			<Sheet.Content
				side="left"
				class="ed-mf__panel flex w-full max-w-none flex-col gap-0 p-0 sm:max-w-md"
				onOpenAutoFocus={() => (opener = document.activeElement as HTMLElement | null)}
				onCloseAutoFocus={(e: Event) => {
					if (opener?.isConnected && opener.offsetParent !== null) {
						e.preventDefault()
						opener.focus()
					}
				}}
			>
				<!-- Title, then Clear all beside it while anything is applied; the sheet's own close
				     control sits at the far end. -->
				<Sheet.Header class="ed-mf__phead flex h-14 shrink-0 flex-row items-center gap-2 space-y-0 border-b pl-4 pr-14 text-left">
					<Sheet.Title class="ed-mf__ptitle flex-1 text-base font-semibold">Filters</Sheet.Title>
					<Sheet.Description class="sr-only">Narrow the product list by category, price and product attributes.</Sheet.Description>
					{#if filterModule.anyFilterApplied}
						<button type="button" class="ed-mf__clear" onclick={filterModule.clearFilters}>Clear all</button>
					{/if}
				</Sheet.Header>

				<div class="flex min-h-0 flex-1">
					<!-- Section tabs. The chosen one takes the content pane's colour and runs into it, so
					     it reads as the page it opened rather than as a boxed button; a count says how
					     many of its values are on. -->
					<div class="ed-mf__menu w-[36%] max-w-44 shrink-0 overflow-y-auto">
						{#each menuItems as item}
							{@const count = filterModule.appliedFiltersCountByKey[item.id]}
							<button
								type="button"
								class="ed-mf__tab"
								class:is-on={filterModule.selectedSection === item.id}
								aria-current={filterModule.selectedSection === item.id ? 'true' : undefined}
								onclick={() => (filterModule.selectedSection = item.id)}
							>
								<span class="min-w-0 break-words">
									{String(filterModule.formatFilterName(item.label)).replace(/^./, (c) => c.toUpperCase())}
								</span>
								{#if count}
									<span class="ed-mf__count"><span class="sr-only">, </span>{count}<span class="sr-only"> selected</span></span>
								{/if}
							</button>
						{/each}
					</div>

					<!-- Dynamic content, based on the selected section -->
					<div class="ed-mf__content min-w-0 flex-1 overflow-y-auto bg-background p-4">
						{#if filterModule.selectedSection === 'discount'}
							<div class="space-y-5">
								<div class="relative">
									<SearchIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<input
										type="text"
										placeholder="Search discounts"
										aria-label="Search discounts"
										class="ed-mf__search h-11 w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
										bind:value={filterModule.searchQuery}
									/>
								</div>

								<div class="space-y-1">
									{#each filterModule.discountOptions as option}
										<label class="group flex min-h-12 cursor-pointer items-center gap-3">
											<span class="relative flex items-center justify-center">
												<input
													type="radio"
													name="discount"
													value={option.value}
													bind:group={filterModule.selectedDiscount}
													class="peer h-5 w-5 appearance-none rounded-full border-2 border-input transition-colors checked:border-primary"
												/>
												<span class="absolute h-2.5 w-2.5 rounded-full bg-primary-ink opacity-0 transition-opacity peer-checked:opacity-100"></span>
											</span>
											<span class="ed-mf__opt text-sm text-foreground" class:is-on={filterModule.selectedDiscount === option.value}>
												{option.label}
											</span>
										</label>
									{/each}
								</div>
							</div>
						{:else if filterModule.selectedSection === 'category'}
							<div class="relative mb-2">
								<SearchIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search categories"
									aria-label="Search categories"
									class="ed-mf__search h-11 w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
									bind:value={filterModule.categorySearchQuery}
								/>
							</div>
							{#if filterModule.filteredCategories?.length > 0}
								<!-- A category opens its own listing, so each row is a plain full-width button
								     with a chevron, a group's name in bold over its indented children, and a tick
								     on the one being browsed. These were shadcn Buttons, whose 1px border the
								     list's dividers painted on all four sides, boxing every child row. -->
								<ul class="ed-mf__cats">
									{#each filterModule.filteredCategories as category, i}
										{@const formattedCategoryName = filterModule.formatFilterOptionName(category.name)}
										{@const parent = categoryParent(filterModule.filteredCategories, i, filterModule.categorySearchQuery)}
										{@const label = parent ? `${formattedCategoryName}, in ${filterModule.formatFilterOptionName(parent)}` : formattedCategoryName}
										{@const current = !!category.slug && page.url.pathname === `/${category.slug}`}
										<li>
											<button
												type="button"
												title={label}
												aria-label={parent ? label : undefined}
												aria-current={current ? 'page' : undefined}
												class={cn('ed-mf__cat', categoryIndent(category.depth, filterModule.categorySearchQuery, 'sheet'))}
												class:is-group={!parent}
												class:is-current={current}
												onclick={() => filterModule.handleCategoryClick({ slug: category.slug, name: category.name })}
											>
												{#if category.thumbnail}
													<img src={category.thumbnail} alt="" class="size-9 shrink-0 rounded object-cover" />
												{/if}
												<span class="ed-mf__cat-name">{formatCategoryName(category.name)}</span>
												{#if current}
													<Check aria-hidden="true" />
												{:else}
													<ChevronRight aria-hidden="true" />
												{/if}
											</button>
										</li>
									{/each}
								</ul>
							{:else}
								<div class="flex h-40 items-center justify-center">
									<p class="text-sm font-medium text-muted-foreground">No categories found</p>
								</div>
							{/if}
						{:else if filterModule.selectedSection === 'price'}
							<div class="w-full">
								<!-- The range chosen so far, beside its label, where the eye starts. -->
								<div class="flex items-baseline justify-between gap-3">
									<p class="ed-mf__label text-sm font-semibold text-foreground">Price range</p>
									<p class="ed-mf__priceval text-sm font-semibold tabular-nums text-foreground" aria-live="polite">
										{#if filterModule.minPrice >= 0 && filterModule.maxPrice >= 0}
											{formatPrice(filterModule.minPrice, currency)} – {formatPrice(filterModule.maxPrice, currency)}
										{/if}
									</p>
								</div>

								<!-- h-5: every child of this wrapper is absolutely positioned, so without it the
								     wrapper is a zero-height box whose margin collapses through. The 44px input hit
								     area still overhangs it. -->
								<div class="ed-mf__slider relative mx-2 mt-6 h-5">
									<div class="ed-mf__track absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-muted">
										<div
											class="ed-mf__fill absolute h-1 bg-primary-ink"
											style="left: {filterModule.priceSliderLeftPercentage}%; right: {filterModule.priceSliderRightPercentage}%"
										></div>
									</div>

									<!-- One accessible name each: two unnamed sliders on one track are
									     indistinguishable to a screen reader. -->
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

								<!-- Exact bounds: dragging two overlapping thumbs is no way to set a budget on a phone. -->
								<div class="ed-mf__prices mt-6 grid grid-cols-2 gap-3">
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
							</div>
						{:else if filterModule.selectedSection === 'tags'}
							{#if filterModule.tags.length > 0}
								<div class="ed-mf__checks">
									{#each filterModule.tags as tag}
										{@const on = !!filterModule.selectedTags?.find?.((t: any) => t?.name === tag?.name)}
										<div class="flex min-h-12 flex-row items-center gap-3">
											<Checkbox
												id={`m-tags-${tag.slug || tag.name}`}
												checked={on}
												onCheckedChange={(checked) => {
													filterModule.handleTagChange({ tag, checked })
												}}
											/>
											<label
												for={`m-tags-${tag.slug || tag.name}`}
												class="ed-mf__opt flex min-h-12 flex-1 cursor-pointer items-center text-sm capitalize text-foreground"
												class:is-on={on}>{tag.name}</label
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
							<div class="ed-mf__checks">
								{#each valuesToShow as value}
									{@const on = !!filterModule.selectedGeneralFilters[filterModule.selectedSection]?.includes(value)}
									<!-- The id carries the group key. Built from the value alone, the same value under
									     two facets (Black under colour and under trim colour) emitted duplicate ids,
									     so tapping one label ticked the other group's box. -->
									<div class="flex min-h-12 items-center gap-3">
										<Checkbox
											id={`m-${filterModule.selectedSection}-${value}`}
											checked={on}
											onCheckedChange={(checked) =>
												filterModule.handleGeneralFiltersChange({
													key: filterModule.selectedSection,
													value,
													checked
												})}
										/>
										<label
											for={`m-${filterModule.selectedSection}-${value}`}
											class="ed-mf__opt flex min-h-12 flex-1 cursor-pointer items-center text-sm capitalize text-foreground"
											class:is-on={on}
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

				<!-- Apply where a thumb already rests, full width; Clear all moved up beside the title. -->
				<div class="ed-mf__foot shrink-0 border-t bg-background px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
					<Button class="ed-mf__apply h-12 w-full text-sm font-semibold" onclick={filterModule.handleApply}>Apply</Button>
				</div>
			</Sheet.Content>
		</Sheet.Root>
	{/if}
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
		:global(.ed-plp__row.has-mobile-bar) {
			padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
		}
	}

	/* Fixed bottom Sort / Filter bar. 48px, not 56px: both halves are full-height so each is
	   still a 48px touch target, comfortably past the 44px minimum, and the bar overlays the
	   product grid on every listing — eight pixels back is eight pixels of merchandise. */
	:global([data-theme='default'] .ed-mf__bar) {
		height: 48px;
		background: var(--ed-surface);
		font-family: var(--ed-body);
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .ed-mf__bar:not(.is-inline)) {
		border-top: 1px solid var(--ed-line);
		box-shadow: 0 -1px 12px rgba(27, 26, 23, 0.06);
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
		color: var(--ed-ink);
	}

	/* Apply / Done — editorial primary fill */
	:global([data-theme='default'] .ed-mf__apply) {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		border-radius: var(--ed-radius);
	}

	:global([data-theme='default'] .ed-mf__apply:hover) {
		background: var(--ed-ink);
		color: var(--ed-canvas);
	}

	/* Section tab rail — warm tint, no coloured left stripe (that would ban a >1px accent
	   border). Active = surface + ink, joined to the content pane. */
	:global([data-theme='default'] .ed-mf__menu) {
		--mf-line: var(--ed-line);
		background-color: var(--ed-canvas);
	}

	:global([data-theme='default'] .ed-mf__tab) {
		color: var(--ed-soft);
		font-family: var(--ed-body);
	}

	:global([data-theme='default'] .ed-mf__tab.is-on) {
		background: var(--ed-surface);
		color: var(--ed-ink);
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
		border-color: hsl(var(--primary-ink));
	}

	/* Labels + options */
	:global([data-theme='default'] .ed-mf__label) {
		font-family: var(--ed-body);
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
		background: hsl(var(--primary-ink));
	}

	:global([data-theme='default'] .ed-mf__slider input[type='range']::-webkit-slider-thumb) {
		border: 1px solid hsl(var(--primary-ink));
		background: var(--ed-surface);
		box-shadow: 0 1px 4px rgba(27, 26, 23, 0.22);
	}

	:global([data-theme='default'] .ed-mf__slider input[type='range']::-moz-range-thumb) {
		border: 1px solid hsl(var(--primary-ink));
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
		border-color: hsl(var(--primary-ink));
	}

	:global([data-theme='default'] .ed-mf__prices label) {
		font-family: var(--ed-body);
		font-size: var(--type-label);
		font-weight: 500;
		color: var(--ed-soft);
	}

	/* ---- The filter sheet, every theme ---- */

	/* The rail's divider is painted on its background, not as a border, so the chosen tab's own
	   fill covers it and the tab runs into the content pane. */
	:global(.ed-mf__menu) {
		background-color: hsl(var(--muted));
		background-image: linear-gradient(var(--mf-line, hsl(var(--border))), var(--mf-line, hsl(var(--border))));
		background-position: right top;
		background-size: 1px 100%;
		background-repeat: no-repeat;
	}

	:global(.ed-mf__tab) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		width: 100%;
		min-height: 52px;
		padding: 12px 12px 12px 16px;
		text-align: left;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.3;
		color: hsl(var(--muted-foreground));
		transition:
			background-color var(--motion-fast, 150ms) var(--motion-ease, ease),
			color var(--motion-fast, 150ms) var(--motion-ease, ease);
	}

	:global(.ed-mf__tab.is-on) {
		background: hsl(var(--background));
		color: hsl(var(--foreground));
		font-weight: 600;
	}

	:global(.ed-mf__tab:not(.is-on):active) {
		background: hsl(var(--foreground) / 0.06);
	}

	/* How many of a group's values are on: ink disc, page-colour number. */
	:global(.ed-mf__count) {
		display: inline-grid;
		place-items: center;
		flex-shrink: 0;
		min-width: 20px;
		height: 20px;
		padding: 0 6px;
		border-radius: 999px;
		background: hsl(var(--foreground));
		color: hsl(var(--background));
		font-size: 0.6875rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		animation: ed-mf-count-in var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	@keyframes ed-mf-count-in {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
	}

	:global(.ed-mf__clear) {
		min-height: 44px;
		padding: 0 8px;
		font-size: 0.875rem;
		font-weight: 600;
		color: hsl(var(--foreground));
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: opacity var(--motion-fast, 150ms) var(--motion-ease, ease);
	}

	:global(.ed-mf__clear:active) {
		opacity: 0.6;
	}

	/* The sheet's own close control: a round ghost button in the header's row, not a grey square. */
	:global(.ed-mf__panel > [data-dialog-close][data-state]) {
		top: 6px;
		right: 6px;
		border-radius: 999px;
		background: transparent;
		opacity: 1;
		color: hsl(var(--foreground));
		transition: background-color var(--motion-fast, 150ms) var(--motion-ease, ease);
	}

	:global(.ed-mf__panel > [data-dialog-close][data-state] svg) {
		width: 20px;
		height: 20px;
	}

	:global(.ed-mf__panel > [data-dialog-close][data-state]:active) {
		background: hsl(var(--foreground) / 0.08);
	}

	:global(.ed-mf__cats) {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Leading padding comes from categoryIndent's utilities, so only the other sides are set. */
	:global(.ed-mf__cat) {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		min-height: 48px;
		padding-block: 8px;
		padding-inline-end: 4px;
		border-radius: var(--radius);
		text-align: left;
		font-size: 0.875rem;
		line-height: 1.35;
		color: hsl(var(--foreground));
		transition: background-color var(--motion-fast, 150ms) var(--motion-ease, ease);
	}

	:global(.ed-mf__cat:active) {
		background: hsl(var(--foreground) / 0.06);
	}

	:global(.ed-mf__cats li + li .ed-mf__cat.is-group) {
		margin-top: 8px;
	}

	:global(.ed-mf__cat.is-group),
	:global(.ed-mf__cat.is-current) {
		font-weight: 600;
	}

	:global(.ed-mf__cat-name) {
		flex: 1;
		min-width: 0;
		text-transform: capitalize;
	}

	:global(.ed-mf__cat svg) {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
		color: hsl(var(--muted-foreground));
	}

	:global(.ed-mf__cat.is-current svg) {
		color: hsl(var(--foreground));
	}

	:global(.ed-mf__opt.is-on) {
		font-weight: 600;
	}

	@media (hover: hover) {
		:global(.ed-mf__tab:not(.is-on):hover),
		:global(.ed-mf__cat:hover),
		:global(.ed-mf__panel > [data-dialog-close][data-state]:hover) {
			background: hsl(var(--foreground) / 0.05);
		}

		:global(.ed-mf__clear:hover) {
			opacity: 0.7;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.ed-mf__count) {
			animation: none;
		}
	}
</style>
