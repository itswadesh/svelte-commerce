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

/** schema.org ItemAvailability is an enumeration of URIs, not bare names. */
export const availabilityUrl = (stock: unknown): string =>
	Number(stock) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
