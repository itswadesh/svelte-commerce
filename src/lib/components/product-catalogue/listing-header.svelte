<script lang="ts">
	import { page } from '$app/state'
	import Select from '$lib/components/form/select.svelte'
	import { sortOptions } from '$lib/config.js'
	import { selectSort } from '$lib/core/utils/index.js'

	const { selectedSort = $bindable() } = $props()

	const data = $derived(page.data)
</script>

<div class="ed-lh hidden items-center justify-between lg:flex">
	<div class="ed-lh__group intra-gap flex items-center">
		<h1 class="page-heading ed-lh__title">
			{#if page.url.searchParams.get('search')}
				Search Results: "{page.url.searchParams.get('search')}"
			{:else if data.products?.categoryHierarchy?.length > 0}
				{data.products.categoryHierarchy[data.products.categoryHierarchy.length - 1].name}
			{:else}
				All Products
			{/if}
		</h1>

		<div class="flex flex-col">
			<span class="ed-lh__count text-sm tracking-widest text-gray-900 dark:text-gray-200">
				{data.products.count > 999 ? '1000+' : data.products.count} Products
			</span>
		</div>
	</div>
	{#if data.products.data.length}
		<div class="ed-lh__sort flex items-center gap-2">
			<span class="ed-lh__sortlabel text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort by</span>
			<Select class="!mb-0 ed-lh__select" id="sort-by" value={selectedSort} data={sortOptions} optionSelected={(value: string) => selectSort(value)} />
		</div>
	{/if}

	<!-- Category Description -->
	{#if data?.products?.category?.description}
		<div class="ed-lh__desc mt-4" style="white-space: pre-line">
			{@html data?.products?.category?.description}
		</div>
	{/if}
</div>

<style>
	/* ---- Refined Editorial · listing header (default theme only) ----
	   Other themes keep the original markup + Tailwind classes untouched;
	   every rule below is gated to [data-theme='default']. */
	:global([data-theme='default']) .ed-lh {
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 20px 32px;
		padding-bottom: clamp(16px, 2vw, 22px);
		margin-bottom: clamp(20px, 2.6vw, 34px);
		border-bottom: 1px solid var(--ed-line);
	}

	/* Count reads as an uppercase eyebrow ABOVE the Bodoni title */
	:global([data-theme='default']) .ed-lh__group {
		flex-direction: column-reverse;
		align-items: flex-start;
		gap: 8px;
	}

	:global([data-theme='default']) .ed-lh__count {
		font-family: var(--ed-body);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ed-soft);
	}

	:global([data-theme='default']) .ed-lh__title {
		margin: 0;
		font-family: var(--ed-display);
		font-weight: 500;
		font-size: clamp(1.9rem, 3.4vw, 3rem);
		line-height: 1.04;
		letter-spacing: -0.01em;
		color: var(--ed-ink);
	}

	:global([data-theme='default']) .ed-lh__sortlabel {
		color: var(--ed-soft);
		letter-spacing: 0.18em;
	}

	:global([data-theme='default']) .ed-lh__desc {
		flex-basis: 100%;
		order: 9;
		margin-top: 4px;
		max-width: 70ch;
		color: var(--ed-soft);
		font-size: 0.9rem;
		line-height: 1.7;
	}

	/* Refined sort dropdown trigger (shadcn Button rendered inside Select) */
	:global([data-theme='default'] .ed-lh__select button) {
		height: 44px;
		min-width: 200px;
		padding: 0 14px;
		border: 1px solid var(--ed-line-strong);
		border-radius: var(--ed-radius);
		background: var(--ed-surface);
		color: var(--ed-ink);
		font-family: var(--ed-body);
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		box-shadow: none;
		transition: border-color 0.2s ease;
	}

	:global([data-theme='default'] .ed-lh__select button:hover) {
		border-color: hsl(var(--primary));
		background: var(--ed-surface);
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .ed-lh__select button) {
			transition: none;
		}
	}
</style>
