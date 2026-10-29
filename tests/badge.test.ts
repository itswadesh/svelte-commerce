import { describe, expect, it } from 'vitest'
import { productBadge } from '$lib/product/badge'

describe('productBadge', () => {
	it('takes the first tag, as words', () => {
		expect(productBadge({ productTags: 'new-arrival,cotton' }, 'first_tag')).toBe('New arrival')
		expect(productBadge({ tags: ['Hand block print', 'x'] }, 'first_tag')).toBe('Hand block print')
		expect(productBadge({ productTags: '', material: ['Gold'] }, 'first_tag')).toBe('Gold')
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
