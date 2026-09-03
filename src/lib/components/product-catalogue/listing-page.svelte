<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import DesktopFilter from '$lib/components/product-catalogue/desktop-filter.svelte'
	import MobileFilter from '$lib/components/product-catalogue/mobile-filter.svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'
	import { getDesktopFilterState } from '$lib/core/composables/index.js'
	import ListingGrid from '$lib/components/product-catalogue/listing-grid.svelte'
	import ListingHeader from './listing-header.svelte'
	import { X } from '@lucide/svelte'
	import { readAppliedFilters, urlWithoutAnyFilter, urlWithoutFilter } from './scope-filters.js'

	const data = $derived(page.data)

	// The URL is the single source of truth for the sort, so every surface agrees after any
	// navigation — including a Clear all that re-orders the grid, and a Back that undoes a sort.
	const selectedSort = $derived(page.url.searchParams.get('sort') ?? 'popularity:desc')

	// Sort, filter and price changes are the shopper's deliberate refinements, and Back is the
	// universal undo for a refinement they regret. Every one of them navigated with
	// `replaceState: true` — the vendored `selectSort` util and every mutation in the vendored
	// filter composable — so the history length never grew and one Back press ejected the shopper
	// out of discovery altogether. Both are repaired at this call site rather than in the package.
	function applySort(value: string) {
		if (!value) return
		const url = new URL(page.url)
		url.searchParams.set('sort', value)
		url.searchParams.delete('page')
		goto(url, { keepFocus: true, noScroll: true })
	}

	// Every filter mutation funnels through the composable's one shared navigator, so the same
	// choke point `strip-page-on-filter.ts` uses turns them all into real history entries. A
	// navigation the composable makes with no options is its category jump — a route change that
	// must keep its own scroll and focus behaviour — so that one is passed straight through.
	const filterState = getDesktopFilterState() as any
	const filterNavigator = filterState?.navigator
	if (filterNavigator && !filterNavigator.__pushesFilterHistory) {
		const navigate = filterNavigator.goto.bind(filterNavigator)
		filterNavigator.goto = (url: URL, options?: Record<string, unknown>) =>
			options ? navigate(url, { ...options, replaceState: false, keepFocus: true, noScroll: true }) : navigate(url)
		filterNavigator.__pushesFilterHistory = true
	}

	// Read from the URL, not from the filter composable: that one files `sort`, `page` and
	// `search` as facets, so a merely sorted listing would sprout chips for filters nobody set.
	// Reading the URL also means a filter whose facet group came back empty still gets a chip, so
	// the very filter that emptied the grid can always be removed.
	const facetKeys = $derived(Object.keys(data?.products?.facets || {}))
	const appliedFilters = $derived(readAppliedFilters(page.url, facetKeys, data?.store?.currencySymbol ?? ''))
</script>

<div class="ed-plp">
	<!-- Gated on the same condition Breadcrumb itself renders under. Mounted unconditionally, the
	     wrapper's own top padding drew a 34px empty band above the title on /products and on every
	     listing whose backend sends no hierarchy. -->
	{#if data?.products?.categoryHierarchy?.length}
		<div class="page-width ed-plp__crumbs hidden lg:block">
			<Breadcrumb categoryHierarchy={data?.products?.categoryHierarchy} />
		</div>
	{/if}

	<!-- No min-h-screen. It forced the row to a full viewport height whatever the result count, so
	     a short listing (or the last page of a long one) ended in several hundred pixels of void
	     between the last card and the footer, with the filter rail's hairline running down through
	     it. The rail is sticky and scrolls on its own; nothing here needed the floor. -->
	<div class="page-width inter-gap ed-plp__row flex flex-row">
		<!-- `w-`, not `max-w-`. As a max-width on a flex item whose content carried its own
		     min-width, the rail measured 173px at 768px while the panel inside stayed 224px and spilled
		     27px over the first column of products. -->
		{#if Object.keys(data.products.facets || {}).length}
			<div class="ed-plp__aside hidden w-1/4 min-w-0 border-input md:block">
				<DesktopFilter />
			</div>
		{/if}

		<MobileFilter {selectedSort} onSortChange={applySort} />

		<div class="ed-plp__main inter-gap flex min-w-0 flex-1 flex-col">
			<ListingHeader {selectedSort} onSortChange={applySort} />

			<!-- Active filters. The row itself scrolls on a phone rather than the page, so a long
			     set of chips can never introduce horizontal overflow. -->
			{#if appliedFilters.length}
				<div class="ed-plp__chips -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 scrollbar-none" aria-label="Active filters">
					{#each appliedFilters as filter (filter.key + (filter.value ?? ''))}
						<a
							href={urlWithoutFilter(page.url, filter)}
							class="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted max-md:h-11"
						>
							<span class="max-w-[12rem] truncate">{filter.label}</span>
							<X class="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
							<span class="sr-only">Remove filter {filter.label}</span>
						</a>
					{/each}

					{#if appliedFilters.length > 1}
						<a
							href={urlWithoutAnyFilter(page.url)}
							class="inline-flex h-8 shrink-0 items-center px-2 text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground max-md:h-11"
						>
							Clear all
						</a>
					{/if}
				</div>
			{/if}

			<ListingGrid />
		</div>
	</div>
</div>

<style>
	/* ---- Refined Editorial · PLP shell (default theme only) ----
	   For every other theme the wrapper is display:contents, so it adds no
	   box and the original layout is untouched. */
	.ed-plp {
		display: contents;
	}

	:global([data-theme='default']) .ed-plp {
		display: block;
		background: var(--ed-surface);
		padding-bottom: clamp(28px, 3.5vw, 56px);
	}

	:global([data-theme='default']) .ed-plp__crumbs {
		padding-top: clamp(14px, 1.6vw, 20px);
	}

	/* Was clamp(24px, 3vw, 48px) / clamp(20px, 2.6vw, 34px): a 48px rail gutter and 34px above the
	   title, on top of the 34px the breadcrumb block already spent. 32px is the desktop gutter. */
	:global([data-theme='default']) .ed-plp__row {
		gap: clamp(20px, 2.2vw, 32px);
		padding-top: clamp(14px, 1.6vw, 20px);
	}

	/* The one rhythm for the main column — header, filter chips, grid, pagination. Every child that
	   also carried its own margin has been zeroed so this gap is the only thing setting it. */
	:global([data-theme='default']) .ed-plp__main {
		gap: 16px;
	}

	:global([data-theme='default']) .ed-plp__aside {
		border-right: 1px solid var(--ed-line);
		padding-right: clamp(14px, 1.4vw, 24px);
	}
</style>
