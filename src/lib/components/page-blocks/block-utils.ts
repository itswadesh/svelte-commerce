export type BlockRecord = {
	id: string
	type: string
	columnStart: number
	columnEnd: number
	rowStart: number
	rowEnd: number
	metadata?: Record<string, any> | null
}

export function sortBlocks<T extends BlockRecord>(blocks: T[] = []) {
	return [...blocks].sort((a, b) => {
		if (a.rowStart !== b.rowStart) return a.rowStart - b.rowStart
		if (a.columnStart !== b.columnStart) return a.columnStart - b.columnStart
		return a.id.localeCompare(b.id)
	})
}

function toUnit(value: unknown, unit?: string, fallback = 'px') {
	if (value === undefined || value === null || value === '') return undefined
	const normalizedUnit = unit || fallback
	return `${value}${normalizedUnit}`
}

function spacingFromMetadata(prefix: string, metadata: Record<string, any> = {}) {
	const unit = metadata[`${prefix}Unit`] || 'px'
	const top = metadata[`${prefix}Top`]
	const right = metadata[`${prefix}Right`]
	const bottom = metadata[`${prefix}Bottom`]
	const left = metadata[`${prefix}Left`]
	const all = metadata[prefix]

	if (all !== undefined && all !== null && all !== '') return toUnit(all, unit)
	if ([top, right, bottom, left].every((value) => value === undefined || value === null || value === '')) {
		return undefined
	}
	return [top ?? 0, right ?? 0, bottom ?? 0, left ?? 0].map((value) => toUnit(value, unit) || '0px').join(' ')
}

/**
 * Returns the grid placement + sizing style for a block wrapper.
 * When `fitContent` is true the block does NOT stretch to fill the grid row —
 * it shrinks to its content height (`align-self: start`).
 * When `rowGap` is provided and fitContent is true, padding-bottom is used
 * instead of CSS grid row-gap to create spacing only between non-empty blocks.
 */
export function getBlockWrapperStyle(block: BlockRecord, rowGap = 0, isFlexParent = false) {
	const metadata = block.metadata || {}
	const fitContent = metadata.fitContent === true

	const styles: string[] = []

	// Only apply grid-column and grid-row if NOT inside a flex container
	if (!isFlexParent) {
		styles.push(`grid-column: ${block.columnStart} / ${block.columnEnd};`)
		styles.push(`grid-row: ${block.rowStart} / ${block.rowEnd};`)
		styles.push(`align-self: ${fitContent ? 'start' : (metadata.verticalAlign || 'stretch')};`)
		styles.push(`justify-self: ${metadata.horizontalAlign || 'stretch'};`)
	} else {
		// Flex container positioning
		// By default parent flex direction is column (default block container behavior)
		const isRow = metadata.flexDirection === 'row'
		const alignSelfVal = isRow ? metadata.verticalAlign : metadata.horizontalAlign
		
		if (alignSelfVal && alignSelfVal !== 'stretch') {
			styles.push(`align-self: ${alignSelfVal === 'start' ? 'flex-start' : alignSelfVal === 'end' ? 'flex-end' : alignSelfVal};`)
		} else {
			styles.push(`align-self: ${isRow ? (metadata.verticalAlign || 'auto') : (metadata.horizontalAlign || 'stretch')};`)
		}

		if (metadata.horizontalAlign === 'stretch') {
			styles.push(`width: 100%;`)
		}
	}

	const margin = spacingFromMetadata('margin', metadata)
	if (margin) styles.push(`margin: ${margin};`)

	const maxHeight = toUnit(metadata.maxHeight, metadata.maxHeightUnit)
	if (maxHeight) styles.push(`max-height: ${maxHeight};`)

	const maxWidth = toUnit(metadata.maxWidth, metadata.maxWidthUnit)
	if (maxWidth) styles.push(`max-width: ${maxWidth};`)

	const minHeight = toUnit(metadata.minHeight, metadata.minHeightUnit)
	if (minHeight) styles.push(`min-height: ${minHeight};`)

	const minWidth = toUnit(metadata.minWidth, metadata.minWidthUnit)
	if (minWidth) styles.push(`min-width: ${minWidth};`)

	return styles.join(' ')
}

