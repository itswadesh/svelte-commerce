import { usesSearchablePicker } from './conversion'
import { isOutOfStock } from './stock'

/**
 * Size is chosen, never assumed (Bewakoof study, 2026-11-25). The product composable picks the
 * first variant as it opens, so XS used to sit pressed on every clothing page and a quick tap on
 * Add to bag bought it. Until the shopper picks a size, the page holds that variant with its size
 * taken off (`withoutSize`): no pill is pressed, and Add to bag asks for one instead of adding.
 */

type Option = { id?: unknown; title?: string | null; type?: string | null; values?: { value: string }[] | null }
type Variant = { id?: unknown; options?: { optionId?: unknown; value?: string }[] | null; [key: string]: unknown }
type Product = { id?: unknown; options?: Option[] | null; variants?: Variant[] | null } | null | undefined

const same = (a: unknown, b: unknown) => String(a) === String(b)

/** The product page's own test for a size option (product-variation.svelte). */
export const isSizeOption = (option: Option | null | undefined): boolean => /size/i.test(option?.title ?? '') || option?.type === 'Size'

/**
 * The size a shopper has to pick: one with more than one value, drawn as pills. A single size is
 * no choice, and a list long enough for the searchable picker is left as it was.
 */
export function sizeOptionOf(product: Product): Option | null {
	const option = (product?.options ?? []).find(isSizeOption)
	const count = option?.values?.length ?? 0
	return option && count > 1 && !usesSearchablePicker(option.values) ? option : null
}

/** The size a variant names, or undefined when it names none. */
export const sizeOf = (variant: Variant | null | undefined, option: Option): string | undefined =>
	variant?.options?.find((o) => same(o.optionId, option.id))?.value

/**
 * The variant as the page holds it before a size is picked: its other choices, price and pictures,
 * without the size or anything that belongs to one size (id, title, SKU), so stock, SKU and the
 * line under the heading fall back to the product's own.
 */
export const withoutSize = <V extends Variant>(variant: V, option: Option): V => ({
	...variant,
	id: undefined,
	title: undefined,
	sku: undefined,
	barcode: undefined,
	options: (variant.options ?? []).filter((o) => !same(o.optionId, option.id))
})

/** Whether Add to bag must ask for a size first. False for a product with no size to choose. */
export function needsSize(product: Product, variant: Variant | null | undefined): boolean {
	const option = sizeOptionOf(product)
	return !!option && !sizeOf(variant, option)
}

/**
 * Each size the sheet offers, with the variant it lands on: the one that keeps every other choice
 * already made (colour, say), or else the first that can be bought. A size with no such variant is
 * left out; `soldOut` marks one that exists but cannot be bought.
 */
export function sizeChoices(product: Product, current: Variant | null | undefined): { value: string; variant: Variant; soldOut: boolean }[] {
	const option = sizeOptionOf(product)
	if (!option) return []
	const others = (current?.options ?? []).filter((o) => !same(o.optionId, option.id))
	return (option.values ?? []).flatMap(({ value }) => {
		const withValue = (product?.variants ?? []).filter((v) => sizeOf(v, option) === value)
		const keeps = withValue.filter((v) => others.every((o) => (v.options ?? []).some((x) => same(x.optionId, o.optionId) && x.value === o.value)))
		const pool = keeps.length ? keeps : withValue
		const variant = pool.find((v) => !isOutOfStock(v as never)) ?? pool[0]
		return variant ? [{ value, variant, soldOut: isOutOfStock(variant as never) }] : []
	})
}

/**
 * The record the page reads stock from: the badge under the price and the Add to bag button both
 * ask this, so they cannot disagree. A picked variant answers for itself. With no size picked yet
 * the answer comes from the sizes on offer for the other choices made (sizeChoices), not from the
 * product's total: a colour whose every size is sold out is out of stock even while another
 * colour has some, and a product with some sizes left is in stock until a sold-out size is picked.
 */
export function stockSourceOf<P extends NonNullable<Product> & Record<string, unknown>>(
	product: P | null | undefined,
	selected: Variant | null | undefined
): Record<string, unknown> | null {
	if (selected?.id) return selected
	const variants = needsSize(product, selected) ? sizeChoices(product, selected).map((c) => c.variant) : []
	if (!variants.length) return product ?? null
	const buyable = variants.filter((v) => !isOutOfStock(v as never))
	if (!buyable.length) return variants[0]
	return {
		manageInventory: buyable.every((v) => v.manageInventory !== false),
		allowBackorder: buyable.some((v) => !!v.allowBackorder),
		stock: buyable.reduce((n, v) => n + Math.max(0, Number(v.stock ?? 0)), 0)
	}
}

/** The product whose size the shopper has picked on this visit; '' until they do. */
export const sizeChoice = $state({ productId: '' })

/**
 * A bag line's size and the sizes it can change to, keeping its other choices (colour), or null
 * when the line has no size to change: one size, no size option, or a variant the product no
 * longer has.
 */
export function lineSizes(
	product: Product,
	line: { variantId?: unknown } | null | undefined
): { title: string; value: string; choices: { value: string; variant: Variant; soldOut: boolean }[] } | null {
	const option = sizeOptionOf(product)
	const current = (product?.variants ?? []).find((v) => same(v.id, line?.variantId))
	const value = option ? sizeOf(current, option) : undefined
	if (!option || !value) return null
	return { title: option.title || 'Size', value, choices: sizeChoices(product, current) }
}
