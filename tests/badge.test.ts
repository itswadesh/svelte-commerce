import { describe, expect, it } from 'vitest'
import { productBadge } from '$lib/product/badge'

describe('productBadge', () => {
	it('takes the first tag, as words', () => {
		expect(productBadge({ productTags: 'new-arrival,cotton' }, 'first_tag')).toBe('New arrival')
		expect(productBadge({ tags: ['Hand block print', 'x'] }, 'first_tag')).toBe('Hand block print')
		expect(productBadge({ productTags: '', material: ['Gold'] }, 'first_tag')).toBe('Gold')
	})

	it("takes the merchant's own badge, and only that", () => {
		expect(productBadge({ metadata: { badge: ' Bestseller ' }, productTags: 'cotton' }, 'product_badge')).toBe('Bestseller')
		expect(productBadge({ metadata: { highlights: ['x'] }, productTags: 'cotton' }, 'product_badge')).toBe('')
		expect(productBadge({ metadata: { badge: 42 } }, 'product_badge')).toBe('')
		expect(productBadge({ metadata: null }, 'product_badge')).toBe('')
		expect(productBadge(null, 'product_badge')).toBe('')
	})

	it('takes the first highlight line', () => {
		expect(productBadge({ highlights: ['Oversized fit', 'Cotton'] }, 'first_highlight')).toBe('Oversized fit')
	})

	it('draws nothing without data, or when the store chose none', () => {
		expect(productBadge({}, 'first_tag')).toBe('')
		expect(productBadge({ highlights: [] }, 'first_highlight')).toBe('')
		expect(productBadge({ productTags: 'sale' }, 'none')).toBe('')
	})
})