export function getInnerSurfaceStyle(metadata: Record<string, any> = {}) {
	const fitContent = metadata.fitContent === true
	const styles: string[] = [
		`box-sizing: border-box;`,
		`min-width: 0;`,
	]

	// Only set height:100% when NOT in fitContent mode
	if (!fitContent) {
		styles.push(`height: 100%;`)
	}

	const padding = spacingFromMetadata('padding', metadata)
	if (padding) styles.push(`padding: ${padding};`)

	const borderRadius = toUnit(metadata.borderRadius, metadata.borderRadiusUnit)
	if (borderRadius && borderRadius !== '0px') styles.push(`border-radius: ${borderRadius};`)

	if (metadata.backgroundColor) styles.push(`background: ${metadata.backgroundColor};`)
	if (metadata.borderColor && metadata.borderWidth) {
		styles.push(`border: ${metadata.borderWidth}px solid ${metadata.borderColor};`)
	}
	if (metadata.boxShadow) styles.push(`box-shadow: ${metadata.boxShadow};`)

	return styles.join(' ')
}

export function getContainerStyle(metadata: Record<string, any> = {}, rowUnitPx?: number) {
	const isFlex = metadata.containerType === 'flex'
	const display = isFlex ? 'flex' : 'grid'
	const fitContent = metadata.fitContent === true

	const styles = [
		`display: ${display};`,
		`width: 100%;`,
		`box-sizing: border-box;`,
		`min-width: 0;`,
		`overflow: ${metadata.overflow || 'visible'};`,
	]

	if (!fitContent) {
		styles.push(`height: 100%;`)
	}

	const padding = spacingFromMetadata('padding', metadata)
	if (padding) styles.push(`padding: ${padding};`)

	const gap = toUnit(metadata.gap ?? metadata.gridGap ?? 0, metadata.gapUnit) || '0px'
	styles.push(`gap: ${gap};`)

	if (metadata.backgroundColor) styles.push(`background: ${metadata.backgroundColor};`)
	if (metadata.borderColor && metadata.borderWidth) {
		styles.push(`border: ${metadata.borderWidth}px solid ${metadata.borderColor};`)
	}
	if (metadata.borderRadius !== undefined && metadata.borderRadius !== null && metadata.borderRadius !== '') {
		styles.push(`border-radius: ${toUnit(metadata.borderRadius, metadata.borderRadiusUnit) || '0px'};`)
	}
	if (metadata.boxShadow) styles.push(`box-shadow: ${metadata.boxShadow};`)

	if (isFlex) {
		// Flex-specific
		styles.push(`flex-direction: ${metadata.flexDirection || 'column'};`)
		styles.push(`flex-wrap: ${metadata.flexWrap || 'nowrap'};`)
		styles.push(`align-items: ${metadata.alignItems || 'stretch'};`)
		styles.push(`justify-content: ${metadata.justifyContent || 'flex-start'};`)
	} else {
		// Grid-specific
		const columns = Number(metadata.columnCount || 12)
		const rows = Number(metadata.rowCount || 6)
		const rowGap = Number(metadata.rowGap ?? metadata.gap ?? 0)
		const columnGap = Number(metadata.columnGap ?? metadata.gap ?? 0)
		const trackSize = rowUnitPx ? `${rowUnitPx}px` : '80px'
		styles.push(`grid-template-columns: repeat(${columns}, minmax(0, 1fr));`)
		styles.push(`grid-template-rows: repeat(${rows}, ${trackSize});`)
		styles.push(`column-gap: ${columnGap}px;`)
		styles.push(`row-gap: ${rowGap}px;`)
		styles.push(`align-items: ${metadata.alignItems || 'stretch'};`)
		styles.push(`justify-items: ${metadata.justifyItems || 'stretch'};`)
		styles.push(`justify-content: ${metadata.justifyContent || 'stretch'};`)
		styles.push(`align-content: ${metadata.alignContent || 'stretch'};`)
	}

	return styles.join(' ')
}
