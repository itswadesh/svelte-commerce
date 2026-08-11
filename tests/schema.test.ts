import { describe, expect, it } from 'vitest'
import { absoluteUrl, availabilityUrl, cleanSchemaText } from '../src/lib/components/seo/schema'

// The escaping applied by src/lib/components/seo/structured-data.svelte before it interpolates
// serialized JSON into a script tag. Kept in sync with that one-liner.
const escapeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c')

describe('JSON-LD escaping', () => {
	it('cannot be broken out of with a closing script tag', () => {
		const payload = { description: 'nice ring </' + 'script><img src=x onerror=alert(1)>' }
		const escaped = escapeJsonLd(payload)

		expect(escaped.toLowerCase()).not.toContain('</' + 'script')
		expect(escaped).not.toContain('<')
		// Still valid JSON that round-trips to the original string.
		expect(JSON.parse(escaped)).toEqual(payload)
	})
})

describe('cleanSchemaText', () => {
	it('strips markup and collapses whitespace', () => {
		expect(cleanSchemaText('<p>Solid <b>gold</b><br/>  ring</p>')).toBe('Solid gold ring')
	})

	it('is null-safe', () => {
		expect(cleanSchemaText(undefined)).toBe('')
		expect(cleanSchemaText(null)).toBe('')
	})
})

describe('absoluteUrl', () => {
	it('inserts exactly one separator', () => {
		expect(absoluteUrl('https://example.com', 'pendant')).toBe('https://example.com/pendant')
		expect(absoluteUrl('https://example.com', '/pendant')).toBe('https://example.com/pendant')
	})
})

describe('availabilityUrl', () => {
	it('emits schema.org enumeration URIs, not bare names', () => {
		expect(availabilityUrl(3)).toBe('https://schema.org/InStock')
		expect(availabilityUrl(0)).toBe('https://schema.org/OutOfStock')
		expect(availabilityUrl(undefined)).toBe('https://schema.org/OutOfStock')
	})
})
