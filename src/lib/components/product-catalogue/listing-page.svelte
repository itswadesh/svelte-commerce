<script lang="ts">
	import { page } from '$app/state'
	import DesktopFilter from '$lib/components/product-catalogue/desktop-filter.svelte'
	import MobileFilter from '$lib/components/product-catalogue/mobile-filter.svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'
	import { selectSort } from '$lib/core/utils/index.js'
	import ListingGrid from '$lib/components/product-catalogue/listing-grid.svelte'
	import ListingHeader from './listing-header.svelte'
	import { X } from '@lucide/svelte'
	import { readAppliedFilters, urlWithoutAnyFilter, urlWithoutFilter } from './scope-filters.js'

	const data = $derived(page.data)
	let selectedSort = $state(page.url.searchParams.get('sort') ?? 'popularity:desc')

	// Read from the URL, not from the filter composable: that one files `sort`, `page` and
	// `search` as facets, so a merely sorted listing would sprout chips for filters nobody set.
	// Reading the URL also means a filter whose facet group came back empty still gets a chip, so
	// the very filter that emptied the grid can always be removed.
	const facetKeys = $derived(Object.keys(data?.products?.facets || {}))
	const appliedFilters = $derived(readAppliedFilters(page.url, facetKeys, data?.store?.currencySymbol ?? ''))
</script>

<div class="ed-plp">
	<div class="page-width ed-plp__crumbs hidden lg:block">
		<Breadcrumb categoryHierarchy={data?.products?.categoryHierarchy} />
	</div>

	<div class="page-width inter-gap ed-plp__row flex h-full min-h-screen flex-row">
		{#if Object.keys(data.products.facets || {}).length}
			<div class="ed-plp__aside hidden max-w-[25%] border-input md:block">
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

		<div class="ed-plp__main inter-gap flex min-w-0 flex-1 flex-col">
			<ListingHeader bind:selectedSort />

			<!-- Active filters. The row itself scrolls on a phone rather than the page, so a long
			     set of chips can never introduce horizontal overflow. -->
			{#if appliedFilters.length}
				<div class="ed-plp__chips -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 scrollbar-none" aria-label="Active filters">
					{#each appliedFilters as filter (filter.key + (filter.value ?? ''))}
						<a
							href={urlWithoutFilter(page.url, filter)}
							data-sveltekit-replacestate
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
							data-sveltekit-replacestate
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
		padding-bottom: clamp(48px, 8vw, 100px);
	}

	:global([data-theme='default']) .ed-plp__crumbs {
		padding-top: clamp(20px, 3vw, 34px);
	}

	:global([data-theme='default']) .ed-plp__row {
		gap: clamp(24px, 3vw, 48px);
		padding-top: clamp(20px, 2.6vw, 34px);
	}

	:global([data-theme='default']) .ed-plp__aside {
		border-right: 1px solid var(--ed-line);
		padding-right: clamp(16px, 1.8vw, 30px);
	}
</style>
