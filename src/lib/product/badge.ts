import type { ThemeOptions } from '$lib/composer/theme-options'

type BadgeSource = { tags?: unknown; productTags?: unknown; material?: unknown; highlights?: unknown } | null | undefined

/**
 * The label on a product's picture (the store's card_badge setting), from the product's own data
 * only: its first tag (Litekart sends a material instead), its first highlight line, or nothing.
 */
export function productBadge(product: BadgeSource, mode: ThemeOptions['card_badge']): string {
	if (mode === 'first_highlight') return Array.isArray(product?.highlights) ? String(product.highlights[0] ?? '').trim() : ''
	if (mode !== 'first_tag') return ''
	const tags = Array.isArray(product?.tags) ? product.tags : String(product?.productTags ?? '').split(',')
	const material = Array.isArray(product?.material) ? product.material[0] : undefined
	const tag = String(tags.map((t: unknown) => String(t ?? '').trim()).find(Boolean) ?? material ?? '').trim()
	// A handle such as "new-arrival" reads as words on the picture.
	return /\s/.test(tag) ? tag : tag.replace(/[-_]+/g, ' ').replace(/^./, (c) => c.toUpperCase())
}
