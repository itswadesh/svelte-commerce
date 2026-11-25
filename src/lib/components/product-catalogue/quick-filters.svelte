<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { Check, ChevronDown } from '@lucide/svelte'
	import { getDesktopFilterState } from '$lib/core/composables/index.js'
	import { themeOptions } from '$lib/composer/theme-options.js'
	import { hasFacetValues } from './scope-filters.js'
	import { NEWEST_SORT, newestHref, phoneChips } from './quick-chips'

	/**
	 * One chip per filter group above the grid ("Size", "Colour" …). A tap opens the filter sheet on
	 * that group. Only from 768px, and only where filters open in a drawer: below 768px the Sort and
	 * Filter bar is always on screen, and the owner asked for the row to go there ("we don't need
	 * those filters at top, because already there is a filter button at bottom", 2026-11-12); in
	 * sidebar mode the sidebar shows the groups already. The store can switch it off altogether
	 * (list_quick_filters).
	 *
	 * Phones get three one-tap shortcuts instead (owner, 2026-11-25, from the Bewakoof study): Size
	 * and Colour open the sheet on their group, and New sorts the newest first. A chip the listing
	 * has nothing for is not drawn. New sits on the desktop row too.
	 */
	const filterModule = getDesktopFilterState() as any
	const options = $derived(themeOptions(page.data?.themeSettings))

	const priceFilterSupported = $derived(
		Number.isFinite(filterModule.minPossiblePrice) && Number.isFinite(filterModule.maxPossiblePrice) && filterModule.maxPossiblePrice > filterModule.minPossiblePrice
	)
	const groups = $derived<{ id: string; label: string }[]>(
		options.list_quick_filters && hasFacetValues(page.data?.products?.facets)
			? (filterModule.menuItems ?? []).filter((item: { id: string }) => item.id !== 'price' || priceFilterSupported)
			: []
	)

	const productCount = $derived(Number(page.data?.products?.count) || 0)
	const chips = $derived(options.list_quick_filters ? phoneChips(groups, productCount) : [])
	const newest = $derived(page.url.searchParams.get('sort') === NEWEST_SORT)
	const showNew = $derived(chips.some((c) => c.kind === 'new'))

	function toggleNewest() {
		goto(newestHref(page.url), { keepFocus: true, noScroll: true })
	}

	function open(id: string) {
		filterModule.selectedSection = id
		filterModule.showFilter = true
	}
</script>

{#snippet newChip()}
	<button
		type="button"
		class="qf__chip inline-flex h-11 shrink-0 items-center gap-1 rounded-md border px-3 text-[length:var(--type-ui,0.875rem)] font-medium text-foreground md:h-8 {newest
			? 'border-foreground bg-muted'
			: 'border-border-strong bg-background'}"
		aria-pressed={newest}
		data-testid="quick-new"
		onclick={toggleNewest}
	>
		{#if newest}<Check class="qf__tick size-4" aria-hidden="true" />{/if}
		New
	</button>
{/snippet}

{#if chips.length}
	<div class="qf -mx-1 flex gap-2 overflow-x-auto px-1 scrollbar-none md:hidden" role="group" aria-label="Quick filters" data-testid="quick-chips">
		{#each chips as chip (chip.kind === 'group' ? chip.id : 'new')}
			{#if chip.kind === 'group'}
				{@const count = filterModule.appliedFiltersCountByKey?.[chip.id] ?? 0}
				<button
					type="button"
					class="qf__chip inline-flex h-11 shrink-0 items-center gap-1 rounded-md border px-3 text-[length:var(--type-ui,0.875rem)] font-medium text-foreground {count
						? 'border-foreground bg-muted'
						: 'border-border-strong bg-background'}"
					aria-haspopup="dialog"
					onclick={() => open(chip.id)}
				>
					{chip.name}
					{#if count}
						<span class="tabular-nums">({count})</span>
					{/if}
					<ChevronDown class="size-4 text-muted-foreground" aria-hidden="true" />
				</button>
			{:else}
				{@render newChip()}
			{/if}
		{/each}
	</div>
{/if}

{#if groups.length && options.list_filters_desktop !== 'sidebar'}
	<div class="qf -mx-1 flex gap-2 overflow-x-auto px-1 scrollbar-none max-md:hidden" role="group" aria-label="Filter by">
		{#each groups as group (group.id)}
			{@const count = filterModule.appliedFiltersCountByKey?.[group.id] ?? 0}
			<button
				type="button"
				class="qf__chip inline-flex h-11 shrink-0 items-center gap-1 rounded-md border px-3 text-[length:var(--type-ui,0.875rem)] font-medium text-foreground md:h-8 {count
					? 'border-foreground bg-muted'
					: 'border-border-strong bg-background'}"
				aria-haspopup="dialog"
				onclick={() => open(group.id)}
			>
				{String(filterModule.formatFilterName(group.label)).replace(/^./, (c) => c.toUpperCase())}
				{#if count}
					<span class="tabular-nums">({count})</span>
				{/if}
				<ChevronDown class="size-4 text-muted-foreground" aria-hidden="true" />
			</button>
		{/each}
		{#if showNew}{@render newChip()}{/if}
	</div>
{/if}

<style>
	.qf__chip {
		transition:
			background-color var(--motion-fast) var(--motion-ease),
			border-color var(--motion-fast) var(--motion-ease),
			transform var(--motion-fast) var(--motion-ease);
	}

	.qf__chip:hover {
		border-color: hsl(var(--foreground));
	}

	.qf__chip:active {
		transform: scale(0.97);
	}

	:global(.qf__tick) {
		animation: qf-tick var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	@keyframes qf-tick {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.qf__chip:active {
			transform: none;
		}
		:global(.qf__tick) {
			animation-name: qf-tick-fade;
		}
		@keyframes qf-tick-fade {
			from {
				opacity: 0;
			}
		}
	}
</style>
