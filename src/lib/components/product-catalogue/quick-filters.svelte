<script lang="ts">
	import { page } from '$app/state'
	import { ChevronDown } from '@lucide/svelte'
	import { getDesktopFilterState } from '$lib/core/composables/index.js'
	import { themeOptions } from '$lib/composer/theme-options.js'
	import { hasFacetValues } from './scope-filters.js'

	/**
	 * One chip per filter group above the grid ("Size", "Colour" …). A tap opens the filter sheet on
	 * that group. Only from 768px, and only where filters open in a drawer: below 768px the Sort and
	 * Filter bar is always on screen, and the owner asked for the row to go there ("we don't need
	 * those filters at top, because already there is a filter button at bottom", 2026-11-12); in
	 * sidebar mode the sidebar shows the groups already. The store can switch it off altogether
	 * (list_quick_filters).
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

	function open(id: string) {
		filterModule.selectedSection = id
		filterModule.showFilter = true
	}
</script>

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

	@media (prefers-reduced-motion: reduce) {
		.qf__chip:active {
			transform: none;
		}
	}
</style>
