<script lang="ts">
	import { page } from '$app/state'
	import DesktopFilter from '$lib/components/product-catalogue/desktop-filter.svelte'
	import MobileFilter from '$lib/components/product-catalogue/mobile-filter.svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'
	import { selectSort } from '$lib/core/utils/index.js'
	import ListingGrid from '$lib/components/product-catalogue/listing-grid.svelte'
	import ListingHeader from './listing-header.svelte'

	const data = $derived(page.data)
	let selectedSort = $state(page.url.searchParams.get('sort') ?? 'popularity:desc')
</script>

<div class="ed-plp">
	<div class="page-width hidden lg:block ed-plp__crumbs">
		<Breadcrumb categoryHierarchy={data?.products?.categoryHierarchy} />
	</div>

	<div class="page-width inter-gap flex h-full min-h-screen flex-row ed-plp__row">
		{#if Object.keys(data.products.facets || {}).length}
			<div class="hidden max-w-[25%] border-input md:block ed-plp__aside">
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

		<div class="inter-gap flex flex-1 flex-col ed-plp__main">
			<ListingHeader bind:selectedSort />
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
