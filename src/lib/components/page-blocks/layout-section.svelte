<script lang="ts">
	import { browser } from '$app/environment'
	import { onMount } from 'svelte'
	import BlockNode from './block-node.svelte'
	import { sortBlocks } from './block-utils'

	let {
		layout
	}: {
		layout: any
	} = $props()

	let container: HTMLElement | null = null
	let rowUnitPx = $state(0)

	function updateRowUnit() {
		if (!container) return
		const columnCount = Number(layout?.columnCount || 1)
		const columnGap = Number(layout?.columnGap || 0)
		const width = container.clientWidth
		const usableWidth = Math.max(width - Math.max(columnCount - 1, 0) * columnGap, 0)
		rowUnitPx = usableWidth / columnCount
	}

	onMount(() => {
		if (!browser || !container) return
		updateRowUnit()
		const observer = new ResizeObserver(() => updateRowUnit())
		observer.observe(container)
		window.addEventListener('resize', updateRowUnit)
		return () => {
			observer.disconnect()
			window.removeEventListener('resize', updateRowUnit)
		}
	})

	const sortedBlocks = $derived(sortBlocks(layout?.blocks || []))

	// Only render blocks that have an actual type (skip EMPTY slots)
	const visibleBlocks = $derived(sortedBlocks.filter((b: any) => b.type && b.type !== 'EMPTY'))

	// fitContent = rows size to content, not a fixed square-unit minimum
	const isFitContent = $derived(layout?.metadata?.fitContent === true)

	// Row gap value (passed to BlockNode so it can propagate to nested containers)
	const rowGap = $derived(Number(layout?.rowGap ?? 0))
	const columnGap = $derived(Number(layout?.columnGap ?? 0))
	const rowCount = $derived(Number(layout?.rowCount ?? 1))
	const columnCount = $derived(Number(layout?.columnCount ?? 1))

	// Row track sizing:
	// - Standard layouts: fixed square unit with auto expansion (preserves aspect ratios)
	// - fitContent layouts: pure auto — each row collapses to exactly its content height
	const rowSizing = $derived(
		isFitContent
			? 'auto'
			: `minmax(${rowUnitPx ? Math.round(rowUnitPx) : 80}px, auto)`
	)

	const gridStyle = $derived(
		`grid-template-columns: repeat(${columnCount}, minmax(0, 1fr)); ` +
		`grid-template-rows: repeat(${rowCount}, ${rowSizing}); ` +
		`column-gap: ${columnGap}px; ` +
		// For fitContent layouts use 0 row-gap: empty blocks are display:none'd so
		// their gaps would otherwise leave orphaned whitespace. Each non-empty block
		// manages its own vertical separation via padding/margin from the component.
		`row-gap: ${isFitContent ? 0 : rowGap}px;`
	)
</script>

{#if visibleBlocks.length > 0}
<section
	bind:this={container}
	class={`${layout?.metadata?.isFullScreen ? 'px-3' : 'page-width'} layout-grid ${layout.type}`}
	style={gridStyle}
>
	{#each visibleBlocks as block (block.id)}
		<BlockNode
			{block}
			{rowUnitPx}
			layoutFitContent={isFitContent}
			{rowGap}
		/>
	{/each}
</section>
{/if}

<style>
	.layout-grid {
		display: none;
		width: 100%;
	}

	@media screen and (max-width: 600px) {
		.layout-grid.MOBILE {
			display: grid;
		}
	}

	@media screen and (min-width: 601px) and (max-width: 1024px) {
		.layout-grid.TABLET {
			display: grid;
		}
	}

	@media screen and (min-width: 1025px) and (max-width: 1920px) {
		.layout-grid.LAPTOP {
			display: grid;
		}
	}

	@media screen and (min-width: 1921px) {
		.layout-grid.DESKTOP {
			display: grid;
		}
	}
</style>
