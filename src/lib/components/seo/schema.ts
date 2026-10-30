import { isBackorder, isOutOfStock } from '$lib/product/stock'

/**
 * Helpers shared by the app's JSON-LD emitters.
 *
 * `parseHTMLToText` in @misiki/kitcommerce-core is currently `return html` (an identity
 * function), so descriptions handed to the vendored schema components keep their markup.
 * Clean text here, at the call site, before it reaches any schema.
 */
export const cleanSchemaText = (value: unknown): string =>
	String(value ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

/** Join an origin and a slug with exactly one `/` (origin has no trailing slash, slugs are bare). */
export const absoluteUrl = (origin: string, slug: unknown): string =>
	`${origin}/${String(slug ?? '').replace(/^\/+/, '')}`

/**
 * A picture's full address. Backends hand some pictures over as site-relative paths
 * ("/backend/media/…"), and Facebook, WhatsApp, X and Google read an image only from a full URL.
 * One that is already absolute is kept; one that cannot be parsed is dropped.
 */
export const mediaUrl = (origin: string, src: unknown): string => {
	const value = String(src ?? '').trim()
	if (!value) return ''
	try {
		return new URL(value, `${origin}/`).href
	} catch {
		return ''
	}
}

/** UN/CEFACT codes for the weight units a store can choose; schema.org reads unitCode. */
const WEIGHT_UNIT_CODES: Record<string, string> = { g: 'GRM', gm: 'GRM', gram: 'GRM', grams: 'GRM', kg: 'KGM', lb: 'LBR', lbs: 'LBR', oz: 'ONZ' }

/** A product's weight as a QuantitativeValue, or undefined when the unit is unknown: a bare
 *  number could be grams or kilograms, so it is not published at all. */
export const weightValue = (weight: unknown, unit: unknown) => {
	const value = Number(weight)
	const unitText = String(unit ?? '').trim()
	const unitCode = WEIGHT_UNIT_CODES[unitText.toLowerCase()]
	if (!(value > 0) || !unitCode) return undefined
	return { '@type': 'QuantitativeValue', value, unitCode, unitText }
}

/**
 * A BreadcrumbList from the store's home page, through a category trail, to the page itself.
 * Crumbs with no name or no address are dropped before numbering, so positions stay 1..n.
 */
export const breadcrumbList = (
	origin: string,
	homeName: string,
	trail: Array<{ name?: unknown; slug?: unknown }>,
	leaf?: { name: unknown; url: string }
) => {
	const crumbs = [
		{ name: cleanSchemaText(homeName) || 'Home', item: `${origin}/` },
		...trail.map((c) => ({ name: cleanSchemaText(c?.name), item: cleanSchemaText(c?.slug) ? absoluteUrl(origin, cleanSchemaText(c?.slug)) : '' })),
		...(leaf ? [{ name: cleanSchemaText(leaf.name), item: leaf.url }] : [])
	].filter((c) => c.name && c.item)
	if (crumbs.length < 2) return ''
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item }))
	}
}

/** schema.org ItemAvailability is an enumeration of URIs, not bare names. */
export const availabilityUrl = (stock: unknown): string =>
	Number(stock) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

/** Availability of a product or variant record, by the same rule as the Add to bag button. */
export const stockAvailabilityUrl = (source: Parameters<typeof isOutOfStock>[0]): string =>
	isOutOfStock(source)
		? 'https://schema.org/OutOfStock'
		: isBackorder(source)
			? 'https://schema.org/BackOrder'
			: 'https://schema.org/InStock'
