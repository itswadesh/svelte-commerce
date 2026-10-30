type Line = {
	designPreview?: string | null
	isCustomized?: boolean
	customizedImg?: string | null
	thumbnail?: string | null
	img?: string | null
	title?: string | null
	name?: string | null
}

export function linePicture(item: object | null | undefined): { src: string; alt: string; designed: boolean } {
	const line = (item ?? {}) as Line
	const title = line.title || line.name || 'Product'
	// Litekart's own customised lines carry `isCustomized` and `customizedImg`.
	const design = line.designPreview || (line.isCustomized && line.customizedImg)
	if (design) return { src: design, alt: `Your design on ${title}`, designed: true }
	return { src: line.thumbnail || line.img || '', alt: title, designed: false }
}
