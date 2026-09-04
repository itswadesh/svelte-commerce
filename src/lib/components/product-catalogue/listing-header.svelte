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
	<!-- Title and count on one baseline, not a tracked eyebrow stacked over a display heading. The
	     two lines said one thing in two typographic voices and cost 60px of header before the first
	     product; a listing's subject and its size are a single fact and read as one line. -->
	<div class="ed-lh__group flex min-w-0 items-baseline gap-2">
		<h1 class="page-heading ed-lh__title">
			{#if page.url.searchParams.get('search')}
				Results for "{page.url.searchParams.get('search')}"
			{:else if data.products?.categoryHierarchy?.length > 0}
				{data.products.categoryHierarchy[data.products.categoryHierarchy.length - 1].name}
			{:else}
				All Products
			{/if}
		</h1>

		<span class="ed-lh__count shrink-0">
			{data.products.count > 999 ? '1000+' : data.products.count} items
		</span>
	</div>
	{#if data.products.data.length}
		<!-- `md:flex`, not `lg:flex`. The fixed Filter/Sort bar that carries sorting on a phone is
		     itself `md:hidden`, so between 768px and 1023px neither control rendered and a tablet
		     shopper could filter but never re-order. The sidebar is already visible from md, so the
		     bar stays hidden and there is exactly one sort affordance at every width. -->
		<div class="ed-lh__sort hidden items-center gap-1.5 md:flex">
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
				<Select.Trigger id="sort-by" aria-labelledby="sort-by-label sort-by" class="ed-lh__select w-[160px]">
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
	/* No margin-bottom. The header sits inside .ed-plp__main, an `inter-gap` flex column, so the
	   space above the grid was set twice — 34px here plus the column's own 20px gap = 53px at
	   1280px. The column gap is now the single rhythm for this region (see listing-page.svelte). */
	:global([data-theme='default']) .ed-lh {
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 16px;
		padding-bottom: clamp(8px, 0.9vw, 12px);
		margin-bottom: 0;
		border-bottom: 1px solid var(--ed-line);
	}

	/* One line: subject, then size. */
	:global([data-theme='default']) .ed-lh__group {
		min-width: 0;
	}

	/* 12px, the design-system floor for supporting text. Sentence case rather than a tracked
	   uppercase eyebrow — beside the title it is an aside, and tracked caps read as a second
	   heading. */
	:global([data-theme='default']) .ed-lh__count {
		font-family: var(--ed-body);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		text-transform: none;
		color: var(--ed-soft);
	}

	/* 20px on a phone, 24px at the widest, against 28-36px before. The bottom of the 20-28px
	   page-title band in UX_SYSTEM section 4, which is where that section puts a listing title: it
	   labels a grid of products rather than carrying the page's message, and at display scale it
	   was the loudest thing on a screen whose job is to show merchandise. */
	:global([data-theme='default']) .ed-lh__title {
		margin: 0;
		min-width: 0;
		font-family: var(--ed-display);
		font-weight: 500;
		font-size: clamp(1.25rem, 1.5vw, 1.5rem);
		line-height: 1.15;
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
		margin-top: 2px;
		max-width: 70ch;
		color: var(--ed-soft);
		font-size: 0.8125rem;
		line-height: 1.55;
	}

	/* Refined sort dropdown trigger. The selector used to be `.ed-lh__select button`, but
	   Select.Trigger renders the <button> ITSELF and carries this class, so nothing below ever
	   applied and the trigger kept the raw shadcn skin. 36px — the bottom of the 36-40px desktop
	   control band — because this block never renders below 768px (a phone sorts from the fixed
	   bar), so no touch target depends on it, and the header it sits in is now 36px tall itself. */
	:global([data-theme='default'] .ed-lh__select) {
		height: 36px;
		min-width: 0;
		padding: 0 10px;
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
	:global([data-theme='default'] .ed-lh__select:not(:focus-visible)) {
		box-shadow: none;
	}

	:global([data-theme='default'] .ed-lh__select:hover) {
		border-color: hsl(var(--primary));
		background: var(--ed-surface);
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .ed-lh__select) {
			transition: none;
		}
	}
</style>
