<script lang="ts">
	import { page } from '$app/state'
	import * as Select from '$lib/components/ui/select/index.js'
	import { sortOptions } from '$lib/config.js'

	// A plain prop, not a binding: the current sort is derived from the URL by listing-page.svelte,
	// which also owns the navigation. Seeding it once and mutating it locally left the trigger
	// claiming the old order after Clear all re-sorted the grid.
	let { selectedSort = 'popularity:desc', onSortChange = (value: string) => {} } = $props()

	const data = $derived(page.data)

	const sortLabel = $derived(sortOptions.find((option) => option.value === selectedSort)?.name ?? 'Sort')
</script>

<!-- Ungated on purpose: this block used to be `hidden lg:flex`, which is display:none — it took the
     page's only <h1> out of the accessibility tree entirely below 1024px, so every mobile PLP
     (/products, /[slug], /categories/[slug]) shipped zero h1. Only the sort control is hidden on
     small screens now; mobile sorts from the fixed bar in mobile-filter.svelte. -->
<div class="ed-lh flex flex-wrap items-center justify-between gap-y-2">
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
			<span class="ed-lh__count text-sm tracking-widest text-foreground">
				{data.products.count > 999 ? '1000+' : data.products.count} Products
			</span>
		</div>
	</div>
	{#if data.products.data.length}
		<!-- `md:flex`, not `lg:flex`. The fixed Filter/Sort bar that carries sorting on a phone is
		     itself `md:hidden`, so between 768px and 1023px neither control rendered and a tablet
		     shopper could filter but never re-order. The sidebar is already visible from md, so the
		     bar stays hidden and there is exactly one sort affordance at every width. -->
		<div class="ed-lh__sort hidden items-center gap-2 md:flex">
			<span id="sort-by-label" class="ed-lh__sortlabel text-xs font-semibold uppercase tracking-widest text-muted-foreground">Sort by</span>
			<!-- The shadcn/bits-ui select, not the project's custom combobox. That one opens a popover
			     whose command list has no focusable input when search is off, so nothing consumed the
			     arrow keys, Enter was swallowed, and only Escape closed it: a keyboard or switch user
			     could not sort a listing at all. This primitive ships roving focus, type-ahead, Enter
			     and Escape, and it had zero call sites before now. -->
			<Select.Root
				type="single"
				value={selectedSort}
				onValueChange={(value: string) => {
					if (!value) return
					onSortChange(value)
				}}
			>
				<Select.Trigger id="sort-by" aria-labelledby="sort-by-label sort-by" class="ed-lh__select w-[200px]">
					{sortLabel}
				</Select.Trigger>
				<Select.Content>
					{#each sortOptions as option}
						<Select.Item value={option.value} label={option.name}>{option.name}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
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
		transition: border-color 0.2s ease;
	}

	/* The global focus ring in app.css is a Tailwind `ring`, which compiles to a box-shadow. A
	   blanket `box-shadow: none` on this trigger erased it, so the one control a keyboard shopper
	   most needs to find drew nothing on Tab. Flatten the resting state only. */
	:global([data-theme='default'] .ed-lh__select button:not(:focus-visible)) {
		box-shadow: none;
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
