import { describe, expect, it } from 'vitest'
import { absoluteUrl, availabilityUrl, breadcrumbList, cleanSchemaText, compactSchema, mediaUrl, productGroupId, variantName, weightValue } from '../src/lib/components/seo/schema'

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

describe('mediaUrl', () => {
	it('gives a site-relative picture its full address and keeps an absolute one', () => {
		expect(mediaUrl('https://chillish.in', '/backend/media/a.png')).toBe('https://chillish.in/backend/media/a.png')
		expect(mediaUrl('https://chillish.in', 'https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
		expect(mediaUrl('https://chillish.in', '')).toBe('')
		expect(mediaUrl('https://chillish.in', undefined)).toBe('')
	})
})

describe('weightValue', () => {
	it('publishes a weight only with a known unit', () => {
		expect(weightValue(150, 'g')).toEqual({ '@type': 'QuantitativeValue', value: 150, unitCode: 'GRM', unitText: 'g' })
		expect(weightValue(2, 'KG')).toEqual({ '@type': 'QuantitativeValue', value: 2, unitCode: 'KGM', unitText: 'KG' })
		expect(weightValue(150, '')).toBeUndefined()
		expect(weightValue(0, 'g')).toBeUndefined()
	})
})

describe('breadcrumbList', () => {
	it('runs from the home page through the categories to the product', () => {
		const list = breadcrumbList(
			'https://chillish.in',
			'Home',
			[
				{ name: 'Keychains', slug: 'keychains' },
				{ name: '', slug: 'blank' },
				{ name: 'Naruto Keychains', slug: '/naruto-keychains' }
			],
			{ name: 'Kakashi keychain', url: 'https://chillish.in/products/kakashi' }
		)
		expect(list).toEqual({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://chillish.in/' },
				{ '@type': 'ListItem', position: 2, name: 'Keychains', item: 'https://chillish.in/keychains' },
				{ '@type': 'ListItem', position: 3, name: 'Naruto Keychains', item: 'https://chillish.in/naruto-keychains' },
				{ '@type': 'ListItem', position: 4, name: 'Kakashi keychain', item: 'https://chillish.in/products/kakashi' }
			]
		})
	})

	it('emits nothing when the home page would be the only crumb', () => {
		expect(breadcrumbList('https://chillish.in', 'Home', [])).toBe('')
	})
})

describe('productGroupId', () => {
	it("is never one variant's own SKU", () => {
		const variants = [{ sku: 'KURTA-BLACK-S' }, { sku: 'KURTA-BLACK-M' }]
		expect(productGroupId({ sku: 'KURTA-BLACK-S', slug: 'kurta', id: 7, variants })).toBe('kurta')
		expect(productGroupId({ sku: 'KURTA', slug: 'kurta', variants })).toBe('KURTA')
		expect(productGroupId({ groupedSku: 'GRP-1', sku: 'KURTA-BLACK-S', variants })).toBe('GRP-1')
		expect(productGroupId({ id: 7, variants })).toBe('7')
	})
})

describe('variantName', () => {
	it('puts the product name before the variant, once', () => {
		expect(variantName("Men's kurta set", 'Black / M')).toBe("Men's kurta set – Black / M")
		expect(variantName('Kurta', 'Kurta Black M')).toBe('Kurta Black M')
		expect(variantName('Kurta', '')).toBe('Kurta')
	})
})

describe('compactSchema', () => {
	it('leaves out the empty fields of a store that never filled in its details', () => {
		const organization = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			'@id': 'https://demo.shopnx.in/#organization',
			name: 'Demo',
			address: { '@type': 'PostalAddress', streetAddress: null, addressLocality: null, addressCountry: 'IN' },
			contactPoint: { '@type': 'ContactPoint', telephone: null, email: '' },
			legalName: undefined,
			sameAs: [],
			publisher: { '@id': 'https://demo.shopnx.in/#organization' },
			offers: { '@type': 'Offer', price: 0, availability: 'https://schema.org/InStock' }
		}
		expect(compactSchema(organization)).toEqual({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			'@id': 'https://demo.shopnx.in/#organization',
			name: 'Demo',
			address: { '@type': 'PostalAddress', addressCountry: 'IN' },
			publisher: { '@id': 'https://demo.shopnx.in/#organization' },
			offers: { '@type': 'Offer', price: 0, availability: 'https://schema.org/InStock' }
		})
	})

	it('is undefined when nothing is left', () => {
		expect(compactSchema({ '@context': 'https://schema.org', '@type': 'Thing', name: ' ' })).toBeUndefined()
	})
})
